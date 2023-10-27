import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "https://iucontactdatab.keenagile.in";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const response = await axios.post(`${baseUrl}/map/get-single-map`, {
      mapId: id,
    });
    const mapListData = response.data;
    return NextResponse.json({
      body: mapListData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(error);
  }
}
