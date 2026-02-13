import React from "react";
import InventorySlot from "./InventorySlot";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface InventoryGridProps {
  items: InventoryItem[];
  columns?: number;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  items,
  columns = 5,
}) => (
  <div className={`grid grid-cols-${columns} gap-2`}>
    {items.map((item) => (
      <InventorySlot key={item.id} item={item} />
    ))}
  </div>
);

export default InventoryGrid;
