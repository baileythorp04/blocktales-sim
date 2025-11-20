import React from "react";
import Image from "next/image";

type StatusProps = {
  className: string,
  icon: string,
  color: string,
  intensity: number,
  duration: number,
};

let w = 30

export default function Status({ className, icon, color, intensity, duration }: StatusProps) {
  return (
    <div className={`w-[${w+30}px] h-[${w+30}px] items-center justify-center flex ${className}`}>
      <div className={`relative w-[${w+10}px] h-[${w+10}px]`}>
        <div className="absolute inset-0 flex items-center justify-center border-2 rounded-xl" style={{ borderColor: color }}>
          <img src={"/statuses/" + icon} alt="status icon" className={`w-[${w}px] h-[${w}px]`} />
        </div>
        <div className="absolute w-[20px] h-[20px] bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ top: "-9px", left: "-9px" }}>
          {intensity} 
          {/* TODO make red box into arrow */}
        </div>
          <div className="absolute w-[20px] h-[20px] bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ bottom: "-9px", right: "-9px" }}>
          {duration}
        </div>
      </div>
    </div>
  );
}