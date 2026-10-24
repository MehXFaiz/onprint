import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Sparkles,
  FileText,
  CreditCard,
  Tag,
  Stamp,
  Megaphone,
  Truck,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Phone
} from 'lucide-react'
import Container from '../../components/Container'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { getArabicWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'
import { trackWhatsAppClick } from '../../utils/analytics'

const SERVICES = [
  {
    id: 'flyers',
    title: 'طباعة فلايرات ومنشورات إعلانية (Flyers & Leaflets)',
    badge: 'ترويج وتوزيع',
    desc: 'طباعة فلايرات بمقاسات A4 و A5 و A6 على ورق كوشيه لامع أو مطفي (130-170 جرام) بتكلفة اقتصادية تناسب التوزيع الواسع في المعارض والفعاليات.',
    features: ['ورق كوشيه 130-250 GSM', 'أوفست للكميات الكبيرة', 'تسليم خلال 24-48 ساعة'],
  },
  {
    id: 'brochures',
    title: 'طباعة بروشورات وكتالوجات الشركات (Brochures & Catalogs)',
    badge: 'تسويق احترافي',
    desc: 'بروشورات مطوية ثنائية وثلاثية (Bi-fold / Tri-fold / Gate-fold) وكتالوجات تعريفية بأحدث تقنيات التجليد والتدبيس أو السلك اللولبي.',
    features: ['طي هندسي دقيق', 'سلوفان مطفي أو لامع', 'كتالوجات بأحجام مخصصة'],
  },
  {
    id: 'banners',
    title: 'رول اب بانر وشاشات العرض (Roll-Up Banners & Stands)',
    badge: 'معارض وفعاليات',
    desc: 'ستاندات رول اب سحب أوتوماتيكية مقاس 85×200 سم و 120×200 سم مطبوعة بخامة PP Film غير قابلة للتمزق مع قاعدة ألمنيوم وحقيبة حمل مبطنة.',
    features: ['خامة PP Film ضد التموج', 'قاعدة ألمنيوم ثقيلة', 'تجهيز خلال 24 ساعة للمعارض'],
  },
  {
    id: 'stationery',
    title: 'مطبوعات الهوية المؤسسية (Corporate Stationery)',
    badge: 'مكتبية رسمية',
    desc: 'أوراق مراسلات رسمية (Letterheads 100-120 GSM)، أظرف بريدية بكافة المقاسات (DL, C5, C4)، وفولدرات تقديم العقود (Presentation Folders) بجيوب مخصصة.',
    features: ['ورق ليزر متوافق مع الطابعات', 'أظرف مع شريط لاصق ذاتي', 'فولدرات مع فتحات بطاقات العمل'],
  },
  {
    id: 'gifts',
    title: 'هدايا الشركات والملابس المطبوعة (Corporate Merchandise)',
    badge: 'هدايا وبطاقات',
    desc: 'مطارات مياه حرارية منقوشة بالليزر، أكواب سيراميك ملونة، دفاتر ملاحظات جلدية فخمة، وبطاقات بلاستيكية للموظفين مع شرائط تعليق مخصصة.',
    features: ['نقش ليزر UV عالي الدقة', 'هدايا ترحيبية للموظفين الجدد', 'مجموعات مخصصة للشركات'],
  },
]

const ARABIC_SERVICES_FAQS = [
  {
    q: 'ما هي مواعيد وطاقة التسليم لطلبات الطباعة التجارية الكبيرة في دبي؟',
    a: 'بفضل خطوط الإنتاج المتطورة لماكينات الأوفست هايدلبرغ وماكينات HP Indigo الرقمية، نستطيع إنتاج من 1,000 إلى 50,000 فلاير أو بروشور خلال يومين إلى أربعة أيام عمل، مع خدمة تسليم مجدولة لكافة فروع شركتك في الإمارات.',
  },
  {
    q: 'هل توفرون عينات ورقية swatches وفحص الألوان قبل طباعة الكميات؟',
    a: 'نعم بالتأكيد، نوفر لعملاء الشركات إمكانية فحص بروفة ألوان رقمية معتمدة (Digital Hard Proof) أو الاطلاع على كتالوج عينات الورق والتشطيبات الفاخرة للتأكد من مطابقة ألوان Pantone للشعار المؤسسي قبل بدء الدورة الطباعية الكاملة.',
  },
  {
    q: 'ما هو مقاس الرول اب بانر الأكثر ملاءمة للمعارض والمؤتمرات؟',
    a: 'المقاس القياسي الأكثر استخداماً وطلباً في معارض دبي (مثل DWTC ومؤتمرات الفنادق) هو مقاس 85 × 200 سم، كما يتوفر مقاس 100 × 200 سم ومقاس 120 × 200 سم، ويأتي الستاند مجهزاً بقاعدة ألمنيوم متينة وعصا تثبيت وحقيبة قماشية لسهولة النقل.',
  },
  {
    q: 'كيف يمكن لشركتنا فتح حساب تجاري أو طلب عرض سعر رسمي (RFQ)؟',
    a: 'يمكنكم إرسال متطلبات المناقصة أو جدول الكميات والمواصفات عبر البريد الإلكتروني الرسمي 0nprint183@gmail.com أو التواصل المباشر عبر واتساب، وسيقوم مسؤول الحسابات التجارية بإصدار عرض سعر معتمد (Quotation) بالدرهم الإماراتي شاملاً ضريبة القيمة المضافة والتوصيل.',
  },
]

export default function ArabicPrintingServicesPage() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="bg-[#101D35] text-[#F5F2EB] font-arabic antialiased selection:bg-[#D4AF65] selection:text-[#101D35]" dir="rtl">
      <SEOHead
        title="خدمات الطباعة التجارية والشركات في دبي | مطبعة متكاملة | ONPRINT"
        description="خدمات طباعة متكاملة للشركات في دبي من ONPRINT. طباعة بروشورات وفلايرات، رول اب بانر، مطبوعات مكتبية، وأكياس وهدايا ترويجية مع توصيل سريع في دبي وأبوظبي والإمارات."
        keywords="خدمات الطباعة دبي, مطبعة في دبي, خدمات الطباعة للشركات دبي, طباعة فلايرات دبي, طباعة بروشورات دبي, رول اب بانر دبي, الطباعة التجارية دبي, مطبعة تجارية دبي"
        canonicalUrl="https://www.0nprint.com/ar/printing-services"
        faqList={ARABIC_SERVICES_FAQS.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#203357] bg-gradient-to-b from-[#0C1629] via-[#101D35] to-[#101D35]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#172644]/60 blur-3xl" />

        <Container className="relative z-10">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#B0BECE]">
            <Link to="/ar" className="hover:text-[#D4AF65] transition-colors">الرئيسية</Link>
            <span>/</span>
            <span className="text-[#D4AF65] font-bold">خدمات الطباعة التجارية دبي</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold text-[#D4AF65]">
              <Layers className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>خدمات الطباعة التجارية والأوفست للشركات في دبي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F2EB] tracking-tight leading-[1.25]">
              خدمات الطباعة التجارية والشركات في دبي
            </h1>

            <p className="text-base sm:text-lg text-[#B0BECE] leading-relaxed">
              تقدم <strong>ONPRINT</strong> حلولاً متكاملة لكافة متطلبات الشركات والمؤسسات في دبي والإمارات. من الكروت الشخصية والبروشورات الترويجية، وحتى البانرات الإعلانية ومطبوعات الهوية المؤسسية الكاملة بأعلى جودة ألوان وسرعة إنجاز.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getArabicWhatsAppUrl('general', { service: 'طلب تسعير شامل للمطبوعات التجارية' })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar/printing-services',
                    button_location: 'arabic_services_hero_cta',
                    language: 'ar',
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                <span>طلب تسعير تجاري عبر واتساب</span>
              </a>

              <a
                href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#203357] bg-[#172644] px-5 py-3.5 text-sm font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-all"
              >
                <Phone className="h-4 w-4 text-[#D4AF65]" />
                <span>مكتب المبيعات: {FORMATTED_PHONE}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SERVICES CATALOG GRID */}
      <section className="py-16 sm:py-20 border-b border-[#203357]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
              باقة الخدمات التجارية المتكاملة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
              حلول طباعة شاملة تحت سقف واحد في دبي
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="rounded-3xl border border-[#203357] bg-[#172644]/70 hover:bg-[#172644] hover:border-[#D4AF65]/60 transition-all p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 px-3 py-1 text-[10px] font-bold text-[#D4AF65] inline-block">
                    {srv.badge}
                  </span>
                  <h3 className="text-lg font-black text-[#F5F2EB] leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#B0BECE] leading-relaxed">
                    {srv.desc}
                  </p>
                  <div className="pt-2 border-t border-[#203357] space-y-1">
                    {srv.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#F5F2EB]">
                        <CheckCircle2 className="h-3 w-3 text-[#D4AF65] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#203357]">
                  <a
                    href={getArabicWhatsAppUrl('general', { service: srv.title })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsAppClick({
                        source_page: '/ar/printing-services',
                        button_location: `arabic_service_card_${srv.id}`,
                        language: 'ar',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#101D35] hover:bg-[#25D366] hover:text-white border border-[#203357] hover:border-emerald-500 py-2.5 text-xs font-bold text-[#D4AF65] transition-all"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
                    <span>طلب عرض سعر عبر واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. ARABIC FAQS */}
      <section className="py-16 sm:py-20 border-b border-[#203357] bg-[#0C1629]">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                الأسئلة الشائعة حول عقود وطلبات الطباعة التجارية
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-1">
                إجابات شاملة لمدراء المشتريات والتسويق
              </h2>
            </div>

            <div className="space-y-3">
              {ARABIC_SERVICES_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#203357] bg-[#101D35] overflow-hidden"
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

      {/* 4. FOOTER CONVERSION */}
      <section className="py-14 bg-[#101D35] text-center">
        <Container>
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB]">
              هل لديك مناقصة أو كميات كبيرة لشركتك؟
            </h3>
            <p className="text-xs sm:text-sm text-[#B0BECE]">
              تواصل مع إدارة مبيعات الشركات للحصول على أسعار الجملة المباشرة وجدول التسليم المعتمد.
            </p>
            <a
              href={getArabicWhatsAppUrl('general', { service: 'طلب أسعار جملة لمناقصة طباعة شركات' })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3 text-sm font-black text-white shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
              <span>محادثة واتساب لمبيعات الشركات</span>
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
