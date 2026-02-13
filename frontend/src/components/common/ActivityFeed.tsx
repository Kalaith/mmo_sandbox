import React from "react";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
}

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ entries }) => (
  <div className="activity-feed">
    <h3 className="font-bold mb-2">Activity Feed</h3>
    <ul className="text-xs max-h-40 overflow-y-auto">
      {entries.map((entry) => (
        <li key={entry.id}>
          <span className="text-gray-500">[{entry.timestamp}]</span>{" "}
          {entry.message}
        </li>
      ))}
    </ul>
  </div>
);

export default ActivityFeed;
