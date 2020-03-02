updateCanvas(1280, 720); //SET GAME TO 720p
//cx.imageSmoothingEnabled = false;
var _DEBUG  = true; var bcx = null;
var Ikimono = []
console.log('%c Ikimono: Init ', 'background: #fba; color: #342');
console.log('%cIkimono: Counting Creatures...', 'background: #fba; color: #342');



var Httpreq = new XMLHttpRequest();
Httpreq.open("GET",_DEBUG ? "creatures/fake-compile.txt" : "creatures/compile.php" , false);
Httpreq.send(null);
Ikimono.creaturesJSONPATH = JSON.parse(Httpreq.responseText);
Ikimono.countCreaturesj = Ikimono.creaturesJSONPATH.length;
Ikimono.creatures = [];
Ikimono.countCreatures = 0;
Ikimono.creaturesJSONPATH.forEach(function (creat) {

   fetch("creatures/"+creat)
   .then(res => {return res.text();})
  .then(data => {   var imonos = JSON5.parse(data);
    Ikimono.creatures[imonos.Name] = imonos;  
    Ikimono.countCreatures++;
    if (Ikimono.countCreatures == Ikimono.countCreaturesj) _goto(); 
}); 

})
 



var loader = new Loader();

// add this middleware so that any map files we load will also have all their sub resources
// loaded too.
loader.use(glTiled['resource-loader'].tiledMiddlewareFactory());
loader.add('Ikimono', 'maps/Ikimono/Ikimono.json');
loader.load(function () 
{ 

    bcx = new glTiled.GLTilemap(gl, loader.resources.Ikimono.data, loader.resources);
    bcx.resizeViewport(gl.canvas.width/4,gl.canvas.height/4)
    
})


var UI_HEART_EMPTY = loadImageAndCreateTextureInfo("assets/logo/Ikimono.png");
var BG_TITLE = loadImageAndCreateTextureInfo("assets/logo/bg.jpg");
var bg_offset = 0;
var lgscreen = null;
class TitlescreenLogo extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }
    Draw(dt) { 
        
       drawImage(BG_TITLE.texture,-4 + bg_offset,-4,1288,728);
        drawImage(BG_TITLE.texture,-1288 + bg_offset,-4,1288,728);
        drawImage(UI_HEART_EMPTY.texture, 1280/2 - 256 , 260-(192/2) +(Math.sin(bg_offset/50)*5),512,192);
        bg_offset = (bg_offset + (100*dt)) % 1280;
        
            // update animations, if your map has no animated tiles
    // you can skip this step.
    
    }

} 

class Level extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }


    PreDraw(dt) {
       
      if (bcx) {
          bcx.update(dt)
        bcx.draw(player.Posisition.x,player.Posisition.y);}
 
    

    }
} 
class Player extends Entity {
    constructor() {
        super()
        //this.DrawOverride = true;
        function newS(p,cva = 4) {
        var frameData = new FrameData()
        frameData.Image = loadMultipleFrames("assets/characters/f/"+p + "$t.png", cva,-1);
        frameData.FrameDelay = 5 * (fps/60);
        return frameData;
        }
      
        this.FrameData["idle"] =   newS("s",1); 

        this.FrameData["idle_north"]    =       newS("n",1); 
        this.FrameData["idle_south"]    =       newS("s",1); 
        this.FrameData["idle_west"]     =       newS("w",1); 
        this.FrameData["idle_east"]     =       newS("e",1); 

        this.FrameData["walk_north"]    =       newS("n",4); 
        this.FrameData["walk_south"]    =       newS("s",4); 
        this.FrameData["walk_west"]     =       newS("w",4); 
        this.FrameData["walk_east"]     =       newS("e",4); 



        this.Animation = "idle";
        this.Width = 64;
        this.Height = 64;
    }
    Health = 6;
    XSpeed = 0;
    YSpeed = 0;
    State = "idle";
    YDir  = true;
    Direction = "south";
    XDir = true;
    Friction = -1;
    MaxSpeed = 85;
    keys = {
        forward: "w",
        left: "a",
        right: "d",
        reverse: "s",
        space: "space"
    }



    
    PreDraw(dt) {
        var orig = this.Animation;
        var speedGain = 1200;
        if (KEYS[this.keys.forward] ? !KEYS[this.keys.reverse] : KEYS[this.keys.reverse]){ //XOR
            this.YSpeed = Math.min(this.MaxSpeed, (this.YSpeed + 1) ** 3.7);
            this.YDir  = KEYS[this.keys.reverse];  }
          
        else
            this.YSpeed = Math.max(0,(this.YSpeed*this.Friction)-1);
            
        if (KEYS[this.keys.right] ? !KEYS[this.keys.left] : KEYS[this.keys.left]){ //XOR 
            this.XSpeed = Math.min(this.MaxSpeed, ((this.XSpeed + 1) ** 3.7));
            this.XDir  = KEYS[this.keys.right];
        }
        else
        this.XSpeed = Math.max(0,(this.XSpeed*this.Friction)-1);
        this.Posisition = new Vector(
            this.Posisition.x + (this.XSpeed * dt) * (this.XDir ? 1 : -1),
            this.Posisition.y + (this.YSpeed * dt)  * (this.YDir ? 1 : -1));

        
        if (this.XSpeed > 0 || this.YSpeed) {
            //this.Animation = "walk"
        } else {}  //this.Animation = "idle";
        Camera.Posisition = Vector.add(this.Posisition, new Vector((-1280 / 2) + this.Width / 2, (-720 / 2) + (this.Height / 1.2)));

        if (this.YSpeed > 0 ) 
            this.Direction = !this.YDir ? "north" : "south";
    
        if (this.XSpeed > 0 ) 
            this.Direction = !this.XDir ? "west" : "east";
 
        if ( this.XSpeed > 0 ||  this.YSpeed > 0) this.State="walk";
        else this.State = "idle";
        this.Animation = (`${this.State}_${this.Direction}`);
        if (this.Animation != orig) this.Frame = 0;
    }

    //Draw() {
       // drawImage(UI_HEART_EMPTY.texture,this.Posisition.x -Camera.Posisition.x, this.Posisition.y -Camera.Posisition.y,64,64);
  //  }
}

function _goto() {
    console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342',Ikimono.countCreatures);
    lgscreen = new TitlescreenLogo();

} 
var game = null;var player = null;
canvas.addEventListener('click',function() {if (lgscreen) {lgscreen.delete();lgscreen=null; game = new Level(); player = new Player(); };} )
