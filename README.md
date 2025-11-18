# レガシーコード改善 実践リポジトリ

このリポジトリは、t-wada（和田卓人）さんの「実践レガシーコード改善」講演を追体験するためのものです。

## 参考資料

- [スライド: Working Effectively with Legacy Code - The True Record](https://speakerdeck.com/twada/working-with-legacy-code-the-true-record)
- [動画: 実践レガシーコード改善](https://www.youtube.com/watch?v=WQRU_BJaVoU)

## プロジェクト概要

AWS Lambda上で動作するAlexa Skillのクイズアプリケーションに対して、テストを追加しながらレガシーコード改善を実践します。

## 開始方法

最初のテストが通った状態から始める場合:

```bash
git checkout f8bf61ceb587690a59779eb454d65f736a8725f6
```

このコミットから、段階的にレガシーコードを改善していくことができます。

## セットアップ

```bash
npm install
```

## テスト実行

```bash
npm test
```

## 使用技術

- **テストフレームワーク**: Mocha
- **アサーションライブラリ**: Chai
- **モックライブラリ**: aws-lambda-mock-context
- **対象コード**: Alexa Skills Kit SDK v1 (レガシー)

## ディレクトリ構成

```
.
├── src/
│   ├── main.js              # Alexa Skillのメインコード（改善対象）
│   ├── questions.json       # クイズの問題データ
│   ├── fixtures/
│   │   └── launch.json      # テスト用のLaunchRequestイベント
│   └── main.test.js         # テストコード
└── package.json
```

## レガシーコード改善の進め方

1. **現状の把握**: テストがないコードの理解
2. **テストの追加**: 既存の挙動を壊さないようテストで保護
3. **リファクタリング**: テストで保護された状態で安全に改善
4. **継続的な改善**: 段階的に品質を向上

## 目標

- テストカバレッジを上げる
- コードの可読性を向上させる
- テスタビリティを改善する
- モダンなコードスタイルに移行する
