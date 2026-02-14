import React from 'react';
import type { InventoryItem } from './InventoryGrid';

interface InventorySlotProps {
  item: InventoryItem;
}

const InventorySlot: React.FC<InventorySlotProps> = ({ item }) => (
  <div className="border rounded p-2 text-center">
    <div className="font-bold">{item.name}</div>
    <div className="text-xs text-gray-500">x{item.quantity}</div>
  </div>
);

export default InventorySlot;
