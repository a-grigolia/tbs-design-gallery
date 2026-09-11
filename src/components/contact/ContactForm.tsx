'use client'

import Script from 'next/script'
import React, { useEffect, useRef, useState } from 'react'

import { submitContact } from '@/app/(frontend)/contact/actions'
import { I_AM_A_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/components/contact/options'
import { californiaAddressFromPlace, type StructuredAddress } from '@/lib/address'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type TextFieldName = 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'message'

const TEXT_FIELDS: {
  name: TextFieldName
  label: string
  type: 'text' | 'email' | 'tel'
  autoComplete: string
}[] = [
  { name: 'firstName', label: 'First name *', type: 'text', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name *', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'Email *', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone number *', type: 'tel', autoComplete: 'tel' },
]

const EMPTY_VALUES: Record<TextFieldName, string> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  message: '',
}

/** Blur-triggered validation: empty is always an error; email also checks format. */
function fieldError(name: TextFieldName, value: string): string | null {
  if (!value.trim()) return 'Please fill out this field.'
  if (name === 'email' && !EMAIL_RE.test(value.trim())) return 'Please enter a valid email address.'
  return null
}

/** Single-select pill row (radio semantics) for "I am a" / "Project type". */
function PillGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: readonly { label: string; value: string }[]
  selected: string | null
  onSelect: (value: string) => void
}) {
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <p className="text-[14px] text-ink-50">{label}</p>
      <div className="flex w-full flex-wrap gap-[10px]" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.value === selected
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(option.value)}
              className={`flex h-[40px] cursor-pointer items-center justify-center rounded-[44px] border px-[24px] py-[10px] text-center text-[14px] leading-[18px] text-ink transition-colors ${
                active ? 'border-ink-50 bg-cream' : 'border-hairline hover:border-ink-30'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Floating-label field from the Figma states: label sits centered at 14px when
 * empty, shrinks to 8px pinned top when focused or filled; the hairline border
 * darkens with it. The blur error renders just below the border (777:9592).
 */
function FloatingField({
  name,
  label,
  type,
  autoComplete,
  multiline = false,
  value,
  error,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  inputRef,
  ariaControls,
  ariaExpanded,
  ariaActiveDescendant,
}: {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  multiline?: boolean
  value: string
  error: string | null
  onChange: (value: string) => void
  onBlur: () => void
  onFocus?: () => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  inputRef?: React.Ref<HTMLInputElement>
  ariaControls?: string
  ariaExpanded?: boolean
  ariaActiveDescendant?: string
}) {
  const [focused, setFocused] = useState(false)
  const raised = focused || value !== ''

  // rounded matches the wrapper so the autofill fix's opaque inset shadow
  // (styles.css) can't square off the corners.
  const sharedInputClasses =
    'w-full rounded-[16px] bg-transparent px-[12px] pb-[6px] pt-[20px] text-[14px] text-ink-75 outline-none'

  return (
    <div className="relative w-full">
      <label
        className={`relative flex w-full rounded-[16px] border transition-colors ${
          raised ? 'border-ink-50' : 'border-hairline'
        } ${multiline ? 'h-[149px] items-start' : 'h-[52px] items-center'}`}
      >
        <span
          className={`pointer-events-none absolute left-[12px] text-ink-50 transition-all duration-150 ${
            raised
              ? 'top-[6px] text-[8px] leading-[10px]'
              : multiline
                ? 'top-[16px] text-[14px]'
                : 'top-1/2 -translate-y-1/2 text-[14px]'
          }`}
        >
          {label}
        </span>
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              onBlur()
            }}
            className={`${sharedInputClasses} h-full resize-none`}
          />
        ) : (
          <input
            ref={inputRef}
            name={name}
            type={type ?? 'text'}
            autoComplete={autoComplete}
            role={ariaControls ? 'combobox' : undefined}
            aria-autocomplete={ariaControls ? 'list' : undefined}
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            aria-activedescendant={ariaActiveDescendant}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => {
              setFocused(true)
              onFocus?.()
            }}
            onKeyDown={onKeyDown}
            onBlur={() => {
              setFocused(false)
              onBlur()
            }}
            className={sharedInputClasses}
          />
        )}
      </label>
      {error ? (
        <p className="absolute -bottom-px left-[12px] translate-y-full text-[10px] leading-[18px] tracking-[0.1px] text-[rgba(255,116,116,0.7)]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type AddressSuggestion = {
  label: string
  prediction: google.maps.places.PlacePrediction
}

function AddressField({
  value,
  error,
  onChange,
  onSelect,
  onBlur,
  placesReady,
}: {
  value: string
  error: string | null
  onChange: (value: string) => void
  onSelect: (value: StructuredAddress | null) => void
  onBlur: () => void
  placesReady: boolean
}) {
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const suppressValueRef = useRef<string | null>(null)
  const listId = 'address-suggestions'

  useEffect(() => {
    const input = value.trim()
    if (!focused || !placesReady || input.length < 3 || !window.google?.maps?.importLibrary) {
      return
    }
    if (suppressValueRef.current === value) {
      suppressValueRef.current = null
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary
        sessionTokenRef.current ??= new AutocompleteSessionToken()
        const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedRegionCodes: ['us'],
          sessionToken: sessionTokenRef.current,
        })
        if (cancelled) return
        setSuggestions(
          response.suggestions.flatMap((suggestion) => {
            const prediction = suggestion.placePrediction
            return prediction ? [{ label: prediction.text.toString(), prediction }] : []
          }),
        )
        setActiveIndex(-1)
      } catch {
        // Manual entry remains available if Places is unavailable or misconfigured.
        if (!cancelled) setSuggestions([])
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [focused, placesReady, value])

  async function selectSuggestion(suggestion: AddressSuggestion) {
    try {
      const place = suggestion.prediction.toPlace()
      await place.fetchFields({ fields: ['formattedAddress', 'addressComponents', 'id'] })
      const structured = californiaAddressFromPlace(place)
      const address = structured?.address ?? place.formattedAddress ?? suggestion.label

      suppressValueRef.current = address
      onChange(address)
      onSelect(structured)
    } catch {
      onSelect(null)
    }
    setSuggestions([])
    setActiveIndex(-1)
    sessionTokenRef.current = null
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      void selectSuggestion(suggestions[activeIndex])
    } else if (event.key === 'Escape') {
      setSuggestions([])
      setActiveIndex(-1)
    }
  }

  return (
    <div className="relative z-10 md:col-span-2">
      <FloatingField
        name="address"
        label="Address *"
        autoComplete="street-address"
        value={value}
        error={error}
        onChange={(nextValue) => {
          onChange(nextValue)
          onSelect(null)
          if (nextValue.trim().length < 3) {
            setSuggestions([])
            setActiveIndex(-1)
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          setSuggestions([])
          setActiveIndex(-1)
          onBlur()
        }}
        onKeyDown={handleKeyDown}
        ariaControls={listId}
        ariaExpanded={suggestions.length > 0}
        ariaActiveDescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
      />
      {suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[60px] z-20 w-full overflow-hidden rounded-[16px] border border-hairline bg-canvas shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              id={`${listId}-${index}`}
              key={`${suggestion.label}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                className={`w-full px-[12px] py-[12px] text-left text-[14px] text-ink transition-colors ${
                  index === activeIndex ? 'bg-cream' : 'hover:bg-cream'
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => void selectSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ContactForm() {
  const [iAmA, setIAmA] = useState<string | null>(null)
  const [projectType, setProjectType] = useState<string | null>(null)
  const [values, setValues] = useState(EMPTY_VALUES)
  const [touched, setTouched] = useState<Partial<Record<TextFieldName, boolean>>>({})
  // Honeypot — visually hidden; bots that fill it get a silent no-op success.
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [placesReady, setPlacesReady] = useState(false)
  const [structuredAddress, setStructuredAddress] = useState<StructuredAddress | null>(null)
  // The success panel holds the form's rendered height so the page (and the
  // photo beside it) doesn't collapse when the form is swapped out.
  const formRef = useRef<HTMLFormElement>(null)
  const [formHeight, setFormHeight] = useState<number | null>(null)

  const allValid =
    iAmA !== null &&
    projectType !== null &&
    structuredAddress !== null &&
    (Object.keys(EMPTY_VALUES) as TextFieldName[]).every(
      (name) => fieldError(name, values[name]) === null,
    )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!allValid || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitContact({
      iAmA: iAmA ?? '',
      projectType: projectType ?? '',
      ...values,
      ...(structuredAddress ?? {
        address: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        googlePlaceId: '',
      }),
      company,
    })
    setSubmitting(false)
    if (result.ok) {
      setFormHeight(formRef.current?.offsetHeight ?? null)
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  // Confirmed-submission state (Figma 784:9783): a hairline panel the size of
  // the form with the thank-you message centered inside.
  if (submitted) {
    return (
      <div
        style={{ minHeight: formHeight ?? undefined }}
        className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-[24px] border border-hairline"
      >
        <div className="flex flex-col items-center gap-[16px] px-[24px] text-center">
          <h2 className="font-display text-[24px] leading-[31px] font-semibold text-ink">
            Thank you!
          </h2>
          <p className="max-w-[384px] text-[14px] leading-[18px] text-ink-50">
            Your submission has been received.
            <br />
            We&apos;ll get back to you shortly
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <Script
          id="google-maps-places"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&v=weekly`}
          strategy="afterInteractive"
          onReady={() => setPlacesReady(true)}
        />
      ) : null}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-[32px]"
      >
        <PillGroup label="I am a *" options={I_AM_A_OPTIONS} selected={iAmA} onSelect={setIAmA} />
        <PillGroup
          label="Project type *"
          options={PROJECT_TYPE_OPTIONS}
          selected={projectType}
          onSelect={setProjectType}
        />

        <div className="grid w-full grid-cols-1 gap-[24px] md:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <FloatingField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              error={touched[field.name] ? fieldError(field.name, values[field.name]) : null}
              onChange={(value) => setValues((prev) => ({ ...prev, [field.name]: value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, [field.name]: true }))}
            />
          ))}
          <AddressField
            value={values.address}
            error={
              touched.address
                ? (fieldError('address', values.address) ??
                  (structuredAddress
                    ? null
                    : 'Please select a California address from the suggestions.'))
                : null
            }
            onChange={(value) => setValues((prev) => ({ ...prev, address: value }))}
            onSelect={setStructuredAddress}
            onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
            placesReady={placesReady}
          />
          <div className="md:col-span-2">
            <FloatingField
              name="message"
              label="Tell us about your project or needs *"
              multiline
              value={values.message}
              error={touched.message ? fieldError('message', values.message) : null}
              onChange={(value) => setValues((prev) => ({ ...prev, message: value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
            />
          </div>
        </div>

        {/* Honeypot: off-screen, skipped by keyboard and screen readers. */}
        <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Company
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>
        </div>

        <div className="flex w-full flex-col items-end justify-center gap-[8px]">
          <button
            type="submit"
            disabled={!allValid || submitting}
            className={`flex h-[40px] items-center justify-center rounded-[44px] border px-[24px] py-[10px] text-center text-[14px] leading-[18px] transition-all duration-300 ${
              allValid
                ? 'cursor-pointer border-brand-glow bg-brand text-white'
                : 'cursor-not-allowed border-hairline text-ink opacity-50'
            }`}
          >
            {submitting ? 'Sending…' : 'Submit'}
          </button>
          {submitError ? (
            <p className="text-[12px] leading-[16px] text-[rgba(255,116,116,0.9)]">{submitError}</p>
          ) : null}
        </div>
      </form>
    </>
  )
}
