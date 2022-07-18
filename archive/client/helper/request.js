const API = "https://dysis-server.herokuapp.com/api/"

export default async function request(method, path, body = null) {
  let response = await fetch(
    API + path, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: body
    }
  )
  let data = response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(response.status)
  }
}