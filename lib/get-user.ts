// lib/get-user.ts (ملف helper جديد)
import { NextRequest } from "next/server";

export async function getUser(request: NextRequest) {
  try {
    // الطريقة من cookies (أكثر شيوعاً)
    const response = await fetch("/api/auth/me");

    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Get user failed:", error);
    return null;
  }
}
