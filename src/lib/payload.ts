import config from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'
import { cache } from 'react'

/**
 * Cached Payload client for server components. React's `cache` deduplicates
 * calls within a single request; Payload itself memoizes the instance across
 * requests, so this is cheap to call anywhere.
 */
export const getPayload = cache(async () => getPayloadInstance({ config: await config }))
