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

describe("問題に成功した場合", () => {
  let speechResponse;

  before(async() => {
    const ctx = context();
    const event = require('./fixtures/answer.json');

    const getNextItemIndex = () => 4;
    const handler = index.createHandler(getNextItemIndex)
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise
    } catch (error) {
      console.log("Error", error)
    }
  })

  it("handlerのresponse", () => {
    assert.deepEqual(speechResponse, {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "ssml": "<speak> そうです。では2問目。栃木県の県庁所在地は？ </speak>",
          "type": "SSML"
        },
        "reprompt": {
          "outputSpeech": {
            "ssml": "<speak> 2問目。栃木県の県庁所在地は？ </speak>",
            "type": "SSML"
          }
        },
        "shouldEndSession": false
      },
      "sessionAttributes": {
        "advance": 2,
        "itemIndex": 4,
        "score": 1
      },
      "userAgent": "ask-nodejs/1.0.25 Node/v22.19.0",
    })
  })
})

describe("問題に不正解の場合", () => {
  let speechResponse;

  before(async() => {
    const ctx = context();
    const event = require('./fixtures/bad_answer.json');

    const getNextItemIndex = () => 4;
    const handler = index.createHandler(getNextItemIndex)
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise
    } catch (error) {
      console.log("Error", error)
    }
  })

  it("handlerのresponse", () => {
    assert.deepEqual(speechResponse, {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "ssml": "<speak> ちがいます。正解は8です。では2問目。栃木県の県庁所在地は？ </speak>",
          "type": "SSML"
        },
        "reprompt": {
          "outputSpeech": {
            "ssml": "<speak> 2問目。栃木県の県庁所在地は？ </speak>",
            "type": "SSML"
          }
        },
        "shouldEndSession": false
      },
      "sessionAttributes": {
        "advance": 2,
        "itemIndex": 4,
        "score": 0
      },
      "userAgent": "ask-nodejs/1.0.25 Node/v22.19.0",
    })
  })
})