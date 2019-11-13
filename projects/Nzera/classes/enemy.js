var enemyKillCount = 12;
var SlimeFrames = loadMultipleFrames(fxx + "zombie_run_anim_f$t.png", 4);
class entity_enemy_base extends entity_player {
    PreDraw() {
        this.Posisition = new Vector(
            this.Posisition.x + (this.XSpeed * delta),
            this.Posisition.y + (this.YSpeed * delta));
            this.XSpeed = Math.floor(this.XSpeed * this.Friction);
            this.YSpeed = Math.floor(this.YSpeed * this.Friction)
            //this.Posisition = Vector.Add
            if (this.health <= 0) this.delete();
    }
    CanBeAttackedByPlayer = true;
    constructor(a) {
        super(a);
        this.FrameData["idle"].Image = SlimeFrames;
        this.Width = 16 * 3.5;
        this.Height = 16 * 3.5;
        this.CanBeAttackedByPlayer = true;
        this.health = 2;
        this.canAttack = true;
        this.AttackR = 15;
    }

    ApplyKnockback(Velocity,Ang) {
        this.XSpeed += Velocity * Math.cos(deg2Rads(Ang))
        this.YSpeed += Velocity * Math.sin(deg2Rads(Ang));
    }
    delete() { enemyKillCount--; super.delete();}
}
function attack(n) {
    n.canAttack = true;
}
function drawHealthbar(pos,vec) {}
class entity_zombie extends entity_enemy_base {
    speed = 65;
    PreDraw() {
    super.PreDraw();
    if (Vector.distanceS(this.Posisition,player.Posisition) < this.AttackR **2 && this.canAttack) { 
        this.canAttack = false;
        console.log("hega")
        setInterval(attack, 1000,this)
        player.Health -= Math.getRandomInt(1,2)
    }
    if (Vector.distanceS(this.Posisition,player.Posisition) > 2) {
    var speed = this.speed * delta;
    var ang = GetAngleFromTwoVectors(this.Posisition,player.Posisition);
    var distance = 2;
    var x =  speed  * Math.cos(deg2Rads(ang));
    
    this.Posisition = Vector.add(this.Posisition , new Vector( x, speed  * Math.sin(deg2Rads(ang))));
       this.FlipImage = !(x>0);
    }
}
    CanBeAttackedByPlayer = true;
    constructor(a) {
       
    super(a); this.health=3;
    }



}


var DemonFrames = loadMultipleFrames(fxx + "big_demon_run_anim_f$t.png", 4);
class entity_demon extends entity_zombie {
    PreDraw() {
    super.PreDraw();
}
    constructor(a) {
    super(a);
    this.health = 2;
    this.FrameData["idle"].Image = DemonFrames;
    this.speed = 320;
    
    }
}
var ogreFrames = loadMultipleFrames(fxx + "ogre_run_anim_f$t.png", 4);
class entity_ogre extends entity_zombie {
    PreDraw() {
    super.PreDraw();
}
    constructor(a) {
    super(a);
    this.health = 8;
    this.Width *=2;
    this.Height *=2;
    this.AttackR = 30;
    this.FrameData["idle"].Image = ogreFrames;
    this.speed = 25;
    }
}

var ogreFramesDemon = loadMultipleFrames(fxx + "big_demon_run_anim_f$t.png", 4);
class entity_demonogre extends entity_zombie {
    PreDraw() {
    super.PreDraw();
}
    constructor(a) {
    super(a);
    this.health = 16;
    this.Width *=2;
    this.Height *=2;
    this.AttackR = 30;
    this.FrameData["idle"].Image = ogreFramesDemon;
    this.speed = 100;
    }
}