
"use client";
import { PlayerBuild } from "@/static/PlayerBuild";
import { createContext, ReactNode, useContext, useState } from "react";

type PlayerBuildSelectionType = {
  playerBuild: PlayerBuild | undefined;
  setPlayerBuild: React.Dispatch<React.SetStateAction<PlayerBuild | undefined>>;
}

const PlayerBuildContext = createContext<PlayerBuildSelectionType | undefined>(undefined);

export const SelectionProvider = ({ children }: {children: ReactNode}) => {
  const [playerBuild, setPlayerBuild] = useState<PlayerBuild | undefined>();

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
