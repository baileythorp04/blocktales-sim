import React from "react";
import StatusIcon from "./StatusIcon";
import { StatusHolder } from "@/static/StatusHolder"

type StatusIconGroupProps = {
  statuses: StatusHolder
};
let c = 0
export default function StatusIconGroup({ statuses }: StatusIconGroupProps) {
  const sl = statuses.statusList
  return (
    <div dir="rtl" className="grid grid-cols-2 grid-rows-2 mb-2 rotate-180 min-h-30">
      {sl.map(status =>
      <div key={c++} className="rotate-180">
        <StatusIcon  icon={status.icon} color={status.color} intensity={status.intensity} duration={status.duration} hideIntensity={status.hideIntensity} />
      </div>
      )}
    </div>
  );
}
