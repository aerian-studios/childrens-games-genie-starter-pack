/**
 * @copyright BBC 2018
 * @author BBC Children's D+E, MobilePie (S.Endean) //sam@mobilepie.com
 * @license Apache-2.0
 */

export class Model {
  constructor(game) {
    this.game = game;
    this.onUpdateCalls = [];
  }

  init() {}

  /**
   * @param {callBack} callback - The callback for the subscription.
   * @param {callBackContext} context - The context for the callback.
   * @param {string} key - The name of the variable to watch.
   */
  subscribe(callback, context, key) {
    this.onUpdateCalls.push([key, [callback, context]]);
  }

  /**
   * Always call updated after altering a model
   */
  updated(keys, value) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (let j = 0; j < this.onUpdateCalls.length; j++) {
        const storedKey = this.onUpdateCalls[j][0];
        if (storedKey !== key) {
          continue;
        }
        const callback = this.onUpdateCalls[j][1][0];
        const context = this.onUpdateCalls[j][1][1];

        callback.call(context ? context : this, value);
      }
    }
  }
}
