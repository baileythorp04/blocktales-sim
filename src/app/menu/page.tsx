"use client";
import GridCell from "@/components/GridCell";
import { useStats, Stat } from "@/hooks/useStats";

export default function Menu() {
  const { hp, sp, bp, remainingLevels, MAX_LEVEL, changeStat } = useStats();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>
      <p className="text-lg mb-6">This is the menu page.</p>
      <div className="text-xl font-mono">Remaining Levels: {remainingLevels}/{MAX_LEVEL}</div>

      <div
        className="grid w-full max-w-md"
        style={{
          gridTemplateRows: "1fr 2fr 1fr",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          height: "300px",
          width: "300px",
        }}
      >
        <GridCell onClick={() => changeStat(Stat.HP, false)}>HP+</GridCell>
        <GridCell onClick={() => changeStat(Stat.SP, false)}>SP+</GridCell>
        <GridCell onClick={() => changeStat(Stat.BP, false)}>BP+</GridCell>
        <GridCell>HP: {hp}</GridCell>
        <GridCell>SP: {sp}</GridCell>
        <GridCell>BP: {bp}</GridCell>
        <GridCell onClick={() => changeStat(Stat.HP, true)}>HP-</GridCell>
        <GridCell onClick={() => changeStat(Stat.SP, true)}>SP-</GridCell>
        <GridCell onClick={() => changeStat(Stat.BP, true)}>BP-</GridCell>
      </div>
    </div>
  );
}
