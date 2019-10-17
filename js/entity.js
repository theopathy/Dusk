var drawStack = new Array();
var Entities = new Array();
var ZIndexLimit = 16;
_UID = -1
for (var i = 0; i < ZIndexLimit - 1; i++) {
    drawStack[i] = new Array();
}
class PhysObj {
    constructor() {
        this.isAwake = false;
    }
    awake() {
        this.awake = true;
    }
}
class Entity {
    constructor(a) {
        this.ClassName = a;
        this._ZIndex = 1;
        this._Posisition = new Vector();
        this.Visibility = true;
        this.Frame = 0;
        this.Animation = "idle";
        this.Width = 64
        this.Height = 64
        this._Rotation = 0;
        this.Gravity = 600;


        this.Physics = new PhysObj();
        this.Velocity = new Vector();
        this.ClipToBounds = false;
        this.Color = "#ff0";
        _UID = 1 + _UID;
        this.UID = _UID;
        if (typeof drawStack[this._ZIndex] !== "object") {
            drawStack[this._ZIndex] = new Array();
        };

        drawStack[this._ZIndex].push(this.UID);
        Entities[this.UID] = this;


    }
    get Rotation() {
        return this._Rotation
    }
    set Rotation(x) {
        x = x % 360;
        if (x < 0) x += 360;
        this._Rotation = x;
    }

    get RotatedWidth() {
        var r = Math.PI / 180 * (this._Rotation);
        var a = Math.abs(this.Width * Math.cos(r));
        var b = Math.abs(this.Height * Math.sin(r));

        return a + b;
    }
    get RotatedHeight() {
        var r = Math.PI / 180 * (this._Rotation);
        var c = Math.abs(this.Height * Math.cos(r));
        var d = Math.abs(this.Width * Math.sin(r));
        return c + d;
    }
    get RotatedSize() {}
    get Posisition() {
        return this._Posisition;
    }
    set Posisition(n) {
        if (this.ClipToBounds) {
            this._Posisition = n;
            var halfRotatedWidth = (this.RotatedWidth / 2)-(this.Width/2);
            var halfRotatedHeight = (this.RotatedHeight / 2)-(this.Height/2);
            var x = this._Posisition.x,
                y = this.Posisition.y;
            if (this.Posisition.x - halfRotatedWidth <= 0) {
                // off left
                x = halfRotatedWidth;
            } else if (this.Posisition.x + halfRotatedWidth >= canvas.width+(this.Width/2)) {
                // off right
                x = canvas.width - halfRotatedWidth;
            }
            if (this.Posisition.y - halfRotatedHeight <= 0) {
                // off top
                y = halfRotatedHeight;
            } else if (this.Posisition.y + halfRotatedHeight >= canvas.height+(this.Height/2)) {
                // off bottom
                y = canvas.height - halfRotatedHeight;
            }
            this._Posisition = new Vector(x, y);
            return;
        }
        this._Posisition = n;

    }
    set ZIndex(x) {
        for (var i = 0; i < ZIndexLimit - 1; i++) {
            var objx = drawStack[i];
            var boolExample = true,
                j = 0;
            while (boolExample && j < objx.length) {
                j++;
                console.log(boolExample);
                console.log(j);
                if (objx[j] == this.UID) {
                    drawStack[i].splice(j, 1);
                    boolExample = false;
                }
            }

        }




        drawStack[x].push(this.UID);
        this._ZIndex = x;
    }
    Draw() {};
    PreDraw() {}
    PostDraw() {}
    Phys() {}
}

function DrawStack() {
    for (var i = 0; i < drawStack.length; i++) {
        var zlist = drawStack[i];

        for (var j = 0; j < zlist.length; j++) { // console.log("in stack");
            Entities[zlist[j]].Draw()
        }
    }

}

function PreDraw() {

    for (var i = 0; i < Entities.length; i++) {
        Entities[i].Phys();
        Entities[i].PreDraw();
    }
}
function Global_PostDraw() {}
function PostDraw() {

    Global_PostDraw();
    for (var i = 0; i < Entities.length; i++) {
        Entities[i].PostDraw();
    }

}
class entity_ball extends Entity {
    Draw() {
        cx.beginPath();
        cx.fillStyle = this.color;
        cx.arc(this.Posisition.x, this.Posisition.y, 25, 0, Math.PI * 360);
        cx.fill();

    }
    PreDraw() {

        this.Posisition = Vector.add(this.Posisition, new Vector((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5));
    }
}