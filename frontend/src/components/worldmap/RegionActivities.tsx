import React from 'react';
import type { Activity } from './WorldMapTab';

interface Props {
  activities: Activity[];
}

const RegionActivities: React.FC<Props> = ({ activities }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Region Activities</h2>
    <ul className="space-y-1">
      {activities.map(activity => (
        <li key={activity.id}>
          <div className="font-semibold">{activity.name}</div>
          <div className="text-xs text-gray-500">{activity.description}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default RegionActivities;
