import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const token = ''

    return new Response('login success', {
      status: 200,
      headers: { 'Set-Cookie': `token=${token}; Path=/` },
    })
  } catch (err) {
    return new Response('login failed', { status: 401 })
  }
}
