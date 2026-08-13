import type { Field, FieldHook } from 'payload'

export const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Fills the slug from `sourceField` only when the slug is empty (on create, or
 * when an editor deliberately clears it). An existing slug is never
 * regenerated on update — retitling a document must not break its live URL.
 */
const generateSlug =
  (sourceField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return formatSlug(value)
    }

    // Field omitted from an update payload: keep the stored slug untouched.
    const existing = originalDoc?.slug
    if (value === undefined && typeof existing === 'string' && existing !== '') {
      return undefined
    }

    const source = data?.[sourceField] ?? originalDoc?.[sourceField]
    if (typeof source === 'string' && source.trim() !== '') {
      return formatSlug(source)
    }

    return value
  }

export const slugField = (sourceField: string): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Auto-generated from ${sourceField} when left empty. Changing it after launch breaks the live URL.`,
  },
  hooks: {
    beforeValidate: [generateSlug(sourceField)],
  },
})
