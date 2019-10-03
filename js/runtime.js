
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

var canvas = document.getElementById('canvas'),
    cw = 600,
    ch = 600,
    cx = null,
    fps = 60,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0;
    function randomColor(Bits) {return "#"+((1<<(Bits !==undefined ? Bits:24))*Math.random()|0).toString(16)}

    ball1 = new entity_player();

    
   
    ball2 = new entity_ball();
    ball2.color = "#f43"
    ball2.Posisition = new Vector(cw/2,ch/2);

    ball1.Posisition =  new Vector(cw/2,ch/2);
    

    ball2 = new entity_ball();
    ball2.color = "#052"
    ball2.Posisition =  new Vector(cw/2,ch/2);

function gameLoop() {
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