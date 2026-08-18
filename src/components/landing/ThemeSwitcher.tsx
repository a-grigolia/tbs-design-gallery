'use client'

import { useTheme } from 'next-themes'
import React, { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

const OPTIONS = [
  { value: 'light', label: 'Light mode', icon: '/landing/theme-sun.svg', iconClass: 'size-[14px]' },
  { value: 'dark', label: 'Dark mode', icon: '/landing/theme-moon.svg', iconClass: 'size-[12px]' },
  {
    value: 'system',
    label: 'System theme',
    icon: '/landing/theme-monitor.svg',
    iconClass: 'h-[12px] w-[14px]',
  },
]

/** Three-state theme pill (light / dark / system) from the Figma footer. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  // Theme is unknown until hydration; render without an active state on the
  // server so the markup matches.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  return (
    <div className="flex items-center rounded-[44px] border border-hairline">
      {OPTIONS.map((option) => {
        const isActive = mounted && theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={isActive}
            onClick={() => setTheme(option.value)}
            className={
              isActive
                ? 'flex items-center justify-center self-stretch rounded-[44px] border border-hairline bg-cream px-[10px] py-[6px]'
                : 'group flex flex-col items-center justify-center p-[3px]'
            }
          >
            {isActive ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" src={option.icon} className={`${option.iconClass} dark:invert`} />
            ) : (
              <span className="flex items-center justify-center rounded-[44px] px-[7px] py-[3px] transition-colors group-hover:bg-ink/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={option.icon} className={`${option.iconClass} dark:invert`} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
