import axios from "axios";

const BASE_URL = "http://localhost:5000";

export async function fetchService({
  url,
  method = "GET",
  params = null,
  token = "",
}) {
  try {
    const objectRequest = {
      url: BASE_URL + url,
      method,
      body: params,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (token) objectRequest.headers["Authorization"] = `Bearer ${token}`;

    //const response = await axios(objectRequest);
    const response = await fetch(
      objectRequest.url,
      objectRequest
    )
    console.log(response)
    return response;
  } catch (e) {
    return e;
  }
}
