import React from 'react';

interface Props {
  search: string;
  setSearch: (s: string) => void;
}

const MarketSearch: React.FC<Props> = ({ search, setSearch }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Marketplace Search</h2>
    <input
      type="text"
      className="w-full px-2 py-1 border rounded"
      placeholder="Search items..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </div>
);

export default MarketSearch;
