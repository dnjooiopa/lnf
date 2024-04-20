import { NextRequest } from 'next/server'

const apiEndpoint = process.env.API_ENDPOINT

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()

    if (!pin) {
      return new Response('pin is required', { status: 200 })
    }

    const res = await fetch(`${apiEndpoint}/auth.login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    const data = await res.json()

    if (!data?.ok) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const {
      result: { token },
    } = data

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/`,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    return new Response('login failed', { status: 401 })
  }
}
