import HelperUtilities from "./utils.js";

class Item {
  constructor(config = {}) {
    //NOTE: Destructuring our consructor inputs into a config object.
    //NOTE: For eas of access and also easily allowing us to dynamically add more
    //NOTE: properties If we so wish
    const { name, hpToAdd, manaToAdd, damage, price } = config;

    //NOTE: Using our static helper script to validate and make sure all properties are defined
    HelperUtilities.validateInputs({ name, hpToAdd, manaToAdd, damage, price });

    Object.assign(this, config);
  }
}
export default Item;
