import Equippable from "../Data/interfaces";
import Player from "../Entities/Player";

class Weapon implements Equippable {
  constructor(
    private _name: string,
    private _attack: number,
    private _acPenalty: number,
    private _price: number,
  ) {}

  get name(): string {
    return this._name;
  }

  get attack(): number {
    return this._attack;
  }

  get acPenalty(): number {
    return this._acPenalty;
  }

  get price(): number {
    return this._price;
  }

  equip(player: Player): void {
    player.strength += this._attack;
    player.stamina += this._attack / 2;
    player.accuracy -= this._acPenalty;
    player.weapon = this._name;
    console.log(`\nYou have equipped the ${this._name}.`);
  }

  unequip(player: Player): void {
    player.strength -= this._attack;
    player.stamina -= this._attack / 2;
    player.accuracy += this._acPenalty;
    player.weapon = "";
    console.log(`\nYou have unequipped the ${this._name}.`);
  }
}
