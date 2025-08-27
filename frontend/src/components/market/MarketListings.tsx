import React from 'react';
import type { Listing } from './MarketTab';

interface Props {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelect: (listing: Listing) => void;
}

const MarketListings: React.FC<Props> = ({ listings, selectedListing, onSelect }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Listings</h2>
    <ul className="space-y-2">
      {listings.map(listing => (
        <li key={listing.id}>
          <button
            className={`w-full px-2 py-1 rounded ${selectedListing?.id === listing.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onSelect(listing)}
          >
            {listing.quantity}x {listing.item} - {listing.price}g (Seller: {listing.seller})
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default MarketListings;
