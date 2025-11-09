"use client";
import { useState } from "react";

type Character = {
  name: string;
  hp: number;
  maxHp: number;
};

export default function Battle() {
  const [player, setPlayer] = useState<Character>({
    name: "Hero",
    hp: 30,
    maxHp: 30,
  });

  const [enemy, setEnemy] = useState<Character>({
    name: "Goblin",
    hp: 20,
    maxHp: 20,
  });

  const [log, setLog] = useState<string[]>([]);

  const doAbility = (damage: number) => {
    if (enemy.hp <= 0) return;

    setEnemy((prev) => {
      const newHp = Math.max(prev.hp - damage, 0);
      setLog((l) => [`You deal ${damage} damage!`, ...l]);
      return { ...prev, hp: newHp };
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>RPG Battle</h1>

      {/* Enemy Section */}
      <div>
        <h2>{enemy.name}</h2>
        <div>
          HP: {enemy.hp}/{enemy.maxHp}
        </div>
        {enemy.hp <= 0 && <strong>✅ Enemy Defeated!</strong>}
      </div>

      <hr />

      {/* Player Section */}
      <div>
        <h2>{player.name}</h2>
        <div>
          HP: {player.hp}/{player.maxHp}
        </div>
      </div>

      <hr />

      {/* Ability Buttons */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => doAbility(3)} disabled={enemy.hp <= 0}>
          🔪 Quick Strike (3 dmg)
        </button>{" "}
        <button onClick={() => doAbility(6)} disabled={enemy.hp <= 0}>
          🔥 Fireball (6 dmg)
        </button>
      </div>

      {/* Battle Log */}
      <div style={{ background: "#eee", padding: 10, borderRadius: 8 }}>
        <h3>Battle Log</h3>
        <ul>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
