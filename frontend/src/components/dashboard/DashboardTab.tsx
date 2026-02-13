import React from "react";
import ActivityFeed from "../common/ActivityFeed";
import type { ActivityEntry } from "../common/ActivityFeed";
import StatCard from "../common/StatCard";

interface DashboardTabProps {
  activities?: ActivityEntry[];
  stats?: { stat: string; value: string | number; icon?: string }[];
  events?: string[];
}

const defaultActivities: ActivityEntry[] = [
  { id: "1", timestamp: "2025-06-24 10:00", message: "Welcome to the game!" },
  {
    id: "2",
    timestamp: "2025-06-24 10:05",
    message: "You joined the Knights of the Round.",
  },
];

const defaultStats = [
  { stat: "Level", value: 10, icon: "⭐" },
  { stat: "Gold", value: 1000, icon: "💰" },
  { stat: "Energy", value: 100, icon: "⚡" },
];

const DashboardTab: React.FC<DashboardTabProps> = ({
  activities = defaultActivities,
  stats = defaultStats,
  events = [],
}) => {
  return (
    <div className="dashboard-grid grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="dashboard-section">
        <ActivityFeed entries={activities} />
      </div>
      <div className="dashboard-section">
        <h3 className="font-bold mb-2">Stats</h3>
        <div className="stats-grid grid grid-cols-1 gap-2">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat.stat} value={stat.value} />
          ))}
        </div>
      </div>
      <div className="dashboard-section">
        <h3 className="font-bold mb-2">Events</h3>
        <div className="events-list space-y-2">
          {events.length === 0 ? (
            <div className="text-gray-400 text-sm">No current events.</div>
          ) : (
            events.map((event, idx) => (
              <div
                key={idx}
                className="event-item text-sm p-2 bg-surface rounded shadow"
              >
                {event}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
