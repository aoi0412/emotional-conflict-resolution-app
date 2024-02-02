import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();

  return new Response(request.method, { status: 200 });
  if (request.method === "POST") {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_EMPATH_URL || "", {
        method: "POST",
        headers: {
          // ここに必要なヘッダーを設定
          ApiKey: process.env.NEXT_PUBLIC_EMPATH_API_KEY || "", // 適切なAPIキーに置き換えてください
        },
        body: JSON.stringify(request.body), // クライアントから受け取ったリクエストボディをそのまま使用
      });

      if (!response.ok) {
        throw new Error(`Error from external API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("data", data);
      return new Response(JSON.stringify(data));
      //   response.status(200).json(data); // 外部APIからのレスポンスをクライアントに返す
    } catch (error) {
      console.error("Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    // POSTメソッド以外のリクエストを拒否
    return new Response(`Method Not Allowed ${request.method} aiueo`, {
      status: 405,
    });
  }
}
