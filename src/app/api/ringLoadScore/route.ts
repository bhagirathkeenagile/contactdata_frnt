import { NextResponse } from "next/server";
import axios from "axios";

const baseUrl = "https://contactwindos.azurewebsites.net";

export async function GET(request: Request) {
  try {
    const response = await axios.get(`${baseUrl}/jobs/updateScore`);
    console.log("from /jobs/UpdateScore ===> ", response);
    const ContactData = response;
    return NextResponse.json({
      body: ContactData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return NextResponse.json(error);
  }
}
