import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  FileCheck,
  Palette,
  Layers,
  HelpCircle,
  Phone
} from 'lucide-react'
import Container from '../../components/Container'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { formatArabicBusinessCardInquiry, WHATSAPP_PHONE, RAW_WHATSAPP_NUMBER, FORMATTED_PHONE } from '../../utils/whatsapp'
import { trackWhatsAppClick } from '../../utils/analytics'

const PAPERS = [
  { id: '350gsm', name: 'كوشيه أبيض فاخر 350 جرام', tag: 'الخيار القياسي الممتاز', desc: 'ورق ناعم ومتين يناسب معظم بطاقات العمل الرسمية بتكلفة اقتصادية.' },
  { id: '400gsm', name: 'ورق مقوى مطفي 400 جرام', tag: 'الأكثر طلباً للشركات', desc: 'صلابة وثقل ممتاز يمنح انطباعاً رسمياً ومهنياً راقياً.' },
  { id: '600gsm', name: 'قطني فخم دوبلكس 600-700 جرام', tag: 'الفئة الفاخرة للرؤساء التنفيذيين', desc: 'ورق قطني سميك مزدوج الطبقات يتميز بإمكانية الحفر البارز والفويل الذهبي والحواف الملونة.' },
]

const FINISHES = [
  { id: 'matte', name: 'سلوفان مطفي ناعم (Matte Lamination)', desc: 'ملمس غير لامع ومقاوم للبصمات مع حماية للبطاقة.' },
  { id: 'gold_foil', name: 'بصمة فويل ذهبي 24K بارز (Gold Foil Stamping)', desc: 'لمعان معدني ذهبي فاخر يبرز شعار شركتك بدقة عالية.' },
  { id: 'spot_uv', name: 'ورنيش موضعي لامع بارز (Raised Spot UV)', desc: 'تباين جذاب بين الخلفية المطفية والعناصر اللامعة البارزة.' },
  { id: 'soft_touch', name: 'سلوفان مخملي الملمس (Velvet Soft Touch)', desc: 'ملمس فاخر يشبه المخمل يعطي إحساساً استثنائياً بالرقي.' },
]

const QUANTITIES = ['100 كرت', '250 كرت', '500 كرت', '1,000 كرت', '2,500 كرت']
const SIDES = ['طباعة وجهين ملون (موصى به)', 'طباعة وجه واحد']
const LOCATIONS = ['دبي (توصيل سريع)', 'أبوظبي', 'الشارقة', 'عجمان', 'باقي إمارات الدولة']

const ARABIC_CARD_FAQS = [
  {
    q: 'ما هو المقاس القياسي لطباعة كروت العمل في دبي والإمارات؟',
    a: 'المقاس الأكثر شيوعاً واعتماداً في الإمارات ودول الخليج هو 90 × 50 مم أو المقاس الأوروبي 85 × 55 مم. ننصح بتجهيز ملفات التصميم بإضافة هامش قص (Bleed) بمقدار 2 إلى 3 مم من جميع الجهات لضمان عدم تأثر النصوص عند القص.',
  },
  {
    q: 'ما الفرق بين ورق 350 جرام وورق 600 جرام القطني الفاخر؟',
    a: 'ورق 350 جرام هو الورق القياسي المتين للبطاقات التجارية اليومية. أما ورق 600 جرام فهو ورق قطني سميك (Double Layered) مخصص للبطاقات التنفيذية VIP، ويوفر سماكة ملحوظة تناسب البصمة الذهبية البارزة (3D Foil) والحفر الغائر (Letterpress) والحواف الملونة.',
  },
  {
    q: 'كم يستغرق وقت تنفيذ وطباعة الكروت الشخصية؟',
    a: 'الكروت المطبوعة رقمياً (ورق 350-400 جرام مع سلوفان) يمكن تنفيذها وتسليمها خلال 24 ساعة في دبي. أما الكروت التي تتطلب تشطيبات يدوية دقيقة كالبصمة الذهبية الحرارية (Hot Foil) أو السبوت يو في، فتستغرق عادةً من يومين إلى ثلاثة أيام عمل.',
  },
  {
    q: 'كيف أجهز ملف تصميم كرت العمل للطباعة بجودة احترافية؟',
    a: 'يجب تصدير الملف بصيغة PDF عالية الدقة بنظام ألوان CMYK مع دقة لا تقل عن 300 DPI، وتحويل جميع النصوص والخطوط إلى مسارات ومنحنيات مقفلة (Outlines / Curves)، وإبقاء النصوص الهامة على بعد 4 مم على الأقل من حواف القص.',
  },
  {
    q: 'هل توفرون خدمة مراجعة التصميم أو التعديل عليه قبل الطباعة؟',
    a: 'نعم، يقوم مهندسو ما قبل الطباعة في ONPRINT بمراجعة الملف التقني مجاناً للتأكد من هوامش الأمان ودقة الألوان ومطابقة الفويل الذهبي قبل البدء في دورة الطباعة الفعلية، ونرسل لك بروفة رقمية للموافقة عبر واتساب.',
  },
  {
    q: 'هل يمكن شحن كروت العمل إلى أبوظبي والشارقة وباقي الإمارات؟',
    a: 'نعم، نوفر خدمة التوصيل المباشر عبر مندوبي الشحن السريع إلى أي عنوان مكتبي أو سكني في أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، وأم القيوين.',
  },
]

export default function ArabicBusinessCardsPage() {
  const [selectedPaper, setSelectedPaper] = useState(PAPERS[1].name)
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[1].name)
  const [selectedQuantity, setSelectedQuantity] = useState(QUANTITIES[2])
  const [selectedSide, setSelectedSide] = useState(SIDES[0])
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])
  const [customNotes, setCustomNotes] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  // Construct dynamic WhatsApp quotation link
  const whatsAppUrl = useMemo(() => {
    const message = formatArabicBusinessCardInquiry({
      quantity: selectedQuantity,
      paper: selectedPaper,
      finish: selectedFinish,
      sides: selectedSide,
      deliveryLocation: selectedLocation,
      notes: customNotes,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
  }, [selectedQuantity, selectedPaper, selectedFinish, selectedSide, selectedLocation, customNotes])

  return (
    <div className="bg-[#040A18] text-[#F5F2EB] font-arabic antialiased selection:bg-[#D4AF65] selection:text-[#040A18]" dir="rtl">
      <SEOHead
        title="طباعة كروت شخصية في دبي | بطاقات أعمال فاخرة وفويل ذهبي | ONPRINT"
        description="طباعة كروت شخصية وبطاقات أعمال فاخرة في دبي من ONPRINT. ورق قطني 350-600 جرام، فويل ذهبي وفضي بارز 24K، سبوت يو في، وسلوفان مخملي مع توصيل سريع في دبي والإمارات."
        keywords="طباعة كروت شخصية دبي, طباعة بطاقات أعمال دبي, كروت شخصية فاخرة دبي, كروت شخصية ذهبية دبي, طباعة كروت شخصية مع فويل ذهبي, أسعار طباعة الكروت الشخصية دبي, مطبعة كروت شخصية دبي, كروت شخصية مطفية دبي"
        canonicalUrl="https://www.0nprint.com/ar/business-cards"
        faqList={ARABIC_CARD_FAQS.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#122240] bg-gradient-to-b from-[#020611] via-[#040A18] to-[#040A18]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#081226]/60 blur-3xl" />

        <Container className="relative z-10">
          {/* Breadcrumb Navigation & English Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-xs text-[#B0BECE]">
              <Link to="/ar" className="hover:text-[#D4AF65] transition-colors">الرئيسية</Link>
              <span>/</span>
              <span className="text-[#D4AF65] font-bold">طباعة كروت شخصية دبي</span>
            </nav>
            <Link
              to="/business-card-printing-dubai"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF65]/40 bg-[#D4AF65]/10 px-3.5 py-1.5 text-xs font-bold text-[#D4AF65] hover:bg-[#D4AF65]/20 hover:border-[#D4AF65] transition-all"
              title="Switch to English: Business Card Printing Dubai"
            >
              <span>🇬🇧 English Version</span>
            </Link>
          </div>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold text-[#D4AF65]">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>مطبعة كروت أعمال فاخرة في القوز، دبي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F2EB] tracking-tight leading-[1.25]">
              طباعة كروت شخصية وبطاقات أعمال فاخرة في دبي
            </h1>

            <p className="text-base sm:text-lg text-[#B0BECE] leading-relaxed">
              تقدم <strong>ONPRINT</strong> حلول طباعة كروت شخصية للشركات والمحترفين في دبي. استكشف خيارات الورق والتشطيبات المتاحة واطلب عرض سعر يناسب احتياجاتك بدقة ألمانية وتوصيل مباشر لجميع الإمارات.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar/business-cards',
                    button_location: 'arabic_cards_hero_cta',
                    language: 'ar',
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                <span>اطلب عرض سعر عبر واتساب</span>
              </a>

              <a
                href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#081226] px-5 py-3.5 text-sm font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all"
              >
                <Phone className="h-4 w-4 text-[#D4AF65]" />
                <span>استشارة فنية: {FORMATTED_PHONE}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. INTERACTIVE SPECIFICATION CALCULATOR FOR WHATSAPP */}
      <section className="py-16 sm:py-20 border-b border-[#122240]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 rounded-3xl border border-[#122240] bg-[#081226]/70 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                  حاسبة مواصفات الكروت الشخصية
                </span>
                <h2 className="text-2xl font-black text-[#F5F2EB] mt-1">
                  حدد خياراتك واحصل على تسعير فوري
                </h2>
                <p className="text-xs text-[#B0BECE] mt-1">
                  اختر وزن الورق والتشطيب المطلوب لتوليد رسالة استفسار دقيقة ترسل مباشرة لمهندسي الطباعة.
                </p>
              </div>

              {/* 1. Paper Type Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  1. نوع وسماكة الورق (Paper Stock):
                </label>
                <div className="space-y-2">
                  {PAPERS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPaper(p.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedPaper === p.name
                          ? 'border-[#D4AF65] bg-[#040A18] shadow-xs'
                          : 'border-[#122240] bg-[#040A18]/50 hover:border-[#122240]/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F5F2EB]">{p.name}</span>
                          <span className="rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 px-2 py-0.2 text-[10px] text-[#D4AF65] font-semibold">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#B0BECE]">{p.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPaper === p.name ? 'border-[#D4AF65] bg-[#D4AF65]' : 'border-[#122240]'
                      }`}>
                        {selectedPaper === p.name && <div className="h-1.5 w-1.5 rounded-full bg-[#040A18]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Finish Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  2. نوع التشطيب الفاخر (Finishing):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FINISHES.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFinish(f.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedFinish === f.name
                          ? 'border-[#D4AF65] bg-[#040A18] shadow-xs'
                          : 'border-[#122240] bg-[#040A18]/50 hover:border-[#122240]/80'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F5F2EB]">{f.name}</div>
                      <p className="text-[10px] text-[#B0BECE] mt-1 leading-snug">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Quantity & Sides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">3. الكمية المطلوبة:</label>
                  <select
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {QUANTITIES.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">4. أوجه الطباعة:</label>
                  <select
                    value={selectedSide}
                    onChange={(e) => setSelectedSide(e.target.value)}
                    className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {SIDES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Delivery Area & Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F5F2EB] block">5. إمارة أو منطقة التوصيل:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F5F2EB] block">ملاحظات إضافية (اختياري):</label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="مثال: التصميم جاهز للطباعة / نحتاج مساعدة في التصميم..."
                  className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE]/50 focus:outline-none focus:border-[#D4AF65]"
                />
              </div>
            </div>

            {/* Right Column: Real-Time WhatsApp Message Preview */}
            <div className="lg:col-span-5 rounded-3xl border border-[#122240] bg-[#040A18] p-6 sm:p-8 space-y-5 sticky top-28">
              <div className="flex items-center gap-2 pb-3 border-b border-[#122240]">
                <WhatsAppIcon className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#F5F2EB]">
                  معاينة رسالة الاستفسار لواتساب
                </h3>
              </div>

              <div className="rounded-2xl bg-[#020611] border border-[#122240] p-4 text-xs font-mono text-[#F5F2EB] leading-relaxed whitespace-pre-line select-all">
                {`مرحباً ONPRINT، أود الحصول على عرض سعر لطباعة كروت شخصية.

الكمية: ${selectedQuantity}
نوع الورق: ${selectedPaper}
التشطيب: ${selectedFinish}
طباعة وجه واحد أو وجهين: ${selectedSide}
منطقة التوصيل: ${selectedLocation}
متطلبات إضافية: ${customNotes || 'لا يوجد'}

يرجى تزويدي بالسعر والخيارات المتاحة ومدة التنفيذ المتوقعة.`}
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/ar/business-cards',
                      button_location: 'arabic_cards_calculator_submit',
                      product_name: 'arabic_business_cards_quote',
                      language: 'ar',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                  <span>إرسال المواصفات إلى واتساب الآن</span>
                </a>

                <p className="text-[11px] text-center text-[#B0BECE] leading-snug">
                  ✓ لا نرسل الرسالة تلقائياً؛ يمكنك مراجعة النص وتعديله قبل الإرسال داخل تطبيق واتساب.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. TECHNICAL ARTWORK SPECIFICATIONS */}
      <section className="py-16 sm:py-20 border-b border-[#122240] bg-[#020611]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                المعايير الفنية للطباعة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                كيفية تجهيز ملفات كروت العمل للطباعة
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240] space-y-2">
                <FileCheck className="h-5 w-5 text-[#D4AF65]" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">ألوان CMYK بدقة 300 DPI</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  احرص على ضبط صيغة الألوان إلى CMYK بدلاً من RGB لضمان تطابق الألوان المطبوعة مع الشاشة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240] space-y-2">
                <Layers className="h-5 w-5 text-[#D4AF65]" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">هوامش القص (Bleed 3mm)</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  أضف 3 مم من كل جانب وامدد الخلفية الملونة حتى حدود القص لتجنب أي حواف بيضاء غير مرغوبة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240] space-y-2">
                <Palette className="h-5 w-5 text-[#D4AF65]" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">تحويل الخطوط Outlines</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  قم بتحويل جميع الخطوط والنصوص في برنامج Illustrator أو InDesign إلى منحنيات مقفلة.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. ARABIC FAQS */}
      <section className="py-16 sm:py-20 border-b border-[#122240]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                الأسئلة المتكررة حول كروت العمل
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                كل ما تحتاج لمعرفته قبل الطلب
              </h2>
            </div>

            <div className="space-y-3">
              {ARABIC_CARD_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#122240] bg-[#081226]/70 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-3 text-sm font-bold text-[#F5F2EB] hover:text-[#D4AF65] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#D4AF65] shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[#B0BECE] leading-relaxed border-t border-[#122240]/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. FOOTER CONVERSION BAR */}
      <section className="py-14 bg-[#020611] text-center">
        <Container>
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB]">
              هل ترغب في فحص ملف التصميم مجاناً؟
            </h3>
            <p className="text-xs sm:text-sm text-[#B0BECE]">
              أرسل ملف الكرت (PDF / AI) عبر واتساب وسيتولى مهندس الطباعة فحصه والتأكد من ملاءمته للإنتاج.
            </p>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3 text-sm font-black text-white shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
              <span>محادثة واتساب مباشرة مع مهندس الطباعة</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
