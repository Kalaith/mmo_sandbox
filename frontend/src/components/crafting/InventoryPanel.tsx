import React from "react";
import type { InventoryItem } from "./CraftingTab";

interface Props {
  inventory: InventoryItem[];
}

const InventoryPanel: React.FC<Props> = ({ inventory }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Inventory</h2>
    <ul className="space-y-1">
      {inventory.map((item) => (
        <li key={item.itemId}>
          {item.name} ({item.quantity})
        </li>
      ))}
    </ul>
  </div>
);

export default InventoryPanel;
