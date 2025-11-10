
"use client";
import { Card } from "@/static/Cards";
import { createContext, ReactNode, useContext, useState } from "react";

type CardSelectionType = {
  selectedCards: Card[];
  setSelectedCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

const CardSelectionContext = createContext<CardSelectionType | undefined>(undefined);

export const SelectionProvider = ({ children }: {children: ReactNode}) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  return (
    <CardSelectionContext.Provider value={{ selectedCards, setSelectedCards }}>
      {children}
    </CardSelectionContext.Provider>
  );
};

export const useCardSelection = () => {
  const context = useContext(CardSelectionContext);
  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider");
  }
  return context;
};
