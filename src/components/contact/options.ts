/**
 * Pill-group options for the contact form. Values must stay character for
 * character with the ContactSubmissions collection selects (they're the
 * Postgres enum values) and, later, the Zoho picklist mapping.
 */
export const I_AM_A_OPTIONS = [
  { label: 'Homeowner', value: 'homeowner' },
  { label: 'Architect', value: 'architect' },
  { label: 'Contractor', value: 'contractor' },
  { label: 'Interior Designer', value: 'interior-designer' },
  { label: 'Project Manager', value: 'project-manager' },
] as const

export const PROJECT_TYPE_OPTIONS = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
] as const

export type IAmAValue = (typeof I_AM_A_OPTIONS)[number]['value']
export type ProjectTypeValue = (typeof PROJECT_TYPE_OPTIONS)[number]['value']
