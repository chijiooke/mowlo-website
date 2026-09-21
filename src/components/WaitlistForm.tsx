'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { getLenis } from '@/lib/scroll/SmoothScroll'

/** The two markets Mowlo prints and delivers in. */
const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬', digits: 10 },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭', digits: 9 },
]

const country = (code: string) => COUNTRIES.find(c => c.code === code) ?? COUNTRIES[0]

interface Values {
  firstName: string
  lastName: string
  email: string
  country: string
  phone: string
  location: string
}

type WaitlistFormik = ReturnType<typeof useFormik<Values>>

const schema = Yup.object({
  firstName: Yup.string().trim().min(2, 'Tell us your first name').required('Enter your first name'),
  lastName: Yup.string().trim().min(2, 'Tell us your last name').required('Enter your last name'),
  email: Yup.string().trim().email('That email looks off').required('Enter your email'),
  country: Yup.string().oneOf(COUNTRIES.map(c => c.code), 'Pick your country').required('Pick your country'),
  // Local number length follows the country: 10 digits in NG, 9 in GH.
  phone: Yup.string()
    .required('Enter your phone number')
    .when('country', {
      is: 'GH',
      then: s => s.matches(/^\d{9}$/, 'Enter 9 digits (without the leading 0)'),
      otherwise: s => s.matches(/^\d{10}$/, 'Enter 10 digits (without the leading 0)'),
    }),
  location: Yup.string().trim().min(2, 'City or state is fine').required('Where are you based?'),
})

/** Opens the one shared dialog, tagging where the visitor came from. */
const WaitlistContext = createContext<(source?: string) => void>(() => {})

export const useWaitlist = () => useContext(WaitlistContext)

/**
 * Holds the single modal for the whole site. Every CTA is a trigger, so one
 * dialog in the tree beats a dozen copies of it.
 */
export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [source, setSource] = useState<string | null>(null)
  const open = useCallback((from = 'site') => setSource(from), [])
  const close = useCallback(() => setSource(null), [])
  const value = useMemo(() => open, [open])

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistModal open={source !== null} onClose={close} source={source ?? 'site'} />
    </WaitlistContext.Provider>
  )
}

interface CTAProps {
  source?: string
  /** Lets the button borrow whichever button style its surroundings use. */
  className?: string
  label?: string
}

/** A button that opens the shared waitlist dialog. */
export function WaitlistCTA({ source = 'mobile-app', className = 'btn-wl', label = 'Download the app →' }: CTAProps) {
  const open = useWaitlist()

  return (
    <button type="button" className={className} onClick={() => open(source)}>
      {label}
    </button>
  )
}

function WaitlistModal({ open, onClose, source }: { open: boolean; onClose: () => void; source: string }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return

    // Send focus back where it came from, or a keyboard user is dropped at the
    // top of the document when the dialog closes.
    const opener = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      // Keep tabbing inside the dialog.
      const items = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, a[href]',
      )
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // Lenis drives the page scroll itself and ignores overflow: hidden.
    getLenis()?.stop()
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      getLenis()?.start()
      opener?.focus?.()
    }
  }, [open, onClose])

  if (!mounted) return null

  // Portalled: a fixed overlay inside the blurred nav would be positioned
  // against the nav rather than the viewport.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="wl-modal"
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-labelledby="wl-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            className="wl-panel"
            initial={{ scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="wl-close" onClick={onClose} aria-label="Close">
              <Icon icon="lucide:x" width={20} />
            </button>

            <h2 id="wl-modal-title" className="wl-title">
              Be the first to know.
            </h2>
            <p className="wl-intro">
              Join our waitlist and we&apos;ll message you the day the app drops — nothing else, ever.
            </p>

            <WaitlistForm source={source} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function WaitlistForm({ source = 'mobile-app' }: { source?: string }) {
  const formik = useFormik<Values>({
    initialValues: { firstName: '', lastName: '', email: '', country: 'NG', phone: '', location: '' },
    validationSchema: schema,
    onSubmit: async (values, { setStatus, resetForm }) => {
      setStatus(undefined)
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, source }),
        })
        if (!res.ok) throw new Error()
        setStatus('ok')
        resetForm()
      } catch {
        setStatus('error')
      }
    },
  })

  const selected = country(formik.values.country)

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="wl">
        <Field formik={formik} name="firstName" label="First name" placeholder="Adaeze" autoComplete="given-name" span={6} />
        <Field formik={formik} name="lastName" label="Last name" placeholder="Okonkwo" autoComplete="family-name" span={6} />

        <Field formik={formik} name="email" label="Email" type="email" placeholder="you@business.com" autoComplete="email" />

        <Field
          formik={formik}
          name="phone"
          label="Phone number"
          placeholder={selected.digits === 9 ? '241234567' : '8012345678'}
          autoComplete="tel"
          prefix={`${selected.flag} ${selected.dial}`}
        />

        <Field
          formik={formik}
          name="location"
          label="City"
          placeholder={selected.code === 'GH' ? 'Accra' : 'Lagos'}
          autoComplete="address-level2"
          span={6}
        />
        <Select formik={formik} name="country" label="Country" autoComplete="country" span={6}>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </Select>

        <div className="wl-actions">
          <button type="submit" className="btn-wl" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Adding you…' : 'Join waitlist →'}
          </button>

          <div id="waitlist-msg" className="wl-msg" aria-live="polite">
            <AnimatePresence mode="wait">
              {formik.status === 'ok' && (
                <Message key="ok" tone="var(--teal)" icon="lucide:check">
                  You&apos;re on the list. We&apos;ll message you the day it drops.
                </Message>
              )}
              {formik.status === 'error' && (
                <Message key="error" tone="var(--pink)" icon="lucide:wifi-off">
                  Couldn&apos;t save that. Check your connection and try again.
                </Message>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </form>
  )
}

interface FieldProps {
  formik: WaitlistFormik
  name: keyof Values
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
  /** Renders a fixed leading chip — used for the dialling code. */
  prefix?: string
  /** Columns out of 12. Full width unless told otherwise. */
  span?: 6 | 12
}

function Field({ formik, name, label, placeholder, type = 'text', autoComplete, prefix, span = 12 }: FieldProps) {
  const error = formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined
  const id = `waitlist-${name}`
  const isPhone = name === 'phone'

  return (
    <div className={`wl-row col-${span}`}>
      <label htmlFor={id} className="wl-label">
        {label}
        {/* Spoken, not just seen — otherwise the dial code is invisible to SR users. */}
        {prefix && <span className="sr-only"> ({prefix.replace(/[^\d+]/g, '')})</span>}
      </label>
      <div className="wl-field">
        {prefix && (
          <span className="wl-prefix" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={isPhone ? 'numeric' : undefined}
          maxLength={isPhone ? country(formik.values.country).digits : undefined}
          className={`wl-input${prefix ? ' has-prefix' : ''}${error ? ' wl-err' : ''}`}
          value={formik.values[name]}
          onChange={e =>
            formik.setFieldValue(name, isPhone ? e.target.value.replace(/\D/g, '') : e.target.value)
          }
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-err`} className="wl-field-err">
          {error}
        </p>
      )}
    </div>
  )
}

interface SelectProps {
  formik: WaitlistFormik
  name: keyof Values
  label: string
  autoComplete?: string
  /** Columns out of 12. Full width unless told otherwise. */
  span?: 6 | 12
  children: React.ReactNode
}

function Select({ formik, name, label, autoComplete, span = 12, children }: SelectProps) {
  const error = formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined
  const id = `waitlist-${name}`

  return (
    <div className={`wl-row col-${span}`}>
      <label htmlFor={id} className="wl-label">
        {label}
      </label>
      <div className="wl-field wl-select-wrap">
        <select
          id={id}
          name={name}
          autoComplete={autoComplete}
          className={`wl-input wl-select${error ? ' wl-err' : ''}`}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
        >
          {children}
        </select>
        <Icon icon="lucide:chevron-down" width={16} className="wl-select-chevron" aria-hidden="true" />
      </div>
      {error && (
        <p id={`${id}-err`} className="wl-field-err">
          {error}
        </p>
      )}
    </div>
  )
}

function Message({ children, tone, icon }: { children: React.ReactNode; tone: string; icon?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      style={{ color: tone, display: 'flex', alignItems: 'center', gap: 6 }}
    >
      {icon && <Icon icon={icon} width={15} />}
      {children}
    </motion.p>
  )
}
