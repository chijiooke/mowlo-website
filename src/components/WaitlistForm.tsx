'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const schema = Yup.object({
  whatsapp: Yup.string()
    .matches(/^\d{10}$/, 'Enter 10 digits (without the leading 0 or +234)')
    .required('Enter your WhatsApp number'),
})

export function WaitlistForm({ source = 'mobile-app' }: { source?: string }) {
  const formik = useFormik({
    initialValues: { whatsapp: '' },
    validationSchema: schema,
    onSubmit: async ({ whatsapp }, { setStatus, resetForm }) => {
      setStatus(undefined)
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ whatsapp, source }),
        })
        if (!res.ok) throw new Error()
        setStatus('ok')
        resetForm()
      } catch {
        setStatus('error')
      }
    },
  })

  const invalid = Boolean(formik.touched.whatsapp && formik.errors.whatsapp)

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="wl">
        <div className="wl-field">
          <label htmlFor="waitlist-whatsapp" className="wl-prefix">
            <span aria-hidden="true">🇳🇬</span>
            <span className="sr-only">WhatsApp number</span>
            <span aria-hidden="true">&nbsp;+234</span>
          </label>
          <input
            id="waitlist-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="8012345678"
            className={`wl-input${invalid ? ' wl-err' : ''}`}
            value={formik.values.whatsapp}
            onChange={e => formik.setFieldValue('whatsapp', e.target.value.replace(/\D/g, ''))}
            onBlur={formik.handleBlur}
            aria-invalid={invalid}
            aria-describedby="waitlist-msg"
          />
        </div>

        <button type="submit" className="btn-hp" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Adding you…' : 'Notify me →'}
        </button>

        <div id="waitlist-msg" className="wl-msg" aria-live="polite">
          <AnimatePresence mode="wait">
            {invalid && (
              <Message key="invalid" tone="var(--pink)">
                {formik.errors.whatsapp}
              </Message>
            )}
            {!invalid && formik.status === 'ok' && (
              <Message key="ok" tone="var(--teal)" icon="lucide:check">
                You&apos;re on the list. We&apos;ll message you the day it drops.
              </Message>
            )}
            {!invalid && formik.status === 'error' && (
              <Message key="error" tone="var(--pink)" icon="lucide:wifi-off">
                Couldn&apos;t save that. Check your connection and try again.
              </Message>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
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
