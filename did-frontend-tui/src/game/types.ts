export interface GameState {
  player: Player | null;
  currentLocation: Location;
  gamePhase: "menu" | "playing" | "combat" | "inventory" | "gameOver";
  messages: Message[];
  combatState: CombatState | null;
  pendingChoice: Choice | null;
}

export interface Player {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xp: number;
  xpToNextLevel: number;
  inventory: Item[];
  gold: number;
  equippedWeapon: Item | null;
  equippedArmor: Item | null;
}

export interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
  lootTable: Item[];
}

export interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion" | "key" | "treasure";
  description: string;
  attackBonus?: number;
  defenseBonus?: number;
  healAmount?: number;
  value: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  exits: { direction: string; locationId: string }[];
  monsters: Monster[];
  items: Item[];
  npcs: NPC[];
}

export interface NPC {
  name: string;
  dialog: string[];
  questGiver?: boolean;
}

export interface Message {
  id: string;
  text: string;
  type: "normal" | "combat" | "system" | "error" | "success";
  timestamp: number;
}

export interface CombatState {
  enemy: Monster;
  playerTurn: boolean;
  combatLog: string[];
}

export interface Choice {
  id: string;
  prompt: string;
  options: { key: string; text: string; value: any }[];
  callback: string; // action type to dispatch with chosen value
}

export type GameAction =
  | { type: "START_GAME"; playerName: string }
  | { type: "MOVE"; direction: string }
  | { type: "ATTACK" }
  | { type: "USE_ITEM"; itemId: string }
  | { type: "EQUIP_ITEM"; itemId: string }
  | { type: "DROP_ITEM"; itemId: string }
  | { type: "RUN" }
  | { type: "SAVE_GAME" }
  | { type: "LOAD_GAME" }
  | { type: "SHOW_INVENTORY" }
  | { type: "SHOW_STATUS" }
  | { type: "RETURN_TO_MENU" }
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "SHOW_CHOICE"; choice: Choice }
  | { type: "MAKE_CHOICE"; choiceId: string; value: any }
  | { type: "CUSTOM_PLAYER_ACTION"; action: string; data?: any };
