import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, isLoggedInOrPublished } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { VENDOR_CATEGORIES } from '../lib/categories'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  access: {
    read: isLoggedInOrPublished,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateAfterChange('/blog')],
    afterDelete: [revalidateAfterDelete('/blog')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      // No default on purpose: the editor picks one every time.
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Project', value: 'project' },
        { label: 'Guide', value: 'guide' },
        { label: 'News', value: 'news' },
      ],
    },
    {
      // Values are shared with the Vendors collection character for character —
      // posts join to vendors by category, so the two must never drift.
      name: 'categories',
      type: 'select',
      hasMany: true,
      index: true,
      options: [...VENDOR_CATEGORIES],
      admin: {
        description:
          'Optional — order matters: the journal index shows the first category in the list.',
      },
    },
    {
      // Captured during hand-migration so it never needs backfilling; nothing
      // renders it yet.
      name: 'vendors',
      type: 'relationship',
      relationTo: 'vendors',
      hasMany: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      // All optional — postMetadata() in src/lib/seo.ts resolves the fallbacks
      // (title/excerpt/coverImage), mirroring the Webflow template behavior.
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'ogTitle',
          type: 'text',
        },
        {
          name: 'ogDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
