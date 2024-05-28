import type { NextRequest } from "next/server";
import { downsampleReadings } from "./downsampleReadings";
import prisma from "@/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await downsampleReadings(prisma);

  return Response.json({ success: true });
}
