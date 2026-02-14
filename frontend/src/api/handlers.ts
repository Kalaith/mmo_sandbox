import craftingStations from '../mocks/crafting-stations.json';
import recipes from '../mocks/recipes.json';
import inventoryData from '../mocks/inventory.json';
import pvpZones from '../mocks/pvp/zones.json';
import pvpStats from '../mocks/pvp/stats.json';
import combatLog from '../mocks/pvp/combat-log.json';
import guild from '../mocks/guild.json';
import guildMembers from '../mocks/guild-members.json';
import guildAlliances from '../mocks/guild-alliances.json';
import regions from '../mocks/regions.json';
import currentRegion from '../mocks/current-region.json';
import activitiesCapital from '../mocks/region-activities-capital.json';
import activitiesForest from '../mocks/region-activities-forest.json';
import activitiesMountains from '../mocks/region-activities-mountains.json';
import marketListings from '../mocks/market-listings.json';

const inventory = [...inventoryData];

export async function getCraftingStations() {
  return craftingStations;
}

export async function getRecipes(stationId?: string) {
  if (stationId) {
    return recipes.filter(r => r.stationId === stationId);
  }
  return recipes;
}

export async function getInventory() {
  return inventory;
}

export async function craft(recipeId: string) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');
  const canCraft = recipe.ingredients.every(ing => {
    const invItem = inventory.find(i => i.itemId === ing.itemId);
    return invItem && invItem.quantity >= ing.quantity;
  });
  if (!canCraft) throw new Error('Not enough ingredients');
  recipe.ingredients.forEach(ing => {
    const invItem = inventory.find(i => i.itemId === ing.itemId);
    if (invItem) invItem.quantity -= ing.quantity;
  });
  const resultItem = inventory.find(i => i.itemId === recipe.result.itemId);
  if (resultItem) {
    resultItem.quantity += recipe.result.quantity;
  } else {
    inventory.push({
      itemId: recipe.result.itemId,
      name: recipe.result.itemId,
      quantity: recipe.result.quantity,
    });
  }
  return { success: true };
}

export async function getPvpZones() {
  return pvpZones;
}

export async function getPvpStats() {
  return pvpStats;
}

export async function getCombatLog() {
  return combatLog;
}

export async function combatAction() {
  return { success: true, message: 'Action performed.' };
}

export async function getGuild() {
  return guild;
}

export async function getGuildMembers() {
  return guildMembers;
}

export async function getGuildAlliances() {
  return guildAlliances;
}

export async function guildAction() {
  return { success: true, message: 'Guild action performed.' };
}

export async function getRegions() {
  return regions;
}

export async function getCurrentRegion() {
  return currentRegion;
}

export async function getRegionActivities(regionId: string) {
  if (regionId === 'capital') return activitiesCapital;
  if (regionId === 'forest') return activitiesForest;
  if (regionId === 'mountains') return activitiesMountains;
  return [];
}

export async function travel(regionId: string) {
  void regionId; // suppress unused warning
  return { success: true };
}

export async function getMarketListings(search: string = '') {
  return marketListings.filter(l => l.item.toLowerCase().includes(search.toLowerCase()));
}

export async function marketBuy(listingId: string, quantity: number) {
  void listingId; // suppress unused warning
  void quantity;
  return { success: true, message: 'Purchase successful.' };
}
