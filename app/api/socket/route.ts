import { NextRequest } from "next/server";
import { initializeSocket } from "@/lib/socket/socket";

export async function GET(req: NextRequest) {
  const socket = initializeSocket((req as any).socket.server);
  return new Response("Socket initialized");
}
