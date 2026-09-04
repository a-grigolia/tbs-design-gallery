import type {
  SerializedAutoLinkNode,
  SerializedLinkNode,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical'

import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Media, Post } from '@/payload-types'

import { asMedia, mediaUrl } from '@/components/vendor/media'

type NodeLike = {
  type?: string
  children?: NodeLike[]
}

function lastLinebreakIndex(nodes: { type?: string }[]): number {
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i]?.type === 'linebreak') return i
  }
  return -1
}

/**
 * Lexical nests quote copy in paragraph children, so shift+enter linebreaks
 * live there — not as direct quote children. Flatten one level when every
 * child is a paragraph so the attribution split can see those breaks.
 */
function quoteInlineChildren(nodes: NodeLike[]): NodeLike[] {
  if (nodes.some((child) => child.type === 'linebreak')) return nodes
  if (nodes.length > 0 && nodes.every((child) => child.type === 'paragraph')) {
    return nodes.flatMap((child) => child.children ?? [])
  }
  return nodes
}

function uploadMedia(value: SerializedUploadNode['value']): Media | null {
  if (!value || typeof value !== 'object') return null
  return asMedia(value as Media)
}

function linkHref(fields: SerializedAutoLinkNode['fields'] | SerializedLinkNode['fields']): string {
  return fields.url ?? '#'
}

export function PostBody({ content }: { content: Post['content'] }) {
  return (
    <RichText
      data={content}
      className="flex flex-col gap-[24px]"
      converters={({ defaultConverters }) => ({
        ...defaultConverters,
        paragraph: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children })
          return (
            <p className="font-sans text-[16px] leading-[24px] text-ink-75">
              {children.length ? children : <br />}
            </p>
          )
        },
        heading: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children })
          if (node.tag === 'h2') {
            return (
              <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
                {children}
              </h2>
            )
          }
          if (node.tag === 'h3') {
            return (
              <h3 className="font-sans text-[18px] leading-[24px] font-medium text-ink">
                {children}
              </h3>
            )
          }
          const Tag = node.tag
          return <Tag>{children}</Tag>
        },
        quote: ({ node, nodesToJSX }) => {
          // Shift+enter in a quote: text after the last linebreak is the
          // attribution. No linebreak → the whole quote stays quote text.
          const inline = quoteInlineChildren(node.children ?? [])
          const breakAt = lastLinebreakIndex(inline)
          const quoteNodes = breakAt === -1 ? inline : inline.slice(0, breakAt)
          const attributionNodes = breakAt === -1 ? [] : inline.slice(breakAt + 1)

          return (
            <blockquote className="flex w-full flex-col gap-[24px]">
              <div className="h-px w-full bg-hairline" />
              <div className="flex flex-col gap-[8px]">
                <div className="font-display text-[24px] leading-[31px] text-ink">
                  {nodesToJSX({ nodes: quoteNodes as typeof node.children })}
                </div>
                {attributionNodes.length > 0 && (
                  <div className="font-sans text-[15px] leading-[21px] text-ink-75">
                    {nodesToJSX({ nodes: attributionNodes as typeof node.children })}
                  </div>
                )}
              </div>
              <div className="h-px w-full bg-hairline" />
            </blockquote>
          )
        },
        upload: ({ node }) => {
          const media = uploadMedia(node.value)
          const src = mediaUrl(media)
          if (!src) return null
          return (
            <div className="py-[48px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={media?.alt ?? ''}
                src={src}
                width={media?.width ?? undefined}
                height={media?.height ?? undefined}
                className="h-auto w-full rounded-[12px]"
              />
            </div>
          )
        },
        link: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children })
          return (
            <a
              href={linkHref(node.fields)}
              rel={node.fields.newTab ? 'noopener noreferrer' : undefined}
              target={node.fields.newTab ? '_blank' : undefined}
              className="underline underline-offset-2"
            >
              {children}
            </a>
          )
        },
        autolink: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children })
          return (
            <a
              href={linkHref(node.fields)}
              rel={node.fields.newTab ? 'noopener noreferrer' : undefined}
              target={node.fields.newTab ? '_blank' : undefined}
              className="underline underline-offset-2"
            >
              {children}
            </a>
          )
        },
        horizontalrule: <div className="h-px w-full bg-hairline" role="separator" />,
        list: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children })
          const className =
            node.tag === 'ol'
              ? 'list-decimal pl-[20px] font-sans text-[16px] leading-[24px] text-ink-75'
              : 'list-disc pl-[20px] font-sans text-[16px] leading-[24px] text-ink-75'
          const Tag = node.tag
          return <Tag className={className}>{children}</Tag>
        },
      })}
    />
  )
}
