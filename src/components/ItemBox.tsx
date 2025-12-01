import { Item } from "@/static/Items";
import React from "react";
import Image from "next/image";


type ItemBoxProps = {
  itemList: Item[];
  onItemClick: (item: Item, index: number) => void;
};

export default function ItemBox({ itemList = [], onItemClick }: ItemBoxProps) {
  return (
   <div className="grid grid-cols-5 grid-rows-2 border border-4 w-[340px] h-[140px] bg-gray-300">
          {itemList.map((item, i) => (
            <div key={i} onClick={() => onItemClick(item, i)} className={`p-2 ${item.usable && "cursor-pointer"}`}>
                <Image
                  src={"/items/" + item.icon}
                  alt={item.name + " icon"}
                  width={50}
                  height={50}
                />              
            </div>
          ))}
          
        </div>
  );
}

