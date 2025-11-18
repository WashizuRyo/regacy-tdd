const { assert } = require('chai');
const index = require('./main');
const context = require('aws-lambda-mock-context');

describe('LaunchRequestを起動して最初の問題を出題', () => {
  let speechResponse;

  before(async () => {
    const ctx = context();
    const event = require('./fixtures/launch.json');

    index.handler(event, ctx);

    try {
      speechResponse = await ctx.Promise;
    } catch (err) {
      console.error('Error:', err);
    }
  });

  it('handlerのresponse', () => {
    assert(speechResponse !== undefined)
  });
});
