import { TerminalLine } from "../components/Terminal";

export class GameEngine {
  private lines: TerminalLine[] = [];
  private gameState: {
    location: string;
    inventory: string[];
    health: number;
    maxHealth: number;
    inCombat: boolean;
    enemy?: { name: string; health: number };
  };

  constructor(savedState?: any) {
    if (savedState) {
      this.gameState = savedState;
      this.lines = [];
    } else {
      this.gameState = {
        location: "forest_entrance",
        inventory: ["rusty_sword"],
        health: 100,
        maxHealth: 100,
        inCombat: false,
      };
    }
  }

  getLines(): TerminalLine[] {
    return this.lines;
  }

  addLine(
    text: string,
    type: TerminalLine["type"] = "output"
  ): Promise<void> {
    return new Promise((resolve) => {
      this.lines.push({
        id: `${Date.now()}-${Math.random()}`,
        text,
        type,
        timestamp: Date.now(),
      });
      setTimeout(resolve, 50);
    });
  }

  saveGame(): string {
    const saveData = {
      gameState: this.gameState,
      timestamp: Date.now(),
    };
    const saveString = JSON.stringify(saveData);
    localStorage.setItem("rpg_save", saveString);
    return saveString;
  }

  static loadGame(): any | null {
    const saveString = localStorage.getItem("rpg_save");
    if (!saveString) return null;
    try {
      const saveData = JSON.parse(saveString);
      return saveData.gameState;
    } catch {
      return null;
    }
  }

  static hasSavedGame(): boolean {
    return localStorage.getItem("rpg_save") !== null;
  }

  async processCommand(command: string): Promise<{
    shake?: boolean;
    flash?: string;
  }> {
    await this.addLine(command, "input");

    const cmd = command.toLowerCase().trim();
    const parts = cmd.split(" ");
    const action = parts[0];

    let effects: { shake?: boolean; flash?: string } = {};

    switch (action) {
      case "save":
        this.saveGame();
        await this.addLine("Game saved successfully!", "success");
        break;
      case "help":
        await this.showHelp();
        break;
      case "look":
        await this.look();
        break;
      case "inventory":
      case "inv":
        await this.showInventory();
        break;
      case "status":
        await this.showStatus();
        break;
      case "go":
      case "move":
        await this.move(parts.slice(1).join(" "));
        break;
      case "take":
      case "get":
        await this.takeItem(parts.slice(1).join(" "));
        break;
      case "attack":
      case "fight":
        effects = await this.attack(parts.slice(1).join(" "));
        break;
      case "use":
        await this.useItem(parts.slice(1).join(" "));
        break;
      case "talk":
        await this.talk(parts.slice(1).join(" "));
        break;
      default:
        await this.addLine(
          `Unknown command: "${command}". Type "help" for available commands.`,
          "error"
        );
    }

    return effects;
  }

  private async showHelp() {
    await this.addLine("=== AVAILABLE COMMANDS ===", "system");
    await this.addLine("  help          - Show this help message");
    await this.addLine("  save          - Save your game");
    await this.addLine("  look          - Examine your surroundings");
    await this.addLine("  inventory     - Check your inventory");
    await this.addLine("  status        - View your character status");
    await this.addLine("  go [place]    - Move to a location");
    await this.addLine("  take [item]   - Pick up an item");
    await this.addLine("  attack [target] - Attack an enemy");
    await this.addLine("  use [item]    - Use an item from inventory");
    await this.addLine("  talk [person] - Talk to someone");
    await this.addLine("========================", "system");
  }

  private async look() {
    const locations: Record<string, any> = {
      forest_entrance: {
        description:
          "You stand at the entrance of a dark forest. Ancient trees loom overhead, their branches creating a canopy that blocks most sunlight. A narrow path leads deeper into the woods.",
        items: ["wooden_shield"],
        exits: ["deeper_forest", "village"],
        npcs: ["old_hermit"],
      },
      deeper_forest: {
        description:
          "The forest grows darker here. Strange sounds echo through the trees. You sense danger nearby.",
        items: ["health_potion"],
        exits: ["forest_entrance", "cave"],
        enemies: ["goblin"],
      },
      village: {
        description:
          "A small peaceful village with thatched-roof cottages. Villagers go about their daily business.",
        items: [],
        exits: ["forest_entrance", "tavern"],
        npcs: ["merchant", "guard"],
      },
    };

    const loc = locations[this.gameState.location];
    if (!loc) {
      await this.addLine("You are in an unknown location.", "error");
      return;
    }

    await this.addLine(loc.description);
    
    if (loc.items && loc.items.length > 0) {
      await this.addLine(
        `\nYou see: ${loc.items.join(", ")}`,
        "success"
      );
    }

    if (loc.npcs && loc.npcs.length > 0) {
      await this.addLine(`\nPeople here: ${loc.npcs.join(", ")}`);
    }

    if (loc.enemies && loc.enemies.length > 0) {
      await this.addLine(`\n⚠ Enemies: ${loc.enemies.join(", ")}`, "error");
    }

    if (loc.exits && loc.exits.length > 0) {
      await this.addLine(`\nExits: ${loc.exits.join(", ")}`);
    }
  }

  private async showInventory() {
    await this.addLine("=== INVENTORY ===", "system");
    if (this.gameState.inventory.length === 0) {
      await this.addLine("Your inventory is empty.");
    } else {
      for (const item of this.gameState.inventory) {
        await this.addLine(`  • ${item.replace(/_/g, " ")}`);
      }
    }
    await this.addLine("=================", "system");
  }

  private async showStatus() {
    await this.addLine("=== CHARACTER STATUS ===", "system");
    await this.addLine(
      `Health: ${this.gameState.health}/${this.gameState.maxHealth}`,
      this.gameState.health < 30 ? "error" : "success"
    );
    await this.addLine(
      `Location: ${this.gameState.location.replace(/_/g, " ")}`
    );
    await this.addLine(
      `Items: ${this.gameState.inventory.length}`
    );
    if (this.gameState.inCombat && this.gameState.enemy) {
      await this.addLine(
        `⚔ In combat with: ${this.gameState.enemy.name} (HP: ${this.gameState.enemy.health})`,
        "error"
      );
    }
    await this.addLine("========================", "system");
  }

  private async move(destination: string) {
    const dest = destination.toLowerCase().replace(/ /g, "_");
    // Simplified movement - in real game, check valid exits
    this.gameState.location = dest;
    await this.addLine(`You move to ${destination}...`, "success");
    await this.look();
  }

  private async takeItem(item: string) {
    const itemName = item.toLowerCase().replace(/ /g, "_");
    this.gameState.inventory.push(itemName);
    await this.addLine(`You picked up: ${item}`, "success");
  }

  private async attack(
    target: string
  ): Promise<{ shake?: boolean; flash?: string }> {
    if (!this.gameState.inCombat) {
      this.gameState.inCombat = true;
      this.gameState.enemy = {
        name: target || "goblin",
        health: 50,
      };
    }

    const damage = Math.floor(Math.random() * 20) + 10;
    if (this.gameState.enemy) {
      this.gameState.enemy.health -= damage;
      await this.addLine(
        `⚔ You attack ${this.gameState.enemy.name} for ${damage} damage!`,
        "error"
      );

      if (this.gameState.enemy.health <= 0) {
        await this.addLine(
          `✓ You defeated ${this.gameState.enemy.name}!`,
          "success"
        );
        this.gameState.inCombat = false;
        this.gameState.enemy = undefined;
        return { shake: false };
      }

      // Enemy counter-attack
      const enemyDamage = Math.floor(Math.random() * 15) + 5;
      this.gameState.health -= enemyDamage;
      await this.addLine(
        `✗ ${this.gameState.enemy.name} hits you for ${enemyDamage} damage!`,
        "error"
      );

      if (this.gameState.health <= 0) {
        await this.addLine("☠ You have been defeated...", "error");
        this.gameState.health = 0;
      }

      return { shake: true, flash: "#4a0000" };
    }

    return {};
  }

  private async useItem(item: string) {
    const itemName = item.toLowerCase().replace(/ /g, "_");
    const index = this.gameState.inventory.indexOf(itemName);

    if (index === -1) {
      await this.addLine(`You don't have: ${item}`, "error");
      return;
    }

    if (itemName.includes("potion")) {
      const healing = 30;
      this.gameState.health = Math.min(
        this.gameState.maxHealth,
        this.gameState.health + healing
      );
      this.gameState.inventory.splice(index, 1);
      await this.addLine(
        `You used ${item} and restored ${healing} health!`,
        "success"
      );
    } else {
      await this.addLine(`You can't use ${item} right now.`);
    }
  }

  private async talk(person: string) {
    const dialogues: Record<string, string> = {
      old_hermit:
        "Hermit: 'Beware the deeper forest, traveler. Dark creatures lurk within...'",
      merchant: "Merchant: 'Welcome! I have wares if you have coin.'",
      guard: "Guard: 'Stay safe out there, adventurer.'",
    };

    const npc = person.toLowerCase().replace(/ /g, "_");
    const dialogue = dialogues[npc];

    if (dialogue) {
      await this.addLine(dialogue, "success");
    } else {
      await this.addLine(`There's no one named "${person}" here.`, "error");
    }
  }

  async initialize() {
    await this.addLine("=".repeat(60), "system");
    await this.addLine(
      "    WELCOME TO THE DARK FOREST ADVENTURE",
      "system"
    );
    await this.addLine("=".repeat(60), "system");
    await this.addLine("");
    await this.addLine(
      "You awaken in a mysterious forest with no memory of how you got here."
    );
    await this.addLine(
      "Your only possessions are a rusty sword and your wits."
    );
    await this.addLine("");
    await this.addLine('Type "help" for available commands.', "success");
    await this.addLine("");
    await this.look();
  }
}