# ゴリラの神から加護された令嬢は王立騎士団で可愛がられる - タイトルジェネレーター

[デモページはこちら](https://firemio.github.io/gorilla-no-kami-kara-kago-sareta-reijou-ha-ouritsukishidan-de-kawaigarareru/)

## MCP化・SSEによる外部制御について

本プロジェクトは「MCP（Model Control Point）」化されており、Cloudflare Workersを利用したSSE（Server-Sent Events）経由で外部からWeb UIをリアルタイム制御できます。

---

### 構成概要

- `index.html` … SSEクライアント機能付き。外部コマンドでDOM操作が可能。
- `cloudflare-mcp-worker.js` … Cloudflare Workers用MCPサーバー。SSE配信＆コマンド受信APIを提供。

---

### 使い方

#### 1. MCPサーバー（Cloudflare Workers）のデプロイ

1. [cloudflare-mcp-worker.js](cloudflare-mcp-worker.js) をCloudflare Workersにデプロイ
2. WorkerのURLを控える（例: `https://your-mcp-worker.<サブドメイン>.workers.dev`）

#### 2. index.htmlの設定

- `sseUrl` をCloudflare WorkerのSSEエンドポイントに変更
  ```js
  const sseUrl = "https://your-mcp-worker.<サブドメイン>.workers.dev/sse";
  ```

#### 3. コマンド送信方法

- 管理者やLLMなどが以下のようにコマンド（JSON形式）をPOST送信

  例：curl
  ```sh
  curl -X POST "https://your-mcp-worker.<サブドメイン>.workers.dev/send" \
    -H "Content-Type: application/json" \
    -d '{"action":"set","target":"animal","value":"カバ"}'
  ```

- 送信例コマンドは `index.html` のMCPハンドラで拡張可能です

---

### 参考：MCPコマンド例（アプリ固有操作対応）

- テキスト変更: `{ "action": "set", "target": "animal", "value": "カバ" }`
- スタイル変更: `{ "action": "style", "target": "result", "css": { "color": "red" } }`
- ランダムタイトル生成: `{ "action": "generate" }`
- 履歴クリア: `{ "action": "clearHistory" }`

> `generate` で新しいランダムタイトルが生成され、`clearHistory` で履歴が全消去されます。
> これらのコマンドは外部からアプリ本来の機能を直接操作できます。

---

### 注意点
- Cloudflare Workersの無料枠には同時接続・リクエスト数の制限があります
- 認証が必要な場合は `/send` エンドポイントに認証処理を追加してください
- 本サンプルはメモリ上でクライアント管理しています。大規模用途はDurable Objects等の利用を検討してください

## 概要
異世界ファンタジー風のランダムタイトルを生成するシンプルなWebアプリです。
