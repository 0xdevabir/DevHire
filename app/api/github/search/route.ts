import { searchGithubUsers } from "@/lib/github-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const perPage = Number(request.nextUrl.searchParams.get("perPage") ?? "10");

  if (!query) {
    return NextResponse.json({ message: "Missing q parameter" }, { status: 400 });
  }

  try {
    const data = await searchGithubUsers(query, Math.max(1, page), Math.min(20, Math.max(1, perPage)));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to search GitHub users right now." },
      { status: 502 },
    );
  }
}
