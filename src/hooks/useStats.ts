import { useState } from "react";

export enum Stat {
  HP,
  SP,
  BP,
}

const MAX_LEVEL = 5;

export function useStats() {
  const [hp, setHp] = useState(10);
  const [sp, setSp] = useState(5);
  const [bp, setBp] = useState(3);
  const [remainingLevels, setRemainingLevels] = useState(MAX_LEVEL);

  function changeStat(stat: Stat, negative: boolean = false) {
    let mult = negative ? -1 : 1;
    let newRemainingLevels = remainingLevels - 1 * mult;
    if (newRemainingLevels < 0 || newRemainingLevels > MAX_LEVEL) return;

    let newHp = hp;
    let newSp = sp;
    let newBp = bp;

    if (stat === Stat.HP) {
      newHp = hp + 5 * mult;
      if (newHp > 50 || newHp < 10) return;
      setHp(newHp);
    } else if (stat === Stat.SP) {
      newSp = sp + 5 * mult;
      if (newSp > 50 || newSp < 5) return;
      setSp(newSp);
    } else if (stat === Stat.BP) {
      newBp = bp + 3 * mult;
      if (newBp > 30 || newBp < 3) return;
      setBp(newBp);
    }

    setRemainingLevels(newRemainingLevels);
  }

  return {
    hp,
    sp,
    bp,
    remainingLevels,
    MAX_LEVEL,
    changeStat,
  };
}