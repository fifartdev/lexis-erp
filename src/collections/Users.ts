import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Όνομα',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Ρόλος',
      required: true,
      defaultValue: 'client',
      saveToJWT: true,
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Πελάτης', value: 'client' },
      ],
      access: {
        update: ({ req: { user } }) => (user as any)?.role === 'superadmin',
      },
    },
  ],
}
