tiles = [];
var fxx = "assets/images/frames/";
tiles["normal"] = basicFloor;
tiles["cracked01"] = loadImage(fxx + "floor_2.png");
tiles["cracked02"] = loadImage(fxx + "floor_3.png");
tiles["cracked03"] = loadImage(fxx + "floor_4.png");
tiles["cracked04"] = loadImage(fxx + "floor_5.png");
tiles["cracked05"] = loadImage(fxx + "floor_6.png");
tiles["cracked06"] = loadImage(fxx + "floor_7.png");
tiles["cracked06"] = loadImage(fxx + "floor_8.png");
var basicFloor = loadImage(fxx + "floor_1.png");
//var basicFloor = loadImage(fxx + "floor_ice.png"); Maybe could add ice floor?
var wall_mid = loadImage(fxx + "wall_mid.png");
var wall_left = loadImage(fxx + "wall_left.png");
var wall_right = loadImage(fxx + "wall_right.png");

var wall_top = loadImage(fxx + "wall_top_mid.png");
var wall_top_right = loadImage(fxx + "wall_top_right.png");
var wall_top_left = loadImage(fxx + "wall_top_left.png");

var wall_top = loadImage(fxx + "wall_top_mid.png");
var wall_left_border = loadImage(fxx + "wall_inner_corner_mid_left.png");
var wall_top_left = loadImage(fxx + "wall_top_left.png");
var wall_corner_bottom_left = (loadImage(fxx + "wall_corner_bottom_left.png"));
var wall_corner_bottom_right = (loadImage(fxx + "wall_corner_bottom_right.png"))

var wall_corner_top_left = (loadImage(fxx + "wall_corner_top_left.png"));
var wall_corner_top_right = (loadImage(fxx + "wall_corner_top_right.png"))
var wall_side_mid_right = loadImage(fxx + "wall_side_mid_right.png")
var wall_side_mid_left = loadImage(fxx + "wall_side_mid_left.png")

class dungeon extends Entity {
    constructor() {
        super();
        this.DrawOverride = true;
        this.Posisition = new Vector();
    }
    TilesWidth = 14;
    TilesHeight = 12;
    UniqueFloorTiles = [];
    Room = 0;
    IsFirstTimeEntering = true;
    Enemies = []
    Collsions = []
    get Width() {
        return this.TilesWidth * 48
    };
    get Height() {
        return this.TilesHeight * 48
    };
    set Width(a) {};
    set Height(a) {};
    Top_Wall = 0; // Removes walls from the center; 
    Bottom_Wall = 0;
    Right_Wall = 0; 
    Left_Wall = 0;
    dontdrawbottom = false;
    Doors = 0b1111; // Right to left order is, Right, Top Left Bottom. (1111) 
    Walls = 0b1111; // left, top, bottom, right
    Phys() {
        var x
        for (x in this.Collsions)
            this.Collsions[x].Phys();
        if ((player.Posisition.y+48 > this.Posisition.y && player.Posisition.y+48 < this.Posisition.y+this.Height) &&
        (player.Posisition.x+48 > this.Posisition.x && player.Posisition.x+24 < this.Posisition.x+this.Width) ) { 

        Camera.Posisition = Vector.lerp(Camera.Posisition , new Vector(this.Posisition.x - (1280/2) + (this.Width/2), this.Posisition.y - (720/2) + (this.Height/2)),4*delta)
            if (this.IsFirstTimeEntering) {
                this.IsFirstTimeEntering = false;
                console.log("spawn room "+this.Room)
                var pos=[new Vector(48*2,48*2).add(this.Posisition),
                    new Vector(48*2,48*2).add(this.Posisition).add(new Vector(0,this.Height - 96*2 -48)),
                    new Vector(48*2,48*2).add(this.Posisition).add(new Vector(this.Width - 96*2,this.Height - 96*2 -48)),
                    new Vector(48*2,48*2).add(this.Posisition).add(new Vector(this.Width - 96*2,0))];

                var i;
                    for (i = 0; i < this.Enemies.length; i++) {
                   if (this.Enemies[i] == "Zombie")  n = new entity_zombie();
                   if (this.Enemies[i] == "Demon")  n = new entity_demon();
                   if (this.Enemies[i] == "Ogre")  n = new entity_ogre();
                   if (this.Enemies[i]== "entity_demonogre") n = new entity_demonogre();
                   n.Posisition=pos[i];
                }

            }
    
    }
    }
    Generate() {
        //this.TilesWidth = 10 + (Math.getRandomInt(1, 5) * 2);

       // this.TilesHeight = 8 + (Math.getRandomInt(1, 3) * 2);

        var RanAmtOfTiles = 0;
        RanAmtOfTiles = Math.getRandomIntPower(0, this.TilesHeight * this.TilesWidth * 0.3, 3);
        // Ensures that only half of the tiles can be cracked, Weights lower numbers as well
        var maxAmountTiles = this.TilesWidth * this.TilesHeight;

        for (var n = 0; n < RanAmtOfTiles; n++)
            this.UniqueFloorTiles[Math.getRandomInt(1, maxAmountTiles)] = tiles["cracked0" + Math.getRandomInt(1, 6)];



    }
    DrawLowerWall() {

        if (bit.test(this.Walls, 2)) {
            var bordertop_lb = (this.TilesWidth / 2) - this.Bottom_Wall - 1,
                bordertop_up = (this.TilesWidth / 2) + this.Bottom_Wall;


        for (var i = 0; i < this.TilesWidth; i++) {
            for (var n = 0; n < this.TilesHeight; n++) {

                var posx = -Camera.Posisition.x + (i * 48) + this.Posisition.x;
                var posy = -Camera.Posisition.y + (n * 48) + this.Posisition.y;


                if (n == this.TilesHeight - 1 && !(i > bordertop_lb && i < bordertop_up)) {
                    var isLeftOrRightOrNone = (i == 0) ? wall_left : ((i == this.TilesWidth - 1) ? wall_right : wall_mid)
                    // var isLeftOrRightOrNone2 = (ni == 0) ? (n==0 ?  wall_corner_bottom_right: wall_corner_bottom_left) : ((i == this.TilesWidth - 1) ? (n==0 ?  wall_corner_top_right: wall_corner_top_left) : wall_top)
                    cx.drawImage(isLeftOrRightOrNone, posx, posy, 16 * 3, 16 * 3)

                    cx.drawImage(
                        n == 0 ? (i == 0 ? wall_corner_top_left : wall_corner_top_right) : wall_top

                        , posx, posy - 48, 16 * 3, 16 * 3)

                };



            }
            };
        };

        var x; for (x in this.Collsions) this.Collsions[x].Draw();//Debug Draw Collisions
        

    };
    PrepareCollision() {
        this.Collsions = [];

        //TOP WALL
        if (bit.test(this.Walls, 1)){
        if (this.Top_Wall > 0  ) {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = this.Posisition;
            c.Width = this.Width / 2 - (this.Top_Wall * 48);
            c.Height = 12;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 - (this.Top_Wall * 48), 0));
            c.Height = 12;
            c.Width = 2;
            c.IsVert = false;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 + (this.Top_Wall * 48), 0));
            c.Width = this.Width / 2 - (this.Top_Wall * 48);
            c.Height = 12;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 + (this.Top_Wall * 48), 0));
            c.Height = 12;
            c.Width = 2;
            c.IsVert = false;
        } else {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = this.Posisition;
            c.Width = this.Width;
            c.Height = 12;
        }
    }

        //Bottom WALL
        
        if (this.Bottom_Wall > 0&& bit.test(this.Walls, 2)) {
            
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(0, this.Height - (48 / 2)));
            c.Width = this.Width / 2 - (this.Bottom_Wall * 48);
            c.Height = 12;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 - (this.Bottom_Wall * 48), this.Height - (48 / 2)));
            c.Height = 12;
            c.Width = 2;
            c.IsVert = false;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 + (this.Bottom_Wall * 48), this.Height - (48 / 2)));
            c.Width = this.Width / 2 - (this.Bottom_Wall * 48);
            c.Height = 12;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width / 2 + (this.Bottom_Wall * 48), this.Height - (48 / 2)));
            c.Height = 12;
            c.Width = 2;
            c.IsVert = false;
        } else {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(0, this.Height - (48 / 2)));
            c.Width = this.Width;
            c.Height = 12;
        }
        //Right WALL
        if (bit.test(this.Walls, 3)) {
            var walloffset = bit.test(this.Walls, 1) ? - 0 : 34
        if (this.Right_Wall > 0) {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width - 12, walloffset));
            c.Height = this.Height / 2 - (this.Right_Wall * 48) - walloffset;
            c.Width = 12;
            c.IsVert = false;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width - 12, this.Height / 2 - (this.Right_Wall * 48)+walloffset));
            c.Height = 2;
            c.Width = 12;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width - 12, this.Height / 2 + (this.Right_Wall * 48)+walloffset));
            c.Height = this.Height / 2 - (this.Right_Wall * 48) - walloffset;
            c.Width = 12;
            c.IsVert = false;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width - 12, this.Height / 2 + (this.Right_Wall * 48)+walloffset));
            c.Height = 2;
            c.Width = 12;

        } else {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(this.Width - 12, walloffset));
            c.Height = this.Height-walloffset;
            c.Width = 12;
            c.IsVert = false;
        }
    }
        //Left WALL 
        if ( bit.test(this.Walls, 0)){
        var walloffset = bit.test(this.Walls, 1) ? - 0 : 34
        
        if (this.Left_Wall > 0 ) {
 
            var c = new dungeon_phys();
            this.Collsions.push(c);

            c.Posisition = Vector.add(this.Posisition, new Vector(0, walloffset));
            c.Height = this.Height / 2 - (this.Left_Wall * 48);
            c.Width = 12;
            c.IsVert = false;

            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(0, walloffset + (this.Height / 2 - (this.Left_Wall * 48))));
            c.Height = 2;
            c.Width = 12;

            c = new dungeon_phys();
            this.Collsions.push(c);

            c.Posisition = Vector.add(this.Posisition, new Vector(0, walloffset + (this.Height / 2 - (this.Left_Wall * 48))+this.Height / 2 - (this.Left_Wall * 48)));
            c.Height = this.Height / 2 - (this.Left_Wall * 48);
            c.Width = 12;

            c.IsVert = false;
            c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(0, walloffset + (this.Height / 2 - (this.Left_Wall * 48))+this.Height / 2 - (this.Left_Wall * 48)));
            c.Height = 2;
            c.Width = 12;

        } else {
            var c = new dungeon_phys();
            this.Collsions.push(c);
            c.Posisition = Vector.add(this.Posisition, new Vector(0, walloffset));
            c.Height = this.Height-walloffset;
            c.Width = 12;
            c.IsVert = false;
        }
    }
    }
    Draw() {
        var newTiles = 0;
        var lb = this.TilesHeight / 2 - this.Right_Wall,
        up = this.TilesHeight / 2 + this.Right_Wall + 1
        var lb_ = this.TilesHeight / 2 - this.Left_Wall,
        up_ = this.TilesHeight / 2 + this.Left_Wall + 1
        for (var n = 0; n < this.TilesHeight; n++) {
            for (var i = 0; i < this.TilesWidth; i++) {
                var posx = -Camera.Posisition.x + (i * 48) + this.Posisition.x;
                var posy = -Camera.Posisition.y + (n * 48) + this.Posisition.y;
                if (n > 0) {
                    if (n <= this.TilesHeight-2 || !(this.dontdrawbottom && n >= this.TilesHeight-1) )
                    cx.drawImage(this.UniqueFloorTiles[newTiles] ? this.UniqueFloorTiles[newTiles] : basicFloor, posx, posy, 16 * 3, 16 * 3)
                    newTiles = newTiles + 1;

                    
                    if ((i == 0) && (bit.test(this.Walls, 0)) && !(n > lb_ && n < up_)) {
                        cx.drawImage(wall_side_mid_right, posx, posy - 48, 16 * 3, 16 * 3)
                    } else if ((i == this.TilesWidth - 1) && (bit.test(this.Walls, 3)) && !(n > lb && n < up)) {
                        cx.drawImage(wall_side_mid_left, posx, posy - 48, 16 * 3, 16 * 3)
                    }
                }


                var bordertop_lb = (this.TilesWidth / 2) - this.Top_Wall - 1,
                    bordertop_up = (this.TilesWidth / 2) + this.Top_Wall
                if ((n == 0) && bit.test(this.Walls, 1) && !(i > bordertop_lb && i < bordertop_up)) {
                    var isLeftOrRightOrNone = (i == 0) ? wall_left : ((i == this.TilesWidth - 1) ? wall_right : wall_mid)

                    cx.drawImage(isLeftOrRightOrNone, posx, posy, 48, 48)

                    cx.drawImage(
                        n == 0 ? (i == 0 ? wall_corner_top_left : wall_corner_top_right) : wall_top

                        , posx, posy - 48, 48, 48)

                }


            }
        }
        if ((player.Posisition.y > this.Posisition.y + (48 * (this.TilesHeight - 2))))
            this.DrawLowerWall();
    }

    PostDraw() {
        if (!(player.Posisition.y > this.Posisition.y + (48 * (this.TilesHeight - 2))))
            this.DrawLowerWall();
    }
}
Nzera = []
Nzera.dungeon = []
Nzera.RoomCount = 0;
Nzera.generateWing = function(StartRoom, Direction, width=16, height =12) {
    var d = new dungeon();
    Nzera.RoomCount++
    d.Generate();
    d.TilesWidth = width;
    d.TilesHeight = height;
    d.Room = Nzera.RoomCount;
    switch (Direction) {
        case 1:
            d.Posisition = new Vector(StartRoom.Posisition.x + StartRoom.Width, StartRoom.Posisition.y + (StartRoom.Height / 2) - (d.Height / 2));
            d.Walls = bit.clear(d.Walls, 0);
            break;
        case 2:
            d.Posisition = new Vector(StartRoom.Posisition.x - d.Width, StartRoom.Posisition.y + (StartRoom.Height / 2) - (d.Height / 2));
            d.Walls = bit.clear(d.Walls, 3);
            break;
        case 3:
            d.Posisition = new Vector(StartRoom.Posisition.x + (StartRoom.Width / 2) - (d.Width / 2),
                StartRoom.Posisition.y + StartRoom.Height - 48);
            d.Walls = bit.clear(d.Walls, 1);
            break;
        case 5:

                d.Posisition = new Vector(StartRoom.Posisition.x + (StartRoom.Width / 2) - (d.Width / 2),
                StartRoom.Posisition.y - d.Height );
            d.Walls = bit.clear(d.Walls, 2);
            break;
        default:

                d.Posisition = new Vector(StartRoom.Posisition.x + (StartRoom.Width / 2) - (d.Width / 2),
                StartRoom.Posisition.y - d.Height +48+48 );
            d.Walls = bit.clear(d.Walls, 2);
            break;
            // code block
    }

    Nzera.dungeon[Nzera.dungeon.length] = d;
    PreviousDungeon = d;
    return d;
}
var StartRoom = new dungeon();
Nzera.generateDungeon = function() {

    var PreviousDungeon = [];
    PreviousDungeon.Posisition = new Vector(0, 0);
  
    
    StartRoom.Room = ++Nzera.RoomCount;
    StartRoom.Bottom_Wall = 2;
    StartRoom.Generate();
    StartRoom.Top_Wall = 2;
    StartRoom.Bottom_Wall = 2;
    StartRoom.Right_Wall = 2;
    StartRoom.Left_Wall = 2;
    StartRoom.TilesWidth=18;
    Nzera.dungeon[0] = StartRoom;
    StartRoom.Posisition = new Vector(-StartRoom.Width / 2, -StartRoom.Height / 2);
    var Direction = Math.getRandomInt(1, 4);
    var Rooms = 1 //Math.getRandomInt(2,4);
    for (var i = 0; i < Rooms; i++) {

       Nzera.generateWing(StartRoom, 1).Enemies = ["Zombie","Zombie","Zombie","Demon"];
       Nzera.generateWing(StartRoom, 2).Enemies = ["Ogre","Zombie","Demon","Demon"];
       Nzera.generateWing(StartRoom, 3).Enemies = ["Demon","Demon","Demon","Demon"];
      
       var corr1 = Nzera.generateWing(StartRoom, 0,4,12); 
     
       var corr2 = Nzera.generateWing(corr1, 0,4,6);
       var corr3 = Nzera.generateWing(corr2, 0,4,6); 
       corr1.Walls = 0b1101;    corr1.dontdrawbottom = true;corr1.Bottom_Wall = 2;
       corr2.Walls = 0b1101;    corr2.dontdrawbottom = true;corr2.Bottom_Wall = 2
       corr3.Walls = 0b1101;    corr3.dontdrawbottom = true;corr3.Bottom_Wall = 2

       var bossroom = Nzera.generateWing(corr3, 0,24,12,true); 
       bossroom.Walls = 0b1111;
       bossroom.Bottom_Wall=1; 
       bossroom.Enemies = ["entity_demonogre","","","entity_demonogre"]
    }

}
Nzera.generateDungeon();
setTimeout(function(){
    for (i  in Nzera.dungeon) 
    Nzera.dungeon[i].PrepareCollision();
}, 10);


var doorclosed = loadImage(fxx + "doors_all.png")
var dooropened = loadImage(fxx + "doors_all_open.png")
 class entity_door extends Entity { 
constructor() {
    super();
    this.FrameData["idle"] = new FrameData();
    this.FrameData["idle"].Image = [doorclosed];
this.Animation = "idle";this.Width=48*4,this.Height=48*2;
this.Posisition=new Vector(-48*2,-48*7);
this.Physics.buildVertexMap(true);
this.IsVert = true
}
Phys() {
    if (enemyKillCount <= 0) {
        StartRoom.IsFirstTimeEntering = true;
        StartRoom.Enemies = ["Zombie","Zombie","Demon","Zombie"]
        this.delete()};
    if (IsOverlap(this.Physics,player.Physics)) {       
        if (this.IsVert )
           player.Posisition._y = player.PreviousPosition.y;
      
        else
           player.Posisition._x = player.PreviousPosition.x;
    }
} 
}

 var door = new entity_door();