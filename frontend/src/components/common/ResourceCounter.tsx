import React from 'react';

interface ResourceCounterProps {
  resource: string;
  count: number;
}

const ResourceCounter: React.FC<ResourceCounterProps> = ({ resource, count }) => (
  <div className="flex items-center gap-2">
    <span className="font-bold">{resource}:</span>
    <span>{count}</span>
  </div>
);

export default ResourceCounter;
