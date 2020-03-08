var canvas = document.getElementById('canvas');
var canvas2 = document.getElementById('text');
console.log('%c DUSK: Init ', 'background: #222; color: #bada55');




////// EVENTS
var q = {}
var onKeyDown = new CustomEvent('KeyDown', { detail: { key: q.key } });
var onKeyUp = new Event('KeyUp');
function RegisterEvent(id, func) {
  canvas.addEventListener(id, function (e) { func(e) }, false);
}
/// STOP
//RegisterEvent("KeyDown",function(k) {})
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  window.cancelAnimationFrame =
    window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

function loadImagelf(path) {
  var i = new Image();
  i.src = path;
  return i;
}

function loadImage(url) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]));

  // let's assume all images are not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  var textureInfo = {
    width: 1,   // we don't know the size until it loads
    height: 1,
    texture: tex,
  };
  var img = new Image();
  img.addEventListener('load', function () {
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  });

  img.src = url;

  return textureInfo;
}


function RENDER_CHILD() {


}

function updateCanvas(a, b) {
  cw = a;
  ch = b;
}
var logKey = false
function setFPS(f) {
  fps = f;
  interval = 1000 / f;
}
var cw = 1280,
  ch = 720,
  cx = null,
  CanvasEnableClear = true,
  fps = 90,
  interval = 1000 / fps,
  lastTime = (new Date()).getTime(),
  currentTime = 0,
  delta = 0;
function randomColor(Bits) { return "#" + ((1 << (Bits !== undefined ? Bits : 24)) * Math.random() | 0).toString(16) }


// MOUSE CODE START
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  Mouse.x = evt.clientX - rect.left
  Mouse.y = evt.clientY - rect.top
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();

  Mouse.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
  Mouse.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
  return new Vector(Mouse.x,Mouse.y)
}
   

canvas.addEventListener('mousemove', function (evt) {
  Mouse._vector = getMousePos(canvas, evt);
}, false);
// MOUSE CODE END

canvas.addEventListener("keydown", doKeyDown);
canvas.addEventListener("keyup", doKeyUp);


if (canvas2) {
  canvas2.addEventListener('mousemove', function (evt) {
    Mouse._vector = getMousePos(canvas, evt);
  }, false);
  // MOUSE CODE END

  canvas2.addEventListener("keydown", doKeyDown);
  canvas2.addEventListener("keyup", doKeyUp);
}
KEYS = []
function doKeyDown(e) {


  KEYS[e.keyCode == 32 ? "space" : e.key] = true;
  q.key = e.keyCode == 32 ? "space" : e.key;
  canvas.dispatchEvent(onKeyDown);

}
function doKeyUp(e) {
  KEYS[e.keyCode == 32 ? "space" : e.key] = false;

}





var DT = 0;
var then = 0;
var CurrentTime = 0
var isPress = false
function render(time) {

  requestAnimationFrame(render);
  var now = time * 0.001;
  CurrentTime = (now);
  var deltaTime = Math.min(0.1, now - then);
  then = now;
  RENDER_CHILD();


  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.clearColor(0, 0, 0, 1);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


  DrawStack(deltaTime);
  DT = deltaTime;
  //  setTimeout( function() {

    isPress = false

  // }, 1000 / 60 );

}



cx = canvas.getContext('webgl');
var gl = cx;

var program = webglUtils.createProgramFromScripts(gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

// lookup uniforms
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
var textureLocation = gl.getUniformLocation(program, "u_texture");

// Create a buffer.
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put a unit quad in the buffer
var positions = [
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Create a buffer for texture coords
var texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Put texcoords in the buffer
var texcoords = [
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);


function drawImage(
  tex, dstX, dstY,
  texWidth, texHeight, dstWidth, dstHeight) {
  if (dstWidth === undefined) {
    dstWidth = texWidth;
  }

  if (dstHeight === undefined) {
    dstHeight = texHeight;
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);

  // Tell WebGL to use our shader program pair
  gl.useProgram(program);

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // this matirx will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, dstX, dstY, 0);

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0);

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loadImageAndCreateTextureInfo(url) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]));

  // let's assume all images are not a power of 2

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  var textureInfo = {
    width: 1,   // we don't know the size until it loads
    height: 1,
    texture: tex,
  };
  var img = new Image();
  img.addEventListener('load', function () {
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  });
  img.src = url;

  return textureInfo;
}



requestAnimationFrame(render);


//DusK: Sound Engine

console.log('%cD%cU%cS%cK%c : SOUND_ENGINE.init ', 'background: #f0f;', 'background: #0a0;', 'background: #aa0;', 'background: #024', 'background: #fb5; color: #342');

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext()

async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}

let offset = 0;

function playTrack(audioBuffer) {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(audioCtx.destination)

  if (offset == 0) {
    trackSource.start();
    offset = audioCtx.currentTime;
  } else {
    trackSource.start(0, audioCtx.currentTime - offset);
  }

  return trackSource;
}