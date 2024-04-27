import { NextRequest } from 'next/server'
import { EventSourcePolyfill } from 'event-source-polyfill'

export const dynamic = 'force-dynamic'

const apiEndpoint = process.env.API_ENDPOINT

export async function GET(req: NextRequest) {
  try {
    let responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()

    const token = req.cookies.get('token')?.value

    const resp = new EventSourcePolyfill(`${apiEndpoint}/event.subscribe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    resp.onmessage = async (e) => {
      await writer.write(encoder.encode(`event: message\ndata: ${e.data}\n\n`))
    }

    resp.onerror = async () => {
      resp.close()
      await writer.close()
    }

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
  } catch (e) {
    console.log('sse:', e)
    // TODO: handle error
  }
}
