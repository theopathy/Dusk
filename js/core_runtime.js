var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}



var canvas = document.getElementById('canvas'),
    cw = 1280,
    ch = 720,
    cx = null,
    fps = 1000,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0;
    function randomColor(Bits) {return "#"+((1<<(Bits !==undefined ? Bits:24))*Math.random()|0).toString(16)}

    // MOUSE CODE START
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        Mouse.x =evt.clientX - rect.left
        Mouse.y =evt.clientY - rect.top}
      canvas.addEventListener('mousemove', function(evt) {
        Mouse._vector = getMousePos(canvas, evt);
      }, false);
    // MOUSE CODE END
   
    canvas.addEventListener( "keydown", doKeyDown);
    canvas.addEventListener( "keyup", doKeyUp);
    KEYS = []
    function doKeyDown(e) {

        //alert( e.key);
        KEYS[e.key]=true;
        }
        function doKeyUp(e) {
            KEYS[e.key]=false;
          
            }
function gameLoop(evt) {
    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) {
    
        cx.clearRect(0,0,cw,cw);
        PreDraw();
        DrawStack(); 
        PostDraw(); 
      
       
      
        lastTime = currentTime - (delta % interval);
    }
}


if (typeof (canvas.getContext) !== undefined) {
    cx = canvas.getContext('2d');

    gameLoop();
}