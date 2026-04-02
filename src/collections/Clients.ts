import type { CollectionConfig } from 'payload'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Πελάτης',
    plural: 'Πελάτες',
  },
  admin: {
    useAsTitle: 'fullName',
    group: 'Διαχείριση',
    defaultColumns: ['fullName', 'email', 'mobilePhone'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any).role
      if (role === 'superadmin' || role === 'admin') return true
      if (role === 'client') {
        return { linkedUser: { equals: user.id } }
      }
      return false
    },
    create: isAdminOrSuperAdmin,
    update: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any).role
      return role === 'superadmin' || role === 'admin' || role === 'client'
    },
    delete: isAdminOrSuperAdmin,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Ονοματεπώνυμο',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'landlinePhone',
      type: 'text',
      label: 'Σταθερό Τηλέφωνο',
    },
    {
      name: 'mobilePhone',
      type: 'text',
      label: 'Κινητό Τηλέφωνο',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Σημειώσεις',
      access: {
        update: ({ req: { user } }) => {
          const role = (user as any)?.role
          return role === 'superadmin' || role === 'admin'
        },
      },
    },
    {
      name: 'linkedUser',
      type: 'relationship',
      label: 'Λογαριασμός Χρήστη',
      relationTo: 'users',
      hasMany: false,
      admin: {
        description: 'Ο λογαριασμός σύνδεσης του πελάτη.',
      },
      access: {
        update: ({ req: { user } }) => {
          const role = (user as any)?.role
          return role === 'superadmin' || role === 'admin'
        },
      },
    },
    {
      name: 'services',
      type: 'join',
      label: 'Υπηρεσίες',
      collection: 'services',
      on: 'client',
    },
  ],
}
