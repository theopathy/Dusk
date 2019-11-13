

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
        frameData.FrameDelay = 5 * (fps/60);
        this.FrameData["idle"] = frameData;

        var frameData2 = new FrameData()
        frameData2.Image = loadMultipleFrames(fxx + "knight_f_run_anim_f$t.png", 4);
        frameData2.FrameDelay = 5 * (fps/60);

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
        //Camera.Posisition = Vector.add(this.Posisition, new Vector((-1280 / 2) + this.Width / 2, (-720 / 2) + (this.Height / 1.2)));

        
    }
    PreDraw() { this.PreDrawParent();}
    PostDraw() {

        this.PostDrawParent();
    }
    PostDrawParent() {  this.PreviousPosition = new Vector(this.Posisition.x, this.Posisition.y); }


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


        cx.rotate((GetAngleFromTwoVectors(player.Posisition.add(new Vector(player.Width/2,player.Height/2 + 12)),new Vector(Mouse._x,Mouse._y)) +  
        this.SwordRotation) * (Math.PI / 180) )
        cx.translate(-objx, -objy)

        cx.drawImage(weapon_knight_sword,-Camera.Posisition.x+this.Posisition.x+(this.Width/4), -Camera.Posisition.y+this.Posisition.y, 10 * 3, 21 * 3)
        cx.restore();
    }
    PreDraw() { this.PreDrawParent();
    if (this.SwordState == 1 )
        this.SwordRotation = Math.min(180, (this.SwordRotation+2)*1.8 );
    if (this.SwordState == -1 )
        this.SwordRotation = Math.max(0, (this.SwordRotation-2)/1.8 );
    
        if (this.Health <= 0) {location.reload(); 
            this.Health = 1000;
        }
 
    }
}
function checkAngle(n,b,angle) {
    var d = (n - b + 180 + 360) % 360 - 180; // Converts degrees from 0-360 to -180 to 180.
    return (d <= angle && d>=-angle);       // returns true if between param angle.
} 
function checkPicAng() {return player.Posisition.add(new Vector(player.Width/2,player.Height/2 + 12));}
function GetMouseAngle() {
    var a = GetAngleFromTwoVectors(player.Posisition.add(new Vector(player.Width/2,player.Height/2+12)),new Vector(Mouse._x,Mouse._y))
    return (a + 360) % 360;
}
function GetAngle360(a,b) {
    var a = GetAngleFromTwoVectors(a,b)
    return (a + 360) % 360;
}
function doAttack () {

    
    for (n in Entities){
        var ent = Entities[n]
        if ( ent instanceof entity_enemy_base // Is Enemy?
           // && 75**2 > Vector.distanceS(player.Posisition,ent.Posisition) && // IN RANGE
           && ((player.Posisition.x-ent.Posisition.x)**2 + (player.Posisition.y-ent.Posisition.y)**2 <= (128)**2)&&
            checkAngle(GetMouseAngle(),GetAngle360(player.Posisition,ent.Posisition),90)){ //Is Within Angle 
                ent.ApplyKnockback(2000,GetAngle360(player.Posisition,ent.Posisition));
                ent.health--;

        }
    }

}

function attackKeyDown() { if (player.SwordRotation == 0 ) {
    player.SwordState = 1;
    player.SwordRotation++;
    var n = new entity_attack((GetAngleFromTwoVectors(checkPicAng(),new Vector(Mouse._x,Mouse._y))));
    n.Posisition = player.Posisition;
    doAttack ();
}

if (player.SwordRotation == 180 ) {
    player.SwordState = -1;

    player.SwordRotation--;
    var n = new entity_attack((GetAngleFromTwoVectors(checkPicAng(),new Vector(Mouse._x,Mouse._y))));
    n.Posisition = player.Posisition
    doAttack ();
}

}
canvas.addEventListener('click',attackKeyDown ) // No right click
canvas.addEventListener("keydown", function (event) { if (event.keyCode == 32) return attackKeyDown();}, false);

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