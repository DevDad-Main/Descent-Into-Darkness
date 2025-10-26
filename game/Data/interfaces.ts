import Player from "../Entities/Player";

export default interface Equippable {
  name: string;
  price: number;
  equip(player: Player): void;
  unequip(player: Player): void;
}
