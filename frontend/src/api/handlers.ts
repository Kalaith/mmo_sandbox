import { webhatcheryGameApi, type WebHatcheryGameState } from './webhatcheryGameApi';
import { useWebHatcherySessionStore } from '../stores/webhatcherySessionStore';

export interface Station {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  stationId: string;
  ingredients: { itemId: string; quantity: number }[];
  result: { itemId: string; quantity: number };
}

export interface InventoryItem {
  itemId: string;
  name: string;
  quantity: number;
}

export interface PvPZone {
  id: string;
  name: string;
  description: string;
}

export interface PvPStats {
  kills: number;
  deaths: number;
  rating: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface Guild {
  id: string;
  name: string;
  level: number;
  description: string;
}

export interface GuildMember {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

export interface Alliance {
  id: string;
  name: string;
  status: 'allied' | 'pending' | 'requested';
}

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

export interface Listing {
  id: string;
  item: string;
  seller: string;
  price: number;
  quantity: number;
}

export interface Skill {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
}

export interface SkillCategory {
  name: string;
  color?: string;
  skills: Skill[];
}

export interface MmoProfile {
  character: {
    created: boolean;
    name: string;
  };
  resources: {
    gold: number;
    energy: number;
    skillPoints: number;
    level: number;
  };
  attributes: { name: string; value: number }[];
  equipment: { slot: string; item?: string }[];
  activities: LogEntry[];
  events: string[];
  skills: SkillCategory[];
}

let backendSession: Promise<WebHatcheryGameState> | null = null;

const ensureBackendSession = async (): Promise<WebHatcheryGameState> => {
  const session = useWebHatcherySessionStore.getState();
  if (session.gameState) {
    return session.gameState;
  }

  backendSession ??= session.loadGame().catch(() => session.continueAsGuest());
  return backendSession;
};

const getContent = async <T>(resource: string, params: Record<string, string | number> = {}): Promise<T> => {
  await ensureBackendSession();
  return webhatcheryGameApi.getContent<T>(resource, params);
};

const applyIntent = async (
  intent: string,
  payload: Record<string, unknown> = {},
): Promise<WebHatcheryGameState> => {
  await ensureBackendSession();
  const gameState = await webhatcheryGameApi.applyIntent(intent, payload);
  useWebHatcherySessionStore.setState({ gameState, user: gameState.user });
  return gameState;
};

export async function getProfile(): Promise<MmoProfile> {
  return getContent<MmoProfile>('profile');
}

export async function createCharacter(name: string): Promise<MmoProfile> {
  await applyIntent('create_character', { name });
  return getProfile();
}

export async function getCraftingStations(): Promise<Station[]> {
  return getContent<Station[]>('crafting-stations');
}

export async function getRecipes(stationId?: string): Promise<Recipe[]> {
  return getContent<Recipe[]>('recipes', stationId ? { stationId } : {});
}

export async function getInventory(): Promise<InventoryItem[]> {
  return getContent<InventoryItem[]>('inventory');
}

export async function craft(recipeId: string): Promise<{ success: true }> {
  await applyIntent('craft', { recipeId });
  return { success: true };
}

export async function getPvpZones(): Promise<PvPZone[]> {
  return getContent<PvPZone[]>('pvp-zones');
}

export async function getPvpStats(): Promise<PvPStats> {
  return getContent<PvPStats>('pvp-stats');
}

export async function getCombatLog(): Promise<LogEntry[]> {
  return getContent<LogEntry[]>('combat-log');
}

export async function combatAction(
  zoneId: string,
  action: 'attack' | 'defend' | 'flee',
): Promise<{ success: true; message: string }> {
  await applyIntent('combat_action', { zoneId, action });
  return { success: true, message: 'Action performed.' };
}

export async function getGuild(): Promise<Guild> {
  return getContent<Guild>('guild');
}

export async function getGuildMembers(): Promise<GuildMember[]> {
  return getContent<GuildMember[]>('guild-members');
}

export async function getGuildAlliances(): Promise<Alliance[]> {
  return getContent<Alliance[]>('guild-alliances');
}

export async function guildAction(action: 'invite' | 'promote' | 'kick' | 'message'): Promise<{ success: true }> {
  await applyIntent('guild_action', { action });
  return { success: true };
}

export async function getRegions(): Promise<Region[]> {
  return getContent<Region[]>('regions');
}

export async function getCurrentRegion(): Promise<Region> {
  return getContent<Region>('current-region');
}

export async function getRegionActivities(regionId: string): Promise<Activity[]> {
  return getContent<Activity[]>('region-activities', { regionId });
}

export async function travel(regionId: string): Promise<{ success: true }> {
  await applyIntent('travel', { regionId });
  return { success: true };
}

export async function getMarketListings(search: string = ''): Promise<Listing[]> {
  return getContent<Listing[]>('market-listings', search ? { search } : {});
}

export async function marketBuy(listingId: string, quantity: number): Promise<{ success: true }> {
  await applyIntent('market_buy', { listingId, quantity });
  return { success: true };
}

export async function getSkills(): Promise<SkillCategory[]> {
  return getContent<SkillCategory[]>('skills');
}

export async function upgradeSkill(skillName: string): Promise<SkillCategory[]> {
  await applyIntent('upgrade_skill', { skillName });
  return getSkills();
}
