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

    add = function(b) {
      return new Vector(this.x+b.x, this.y+b.y );
    }
    subtract = function(b) {
      return new Vector(this.x-b.x, this.y-b.y );
    }
    multiply = function(b) {
      return new Vector(this.x*b, this.y*b );
    }
    static add = function(a,b) {
     if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x+b.x, a.y+b.y );
     return errorHandle()
    }
    static addF = function(a,b,c) {
      if (a instanceof Vector  ) return new Vector(a.x+b, a.y+c );
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
      if (a instanceof Vector && b instanceof Vector) return ( ((a.x - b.x)**2) + ((a.y- b.y)**2) );
      return errorHandle()
     }
    static subtract = function(a,b) {
      if (a instanceof Vector && b instanceof Vector ) return new Vector(a.x-b.x, a.y-b.y );
      return errorHandle()
     }
     static multiply = function(a,b) {
       
     // console.log("multiply",a,b) ;
      return new Vector(a.x*b,a.y*b);
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
     static lerp = function(a,b,c) {
      if (a instanceof Vector && b instanceof Vector ) return b.subtract(a).multiply(c).add(a);
      return errorHandle()
     }
  }
  


  class Mouse {
    static x = 0;
    static y = 0;
    static vector = new Vector();
    set _vector(b) {Mouse.x = b.x; Mouse.y=b.y;}
    get _vector() {return vector;} 

    static get _x() {
      return this.x + Camera.Posisition.x;
    }
    static get _y() {

      return this.y + Camera.Posisition.y;
    }
  }

function GetAngleFromTwoVectors(object,target){
  var dx = target.x - object.x 
  var dy = target.y - object.y 
  return (Math.atan2(dy,dx) )* (180/Math.PI)
}
  

 class Browser {
  static CopyStringToClipboard (str) {

    var textobj = document.createElement('textarea');
    textobj.style = {left: '-6532px',
    position: 'absolute' };
    textobj.setAttribute('readonly', '');
    textobj.value = str;
    document.body.appendChild(textobj);
    textobj.select();
    document.execCommand('copy');
    document.body.removeChild(textobj);
    }
}
Layouts = []
class Layout {
  static Load (layoutname) {

  }
}

//MATH EXTENSION


Math.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
}
Math.getRandomIntPower = function (min, max, pow) {
  min = Math.ceil(min); 
  return Math.floor((Math.random()**pow) * (Math.floor(max) - min + 1)) + min;
}

bit = []
bit.test = function(num, bit){
  return ((num>>bit) % 2 != 0)
}

bit.set = function(num, bit){
  return num | 1<<bit;
}

bit.clear = function(num, bit){
  return num & ~(1<<bit);
}

bit.toggle = function(num, bit){
  return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
}


class Scene {

  
}

