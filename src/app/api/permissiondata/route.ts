import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = process.env.BASE_URL || "http://iucontactdatab.keenagile.in";

export async function GET(request: Request) {
  // const response = await axios.get(`${baseUrl}/permisions/listPermissions`);
  // const data = response.data;
  // return NextResponse.json({
  //     body: data,
  // });
  return true;
}
