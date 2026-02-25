import { getGithubUserRepos } from "@/lib/github-server";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ username: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const { username } = await params;
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const perPage = Number(request.nextUrl.searchParams.get("perPage") ?? "10");

  try {
    const data = await getGithubUserRepos(username, Math.max(1, page), Math.min(20, Math.max(1, perPage)));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch repositories right now." },
      { status: 502 },
    );
  }
}
