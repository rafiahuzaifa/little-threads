'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+92 311 2345678',
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
    color: 'text-[#25D366]',
    bg: 'bg-green-50',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@littlethreads.pk',
    href: 'mailto:hello@littlethreads.pk',
    color: 'text-bubblegum-400',
    bg: 'bg-soft-pink',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 42 12345678',
    href: 'tel:+924212345678',
    color: 'text-skyblue-400',
    bg: 'bg-soft-blue',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Gulberg III, Lahore, Pakistan',
    href: '#',
    color: 'text-coral-500',
    bg: 'bg-soft-yellow',
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormData) => {
    // Simulate send — replace with actual email API
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Message sent! We'll get back to you within 24 hours 🎉")
    setSent(true)
    reset()
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute top-8 right-12 text-4xl animate-float pointer-events-none">💌</div>
        <div className="absolute top-16 left-16 text-3xl animate-float-delay pointer-events-none">✨</div>

        <div className="container mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-soft">
            <span className="text-sm font-nunito font-semibold text-bubblegum-500">Get in Touch</span>
          </div>
          <h1 className="font-fredoka text-4xl md:text-5xl text-charcoal mb-4">
            We'd Love to Hear From You! 💬
          </h1>
          <p className="font-poppins text-gray-500">
            Questions, feedback, or just want to say hi? We're here for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 ${info.bg} rounded-2xl p-4 hover:shadow-card transition-all hover:scale-[1.02]`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft shrink-0">
                    <Icon size={22} className={info.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-nunito">{info.label}</p>
                    <p className="font-nunito font-semibold text-charcoal text-sm">{info.value}</p>
                  </div>
                </a>
              )
            })}

            {/* Hours */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-sunshine-500" />
                <p className="font-nunito font-bold text-charcoal text-sm">Business Hours</p>
              </div>
              <div className="space-y-1 text-sm font-poppins text-gray-600">
                <div className="flex justify-between">
                  <span>Mon – Fri</span>
                  <span className="font-medium">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-red-400">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-float p-6 md:p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
                <h3 className="font-nunito font-black text-2xl text-charcoal mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll reply within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="bg-gradient-pink text-white px-6 py-2.5 rounded-full font-nunito font-bold hover:shadow-pink transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-nunito font-black text-xl text-charcoal mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                        Your Name
                      </label>
                      <input
                        {...register('name')}
                        placeholder="Full name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                        Email
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                      Phone (optional)
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="03XX-XXXXXXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                      Subject
                    </label>
                    <input
                      {...register('subject')}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block font-nunito font-semibold text-sm text-charcoal mb-1.5">
                      Message
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-poppins text-sm focus:outline-none focus:border-bubblegum-400 transition-colors resize-none"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-pink text-white py-3.5 rounded-2xl font-nunito font-bold hover:shadow-pink transition-all hover:scale-[1.01] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
