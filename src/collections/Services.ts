import type { CollectionConfig } from 'payload'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Υπηρεσία',
    plural: 'Υπηρεσίες',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Διαχείριση',
    defaultColumns: ['title', 'client', 'serviceCategory', 'startDate', 'expirationDate'],
  },
  access: {
    read: async ({ req: { user, payload } }) => {
      if (!user) return false
      const role = (user as any).role
      if (role === 'superadmin' || role === 'admin') return true
      // Client: find their client record and filter by it
      if (role === 'client') {
        const { docs } = await payload.find({
          collection: 'clients',
          where: { linkedUser: { equals: user.id } },
          limit: 1,
          overrideAccess: true,
        })
        if (!docs[0]) return false
        return { client: { equals: docs[0].id } }
      }
      return false
    },
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isAdminOrSuperAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Τίτλος Υπηρεσίας',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Περιγραφή',
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Ημερομηνία Έναρξης',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'expirationDate',
      type: 'date',
      label: 'Ημερομηνία Λήξης',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
        description: 'Προαιρετικό. Αφήστε κενό αν η υπηρεσία δεν λήγει.',
      },
    },
    {
      name: 'serviceCategory',
      type: 'relationship',
      label: 'Κατηγορία Υπηρεσίας',
      relationTo: 'service-categories',
      hasMany: false,
    },
    {
      name: 'client',
      type: 'relationship',
      label: 'Πελάτης',
      relationTo: 'clients',
      hasMany: false,
      required: true,
    },
    {
      name: 'notifiedDays',
      type: 'select',
      label: 'Αποστολή Ειδοποιήσεων',
      hasMany: true,
      options: [
        { label: '30 ημέρες πριν', value: '30' },
        { label: '14 ημέρες πριν', value: '14' },
        { label: '3 ημέρες πριν', value: '3' },
        { label: '1 ημέρα πριν', value: '1' },
      ],
      admin: {
        description: 'Ημέρες για τις οποίες έχει ήδη αποσταλεί ειδοποίηση λήξης.',
        position: 'sidebar',
      },
    },
  ],
}
