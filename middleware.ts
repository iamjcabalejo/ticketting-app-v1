import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * App does not use auth; do not redirect any route to /login.
 * All requests pass through to the app.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
