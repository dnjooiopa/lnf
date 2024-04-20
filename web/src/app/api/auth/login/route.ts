import { NextRequest } from 'next/server'
import { makeResponse } from '../../response'

const apiEndpoint = process.env.API_ENDPOINT

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()

    const res = await fetch(`${apiEndpoint}/auth.login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    const data = await res.json()

    if (!data?.ok) {
      return makeResponse(data)
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
    return makeResponse({ ok: false, error: { code: 'INTERNAL_SERVER_ERROR' } })
  }
}
