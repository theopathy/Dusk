var canvas = document.getElementById('canvas');



////// EVENTS
var q = {}
var onKeyDown = new CustomEvent('KeyDown', {detail: {key: q.key}});
var onKeyUp = new Event('KeyUp');
function RegisterEvent(id,func) {
  canvas.addEventListener(id, function (e) { func(e) }, false);
}
/// STOP
//RegisterEvent("KeyDown",function(k) {})
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

function loadImage(path) {
  var i = new Image();
  i.src = path;
  return i;
}

function updateCanvas(a,b) {
  cw = a;
  ch = b;
}
var logKey = false

 var cw = 1280,
    ch = 720,
    cx = null,
    CanvasEnableClear = true, 
    fps = 60,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0;
    function randomColor(Bits) {return "#"+((1<<(Bits !==undefined ? Bits:24))*Math.random()|0).toString(16)}

    // MOUSE CODE START
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        Mouse.x = evt.clientX - rect.left
        Mouse.y = evt.clientY - rect.top}
      canvas.addEventListener('mousemove', function(evt) {
        Mouse._vector = getMousePos(canvas, evt);
      }, false);
    // MOUSE CODE END
   
    canvas.addEventListener( "keydown", doKeyDown);
    canvas.addEventListener( "keyup", doKeyUp);
    KEYS = []
    function doKeyDown(e) {

        //alert( e.key);
 
        KEYS[e.keyCode == 32 ? "space" : e.key]=true;
        q.key=e.keyCode == 32 ? "space" : e.key;
        canvas.dispatchEvent(onKeyDown);
      
      }
        function doKeyUp(e) {
            KEYS[e.keyCode == 32 ? "space" : e.key]=false;
          
            }

function gameLoop(evt) {
    window.requestAnimationFrame(gameLoop);
    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);
    

    if(delta > interval) {
        if (CanvasEnableClear) cx.clearRect(0,0,cw,cw);
        delta = delta/1000
        
   
        DrawStack(); 

        lastTime = currentTime - (delta % interval);
    }
}

if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext('2d');
    gameLoop();
}

