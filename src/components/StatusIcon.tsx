import React from "react";
import Image from "next/image";

type StatusIconProps = {
  icon: string,
  color: string,
  intensity: number,
  duration: number,
  hideIntensity: boolean,
};

export default function StatusIcon({ icon, color, intensity, duration, hideIntensity }: StatusIconProps) {
  return (
    <div className="w-[60px] h-[60px] items-center justify-center flex">
      <div className="relative w-[40px] h-[40px]">
        <div className="absolute inset-0 flex items-center justify-center border-2 rounded-xl" style={{ borderColor: color }}>
          <img src={"/statuses/" + icon} alt="status icon" className="w-[30px] h-[30px]" />
        </div>
        {!hideIntensity &&
        <div className="absolute w-[20px] h-[20px] bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ top: "-9px", left: "-9px" }}>
          {intensity} 
          {/* TODO make red box into arrow */}
        </div>}
          <div className="absolute w-[20px] h-[20px] bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ bottom: "-9px", right: "-9px" }}>
          {duration}
        </div>
      </div>
    </div>
  );
}