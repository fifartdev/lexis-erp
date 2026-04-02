import type { TaskConfig } from 'payload'
import { Resend } from 'resend'
import { buildServiceExpirationEmail } from '../../email/templates/serviceExpirationEmail'

const NOTIFY_DAYS = [30, 14, 3, 1]

export const checkServiceExpirationsTask: TaskConfig<'checkServiceExpirations'> = {
  slug: 'checkServiceExpirations',
  inputSchema: [],
  outputSchema: [],
  handler: async ({ req }) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const in30Days = new Date(today)
    in30Days.setDate(today.getDate() + 30)
    in30Days.setHours(23, 59, 59, 999)

    const { docs: services } = await req.payload.find({
      collection: 'services',
      where: {
        and: [
          { expirationDate: { exists: true } },
          { expirationDate: { greater_than_equal: today.toISOString() } },
          { expirationDate: { less_than_equal: in30Days.toISOString() } },
        ],
      },
      depth: 2,
      limit: 500,
      overrideAccess: true,
    })

    let sent = 0

    for (const service of services) {
      if (!service.expirationDate) continue

      const expDate = new Date(service.expirationDate)
      expDate.setHours(0, 0, 0, 0)
      const daysLeft = Math.round((expDate.getTime() - today.getTime()) / 86_400_000)

      if (!NOTIFY_DAYS.includes(daysLeft)) continue

      const notifiedDayKey = String(daysLeft) as '1' | '3' | '14' | '30'
      const alreadyNotified = Array.isArray(service.notifiedDays)
        ? service.notifiedDays.includes(notifiedDayKey)
        : false

      if (alreadyNotified) continue

      const client =
        service.client && typeof service.client === 'object' ? (service.client as any) : null

      if (!client?.email) continue

      const clientName = client.fullName || client.email
      const serviceName = service.title

      try {
        await resend.emails.send({
          from: fromEmail,
          to: client.email,
          subject: `Η υπηρεσία "${serviceName}" λήγει σε ${daysLeft} ${daysLeft === 1 ? 'ημέρα' : 'ημέρες'}`,
          html: buildServiceExpirationEmail({
            serviceName,
            clientName,
            daysLeft,
            expirationDate: service.expirationDate as string,
          }),
        })

        // Mark this day as notified
        const updatedNotifiedDays = [
          ...(Array.isArray(service.notifiedDays) ? service.notifiedDays : []),
          String(daysLeft),
        ]

        await req.payload.update({
          collection: 'services',
          id: service.id,
          data: { notifiedDays: updatedNotifiedDays as any },
          overrideAccess: true,
        })

        sent++
      } catch (err) {
        req.payload.logger.error(`Failed to send expiration email for service ${service.id}: ${err}`)
      }
    }

    req.payload.logger.info(`checkServiceExpirations: sent ${sent} notification(s)`)

    return { output: {} }
  },
}
