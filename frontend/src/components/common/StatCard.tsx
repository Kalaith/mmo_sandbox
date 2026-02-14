import React from 'react';

interface StatCardProps {
  stat: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ stat, value }) => (
  <div className="border rounded p-2 text-center">
    <div className="font-bold">{stat}</div>
    <div className="text-lg">{value}</div>
  </div>
);

export default StatCard;
