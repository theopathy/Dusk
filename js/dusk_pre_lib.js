function errorHandle(){return new Vector(0,0);}
class Vector {
    constructor(x,y) {
      this._x = x || 0;
      this._y = y || 0;
    }
    
    
    get x() {return this._x};
    get y() {return this._y};
    set x(a) {this._x=a}
    set y(a)  {this._y=a}
    
    inverse() {
      
    }



    static add = function(a,b) {
     if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x+b.x, a.y+b.y );
     return errorHandle()
    }
    static inverse = function(a) {
      if (a instanceof Vector) return new Vector(-a.x,-a.y);
      return errorHandle()
     }
     static distance = function(a,b) {
      if (a instanceof Vector) return  Math.sqrt( ((a.x - b.x)**2) + ((a.y- b.y)**2) );
      return errorHandle()
     }
     static distanceS = function(a,b) {
      if (a instanceof Vector) return ( ((a.x - b.x)^2) + ((a.y- b.y)^2) );
      return errorHandle()
     }
    static subtract = function(a,b) {
      if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x-b.x, a.y-b.y );
      return errorHandle()
     }
     static multiply = function(a,b) {
       
      console.log("multiply",a,b) ;return new Vector(a.x*b,a.y*b);
      return errorHandle()
     }
     static cross = function(a,b) {
      if (a instanceof Vector && b instanceof Vector ) return a.x * b.y - a.y * b.x;
      return errorHandle()
     }
     static divide = function(a,b) {
      if (a instanceof Vector && b instanceof Number ) return new Vector(a.x/b,a.y/b);
      return errorHandle()
     }
     static equals = function(a,b) {
      if (a instanceof Vector && b instanceof Vector ) return a.x == b.x && a.y == b.y;
      return errorHandle()
     }

  }
  


  class Mouse {
    static x = 0;
    static y = 0;
    static vector = new Vector();
    set _vector(b) {Mouse.x = b.x; Mouse.y=b.y;}
    get _vector() {return vector;} 
  }

function GetAngleFromTwoVectors(object,target){
  var dx = target.x - object.x 
  var dy = target.y - object.y 
  return (Math.atan2(dy,dx) )* (180/Math.PI)
}
  