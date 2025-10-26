import { Message, Choice } from './types';

/**
 * UI Helper for Player Class Methods
 * Use these instead of console.log/prompt to interact with the frontend
 */
export class UIAdapter {
  private dispatch: (action: any) => void;

  constructor(dispatch: (action: any) => void) {
    this.dispatch = dispatch;
  }

  /**
   * Display a message to the player (replaces console.log)
   */
  showMessage(text: string, type: 'normal' | 'combat' | 'system' | 'error' | 'success' = 'normal') {
    const message: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: Date.now(),
    };
    this.dispatch({ type: 'ADD_MESSAGE', message });
  }

  /**
   * Show multiple messages at once
   */
  showMessages(messages: string[], type: 'normal' | 'combat' | 'system' | 'error' | 'success' = 'normal') {
    messages.forEach(text => this.showMessage(text, type));
  }

  /**
   * Display a choice menu to the player (replaces prompt)
   */
  showChoice(prompt: string, options: { key: string; text: string; value: any }[], callback: string) {
    const choice: Choice = {
      id: Date.now().toString(),
      prompt,
      options,
      callback,
    };
    this.dispatch({ type: 'SHOW_CHOICE', choice });
  }

  /**
   * Trigger a custom player action
   */
  triggerAction(action: string, data?: any) {
    this.dispatch({ type: 'CUSTOM_PLAYER_ACTION', action, data });
  }

  /**
   * Display combat message
   */
  showCombat(text: string) {
    this.showMessage(text, 'combat');
  }

  /**
   * Display error message
   */
  showError(text: string) {
    this.showMessage(text, 'error');
  }

  /**
   * Display success message
   */
  showSuccess(text: string) {
    this.showMessage(text, 'success');
  }

  /**
   * Display system message
   */
  showSystem(text: string) {
    this.showMessage(text, 'system');
  }
}

/**
 * Example Player Class Integration
 */
export class PlayerAdapter {
  private ui: UIAdapter;
  
  constructor(ui: UIAdapter) {
    this.ui = ui;
  }

  // Example method that outputs to UI instead of console
  attack(enemyName: string, damage: number) {
    this.ui.showCombat(`You attack ${enemyName} for ${damage} damage!`);
  }

  // Example method that shows choices instead of prompt
  chooseAction() {
    this.ui.showChoice(
      'What would you like to do?',
      [
        { key: '1', text: 'Attack', value: 'attack' },
        { key: '2', text: 'Defend', value: 'defend' },
        { key: '3', text: 'Use Item', value: 'item' },
        { key: '4', text: 'Run', value: 'run' },
      ],
      'PLAYER_COMBAT_CHOICE'
    );
  }

  // Example method with multiple messages
  levelUp(newLevel: number, stats: { hp: number; attack: number; defense: number }) {
    this.ui.showSuccess('🎉 LEVEL UP! 🎉');
    this.ui.showSystem(`You are now level ${newLevel}!`);
    this.ui.showSystem(`HP: +${stats.hp} | Attack: +${stats.attack} | Defense: +${stats.defense}`);
  }
}
