import { getGithubUser } from "@/lib/github-server";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ username: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { username } = await params;

  try {
    const data = await getGithubUser(username);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch developer profile right now." },
      { status: 502 },
    );
  }
}
