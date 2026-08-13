import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        withoutEnlargement: true,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'card',
        width: 800,
        withoutEnlargement: true,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'hero',
        width: 1920,
        withoutEnlargement: true,
        formatOptions: { format: 'webp' },
      },
    ],
  },
}
