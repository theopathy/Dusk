updateCanvas(1280,720);//SET GAME TO 720p
cx.imageSmoothingEnabled = false;
function lerp (start, end, amt){
    return (1-amt)*start+amt*end
  }

        function deg2Rads(degrees) {
            return Math.PI / 180 * degrees
        }  

        var fxx = "assets/images/frames/";
        var UI_HEART_EMPTY = loadImage(fxx+"ui_heart_empty.png");
        var UI_HEART_HALF  = loadImage(fxx+"ui_heart_half.png");
        var UI_HEART_FULL  = loadImage(fxx+"ui_heart_full.png");
        function loadMultipleFrames(namframes) {
            
        }
        var heartdist = 16*3
        class entity_UI extends Entity {
           constructor() {
               super()
               this.DrawOverride = true;
           }
            PostDraw() {
                var i;
                var allEmpty = false;
                for (i = 0; i<player.MaxHealth; i=i+2) {
               
            //    cx.drawImage((allempty?UI_HEART_EMPTY, 6+(i/2 * heartdist),6,heartdist,heartdist);
            }
            }
        }
        class entity_player extends Entity {
            MaxSpeed = 400; 
            Speed = 0;
            MaxHealth = 6;
            Health = 6;
            keys = {
                forward: "w",
                left: "a",
                right: "d",
                reverse: "s",
                space: "space"
            }

            Width = 16*3;
            Height = 28*3;

            fireFrame = 0;
            fireOpactity = 1;
            fireframeMax = 60;
            _imageoffset = new Vector(0, 32);
            constructor(a) {
                super(a);          
                
                

                var frameData = new FrameData()
                frameData.Image = [loadImage(fxx+"knight_f_idle_anim_f0.png"),
                loadImage(fxx+"knight_f_idle_anim_f1.png"),
                loadImage(fxx+"knight_f_idle_anim_f2.png"),
                loadImage(fxx+"knight_f_idle_anim_f3.png")];
                frameData.FrameDelay = 5;
                this.FrameData["idle"] = frameData;

                var frameData = new FrameData()
                frameData.Image = [loadImage(fxx+"knight_f_idle_anim_f0.png"),
                loadImage(fxx+"knight_f_idle_anim_f1.png"),
                loadImage(fxx+"knight_f_idle_anim_f2.png"),
                loadImage(fxx+"knight_f_idle_anim_f3.png")];
                frameData.FrameDelay = 5;
                this.FrameData["walk"] = frameData;

                this.Animation = "idle";
            }
            XSpeed = 0; 
            YSpeed = 0;
            PreDraw() {
                var speedGain = 1200; 
               
                if (KEYS[this.keys.forward] ? !KEYS[this.keys.reverse] : KEYS[this.keys.reverse])//XOR
                    this.YSpeed = Math.min(this.MaxSpeed,(this.YSpeed + 1)*15.5);
                else 
                    this.YSpeed = 0;

                if (KEYS[this.keys.right] ? !KEYS[this.keys.left] : KEYS[this.keys.left]) //XOR 
                    this.XSpeed = Math.min(this.MaxSpeed,((this.XSpeed + 1)*15.5));
                else 
                    this.XSpeed = 0;
                this.Posisition = new Vector(
                    this.Posisition.x + this.XSpeed*delta * ((KEYS[this.keys.right] ) ? 1 : -1) ,
                    this.Posisition.y + (this.YSpeed*delta * ((KEYS[this.keys.reverse] ) ? 1 : -1) ));

                    if (this.XSpeed > 0) this.FlipImage = !KEYS[this.keys.right];
                    
            }
            PostDraw() {
            
            }
        }






        player = new entity_player();
        UI = new entity_UI();
