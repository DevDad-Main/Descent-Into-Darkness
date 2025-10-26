import { GameState, Player, GameAction, Message } from './types';
import { LOCATIONS } from './data';

export const createInitialPlayer = (name: string): Player => ({
  name,
  level: 1,
  hp: 100,
  maxHp: 100,
  attack: 5,
  defense: 2,
  xp: 0,
  xpToNextLevel: 100,
  inventory: [],
  gold: 50,
  equippedWeapon: null,
  equippedArmor: null,
});

export const initialGameState: GameState = {
  player: null,
  currentLocation: LOCATIONS.townSquare,
  gamePhase: 'menu',
  messages: [],
  combatState: null,
  pendingChoice: null,
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        player: createInitialPlayer(action.playerName),
        currentLocation: LOCATIONS.townSquare,
        gamePhase: 'playing',
        messages: [
          {
            id: Date.now().toString(),
            text: `Welcome, ${action.playerName}! Your adventure begins...`,
            type: 'system',
            timestamp: Date.now(),
          },
        ],
      };

    case 'MOVE':
      if (!state.player) return state;
      const exit = state.currentLocation.exits.find(e => e.direction === action.direction);
      if (!exit) {
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: `You can't go ${action.direction} from here.`,
              type: 'error',
              timestamp: Date.now(),
            },
          ],
        };
      }
      const newLocation = LOCATIONS[exit.locationId];
      const encounterMonster = newLocation.monsters.length > 0 && Math.random() > 0.5;
      
      if (encounterMonster) {
        return {
          ...state,
          currentLocation: newLocation,
          gamePhase: 'combat',
          combatState: {
            enemy: { ...newLocation.monsters[0] },
            playerTurn: true,
            combatLog: [`A ${newLocation.monsters[0].name} appears!`],
          },
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: `You travel ${action.direction} to ${newLocation.name}.`,
              type: 'normal',
              timestamp: Date.now(),
            },
          ],
        };
      }

      return {
        ...state,
        currentLocation: newLocation,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            text: `You travel ${action.direction} to ${newLocation.name}.`,
            type: 'normal',
            timestamp: Date.now(),
          },
        ],
      };

    case 'ATTACK':
      if (!state.player || !state.combatState) return state;
      
      const playerDamage = Math.max(1, state.player.attack + (state.player.equippedWeapon?.attackBonus || 0) - state.combatState.enemy.defense);
      const newEnemyHp = state.combatState.enemy.hp - playerDamage;
      
      if (newEnemyHp <= 0) {
        const xpGained = state.combatState.enemy.xpReward;
        const goldGained = state.combatState.enemy.goldReward;
        const newXp = state.player.xp + xpGained;
        const levelUp = newXp >= state.player.xpToNextLevel;
        
        return {
          ...state,
          player: {
            ...state.player,
            xp: levelUp ? newXp - state.player.xpToNextLevel : newXp,
            level: levelUp ? state.player.level + 1 : state.player.level,
            maxHp: levelUp ? state.player.maxHp + 20 : state.player.maxHp,
            hp: levelUp ? state.player.maxHp + 20 : state.player.hp,
            attack: levelUp ? state.player.attack + 2 : state.player.attack,
            defense: levelUp ? state.player.defense + 1 : state.player.defense,
            xpToNextLevel: levelUp ? state.player.xpToNextLevel + 50 : state.player.xpToNextLevel,
            gold: state.player.gold + goldGained,
          },
          gamePhase: 'playing',
          combatState: null,
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: `You defeated the ${state.combatState.enemy.name}! Gained ${xpGained} XP and ${goldGained} gold.${levelUp ? ' LEVEL UP!' : ''}`,
              type: 'success',
              timestamp: Date.now(),
            },
          ],
        };
      }
      
      const enemyDamage = Math.max(1, state.combatState.enemy.attack - (state.player.defense + (state.player.equippedArmor?.defenseBonus || 0)));
      const newPlayerHp = state.player.hp - enemyDamage;
      
      if (newPlayerHp <= 0) {
        return {
          ...state,
          player: { ...state.player, hp: 0 },
          gamePhase: 'gameOver',
          combatState: null,
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: 'You have been defeated... Game Over.',
              type: 'error',
              timestamp: Date.now(),
            },
          ],
        };
      }
      
      return {
        ...state,
        player: { ...state.player, hp: newPlayerHp },
        combatState: {
          ...state.combatState,
          enemy: { ...state.combatState.enemy, hp: newEnemyHp },
          combatLog: [
            ...state.combatState.combatLog,
            `You deal ${playerDamage} damage!`,
            `${state.combatState.enemy.name} deals ${enemyDamage} damage!`,
          ],
        },
      };

    case 'RUN':
      if (Math.random() > 0.5) {
        return {
          ...state,
          gamePhase: 'playing',
          combatState: null,
          messages: [
            ...state.messages,
            {
              id: Date.now().toString(),
              text: 'You successfully escaped!',
              type: 'success',
              timestamp: Date.now(),
            },
          ],
        };
      }
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            text: 'Failed to escape!',
            type: 'error',
            timestamp: Date.now(),
          },
        ],
      };

    case 'SHOW_INVENTORY':
      return {
        ...state,
        gamePhase: 'inventory',
      };

    case 'RETURN_TO_MENU':
      return {
        ...initialGameState,
        gamePhase: 'menu',
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case 'SHOW_CHOICE':
      return {
        ...state,
        pendingChoice: action.choice,
      };

    case 'MAKE_CHOICE':
      if (!state.pendingChoice) return state;
      
      // Clear the choice and dispatch the callback action
      return {
        ...state,
        pendingChoice: null,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            text: `Choice made: ${action.value}`,
            type: 'system',
            timestamp: Date.now(),
          },
        ],
      };

    case 'CUSTOM_PLAYER_ACTION':
      // Handle custom player actions here
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            text: `Custom action: ${action.action}`,
            type: 'system',
            timestamp: Date.now(),
          },
        ],
      };

    default:
      return state;
  }
};