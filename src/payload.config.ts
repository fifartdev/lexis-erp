import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Clients } from './collections/Clients'
import { Services } from './collections/Services'
import { ServiceCategories } from './collections/ServiceCategories'
import { checkServiceExpirationsTask } from './jobs/tasks/checkServiceExpirations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Lexis Agency ERP',
    },
  },
  collections: [Users, Media, Clients, Services, ServiceCategories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
      },
    }),
  ],
  jobs: {
    tasks: [checkServiceExpirationsTask],
    autoRun: [
      {
        cron: '0 8 * * *',
        queue: 'default',
        limit: 1,
      },
    ],
    access: {
      run: ({ req }) => (req.user as any)?.role === 'superadmin',
    },
  },
})
