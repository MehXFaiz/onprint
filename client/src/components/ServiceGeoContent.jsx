import React, { useState } from 'react'
import { HelpCircle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ServiceGeoContent Component
 * Provides GEO-optimized answer-first content structure for service pages
 * Helps AI systems extract clear definitions, audience info, and FAQs
 */
export default function ServiceGeoContent({ geoData }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  if (!geoData) return null

  const { whatIs, whoNeedsThis, keyInfo, advantages, bestFor, faqs } = geoData

  return (
    <div className="space-y-8">
      {/* What Is Section - Critical for AI Understanding */}
      {whatIs && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#A82F19]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#A82F19]">
            <Info className="h-3.5 w-3.5" />
            <span>Definition</span>
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black mb-4">
            {whatIs.title}
          </h2>
          
          <div className="space-y-4">
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {whatIs.definition}
            </p>
            
            {whatIs.expanded && (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {whatIs.expanded}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key Information Box - Structured Data for AI */}
      {keyInfo && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-black mb-4">Key Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyInfo.cost && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Typical Cost
                </div>
                <p className="text-sm text-slate-900">{keyInfo.cost}</p>
              </div>
            )}
            
            {keyInfo.turnaround && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Turnaround Time
                </div>
                <p className="text-sm text-slate-900">{keyInfo.turnaround}</p>
              </div>
            )}
            
            {keyInfo.minimumOrder && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Minimum Order
                </div>
                <p className="text-sm text-slate-900">{keyInfo.minimumOrder}</p>
              </div>
            )}
            
            {keyInfo.materials && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Materials Available
                </div>
                <p className="text-sm text-slate-900">{keyInfo.materials}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Who Needs This Section */}
      {whoNeedsThis && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-black mb-4">{whoNeedsThis.title}</h3>
          
          <ul className="space-y-2">
            {whoNeedsThis.audiences.map((audience, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                <span>{audience}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Two Column: Advantages + Best For */}
      {(advantages || bestFor) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {advantages && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-black mb-3">Advantages</h3>
              <ul className="space-y-1.5">
                {advantages.map((advantage, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {bestFor && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-black mb-3">Best For</h3>
              <ul className="space-y-1.5">
                {bestFor.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* FAQs Section - Critical for AI Question Answering */}
      {faqs && faqs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          
          <h3 className="text-lg font-bold text-black mb-4">Common Questions</h3>
          
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              
              return (
                <div key={idx} className="py-4 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-start justify-between text-left gap-4 group"
                  >
                    <span className="text-sm font-bold text-slate-900 group-hover:text-[#A82F19] transition-colors">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#A82F19] shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#A82F19] transition-colors" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2.5 text-sm text-slate-700 leading-relaxed pr-8">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
