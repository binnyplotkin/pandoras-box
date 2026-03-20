import { NextRequest, NextResponse } from "next/server";
import { startSession } from "@/lib/service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { worldId?: string; roleId?: string };

    if (!body.worldId || !body.roleId) {
      return NextResponse.json({ error: "worldId and roleId are required." }, { status: 400 });
    }

    const session = await startSession(body.worldId, body.roleId);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create session." },
      { status: 500 },
    );
  }
}
