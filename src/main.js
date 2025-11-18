'use strict';
var Alexa = require('alexa-sdk');
var questions = require('./questions.json');

var handlers = {
    QuizIntent: function () { // 初期状態
        this.attributes['advance'] = 1; // 進行状況を初期化
        this.attributes['score'] = 0; // 得点を初期化
        var random = Math.floor(Math.random() * questions.length);
        this.attributes['itemIndex'] = random; // 出題する問題のindexを乱数にて保存
        var message = `簡単なクイズをしましょう。1問目。${questions[random].q}`;
        var reprompt = `1問目。${questions[random].q}`;
        this.emit(':ask', message, reprompt); // 相手の応答を待つ
    },
    AnswerIntent: function () { // ユーザからの返答により起動される
        // スロットから回答を取得
        var usersAnswer = this.event.request.intent.slots.Answer.value;
        var currentQuestion = questions[this.attributes['itemIndex']];

        var resultMessage;
        if (currentQuestion.a === usersAnswer) { // 正解の場合
            resultMessage = `そうです。では`;
            this.attributes['score']++;
        } else { // 不正解の場合
            resultMessage = `ちがいます。正解は${currentQuestion.a}です。では`;
        }

        if (this.attributes['advance'] < 7) { // 続きの問題がある場合
            this.attributes['advance']++;
            var random = Math.floor(Math.random() * questions.length);
            this.attributes['itemIndex'] = random;
            var reprompt = `${this.attributes['advance']}問目。${questions[random].q}`;
            this.emit(':ask', resultMessage + reprompt, reprompt); // 会話を続ける
        } else { // 全ての問題が完了した
            var endMessage = `終わりです。あなたは${this.attributes['score']}点でした。`;
            this.emit(':tell', resultMessage + endMessage); // 会話を終える
        }
    },
    'AMAZON.RepeatIntent': function () {
        var speechOutput = `${this.attributes['advance']}問目。${questions[this.attributes['itemIndex']].q}`;
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = 'クイズが出題されたらそれに答えてください。それでは始めましょう。「スタート」と言ってください。';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('終わります。');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('終わります。');
        this.emit(':responseReady');
    },
    LaunchRequest: function () {
        this.emit('QuizIntent');
    },
    'AMAZON.StartOverIntent': function () {
        this.emit('QuizIntent');
    },
    Unhandled: function () {
        this.emit(':tell', 'すみません、わかりませんでした。終わります。');
    },
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};