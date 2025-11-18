const { assert } = require('chai');
const index = require('./main');
const context = require('aws-lambda-mock-context');

describe('LaunchRequestを起動して最初の問題を出題', () => {
  let speechResponse;

  before(async () => {
    const ctx = context();
    const event = require('./fixtures/launch.json');

    const getNextItemIndex = () => 3;
    const handler = index.createHandler(getNextItemIndex)
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise;
    } catch (err) {
      console.error('Error:', err);
    }
  });

  it('handlerのresponse', () => {
    assert.deepEqual(speechResponse, {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "ssml": "<speak> 簡単なクイズをしましょう。1問目。茨城県の都道府県コード番号は？ </speak>",
          "type": "SSML"
        },
        "reprompt": {
          "outputSpeech": {
            "ssml": "<speak> 1問目。茨城県の都道府県コード番号は？ </speak>",
            "type": "SSML"
          }
        },
        "shouldEndSession": false
      },
      "sessionAttributes": {
        "advance": 1,
        "itemIndex": 3,
        "score": 0
      },
      "userAgent": "ask-nodejs/1.0.25 Node/v22.19.0",
    })
  });
});
