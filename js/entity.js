var drawStack = new Array();
var Entities = new Array();
var ZIndexLimit = 16;
_UID = -1
for (var i = 0; i < ZIndexLimit - 1; i++) {
    drawStack[i] = new Array();
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
        this.Physics.parent = this;
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
            var halfRotatedWidth = (this.RotatedWidth / 2) - (this.Width / 2);
            var halfRotatedHeight = (this.RotatedHeight / 2) - (this.Height / 2);
            var x = this._Posisition.x,
                y = this.Posisition.y;
            if (this.Posisition.x - halfRotatedWidth <= 0) {
                // off left
                x = halfRotatedWidth;
            } else if (this.Posisition.x + halfRotatedWidth >= canvas.width + (this.Width / 2)) {
                // off right
                x = canvas.width - halfRotatedWidth;
            }
            if (this.Posisition.y - halfRotatedHeight <= 0) {
                // off top
                y = halfRotatedHeight;
            } else if (this.Posisition.y + halfRotatedHeight >= canvas.height + (this.Height / 2)) {
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


var DEBUG_DRAWCOLLISIONWIREFRAME = true;
class PhysObj {
    constructor(vert = [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, 1)], parent = null) {
        this.isAwake = false;
        this._vertex = vert;
        this.colliding = true;
        this.parent = parent;
        this.rotation = 0;
    }
    awake() {
        this.awake = true;
    }
    sleep() {
        this.awake = false
    }
    get edge() {
        var edges = []
        for (var i = 0; i < this.vertex.length; i++) {
            var b = (i + 1 == this.vertex.length) ? 0 : i + 1

            edges[i] = (new Vector((this.vertex[b].x - this.vertex[i].x), (this.vertex[b].y - this.vertex[i].y)))
        }
        return edges
    }
    set vertex(a) {
        this._vertex = a;
    }

    get vertex() {
        var points = [];
        var rot = (this.parent != null ? this.parent.Rotation : this.rotation) * Math.PI / 180
        var centerPos = new Vector(0.5, 0.5)
        // console.log(centerPos);
        //centerPos = new Vector(0.5,0.5)
        // console.log(centerPos);
        centerPos.x *= this.parent.Width
        centerPos.y *= this.parent.Height
        for (var i = 0; i < this._vertex.length; i++) {

            var px = this._vertex[i].x * this.parent.Width,
                py = this._vertex[i].y * this.parent.Height;
            points.push(new Vector(
                (centerPos.x + (px - centerPos.x) * Math.cos(rot) - (py - centerPos.x) * Math.sin(rot)) + this.parent.Posisition.x,
                (centerPos.y + (px - centerPos.x) * Math.sin(rot) + (py - centerPos.y) * Math.cos(rot)) + this.parent.Posisition.y //*this.parent.Height
            ))
        }
        return points
    }
    center() {

        var arr = this._vertex;
        var x = arr.map(x => x.x);
        var y = arr.map(x => x.y);
        var cx = (Math.min(...x) + Math.max(...x)) / 2;
        var cy = (Math.min(...y) + Math.max(...y)) / 2;
        return new Vector(cx, cy);
    }

}

var rot = 45; // rotation

physAVertices = [
    new Vector(0, 0),
    new Vector(0, 110),
    new Vector(110, 110),
    new Vector(110, 0)
];




physBVertices = [
    new Vector(130, 130),
    new Vector(80, 100),
    new Vector(25, 150),
];


var objA = new PhysObj(physAVertices)
var objB = new PhysObj(physBVertices)

function coll_draw_debug(obj) {
    cx.beginPath();

    cx.lineWidth = "1";
    cx.strokeStyle = "red";


    cx.beginPath();
    var curPos = obj.vertex[0]
    cx.moveTo(curPos.x, curPos.y);
    for (var i = 0; i < obj.edge.length; i++) {

        curPos = Vector.add(curPos, obj.edge[i]);
        cx.lineTo(curPos.x, curPos.y);
    }




    cx.stroke();
}

function coll_check_between(physA, physB) {
    var prline = null;
    var pStck = [];
    var amin, amax, bmin, bmax = null;
    var dot = 0;
    for (var i = 0; i < physA.edge.length; i++) {
        prline = new Vector(-physA.edge[i].y, physA.edge[i].x);
        pStck.push(prline);
    }
    for (var i = 0; i < physB.edge.length; i++) {
        prline = new Vector(-physB.edge[i].y, physB.edge[i].x);
        pStck.push(prline);
    }
    for (var i = 0; i < pStck.length; i++) {
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        for (var j = 0; j < physA.vertex.length; j++) {
            dot = physA.vertex[j].x * pStck[i].x + physA.vertex[j].y * pStck[i].y;
            if (amax === null || dot > amax) {
                amax = dot;
            }
            if (amin === null || dot < amin) {
                amin = dot;
            }
        }
        for (var j = 0; j < physB.vertex.length; j++) {
            dot = physB.vertex[j].x * pStck[i].x + physB.vertex[j].y * pStck[i].y;
            if (bmax === null || dot > bmax) {
                bmax = dot;
            }
            if (bmin === null || dot < bmin) {
                bmin = dot;
            }
        }
        if ((amin < bmax && amin > bmin) || (bmin < amax && bmin > amin)) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}

console.log("center" + objA.center)