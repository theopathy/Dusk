updateCanvas(1280, 720); //SET GAME TO 720p
cx.imageSmoothingEnabled = false;



var UI_HEART_EMPTY = loadImage(fxx + "ui_heart_empty.png");
var UI_HEART_HALF = loadImage(fxx + "ui_heart_half.png");
var UI_HEART_FULL = loadImage(fxx + "ui_heart_full.png");


var weapon_knight_sword = loadImage(fxx+"weapon_knight_sword.png")


var heartdist = 16 * 3

class dungeon_phys extends Entity {
    constructor() {
        super(false);
        this.ZIndex=10; 
        this.DrawOverride = true;
        this.Physics.buildVertexMap(true);
        this.IsVert = true
    }
   
     
        
      Draw() {
          return;
        cx.beginPath();
        cx.fillStyle = "rgba(100,35,35,0.4)";
        cx.rect(-Camera.Posisition.x+this.Posisition.x, -Camera.Posisition.y+this.Posisition.y, this.Width, this.Height);
        cx.fill();
        cx.stroke();
    
        
        cx.restore();
      }  
    
Phys() {

    
    



    if (IsOverlap(this.Physics,player.Physics)) {       
      if (this.IsVert )
         player.Posisition._y = player.PreviousPosition.y;
    
      else
         player.Posisition._x = player.PreviousPosition.x; 

      //  Camera.Posisition = Vector.add(player.Posisition, new Vector((-1280 / 2) + player.Width / 2, (-720 / 2) + (player.Height / 1.2)));
        
    }
}

}




class entity_UI extends Entity {
    constructor() {
        super()
        this.DrawOverride = true;
    }
    PostDraw() {
        var i;
        var allEmpty = false;
        for (i = 0; i < player.MaxHealth; i = i + 2) {
            if (i < player.Health)
                cx.drawImage((i + 1 < player.Health) ? UI_HEART_FULL : UI_HEART_HALF, 6 + (i / 2 * heartdist), 6, heartdist, heartdist);
            else
                cx.drawImage(UI_HEART_EMPTY, 6 + (i / 2 * heartdist), 6, heartdist, heartdist);
        }
    }
}


 






player = new entity_player_knight();
player.ZIndex = 5;
UI = new entity_UI();   

//layout2 = new dungeon();