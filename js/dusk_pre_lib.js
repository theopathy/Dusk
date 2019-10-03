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
    



    static add = function(a,b) {
     if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x+b.x, a.y+b.y );
     return errorHandle()
    }
    static inverse = function(a) {
      if (a instanceof Vector) return new Vector(-a.x,-a.y);
      return errorHandle()
     }
    static subtract = function(a,b) {
      if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x-b.x, a.y-b.y );
      return errorHandle()
     }
     static multiply = function(a,b) {
      if (a instanceof Vector && b instanceof Number ) return new Vector(a.x*b,a.y*b);
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
  
