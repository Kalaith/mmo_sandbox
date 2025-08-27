import React from 'react';

interface MarketItemProps {
  item: string;
  price: number;
  quantity: number;
  seller: string;
  onClick?: () => void;
  selected?: boolean;
}

const MarketItem: React.FC<MarketItemProps> = ({ item, price, quantity, seller, onClick, selected }) => (
  <button
    className={`w-full px-2 py-1 rounded text-left ${selected ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    onClick={onClick}
  >
    {quantity}x {item} - {price}g (Seller: {seller})
  </button>
);

export default MarketItem;
