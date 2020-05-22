

var IKIMONO_MOVESET = []
var ENUM = [];
ENUM.ATTACK = 0;
ENUM.SPECIAL = 1;

const NORMAL    = 0;
const FIGHTING  = 1;
const FLYING    = 2;
const POISON    = 3;
const GROUND    = 4;
const ROCK      = 5;
const BUG       = 6;
const GHOST     = 7;
const STEEL     = 8;
const FIRE      = 9;
const WATER     = 10;
const GRASS     = 11;
const ELECTRIC  = 12;
const PSYCHIC   = 13;
const ICE       = 14;
const DRAGON    = 15;
const DARK      = 16;
const TYPE_MASK = {
NORMAL    : 0,
FIGHTING  : 1,
FLYING    : 2,
POISON    : 3,
GROUND    : 4,
ROCK      : 5,
BUG       : 6,
GHOST     : 7,
STEEL     : 8,
FIRE      : 9,
WATER     : 10,
GRASS     : 11, 
ELECTRIC  : 12,
PSYCHIC   : 13,
ICE       : 14,
DRAGON    : 15,
DARK      : 16,
0   : 0  , 
1   : 1  ,
2   : 2  ,
3   : 3  ,
4   : 4  ,
5   : 5  ,
6   : 6  ,
7   : 7  ,
8   : 8  ,
9   : 9  ,
10  : 10,
11  : 11,
12  : 12,
13  : 13,
14  : 14,
15  : 15,
16  : 16
}
const WEAKNESS  = 2;
const NEUTRAL   = 1;
const STRENGTH  = 0.5;
const INMMUNE   = 0;

const TYPES ={
    [NORMAL]: {
       [NORMAL  ]	: 	NEUTRAL,
       [FIGHTING]	: 	WEAKNESS,
       [FLYING  ]	: 	NEUTRAL,
       [POISON  ]	: 	NEUTRAL,
       [GROUND  ]	: 	NEUTRAL,
       [ROCK    ]	: 	NEUTRAL,
       [BUG     ]	: 	NEUTRAL,
       [GHOST   ]	: 	INMMUNE,
       [STEEL   ]	: 	NEUTRAL,
       [FIRE    ]	: 	NEUTRAL,
       [WATER   ]	: 	NEUTRAL,
       [GRASS   ]	: 	NEUTRAL,
       [ELECTRIC]	: 	NEUTRAL,
       [PSYCHIC ]	: 	NEUTRAL,
       [ICE     ]	: 	NEUTRAL,
       [DRAGON  ]	: 	NEUTRAL,
       [DARK  	]	: 	NEUTRAL,		
},     

    [FIGHTING]: {
        [NORMAL  ]	: 	NEUTRAL,
        [FIGHTING]	: 	NEUTRAL,
        [FLYING  ]	: 	WEAKNESS,
        [POISON  ]	: 	NEUTRAL,
        [GROUND  ]	: 	NEUTRAL,
        [ROCK    ]	: 	STRENGTH,
        [BUG     ]	: 	STRENGTH,
        [GHOST   ]	: 	NEUTRAL,
        [STEEL   ]	: 	NEUTRAL,
        [FIRE    ]	: 	NEUTRAL,
        [WATER   ]	: 	NEUTRAL,
        [GRASS   ]	: 	NEUTRAL,
        [ELECTRIC]	: 	NEUTRAL,
        [PSYCHIC ]	: 	WEAKNESS,
        [ICE     ]	: 	NEUTRAL,
        [DRAGON  ]	: 	NEUTRAL,
        [DARK  	]	: 	STRENGTH,		
    },   
    [FLYING]: {
        [NORMAL  ]	: 	NEUTRAL,
        [FIGHTING]	: 	STRENGTH,
        [FLYING  ]	: 	NEUTRAL,
        [POISON  ]	: 	NEUTRAL,
        [GROUND  ]	: 	INMMUNE,
        [ROCK    ]	: 	WEAKNESS,
        [BUG     ]	: 	STRENGTH,
        [GHOST   ]	: 	NEUTRAL,
        [STEEL   ]	: 	NEUTRAL,
        [FIRE    ]	: 	NEUTRAL,
        [WATER   ]	: 	NEUTRAL,
        [GRASS   ]	: 	STRENGTH,
        [ELECTRIC]	: 	WEAKNESS,
        [PSYCHIC ]	: 	NEUTRAL,
        [ICE     ]	: 	WEAKNESS,
        [DRAGON  ]	: 	NEUTRAL,
        [DARK  	]	: 	NEUTRAL,		
    },
    [POISON]: {
        [NORMAL  ]	: 	NEUTRAL,
        [FIGHTING]	: 	STRENGTH,
        [FLYING  ]	: 	NEUTRAL,
        [POISON  ]	: 	STRENGTH,
        [GROUND  ]	: 	WEAKNESS,
        [ROCK    ]	: 	NEUTRAL,
        [BUG     ]	: 	STRENGTH,
        [GHOST   ]	: 	NEUTRAL,
        [STEEL   ]	: 	NEUTRAL,
        [FIRE    ]	: 	NEUTRAL,
        [WATER   ]	: 	NEUTRAL,
        [GRASS   ]	: 	STRENGTH,
        [ELECTRIC]	: 	NEUTRAL,
        [PSYCHIC ]	: 	WEAKNESS,
        [ICE     ]	: 	NEUTRAL,
        [DRAGON  ]	: 	NEUTRAL,
        [DARK  	]	: 	NEUTRAL,		
    },
    [GROUND]: {
        [NORMAL  ]	: 	NEUTRAL,
        [FIGHTING]	: 	NEUTRAL,
        [FLYING  ]	: 	NEUTRAL,
        [POISON  ]	: 	STRENGTH,
        [GROUND  ]	: 	NEUTRAL,
        [ROCK    ]	: 	STRENGTH,
        [BUG     ]	: 	NEUTRAL,
        [GHOST   ]	: 	NEUTRAL,
        [STEEL   ]	: 	NEUTRAL,
        [FIRE    ]	: 	NEUTRAL,
        [WATER   ]	: 	WEAKNESS,
        [GRASS   ]	: 	WEAKNESS,
        [ELECTRIC]	: 	INMMUNE,
        [PSYCHIC ]	: 	NEUTRAL,
        [ICE     ]	: 	WEAKNESS,
        [DRAGON  ]	: 	NEUTRAL,
        [DARK  	]	: 	NEUTRAL,		
    },
    [ROCK]: {
        [NORMAL  ]	: 	STRENGTH,
        [FIGHTING]	: 	WEAKNESS,
        [FLYING  ]	: 	STRENGTH,
        [POISON  ]	: 	STRENGTH,
        [GROUND  ]	: 	WEAKNESS,
        [ROCK    ]	: 	NEUTRAL,
        [BUG     ]	: 	NEUTRAL,
        [GHOST   ]	: 	NEUTRAL,
        [STEEL   ]	: 	WEAKNESS,
        [FIRE    ]	: 	STRENGTH,
        [WATER   ]	: 	WEAKNESS,
        [GRASS   ]	: 	WEAKNESS,
        [ELECTRIC]	: 	NEUTRAL,
        [PSYCHIC ]	: 	NEUTRAL,
        [ICE     ]	: 	NEUTRAL,
        [DRAGON  ]	: 	NEUTRAL,
        [DARK  	]	: 	NEUTRAL,		
    },

    [PSYCHIC]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     STRENGTH,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     WEAKNESS,
        [GHOST   ]    :     WEAKNESS,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     NEUTRAL,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     NEUTRAL,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     STRENGTH,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     WEAKNESS
     },
 
     [ICE]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     WEAKNESS,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     WEAKNESS,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     WEAKNESS,
        [FIRE    ]    :     WEAKNESS,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     NEUTRAL,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     STRENGTH,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [DRAGON]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     NEUTRAL,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     STRENGTH,
        [WATER   ]    :     STRENGTH,
        [GRASS   ]    :     STRENGTH,
        [ELECTRIC]    :     STRENGTH,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     WEAKNESS,
        [DRAGON  ]    :     WEAKNESS,
        [DARK    ]    :     NEUTRAL
     },
 
     [DARK]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     WEAKNESS,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     WEAKNESS,
        [GHOST   ]    :     STRENGTH,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     NEUTRAL,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     NEUTRAL,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     INMMUNE,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     STRENGTH
     },
 
     [ROCK]: {
        [NORMAL  ]    :     STRENGTH,
        [FIGHTING]    :     WEAKNESS,
        [FLYING  ]    :     STRENGTH,
        [POISON  ]    :     STRENGTH,
        [GROUND  ]    :     WEAKNESS,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     WEAKNESS,
        [FIRE    ]    :     STRENGTH,
        [WATER   ]    :     WEAKNESS,
        [GRASS   ]    :     WEAKNESS,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [BUG]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     STRENGTH,
        [FLYING  ]    :     WEAKNESS,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     STRENGTH,
        [ROCK    ]    :     WEAKNESS,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     WEAKNESS,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     STRENGTH,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [GHOST]: {
        [NORMAL  ]    :     INMMUNE,
        [FIGHTING]    :     INMMUNE, 
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     STRENGTH,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     STRENGTH,
        [GHOST   ]    :     WEAKNESS,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     NEUTRAL,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     NEUTRAL,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     WEAKNESS
     },
 
     [STEEL]: {
        [NORMAL  ]    :     STRENGTH,
        [FIGHTING]    :     WEAKNESS,
        [FLYING  ]    :     STRENGTH,
        [POISON  ]    :     INMMUNE,
        [GROUND  ]    :     WEAKNESS,
        [ROCK    ]    :     STRENGTH,
        [BUG     ]    :     STRENGTH,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     STRENGTH,
        [FIRE    ]    :     WEAKNESS,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     STRENGTH,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     STRENGTH,
        [ICE     ]    :     STRENGTH,
        [DRAGON  ]    :     STRENGTH,
        [DARK    ]    :     NEUTRAL
     },
 
     [FIRE]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     NEUTRAL,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     WEAKNESS,
        [ROCK    ]    :     WEAKNESS,
        [BUG     ]    :     STRENGTH,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     STRENGTH,
        [FIRE    ]    :     STRENGTH,
        [WATER   ]    :     WEAKNESS,
        [GRASS   ]    :     STRENGTH,
        [ELECTRIC]    :     NEUTRAL,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     STRENGTH,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [WATER]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     NEUTRAL,
        [FLYING  ]    :     NEUTRAL,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     NEUTRAL,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     STRENGTH,
        [FIRE    ]    :     STRENGTH,
        [WATER   ]    :     STRENGTH,
        [GRASS   ]    :     WEAKNESS,
        [ELECTRIC]    :     WEAKNESS,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     STRENGTH,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [GRASS]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     NEUTRAL,
        [FLYING  ]    :     WEAKNESS,
        [POISON  ]    :     WEAKNESS,
        [GROUND  ]    :     STRENGTH,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     WEAKNESS,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     NEUTRAL,
        [FIRE    ]    :     WEAKNESS,
        [WATER   ]    :     STRENGTH,
        [GRASS   ]    :     STRENGTH,
        [ELECTRIC]    :     STRENGTH,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     WEAKNESS,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     },
 
     [ELECTRIC]: {
        [NORMAL  ]    :     NEUTRAL,
        [FIGHTING]    :     NEUTRAL,
        [FLYING  ]    :     STRENGTH,
        [POISON  ]    :     NEUTRAL,
        [GROUND  ]    :     WEAKNESS,
        [ROCK    ]    :     NEUTRAL,
        [BUG     ]    :     NEUTRAL,
        [GHOST   ]    :     NEUTRAL,
        [STEEL   ]    :     STRENGTH,
        [FIRE    ]    :     NEUTRAL,
        [WATER   ]    :     NEUTRAL,
        [GRASS   ]    :     NEUTRAL,
        [ELECTRIC]    :     STRENGTH,
        [PSYCHIC ]    :     NEUTRAL,
        [ICE     ]    :     NEUTRAL,
        [DRAGON  ]    :     NEUTRAL,
        [DARK    ]    :     NEUTRAL
     }



}



function GetTypeMultiplier(movetype,a,b) {
    let x = TYPES[a][movetype];
    if (typeof b !== 'undefined') 
        x *= TYPES[b][movetype];
    return x
}



//// NORMAL BASED MOVES 
MOVES = [];ANIMATION=[];
function DEFINE_ATTACK(NAME,DESC,PP,TYPE) {
   



  
}


class Attack_SFX extends Audio {
   constructor(n) {
      super("assets/audio/sfx/"+n+".ogg");
      this.volume = 0.097
   }
}


DEFINE_ATTACK("Tackle", "Your Ikimono slides on the floor to tackle the oppenent.",25, "ATTACK",NORMAL)

ANIMATION["Tackle"] = {
   Duration: 20 + 60,
   Power: 3,
   Type: NORMAL,
   SFX: new Attack_SFX("Tackle"),
   tick: function (props, tick, d, attacker) {
      if (tick > 20) return props;
      if (tick == 4) this.SFX.play();
      if (tick == 9) {
         d.applyDamage(this,attacker);
         props.defender.x = -7;
      }
      else if (tick > 10){ tick = 10 - (tick - 10); props.defender.x = -7}

      props.attacker.x = tick * 37;
      return props
   }
}

DEFINE_ATTACK("Dive", "Your Ikimono dives onto the oppenent.",25, "ATTACK",WATER)
var WATERs = loadMultipleFrames("assets/battle/WaterSplash/WaterSplash$t.png", 16, -1);
ANIMATION["Dive"] = {
   Duration: 16 + 40 ,
   Power: 40,
   Type: WATER,
   SFX: new Attack_SFX("Dive"),
   tick: function (props, tick, d, attacker) {
      if (tick > 20) return props;
      if (tick == 4) this.SFX.play();
      if (tick == 9) d.applyDamage(this,attacker);
     
      else if (tick > 5) tick = 5 - (tick - 5);

      props.attacker.y = tick * 2 + 15;
      return props
   },

   PostTick:function (props, tick, d, attacker) {
     
      var tick = Math.round(tick /2);
      console.log("tick");

      if (WATERs[tick]) {

      //if (!ACTIVE_BATTLE.AnimationIsPlayerAttacking)
      drawImage(WATERs[tick].texture,750,45,384,384)
      //else
       drawImage(WATERs[tick].texture,64,120,512,512)
      }  
   }
}

DEFINE_ATTACK("Bite", "Your Ikimono bites into the oppenent.")

ANIMATION["Bite"] = {
   Duration: 24 + 40 ,
   Power: 6000,
   Type: DARK,
   VFX: loadImageAndCreateTextureInfo("assets/battle/Bite.png"),
   SFX: new Attack_SFX("Bite"),
   tick: function (props, tick, d, attacker) {
      //if (tick > 20) return props;
      //if (tick == 4) this.SFX.play();
      if (tick == 12) d.applyDamage(this,attacker);
      if (tick == 11) this.SFX.play();

      if ( tick > 11 & tick < 14)
      props.defender.x = tick * 2 + 15;
      if ( tick > 18 & tick < 24)
      props.defender.x = -(tick * 2 + 15);
      return props
   },

   PostTick:function (props, tick, d, attacker) {

      if (WATERs[tick]) {

      //if (!ACTIVE_BATTLE.AnimationIsPlayerAttacking)
      var p  = !ACTIVE_BATTLE.AnimationIsPlayerAttacking ? [820,125] : [245,340]
      if (tick < 12)
      drawImage(this.VFX.texture,p[0],p[1] - 90 + (tick*7),240,90)
      drawImage(this.VFX.texture,p[0],p[1] + 180 + 90 - (tick*7),240,-90)
      //else
//drawImage(this.VFX.texture,64,120,64,32)
      }  
   }
}

DEFINE_ATTACK("Quick Attack", "Your Ikimono quickly jabs the target.",25, "ATTACK",ENUM.NORMAL)
ANIMATION["Quick Attack"] = {
   Duration: 10 + 60,
   Power: 40,
   Type: NORMAL,
   SFX: new Attack_SFX("Tackle"),
   tick: function (props, tick, d, attacker) {
      if (tick > 5) return props;
      if (tick == 2) this.SFX.play();
      if (tick == 3) {
         d.applyDamage(this,attacker);
         props.defender.x = -7;
      }
      else if (tick > 5){ tick = 5 - (tick - 5); props.defender.x = -7}

      props.attacker.x = tick * 46;
      return props
   }
}



DEFINE_ATTACK("Reflect", "Your Ikimono slides on the floor to tackle the oppenent.",25, "ATTACK",ENUM.NORMAL)
