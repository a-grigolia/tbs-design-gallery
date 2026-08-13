import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

/** Admins get full access; other users are limited to their own document. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

/**
 * Logged-in users (admin or editor) can read everything, including drafts.
 * The public can only read published documents.
 */
export const isLoggedInOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
