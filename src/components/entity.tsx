import React from "react";
import Image from "next/image";
import Status from "./Status";

type EntityProps = {
  name: string,
  isPlayer: boolean,
  hp: number,
  maxHp?: number,
  sp?: number,
  maxSp?: number,
  attack1?: string,
  attack2?: string,
};

export default function Entity({ name, isPlayer, hp, maxHp, sp, maxSp, attack1, attack2 }: EntityProps) {
  return (
    <div className="flex flex-col items-center">
      {/* TODO: have this work when statuses are mapped. ideally it fills bottom to top without using rotating */}
      <div className="grid grid-cols-2 grid-rows-3 mb-2"> 
        <Status icon="fire.png" color="#ff7700" intensity={1} duration={3} className="order-1"/>
        <Status icon="fire.png" color="#ff7700" intensity={2} duration={3} className="order-2"/>
        <Status icon="fire.png" color="#ff7700" intensity={3} duration={3} className="order-2"/>
      </div>
      {isPlayer 
      ? <Image
        src="/player.png"
        alt="player"
        width={160}
        height={160} />
      :<Image
        src="/enemy.png"
        alt="enemy"
        width={160}
        height={160} />
      }

      <div>{name}</div>
      <div>hp: {hp}/{maxHp}</div>
      {isPlayer
      ? <div>sp: {sp}/{maxSp}</div>
      : <div>
          <div>next attacks: </div>
          <div>{attack1}</div>
          <div>{attack2}</div>
        </div>
      }
    </div>
  );
}