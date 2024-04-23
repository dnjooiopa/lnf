import { NextRequest } from 'next/server'

import { makeResponse } from '../response'
import { ErrorCode } from '@/enums'

const apiEndpoint = process.env.API_ENDPOINT

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return makeResponse({ ok: false, error: { code: ErrorCode.UNAUTHORIZED } })
    }

    const url = new URL(req.nextUrl.pathname.replace('/api', ''), apiEndpoint)
    const body = (await req.json()) || {}

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    const errCode = data?.error?.code as ErrorCode
    if (errCode == ErrorCode.UNAUTHORIZED || errCode == ErrorCode.INVALID_TOKEN) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          'Content-Type': 'application/json',
        },
      })
    }

    return makeResponse(data)
  } catch (err) {
    return makeResponse({ ok: false, error: { code: ErrorCode.INTERNAL_SERVER_ERROR } })
  }
}
