//NOTE: Made our own static class as we will be calling this multiple times
class HelperUtilities {
  /**
   * Returns a random number between min and max, inclusive
   * @param {number} min - Minimum number
   * @param {number} max - Maximum number
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random choice/index/item from an array
   * @param {Array} array
   * @returns random item
   */
  static getRandomItemFromArray(array) {
    let randomItem = array[Math.floor(Math.random() * array.length)];
    return randomItem;
  }

  /**
   * Validation to ensure all properties are defined and we get no errros returned
   * @param  {object} inputs Validation to make sure every property is always defined
   */
  static validateInputs(inputs = {}) {
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
}

export default HelperUtilities;
// let rand = HelperUtilities.getRandomInt(1, 100); // returns 1 to 100
// console.log(rand);
