import { NextRequest } from 'next/server'
import { makeResponse } from '../response'

const apiEndpoint = process.env.API_ENDPOINT

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    const url = new URL(req.nextUrl.pathname.replace('/api', ''), apiEndpoint)
    const body = req.json() || {}

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return makeResponse(data)
  } catch (err) {
    return makeResponse({ ok: false, error: { code: 'INTERNAL_SERVER_ERROR' } })
  }
}
