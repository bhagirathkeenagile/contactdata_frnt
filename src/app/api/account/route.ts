import { NextResponse } from "next/server";

const baseUrl =
  process.env.BASE_URL || "https://contactwindos.azurewebsites.net";

export async function GET(request: Request) {
  const response = await fetch(`${baseUrl}/map/get-account`, {
    method: "POST",
  });
  const data = await response.json();
  return NextResponse.json({
    body: data,
  });
}
