import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, isLoggedInOrPublished } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

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
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'contentHtml',
      type: 'textarea',
      admin: {
        description:
          'Raw HTML imported from Webflow. Do not edit by hand — new posts belong in the rich text field above.',
      },
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
    {
      name: 'author',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Freeform author name (imported Webflow authors are plain strings).',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
  ],
}
