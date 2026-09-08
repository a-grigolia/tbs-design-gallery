import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'

/**
 * Contact form submissions from /contact. Rows are written exclusively by the
 * submitContact server action through the local API (which bypasses access
 * control), so every REST/GraphQL surface — including create — stays
 * admin-only and can't be used for spam. Zoho CRM sync happens (later) in the
 * same server action, not here; this collection is the local system of record.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'iAmA', 'projectType', 'createdAt'],
    description: 'Messages sent through the contact form. Read-only capture — edit nothing here.',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      // Values mirror the Webflow-era Zoho picklist labels so the future CRM
      // mapping is 1:1.
      name: 'iAmA',
      label: 'I am a',
      type: 'select',
      required: true,
      options: [
        { label: 'Homeowner', value: 'homeowner' },
        { label: 'Architect', value: 'architect' },
        { label: 'Contractor', value: 'contractor' },
        { label: 'Interior Designer', value: 'interior-designer' },
        { label: 'Project Manager', value: 'project-manager' },
      ],
    },
    {
      name: 'projectType',
      type: 'select',
      required: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
}
