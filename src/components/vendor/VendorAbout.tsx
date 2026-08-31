import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Vendor } from '@/payload-types'

type LexicalNode = { type?: unknown; text?: unknown; children?: LexicalNode[] }

function collectText(node: LexicalNode): string {
  if (node.type === 'linebreak') return '\n'
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(collectText).join('')
}

/**
 * Flattens a rich text field into display lines: one per list item, paragraph,
 * or shift+enter line break — so editors can enter the specs list any way.
 */
function extractLines(state: Vendor['productSpecifications']): string[] {
  const lines: string[] = []
  const visit = (node: LexicalNode) => {
    if (node.type === 'list') {
      node.children?.forEach(visit)
      return
    }
    for (const line of collectText(node).split('\n')) {
      const trimmed = line.trim()
      if (trimmed) lines.push(trimmed)
    }
  }
  ;(state?.root?.children as LexicalNode[] | undefined)?.forEach(visit)
  return lines
}

/** Two-column about band: heading + rich text left, product specification lines right. */
export function VendorAbout({ vendor }: { vendor: Vendor }) {
  const specLines = extractLines(vendor.productSpecifications)
  const hasLeft = Boolean(vendor.heading || vendor.content)
  if (!hasLeft && specLines.length === 0) return null

  return (
    <div className="w-full px-gutter-sm lg:px-gutter">
      <div className="flex w-full flex-col gap-[32px] py-[48px] lg:flex-row lg:items-start lg:justify-between">
        {hasLeft && (
          <div className="flex flex-col gap-[8px] lg:w-[305px]">
            {vendor.heading && (
              <p className="text-[16px] leading-normal text-ink">{vendor.heading}</p>
            )}
            {vendor.content && (
              <div className="flex flex-col gap-[8px] text-[14px] leading-normal text-ink-50">
                <RichText data={vendor.content} />
              </div>
            )}
          </div>
        )}
        {specLines.length > 0 && (
          <div className="flex flex-col lg:items-end lg:text-right">
            {specLines.map((line) => (
              <p key={line} className="text-[20px] leading-[26px] text-ink">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
