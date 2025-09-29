import React from "react";

type GridCellProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function GridCell({ children, onClick }: GridCellProps) {
  return (
    <div
      className={`flex items-center justify-center border border-gray-400 bg-gray-100 text-lg font-semibold cursor-pointer select-none`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
}