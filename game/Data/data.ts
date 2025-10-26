import { Item, Monster, Location } from './types';

export const ITEMS: Record<string, Item> = {
  rustySword: {
    id: 'rustySword',
    name: 'Rusty Sword',
    type: 'weapon',
    description: 'An old, worn sword. Better than nothing.',
    attackBonus: 3,
    value: 10,
  },
  ironSword: {
    id: 'ironSword',
    name: 'Iron Sword',
    type: 'weapon',
    description: 'A sturdy iron blade.',
    attackBonus: 7,
    value: 50,
  },
  leatherArmor: {
    id: 'leatherArmor',
    name: 'Leather Armor',
    type: 'armor',
    description: 'Basic leather protection.',
    defenseBonus: 3,
    value: 30,
  },
  chainmail: {
    id: 'chainmail',
    name: 'Chainmail',
    type: 'armor',
    description: 'Interlocking metal rings provide solid defense.',
    defenseBonus: 7,
    value: 100,
  },
  healthPotion: {
    id: 'healthPotion',
    name: 'Health Potion',
    type: 'potion',
    description: 'Restores 30 HP.',
    healAmount: 30,
    value: 20,
  },
  goldCoin: {
    id: 'goldCoin',
    name: 'Gold Coin',
    type: 'treasure',
    description: 'A shiny gold coin.',
    value: 10,
  },
};

export const MONSTERS: Record<string, Monster> = {
  rat: {
    name: 'Giant Rat',
    hp: 15,
    maxHp: 15,
    attack: 3,
    defense: 1,
    xpReward: 10,
    goldReward: 5,
    lootTable: [ITEMS.goldCoin],
  },
  goblin: {
    name: 'Goblin',
    hp: 25,
    maxHp: 25,
    attack: 5,
    defense: 2,
    xpReward: 20,
    goldReward: 15,
    lootTable: [ITEMS.rustySword, ITEMS.goldCoin],
  },
  skeleton: {
    name: 'Skeleton Warrior',
    hp: 35,
    maxHp: 35,
    attack: 7,
    defense: 4,
    xpReward: 35,
    goldReward: 25,
    lootTable: [ITEMS.ironSword, ITEMS.healthPotion],
  },
  orc: {
    name: 'Orc Brute',
    hp: 50,
    maxHp: 50,
    attack: 10,
    defense: 6,
    xpReward: 50,
    goldReward: 40,
    lootTable: [ITEMS.chainmail, ITEMS.ironSword],
  },
};

export const LOCATIONS: Record<string, Location> = {
  townSquare: {
    id: 'townSquare',
    name: 'Town Square',
    description: 'You stand in the center of a small village. The fountain gurgles peacefully. Paths lead north to the forest, east to the market, and south to the dungeon entrance.',
    exits: [
      { direction: 'north', locationId: 'forest' },
      { direction: 'east', locationId: 'market' },
      { direction: 'south', locationId: 'dungeonEntrance' },
    ],
    monsters: [],
    items: [],
    npcs: [
      {
        name: 'Village Elder',
        dialog: [
          'Welcome, brave adventurer!',
          'Dark forces have been stirring in the dungeon to the south.',
          'We need someone to investigate. Will you help us?',
        ],
      },
    ],
  },
  forest: {
    id: 'forest',
    name: 'Dark Forest',
    description: 'Tall trees block out most of the sunlight. Strange sounds echo through the woods.',
    exits: [
      { direction: 'south', locationId: 'townSquare' },
      { direction: 'east', locationId: 'forestClearing' },
    ],
    monsters: [{ ...MONSTERS.rat }],
    items: [ITEMS.healthPotion],
    npcs: [],
  },
  forestClearing: {
    id: 'forestClearing',
    name: 'Forest Clearing',
    description: 'A peaceful clearing with wildflowers. You can see the town to the west.',
    exits: [
      { direction: 'west', locationId: 'forest' },
    ],
    monsters: [{ ...MONSTERS.goblin }],
    items: [ITEMS.rustySword],
    npcs: [],
  },
  market: {
    id: 'market',
    name: 'Village Market',
    description: 'Merchants hawk their wares. The smell of fresh bread fills the air.',
    exits: [
      { direction: 'west', locationId: 'townSquare' },
    ],
    monsters: [],
    items: [ITEMS.leatherArmor],
    npcs: [
      {
        name: 'Merchant',
        dialog: [
          'Looking to buy some equipment?',
          'I have the finest goods in the land!',
        ],
      },
    ],
  },
  dungeonEntrance: {
    id: 'dungeonEntrance',
    name: 'Dungeon Entrance',
    description: 'A dark stone archway leads down into the depths. Cold air flows from within.',
    exits: [
      { direction: 'north', locationId: 'townSquare' },
      { direction: 'down', locationId: 'dungeonHall' },
    ],
    monsters: [{ ...MONSTERS.goblin }],
    items: [],
    npcs: [],
  },
  dungeonHall: {
    id: 'dungeonHall',
    name: 'Dungeon Hall',
    description: 'Torches flicker on damp stone walls. The air is thick with menace.',
    exits: [
      { direction: 'up', locationId: 'dungeonEntrance' },
      { direction: 'east', locationId: 'dungeonChamber' },
    ],
    monsters: [{ ...MONSTERS.skeleton }],
    items: [ITEMS.healthPotion],
    npcs: [],
  },
  dungeonChamber: {
    id: 'dungeonChamber',
    name: 'Ancient Chamber',
    description: 'A large chamber with ancient runes carved into the walls. Something powerful lurks here.',
    exits: [
      { direction: 'west', locationId: 'dungeonHall' },
    ],
    monsters: [{ ...MONSTERS.orc }],
    items: [ITEMS.ironSword, ITEMS.chainmail],
    npcs: [],
  },
};