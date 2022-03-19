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
      data: params,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (token) objectRequest.headers["Authorization"] = `Bearer ${token}`;

    const response = await axios(objectRequest);
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
}
