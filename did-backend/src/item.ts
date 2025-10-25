import HelperUtilities from "./utils";

export interface ItemConfig {
  name: string;
  hpToAdd?: number;
  manaToAdd?: number;
  damage?: number;
  price?: number;
}

export default class Item {
  name: string;
  hpToAdd: number;
  manaToAdd: number;
  damage: number;
  price: number;

  constructor(config: ItemConfig) {
    const { name, hpToAdd = 0, manaToAdd = 0, damage = 0, price = 0 } = config;

    HelperUtilities.validateInputs({ name, hpToAdd, manaToAdd, damage, price });

    this.name = name;
    this.hpToAdd = hpToAdd;
    this.manaToAdd = manaToAdd;
    this.damage = damage;
    this.price = price;
  }
}
