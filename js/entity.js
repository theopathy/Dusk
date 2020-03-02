var drawStack = new Array();
var Entities = new Array();
var ZIndexLimit = 16;
_UID = -1
for (var i = 0; i < ZIndexLimit - 1; i++) {
    drawStack[i] = new Array();
}
class FrameData {
    constructor() {
        this.Image = "";
        this.Frames = 1;
        this.FrameDelay = 20;
        this.GetFrame = function() {
            return [] //Returns Image, SizeX, SizeY, OffsetX,OffsetY 
        }
    }


}
class Camera {
    static Posisition = new Vector(0, 0);
    static get RawPosition (){
        return this.Posisition.subtract(new Vector(cw,ch))
    } 
}
function loadMultipleFrames(image, namframes,offset) {
    var arr = []
    var i = 0;
    for (i; i < namframes; i++) {
        arr[i] = loadImage(image.replace("$t", i-offset));
        console.log(image.replace("$t", i))
    }
    return arr
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function deg2Rads(degrees) {
    return Math.PI / 180 * degrees
}


class Entity {
    constructor(NotPseudoEntity = true) {
        this.ClassName = "unset";
        this._ZIndex = 1;
        this._Posisition = new Vector();
        this.Visibility = true;
        this.Frame = 0;
        this.FrameData = [];
        this.Animation = "none";
        this.Width = 64
        this.FlipImage = false;
        this.Height = 64
        this._Rotation = 0;
        this.Gravity = 600;
        this.Opacity = 1;
        this.NextFrameTime = 0;
        this._DrawOverride = false;
        this.Image = ""
        this.Physics = new PhysObj();
        this.Physics.parent = this;
        this.Velocity = new Vector();
        this.ClipToBounds = false;
        this.DestoryOutOfBounds = false;
        this.Color = "#ff0";
        

       
        
        if (NotPseudoEntity) {
            _UID = 1 + _UID;
            this.UID = _UID;
     
        if (typeof drawStack[this._ZIndex] !== "object") {
            drawStack[this._ZIndex] = new Array();
        };

            Entities[this.UID] = this; 
            drawStack[this._ZIndex].push(this.UID);
        }
        

 
    }
    delete() {
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
        Entities[this.UID] = undefined;

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
    Draw() {

        if (this.DrawOverride) return;

        this.NextFrameTime--;
        if (this.NextFrameTime <= 0) {
            this.Frame++;
            if (this.Frame > this.FrameData[this.Animation].Image.length - 1) this.Frame = 0;
            this.NextFrameTime = this.FrameData[this.Animation].FrameDelay;
        };
        //cx.save();
        var PX = this.Posisition.x - Camera.Posisition.x,
            PY = this.Posisition.y - Camera.Posisition.y
        var objx = PX + (0.5 * this.Width); // x of shape center
        var objy = PY + (0.5 * this.Height); // y of shape center


        //cx.translate(objx, objy)


      //  cx.rotate((this.Rotation) * (Math.PI / 180))
       // cx.translate(-objx, -objy)

        // cx.fillStyle = "yellow";
        var posX = PX;
       // if (this.FlipImage) {
       //     cx.scale(-1, 1);
       //     posX = -posX;
       //     cx.translate(-this.Width, 0)
       // }
        cx.globalAlpha = this.Opacity;
        drawImage(this.FrameData[this.Animation].Image[this.Frame].texture, posX, PY, this.Width, this.Height);
        cx.globalAlpha = 1;
        //cx.restore();
    };
    PreDraw() {}
    PostDraw() {}
    Phys() {}

    ApplyKnockback(Velocity, Ang) {
        return null; // Override function
    }
}


function DrawStack(dt) {
    for (var i = 0; i < Entities.length; i++) {
        if (Entities[i] == null) continue;
        Entities[i].PreDraw(dt);

    }
    for (var i = 0; i < Entities.length; i++) {
        if (Entities[i] == null) continue;
        Entities[i].Phys(dt);
    }
    for (var i = 0; i < drawStack.length; i++) {
        var zlist = drawStack[i];
        for (var j = 0; j < zlist.length; j++) {
            // console.log("in stack");
            if (Entities[zlist[j]] == null) continue;
            Entities[zlist[j]].Draw(dt)
        }
    }
    for (var i = 0; i < Entities.length; i++) {
        if (Entities[i] == null) continue;
        Entities[i].PostDraw(dt);
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
        this.isConvex = true;
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
            var b = (i + 1 == this.vertex.length) ? 0 : i + 1;

            edges[i] = (new Vector((this.vertex[b].x - this.vertex[i].x), (this.vertex[b].y - this.vertex[i].y)));

        }
        return edges;
    }

    GetEdgeByIndex(n) {
        var edges = []
        var vertices = this.GetVertexByIndex(n);
        for (var i = 0; i < vertices.length; i++) {
            var b = (i + 1 == vertices.length) ? 0 : i + 1;

            edges[i] = (new Vector((vertices[b].x - vertices[i].x), (vertices[b].y - vertices[i].y)));
            //  console.log(edges[i])
        }
        return edges;
    }

    GetVertexByIndex(n) {
        var points = [];
        var rot = (this.parent != null ? this.parent.Rotation : this.rotation) * Math.PI / 180;
        var centerPos = new Vector(0.5, 0.5);
        centerPos.x *= this.parent.Width;
        centerPos.y *= this.parent.Height;
        for (var i = 0; i < this.VertexMap[n].length; i++) {
            var px = this.VertexMap[n][i].x * this.parent.Width,
                py = this.VertexMap[n][i].y * this.parent.Height;
            points.push(new Vector(
                (centerPos.x + (px - centerPos.x) * Math.cos(rot) - (py - centerPos.x) * Math.sin(rot)) + this.parent.Posisition.x,
                (centerPos.y + (px - centerPos.x) * Math.sin(rot) + (py - centerPos.y) * Math.cos(rot)) + this.parent.Posisition.y //*this.parent.Height
            ));

        }

        return points;
    }
    GetVertexGroupCount() {
        return this.VertexMap.length;

    }
    set vertex(a) {
        this._vertex = a;
        this.buildVertexMap();
    }
    buildVertexMap(DoDumpInstead) {
        var newArr = []
        var curArr = [...this._vertex];
        console.log("building new Vertex map for " + this.parent.ClassName)
        var i = 0
        if (DoDumpInstead) {
            newArr[0] = this._vertex
        } else
            while (curArr.length > 2) {
                newArr[i++] = [curArr[0], curArr[1], curArr[2]];
                curArr.splice(1, 1);
            };
        this.VertexMap = newArr;

    }
    get vertex() {
        var points = [];
        var rot = (this.parent != null ? this.parent.Rotation : this.rotation) * Math.PI / 180;
        var centerPos = new Vector(0.5, 0.5);
        centerPos.x *= this.parent.Width;
        centerPos.y *= this.parent.Height;
        for (var i = 0; i < this._vertex.length; i++) {
            var px = this._vertex[i].x * this.parent.Width,
                py = this._vertex[i].y * this.parent.Height;
            points.push(new Vector(
                (centerPos.x + (px - centerPos.x) * Math.cos(rot) - (py - centerPos.x) * Math.sin(rot)) + this.parent.Posisition.x,
                (centerPos.y + (px - centerPos.x) * Math.sin(rot) + (py - centerPos.y) * Math.cos(rot)) + this.parent.Posisition.y //*this.parent.Height
            ));

        }

        return points;
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


var indexMap = 0;

function coll_draw_debug(obj, drawMap = true, offset = 0, color = "red") {


    cx.lineWidth = "1";
    cx.strokeStyle = "red";
    drawMap = true;
    if (drawMap) {
        cx.strokeStyle = color;
        cx.beginPath();

        var curPos = obj.GetVertexByIndex(offset)[0];

        var edges = obj.GetEdgeByIndex(offset);

        cx.moveTo(curPos.x, curPos.y);
        for (var i = 0; i < edges.length; i++) {

            curPos = Vector.add(curPos, edges[i]);
            cx.lineTo(curPos.x, curPos.y);
        }




        cx.stroke();
    } else {
        cx.beginPath();
        var curPos = obj.vertex[0]
        cx.moveTo(curPos.x, curPos.y);
        for (var i = 0; i < obj.edge.length; i++) {

            curPos = Vector.add(curPos, obj.edge[i]);
            cx.lineTo(curPos.x, curPos.y);
        }




        cx.stroke();
    }


}

function checkOverlap_subRoutine(physA, physB, IndexOfA = 0, IndexOfB = 0, leakEdges) {
    var prline = null;
    var pStck = [];
    var amin, amax, bmin, bmax = null;
    var dot = 0;
    var physAEdge = physA.GetEdgeByIndex(IndexOfA),
        physBEdge = physB.GetEdgeByIndex(IndexOfB);
    var physAVertex = physA.GetVertexByIndex(IndexOfA),
        physBVertex = physB.GetVertexByIndex(IndexOfB);

    for (var i = 0; i < physAEdge.length; i++) {
        prline = new Vector(-physAEdge[i].y, physAEdge[i].x);
        pStck.push(prline);
    }
    for (var i = 0; i < physBEdge.length; i++) {
        prline = new Vector(-physBEdge[i].y, physBEdge[i].x);
        pStck.push(prline);
    }
    for (var i = 0; i < pStck.length; i++) {
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        for (var j = 0; j < physAVertex.length; j++) {
            dot = physAVertex[j].x * pStck[i].x + physAVertex[j].y * pStck[i].y;
            if (amax === null || dot > amax) {
                amax = dot;
            }
            if (amin === null || dot < amin) {
                amin = dot;
            }
        }
        for (var j = 0; j < physBVertex.length; j++) {
            dot = physBVertex[j].x * pStck[i].x + physBVertex[j].y * pStck[i].y;
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


function checkOverlap(physA, physB) {
    var collide = false;
    for (var i = 0; i < physA.GetVertexGroupCount(); i++) {
        for (var n = 0; n < physB.GetVertexGroupCount(); n++) {
            collide = checkOverlap_subRoutine(physA, physB, i, n);
            if (collide) return true;
        }
    }
    return false

}


function IsOverlap(a, b) {
    return checkOverlap(a, b);
};