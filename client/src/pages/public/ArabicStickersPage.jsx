import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag,
  Sparkles,
  Droplets,
  Scissors,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  FileCheck,
  Phone,
  Layers
} from 'lucide-react'
import Container from '../../components/Container'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { formatArabicStickerInquiry, WHATSAPP_PHONE, RAW_WHATSAPP_NUMBER, FORMATTED_PHONE } from '../../utils/whatsapp'
import { trackWhatsAppClick } from '../../utils/analytics'

const STICKER_TYPES = [
  { id: 'product', name: 'طباعة ملصقات منتجات دبي (Product & Packaging Labels)', desc: 'مثالية للبرطمانات، قوارير الزيوت والعطور، وعلب الأغذية والمشروبات.' },
  { id: 'die_cut', name: 'استيكرات دبي مقصوصة حسب الشكل (Custom Die-Cut Stickers)', desc: 'قص ليزر دقيق يتبع حدود شعارك الترويجي بدقة متناهية.' },
  { id: 'clear', name: 'طباعة استيكرات شفافة دبي (Clear Transparent Labels)', desc: 'خلفية شفافة تماماً تظهر لون المنتج أو الزجاج مع طباعة عالية التباين.' },
  { id: 'barcode', name: 'طباعة ملصقات باركود دبي (Barcode & QR Code Labels)', desc: 'ملصقات مخصصة لتتبع المخزون والترميز والباركود للمتاجر والمستودعات.' },
  { id: 'roll', name: 'ملصقات رول للتغليف الآلي (Roll Labels)', desc: 'ملصقات ملفوفة على بكرات جاهزة لخطوط التعبئة والتغليف السريعة.' },
]

const MATERIALS = [
  { id: 'vinyl_bopp', name: 'استيكرات فينيل دبي BOPP أبيض مقاوم للماء', badge: 'الأكثر متانة', desc: 'مقاوم للماء، الرطوبة، التبريد، والتمزق بدرجة فائقة.' },
  { id: 'waterproof_vinyl', name: 'استيكرات مقاومة للماء دبي (Waterproof Vinyl)', badge: 'ضد الرطوبة والزيوت', desc: 'مثالية للزجاجات والمبردات والمنتجات الاستهلاكية.' },
  { id: 'clear_vinyl', name: 'طباعة استيكرات شفافة دبي (Clear Vinyl)', badge: 'مظهر زجاجي عصري', desc: 'مناسب للزجاجات والعبوات الشفافة ومقاوم للسوائل.' },
  { id: 'gold_foil', name: 'ورق معدني فويل ذهبي / فضي (Metallic Foil)', badge: 'فاخر للعطور', desc: 'لمعان ذهبي أو فضي يضفي فخامة استثنائية على المنتجات.' },
  { id: 'kraft', name: 'ورق كرافت بني بيئي (Kraft Paper)', badge: 'طبيعي وبيئي', desc: 'خامة ورقية صديقة للبيئة تناسب المنتجات الطبيعية والعضوية.' },
]

const SIZES = ['3 × 3 سم (دائري أو مربع)', '5 × 5 سم (القياسي للمنتجات)', '7 × 7 سم', '10 × 10 سم (للعلب الكبيرة)', 'مقاس مخصص']
const QUANTITIES = ['250 ملصق', '500 ملصق', '1,000 ملصق', '2,500 ملصق', '5,000 ملصق']
const FINISHES = ['قص ليزر فردي حسب الشكل (Individual Die-Cut)', 'شيتات ورقية (Kiss-Cut Sheets)', 'رول جاهز للماكينات (Rolls)']
const LOCATIONS = ['دبي (توصيل سريع)', 'أبوظبي', 'الشارقة', 'عجمان', 'باقي إمارات الدولة']

const ARABIC_STICKER_FAQS = [
  {
    q: 'هل الستيكرات المطبوعة مقاومة للماء والرطوبة وثلاجات التبريد؟',
    a: 'نعم، نستخدم خامات الفينيل BOPP المقاومة للماء والزيوت وسوائل التنظيف، مع طبقة حماية سلوفان (Lamination) عازلة، مما يجعلها مثالية لمنتجات التجميل، زجاجات المياه والعصير، والأغذية التي تحفظ في الثلاجات أو المبردات.',
  },
  {
    q: 'ما هو الفرق بين قص الديكت (Die-Cut) وشيتات الكسكت (Kiss-Cut)؟',
    a: 'القص المخصص (Die-Cut) يتم فيه قص الستيكر مع الورقة الخلفية بدقة تتبع حدود الشعار ليصبح كل ستيكر قطعة منفصلة وجاهزة للتوزيع الترويجي. أما شيتات الكسكت (Kiss-Cut) فتكون مجموعة ستيكرات مقصوصة نصف قص على صفحة واحدة يسهل نزعها يدوياً بسرعة أثناء التغليف.',
  },
  {
    q: 'ما هو أقل عدد يمكن طلبه لطباعة الملصقات المخصصة؟',
    a: 'نظراً لاعتمادنا على أحدث ماكينات الطباعة الرقمية والقص بالليزر، نبدأ بتلبية الطلبات بكميات مرنة تبدأ من 100 إلى 250 ملصق، مع توفير أسعار جملة تنافسية للغاية للكميات الكبيرة من 1,000 وحتى 50,000 ملصق.',
  },
  {
    q: 'هل يمكن طباعة ستيكرات شفافة مع حبر أبيض تحت الألوان؟',
    a: 'نعم، تتوفر لدينا تقنية الطباعة بطبقة حبر أبيض أساسية (White Ink Underprint) على الفينيل الشفاف، مما يمنع شفافية الألوان ويجعل النصوص والشعار بارزة وواضحة جداً عند وضعها على عبوات داكنة أو ملونة.',
  },
  {
    q: 'كم يستغرق تجهيز وشحن طلبات الستيكرات والملصقات في دبي؟',
    a: 'تستغرق دورة إنتاج الستيكرات المقصوصة بالليزر من 24 إلى 48 ساعة من تاريخ اعتماد البروفة الرقمية، ويتم شحنها مباشرة عبر مناديب الشحن لجميع مناطق دبي والإمارات.',
  },
]

export default function ArabicStickersPage() {
  const [selectedType, setSelectedType] = useState(STICKER_TYPES[0].name)
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0].name)
  const [selectedSize, setSelectedSize] = useState(SIZES[1])
  const [selectedQuantity, setSelectedQuantity] = useState(QUANTITIES[2])
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0])
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])
  const [customNotes, setCustomNotes] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  // Construct dynamic WhatsApp quotation link
  const whatsAppUrl = useMemo(() => {
    const message = formatArabicStickerInquiry({
      stickerType: selectedType,
      quantity: selectedQuantity,
      size: selectedSize,
      material: selectedMaterial,
      finish: selectedFinish,
      deliveryLocation: selectedLocation,
      notes: customNotes,
    })
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
  }, [selectedType, selectedQuantity, selectedSize, selectedMaterial, selectedFinish, selectedLocation, customNotes])

  return (
    <div className="bg-[#101D35] text-[#F5F2EB] font-arabic antialiased selection:bg-[#D4AF65] selection:text-[#101D35]" dir="rtl">
      <SEOHead
        title="طباعة استيكرات دبي | طباعة ملصقات مخصصة وفينيل ضد الماء | ONPRINT"
        description="خدمات طباعة استيكرات دبي وملصقات منتجات مخصصة من ONPRINT. استيكرات فينيل مقاومة للماء، ملصقات باركود، استيكرات شفافة، وقص ليزر ديكت مع شحن سريع لكافة الإمارات."
        keywords="طباعة استيكرات دبي, طباعة ملصقات دبي, استيكرات دبي, طباعة ملصقات منتجات دبي, استيكرات فينيل دبي, طباعة ستيكرات لاصقة دبي, استيكرات مقاومة للماء دبي, طباعة ملصقات باركود دبي, ملصقات مخصصة دبي, طباعة استيكرات شفافة دبي"
        canonicalUrl="https://www.0nprint.com/ar/sticker-printing-dubai"
        faqList={ARABIC_STICKER_FAQS.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#203357] bg-gradient-to-b from-[#0C1629] via-[#101D35] to-[#101D35]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#172644]/60 blur-3xl" />

        <Container className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <nav className="flex items-center gap-2 text-xs text-[#B0BECE]">
              <Link to="/ar" className="hover:text-[#D4AF65] transition-colors">الرئيسية</Link>
              <span>/</span>
              <span className="text-[#D4AF65] font-bold">طباعة استيكرات وملصقات دبي</span>
            </nav>
            <Link
              to="/sticker-printing-dubai"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF65]/40 bg-[#D4AF65]/10 px-3.5 py-1.5 text-xs font-bold text-[#D4AF65] hover:bg-[#D4AF65]/20 hover:border-[#D4AF65] transition-all"
              title="Switch to English: Custom Sticker Printing Dubai"
            >
              <span>🇬🇧 English Version</span>
            </Link>
          </div>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold text-[#D4AF65]">
              <Tag className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>مطبعة متخصصة في طباعة استيكرات وملصقات منتجات في القوز، دبي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F2EB] tracking-tight leading-[1.25]">
              طباعة استيكرات دبي — ملصقات مخصصة وفينيل مقاوم للماء
            </h1>

            <p className="text-base sm:text-lg text-[#B0BECE] leading-relaxed">
              نوفر في <strong>ONPRINT</strong> حلولاً متكاملة لـ <strong>طباعة ملصقات دبي</strong> و<strong>استيكرات دبي</strong> بجودة احترافية تشمل <strong>طباعة ملصقات منتجات دبي</strong>، <strong>استيكرات فينيل دبي</strong> المقاومة للعوامل الجوية، <strong>طباعة ستيكرات لاصقة دبي</strong> مع قص ليزر، <strong>استيكرات مقاومة للماء دبي</strong>، <strong>طباعة ملصقات باركود دبي</strong> و<strong>طباعة استيكرات شفافة دبي</strong> مع شحن سريع إلى دبي، أبوظبي وجميع الإمارات.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar/sticker-printing-dubai',
                    button_location: 'arabic_stickers_hero_cta',
                    language: 'ar',
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                <span>اطلب طباعة استيكرات وملصقات عبر واتساب</span>
              </a>

              <a
                href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#203357] bg-[#172644] px-5 py-3.5 text-sm font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all"
              >
                <Phone className="h-4 w-4 text-[#D4AF65]" />
                <span>استشارة فنية: {FORMATTED_PHONE}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SPECIFICATION CALCULATOR */}
      <section className="py-16 sm:py-20 border-b border-[#203357]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-3xl border border-[#203357] bg-[#172644]/70 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                  حاسبة مواصفات الملصقات والستيكرات
                </span>
                <h2 className="text-2xl font-black text-[#F5F2EB] mt-1">
                  اختر مواصفات الملصق لطلب تسعير مباشر
                </h2>
              </div>

              {/* 1. Sticker Purpose */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  1. نوع واستخدام الملصق (Application):
                </label>
                <div className="space-y-2">
                  {STICKER_TYPES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedType(t.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedType === t.name
                          ? 'border-[#D4AF65] bg-[#101D35] shadow-xs'
                          : 'border-[#203357] bg-[#101D35]/50 hover:border-[#203357]/80'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F5F2EB]">{t.name}</div>
                      <p className="text-[11px] text-[#B0BECE] mt-0.5">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Material */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#F5F2EB] block">
                  2. خامة الملصق ومقاومته (Material):
                </label>
                <div className="space-y-2">
                  {MATERIALS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMaterial(m.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selectedMaterial === m.name
                          ? 'border-[#D4AF65] bg-[#101D35] shadow-xs'
                          : 'border-[#203357] bg-[#101D35]/50 hover:border-[#203357]/80'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F5F2EB]">{m.name}</span>
                          <span className="rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 px-2 py-0.2 text-[10px] text-[#D4AF65] font-semibold">
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#B0BECE]">{m.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedMaterial === m.name ? 'border-[#D4AF65] bg-[#D4AF65]' : 'border-[#203357]'
                      }`}>
                        {selectedMaterial === m.name && <div className="h-1.5 w-1.5 rounded-full bg-[#101D35]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Size, Quantity & Finish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">3. المقاس التقديري:</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-[#101D35] border border-[#203357] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#F5F2EB] block">4. الكمية المطلوبة:</label>
                  <select
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="w-full bg-[#101D35] border border-[#203357] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                  >
                    {QUANTITIES.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Finish / Cut */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F5F2EB] block">5. طريقة التجهيز والقص:</label>
                <select
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full bg-[#101D35] border border-[#203357] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
                >
                  {FINISHES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* 5. Delivery Location & Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F5F2EB] block">6. إمارة أو منطقة التوصيل:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#101D35] border border-[#203357] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#D4AF65]"
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
                  placeholder="مثال: يرجى التحقق من أبعاد القارورة / طلب عينات سابقة..."
                  className="w-full bg-[#101D35] border border-[#203357] rounded-xl px-3 py-2 text-xs text-[#F5F2EB] placeholder:text-[#B0BECE]/50 focus:outline-none focus:border-[#D4AF65]"
                />
              </div>
            </div>

            {/* Right Column: WhatsApp Message Preview */}
            <div className="lg:col-span-5 rounded-3xl border border-[#203357] bg-[#101D35] p-6 sm:p-8 space-y-5 sticky top-28">
              <div className="flex items-center gap-2 pb-3 border-b border-[#203357]">
                <WhatsAppIcon className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#F5F2EB]">
                  معاينة رسالة استفسار الملصقات
                </h3>
              </div>

              <div className="rounded-2xl bg-[#0C1629] border border-[#203357] p-4 text-xs font-mono text-[#F5F2EB] leading-relaxed whitespace-pre-line select-all">
                {`مرحباً ONPRINT، أود الحصول على عرض سعر لطباعة الملصقات.

نوع الملصقات: ${selectedType}
الكمية: ${selectedQuantity}
المقاس: ${selectedSize}
الخامة: ${selectedMaterial}
الشكل والتشطيب: ${selectedFinish}
منطقة التوصيل: ${selectedLocation}
متطلبات إضافية: ${customNotes || 'لا يوجد'}

يرجى إرسال السعر والخيارات المتاحة ومدة التنفيذ المتوقعة.`}
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source_page: '/ar/sticker-printing-dubai',
                      button_location: 'arabic_stickers_calculator_submit',
                      product_name: 'arabic_stickers_quote',
                      language: 'ar',
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                  <span>إرسال مواصفات الملصقات لواتساب</span>
                </a>

                <p className="text-[11px] text-center text-[#B0BECE] leading-snug">
                  ✓ نوفر خدمة فحص ملفات الشعار والتأكد من خطوط القص (Cut Lines) قبل الطباعة مجاناً.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. MATERIAL RESISTANCE MATRIX */}
      <section className="py-16 sm:py-20 border-b border-[#203357] bg-[#0C1629]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                مواصفات المقاومة والمناخ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                مصممة لتحمل حرارة ورطوبة الإمارات
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#101D35] border border-[#203357] space-y-2">
                <Droplets className="h-5 w-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">مقاومة تامة للماء والزيوت</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  أحبار أوفست ورقمية ثابتة مع طبقة حماية عازلة لا تتأثر بالماء أو التكثيف داخل المبردات.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101D35] border border-[#203357] space-y-2">
                <Scissors className="h-5 w-5 text-[#D4AF65]" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">قص ليزر رقمي عالي الدقة</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  قص دقيق لأعقد الأشكال والمنحنيات دون ترك أي حواف خشنة أو فراغات غير متطابقة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#101D35] border border-[#203357] space-y-2">
                <Sparkles className="h-5 w-5 text-[#D4AF65]" />
                <h4 className="font-bold text-sm text-[#F5F2EB]">لاصق قوي لا يترك أثراً</h4>
                <p className="text-xs text-[#B0BECE] leading-relaxed">
                  غراء صناعي عالي الالتصاق يثبت بقوة على الزجاج والبلاستيك والكرتون والمعدن.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. ARABIC FAQS */}
      <section className="py-16 sm:py-20 border-b border-[#203357]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                الأسئلة المتكررة حول الملصقات والستيكرات
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                إجابات هامة لأصحاب المنتجات والمتاجر
              </h2>
            </div>

            <div className="space-y-3">
              {ARABIC_STICKER_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#203357] bg-[#172644]/70 overflow-hidden"
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
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[#B0BECE] leading-relaxed border-t border-[#203357]/60">
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

      {/* 5. FOOTER CONVERSION */}
      <section className="py-14 bg-[#0C1629] text-center">
        <Container>
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB]">
              هل لديك استفسار حول مقاس عبوتك أو الخامات المناسبة؟
            </h3>
            <p className="text-xs sm:text-sm text-[#B0BECE]">
              تواصل مع خبير طباعة التغليف عبر واتساب الآن للحصول على التوجيه الفني وعرض سعر مخصص لمنتجك.
            </p>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3 text-sm font-black text-white shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
              <span>محادثة واتساب سريعة</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
