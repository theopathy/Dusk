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
    get tilePos() { return this.GetTilePos(); };
    TileUpdate() {
           if (this.GetTileAt(2) && Math.getRandomInt(1,6)==1) new Battle();

    }
    PreDraw(dt) {
        
        if (ACTIVE_BATTLE) return;
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

    
        var Trigger = false;
        if (this.XTarget > 0) {

            this.Posisition.x = this.Posisition.x + offset;
            this.XTarget = Math.max(this.XTarget - offset, 0);
            this.State = "walk"
            this.Direction = "east";
            if (this.XTarget==0) Trigger = true;
        }
        else if (this.XTarget < 0) {
            this.Posisition.x = this.Posisition.x - offset;
            this.XTarget = Math.min(this.XTarget + offset, 0);
            this.State = "walk";
            this.Direction = "west";
            if (this.XTarget==0) Trigger = true;
        }
        else if (this.YTarget > 0) {
            this.Posisition.y = this.Posisition.y + offset;
            this.YTarget = this.YTarget - offset;
            this.State = "walk";
            this.Direction = "south";
            if (this.YTarget==0) Trigger = true;
        }
        else if (this.YTarget < 0) {
            this.Posisition.y = this.Posisition.y - offset;
            this.YTarget = this.YTarget + offset;
            this.State = "walk";
            this.Direction = "north";
            if (this.YTarget==0) Trigger = true;
        }
        else this.State = "idle";
 
        if (this.OldTile != this.GetTilePos() && Trigger) { this.TileUpdate(); this.OldTile = this.GetTilePos(); }
        

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


PARTY = [];
PARTY.CREATURES = [];
PARTY.Selected = 0
PARTY.active = function() {return this.CREATURES[this.Selected]}
class Creature {
    constructor(Species,level) {
        this.Species = Species;
        this.Level = level || 1;
        this.HP = this.maxHP;
        this.Moves = ["Quick Attack","Dive"];
    }
    getBaseStat(n) {
        return this.data["Base "+n]
    }
    get data() {
        return Ikimono.creatures[this.Species]
    }
    get maxHP() {
        var I = 0; // TO IMPLEMENT
        var E = 0; // TO IMPLEMENT
       return Math.floor((2 * this.getBaseStat("HP") + I + E) * this.Level / 100 + this.Level + 10)
    }

    getPowerDamage(p,attacker) {
        var d = (this.getBaseStat("Attack")/this.getBaseStat("Defense"));

        var n = (2*attacker.Level*0.2)+2;
         
        return (n * d * p)/50 + 2
    }
    applyDamage(x,attacker) {
        var Damage = this.getPowerDamage(x.Power,attacker);
        var type2 = this.data.Type2 == "NONE" ? null: TYPE_MASK[this.data.Type2]

        var modify = GetTypeMultiplier(x.Type,TYPE_MASK[this.data.Type])
        console.log (attacker)
        var STAB = attacker.data.Type == x.Type || attacker.data.Type == x.Type2 ? 1.25 : 1;
       
        this.HP -= Math.floor(Damage * STAB * modify);
    }
} 



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
  
    ctx.fillStyle = "#404040";
    let xw = ctx.measureText(text).width;
    var c = Mouse.y - 5
    if (Mouse.x > x && Mouse.x < x +  xw && c > y - 32 && c < y + height)
       { 
           ctx.fillStyle = "#020";
           if (isPress) {f(n); audio.battle_click.play();  isPress = false;}
        }

    ctx.fillText(text, x , y );
    ctx.fillStyle = "#404040";
}
var ACTIVE_BATTLE = null;
class Battle extends Entity {
    Player = "Purrlit";

    constructor() {
        super()
        this.DrawOverride = true;
        console.log()
        this.Party = [];
        this.Party.push(new Creature(randomKey(Ikimono.creatures),Math.getRandomInt(1,9)));
        this.AttackerShiny = Math.getRandomInt(1, 8192) == 1024

        this.BattleText = `A random ${this.Attacker.Species}\nhas appeared!`;
        ACTIVE_BATTLE = this;
        this.TextOffset = { x: 0, y: 44 }
        playMusic(music.battle_wild);


    }

    BounceIkimono = 0;
    Transition_State = 0;
    Transtion_Value = 0;

    MoveBuffer;

    get Attacker() {
       return this.Party[0]; // TO IMPLEMENT
    }
    AnimationTick = 0;
    DelayBetweenAttacks = 0;
    AnimationPlaying = "";
    
    AnimationIsPlayerAttacking = true;

    CurrentTextLines = [];
    CurrentBattleText = "";
    AttackPhase = 0; 
    NextTimeEvent = 0;
    CurrentState = 0;
    DealingWithDeath = 0;
    PreDraw() {
        ctx.font = "24px  'Press Start 2P'"
        if (this.CurrentState == 1) {
        DrawBoxClick("ATTACK",   600,   600,    180,    50,    this.TextOffset,    function(n) {n.CurrentState = 2},this); 
        DrawBoxClick("ITEMS",    790,   600,    120,    50,    this.TextOffset,    () => alert("ITEMS  / NOT IMPLEMENTED")); 
        DrawBoxClick("SWITCH",   960,   600,    160,    50,    this.TextOffset,    () => alert("SWITCH / NOT IMPLEMENTED")); 
        DrawBoxClick("FLEE",     1150,  600,    160,    50,    this.TextOffset,   function(n) {ACTIVE_BATTLE.delete(); ACTIVE_BATTLE = null; playMusic(music.town);} ); 
    }

    if (this.CurrentState == 2 && this.AttackPhase == 0) {
        DrawBoxClickTextWidth(PARTY.active().Moves[0],         600,    620,         20,   function(n) {n.MoveBuffer = PARTY.active().Moves[0]; n.AttackPhase = 1;},this); 
      
        if (PARTY.active().Moves[1]) 
          DrawBoxClickTextWidth(PARTY.active().Moves[1],         950,    620,         20,   function(n) {n.MoveBuffer = PARTY.active().Moves[1]; n.AttackPhase = 1;},this); 
        ///DrawBoxClickTextWidth("QUICK ATTACK",    950,    620,        20,  () => alert("ITEMS  / NOT IMPLEMENTED")); 
        ///DrawBoxClickTextWidth("BIG FUCKING ",   600,    684,         20,    function(n) {n.CurrentState = 2},this); 
        ///DrawBoxClickTextWidth("DRAGON BREATH",    950,    684,       20,   () => alert("ITEMS  / NOT IMPLEMENTED")); 

        ctx.font = "16px  'Press Start 2P'"
        ctx.fillText("NORMAL", 600,    640);
        if (isPress) this.CurrentState = 1;
    }

    if (this.Attacker.HP <= 0 && this.DealingWithDeath == 0 ) {playMusic(music.fanfare); this.DealingWithDeath = 1; this.AttackPhase = 3};

    if (this.MoveBuffer && (this.AttackPhase == 1 || this.AttackPhase == 2 ) &&  this.AnimationTick == 0 ) {
        
        
        var enemySpeed = 3;
        var playerSpeed = 5;
        var isFirst = !(enemySpeed < playerSpeed)


    
        this.AnimationIsPlayerAttacking = this.AttackPhase == 1 ? isFirst : !isFirst ;
        this.AnimationPlaying = this.AnimationIsPlayerAttacking ? this.Attacker.Moves[1] : this.MoveBuffer;
       

        
        //this.DelayBetweenAttacks = Math.max(DelayBetweenAttacks - 1,0)
       
   


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

        var offsetsDraw = {
            attacker: {
                x: 0,
                y: 0,
            },
            defender: {
                x: 0,
                y: 0,
            }
        }


        if (this.AnimationPlaying != "") {
            this.AnimationTick++;
            if (this.AnimationTick > ANIMATION[this.AnimationPlaying].Duration) {
                this.AnimationPlaying = "";
                this.AnimationTick = 0;
                if (this.AttackPhase == 1 ) this.AttackPhase = 2;
                else this.AttackPhase=0;
            }

            else {
            offsetsDraw = ANIMATION[this.AnimationPlaying].tick(offsetsDraw,this.AnimationTick, this.AnimationIsPlayerAttacking ? PARTY.active() : this.Attacker, !(this.AnimationIsPlayerAttacking) ? PARTY.active() : this.Attacker,);
            if (this.AnimationIsPlayerAttacking) {
               // var attackingvalue = offsetsDraw.attacker;
                //offsetsDraw.attacker = offsetsDraw.defender;
                //offsetsDraw.defender = attackingvalue;
                offsetsDraw.attacker = [offsetsDraw.defender,offsetsDraw.defender=offsetsDraw.attacker][0]; // swap values
                offsetsDraw.defender.x *= -0.5
            }
          
        }
        }


        var _b = (Math.sin(this.BounceIkimono) * 3);
        drawImage(BATTLE.texture, -8, -178, 1288, 728);
        this.BounceIkimono = ((5 * DT) + this.BounceIkimono) % 360;

        drawImage(BATTLE_GRASS_BASE.texture, lerp(-725, 675, this.Transtion_Value), 280, 128 * 4, 32 * 4)

        
        drawImage(this.Attacker.data["frontImage"+(this.AttackerShiny ? "Shiny" : "")].texture, lerp(-700, 750, this.Transtion_Value) + offsetsDraw.defender.x, -10+ offsetsDraw.defender.y, 400, 400);
        const m4 = twgl.m4;
        var _mask = true;



        drawImage(BATTLE_GRASS_BASE.texture, lerp(1284, 0, this.Transtion_Value), 500, 128 * 5, 32 * 5)
        drawImage(PARTY.active().data.backImage.texture, lerp(1280, -4, this.Transtion_Value)+ offsetsDraw.attacker.x, 105 + _b + 10 + offsetsDraw.attacker.y, 122 * 5, 89 * 5);
        if (this.AnimationPlaying != ""  && ANIMATION[this.AnimationPlaying].PostTick)
        ANIMATION[this.AnimationPlaying].PostTick(offsetsDraw,this.AnimationTick, this.AnimationIsPlayerAttacking ? PARTY.active() : this.Attacker, !(this.AnimationIsPlayerAttacking) ? PARTY.active() : this.Attacker,);


        drawImage(BANNER.texture, -8, 550, 1288, 170);
        drawImage(BOX.texture, 1280 - (180 * 4), 720 - (170), 180 * 4, 170);

        //PLAYER BOX
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        DrawOverlayedText(PARTY.active().nickname || PARTY.active().Species , 1280 - (104 * 4.5) + 50, 720 - (37 * 4.5) - 128 - _b)

        // ctx.fillText("UNDEFINED", 1280-(104*4.5) + 48, 720 - (37*4.5) - 130 - _b); 
        var maxhp = PARTY.active().maxHP;
        var hp = PARTY.active().HP;
        var p = hp / maxhp;
        var selectTexture = HPBAR.low;
        if (p > 0.5) selectTexture = HPBAR.high;
        else if (p > 0.25) selectTexture = HPBAR.med;
        DrawOverlayedText("Lv" + PARTY.active().Level, 1280 - 145, 720 - (37 * 4.5) - 130 - _b);
        DrawOverlayedText(hp + "/" + maxhp, 1280 - 220, 720 - (37 * 4.5) - 55 - _b);
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        drawImage(selectTexture.texture, 1280 - (104 * 4.5) + 206, 720 - 270 - _b - 0.1, 216 * p, 3.05 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        //ENEMY BOX
        drawImage(HPBOX_ENEMY.texture, 30, 30, 104 * 4.5, 37 * 4.5);

        maxhp = this.Attacker.maxHP;
        hp = this.Attacker.HP;
        p = hp / maxhp;
        selectTexture = HPBAR.low;
        if (p > 0.5) selectTexture = HPBAR.high;
        else if (p > 0.25) selectTexture = HPBAR.med;
        drawImage(selectTexture.texture, 213, 128, 224 * p, 17);
        DrawOverlayedText(this.Attacker.Species, 60, 80);
        DrawOverlayedText("Lv" + this.Attacker.Level, 310, 80);
         


    }
}



function _goto() {
    console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342', Ikimono.countCreatures);
    lgscreen = new TitlescreenLogo();

    var Starter = new Creature("Mawkeet",5);
    PARTY.CREATURES.push(Starter);

    setTimeout(playGame,300)
    setTimeout(function() {new Battle()},400)

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
    fanfare: new Audio("assets/audio/sfx/fanfare.ogg"),
}


function playMusic(c) {
    for (var a in music) { music[a].currentTime = 0; music[a].pause();}
    c.play();
}

for (var a in music) music[a].volume = 0.04;

for (var a in audio) audio[a].volume = 0.1;






canvas2.addEventListener('click', function () {
    if (_isFirstClick) return;
    _isFirstClick = true;
   document.documentElement.requestFullscreen();

    playMusic(music.battle_trainer);

   
    
})
var lastTime = 0;

canvas2.addEventListener('click', function () {
    isPress = true;
    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;


})


