import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, isLoggedInOrPublished } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { VENDOR_CATEGORIES } from '../lib/categories'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'primaryCategory', 'categories', 'active', '_status'],
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
      // Controls which category index pages list this vendor. The canonical
      // URL is driven by `primaryCategory` below, not by this field.
      name: 'categories',
      type: 'select',
      hasMany: true,
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      options: [...VENDOR_CATEGORIES],
    },
    {
      // Where the vendor's one canonical page lives: /{primaryCategory}/{slug}.
      // Changing it after launch breaks the live URL — pick once.
      name: 'primaryCategory',
      type: 'select',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      options: [...VENDOR_CATEGORIES],
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
        description:
          'Optional Supabase Storage video URL (public videos bucket), used instead of the hero image.',
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
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Headline shown at the top of the vendor page.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'productSpecifications',
      type: 'richText',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Where the vendor is based, e.g. "Milan, Italy".',
      },
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
