import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    // Editors can only see and maintain their own account (name, password).
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Editors must not be able to promote themselves.
        update: isAdminFieldLevel,
      },
      saveToJWT: true,
    },
  ],
}
