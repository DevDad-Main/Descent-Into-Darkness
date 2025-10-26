import Weapon from "./Weapon";

export default class MagicWeapon extends Weapon {
  constructor(name: string, attack: number, acPenalty: number, price: number) {
    super(name, attack, acPenalty, price); // Call parent constructor
  }
}
