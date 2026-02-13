import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import RegionsList from "./RegionsList";
import CurrentLocation from "./CurrentLocation";
import RegionActivities from "./RegionActivities";
import TravelButton from "./TravelButton";
import {
  getRegions,
  getCurrentRegion,
  getRegionActivities,
  travel,
} from "../../api/handlers";

export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
}

const WorldMapTab: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getRegions()
      .then(setRegions)
      .catch(() => setRegions([]));
    getCurrentRegion()
      .then(setCurrentRegion)
      .catch(() => setCurrentRegion(null));
  }, []);

  useEffect(() => {
    if (currentRegion) {
      getRegionActivities(currentRegion.id)
        .then(setActivities)
        .catch(() => setActivities([]));
    }
  }, [currentRegion]);

  const handleTravel = async (regionId: string) => {
    try {
      const data = await travel(regionId);
      if (data.success) {
        const newRegion = regions.find((r) => r.id === regionId) || null;
        setCurrentRegion(newRegion);
      }
    } catch {
      // Optionally show error to user
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4">
        <MapView
          regions={regions}
          currentRegion={currentRegion}
          onSelect={setCurrentRegion}
        />
        <RegionsList
          regions={regions}
          currentRegion={currentRegion}
          onSelect={setCurrentRegion}
        />
      </div>
      <div className="w-full md:w-1/4">
        <CurrentLocation region={currentRegion} />
        <TravelButton
          regions={regions}
          currentRegion={currentRegion}
          onTravel={handleTravel}
        />
      </div>
      <div className="w-full md:w-2/4">
        <RegionActivities activities={activities} />
      </div>
    </div>
  );
};

export default WorldMapTab;
