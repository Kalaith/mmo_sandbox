import React, { useState } from 'react';
import type { Listing } from './MarketTab';
import { marketBuy } from '../../api/handlers';

interface Props {
  listing: Listing | null;
}

const MarketBuySell: React.FC<Props> = ({ listing }) => {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = async () => {
    if (!listing) return;
    try {
      await marketBuy(listing.id, quantity);
      // Optionally show success message
    } catch {
      // Optionally show error message
    }
  };

  const handleSell = () => {
    // Implement sell logic or open a sell form/modal
    alert('Sell functionality not implemented in mock.');
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Buy / Sell</h2>
      {listing ? (
        <div>
          <div className="mb-2">{listing.quantity}x {listing.item} for {listing.price}g each</div>
          <input
            type="number"
            min={1}
            max={listing.quantity}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-16 px-1 py-1 border rounded mr-2"
          />
          <button className="px-3 py-1 bg-green-600 text-white rounded mr-2" onClick={handleBuy}>Buy</button>
          <button className="px-3 py-1 bg-yellow-600 text-white rounded" onClick={handleSell}>Sell</button>
        </div>
      ) : (
        <div>Select a listing to buy or sell.</div>
      )}
    </div>
  );
};

export default MarketBuySell;
