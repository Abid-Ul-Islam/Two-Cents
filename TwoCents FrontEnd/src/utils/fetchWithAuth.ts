import { BASE_URL } from '../config'

async function tryRefresh(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.ok
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const opts: RequestInit = { ...options, credentials: 'include' }

  const res = await fetch(url, opts)

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return fetch(url, opts)
    }
    window.location.href = '/login'
    return res
  }

  return res
}
