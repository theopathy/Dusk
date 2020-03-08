updateCanvas(1280, 720); //SET GAME TO 720p
//cx.imageSmoothingEnabled = false;
var _DEBUG = true; var tilemap = null;
var GAME_STYLE = "darkness";
var Ikimono = []
console.log('%c Ikimono: Init ', 'background: #fba; color: #342');
console.log('%cIkimono: Counting Creatures...', 'background: #fba; color: #342');



var Httpreq = new XMLHttpRequest();
Httpreq.open("GET", _DEBUG ? "creatures/fake-compile.txt" : "creatures/compile.php", false);
Httpreq.send(null);
Ikimono.creaturesJSONPATH = JSON.parse(Httpreq.responseText);
Ikimono.countCreaturesj = Ikimono.creaturesJSONPATH.length;
Ikimono.creatures = [];
Ikimono.countCreatures = 0;
Ikimono.creaturesJSONPATH.forEach(function (creat) {

    fetch("creatures/" + creat)
        .then(res => { return res.text(); })
        .then(data => {
            var imonos = JSON5.parse(data);
            Ikimono.creatures[imonos.Name] = imonos;
            Ikimono.creatures[imonos.Name].frontImage = loadImageAndCreateTextureInfo(`assets/ikimonos/${imonos.Name}/front.png`)
            Ikimono.creatures[imonos.Name].backImage = loadImageAndCreateTextureInfo(`assets/ikimonos/${imonos.Name}/back.png`)

            Ikimono.creatures[imonos.Name].frontImageShiny = loadImageAndCreateTextureInfo(`assets/ikimonos/${imonos.Name}-shiny/front.png`)
            Ikimono.creatures[imonos.Name].backImageShiny = loadImageAndCreateTextureInfo(`assets/ikimonos/${imonos.Name}-shiny/back.png`)
            Ikimono.countCreatures++;
            if (Ikimono.countCreatures == Ikimono.countCreaturesj) _goto();
        });

})



var MUSIC_BATTLE;

var loader = new Loader();
loader.use(glTiled['resource-loader'].tiledMiddlewareFactory());


loader.add('Ikimono', 'maps/Ikimono/Ikimono.json');
loader.load(loadMaps)

function loadMaps() {


    tilemap =
        new glTiled.GLTilemap(loader.resources.Ikimono.data, {
            gl: gl,
            assetCache: loader.resources,
        });
    tilemap.resizeViewport(gl.canvas.width / 4, gl.canvas.height / 4)

}
var UI_HEART_EMPTY = loadImageAndCreateTextureInfo("assets/logo/Ikimono.png");
var BG_TITLE = loadImageAndCreateTextureInfo("assets/logo/bg.jpg");
var GRASS = loadImageAndCreateTextureInfo("assets/grass.png");
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

        // update animations, if your map has no animated tiles
        // you can skip this step.

    }

}

class Level extends Entity {
    constructor() {
        super()
        //this.DrawOverride = true;

    }


    Draw(dt) {






        tilemap.update(13)
        tilemap.draw(Camera.Posisition.x / 4, Camera.Posisition.y / 4);
    }




}
var BLOCKABLE_TILES =
    [
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
    GrassTilePos = 0;
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
    get tilePos() { return this.GetTilePos(); };
    TileUpdate() {
           if (this.GetTileAt(2) && Math.getRandomInt(1,6)==1) lgscreen = new Battle();

    }
    PreDraw(dt) {
        var orig = this.Animation;
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
        if (this.XTarget > 0) {

            this.Posisition.x = this.Posisition.x + offset;
            this.XTarget = Math.max(this.XTarget - offset, 0);
            this.State = "walk"
            this.Direction = "east";
        }
        else if (this.XTarget < 0) {
            this.Posisition.x = this.Posisition.x - offset;
            this.XTarget = Math.min(this.XTarget + offset, 0);
            this.State = "walk";
            this.Direction = "west";
        }
        else if (this.YTarget > 0) {
            this.Posisition.y = this.Posisition.y + offset;
            this.YTarget = this.YTarget - offset;
            this.State = "walk";
            this.Direction = "south";
        }
        else if (this.YTarget < 0) {
            this.Posisition.y = this.Posisition.y - offset;
            this.YTarget = this.YTarget + offset;
            this.State = "walk";
            this.Direction = "north";
        }
        else this.State = "idle";

        // else if (this.XTarget == 0) player.Posisition.x = Math.round(player.Posisition.x / 64 )*64;
        //       var speedGain = 1200;
        //       if (KEYS[this.keys.forward] ? !KEYS[this.keys.reverse] : KEYS[this.keys.reverse]){ //XOR
        //           this.YSpeed = Math.min(this.MaxSpeed, (this.YSpeed + 1) ** 3.7);
        //           this.YDir  = KEYS[this.keys.reverse];  }
        //         
        //       else
        //           this.YSpeed = Math.max(0,(this.YSpeed*this.Friction)-1);
        //           
        //       if (KEYS[this.keys.right] ? !KEYS[this.keys.left] : KEYS[this.keys.left]){ //XOR 
        //           this.XSpeed = Math.min(this.MaxSpeed, ((this.XSpeed + 1) ** 3.7));
        //           this.XDir  = KEYS[this.keys.right];
        //       }
        //       else
        //       this.XSpeed = Math.max(0,(this.XSpeed*this.Friction)-1);
        //       this.Posisition = new Vector(
        //           this.Posisition.x + (this.XSpeed * dt) * (this.XDir ? 1 : -1),
        //           this.Posisition.y + (this.YSpeed * dt)  * (this.YDir ? 1 : -1));
        //
        //       
        //       if (this.XSpeed > 0 || this.YSpeed) {
        //           //this.Animation = "walk"
        //       } else {}  //this.Animation = "idle";
        //      // Camera.Posisition = this.Posisition;


        // if (this.YSpeed > 0 ) 
        //     this.Direction = !this.YDir ? "north" : "south";
        // if (this.XSpeed > 0 ) 
        //     this.Direction = !this.XDir ? "west" : "east";

        // if ( this.XSpeed > 0 ||  this.YSpeed > 0) this.State="walk";
        // else this.State = "idle";
        this.Animation = (`${this.State}_${this.Direction}`);
        Camera.Posisition = Vector.add(player.Posisition, new Vector((-1280 / 2) + (this.Width / 2), (-720 / 2) + (this.Height / 2)));
        Camera.Posisition.x = Math.max(Camera.Posisition.x, 1280 / 2 - 256 - (64 * 6));
        Camera.Posisition.y = Math.max(Camera.Posisition.y, (720 / 2) - 384 + 24);
        if (this.Animation != orig) this.Frame = 0;


        if (this.OldTile != this.GetTilePos()) { this.TileUpdate(); this.OldTile = this.GetTilePos(); }

    }

    Pre_Draw() {

        drawImage(entity_shadow.texture, -Camera.Posisition.x + this.Posisition.x + 17, -Camera.Posisition.y + this.Posisition.y + 64, 64, 32);
    }

    PostDraw() {
        if (this.GetTileAt(2) && player.Posisition.y % 64 < 34) {
            var nx = Math.round((this.Posisition.x - (64 / 2)) / 64) * 64;
            var ny = Math.round((this.Posisition.y + (64 / 2)) / 64) * 64;
            drawImage(GRASS.texture, -Camera.Posisition.x + nx + 65, -Camera.Posisition.y + ny, 64, 64);

        }

    }
}



var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
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


PARTY = [];
class Creature {

}

var Starter = new Creature();
PARTY.push();

function DrawOverlayedText(text, x, y) {
    ctx.fillStyle = "#707070";
    ctx.fillText(text, x + 2, y + 2);
    ctx.fillStyle = "#404040";
    ctx.fillText(text, x, y);
}
var emptyXY = { x: 0, y: 0 }; // instead of creating one every frame cache it instead.
function DrawBoxClick(text, x, y, width, height, textoffset, f,n) {
    ctx.fillStyle = "#707070";
    textoffset = textoffset || emptyXY;
    ctx.fillText(text, x + 2 + textoffset.x, y + 2 + textoffset.y);
    ctx.fillStyle = "#404040";
    if (Mouse.x > x && Mouse.x < x + width && Mouse.y > y - 32 && Mouse.y < y + height)
       {
           ctx.fillStyle = "#020";
           if (isPress) {f(n); audio.battle_click.play();isPress=false;}
        }

    ctx.fillText(text, x + textoffset.x, y + textoffset.y);
}
function DrawBoxClickTextWidth(text, x, y, height, f,n) {
    ctx.fillStyle = "#707070";
    textoffset = textoffset || emptyXY;
    ctx.fillText(text, x + 2 + textoffset.x, y + 2 + textoffset.y);
    ctx.fillStyle = "#404040";
    let xw = ctx.measureText(text).width;
    if (Mouse.x > x && Mouse.x < x +  xw && Mouse.y > y - 32 && Mouse.y < y + height)
       { 
           ctx.fillStyle = "#020";
           if (isPress) {f(n); audio.battle_click.play();}
        }

    ctx.fillText(text, x + textoffset.x, y + textoffset.y);
}
var ACTIVE_BATTLE = null;
class Battle extends Entity {
    Player = "Purrlit";
    Attacker = "";
    constructor() {
        super()
        this.DrawOverride = true;
        this.Attacker = randomProperty(Ikimono.creatures);
        this.AttackerShiny = Math.getRandomInt(1, 8192 / 8) == 1
        this.BattleText = `A random ${this.Attacker.Name}\nhas appeared!`;
        ACTIVE_BATTLE = this;
        this.TextOffset = { x: 0, y: 44 }
    }

    BounceIkimono = 0;
    Transition_State = 0;
    Transtion_Value = 0;

    CurrentTextLines = [];
    CurrentBattleText = "";

    NextTimeEvent = 0;
    CurrentState = 0;
    PreDraw() {
        if (this.CurrentState == 1) {
        DrawBoxClick("ATTACK",   600,   600,    180,    100,    this.TextOffset,    function(n) {n.CurrentState = 2},this); 
        DrawBoxClick("ITEMS",    790,   600,    120,    100,    this.TextOffset,    () => alert("ITEMS  / NOT IMPLEMENTED")); 
        DrawBoxClick("SWITCH",   960,   600,    160,    100,    this.TextOffset,    () => alert("SWITCH / NOT IMPLEMENTED")); 
        DrawBoxClick("FLEE",     1150,  600,    160,    100,    this.TextOffset,   function(n) {ACTIVE_BATTLE.delete()} ); 
    }

    if (this.CurrentState == 2) {
        DrawBoxClickTextWidth("TACKLE",         600,   600,         50,   function(n) {n.CurrentState = 2},this); 
        DrawBoxClickTextWidth("QUICK ATTACK",    950,   600,        50,  () => alert("ITEMS  / NOT IMPLEMENTED")); 
        DrawBoxClickTextWidth("BIG FUCKING ",   600,   654,         50,    function(n) {n.CurrentState = 2},this); 
        DrawBoxClickTextWidth("DRAGON BREATH",    950,   654,       50,   () => alert("ITEMS  / NOT IMPLEMENTED")); 
    }
    } 


    Draw(dt) {
        
        this.Transtion_Value = Math.min(this.Transtion_Value + (0.019 * dt * 60), 1)
        if (this.Transtion_Value == 1 && this.CurrentState == 0) this.CurrentState = 1;
       
        ctx.font = "24px  'Press Start 2P'"
        ctx.fillStyle = "white";
        if (this.NextTimeEvent < CurrentTime) {
            this.CurrentBattleText += this.BattleText.charAt(this.CurrentBattleText.length);
            if (this.BattleText.charAt(this.CurrentBattleText.length) != " ")
                this.NextTimeEvent = CurrentTime + 0.04;
            this.CurrentTextLines = this.CurrentBattleText.split('\n');
        }
        for (var i = 0; i < this.CurrentTextLines.length; i++)
            ctx.fillText(this.CurrentTextLines[i], 32, 605 + (i * 32));

    }
    PostDraw(dt) {
        var _b = (Math.sin(this.BounceIkimono) * 3);
        drawImage(BATTLE.texture, -8, -178, 1288, 728);
        this.BounceIkimono = ((5 * DT) + this.BounceIkimono) % 360;

        drawImage(BATTLE_GRASS_BASE.texture, lerp(-725, 675, this.Transtion_Value), 280, 128 * 4, 32 * 4)

        drawImage(this.AttackerShiny ? Ikimono.creatures[this.Attacker.Name].frontImageShiny.texture : Ikimono.creatures[this.Attacker.Name].frontImage.texture, lerp(-700, 750, this.Transtion_Value), -10, 400, 400);

        drawImage(BATTLE_GRASS_BASE.texture, lerp(1284, 0, this.Transtion_Value), 500, 128 * 5, 32 * 5)
        drawImage(Ikimono.creatures["Salaslam"].backImage.texture, lerp(1280, -4, this.Transtion_Value), 105 + _b + 10, 122 * 5, 89 * 5);

        drawImage(BANNER.texture, -8, 550, 1288, 170);
        drawImage(BOX.texture, 1280 - (180 * 4), 720 - (170), 180 * 4, 170);

        //PLAYER BOX
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        DrawOverlayedText("UNDEFINED", 1280 - (104 * 4.5) + 50, 720 - (37 * 4.5) - 128 - _b)

        // ctx.fillText("UNDEFINED", 1280-(104*4.5) + 48, 720 - (37*4.5) - 130 - _b); 
        var maxhp = 22;
        var hp = 11;
        var p = hp / maxhp;
        var selectTexture = HPBAR.low;
        if (p > 0.5) selectTexture = HPBAR.high;
        else if (p > 0.25) selectTexture = HPBAR.med;
        DrawOverlayedText("Lv" + 2, 1280 - 145, 720 - (37 * 4.5) - 130 - _b);
        DrawOverlayedText(hp + "/" + maxhp, 1280 - 220, 720 - (37 * 4.5) - 55 - _b);
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        drawImage(selectTexture.texture, 1280 - (104 * 4.5) + 206, 720 - 270 - _b - 0.1, 216 * p, 3.05 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        //ENEMY BOX
        drawImage(HPBOX_ENEMY.texture, 30, 30, 104 * 4.5, 37 * 4.5);

        DrawOverlayedText(this.Attacker.Name, 60, 80);
        DrawOverlayedText("Lv" + 2, 310, 80);



    }
}



function _goto() {
    console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342', Ikimono.countCreatures);
    lgscreen = new TitlescreenLogo();
}

function RENDER_CHILD() {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


}
var textCanvas = document.getElementById("text");
var ctx = textCanvas.getContext("2d");

var game = null; var player = null;
var canvas2 = document.getElementById('text');

function playGame() {
  if (lgscreen) { lgscreen.delete(); lgscreen = null; game = new Level(); player = new Player(); player.Posisition.x += 64 * 37; player.Posisition.y += 64 * 27; }; 
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
}
for (var a in music) music[a].volume = 0.08;

canvas2.addEventListener('click', function () {
    if (_isFirstClick) return;

    _isFirstClick = true;

    //music.town.play();
    console.log("LOADED MUSIC")

})
var lastTime = 0;

canvas2.addEventListener('click', function () {
    isPress = true;
})
