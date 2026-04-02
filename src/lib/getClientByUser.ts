import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getClientByUser(userId: string | number) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'clients',
    where: { linkedUser: { equals: userId } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  return docs[0] ?? null
}
