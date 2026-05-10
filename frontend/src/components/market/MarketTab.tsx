import React, { useEffect, useState } from 'react';
import { getMarketListings } from '../../api/handlers';
import MarketSearch from './MarketSearch';
import MarketListings from './MarketListings';
import MarketBuySell from './MarketBuySell';

export interface Listing {
  id: string;
  item: string;
  seller: string;
  price: number;
  quantity: number;
}

const MarketTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const loadListings = () => {
    getMarketListings(search)
      .then(data => {
        setListings(data);
        setSelectedListing(current => data.find(listing => listing.id === current?.id) ?? null);
      })
      .catch(() => setListings([]));
  };

  useEffect(() => {
    loadListings();
  }, [search]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4">
        <MarketSearch search={search} setSearch={setSearch} />
      </div>
      <div className="w-full md:w-2/4">
        <MarketListings
          listings={listings}
          onSelect={setSelectedListing}
          selectedListing={selectedListing}
        />
      </div>
      <div className="w-full md:w-1/4">
        <MarketBuySell listing={selectedListing} onComplete={loadListings} />
      </div>
    </div>
  );
};

export default MarketTab;
