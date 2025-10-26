import Player from "../Entities/Player";
import Item from "../Wearables/Item";

//#region Equippable Interface
export interface Equippable {
  name: string;
  price: number;
  equip(player: Player): void;
  unequip(player: Player): void;
}
//#endregion

//#region Item Config Interface
export interface ItemConfig {
  name: string;
  hpToAdd: number;
  manaToAdd: number;
  damage: number;
  price: number;
}
//#endregion

//#region Player Config Interface
export interface PlayerConfig {
  name: string;
  playerClass: string;
  maxHp: number;
  hp: number;
  strength: number;
  accuracy: number;
  stamina: number;
  maxMana: number;
  mana: number;
  equipment: Equippable[];
  items: Item[];
  stealableItems?: Item[];
  stealableWeapons?: Equippable[];
  stealableMagicItems?: Equippable[];
  gold: number;
  xp: number;
  back: boolean;
  usedItem: boolean;
  weapon: string;
  armour: string;
  combat: boolean;
  special: number;
  room: string;
}
//#endregion
