updateCanvas(1280, 720); //SET GAME TO 720p
var _DEBUG  = true;
var Ikimono = []
console.log('%c Ikimono: Init ', 'background: #fba; color: #342');
console.log('%cIkimono: Counting Creatures...', 'background: #fba; color: #342');



var Httpreq = new XMLHttpRequest();
Httpreq.open("GET",_DEBUG ? "creatures/fake-compile.txt" : "creatures/compile.php" , false);
Httpreq.send(null);
Ikimono.creaturesJSONPATH = JSON.parse(Httpreq.responseText);
Ikimono.countCreaturesj = Ikimono.creaturesJSONPATH.length;
Ikimono.creatures = [];
Ikimono.countCreatures = 0;
Ikimono.creaturesJSONPATH.forEach(function (creat) {

   fetch("creatures/"+creat)
   .then(res => {return res.text();})
  .then(data => {   var imonos = JSON5.parse(data);
    Ikimono.creatures[imonos.Name] = imonos;  
    Ikimono.countCreatures++;
    if (Ikimono.countCreatures == Ikimono.countCreaturesj) _goto(); 
}); 

})

function _goto() {
    console.log('%cIkimono: Registered Creatures: %s ', 'background: #fba; color: #342',Ikimono.countCreatures);

}