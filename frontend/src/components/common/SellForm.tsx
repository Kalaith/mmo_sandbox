import React, { useState } from "react";

interface SellFormProps {
  onSubmit: (item: string, price: number, quantity: number) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onSubmit }) => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item, price, quantity);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Item name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="w-full px-2 py-1 border rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full px-2 py-1 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        min={1}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full px-2 py-1 border rounded"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-yellow-600 text-white rounded"
      >
        List Item
      </button>
    </form>
  );
};

export default SellForm;
