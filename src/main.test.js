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

describe("1回目の不正解の場合", () => {
  let speechResponse;

  before(async() => {
    const ctx = context();
    const event = require('./fixtures/bad_answer.json');

    const getNextItemIndex = () => 4;
    const handler = index.createHandler(getNextItemIndex)
    Object.assign(event.session.attributes, {
      advance: 1,
      score: 0,
      accumIncorrects: 0,
      itemIndex: 3
    })
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise
    } catch (error) {
      console.log("Error", error)
    }
  })

  it("連続不正解数が増えていること", () => {
    assert(speechResponse.sessionAttributes.accumIncorrects === 1)
  })

  it("返答の音声内容が1回目の不正解に伴う内容であること", () => {
    assert(speechResponse.response.outputSpeech.ssml === '<speak> 7？　もう一度言ってください。茨城県の都道府県コード番号は？ </speak>')
  })

  it("進行状況が進んでいないこと", () => {
    assert(speechResponse.sessionAttributes.advance === 1)
  })

  it("得点が変わらないこと", () => {
    assert(speechResponse.sessionAttributes.score === 0)
  })

  it("問題番号が変わらないこと", () => {
    assert(speechResponse.sessionAttributes.itemIndex === 3)
  })

  it("handlerのresponse", () => {
    assert.deepEqual(speechResponse, {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "ssml": "<speak> 7？　もう一度言ってください。茨城県の都道府県コード番号は？ </speak>",
          "type": "SSML"
        },
        "reprompt": {
          "outputSpeech": {
            "ssml": "<speak> 1番。 茨城県の都道府県コード番号は？ </speak>",
            "type": "SSML"
          }
        },
        "shouldEndSession": false
      },
      "sessionAttributes": {
        "advance": 1,
        "itemIndex": 3,
        "accumIncorrects": 1,
        "score": 0
      },
      "userAgent": "ask-nodejs/1.0.25 Node/v22.19.0",
    })
  })
})

describe("2回目の不正解の場合", () => {
  let speechResponse;

  before(async() => {
    const ctx = context();
    const event = require('./fixtures/bad_answer.json');

    const getNextItemIndex = () => 4;
    const handler = index.createHandler(getNextItemIndex)
    Object.assign(event.session.attributes, {
      advance: 1,
      score: 0,
      accumIncorrects: 1,
      itemIndex: 3
    })
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise
    } catch (error) {
      console.log("Error", error)
    }
  })

  it("連続不正解数が増えていること", () => {
    assert(speechResponse.sessionAttributes.accumIncorrects === 2)
  })

  it("返答の音声内容が2回目の不正解に伴う内容であること", () => {
    assert(speechResponse.response.outputSpeech.ssml === '<speak> 私には｢7｣と聞こえましたが，それは正しくありません。　もう一度言ってください。茨城県の都道府県コード番号は？ </speak>')
  })

  it("進行状況が進んでいないこと", () => {
    assert(speechResponse.sessionAttributes.advance === 1)
  })

  it("得点が変わらないこと", () => {
    assert(speechResponse.sessionAttributes.score === 0)
  })

  it("問題番号が変わらないこと", () => {
    assert(speechResponse.sessionAttributes.itemIndex === 3)
  })
})

describe("3回目の不正解の場合", () => {
  let speechResponse;

  before(async() => {
    const ctx = context();
    const event = require('./fixtures/bad_answer.json');

    const getNextItemIndex = () => 4;
    const handler = index.createHandler(getNextItemIndex)
    Object.assign(event.session.attributes, {
      advance: 2,
      score: 0,
      accumIncorrects: 2,
      itemIndex: 3
    })
    handler(event, ctx)

    try {
      speechResponse = await ctx.Promise
    } catch (error) {
      console.log("Error", error)
    }
  })

  it("連続不正解数が0の戻っていること", () => {
    assert(speechResponse.sessionAttributes.accumIncorrects === 0)
  })

  it("返答の音声内容が3回目の不正解に伴う内容であること", () => {
    assert(speechResponse.response.outputSpeech.ssml === '<speak> ちがいます。正解は8です。では3問目。栃木県の県庁所在地は？ </speak>')
  })

  it("進行状況が進んでいること", () => {
    assert(speechResponse.sessionAttributes.advance === 3)
  })

  it("得点が変わらないこと", () => {
    assert(speechResponse.sessionAttributes.score === 0)
  })

  it("問題番号が変わること", () => {
    assert(speechResponse.sessionAttributes.itemIndex === 4)
  })
})
