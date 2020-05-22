updateCanvas(1280, 720); //SET GAME TO 720p
//cx.imageSmoothingEnabled = false;
var _DEBUG = true;
var tilemap = null;
var PLAYER_SPEED_MULT = 2;
var GAME_STYLE = "darkness";
var Ikimono = []
console.log('%c Ikimono: Init ', 'background: #fba; color: #342');
console.log('%cIkimono: Counting Creatures...', 'background: #fba; color: #342');




var Httpreq = new XMLHttpRequest();
Httpreq.open("GET", "ikimono.json5", false);
Httpreq.send(null);
Ikimono.creaturesJSONPATH = JSON5.parse(Httpreq.responseText);
Ikimono.countCreaturesj = Ikimono.creaturesJSONPATH.length;

Ikimono.creatures = {};
Ikimono.countCreatures = 0;
setTimeout(function () {
    for (var imonos in Ikimono.creaturesJSONPATH) {
        Ikimono.creatures[imonos] = Ikimono.creaturesJSONPATH[imonos];
        Ikimono.countCreatures++;
    }
    _goto();
}, 10)
//Ikimono.creaturesJSONPATH.forEach(function (creat) {



//     if (Ikimono.countCreatures == Ikimono.countCreaturesj) _goto();


//})


var MUSIC_BATTLE;

var loader = new Loader();
loader.use(glTiled['resource-loader'].tiledMiddlewareFactory());


loader.add('Ikimono', 'maps/Ikimono/Ikimono.json');
loader.load(loadMaps)
var bax = 0;
function loadMaps() {


    tilemap =
        new glTiled.GLTilemap(loader.resources.Ikimono.data, {
            gl: gl,
            assetCache: loader.resources,
        });
    tilemap.resizeViewport(gl.canvas.width / 4, gl.canvas.height / 4)
    let objectlayer = tilemap.desc.layers[tilemap.desc.layers.length - 1];

    objectlayer.objects.forEach(element => {
        if (element.type == "npc") {
        var npc = new NPC();
        npc._Posisition = new Vector(((element.x/16)*64), ((element.y/16)*64)-64);
        npc.ANIM = 
        npc.width = 96;
        npc.height = 96;
        bax = npc;
    }
    });


}
var UI_HEART_EMPTY = loadImageAndCreateTextureInfo("assets/logo/Ikimono.png");
var BG_TITLE = loadImageAndCreateTextureInfo("assets/logo/bg.jpg");
var GRASSTex = loadImageAndCreateTextureInfo("assets/grass.png");
var bg_offset = 0;
var lgscreen = null;
class TitlescreenLogo extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }
    Draw(dt) {

        drawImage(BG_TITLE.texture, -4 + bg_offset, -4, 1288, 728);
        drawImage(BG_TITLE.texture, -1288 + bg_offset, -4, 1288, 728);
        drawImage(UI_HEART_EMPTY.texture, 1280 / 2 - 256, 260 - (192 / 2) + (Math.sin(bg_offset / 50) * 5), 512, 192);
        bg_offset = (bg_offset + (100 * dt)) % 1280;



    }

}

class Level extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }
    PreDraw(dt) {
        tilemap.update(dt * 500)
        tilemap.draw(Camera.Posisition.x / 4, Camera.Posisition.y / 4);
    }
}
var BLOCKABLE_TILES = [
    68, 69, 70
]
var PASSABLE_TILES = [north = [], south = [], east = [], west = []];
PASSABLE_TILES.north = [4, 5, 6];
PASSABLE_TILES.east = [38, 6, 70];
PASSABLE_TILES.south = [];
PASSABLE_TILES.west = [4, 36];

var OPPESITES = [];
OPPESITES["north"] = "south";
OPPESITES["south"] = "north";
OPPESITES["east"] = "west";
OPPESITES["west"] = "east";

function CheckTile(tile, layer, direction) {
    tile = tilemap.layers[0].desc.data[tile] - 1;
    var activeTile = tilemap.layers[0].desc.data[player.GetTilePos()] - 1

    if (PASSABLE_TILES[OPPESITES[direction]].includes(tile)) return false;
    if (PASSABLE_TILES[direction].includes(activeTile)) return false;
    //  console.log("PASSED")
    if (PASSABLE_TILES[direction].includes(activeTile)) return false;


    if (BLOCKABLE_TILES.includes(tile)) return false;
    return true;
}

var entity_shadow = loadImageAndCreateTextureInfo("assets/shadow.png");
class Player extends Entity {
    constructor() {
        super()
        //this.DrawOverride = true; 
        function newS(p, cva = 4) {
            var frameData = new FrameData()
            frameData.Image = loadMultipleFrames("assets/characters/f/" + p + "$t.gif", cva, -1);
            frameData.FrameDelay = 5 * (fps / 60);
            return frameData;
        }

        this.FrameData["idle"] = newS("s", 1);

        this.FrameData["idle_north"] = newS("n", 1);
        this.FrameData["idle_south"] = newS("s", 1);
        this.FrameData["idle_west"] = newS("w", 1);
        this.FrameData["idle_east"] = newS("e", 1);

        this.FrameData["walk_north"] = newS("n", 4);
        this.FrameData["walk_south"] = newS("s", 4);
        this.FrameData["walk_west"] = newS("w", 4);
        this.FrameData["walk_east"] = newS("e", 4);



        this.Animation = "idle";
        this.Width = 96;
        this.Height = 96;
        this.Posisition = new Vector(-16, 24)
    }
    Health = 6;
    XSpeed = 0;
    YSpeed = 0;
    State = "idle";
    YDir = true;
    Direction = "south";
    XDir = true;
    Friction = -1;
    MaxSpeed = 200;
    OldTile = 0;
    keys = {
        forward: "w",
        left: "a",
        right: "d",
        reverse: "s",
        space: "space"
    }
    TilePos = 0;
    YTarget = 0;
    XTarget = 0;
    GetTileAt(layerIndex = 2) {
        var playerPosX = Math.floor(this.Posisition.x / 64) + 1
        var playerPosY = Math.floor(this.Posisition.y / 64) + 1
        var offada = (playerPosY * tilemap.desc.width) + playerPosX;
        return tilemap.layers[layerIndex].desc.data[offada];
    }
    GetTilePos() {
        var playerPosX = Math.floor(this.Posisition.x / 64) + 1
        var playerPosY = Math.floor(this.Posisition.y / 64) + 1
        return (playerPosY * tilemap.desc.width) + playerPosX;
    }
    get tilePos() {
        return this.GetTilePos();
    };
    TileUpdate() {
        if (this.GetTileAt(2) && Math.getRandomInt(1, 6) == 1) new Battle();

    }
    PreDraw(dt) {
        
        if (ACTIVE_BATTLE) return;
        KEYS[this.keys.forward] =     key_MOVEUP;   //KEYS[this.keys.forward] ||
        KEYS[this.keys.reverse] =     key_MOVEDOWN; //KEYS[this.keys.reverse] ||
        KEYS[this.keys.right] =       key_MOVERIGHT;//KEYS[this.keys.right]   || 
        KEYS[this.keys.left] =        key_MOVELEFT; //KEYS[this.keys.left]    ||

        key_MOVERIGHT   = false;
        key_MOVEUP      = false;
        key_MOVEDOWN    = false;
        key_MOVELEFT    = false;
        var orig = this.Animation;
        console.log(KEYS[this.keys.space]);
        
        if (KEYS[this.keys.space])
        console.log()

        if ((this.XTarget == 0 && this.YTarget == 0)) {
            var GetTilePos = player.GetTilePos()
            if (KEYS[this.keys.forward] && CheckTile(this.GetTilePos() - tilemap.desc.width, 1, "north"))
                this.YTarget = -64;
            else if (KEYS[this.keys.reverse] && CheckTile(this.GetTilePos() + tilemap.desc.width, 1, "south"))
                this.YTarget = 64;

            else if (KEYS[this.keys.right] && CheckTile(this.GetTilePos() + 1, 1, "east"))
                this.XTarget = 64;
            else if (KEYS[this.keys.left] && CheckTile(this.GetTilePos() - 1, 1, "west"))
                this.XTarget = -64;
        }
        var offset = 4;


        var Trigger = false;
        if (this.XTarget > 0) {

            this.Posisition.x = this.Posisition.x + offset;
            this.XTarget = Math.max(this.XTarget - offset, 0);
            this.State = "walk"
            this.Direction = "east";
            if (this.XTarget == 0) Trigger = true;
        } else if (this.XTarget < 0) {
            this.Posisition.x = this.Posisition.x - offset;
            this.XTarget = Math.min(this.XTarget + offset, 0);
            this.State = "walk";
            this.Direction = "west";
            if (this.XTarget == 0) Trigger = true;
        } else if (this.YTarget > 0) {
            this.Posisition.y = this.Posisition.y + offset;
            this.YTarget = this.YTarget - offset;
            this.State = "walk";
            this.Direction = "south";
            if (this.YTarget == 0) Trigger = true;
        } else if (this.YTarget < 0) {
            this.Posisition.y = this.Posisition.y - offset;
            this.YTarget = this.YTarget + offset;
            this.State = "walk";
            this.Direction = "north";
            if (this.YTarget == 0) Trigger = true;
        } else this.State = "idle";

        if (this.OldTile != this.GetTilePos() && Trigger) {
            this.TileUpdate();
            this.OldTile = this.GetTilePos();
        }

        this.Animation = (`${this.State}_${this.Direction}`);
        Camera.Posisition = Vector.add(player.Posisition, new Vector((-1280 / 2) + (this.Width / 2), (-720 / 2) + (this.Height / 2)));
        Camera.Posisition.x = Math.max(Camera.Posisition.x, 1280 / 2 - 256 - (64 * 6));
        Camera.Posisition.y = Math.max(Camera.Posisition.y, (720 / 2) - 384 + 24);
        if (this.Animation != orig) this.Frame = 0;




    }

    Pre_Draw() {

        drawImage(entity_shadow.texture, -Camera.Posisition.x + this.Posisition.x + 17, -Camera.Posisition.y + this.Posisition.y + 64, 64, 32);
    }

    PostDraw() {
        if (this.GetTileAt(2) && player.Posisition.y % 64 < 34) {
            var nx = Math.round((this.Posisition.x - (64 / 2)) / 64) * 64;
            var ny = Math.round((this.Posisition.y + (64 / 2)) / 64) * 64;
            drawImage(GRASSTex.texture, -Camera.Posisition.x + nx + 65, -Camera.Posisition.y + ny, 64, 64);

        }
      if (ACTIVE_BATTLE) 
          $(".o-pad").diss_a_pear();
      else
      $(".o-pad").hi_vis_vest();
    }
}
NPC_IMAGES = {
    Jeff: loadImageAndCreateTextureInfo("assets/characters/overworld/jeff.png")
}
class NPC extends Entity {
    constructor() {
        super()
        //this.DrawOverride = true; 

        this.Animation = "idle";
        this.Width = 96;
        this.Height = 96;
        this.Posisition = new Vector(-16, 24);
    }
    ANIM = "Jeff";
    GetTileAt(layerIndex = 2) {
        var playerPosX = Math.floor(this.Posisition.x / 64) + 1
        var playerPosY = Math.floor(this.Posisition.y / 64) + 1
        var offada = (playerPosY * tilemap.desc.width) + playerPosX;
        return tilemap.layers[layerIndex].desc.data[offada];
    }
    GetTilePos() {
        var playerPosX = Math.floor(this.Posisition.x / 64) + 1
        var playerPosY = Math.floor(this.Posisition.y / 64) + 1
        return (playerPosY * tilemap.desc.width) + playerPosX;
    }
    get tilePos() {
        return this.GetTilePos();
    };
    TileUpdate() {
        if (this.GetTileAt(2) && Math.getRandomInt(1, 6) == 1) new Battle();

    }
    Draw(dt) {
        
        drawImage(NPC_IMAGES.Jeff.texture, -Camera.Posisition.x + this.Posisition.x, -Camera.Posisition.y + this.Posisition.y, 96,96);
       
    }

    Pre_Draw() {
        drawImage(entity_shadow.texture, -Camera.Posisition.x + this.Posisition.x + 17, -Camera.Posisition.y + this.Posisition.y + 64, 64, 32);
    }

    PostDraw() {
        if (this.GetTileAt(2) && this.Posisition.y % 64 < 34) {
            var nx = Math.round((this.Posisition.x - (64 / 2)) / 64) * 64;
            var ny = Math.round((this.Posisition.y + (64 / 2)) / 64) * 64;
            drawImage(GRASSTex.texture, -Camera.Posisition.x + nx + 65, -Camera.Posisition.y + ny, 64, 64);

        }

    }
}

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};
var randomKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};
var BATTLE = loadImageAndCreateTextureInfo("assets/battle/grassland.png");
var BATTLE_GRASS_BASE = loadImageAndCreateTextureInfo("assets/battle/grassland_base.png");
var BANNER = loadImageAndCreateTextureInfo("assets/battle/banner.png");
var BOX = loadImageAndCreateTextureInfo("assets/battle/SelectionBox.png");
var HPBOX_PLAYER = loadImageAndCreateTextureInfo("assets/battle/hpbox_player.png");
var HPBOX_ENEMY = loadImageAndCreateTextureInfo("assets/battle/hpbox_enemy.png");
var HPBAR = {
    low: loadImageAndCreateTextureInfo("assets/battle/HP_LOW.png"),
    med: loadImageAndCreateTextureInfo("assets/battle/HP_MED.png"),
    high: loadImageAndCreateTextureInfo("assets/battle/HP_HIGH.png"),
}
var statuseffect = loadImageAndCreateTextureInfo("assets/battle/statuseffect.png");
var statuseffectmask = loadImageAndCreateTextureInfo("assets/battle/statuseffectmask.png");

var FRONT_FACING_SPRITES = loadImageAndCreateTextureInfo("assets/FRONT.png");
var BACK_FACING_SPRITES = loadImageAndCreateTextureInfo("assets/BACK.png");
var GENDER = loadImageAndCreateTextureInfo("assets/Gender.gif");
PARTY = [];
PARTY.CREATURES = [];
PARTY.Selected = 0
PARTY.active = function () {
    return this.CREATURES[this.Selected]
}
class Creature {
    constructor(Species, level, p) {
        this.Species = Species;
        this.Level = level || 1;
        this.Shiny = false;
        this.Moves = ["Quick Attack", "Dive", "Bite"];
        this.Pattern = p || null;
        
        this.EV = {
            HP: 0,
            Attack: 0,
            Defense: 0,
            SpecialAttack: 0,
            SpecialDefense: 0,
            Speed: 0,
        }
        this.IV = {
            HP: Math.getRandomInt(0b0000, 0b1111),
            Attack: Math.getRandomInt(0b0000, 0b1111),
            Defense: Math.getRandomInt(0b0000, 0b1111),
            SpecialAttack: Math.getRandomInt(0b0000, 0b1111),
            SpecialDefense: Math.getRandomInt(0b0000, 0b1111),
            Speed: Math.getRandomInt(0b0000, 0b1111),
        }

        this.HP = this.maxHP;
        if (this.data.Gender == 0 && this.data.Gender == 254 && this.data.Gender == 255)
        this.Gender = {0: 2, 254: 1, 255: 0}[this.data.Gender]
        else
        this.Gender = Math.getRandomInt(0,255) < this.data.Gender ? 1 : 2;
        console.log(this.data.Gender)
    }
    get Number() {
        return this.data.Number - 1
    }
    getBaseStat(n) {
        return this.data["Base " + n]
    }
    get data() {
        return Ikimono.creatures[this.Species]
    }
    get maxHP() {
        var I = (this.IV.HP); // TO IMPLEMENT
        var E = (this.EV.HP / 3); // TO IMPLEMENT

        return Math.floor((3 * this.getBaseStat("HP") + I + E) * this.Level / 80 + this.Level + 9)
    }
    get Speed() {
        return this.getBaseStat("HP")
    }
    getPowerDamage(p, attacker) {
        var d = (this.getBaseStat("Attack") / this.getBaseStat("Defense"));

        var n = (2 * attacker.Level * 0.2) + 2;

        return (n * d * p) / 50 + 2
    }
    applyDamage(x, attacker) {
        var Damage = this.getPowerDamage(x.Power, attacker);
        var type2 = this.data.Type2 == "NONE" ? null : TYPE_MASK[this.data.Type2]

        var modify = GetTypeMultiplier(x.Type, TYPE_MASK[this.data.Type])

        var STAB = attacker.data.Type == x.Type || attacker.data.Type == x.Type2 ? 1.25 : 1;

  
        this.HP = Math.max(this.HP-Math.floor(Damage * STAB * modify),0)
    }
}






function _goto() {
    console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342', Ikimono.countCreatures);
    lgscreen = new TitlescreenLogo();

    var Starter = new Creature("Herabour", 5);
    PARTY.CREATURES.push(Starter);

    setTimeout(playGame, 300)
    setTimeout(function () {
        new Battle()
    }, 40)

}

function RENDER_CHILD() {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


}
var textCanvas = document.getElementById("text");
var ctx = textCanvas.getContext("2d");

var game = null;
var player = null;
var canvas2 = document.getElementById('text');

function playGame() {
    if (lgscreen) {
        lgscreen.delete();
        lgscreen = null;
        game = new Level();
        player = new Player();
        player.Posisition.x += 64 * 37;
        player.Posisition.y += 64 * 27;
    };
}
//canvas2.addEventListener('click', )

var _isFirstClick = false;




var audio = {
    battle_click: new Audio("assets/audio/menu/menu_get.ogg"),
}
var music = {
    battle_wild: new Audio("assets/music/battle.ogg"),
    battle_trainer: new Audio("assets/music/battle_trainer.ogg"),
    town: new Audio("assets/music/town.ogg"),
    fanfare: new Audio("assets/audio/sfx/fanfare.ogg"),
}


function playMusic(c) {
    for (var a in music) {
        music[a].currentTime = 0;
        music[a].pause();
    }
    c.play();
}

for (var a in music) music[a].volume = 0.04;

for (var a in audio) audio[a].volume = 0.1;






canvas2.addEventListener('click', function () {
    if (_isFirstClick) return;
    _isFirstClick = true;
    //document.documentElement.requestFullscreen();

    //playMusic(music.battle_trainer);



})
var lastTime = 0;

canvas2.addEventListener('click', function () {
    isPress = true;
    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;


})