class HelperUtilities {
  //#region Get Random Int Method
  /**
   * Returns a random number between min and max, inclusive
   * @param {number} min - Minimum number
   * @param {number} max - Maximum number
   */
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //#endregion

  //#region Get Random Item From Array Method
  /**
   * Returns a random choice/index/item from an array
   * @param {Array} array
   * @returns random item
   */
  static getRandomItemFromArray(array: Array<any>) {
    let randomItem = array[Math.floor(Math.random() * array.length)];
    return randomItem;
  }
  //#endregion

  //#region Validate Inputs Method
  /**
   * Validation to ensure all properties are defined and we get no errros returned
   * @param  {object} inputs Validation to make sure every property is always defined
   */
  static validateInputs(inputs: object = {}) {
    //NOTE: Old code as this would only check if the value was falsy and wouldnt know what the variable is;
    // inputs.forEach((input, index) => {
    //   if (!input) {
    //     console.log(`Missing required property at Index of ${index}`);
    //   }
    // });

    let missingFields = [];

    //NOTE: to print it out to let me know.
    //NOTE: We check the values as we pass in the keys and obviously that will return us empty values
    for (const [key, value] of Object.entries(inputs)) {
      if (value == null || value === "") {
        missingFields.push(key);
      }
    }
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  }
  //#endregion

  //#region Take Damage Method
  static takeDamage(hp: number, damage: number): number {
    return Math.max(0, hp - damage);
  }
  //#endregion

  //#region Add Health Method
  static addHealth(hp: number, maxHp: number, health: number): number {
    return Math.min(maxHp, hp + health);
  }
  //#endregion
}

export default HelperUtilities;
