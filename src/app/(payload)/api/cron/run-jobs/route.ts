import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const secret = req.headers.get('x-cron-secret')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    await payload.jobs.run()
    return Response.json({ ok: true, message: 'Jobs executed successfully' })
  } catch (err) {
    return Response.json({ error: 'Job execution failed', detail: String(err) }, { status: 500 })
  }
}
