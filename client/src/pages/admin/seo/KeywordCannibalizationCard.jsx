import { AlertTriangle, ArrowRight, Link2, ShieldCheck, Edit3 } from 'lucide-react'
import Button from '../../../components/Button'

export default function KeywordCannibalizationCard({ reports = [], onEditPage }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#F5F3EE]">
              Zero Keyword Cannibalization Detected
            </h3>
            <p className="text-xs text-[#B8C2D9] mt-0.5">
              All indexable pages target distinct primary focus keywords without internal ranking competition.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Clean Architecture
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#F5F3EE]">
              Keyword Cannibalization Detected ({reports.length} Conflict{reports.length > 1 ? 's' : ''})
            </h3>
            <p className="text-xs text-[#B8C2D9] mt-0.5">
              Multiple pages are competing in Google SERPs for identical primary queries, splitting internal page authority.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((item, idx) => (
          <div key={idx} className="bg-[#14213D] rounded-xl border border-amber-200/80 p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2C4F] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#B8C2D9]/70 font-bold uppercase">Shared Keyword:</span>
                <span className="rounded-md bg-[#D6C29A]/10 text-[#D6C29A] px-2.5 py-0.5 text-xs font-black">
                  &quot;{item.keyword}&quot;
                </span>
              </div>
              <span className="text-[11px] text-[#B8C2D9]">
                {item.count} competing pages
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Primary Recommended Page */}
              <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    Primary Target (Keep Focus)
                  </span>
                  <button
                    onClick={() => onEditPage && onEditPage(item.primaryPage)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="font-bold text-[#F5F3EE]">{item.primaryPage?.meta_title || item.primaryPage?.url}</div>
                <div className="font-mono text-[11px] text-[#B8C2D9]">{item.primaryPage?.url}</div>
              </div>

              {/* Secondary Pages */}
              <div className="rounded-lg bg-red-50/60 border border-red-200 p-3 space-y-2">
                <span className="text-[10px] font-black uppercase text-red-800 tracking-wider block">
                  Secondary Competing Pages (Differentiate or Canonize)
                </span>
                {item.secondaryPages?.map((sec, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between border-t border-red-100 pt-1.5 first:border-0 first:pt-0">
                    <div className="truncate max-w-[240px]">
                      <div className="font-bold text-[#F5F3EE] truncate">{sec.meta_title || sec.url}</div>
                      <div className="font-mono text-[11px] text-[#B8C2D9] truncate">{sec.url}</div>
                    </div>
                    <button
                      onClick={() => onEditPage && onEditPage(sec)}
                      className="text-[11px] font-bold text-[#D6C29A] hover:underline flex items-center gap-1 shrink-0 cursor-pointer ml-2"
                    >
                      <Edit3 className="h-3 w-3" /> Fix
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Strategy Guidance */}
            <div className="rounded-lg bg-[#0B132B] p-2.5 text-[11px] text-[#B8C2D9] flex items-start gap-2">
              <Link2 className="h-3.5 w-3.5 text-[#D6C29A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#F5F3EE] font-bold">Recommended Resolution: </strong>
                {item.recommendation ||
                  `Point internal anchor text for "${item.keyword}" to ${item.primaryPage?.url}. Differentiate secondary pages with longer-tail secondary keywords.`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
