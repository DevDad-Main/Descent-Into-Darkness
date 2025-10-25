import Player from "./Player";

//#region Monster Config Interface
export interface MonsterConfig {
  name: string;
  maxHp: number;
  hp: number;
  strength: number;
  accuracy: number;
  stamina: number;
  xp: number;
  weapon: string;
  stunned: boolean;
}
//#endregion

//#region Monster Class
export default class Monster {
  //#region Properties
  name: string;
  maxHp: number;
  hp: number;
  strength: number;
  accuracy: number;
  stamina: number;
  xp: number;
  weapon: string;
  stunned: boolean;
  //#endregion

  //#region Constructor
  constructor(config: MonsterConfig) {
    const {
      name,
      maxHp = 20,
      hp = 20,
      strength = 4,
      accuracy = 4,
      stamina = 3,
      xp = 7,
      weapon = "claws",
      stunned = false,
    } = config;

    this.name = name;
    this.maxHp = maxHp;
    this.hp = hp;
    this.strength = strength;
    this.accuracy = accuracy;
    this.stamina = stamina;
    this.xp = xp;
    this.weapon = weapon;
    this.stunned = stunned;
  }
  //#endregion

  //#region Attack Method
  /**
   * Attack method for monsters.
   * @param {object} enemy - The Players current attackable enemy
   */
  meleeAttack(enemy: Player) {
    const attack = 2 + this.strength + Math.round(this.stamina * Math.random());
    const damage =
      Math.round(Math.random() * (this.stamina / 2)) + this.strength;

    if (attack >= enemy.accuracy) {
      console.log(
        `\n${this.name} strikes ${enemy.name} with their ${this.weapon} for ${damage} damage!`,
      );
      enemy.takeDamage(damage);
    } else {
      console.log(`\n${this.name} missed!`);
    }
  }
  //#endregion
}
//#endregion
