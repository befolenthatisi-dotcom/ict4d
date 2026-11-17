export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`)
  }

  if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`)
  return result
}
