var circleRadius = 120
console.log(noob); 
class entity_player extends Entity {
    customAngle = 0;
	Draw() {
		cx.save();
		var objx = this.Posisition.x + (0.5 * 48); // x of shape center
		var objy = this.Posisition.y + (0.5 * 48); // y of shape center
		
	
		cx.translate(objx, objy)


		cx.rotate(this.Rotation * (Math.PI / 180))
        cx.translate(-objx, -objy)
        cx.beginPath();
        cx.fillStyle = this.color;
		cx.rect(this.Posisition.x, this.Posisition.y, 48, 48);
        cx.fill();
        cx.stroke();
        cx.beginPath();
        cx.fillStyle = "#dd4";
		cx.rect(this.Posisition.x+3, this.Posisition.y+3, 42, 42);
        cx.fill();
        
        cx.restore();
     

	}
	PreDraw() {
        var speed = 0.269;
        this.customAngle = this.customAngle + (KEYS["d"] ? (delta*speed) : KEYS["a"] ? (delta*-speed) : 0 );

        var localCircleRadius =circleRadius; 
		this.Posisition = new Vector(
            (cw/2-24)+(Math.cos(this.customAngle*Math.PI/180)*(localCircleRadius)),
            (ch/2-24)+(Math.sin(this.customAngle*Math.PI/180)*(localCircleRadius))
            
            );
            this.Rotation = this.customAngle;
           
	}
}

class entity_planet extends Entity {

	Draw() {
		cx.beginPath();
		cx.fillStyle = "Green";
		cx.arc(cw/2, ch/2, circleRadius, 0, Math.PI * 360);
        cx.fill();
        cx.stroke();
		cx.beginPath();
		cx.fillStyle = "Lime";
		cx.arc(cw/2, ch/2, circleRadius-8, 0, Math.PI * 360);
        cx.fill();
	}

}


planet = new entity_planet();
player = new entity_player();

