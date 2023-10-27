import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "https://iucontactdatab.keenagile.in";

export async function GET(request: Request) {
  try {
    const response = await axios.get(`${baseUrl}/map/list-mapData`);
    const mapListData = response.data;
    return NextResponse.json({
      body: mapListData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(error);
  }
}
