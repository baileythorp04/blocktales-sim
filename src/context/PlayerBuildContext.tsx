
"use client";
import { Card } from "@/static/Cards";
import { PlayerBuild } from "@/static/PlayerBuild";
import { createContext, ReactNode, useContext, useState } from "react";

type PlayerBuildSelectionType = {
  playerBuild: PlayerBuild;
  setPlayerBuild: React.Dispatch<React.SetStateAction<PlayerBuild>>;
}

const PlayerBuildContext = createContext<PlayerBuildSelectionType | undefined>(undefined);

export const SelectionProvider = ({ children }: {children: ReactNode}) => {
  const [playerBuild, setPlayerBuild] = useState<PlayerBuild>({hp:100, sp:100, selectedCards:[], selectedItems:[]});

  return (
    <PlayerBuildContext.Provider value={{ playerBuild, setPlayerBuild }}>
      {children}
    </PlayerBuildContext.Provider>
  );
};

export const usePlayerBuild = () => {
  const context = useContext(PlayerBuildContext);
  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider");
  }
  return context;
};
