import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ text: "Hello, world!" });
}
export async function POST(request: NextRequest, response: NextResponse) {
  // return new NextResponse(JSON.stringify({ file: request }), {
  //   status: 200,
  //   headers: { "Content-Type": "application/json" },
  // });

  const body = await request.json();

  if (request.method === "POST") {
    try {
      const formData = new FormData();
      formData.append("file", body.file);
      const response = await fetch(process.env.EMPATH_URL || "", {
        method: "POST",
        headers: {
          // ここに必要なヘッダーを設定
          ApiKey: process.env.EMPATH_API_KEY || "", // 適切なAPIキーに置き換えてください
        },
        body: formData, // クライアントから受け取ったリクエストボディをそのまま使用
      });

      if (!response.ok) {
        throw new Error(`Error from external API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("data", data);
      return NextResponse.json(JSON.stringify(data));
      //   response.status(200).json(data); // 外部APIからのレスポンスをクライアントに返す
    } catch (error) {
      console.error("Error:", error);
      return new NextResponse(`Internal Server Error${error}`, { status: 500 });
    }
  } else {
    // POSTメソッド以外のリクエストを拒否
    return new NextResponse(`Method Not Allowed ${request.method} aiueo`, {
      status: 405,
    });
  }
}
