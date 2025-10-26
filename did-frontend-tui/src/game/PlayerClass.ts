import { UIAdapter } from './uiAdapter';
import { Item } from './types';

export class PlayerClass {
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
  
  private ui: UIAdapter;

  constructor(name: string, ui: UIAdapter) {
    this.name = name;
    this.level = 1;
    this.hp = 100;
    this.maxHp = 100;
    this.attack = 5;
    this.defense = 2;
    this.xp = 0;
    this.xpToNextLevel = 100;
    this.inventory = [];
    this.gold = 50;
    this.equippedWeapon = null;
    this.equippedArmor = null;
    this.ui = ui;
  }

  // Example: Instead of console.log
  findItem(item: Item) {
    this.inventory.push(item);
    this.ui.showSuccess(`You found a ${item.name}!`);
  }

  // Example: Show choices instead of prompt
  showInventoryMenu() {
    this.ui.showChoice(
      'What would you like to do with your inventory?',
      [
        { key: '1', text: 'Use Item', value: 'use' },
        { key: '2', text: 'Equip Item', value: 'equip' },
        { key: '3', text: 'Drop Item', value: 'drop' },
        { key: '4', text: 'Back', value: 'back' }
      ],
      'INVENTORY_ACTION'
    );
  }

  // Example: Combat action
  attackEnemy(enemyName: string, damage: number) {
    this.ui.showCombat(`You attack ${enemyName} for ${damage} damage!`);
  }

  // Example: Level up
  levelUp() {
    this.level++;
    this.maxHp += 20;
    this.hp = this.maxHp;
    this.attack += 2;
    this.defense += 1;
    
    this.ui.showSuccess('🎉 LEVEL UP! 🎉');
    this.ui.showSystem(`You are now level ${this.level}!`);
    this.ui.showSystem(`HP: +20 | Attack: +2 | Defense: +1`);
  }

  // Convert to plain object for state storage
  toJSON() {
    return {
      name: this.name,
      level: this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      defense: this.defense,
      xp: this.xp,
      xpToNextLevel: this.xpToNextLevel,
      inventory: this.inventory,
      gold: this.gold,
      equippedWeapon: this.equippedWeapon,
      equippedArmor: this.equippedArmor,
    };
  }
}
