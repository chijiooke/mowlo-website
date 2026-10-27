'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { PartnerFormValues } from '@/types/partner'

const EQUIPMENT_OPTIONS = [
  'Digital Printer',
  'Large Format Printer',
  'Cutting Machine',
  'Binding Machine',
  'Laminator',
  'Screen Printer',
]

const CITY_OPTIONS = [
  'Lagos (Island)',
  'Lagos (Mainland)',
  'Abuja (FCT)',
  'Port Harcourt',
  'Ibadan',
  'Kano',
  'Other',
]

const schema = Yup.object({
  ownerName:  Yup.string().required('Please enter your full name'),
  shopName:   Yup.string().required('Please enter your shop/business name'),
  city:       Yup.string().required('Please select your city'),
  address:    Yup.string().required('Please enter your address'),
  staffCount: Yup.string().matches(/^\d+$/, 'Must be a number').required('Required'),
  equipment:  Yup.array().min(1, 'Select at least one option').required(),
  whatsapp:   Yup.string().matches(/^\d{10}$/, 'Enter 10 digits (without leading 0 or +234)').required('Required'),
})

type ModalState = 'idle' | 'success' | 'error'

const inputBase = `
  w-full bg-[#141416] border border-white/[0.07] rounded-xl px-4 py-3
  font-[family-name:var(--font-dm-sans)] text-sm text-[#F0EDE8]
  placeholder:text-[#7A7875] outline-none transition
  focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10
`
const errInput = 'border-[#E8527A]'
const labelBase = 'block text-xs font-semibold text-[#F0EDE8] mb-1.5 tracking-wide'

export function PartnerForm() {
  const [modal, setModal] = useState<ModalState>('idle')

  const formik = useFormik<PartnerFormValues>({
    initialValues: { ownerName: '', shopName: '', city: '', address: '', staffCount: '', equipment: [], whatsapp: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch('/api/partner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, staffCount: Number(values.staffCount) }),
        })
        if (!res.ok) throw new Error()
        setModal('success')
      } catch {
        setModal('error')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const toggleEquipment = (item: string) => {
    const cur = formik.values.equipment
    formik.setFieldValue('equipment', cur.includes(item) ? cur.filter(e => e !== item) : [...cur, item])
  }

  const field = (id: keyof PartnerFormValues) => ({
    id, name: id, value: formik.values[id] as string,
    onChange: formik.handleChange, onBlur: formik.handleBlur,
    className: `${inputBase} ${formik.touched[id] && formik.errors[id] ? errInput : ''}`,
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">

        {/* Owner name */}
        <div>
          <label htmlFor="ownerName" className={labelBase}>Your full name <span className="text-amber-400">*</span></label>
          <input type="text" placeholder="e.g. Emeka Johnson" autoComplete="name" {...field('ownerName')} />
          {formik.touched.ownerName && formik.errors.ownerName && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.ownerName}</p>}
        </div>

        {/* Shop name */}
        <div>
          <label htmlFor="shopName" className={labelBase}>Shop / business name <span className="text-amber-400">*</span></label>
          <input type="text" placeholder="e.g. QuickPrint Lagos" {...field('shopName')} />
          {formik.touched.shopName && formik.errors.shopName && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.shopName}</p>}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className={labelBase}>City <span className="text-amber-400">*</span></label>
          <select
            id="city" name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${inputBase} appearance-none bg-no-repeat bg-[right_14px_center] ${formik.touched.city && formik.errors.city ? errInput : ''}`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%237A7875' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, paddingRight: 40 }}
          >
            <option value="" disabled>Select your city</option>
            {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {formik.touched.city && formik.errors.city && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.city}</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className={labelBase}>Business address <span className="text-amber-400">*</span></label>
          <input type="text" placeholder="e.g. 14 Broad Street, Lagos Island" {...field('address')} />
          {formik.touched.address && formik.errors.address && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.address}</p>}
        </div>

        {/* Staff count */}
        <div>
          <label htmlFor="staffCount" className={labelBase}>Number of staff</label>
          <input type="number" min="1" placeholder="e.g. 3" {...field('staffCount')} />
          {formik.touched.staffCount && formik.errors.staffCount && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.staffCount}</p>}
        </div>

        {/* Equipment chips */}
        <div>
          <label className={labelBase}>
            Equipment available <span className="text-amber-400">*</span>{' '}
            <span className="font-normal text-[#7A7875] tracking-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {EQUIPMENT_OPTIONS.map(item => {
              const active = formik.values.equipment.includes(item)
              return (
                <button
                  type="button" key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`px-3.5 py-1.5 rounded-full border text-[13px] font-medium cursor-pointer transition-all
                    ${active
                      ? 'border-amber-400 bg-amber-400/12 text-amber-400'
                      : 'border-white/[0.07] text-[#7A7875] hover:border-amber-400/30 hover:text-[#F0EDE8]'}`}
                >
                  {item}
                </button>
              )
            })}
          </div>
          {formik.touched.equipment && formik.errors.equipment && (
            <p className="mt-1.5 text-xs text-[#E8527A]">{formik.errors.equipment as string}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className={labelBase}>WhatsApp number <span className="text-amber-400">*</span></label>
          <div className="flex">
            <span className="flex items-center px-3.5 bg-[#1E1E22] border border-r-0 border-white/[0.07] rounded-l-xl text-sm text-[#7A7875] whitespace-nowrap">
              🇳🇬 +234
            </span>
            <input
              type="tel" id="whatsapp" name="whatsapp" inputMode="numeric" maxLength={10}
              placeholder="8012345678"
              value={formik.values.whatsapp}
              onChange={e => formik.setFieldValue('whatsapp', e.target.value.replace(/\D/g, ''))}
              onBlur={formik.handleBlur}
              className={`${inputBase} rounded-l-none ${formik.touched.whatsapp && formik.errors.whatsapp ? errInput : ''}`}
            />
          </div>
          {formik.touched.whatsapp && formik.errors.whatsapp && <p className="mt-1 text-xs text-[#E8527A]">{formik.errors.whatsapp}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-base cursor-pointer transition-all
            bg-amber-400 text-[#0A0A0B] shadow-[0_0_44px_rgba(245,166,35,0.25)]
            hover:bg-[#FFD152] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {formik.isSubmitting ? (
            <>
              <Icon icon="lucide:loader-2" className="animate-spin" width={18} />
              <span>Submitting…</span>
            </>
          ) : (
            'Submit application →'
          )}
        </button>

        <p className="text-xs text-[#7A7875] text-center leading-relaxed">
          We&apos;ll reach out via WhatsApp within 48hrs. No spam, ever.
        </p>
      </form>

      {/* Modals */}
      <AnimatePresence>
        {modal !== 'idle' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/72 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => modal === 'error' && setModal('idle')}
          >
            <motion.div
              className="bg-[#141416] border border-white/[0.07] rounded-3xl p-11 max-w-md w-full text-center"
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {modal === 'success' ? (
                <>
                  <div className="w-[72px] h-[72px] rounded-full mx-auto mb-5 flex items-center justify-center bg-teal-400/10 border-2 border-teal-400/30">
                    <Icon icon="lucide:check" className="text-[#1FB89E]" width={32} />
                  </div>
                  <h3 className="font-[family-name:var(--font-bricolage)] text-2xl font-extrabold tracking-tight text-[#F0EDE8] mb-2.5">Application received!</h3>
                  <p className="text-sm text-[#7A7875] leading-relaxed mb-7">
                    Thanks for joining the Mowlo print network. We&apos;ll review your details and reach out on WhatsApp within 48 hours.
                  </p>
                  <a href="/" className="inline-block px-8 py-3 rounded-full font-bold text-sm bg-amber-400 text-[#0A0A0B] hover:bg-[#FFD152] transition-colors">
                    Back to Mowlo →
                  </a>
                </>
              ) : (
                <>
                  <div className="w-[72px] h-[72px] rounded-full mx-auto mb-5 flex items-center justify-center bg-[#E8527A]/10 border-2 border-[#E8527A]/30">
                    <Icon icon="lucide:wifi-off" className="text-[#E8527A]" width={30} />
                  </div>
                  <h3 className="font-[family-name:var(--font-bricolage)] text-2xl font-extrabold tracking-tight text-[#F0EDE8] mb-2.5">Something went wrong</h3>
                  <p className="text-sm text-[#7A7875] leading-relaxed mb-7">
                    We couldn&apos;t save your application. Check your connection and try again.
                  </p>
                  <button
                    onClick={() => setModal('idle')}
                    className="px-8 py-3 rounded-full font-bold text-sm bg-white/8 text-[#F0EDE8] border border-white/[0.07] hover:bg-white/12 transition-colors"
                  >
                    Try again
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
