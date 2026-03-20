import { NextResponse } from "next/server";
import { getPersistenceStore } from "@odyssey/db";
import { createIntroResult, getVisibleWorldById } from "@/lib/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const session = await getPersistenceStore().getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Unknown session." }, { status: 404 });
  }

  const world = await getVisibleWorldById(session.worldId);
  if (!world) {
    return NextResponse.json({ error: "Unknown world." }, { status: 404 });
  }

  const intro = createIntroResult(session, world);
  return NextResponse.json(intro);
}
