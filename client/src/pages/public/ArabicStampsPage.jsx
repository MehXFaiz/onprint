import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stamp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  ChevronDown,
  ArrowLeft,
  FileCheck,
  Building2,
  Phone
} from 'lucide-react'
import Container from '../../components/Container'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { formatArabicStampInquiry, WHATSAPP_PHONE, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'
import { trackWhatsAppClick } from '../../utils/analytics'

const STAMP_TYPES = [
  { id: 'round', name: 'ختم شركة رسمي دائري (Round Company Seal)', badge: 'المعتمد للبنوك والعقود', desc: 'الختم الدائري الرسمي الأساسي لمعاملات البنوك، الغرفة التجارية، وإبرام العقود.' },
  { id: 'rect', name: 'ختم مستطيل للعنوان والترخيص (Rectangular Address Stamp)', badge: 'للفواتير والمعاملات', desc: 'يتضمن اسم الشركة باللغتين العربية والإنجليزية ورقم الرخصة والعنوان والموقع.' },
  { id: 'dater', name: 'ختم التواريخ وأرقام المعاملات (Dater & Numbering Machine)', badge: 'للأرشفة والوارد والمصروف', desc: 'أختام متغيرة التاريخ قابلة للتعديل اليومي مناسبة لأقسام المحاسبة والسكرتارية.' },
  { id: 'pocket', name: 'ختم جيب محمول قابل للطي (Mobile Pocket Stamp)', badge: 'لرجال الأعمال والتنقل', desc: 'هيكل نحيف بحجم الجيب يفتح ويغلق بحركة واحدة، مثالي للمندوبين والمدراء أثناء السفر.' },
  { id: 'trn', name: 'ختم الرقم الضريبي VAT / TRN المعتمد', badge: 'للامتثال الضريبي', desc: 'يتضمن رقم التسجيل الضريبي الرسمي المعتمد من الهيئة الاتحادية للضرائب.' },
]

const CASINGS = [
  { id: 'trodat', name: 'تروادت النمساوية الأصلية (Trodat Printy)', desc: 'الماركة الأولى عالمياً، متانة عالية وتحبير ذاتي يدوم لآلاف الطبعات.' },
  { id: 'colop', name: 'كولوب النمساوية المعتمدة (Colop Printer)', desc: 'آلية ناعمة ونافذة رؤية شفافة لتحديد مكان الختم بدقة تامة.' },
  { id: 'heavy_duty', name: 'هيكل معدني للضغط العالي (Heavy Duty Steel Core)', desc: 'مخصص للمكاتب والمستودعات ذات الكثافة العالية للاستخدام الشاق المستمر.' },
]

const SIZES = ['40 مم دائري (المقاس الرسمي المعتمد)', '45 مم دائري (للشركات الكبرى والمؤسسات)', '47 × 18 مم مستطيل (3 إلى 4 أسطر)', '58 × 22 مم مستطيل (5 إلى 6 أسطر)', 'مقاس مخصص']
const INK_COLORS = ['أزرق رسمي للشركات (Official Blue)', 'أسود كلاسيكي (Black)', 'أحمر للإجراءات المستعجلة (Red)', 'أخضر معتمد (Green)']
const QUANTITIES = ['1 ختم', '2 أختام', '3 أختام', '5 أختام (طقم للشركة وفروعها)']
const LOCATIONS = ['دبي (تسليم سريع خلال 2-4 ساعات)', 'أبوظبي', 'الشارقة', 'عجمان', 'باقي إمارات الدولة']

const ARABIC_STAMP_FAQS = [
  {
    q: 'ما هي المستندات المطلوبة قانونياً لصنع ختم شركة في دبي؟',
    a: 'امتثالاً للقوانين المعمول بها في دولة الإمارات العربية المتحدة لحماية الشركات ومنع التزوير، يشترط تقديم صورة سارية من الرخصة التجارية (Trade License) الصادرة من دائرة الاقتصاد والسياحة بدبي أو أي منطقة حرة معتمدة، بالإضافة إلى صورة الهوية الإماراتية أو جواز السفر للشخص المخول بالتوقيع.',
  },
  {
    q: 'ما الفرق بين الختم الدائري والختم المستطيل في الإمارات؟',
    a: 'الختم الدائري هو الختم الرسمي الأساسي المعترف به لدى البنوك والجهات الحكومية والسفارات والمحاكم، ويوضع عادةً على العقود والاتفاقيات. أما الختم المستطيل فهو ختم إداري تشغيلي يستخدم للفواتير وسندات القبض ومراسلات البريد اليومية ويتضمن بيانات الاتصال والعنوان.',
  },
  {
    q: 'كم يستغرق تجهيز ختم الشركة وهل تتوفر خدمة التوصيل المستعجل؟',
    a: 'نعم، نوفر خدمة تصنيع وتسليم مستعجلة في دبي خلال 2 إلى 4 ساعات للطلبات التي تكتمل مستنداتها ويتم اعتماد بروفاتها مبكراً. كما يتم التوصيل في نفس اليوم لجميع مناطق دبي، والتوصيل في اليوم التالي لباقي إمارات الدولة.',
  },
  {
    q: 'ما هي ماركة آليات الأختام ذاتية التحبير المستخدمة؟',
    a: 'نستخدم حصرياً آليات تروادت (Trodat Printy) وكولوب (Colop) النمساوية الأصلية ذات التحبير الذاتي، وتتميز بقطعة مطاطية محفورة بالليزر عالي الدقة تضمن وضوح أصغر الحروف والشعارات باللغتين العربية والإنجليزية وتتحمل أكثر من 10,000 طبعة نقية.',
  },
  {
    q: 'هل يمكن إعادة تعبئة حبر الختم بعد نفاده؟',
    a: 'نعم بكل تأكيد، تتوفر وسادات حبر بديلة (Ink Pads) أصلية وسهلة الاستبدال دون تلطيخ اليدين، كما تتوفر عبوات حبر سائل مخصصة لإعادة التعبئة متوفرة باللون الأزرق والأسود والأحمر والأخضر.',
  },
]

export default function ArabicStampsPage() {
  const [selectedType, setSelectedType] = useState(STAMP_TYPES[0].name)
  const [selectedCasing, setSelectedCasing] = useState(CASINGS[0].name)
  const [selectedSize, setSelectedSize] = useState(SIZES[0])
  const [selectedInk, setSelectedInk] = useState(INK_COLORS[0])
  const [selectedQuantity, setSelectedQuantity] = useState(QUANTITIES[0])
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])
  const [licenseConfirmed, setLicenseConfirmed] = useState(true)
  const [customNotes, setCustomNotes] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  // Construct dynamic WhatsApp quotation link
  const whatsAppUrl = useMemo(() => {
    const notesText = `${licenseConfirmed ? 'نسخة الرخصة التجارية جاهزة للإرسال' : 'بانتظار تجهيز الرخصة'}${customNotes ? ` — ${customNotes}` : ''}`
    const message = formatArabicStampInquiry({
      stampType: selectedType,
      quantity: selectedQuantity,
      size: selectedSize,
      inkColor: selectedInk,
      casing: selectedCasing,
      deliveryLocation: selectedLocation,
      notes: notesText,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
  }, [selectedType, selectedQuantity, selectedSize, selectedInk, selectedCasing, selectedLocation, licenseConfirmed, customNotes])

  return (
    <div className="bg-[#040A18] text-[#F5F2EB] font-arabic antialiased selection:bg-[#D4AF65] selection:text-[#040A18]" dir="rtl">
      <SEOHead
        title="صناعة وطباعة أختام الشركات في دبي | أختام أوتوماتيكية معتمدة | ONPRINT"
        description="صناع أختام شركات في دبي معتمدة من ONPRINT. أختام ذاتية التحبير دائرية ومستطيلة، أختام تواريخ، وأختام الرقم الضريبي TRN بجودة تروادت الأصلية مع توصيل سريع لكافة الإمارات."
        keywords="طباعة أختام دبي, صناعة أختام دبي, أختام الشركات دبي, أختام ذاتية التحبير دبي, طلب ختم شركة دبي, أختام مخصصة دبي, أسعار الأختام دبي, ختم دائري للشركات الإمارات"
        canonicalUrl="https://www.0nprint.com/ar/stamps"
        faqList={ARABIC_STAMP_FAQS.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#122240] bg-gradient-to-b from-[#020611] via-[#040A18] to-[#040A18]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#081226]/60 blur-3xl" />

        <Container className="relative z-10">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#B0BECE]">
            <Link to="/ar" className="hover:text-[#D4AF65] transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-[#D4AF65] font-bold">أختام الشركات الرسمية دبي</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold text-[#D4AF65]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>صناعة أختام شركات معتمدة ورسمية • القوز، دبي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F2EB] tracking-tight leading-[1.25]">
              صناعة وطباعة أختام الشركات في دبي
            </h1>

            <p className="text-base sm:text-lg text-[#B0BECE] leading-relaxed">
              توفر <strong>ONPRINT</strong> أختام شركات ذاتية التحبير بآليات تروادت Trodat وكولوب Colop النمساوية الأصلية. أختام دائرية معتمدة للبنوك، أختام مستطيلة للمكاتب، وأختام التاريخ والرقم الضريبي مع تسليم فوري في دبي وتوصيل لجميع الإمارات.
            </p>

            {/* Legal Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-100 block mb-0.5">تنبيه قانوني لعملاء الشركات في الإمارات:</strong>
                يشترط لإصدار أي ختم شركة رسمي تقديم صورة سارية من الرخصة التجارية وهوية الشخص المفوض بالتوقيع لحماية مصالح الشركة ومنع أي استخدام غير نظامي.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar/stamps',
                    button_location: 'arabic_stamps_hero_cta',
                    language: 'ar',
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                <span>اطلب ختم الشركة عبر واتساب</span>
              </a>

              <a
                href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#081226] px-5 py-3.5 text-sm font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all"
              >
                <Phone className="h-4 w-4 text-[#D4AF65]" />
                <span>استفسار فوري: {FORMATTED_PHONE}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SPECIFICATION CALCULATOR */}
      <section className="py-16 sm:py-20 border-b border-[#122240]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-3xl border border-[#122240] bg-[#081226]/70 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                  حاسبة طلب الختم الرسمي
                </span>
                <h2 className="text-2xl font-black text-[#F5F2EB] mt-1">
                  حدد نوع الختم والمقاس المطلوب
                </h2>
              </div>

              {/* 1. Stamp Type */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  1. نوع وشكل الختم (Stamp Type):
                </label>
                <div className="space-y-2">
                  {STAMP_TYPES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedType(t.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedType === t.name
                          ? 'border-[#D4AF65] bg-[#040A18] shadow-xs'
                          : 'border-[#122240] bg-[#040A18]/50 hover:border-[#122240]/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F5F2EB]">{t.name}</span>
                          <span className="rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 px-2 py-0.2 text-[10px] text-[#D4AF65] font-semibold">
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#B0BECE]">{t.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedType === t.name ? 'border-[#D4AF65] bg-[#D4AF65]' : 'border-[#122240]'
                      }`}>
                        {selectedType === t.name && <div className="h-1.5 w-1.5 rounded-full bg-[#040A18]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Casing Brand */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  2. ماركة وهيكل الختم (Hardware Brand):
                </label>
                <div className="space-y-2">
                  {CASINGS.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCasing(c.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedCasing === c.name
                          ? 'border-[#D4AF65] bg-[#040A18] shadow-xs'
                          : 'border-[#122240] bg-[#040A18]/50 hover:border-[#122240]/80'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F5F2EB]">{c.name}</div>
                      <p className="text-[11px] text-[#B0BECE] mt-0.5">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Size & Ink Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">3. المقاس:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">4. لون الحبر:</label>
                  <select
                    value={selectedInk}
                    onChange={(e) => setSelectedInk(e.target.value)}
                    className="w-full bg-[#040A18] border border-[#122240] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {INK_COLORS.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Quantity & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">5. عدد الأختام:</label>
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
                  <label className="text-xs font-bold text-[#F5F2EB] block">6. منطقة التوصيل:</label>
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
              </div>

              {/* Legal Confirmation Checkbox */}
              <div className="p-3.5 rounded-2xl bg-[#040A18] border border-[#122240] flex items-center gap-3 cursor-pointer"
                   onClick={() => setLicenseConfirmed(!licenseConfirmed)}>
                <input
                  type="checkbox"
                  checked={licenseConfirmed}
                  onChange={(e) => setLicenseConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#D4AF65] cursor-pointer"
                />
                <span className="text-xs text-[#F5F2EB] font-medium leading-relaxed">
                  أؤكد توفر صورة سارية من الرخصة التجارية للشخص المخول وجاهزيتها للإرسال عبر واتساب للمراجعة.
                </span>
              </div>
            </div>

            {/* Right Column: WhatsApp Preview */}
            <div className="lg:col-span-5 rounded-3xl border border-[#122240] bg-[#040A18] p-6 sm:p-8 space-y-5 sticky top-28">
              <div className="flex items-center gap-2 pb-3 border-b border-[#122240]">
                <WhatsAppIcon className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#F5F2EB]">
                  معاينة طلب الختم عبر واتساب
                </h3>
              </div>

              <div className="rounded-2xl bg-[#020611] border border-[#122240] p-4 text-xs font-mono text-[#F5F2EB] leading-relaxed whitespace-pre-line select-all">
                {`مرحباً ONPRINT، أود الحصول على عرض سعر لختم شركة رسمي.

نوع الختم: ${selectedType}
الكمية: ${selectedQuantity}
المقاس / الشكل: ${selectedSize}
لون الحبر: ${selectedInk}
الماركة: ${selectedCasing}
منطقة التوصيل: ${selectedLocation}
ملاحظات: ${licenseConfirmed ? 'نسخة الرخصة التجارية جاهزة للإرسال' : 'بانتظار تجهيز الرخصة'}

يرجى تزويدي بالسعر وخيارات التنفيذ والتوصيل السريع.`}
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/ar/stamps',
                      button_location: 'arabic_stamps_calculator_submit',
                      product_name: 'arabic_stamps_quote',
                      language: 'ar',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                  <span>إرسال مواصفات الختم لواتساب</span>
                </a>

                <p className="text-[11px] text-center text-[#B0BECE] leading-snug">
                  ✓ سنرسل لك بروفة رقمية مجانية للختم بمقاسه الحقيقي للتأكد من الأسماء واللغات قبل الحفر بالليزر.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. ARABIC FAQS */}
      <section className="py-16 sm:py-20 border-b border-[#122240]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                الأسئلة الشائعة حول أختام الشركات في الإمارات
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                إجابات شاملة لمتطلبات الترخيص والإصدار
              </h2>
            </div>

            <div className="space-y-3">
              {ARABIC_STAMP_FAQS.map((faq, idx) => (
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

      {/* 4. FOOTER CONVERSION */}
      <section className="py-14 bg-[#020611] text-center">
        <Container>
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB]">
              هل تحتاج ختماً مستعجلاً خلال ساعتين في دبي؟
            </h3>
            <p className="text-xs sm:text-sm text-[#B0BECE]">
              تواصل مع فريق الطوارئ الفنية عبر واتساب الآن وأرسل صورة الرخصة، وسنبدأ التجهيز فوراً.
            </p>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3 text-sm font-black text-white shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
              <span>طلب ختم فوري عبر واتساب</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
