//NOTE: Made our own static class as we will be calling this multiple times
export class HelperUtilities {
  /**
   * Returns a random number between min and max, inclusive
   * @param {number} min - Minimum number
   * @param {number} max - Maximum number
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomItemFromArray(array) {
    let randomItem = array[Math.floor(Math.random() * array.length)];
    return randomItem;
  }
}

// let rand = HelperUtilities.getRandomInt(1, 100); // returns 1 to 100
// console.log(rand);
