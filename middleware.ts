import { withAuth } from 'next-auth/middleware';

// This function bypasses auth checks and makes all routes accessible
export default function middleware() {
  return;
}

export const config = { matcher: [] };
