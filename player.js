import { HelperUtilities } from "./utils.js";

export class Player {
  #level = 1;
  constructor({
    name,
    player_class,
    max_hp,
    hp,
    strength,
    accuracy,
    stamina,
    max_mana,
    mana,
    equipment,
    items,
    stealableItems,
    stealableWeapons,
    stealableMagicItems,
    gold,
    xp,
    back,
    used_item,
    weapon,
    armour,
    combat,
    special,
    room,
  }) {
    if (!name || !player_class) {
      throw new Error("Missing required player properties");
    }
    Object.assign(this, {
      name,
      player_class,
      max_hp,
      hp,
      strength,
      accuracy,
      stamina,
      max_mana,
      mana,
      equipment,
      items,
      stealableItems,
      stealableWeapons,
      stealableMagicItems,
      gold,
      xp,
      back,
      used_item,
      weapon,
      armour,
      combat,
      special,
      room,
    });
    /*//NOTE: REMINDER
      //NOTE: I pass one object with named properties when creating the player.
      //NOTE: The constructor({ ... }) pulls out those properties using destructuring.
      //NOTE: Object.assign(this, {...}) attaches all the variables to the new object instance quickly.
      //NOTE: I can still validate required fields by checking their values.
      //NOTE: Now we don't have to write out all the below, we can do the above in a cleaner fashion.
     */
    // {this.name = name;
    // this.player_class = player_class;
    // this.max_hp = max_hp;
    // this.hp = hp;
    // this.strength = strength;
    // this.accuracy = accuracy;
    // this.stamina = stamina;
    // this.max_mana = max_mana;
    // this.mana = mana;
    // this.equipment = equipment;
    // this.items = items;
    // this.gold = gold;
    // this.xp = xp;
    // this.back = back;
    // this.used_item = used_item;
    // this.weapon = weapon;
    // this.armour = armour;
    // this.combat = combat;
    // this.special = special;
    // this.room = room; }
  }

  /**
   * Getter property for accessing private player level;
   * @param {number} level - The players current level
   */
  get level() {
    return this.#level;
  }

  /**
   * Setter property for accessing private player level;
   * @param {number} level - The players current level
   */
  set level(value) {
    if (value <= this.#level) {
      return console.error(
        "Player Level cannot be set lower than current level",
      );
    }
    return (this.#level = value);
  }

  /**
   * Attack method for fighter class.
   * @param {object} enemy - The Players current attackable enemy
   */
  attack(enemy) {
    this.back = false;
    while (true) {
      console.log("\n[Weapon] | [Gut] punch | [Back]");
      let choice = prompt("Select Attack -> ").toLowerCase();
      if (choice === "back") {
        this.back = true;
        break;
      } else if (choice === "weapon") {
        this.melee_attack(enemy);
        break;
      } else if (choice === "gut") {
        if (this.special < 1) {
          prompt("\nYou can't get a good shot at their stomach!.");
          continue;
        } else {
          this.special -= 2;
          enemy.stunned = 1;
          let damage = Math.floor(Math.random() * 3) + 1;
          enemy.hp -= damage;
          prompt(`${this.name} punches ${enemy.name} in the stomach for ${damage} damage!
                           ${enemy.name} doubles over in pain. -> `);
          break;
        }
      }
    }
  }

  /**
   * Basic melee attack for all classes.
   * @param {object} enemy - The Players current attackable enemy
   */
  melee_attack(enemy) {
    let attack = 2 + this.strength + Math.round(this.stamina * Math.random());
    let damage = Math.round(Math.random() * (this.stamina / 2)) + this.strength;
    if (attack >= enemy.accuracy) {
      prompt(
        `\n${this.name} strikes ${enemy.name} with their ${this.weapon} for ${damage} damage!`,
      );
      enemy.hp -= damage;
    } else {
      console.log(`\n${this.name} missed!`);
    }
  }

  /**
   * Handles additional options for thieves in combat.
   * @param {object} enemy - Potential encounter when thieiving.
   */
  thievery(enemy) {
    this.back = false;
    while (true) {
      let choice = prompt(`\n[Steal] | [Backstab] | [Back] -> `).toLowerCase();
      if (choice === "back") {
        this.back = true;
        break;
      } else if (choice === "steal") {
        if (Math.floor(Math.random() * 10) > 2) {
          // let lootType = Math.floor(Math.random() * 100) + 1;
          let lootType = HelperUtilities.getRandomInt(1, 100);
          if (lootType > 65) {
            let gold = HelperUtilities.getRandomInt(1, 15);
            this.gold += gold;
            prompt(`\nYou have successfully stolen ${gold} gold!`);
            break;
          } else if (lootType > 16 && lootType < 65) {
            let randomItem = HelperUtilities.getRandomItemFromArray(
              this.stealableItems,
            );
            prompt(`\nYou have successfully stolen ${randomItem}!`);
            this.items.push(randomItem);
            break;
          } else if (lootType > 0 && lootType < 15) {
            let randomItem = HelperUtilities.getRandomItemFromArray(
              this.stealableWeapons,
            );
            prompt(`\nYou have successfully stolen ${randomItem}!`);
            this.equipment.push(randomItem);
            break;
          } else {
            let randomItem = HelperUtilities.getRandomItemFromArray(
              this.stealableMagicItems,
            );
            prompt(`\nYou have successfully stolen ${randomItem}!`);
            this.equipment.push(randomItem);
            break;
          }
        } else {
          prompt(`\nThe creature catches you rifling through it's things!`);
          break;
        }
      } else if (choice === "backstab") {
        if (this.special < 1) {
          prompt(`\nYou are too exhausted to attempt another backstab!`);
        } else {
          prompt(`You attempt to maneuver behind the creature...`);
          let attack =
            5 + this.strength + Math.round(this.stamina * Math.random());
          let damage =
            Math.round(Math.random() * (this.stamina / 2)) + this.strength + 10;

          if (attack >= enemy.accuracy) {
            prompt(
              `\n${this.name} backstabs ${enemy.name} with their ${this.weapon} for ${damage} damage!`,
            );
            enemy.hp -= damage;
            this.special -= 1;
            break;
          } else {
            console.log(`\n${this.name} missed!`);
            this.special -= 1;
            break;
          }
        }
      }
    }
  }

  /**
   * Spells menu that only mages have access to.
   * @param {object} enemy - Enemy encounter when in combat
   */
  spells(enemy) {}
}
