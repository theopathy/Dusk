updateCanvas(1280, 720); //SET GAME TO 720p
cx.imageSmoothingEnabled = false;

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function deg2Rads(degrees) {
    return Math.PI / 180 * degrees
}

var fxx = "assets/images/frames/";
var UI_HEART_EMPTY = loadImage(fxx + "ui_heart_empty.png");
var UI_HEART_HALF = loadImage(fxx + "ui_heart_half.png");
var UI_HEART_FULL = loadImage(fxx + "ui_heart_full.png");

var basicFloor = loadImage(fxx + "floor_1.png");

var wall_mid = loadImage(fxx + "wall_mid.png");
var wall_left = loadImage(fxx + "wall_left.png");
var wall_right = loadImage(fxx + "wall_right.png");

var wall_top = loadImage(fxx + "wall_top_mid.png");
var wall_top_right = loadImage(fxx + "wall_top_right.png");
var wall_top_left = loadImage(fxx + "wall_top_left.png");

var wall_top = loadImage(fxx + "wall_top_mid.png");
var wall_left_border = loadImage(fxx + "wall_inner_corner_mid_left.png");
var wall_top_left = loadImage(fxx + "wall_top_left.png");
var wall_corner_bottom_left = (loadImage (fxx+"wall_corner_bottom_left.png"));
var wall_corner_bottom_right = (loadImage (fxx+"wall_corner_bottom_right.png"))

var wall_corner_top_left =      (loadImage (fxx+"wall_corner_top_left.png"));
var wall_corner_top_right =      (loadImage (fxx+"wall_corner_top_right.png"))
var wall_side_mid_right = loadImage(fxx+"wall_side_mid_right.png")
var wall_side_mid_left = loadImage(fxx+"wall_side_mid_left.png")

var weapon_knight_sword = loadImage(fxx+"weapon_knight_sword.png")

function loadMultipleFrames(image, namframes) {
    var arr = []
    var i = 0;
    for (i; i < namframes; i++) {
        arr[i] = loadImage(image.replace("$t", i));
        console.log(image.replace("$t", i))
    }
    return arr
}
var heartdist = 16 * 3

class dungeon_phys extends Entity {
    constructor() {
        super();
        this.ZIndex=10; 
        this.DrawOverride = true;
        this.Physics.buildVertexMap(true);
        this.IsVert = true
    }
   
     
        
      Draw() {
        cx.beginPath();
        cx.fillStyle = "rgba(100,35,35,0.4)";
        cx.rect(-Camera.Posisition.x+this.Posisition.x, -Camera.Posisition.y+this.Posisition.y, this.Width, this.Height);
        cx.fill();
        cx.stroke();
    
        
        cx.restore();
      }  
    
Phys() {

    
    



    if (IsOverlap(this.Physics,player.Physics)) { 
      //  if (player.Posisition.y > this.Posisition.y-22)
      
      if (this.IsVert )
         player.Posisition._y = player.PreviousPosition.y;
   
    
      else
         player.Posisition._x = player.PreviousPosition.x; 
         
      //  player.Posisition.y = this.Posisition.y-22 + (this.Height) - 30; 
       

        Camera.Posisition = Vector.add(player.Posisition, new Vector((-1280 / 2) + player.Width / 2, (-720 / 2) + (player.Height / 1.2)));
        
    }
}

}

class dungeon extends Entity {
    constructor() {
        super();
        this.DrawOverride = true;
        this.Posisition = new Vector();
      }
    TilesWidth = 14;
    TilesHeight = 12;


    Draw() {
        for (var i = 0; i < this.TilesWidth; i++) {
            for (var n = 0; n < this.TilesHeight; n++) {
                
                var posx = -Camera.Posisition.x + (i * 48) + this.Posisition.x;
                var posy = -Camera.Posisition.y + (n * 48) + this.Posisition.y;

                cx.drawImage(basicFloor,posx, posy, 16 * 3, 16 * 3)
                
                    if ((i==0 || i== this.TilesWidth-1 )&& n>0) {
                        cx.drawImage(i==0? wall_side_mid_right : wall_side_mid_left
                        ,posx,  posy - 48 , 16 * 3, 16 * 3)
                    }



                    if ((n == 0)) {
                        var isLeftOrRightOrNone = (i == 0) ? wall_left : ((i == this.TilesWidth - 1) ? wall_right : wall_mid)
                       // var isLeftOrRightOrNone2 = (ni == 0) ? (n==0 ?  wall_corner_bottom_right: wall_corner_bottom_left) : ((i == this.TilesWidth - 1) ? (n==0 ?  wall_corner_top_right: wall_corner_top_left) : wall_top)
                        cx.drawImage(isLeftOrRightOrNone, posx,posy, 16 * 3, 16 * 3)
    
                        cx.drawImage(
                            n==0 ? (i==0 ? wall_corner_top_left : wall_corner_top_right) : wall_top
                            
                        ,posx,  posy - 48 , 16 * 3, 16 * 3)
    
                    }


            }
        }
    }

    PostDraw() {
        for (var i = 0; i < this.TilesWidth; i++) {
            for (var n = 0; n < this.TilesHeight; n++) {
                
                var posx = -Camera.Posisition.x + (i * 48) + this.Posisition.x;
                var posy = -Camera.Posisition.y + (n * 48) + this.Posisition.y;


                    if ((n == this.TilesHeight - 1)) {
                        var isLeftOrRightOrNone = (i == 0) ? wall_left : ((i == this.TilesWidth - 1) ? wall_right : wall_mid)
                       // var isLeftOrRightOrNone2 = (ni == 0) ? (n==0 ?  wall_corner_bottom_right: wall_corner_bottom_left) : ((i == this.TilesWidth - 1) ? (n==0 ?  wall_corner_top_right: wall_corner_top_left) : wall_top)
                        cx.drawImage(isLeftOrRightOrNone, posx,posy, 16 * 3, 16 * 3)
    
                        cx.drawImage(
                            n==0 ? (i==0 ? wall_corner_top_left : wall_corner_top_right) : wall_top
                            
                        ,posx,  posy - 48 , 16 * 3, 16 * 3)
    
                    }




            }
        }
    }
}
class entity_UI extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }
    PostDraw() {
        var i;
        var allEmpty = false;
        for (i = 0; i < player.MaxHealth; i = i + 2) {
            if (i < player.Health)
                cx.drawImage((i + 1 < player.Health) ? UI_HEART_FULL : UI_HEART_HALF, 6 + (i / 2 * heartdist), 6, heartdist, heartdist);
            else
                cx.drawImage(UI_HEART_EMPTY, 6 + (i / 2 * heartdist), 6, heartdist, heartdist);
        }
    }
}
var entity_attack_anim = new FrameData()
entity_attack_anim.Image = [loadImage(fxx + "effect_blade_01.png"),
    loadImage(fxx + "effect_blade_02.png"),
    loadImage(fxx + "effect_blade_03.png")
    ,loadImage(fxx + "effect_blade_03.png"),loadImage(fxx + "effect_blade_03.png"),loadImage(fxx + "effect_blade_03.png")

];
entity_attack_anim.FrameDelay = 3;
class entity_attack extends Entity {
    constructor(r = 0,x,y) {
        super();
   
        
    this.FrameData["attack"] = entity_attack_anim;
    this.Animation = "attack";
    this.Opacity = 0.7;
    this.Width = 22*3;
    this.Rotation = r;
    this.Height = 33*3;

    this.Posisition.x = x + (66 ) * Math.cos(deg2Rads(this.Rotation))
    this.Posisition.y = y + (66 ) * Math.sin(deg2Rads(this.Rotation));
}
    PreDraw() {
        this.Posisition.x = this.Posisition.x + (333 * delta) * Math.cos(deg2Rads(this.Rotation))
        this.Posisition.y = this.Posisition.y + (333 * delta) * Math.sin(deg2Rads(this.Rotation));
        if (this.Frame > 3) {
           this.delete();
        }
    }

}

 
class entity_player extends Entity {
    MaxSpeed = 400;
    Speed = 0;
    MaxHealth = 6;
    Health = 6;
    keys = {
        forward: "w",
        left: "a",
        right: "d",
        reverse: "s",
        space: "space"
    }

    Width = 16 * 3;
    Height = 28 * 3;

    fireFrame = 0;
    fireOpactity = 1;
    fireframeMax = 60;
    _imageoffset = new Vector(0, 32);
    
    constructor(a) {
        super(a);



        var frameData = new FrameData()
        frameData.Image = [loadImage(fxx + "knight_f_idle_anim_f0.png"),
            loadImage(fxx + "knight_f_idle_anim_f1.png"),
            loadImage(fxx + "knight_f_idle_anim_f2.png"),
            loadImage(fxx + "knight_f_idle_anim_f3.png")
        ];
        frameData.FrameDelay = 5;
        this.FrameData["idle"] = frameData;

        var frameData2 = new FrameData()
        frameData2.Image = loadMultipleFrames(fxx + "knight_f_run_anim_f$t.png", 4);
        frameData2.FrameDelay = 5;

        this.FrameData["walk"] = frameData2;

        this.Animation = "idle";
        this.Physics.vertex = [new Vector(0.26,0.42),new Vector(0.8,0.42),new Vector(0.8,1),new Vector(0.26,1)]
        this.Physics.buildVertexMap(true);
    }
    XSpeed = 0;
    YSpeed = 0;
    YDir  = true;
    XDir = true;
    Friction = 0.4;
    PreDrawParent() {
       
        var speedGain = 1200;
        if (KEYS[this.keys.forward] ? !KEYS[this.keys.reverse] : KEYS[this.keys.reverse]){ //XOR
            this.YSpeed = Math.min(this.MaxSpeed, (this.YSpeed + 1) ** 3.7);
            this.YDir  = KEYS[this.keys.reverse];}
        else
            this.YSpeed = Math.max(0,(this.YSpeed*this.Friction)-1);
            
        if (KEYS[this.keys.right] ? !KEYS[this.keys.left] : KEYS[this.keys.left]){ //XOR 
            this.XSpeed = Math.min(this.MaxSpeed, ((this.XSpeed + 1) ** 3.7));
            this.XDir  = KEYS[this.keys.right];
        }
        else
        this.XSpeed = Math.max(0,(this.XSpeed*this.Friction)-1);
        this.Posisition = new Vector(
            this.Posisition.x + (this.XSpeed * delta) * (this.XDir ? 1 : -1),
            this.Posisition.y + (this.YSpeed * delta)  * (this.YDir ? 1 : -1));

       this.FlipImage = !this.XDir;

        if (this.XSpeed > 0 || this.YSpeed) {
            this.Animation = "walk"
        } else this.Animation = "idle";
        Camera.Posisition = Vector.add(this.Posisition, new Vector((-1280 / 2) + this.Width / 2, (-720 / 2) + (this.Height / 1.2)));

        
    }
    PreDraw() { this.PreDrawParent();}
    PostDraw() {

        this.PostDrawParent();
    }
    PostDrawParent() {  this.PreviousPosition = new Vector(this.Posisition.x, this.Posisition.y); }
}

var SlimeFrames = loadMultipleFrames(fxx + "zombie_idle_anim_f$t.png", 4);
class entity_enemy_base extends entity_player {
    PreDraw() {
    }
    CanBeAttackedByPlayer = true;
    constructor(a) {
        super(a);
        this.FrameData["idle"].Image = SlimeFrames;
        this.Width = 16 * 3.5;
        this.Height = 16 * 3.5;
        this.CanBeAttackedByPlayer = true;
    }
}

class entity_player_knight extends entity_player {
    constructor(a) {
        super(a);
        this.SwordRotation = 0;
        this.SwordState = 0;
    }
    PostDraw() {

        this.PostDrawParent();

        cx.save();
        var PX = this.Posisition.x - Camera.Posisition.x, PY = this.Posisition.y -Camera.Posisition.y -5
        var objx = PX + (0.5 * this.Width); // x of shape center
        var objy = PY + (0.84 * this.Height); // y of shape center


        cx.translate(objx, objy)


        cx.rotate((GetAngleFromTwoVectors(new Vector(1280/2,720/2),new Vector(Mouse.x,Mouse.y)) +  this.SwordRotation) * (Math.PI / 180) )
        cx.translate(-objx, -objy)

        cx.drawImage(weapon_knight_sword,-Camera.Posisition.x+this.Posisition.x+(this.Width/4), -Camera.Posisition.y+this.Posisition.y, 10 * 3, 21 * 3)
        cx.restore();
    }
    PreDraw() { this.PreDrawParent();
    if (this.SwordState == 1 )
        this.SwordRotation = Math.min(180, (this.SwordRotation+2)*1.8 );
    if (this.SwordState == -1 )
        this.SwordRotation = Math.max(0, (this.SwordRotation-2)/1.8 );
    
 
    }
}

function doAttack () {

    
    for (n in Entities){
        var ent = Entities[n]
        if ( ent instanceof entity_enemy_base ) {
        console.log(Vector.distance(player.Posisition,ent.Posisition));
        console.log("hey")

        }
    }

}
canvas.addEventListener("keydown", function (event) { if (event.keyCode != 32) return;
    
    
    
    if (player.SwordRotation == 0 ) {
        player.SwordState = 1;
        player.SwordRotation++;
        var n = new entity_attack((GetAngleFromTwoVectors(new Vector(1280/2,720/2),new Vector(Mouse.x,Mouse.y))));
        n.Posisition = player.Posisition;
        doAttack ();
    }

    if (player.SwordRotation == 180 ) {
        player.SwordState = -1;

        player.SwordRotation--;
        var n = new entity_attack((GetAngleFromTwoVectors(new Vector(1280/2,720/2),new Vector(Mouse.x,Mouse.y))));
        n.Posisition = player.Posisition
        doAttack ();
    }

    }, 
     
     false);

layout = new dungeon();
layout_phys = new dungeon_phys();

layout_phys.Width = 48 * 6;
layout_phys.Height = 48;
layout_phys.Posisition.x = -48 * 8;
layout_phys.Posisition.y = -48 * 4;

layout_phys2 = new dungeon_phys();

layout_phys2.Width = 12 ;
layout_phys2.Height = 48 * 6;
layout_phys2.Posisition.x = -48 * 8;
layout_phys2.Posisition.y = -48 * 4;
layout_phys2.IsVert = false;
layout.Posisition.x = -48 * 8;
layout.Posisition.y = -48 * 4;
player = new entity_player_knight();
player.ZIndex = 5;
UI = new entity_UI();   

//layout2 = new dungeon();