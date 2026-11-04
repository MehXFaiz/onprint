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
    <div className="space-y-8 text-[#352719]">
      {/* What Is Section - Critical for AI Understanding */}
      {whatIs && (
        <div className="rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-6 sm:p-8 shadow-xs">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#795C43]/10 border border-[#C5A989]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#795C43]">
            <Info className="h-3.5 w-3.5" />
            <span>Definition</span>
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#352719] mb-4">
            {whatIs.title}
          </h2>
          
          <div className="space-y-4">
            <p className="text-base sm:text-lg font-medium text-[#352719] leading-relaxed">
              {whatIs.definition}
            </p>
            
            {whatIs.expanded && (
              <p className="text-sm sm:text-base text-[#756657] leading-relaxed">
                {whatIs.expanded}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key Information Box - Structured Data for AI */}
      {keyInfo && (
        <div className="rounded-2xl border border-[#DED2C1] bg-[#F5F0E7] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-[#352719] mb-4">Key Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyInfo.cost && (
              <div className="rounded-xl border border-[#DED2C1] bg-[#FAF8F3] p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#795C43] mb-1">
                  Typical Cost
                </div>
                <p className="text-sm font-semibold text-[#352719]">{keyInfo.cost}</p>
              </div>
            )}
            
            {keyInfo.turnaround && (
              <div className="rounded-xl border border-[#DED2C1] bg-[#FAF8F3] p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#795C43] mb-1">
                  Turnaround Time
                </div>
                <p className="text-sm font-semibold text-[#352719]">{keyInfo.turnaround}</p>
              </div>
            )}
            
            {keyInfo.minimumOrder && (
              <div className="rounded-xl border border-[#DED2C1] bg-[#FAF8F3] p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#795C43] mb-1">
                  Minimum Order
                </div>
                <p className="text-sm font-semibold text-[#352719]">{keyInfo.minimumOrder}</p>
              </div>
            )}
            
            {keyInfo.materials && (
              <div className="rounded-xl border border-[#DED2C1] bg-[#FAF8F3] p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#795C43] mb-1">
                  Materials Available
                </div>
                <p className="text-sm font-semibold text-[#352719]">{keyInfo.materials}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Who Needs This Section */}
      {whoNeedsThis && (
        <div className="rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-[#352719] mb-4">{whoNeedsThis.title}</h3>
          
          <ul className="space-y-2">
            {whoNeedsThis.audiences.map((audience, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#756657]">
                <CheckCircle2 className="h-4 w-4 text-[#795C43] shrink-0 mt-0.5" />
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
            <div className="rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#795C43] mb-3">Advantages</h3>
              <ul className="space-y-2">
                {advantages.map((advantage, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#756657]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {bestFor && (
            <div className="rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#795C43] mb-3">Best For</h3>
              <ul className="space-y-2">
                {bestFor.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#756657]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#795C43] shrink-0 mt-0.5" />
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
        <div className="rounded-2xl border border-[#DED2C1] bg-[#FAF8F3] p-6 sm:p-8 shadow-xs">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#795C43]/10 border border-[#C5A989]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#795C43]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          
          <h3 className="text-lg font-bold text-[#352719] mb-4">Common Questions</h3>
          
          <div className="divide-y divide-[#DED2C1]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              
              return (
                <div key={idx} className="py-4 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-start justify-between text-left gap-4 group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#352719] group-hover:text-[#795C43] transition-colors">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#795C43] shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#756657] shrink-0 mt-0.5 group-hover:text-[#795C43] transition-colors" />
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
                        <p className="mt-2.5 text-sm text-[#756657] leading-relaxed pr-8">
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
