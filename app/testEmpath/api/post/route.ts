import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ text: "Hello, world!" });
}

export async function POST(request: NextRequest, response: NextResponse) {
  console.log(request);
  const formData = await request.formData();

  if (request.method === "POST") {
    try {
      console.log(process.env.NEXT_PUBLIC_EMPATH_API_KEY);
      const response = await fetch(process.env.NEXT_PUBLIC_EMPATH_URL || "", {
        method: "POST",
        headers: {
          // ここに必要なヘッダーを設定
          ApiKey: process.env.NEXT_PUBLIC_EMPATH_API_KEY || "", // 適切なAPIキーに置き換えてください
        },
        body: formData, // クライアントから受け取ったリクエストボディをそのまま使用
      });

      if (!response.ok) {
        console.error(await response.text());
        throw new Error(`Error from external API: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("data", data);
      return NextResponse.json(JSON.stringify(data));
      //   response.status(200).json(data); // 外部APIからのレスポンスをクライアントに返す
    } catch (error: any) {
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
