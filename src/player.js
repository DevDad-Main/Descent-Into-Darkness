import HelperUtilities from "./utils.js";

class Player {
  //#region Constructor
  #level = 1;
  constructor(config = {}) {
    const {
      name,
      playerClass,
      maxHp,
      hp,
      strength,
      accuracy,
      stamina,
      maxMana,
      mana,
      equipment,
      items,
      stealableItems,
      stealableWeapons,
      stealableMagicItems,
      gold,
      xp,
      back,
      usedItem,
      weapon,
      armour,
      combat,
      special,
      room,
    } = config;
    // Object.assign(this, {
    //   name,
    //   playerClass,
    //   maxHp,
    //   hp,
    //   strength,
    //   accuracy,
    //   stamina,
    //   maxMana,
    //   mana,
    //   equipment,
    //   items,
    //   stealableItems,
    //   stealableWeapons,
    //   stealableMagicItems,
    //   gold,
    //   xp,
    //   back,
    //   usedItem,
    //   weapon,
    //   armour,
    //   combat,
    //   special,
    //   room,
    // });
    HelperUtilities.validateInputs({
      name,
      playerClass,
      maxHp,
      hp,
      strength,
      accuracy,
      stamina,
      maxMana,
      mana,
      equipment,
      items,
      stealableItems,
      stealableWeapons,
      stealableMagicItems,
      gold,
      xp,
      back,
      usedItem,
      weapon,
      armour,
      combat,
      special,
      room,
    });

    Object.assign(this, config);
    // HelperUtilities.validateInputs({
    //   name,
    //   playerClass,
    //   maxHp,
    //   hp,
    //   strength,
    //   accuracy,
    //   stamina,
    //   maxMana,
    //   mana,
    //   equipment,
    //   items,
    //   stealableItems,
    //   stealableWeapons,
    //   stealableMagicItems,
    //   gold,
    //   xp,
    //   back,
    //   usedItem,
    //   weapon,
    //   armour,
    //   combat,
    //   special,
    //   room,
    // });
    //
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
  //#endregion

  //#region Getters and Setters
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
  //#endregion

  //#region Get Xp To Next Level Method
  /**
   * Returns the amount of XP required to level up
   * @returns {number} The amount of XP required to level up
   */
  #getXpToNextLevel() {
    // Example: XP required increases each level
    return 10 * this.level ** 2;
  }
  //#endregion

  //#region Attack Method
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
  //#endregion

  //#region Melee Attack Method
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
  //#endregion

  //#region Thievery Method
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
  //#endregion

  //#region Spells Method
  /**
   * Spells menu that only mages have access to.
   * @param {object} enemy - Enemy encounter when in combat
   */
  spells(enemy) {
    this.back = false;
    while (true) {
      console.log(
        `\n[Heal | 4 MP]| [Fireball | 7 MP] | [Stun | 10 MP] | [Back] -> `,
      );
      console.log(`MP: ${this.mana}`);
      let choice = prompt(`Select Spell -> `).toLowerCase();
      if (choice === "back") {
        this.back = true;
        break;
      } else if (choice === "heal") {
        if (this.mana < 4) {
          console.log(
            "You do not have enough Mana Points to cast the Heal spell!",
          );
        } else {
          this.hp += 5;
          this.mana -= 4;
          if (this.hp > this.max_hp) this.hp = this.max_hp;
          console.log(`\n${this.name} casts Heal and reqains 8 HP!`);
          break;
        }
      } else if (choice === "fireball") {
        if (!this.combat) {
          prompt("\nNothing to cast fireball on! -> ");
        } else if (this.mana < 7) {
          console.log("You do not have enough Mana Points to cast Fireball!");
        } else {
          this.mana -= 7;
          let spellDamage = HelperUtilities.getRandomInt(12, 15);
          enemy.hp -= spellDamage;
          console.log(
            `\n${this.name} casts Fireball and ${enemy.name} takes ${spellDamage} damage!`,
          );
          break;
        }
      } else if (choice === "stun") {
        if (!this.combat) {
          console.log("\nNothing to cast Stun on! -> ");
        } else if (this.mana < 5) {
          console.log("You do not have enough Mana Points to cast Stun!");
        } else {
          this.mana -= 10;
          enemy.stunned = 2;
          prompt(
            `\n${this.name} casts Stun!. ${enemy.name}'s eyes glaze over...`,
          );
          break;
        }
      }
    }
  }
  //#endregion

  //#region Inventory Method
  /**
   * First layer of inventory fucntionality. Displays a list of items
   * currently in inventory and actions that can be perfomed wih them.
   */
  inventory() {
    this.back = false;
    while (true) {
      if (this.equipment.length < 1 && this.items < 1 && this.gold < 1) {
        //NOTE: Well your poor.
        console.log(`\nYou are not currently carrying anything.`);
      } else {
        console.log("\n////////////////////////////");
        console.log("You are currently carrying...");
        console.log("\nEquipment:");
        for (const item of this.equipment) {
          console.log(item.name);
        }
        console.log(`\nItems:`);
        if (this.items < 1) {
          console.log(`You are not currently carrying any items`);
        } else {
          for (const item of this.items) {
            console.log(item.name);
          }
        }
        console.log(`\nGold: ${this.gold}`);
      }
      let choice = prompt(
        `\n[Equip] | [Use] | [Inspect] | [Back] -> `,
      ).toLowerCase();

      if (choice === "equip") {
        this.changeEquipment();
        if (this.back) {
          continue;
        } else {
          break;
        }
      } else if (choice === "use") {
        if (this.combat) {
          this.usedItem = true;
          break;
        } else if (!this.combat) {
          this.useItem(null);
        }
      } else if (choice === "inspect") {
        this.inspect();
        continue;
      } else if (choice === "back") {
        this.back = true;
        break;
      } else {
        continue;
      }
    }
  }
  //#endregion

  //#region Change Equipment Method
  /**
   * Handles the [Equip] option from the first inventory menu.
   */
  changeEquipment() {
    this.back = false;
    while (true) {
      console.log("\nEquipment:");
      this.equipment.forEach((item, index) => {
        console.log(`${index}. ${item.name}`);
      });
      try {
        let choice = prompt(
          `\nSelect an item with the corresponding number or [Back] -> `,
        ).toLowerCase();

        if (choice === "back") {
          this.back = true;
          break;
        }
        let intChoice = parseInt(choice);
        if (
          this.weapon === this.equipment[intChoice].name ||
          this.armour === this.equipment[intChoice].name
        ) {
          let confirm = prompt(
            `Would you like to unequip the ${this.equipment[intChoice].name} -> `,
          ).toLowerCase();

          if (confirm === "yes") {
            this.equipment[intChoice].unequip();
            break;
          }
        } else {
          let confirm = prompt(
            `Would you like to equip the ${this.equipment[intChoice].name}? -> `,
          ).toLowerCase();
          if (confirm === "yes") {
            this.equipment[intChoice].equip();
            break;
          }
        }
      } catch (error) {
        console.log(`Error accesing Value: ${error}`);
        continue;
      }
    }
  }
  //#endregion

  //#region Use Item Method
  /**
   * Handles the [Use] from the first Inventory menu
   * @param {object} enemy - Enemy encounter when in combat
   */
  useItem(enemy) {
    this.usedItem = false;
    this.back = false;
    while (!this.usedItem) {
      console.log(`\nItems:`);
      this.items.forEach((item, index) => {
        console.log(`${index}. ${item.name}`);
      });
      try {
        let choice = prompt(
          `\nSelect an item by it;s number or [Back] -> `,
        ).toLowerCase();

        if (choice === "back") {
          this.back = true;
          break;
        }
        let intChoice = parseInt(choice);
        let itemChoice = this.items[intChoice];
        let confirm = prompt(
          `Wold you like to use ${this.items[intChoice].name}? -> `,
        ).toLowerCase();
        if (choice === "yes") {
          //NOTE: These conditionals are figuring out if the item chosen
          //NOTE: Will add HP/MANA to the player or deal damage to the enemy
          if (itemChoice.manaToAdd === 0 && itemChoice.damage === 0) {
            this.hp += itemChoice.hpToAdd;
            if (this.hp > this.maxHp) {
              this.hp = this.maxHp;
            }
            prompt(
              `\n${this.name} uses the ${itemChoice.name} and regains ${itemChoice.hpToAdd} HP!`,
            );

            this.items.splice(intChoice, 1);
            this.usedItem = true;
          } else if (itemChoice.hpToAdd === 0 && itemChoice.damage === 0) {
            this.mana += itemChoice.manaToAdd;
            if (this.mana > this.maxMana) {
              this.mana = this.maxMana;
            }
            prompt(
              `\n${this.name} uses the ${itemChoice.name} an regains ${itemChoice.manaToAdd} MP!`,
            );
            this.items.splice(intChoice, 1);
            this.usedItem = true;
          } else if (itemChoice.hpToAdd === 0 && itemChoice.manaToAdd === 0) {
            if (!this.combat) {
              prompt(`\nNothing to use ${itemChoice.name} on!`);
            } else {
              prompt(
                `\n${this.name} uses the ${itemChoice.name} on ${enemy.name} and deals ${itemChoice.damage} damage!`,
              );
              enemy.hp -= itemChoice.damage;
              this.items.splice(intChoice, 1);
              this.usedItem = true;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }
  }
  //#endregion

  //#region Inspect Item Method
  /**
   * Handles [Inspect] option from the Inventory menu. Displays an item's stats given
   * its index in player.equipment
   */
  inspect() {
    this.back = false;
    console.log(`Equipment:`);
    this.equipment.forEach((item, index) => {
      console.log(`${index}. ${item.name}`);
    });
    while (true) {
      try {
        let choice = prompt(
          `\nInspect an item by its number or [Back] -> `,
        ).toLowerCase();
        if (choice === "back") {
          this.back = true;
          break;
        }
        let intChoice = parseInt(choice);
        let item = this.equipment[intChoice];
        if (item?.attack != null) {
          console.log(`\n${item.name}`);
          console.log(`Attack: ${item.attack}`);
          console.log(`Accuracy Penalty: ${item.accuracyPenalty}`);
        } else {
          console.log(`\n ${this.equipment[intChoice].name}`);
          console.log(`Defence: ${this.equipment[intChoice].defence}`);
        }
      } catch (error) {
        console.log(`\nChoose an item by its number.`);
      }
    }
  }
  //#endregion

  //#region Status Method
  /**
   * Displays current player status (Stats, Items equipped etc)
   */
  status() {
    this.back = false;
    while (true) {
      console.log("\n////////////////////////////");
      console.log(`\n${this.name}'s status:`);
      console.log(`HP: ${this.hp}, MP: ${this.mana}`);
      console.log(`Strength: ${this.strength}, Stamina: ${this.stamina}`);
      console.log(`AC: ${this.ac}`);
      console.log("\nEquipped:");
      this.weapon === ""
        ? console.log("Weapon: None")
        : console.log(`${this.weapon.name}`);
      this.armour === ""
        ? console.log("Armor: None")
        : console.log(`${this.armour.name}`);

      console.log("\nItems:");

      if (this.items.length < 1) {
        console.log("You have no items.");
      } else {
        for (const item of this.items) {
          console.log(item.name);
        }
      }
      console.log(`\nLevel ${this.level} ${this.player_class}`);
      console.log(`XP to next level: ${this.#getXpToNextLevel() - this.xp}`);

      const choice = prompt("\n[Back] -> ");
      if (choice && choice.toLowerCase() === "back") {
        this.back = true;
        break;
      }

      console.log("Invalid input. Please type 'back' to return.");
    }
  }
  //#endregion

  //#region Flee Method
  /**
   * Handles the [Flee] option from the combat menu. Randomly
   * determines if the monster blocks your flight attempt.
   */
  flee() {
    this.back = false;
    while (true) {
      const flee_chance = HelperUtilities.getRandomInt(1, 10);
    }
  }

  //#endregion
}

export default Player;
