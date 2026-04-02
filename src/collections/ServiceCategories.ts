import type { CollectionConfig } from 'payload'
import { isAdminOrSuperAdmin } from '../access/isAdminOrSuperAdmin'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  labels: {
    singular: 'Κατηγορία Υπηρεσίας',
    plural: 'Κατηγορίες Υπηρεσιών',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Διαχείριση',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isAdminOrSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Όνομα Κατηγορίας',
      required: true,
    },
  ],
}
