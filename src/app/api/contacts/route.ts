import { NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL || "http://contactdatab.keenagile.in";

export async function GET(request: Request) {
  const queryParams = new URLSearchParams(request.url.split("?")[1]);
  const pageIndex = queryParams.get("page");
  const pageSize = queryParams.get("pageSize");
  const fetchUrl = `${baseUrl}/map/get-contacts?page=${pageIndex}&pageSize=${pageSize}`;

  const response = await fetch(fetchUrl, {
    method: "GET",
  });
  const data = await response.json();
  return NextResponse.json({
    body: data,
  });
}
