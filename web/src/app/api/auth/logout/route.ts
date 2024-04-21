import { NextRequest } from 'next/server'

import { makeResponse } from '../../response'
import { ErrorCode } from '@/enums'

const apiEndpoint = process.env.API_ENDPOINT

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    const res = await fetch(`${apiEndpoint}/auth.logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    return makeResponse({ ok: false, error: { code: ErrorCode.INTERNAL_SERVER_ERROR } })
  }
}
