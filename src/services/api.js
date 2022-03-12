import axios from "axios";

export async function fetchService({
  url,
  method = "GET",
  params = null,
  token = "",
}) {
  try {
    const objectRequest = {
      url,
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
    return e;
  }
}
