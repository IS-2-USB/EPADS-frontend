import axios from "axios";

const BASE_URL = "http://localhost:4200";

export async function fetchService({
  url,
  method = "GET",
  params = null,
  token = "",
}) {
  try {
    let objectRequest = {
      url: BASE_URL + url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET") {
      objectRequest = { ...objectRequest, body: JSON.stringify(params) };
    }

    if (token) objectRequest.headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(objectRequest.url, objectRequest).then(
      (resp) => resp.json()
    );

    return response;
  } catch (e) {
    console.log(e);
  }
}
