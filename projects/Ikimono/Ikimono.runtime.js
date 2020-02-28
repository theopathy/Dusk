updateCanvas(1280, 720); //SET GAME TO 720p
var _DEBUG  = true;
var Ikimono = []
console.log('%c Ikimono: Init ', 'background: #fba; color: #342');
console.log('%cIkimono: Counting Creatures...', 'background: #fba; color: #342');



var Httpreq = new XMLHttpRequest();
Httpreq.open("GET",_DEBUG ? "creatures/fake-compile.txt" : "creatures/compile.php" , false);
Httpreq.send(null);
Ikimono.creatures = JSON.parse(Httpreq.responseText);
Ikimono.countCreatures = Ikimono.creatures.length;

    console.log(Httpreq.responseText);
console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342',Ikimono.countCreatures);

