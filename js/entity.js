var drawStack = new Array();
var Entities = new Array();
_UID = -1
for(var i = 0; i < 15; i++) {drawStack[i]=new Array();}
class Entity {
    constructor(a) {
      this.ClassName = a;
      this._ZIndex = 1;
      this.Posisition = new Vector();
      this.Visibility = true;
      this.Frame = 0; 
      this.Width = 64
      this.Height = 64
      this.rotation = 0;
      this.Gravity = 600;
      this.Velocity = new Vector();
      this.color = "#ff0"
      _UID = 1 + _UID;
      this.UID = _UID;
      if(typeof drawStack[this._ZIndex] !== "object") {
        drawStack[this._ZIndex]=new Array();
     };
     
      drawStack[this._ZIndex].push(this.UID);
      Entities[this.UID] = this;
    }

    
    set ZIndex(x) {
        for(var i = 0; i < 15; i++) {
            var objx = drawStack[i];
            for(var j = 0; j < objx.length; j++) {
               
                if (objx[j] == this.UID) {drawStack[i].splice(j,1);
                console.log("removed")
                break;}
                
            }
        }
        drawStack[x].push(this.UID);
        this._ZIndex = x;
    }
     Draw() {}; 
     PreDraw(){}
     PostDraw(){}
     Phys(){}
  }
  
  function DrawStack() {



      for(var i = 0; i < drawStack.length; i++) {
        var zlist = drawStack[i];

        for(var j = 0; j < zlist.length; j++) {       // console.log("in stack");
            Entities[zlist[j]].Draw()
        }
    }
      
  }

  function PreDraw() {

    for(var i = 0; i < Entities.length; i++) {
        Entities[i].Phys();
        Entities[i].PreDraw();
  }
}

function PostDraw() {


    for(var i = 0; i < Entities.length; i++) {
        Entities[i].PostDraw();
  }
    
}
  class entity_ball extends Entity{ 
      Draw() {
            cx.beginPath();
            cx.fillStyle = this.color;
            cx.arc(this.Posisition.x, this.Posisition.y, 25, 0, Math.PI * 360);
            cx.fill();
            
      }
      PreDraw() {
        
        this.Posisition = Vector.add(this.Posisition,new Vector((Math.random()-0.5)*5,(Math.random()-0.5)*5)); 
      }
  }   
  
class entity_player extends Entity{ 
    Draw() {
        cx.save();
        var objx     = this.Posisition.x + (0.5 * 48);   // x of shape center
        var objy     = this.Posisition.y + (0.5 * 48);  // y of shape center
          cx.beginPath();
          cx.fillStyle = this.color;
          cx.translate(objx,objy)
     
         
          cx.rotate(this.rotation*(Math.PI/180)) 
          cx.translate(-objx,-objy)
          cx.rect(this.Posisition.x,this.Posisition.y, 48, 48);
          cx.fill();
          cx.restore();

    }
    PreDraw() {
      
      this.Posisition = Vector.add(this.Posisition,new Vector((Math.random()-0.5)*5,(Math.random()-0.5)*5)); 
    }
} 