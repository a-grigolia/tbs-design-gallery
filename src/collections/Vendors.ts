import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, isLoggedInOrPublished } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'categories', 'active', '_status'],
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
    afterChange: [revalidateAfterChange('/vendors')],
    afterDelete: [revalidateAfterDelete('/vendors')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      // The `value` strings are permanent database identifiers. After launch,
      // change only the `label` — never the `value`.
      options: [
        { label: 'Kitchen & Bath', value: 'kitchen-bath' },
        { label: 'Windows & Doors', value: 'windows-doors' },
        { label: 'Outdoor Living', value: 'outdoor-living' },
        { label: 'Tile & Stone', value: 'tile-stone' },
        { label: 'Cabinetry', value: 'cabinetry' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Inactive vendors stay resolvable at their URL but are excluded from index listings.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
      admin: {
        description: 'Optional Cloudflare R2 video URL, used instead of the hero image.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Used on vendor cards. Max 200 characters.',
      },
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
          'Raw HTML imported from Webflow. Do not edit by hand — new content belongs in the rich text field above.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description: "The vendor's own website.",
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
