import { Equippable } from "../Data/interfaces";
import Player from "../Entities/Player";

export default class Armour implements Equippable {
  constructor(
    public name: string,
    public defense: number,
    public price: number,
  ) {}

  equip(player: Player): void {
    player.accuracy += this.defense;
    player.armour = this.name;
    console.log(`\nYou have equipped the ${this.name}.`);
  }

  unequip(player: Player): void {
    player.accuracy -= this.defense;
    player.armour = "";
    console.log(`\nYou have unequipped the ${this.name}.`);
  }
}
