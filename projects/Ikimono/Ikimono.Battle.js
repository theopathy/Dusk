function DrawOverlayedText(text, x, y) {
    ctx.fillStyle = "#707070";
    ctx.fillText(text, x + 2, y + 2);
    ctx.fillStyle = "#404040";
    ctx.fillText(text, x, y);
    
}
function DrawOverlayedText_getWidth(text, x, y) {
    ctx.fillStyle = "#707070";
    ctx.fillText(text, x + 2, y + 2);
    ctx.fillStyle = "#404040";
    ctx.fillText(text, x, y);
    return ctx.measureText(text).width;
}
var emptyXY = {
    x: 0,
    y: 0
}; // instead of creating one every frame cache it instead.
function DrawBoxClick(text, x, y, width, height, textoffset, f, n) {
    ctx.fillStyle = "#707070";
    textoffset = textoffset || emptyXY;
    ctx.fillText(text, x + 2 + textoffset.x, y + 2 + textoffset.y);
    ctx.fillStyle = "#404040";
    if (Mouse.x > x && Mouse.x < x + width && Mouse.y > y - 32 && Mouse.y < y + height) {
        ctx.fillStyle = "#020";
        if (isPress) {
            f(n);
            audio.battle_click.play();
            isPress = false;
        }
    }

    ctx.fillText(text, x + textoffset.x, y + textoffset.y);
}

function DrawBoxClickTextWidth(text, x, y, height, f, n) {

    ctx.fillStyle = "#404040";
    let xw = ctx.measureText(text).width;
    var c = Mouse.y - 5
    if (Mouse.x > x && Mouse.x < x + xw && c > y - 32 && c < y + height) {
        ctx.fillStyle = "#020";
        if (isPress) {
            f(n);
            audio.battle_click.play();
            isPress = false;
        }
    }

    ctx.fillText(text, x, y);
    ctx.fillStyle = "#404040";
}
var ACTIVE_BATTLE = null;


class Battle extends Entity {
    Player = "Purrlit";

    constructor() {
        super()
        this.DrawOverride = true;
        console.log()
        this.Party = [];
        this.Party.push(new Creature(randomKey(Ikimono.creatures), Math.getRandomInt(1, 9)));
        this.Party[0].Shiny = Math.getRandomInt(1, 512) == 1

        this.BattleText = `A random ${this.Attacker.Species}\nhas appeared!`;
        ACTIVE_BATTLE = this;
        this.TextOffset = {
            x: 0,
            y: 44
        }
        playMusic(music.battle_wild);


    }

    BounceIkimono = 0;
    Transition_State = 0;
    Transtion_Value = 0;

    MoveBuffer;

    get Attacker() {
        return this.Party[0]; // TO IMPLEMENT
    }
    AnimationTick = 0;
    DelayBetweenAttacks = 0;
    AnimationPlaying = "";

    AnimationIsPlayerAttacking = true;

    CurrentTextLines = [];
    CurrentBattleText = "";
    AttackPhase = 0;
    NextTimeEvent = 0;
    CurrentState = 0;
    DealingWithDeath = 0;
    PreDraw() {
        ctx.font = "24px  'Press Start 2P'"
        if (this.CurrentState == 1) {
            DrawBoxClick("ATTACK", 600, 600, 180, 50, this.TextOffset, function (n) {
                n.CurrentState = 2
            }, this);
            DrawBoxClick("ITEMS", 790, 600, 120, 50, this.TextOffset, () => alert("ITEMS  / NOT IMPLEMENTED"));
            DrawBoxClick("SWITCH", 960, 600, 160, 50, this.TextOffset, () => alert("SWITCH / NOT IMPLEMENTED"));
            DrawBoxClick("FLEE", 1150, 600, 160, 50, this.TextOffset, function (n) {
                ACTIVE_BATTLE.delete();
                ACTIVE_BATTLE = null;
                playMusic(music.town);
            });
        }

        if (this.CurrentState == 2 && this.AttackPhase == 0) {
            DrawBoxClickTextWidth(PARTY.active().Moves[0], 600, 620, 20, function (n) {
                n.MoveBuffer = PARTY.active().Moves[0];
                n.AttackPhase = 1;
            }, this);

            if (PARTY.active().Moves[1])
                DrawBoxClickTextWidth(PARTY.active().Moves[1], 950, 620, 20, function (n) {
                    n.MoveBuffer = PARTY.active().Moves[1];
                    n.AttackPhase = 1;
                }, this);
            ///DrawBoxClickTextWidth("QUICK ATTACK",    950,    620,        20,  () => alert("ITEMS  / NOT IMPLEMENTED")); 
            if (PARTY.active().Moves[2])
                DrawBoxClickTextWidth(PARTY.active().Moves[2], 600, 684, 20, function (n) {
                    n.MoveBuffer = PARTY.active().Moves[2];
                    n.AttackPhase = 1;
                }, this);
            ///DrawBoxClickTextWidth("DRAGON BREATH",    950,    684,       20,   () => alert("ITEMS  / NOT IMPLEMENTED")); 

            ctx.font = "16px  'Press Start 2P'"
            ctx.fillText("NORMAL", 600, 640);
            if (isPress) this.CurrentState = 1;
        }

        if (this.Attacker.HP <= 0 && this.DealingWithDeath == 0) {
            playMusic(music.fanfare);
            this.DealingWithDeath = 1;
            this.AttackPhase = 3
        };

        if (this.MoveBuffer && (this.AttackPhase == 1 || this.AttackPhase == 2) && this.AnimationTick == 0) {


            var enemySpeed = this.Attacker.Speed;
            var playerSpeed = PARTY.active().Speed * (PLAYER_SPEED_MULT);
            var isFirst = !(enemySpeed <= playerSpeed)



            this.AnimationIsPlayerAttacking = this.AttackPhase == 1 ? isFirst : !isFirst;
            this.AnimationPlaying = this.AnimationIsPlayerAttacking ? this.Attacker.Moves[1] : this.MoveBuffer;



            //this.DelayBetweenAttacks = Math.max(DelayBetweenAttacks - 1,0)




        }

    }


    Draw(dt) {

        this.Transtion_Value = Math.min(this.Transtion_Value + (0.019 * dt * 60), 1)
        if (this.Transtion_Value == 1 && this.CurrentState == 0) this.CurrentState = 1;

        ctx.font = "24px  'Press Start 2P'"
        ctx.fillStyle = "white";

        if (this.NextTimeEvent < CurrentTime) {
            this.CurrentBattleText += this.BattleText.charAt(this.CurrentBattleText.length);
            if (this.BattleText.charAt(this.CurrentBattleText.length) != " ")
                this.NextTimeEvent = CurrentTime + 0.04;
            this.CurrentTextLines = this.CurrentBattleText.split('\n');
        }
        for (var i = 0; i < this.CurrentTextLines.length; i++)
            ctx.fillText(this.CurrentTextLines[i], 32, 605 + (i * 32));

    }
    PostDraw(dt) {

        var offsetsDraw = {
            attacker: {
                x: 0,
                y: 0,
            },
            defender: {
                x: 0,
                y: 0,
            }
        }


        if (this.AnimationPlaying != "") {
            this.AnimationTick++;
            if (this.AnimationTick > ANIMATION[this.AnimationPlaying].Duration) {
                this.AnimationPlaying = "";
                this.AnimationTick = 0;
                if (this.AttackPhase == 1) this.AttackPhase = 2;
                else this.AttackPhase = 0;
            } else {
                offsetsDraw = ANIMATION[this.AnimationPlaying].tick(offsetsDraw, this.AnimationTick, this.AnimationIsPlayerAttacking ? PARTY.active() : this.Attacker, !(this.AnimationIsPlayerAttacking) ? PARTY.active() : this.Attacker, );
                if (this.AnimationIsPlayerAttacking) {
                    // var attackingvalue = offsetsDraw.attacker;
                    //offsetsDraw.attacker = offsetsDraw.defender;
                    //offsetsDraw.defender = attackingvalue;
                    offsetsDraw.attacker = [offsetsDraw.defender, offsetsDraw.defender = offsetsDraw.attacker][0]; // swap values
                    offsetsDraw.defender.x *= -0.5
                }

            }
        }


        var _b = (Math.sin(this.BounceIkimono / 1.1) * 3);
        drawImage(BATTLE.texture, -8, -178, 1288, 728);
        this.BounceIkimono = ((5 * DT) + this.BounceIkimono) % 360;

        drawImage(BATTLE_GRASS_BASE.texture, lerp(-725, 675, this.Transtion_Value), 280, 128 * 4, 32 * 4)

        let ATTACKER_DO_STATUS_EFFECT = 0;
        let PLAYER_DO_STATUS_EFFECT = 0;
        var Attacker = {
            x: lerp(-700, 750, this.Transtion_Value) + offsetsDraw.defender.x,
            y: -10 + offsetsDraw.defender.y
        }
        if (ATTACKER_DO_STATUS_EFFECT) {
            gl.enable(gl.STENCIL_TEST);
            // set the stencil to 1 everwhere we draw a pixel
            gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
            gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
            // don't render pixels
            gl.colorMask(false, false, false , false);
  
            drawImageSplit(FRONT_FACING_SPRITES.texture,FRONT_FACING_SPRITES.width,FRONT_FACING_SPRITES.height,80*(this.Attacker.Number%3),80*Math.floor(this.Attacker.Number/3),80,80,Attacker.x, Attacker.y,400,400)
            // only draw if the stencil = 1
            gl.stencilFunc(gl.EQUAL, 1, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

            // render pixels
            gl.colorMask(true, true, true, true);

            drawImageSplit(FRONT_FACING_SPRITES.texture,FRONT_FACING_SPRITES.width,FRONT_FACING_SPRITES.height,80*(this.Attacker.Number%3),80*Math.floor(this.Attacker.Number/3),80,80,Attacker.x, Attacker.y,400,400,this.Attacker.Shiny ? this.Attacker.data.Hue : 0)
            drawImage(statuseffect.texture, Attacker.x, Attacker.y + (now * 100 % 400), 400, 400);
            drawImage(statuseffect.texture, Attacker.x, Attacker.y + (now * 100 % 400) - 400, 400, 400);
            
            //drawImage(statuseffect.texture, 0,  ((now%40)*40), 1280, 720);
            gl.disable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_TEST);
        } else     
        //drawImageSplit(this.Attacker.data["frontImage"].texture, Attacker.x, Attacker.y, 400, 400,null,null, this.Attacker.data.shiny || 0);
          
        drawImageSplit(FRONT_FACING_SPRITES.texture,FRONT_FACING_SPRITES.width,FRONT_FACING_SPRITES.height,80*(this.Attacker.Number%3),80*Math.floor(this.Attacker.Number/3),80,80,Attacker.x, Attacker.y,400,400,this.Attacker.Shiny ? this.Attacker.data.Hue : 0)
        
      
        drawImage(BATTLE_GRASS_BASE.texture, lerp(1284, 0, this.Transtion_Value), 500, 128 * 5, 32 * 5)

       var vPlayer = {x: lerp(1280, -4, this.Transtion_Value) + offsetsDraw.attacker.x,y: 105 + _b + 10 + offsetsDraw.attacker.y}
       if (PLAYER_DO_STATUS_EFFECT) {
        gl.enable(gl.STENCIL_TEST);
        // set the stencil to 1 everwhere we draw a pixel
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
        // don't render pixels
        gl.colorMask(false, false, false, false);

        drawImageSplit(BACK_FACING_SPRITES.texture, BACK_FACING_SPRITES.width, BACK_FACING_SPRITES.height,122*(PARTY.active().Number%16),89*Math.floor(PARTY.active().Number/16),122,89,vPlayer.x,vPlayer.y,610, 445);
        // only draw if the stencil = 1
        gl.stencilFunc(gl.EQUAL, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        // render pixels
        gl.colorMask(true, true, true, true);

        drawImageSplit(BACK_FACING_SPRITES.texture, BACK_FACING_SPRITES.width, BACK_FACING_SPRITES.height,122*(PARTY.active().Number%16),89*Math.floor(PARTY.active().Number/16),122,89,vPlayer.x,vPlayer.y,610, 445);
        drawImage(statuseffect.texture, vPlayer.x, vPlayer.y + (now * 100 % 445), 610, 445);
        drawImage(statuseffect.texture, vPlayer.x, vPlayer.y + (now * 100 % 445) - 400, 610, 445);


        gl.disable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_TEST);
       }
       else drawImageSplit(BACK_FACING_SPRITES.texture, BACK_FACING_SPRITES.width, BACK_FACING_SPRITES.height,122*(PARTY.active().Number%16),89*Math.floor(PARTY.active().Number/16),122,89,vPlayer.x,vPlayer.y,610, 445);
       //BACK_FACING_SPRITES vPlayer.x,vPlayer.y, 610, 445
        
        
        
        
        
        
        
        
        
        if (this.AnimationPlaying != "" && ANIMATION[this.AnimationPlaying].PostTick)
            ANIMATION[this.AnimationPlaying].PostTick(offsetsDraw, this.AnimationTick, this.AnimationIsPlayerAttacking ? PARTY.active() : this.Attacker, !(this.AnimationIsPlayerAttacking) ? PARTY.active() : this.Attacker, );


        drawImage(BANNER.texture, -8, 550, 1288, 170);
        drawImage(BOX.texture, 1280 - (180 * 4), 720 - (170), 180 * 4, 170);

        //PLAYER BOX
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        DrawOverlayedText(PARTY.active().nickname || PARTY.active().Species, 1280 - (104 * 4.5) + 50, 720 - (37 * 4.5) - 128 - _b)

        // ctx.fillText("UNDEFINED", 1280-(104*4.5) + 48, 720 - (37*4.5) - 130 - _b); 
        var maxhp = PARTY.active().maxHP;
        var hp = PARTY.active().HP;
        var p = hp / maxhp;
        var selectTexture = HPBAR.low;
        if (p > 0.5) selectTexture = HPBAR.high;
        else if (p > 0.25) selectTexture = HPBAR.med;
        DrawOverlayedText("Lv" + PARTY.active().Level, 1280 - 145, 720 - (37 * 4.5) - 130 - _b);
        DrawOverlayedText(hp + "/" + maxhp, 1280 - 220, 720 - (37 * 4.5) - 55 - _b);
        drawImage(HPBOX_PLAYER.texture, 1280 - (104 * 4.5) - 10, 720 - (37 * 4.5) - 180 - _b, 104 * 4.5, 37 * 4.5);
        drawImage(selectTexture.texture, 1280 - (104 * 4.5) + 206, 720 - 270 - _b - 0.1, 216 * p, 3.05 * 4.5);
        ctx.font = "22px  'Press Start 2P'"

        //ENEMY BOX
        drawImage(HPBOX_ENEMY.texture, 30, 30, 104 * 4.5, 37 * 4.5);

        maxhp = this.Attacker.maxHP;
        hp = this.Attacker.HP;
        p = hp / maxhp;
        selectTexture = HPBAR.low;
        if (p > 0.5) selectTexture = HPBAR.high;
        else if (p > 0.25) selectTexture = HPBAR.med;
        drawImage(selectTexture.texture, 213, 128, 224 * p, 17);
        let _wx = DrawOverlayedText_getWidth(this.Attacker.Species, 60, 80);
        DrawOverlayedText("Lv" + this.Attacker.Level , 330, 80);
        if (this.Attacker.Gender > 0)
        drawImageSplit(GENDER.texture,GENDER.width,GENDER.height,this.Attacker.Gender == 2 ? 20 : 0,0,20,24,_wx+60,48,40,40);


    }
}