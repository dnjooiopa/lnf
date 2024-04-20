import { NextRequest, NextResponse } from 'next/server'

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
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    return new NextResponse(JSON.stringify({ ok: false, error: { code: 'INTERNAL_SERVER_ERROR' } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
