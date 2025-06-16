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
  melee_attack(enemy) {}

  /**
   * Handles additional options for thieves in combat.
   * @param {object} enemy - Potential encounter when thieiving.
   */
  thievery(enemy) {}

  /**
   * Spells menu that only mages have access to.
   * @param {object} enemy - Enemy encounter when in combat
   */
  spells(enemy) {}
}
