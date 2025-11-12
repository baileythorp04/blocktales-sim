import { useState } from "react";
import { Entity, StatusEffect } from "./gameClasses"

let idCounter = 0;

enum CardType {
  ACTIVE,
  START_OF_COMBAT,
  ON_ATTACK, //ante up, hp leech
  START_OF_TURN,
}

export class Card {
  id: number;
  icon: string;
  cName: string;
  bux: number;
  bp: number;

  type: CardType;
  effect: (player: Entity, enemies: Entity[]) => void;

  public constructor(icon: string, cName: string, bux: number, bp: number, type: CardType, effect: () => void) {
    this.id = idCounter++;
    this.icon = icon;
    this.cName = cName;
    this.bux = bux;
    this.bp = bp;

    this.type = type,
    this.effect = effect;

    //available targets
    //card type (when does it activate?)
    //effect(player, enemy | enemy[], ) => void (for active usable cards)
    //  do enemy.takedamage() or player.dealdamage(enemy)?
    // the second one, so damage mods can take effect in player.dealdamage.

    //make each card extend Card and override Effect
  }

  //this only applies to selectable turn cards
  public doEffect(target: Entity, dmg?: number, status?: StatusEffect) {
    if (dmg !== undefined){ //TODO: better way to check if undefined
      target.takeDamage(dmg)
    }
    if (status !== undefined){ 
      //target.applyStatus(status)
    }
  }

}

export const BUYABLE_CARDS: Card[] = [

  new Card(icon="ante_up.png", cName="Ante Up", bux=5, 4 type=CardType.ON_ATTACK), //onattack
  new Card(icon="defend+.png", cName="Defend+", bux=5, 4 type=CardType.START_OF_COMBAT), //start 
  new Card(icon="sp_saver.png", cName="SP Saver", bux=4, 3 type=CardType.START_OF_COMBAT), //start 
  new Card(icon="sp_regen+.png", cName="SP Regen+", bux=4, 2 type=CardType.START_OF_COMBAT), //start
  new Card(icon="item+.png", cName="Item+", bux=3, 3 type=CardType.START_OF_COMBAT), //start??
  new Card(icon="sp_drain.png", cName="SP Drain", bux=2, 1 type=CardType.ON_ATTACK), //onattack
  new Card(icon="hp_drain.png", cName="HP drain", bux=2, 1 type=CardType.ON_ATTACK), //onattack
  new Card(icon="good_vibes.png", cName="Good Vibes", bux=1, 2 type=CardType.ACTIVE), //active
  new Card(icon="charge.png", cName="Charge", bux=1, 1 type=CardType.ACTIVE), //active
  new Card(icon="cure.png", cName="Cure", bux=0, 2 type=CardType.ACTIVE), //active
  new Card(icon="resurrect.png", cName="Resurrect", bux=0, 2 type=CardType.START_OF_TURN), // on death (on turn if dead?)
  new Card(icon="happy_hp.png", cName="Happy HP", bux=0, 1 type=CardType.START_OF_TURN), //onturn
  new Card(icon="linebounce.png", cName="Linebounce", bux=0, 1 type=CardType.ACTIVE), //active
  new Card(icon="minimize.png", cName="Minimize", bux=0, 1 type=CardType.ACTIVE), //active
  new Card(icon="daze.png", cName="Daze", bux=0, 1 type=CardType.ACTIVE), //active
  new Card(icon="pity_sp.png", cName="Pity SP", bux=0, 0 type=CardType.ACTIVE), //active
  new Card(icon="power_stab.png", cName="Power Stab", bux=0, 0 type=CardType.ACTIVE), //active
  
  //cards are entered alphabetically
  //then sort by bp
  //cardList.sort((a, b) => a.bp > b.bp ? -1 : 1);
  //then sort by bux
  //cardList.sort((a, b) => a.bux > b.bux ? -1 : 1);
];

// export const DEFAULT_CARDS: Card[] = [

//   new Card("defend.png", "Defend", 0, 0),
//   new Card("pass.png", "Pass", 0, 0),
//   new Card("ball.png", "Ball", 0, 0),
//   new Card("sword.png", "Sword", 0, 0),
//   new Card("dynamite.png", "Dynamite", 0, 0),

// ];
