// Cloudflare Workers用 MCP（SSE）サーバーサンプル
// /sse: クライアントがSSEで接続
// /send: 管理者やLLMがPOSTでコマンド投入

let globalClients = [];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // SSEエンドポイント
    if (request.method === "GET" && url.pathname === "/sse") {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      globalClients.push(writer);
      const headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      };
      request.signal.addEventListener("abort", () => {
        globalClients = globalClients.filter(w => w !== writer);
        writer.close();
      });
      writer.write(':ok\n\n');
      return new Response(readable, { headers });
    }

    // コマンド送信API
    if (request.method === "POST" && url.pathname === "/send") {
      const cmd = await request.text();
      for (const w of globalClients) {
        w.write(`data: ${cmd}\n\n`);
      }
      return new Response("ok", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  }
}
