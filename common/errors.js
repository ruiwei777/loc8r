/**
 * https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
 * and `Cutom Error Types` on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 * 
 * This class is to be thrown internally so that the catcher can do corresponding actions.
 * No need to always throw it when not found. 
 * Only throw it when you want to pass this err to the outer catcher.
 * 
 * Example:
 * if(not found) throw new NotFoundError('Review', 'Review is not found');
 */
class NotFoundError extends Error{
  /**
   * @param {String} modelName - E.g. 'Review', 'Location'
   * @param {*} params - the second parameter will become `message` property of the err instance
   */
  constructor(modelName, ...params){
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.modelName = modelName;
  }
}

module.exports.NotFoundError = NotFoundError;