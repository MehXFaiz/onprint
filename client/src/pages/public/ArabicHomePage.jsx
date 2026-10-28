import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Tag,
  Stamp,
  Layers,
  Sparkles,
  Truck,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Phone,
  HelpCircle,
  ChevronDown,
  Building2,
  CheckCircle2,
  Award
} from 'lucide-react'
import Container from '../../components/Container'
import SEOHead from '../../components/SEOHead'
import WhatsAppIcon from '../../components/WhatsAppIcon'
import { getArabicWhatsAppUrl, FORMATTED_PHONE, RAW_WHATSAPP_NUMBER } from '../../utils/whatsapp'
import { trackWhatsAppClick, trackGetQuoteClick } from '../../utils/analytics'

const ARABIC_DEPARTMENTS = [
  {
    slug: '/ar/business-cards',
    title: 'طباعة كروت شخصية وبطاقات أعمال فاخرة',
    enLabel: 'Business Cards Dubai',
    desc: 'ورق قطني سميك 350-600 جرام، فويل ذهبي وفضي 24K، سبوت يو في بارز، وسلوفان مخملي سوفت تتش للشركات والمدراء التنفيذيين.',
    icon: CreditCard,
    badge: 'الأكثر طلباً',
    features: ['ورق قطني 600 GSM', 'فويل ذهبي بارز 24K', 'تنفيذ سريع خلال 24 ساعة'],
  },
  {
    slug: '/ar/stickers',
    title: 'طباعة ستيكرات وملصقات مخصصة للتغليف',
    enLabel: 'Custom Stickers & Labels',
    desc: 'ستيكرات فينيل مقاومة للماء والحرارة، ملصقات شفافة للمنتجات، رول للعلب والعبوات وقص ليزر دقيق حسب الشكل.',
    icon: Tag,
    badge: 'مقاومة للماء',
    features: ['فينيل BOPP ضد الماء والزيوت', 'قص ليزر مخصص Die-Cut', 'طباعة رول وشيتات للمتاجر'],
  },
  {
    slug: '/ar/stamps',
    title: 'صناعة وطباعة أختام الشركات الرسمية',
    enLabel: 'Company Stamps & Seals',
    desc: 'أختام ذاتية التحبير دائرية ومستطيلة، أختام تواريخ، وأختام الرقم الضريبي TRN بآليات تروادت Trodat النمساوية المعتمدة.',
    icon: Stamp,
    badge: 'معتمدة قانونياً',
    features: ['تروادت النمساوية Trodat الأصلية', 'أختام دائرية ومستطيلة', 'تسليم خلال 2-4 ساعات في دبي'],
  },
  {
    slug: '/ar/printing-services',
    title: 'خدمات الطباعة التجارية والبروشورات',
    enLabel: 'Commercial Printing & Banners',
    desc: 'فلايرات تسويقية، بروشورات وكتالوجات شركات، رول اب بانر وشاشات معارض، وأظرف وأوراق رسمية بجودة أوفست ورقمية متطورة.',
    icon: Layers,
    badge: 'مطبعة متكاملة',
    features: ['طباعة أوفست هايدلبرغ للكميات', 'رول اب بانر مع قواعد ألمنيوم', 'فلايرات وبروشورات سريعة'],
  },
]

const ARABIC_FAQS = [
  {
    q: 'ما هي خدمات الطباعة التي تقدمها مطبعة ONPRINT في دبي؟',
    a: 'توفر ONPRINT حلول طباعة تجارية وفاخرة متكاملة للشركات في دبي والإمارات، تشمل كروت شخصية فاخرة (مع فويل ذهبي وسبوت يو في)، ستيكرات وملصقات منتجات مقاومة للماء، أختام شركات رسمية معتمدة (تروادت النمساوية)، بروشورات وكتالوجات، رول اب بانر للمعارض، ومطبوعات الهوية المؤسسية والهدايا الدعائية.',
  },
  {
    q: 'أين يقع مقر الإنتاج وكيف يتم توصيل المطبوعات في الإمارات؟',
    a: 'تتم عمليات الإنتاج والطباعة والتجهيز في مركزنا بمنطقة القوز الصناعية في دبي، مع توفير خدمة التوصيل السريع لكافة مناطق دبي (DIFC، الخليج التجاري، وسط دبي، مارينا، ديرة) وخدمة الشحن اليومي المباشر إلى أبوظبي، الشارقة، عجمان، وجميع إمارات الدولة.',
  },
  {
    q: 'ما هي متطلبات إصدار ختم رسمي لشركة في دبي والإمارات؟',
    a: 'وفقاً للإجراءات القانونية المعتمدة في الدولة ولمنع أي استخدام غير مصرح به، يتطلب صنع ختم الشركة تقديم صورة سارية المفعول من الرخصة التجارية للشركة، وصورة بطاقة الهوية الإماراتية أو جواز السفر للمفوض بالتوقيع أو مالك الرخصة.',
  },
  {
    q: 'هل توفرون خدمة الطباعة المستعجلة والتسليم في نفس اليوم؟',
    a: 'نعم، نوفر مسار إنتاج سريع للطلبات المستعجلة مثل الأختام الرسمية الفورية (خلال 2 إلى 4 ساعات)، كروت العمل الرقمية، والرول اب بانر الجاهز للتسليم خلال 24 ساعة عند اعتماد ملفات التصميم الطباعية مبكراً.',
  },
  {
    q: 'كيف يمكنني الحصول على عرض سعر أو تقديم طلب طباعة؟',
    a: 'يمكنك التواصل المباشر مع فريق المبيعات الفنية عبر واتساب من خلال زر المحادثة في الموقع، مع مشاركة نوع المطبوعات المطلوبة، المقاس، والكمية، وسيقوم مهندس ما قبل الطباعة بإرسال عرض السعر والخيارات المتاحة والمدة الزمنية فوراً.',
  },
]

export default function ArabicHomePage() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="bg-[#040A18] text-[#F5F2EB] font-arabic antialiased selection:bg-[#D4AF65] selection:text-[#040A18]" dir="rtl">
      <SEOHead
        title="مطبعة في دبي | أون برينت ONPRINT – خدمات الطباعة التجارية والفاخرة في الإمارات"
        description="أون برينت ONPRINT مطبعة تجارية متكاملة في القوز، دبي. طباعة كروت شخصية فاخرة، أختام شركات معتمدة، ستيكرات وملصقات مقاومة للماء، بروشورات ورول اب بانر مع توصيل لكافة الإمارات."
        keywords="مطبعة في دبي, خدمات الطباعة دبي, طباعة كروت شخصية دبي, أختام شركات دبي, طباعة ستيكرات دبي, مطبعة تجارية دبي, مطبعة كروت شخصية الإمارات"
        canonicalUrl="https://www.0nprint.com/ar"
        faqList={ARABIC_FAQS.map(f => ({ question: f.q, answer: f.a }))}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#122240] bg-gradient-to-b from-[#020611] via-[#040A18] to-[#040A18]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#D4AF65]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[#081226]/60 blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/30 bg-[#D4AF65]/10 px-4 py-1.5 text-xs font-bold text-[#D4AF65] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF65]" />
              <span>مطبعة تجارية متكاملة • القوز، دبي، الإمارات</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F5F2EB] tracking-tight leading-[1.25]">
              حلول الطباعة التجارية والفاخرة <br />
              <span className="text-[#D4AF65]">للشركات والمحترفين في دبي</span>
            </h1>

            <p className="text-base sm:text-lg text-[#B0BECE] leading-relaxed max-w-2xl mx-auto">
              تقدم <strong>ONPRINT</strong> أعلى معايير الطباعة الألمانية والأوفست والرقمية في دبي. كروت شخصية قطنية فاخرة، أختام شركات معتمدة، ملصقات مقاومة للماء، ورول اب بانر مع خدمة التوصيل السريع لجميع الإمارات.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={getArabicWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar',
                    button_location: 'arabic_hero_primary',
                    language: 'ar',
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-current" />
                <span>اطلب عرض سعر فوري عبر واتساب</span>
              </a>

              <Link
                to="/ar/business-cards"
                onClick={() => trackGetQuoteClick({ source_page: '/ar', product_name: 'business_cards_ar' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#081226] hover:bg-[#122240] border border-[#122240] hover:border-[#D4AF65] px-6 py-3.5 text-sm font-bold text-[#F5F2EB] transition-all"
              >
                <span>استكشف الكروت الشخصية</span>
                <ArrowLeft className="h-4 w-4 text-[#D4AF65]" />
              </Link>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-right sm:text-center text-xs text-[#B0BECE]">
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#081226]/40 border border-[#122240]">
                <Clock className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span>تنفيذ سريع خلال 24 ساعة</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#081226]/40 border border-[#122240]">
                <Truck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>توصيل لكافة إمارات الدولة</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#081226]/40 border border-[#122240]">
                <ShieldCheck className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span>أختام رسمية معتمدة قانونياً</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#081226]/40 border border-[#122240]">
                <Award className="h-4 w-4 text-[#D4AF65] shrink-0" />
                <span>دقة ألوان ألمانية Heidelberg</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. CORE PRODUCTS GRID */}
      <section className="py-16 sm:py-20 border-b border-[#122240]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
              أقسام الطباعة الرئيسية في دبي
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F2EB] mt-2">
              اختر المنتج الذي يناسب أعمالك
            </h2>
            <p className="text-sm text-[#B0BECE] mt-2">
              مطبوعات مصممة بأعلى جودة ورق وتشطيبات هندسية دقيقة لتعزيز حضور علامتك التجارية في السوق الإماراتي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARABIC_DEPARTMENTS.map((dept) => {
              const Icon = dept.icon
              return (
                <div
                  key={dept.slug}
                  className="rounded-3xl border border-[#122240] bg-[#081226]/80 hover:bg-[#081226] hover:border-[#D4AF65]/60 transition-all p-6 sm:p-8 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#040A18] border border-[#122240] text-[#D4AF65]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-[#D4AF65]/10 border border-[#D4AF65]/30 px-3 py-1 text-[11px] font-bold text-[#D4AF65]">
                        {dept.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#F5F2EB]">
                        {dept.title}
                      </h3>
                      <p className="text-xs text-[#D4AF65] font-semibold mt-0.5" dir="ltr">
                        {dept.enLabel}
                      </p>
                      <p className="text-sm text-[#B0BECE] leading-relaxed mt-2.5">
                        {dept.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#122240] space-y-1.5">
                      {dept.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#F5F2EB]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF65] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#122240] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Link
                      to={dept.slug}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#D4AF65] hover:text-white transition-colors py-2"
                    >
                      <span>عرض التفاصيل والمواصفات</span>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>

                    <a
                      href={getArabicWhatsAppUrl(
                        dept.slug.includes('cards') ? 'business-cards' :
                        dept.slug.includes('stickers') ? 'stickers' :
                        dept.slug.includes('stamps') ? 'stamps' : 'general'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackWhatsAppClick({
                          source_page: '/ar',
                          button_location: `arabic_dept_card_${dept.slug}`,
                          language: 'ar',
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
                      <span>طلب عبر واتساب</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 3. PRESSROOM CAPABILITIES & DELIVERY COVERAGE */}
      <section className="py-16 sm:py-20 border-b border-[#122240] bg-[#020611]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF65]">
                دقة التنفيذ والسرعة
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F2EB] leading-tight">
                لماذا تعتمد كبرى الشركات في دبي على <span className="text-[#D4AF65]">ONPRINT</span>؟
              </h2>
              <p className="text-sm text-[#B0BECE] leading-relaxed">
                ندرك في ONPRINT أهمية الصورة الأولى لعلامتك التجارية. نعتمد على ماكينات طباعة رقمية HP Indigo وماكينات هايدلبرغ أوفست لضمان مطابقة تامة لألوان الشعار الرسمية وأوزان الورق المعتمدة دولياً.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240]">
                  <h4 className="font-bold text-[#F5F2EB] text-sm mb-1">مطبعة مركزية في القوز</h4>
                  <p className="text-xs text-[#B0BECE] leading-relaxed">
                    إشراف فني مباشر ومراقبة دقيقة لجودة كل شحنة قبل خروجها للمستلم.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240]">
                  <h4 className="font-bold text-[#F5F2EB] text-sm mb-1">تشطيبات فاخرة متخصصة</h4>
                  <p className="text-xs text-[#B0BECE] leading-relaxed">
                    بصمة ذهبية بارزة 24K، حواف ملونة، ورنيش موضعي ثلاثي الأبعاد، وسلوفان مطفي.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240]">
                  <h4 className="font-bold text-[#F5F2EB] text-sm mb-1">توصيل سريع لكافة الإمارات</h4>
                  <p className="text-xs text-[#B0BECE] leading-relaxed">
                    توصيل سريع في دبي (الخليج التجاري، مركز دبي المالي، وسط دبي)، وأبوظبي، والشارقة.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#040A18] border border-[#122240]">
                  <h4 className="font-bold text-[#F5F2EB] text-sm mb-1">خدمة عملاء عبر واتساب</h4>
                  <p className="text-xs text-[#B0BECE] leading-relaxed">
                    استجابة فورية لمراجعة ملفات التصميم وإرسال البروفات الرقمية مجاناً قبل الاعتماد.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#122240] bg-[#040A18] p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-black text-[#F5F2EB]">
                مناطق التوصيل والخدمة اليومية في الإمارات
              </h3>
              <p className="text-xs text-[#B0BECE] leading-relaxed">
                نوفر خدمة الشحن والتوصيل المباشر إلى مقرات الشركات والمكاتب والمستودعات في جميع مناطق الدولة:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#081226] border border-[#122240] text-[#F5F2EB] font-bold">
                  📍 دبي: DIFC, Business Bay, Downtown, Al Quoz, Media City, JLT
                </div>
                <div className="p-3 rounded-xl bg-[#081226] border border-[#122240] text-[#F5F2EB] font-bold">
                  📍 أبوظبي: جزيرة المارية، الكورنيش، المصفح، مدينة خليفة
                </div>
                <div className="p-3 rounded-xl bg-[#081226] border border-[#122240] text-[#F5F2EB] font-bold">
                  📍 الشارقة: المناطق الصناعية، المجاز، الخان
                </div>
                <div className="p-3 rounded-xl bg-[#081226] border border-[#122240] text-[#F5F2EB] font-bold">
                  📍 باقي الإمارات: عجمان، رأس الخيمة، الفجيرة، أم القيوين
                </div>
              </div>

              <div className="pt-2 border-t border-[#122240]">
                <p className="text-xs text-[#B0BECE] mb-3">
                  هل تحتاج استشارة فورية بخصوص المقاسات أو الكميات؟ تحدث مع المهندس المختص:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:+${RAW_WHATSAPP_NUMBER}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#122240] bg-[#081226] px-4 py-2 text-xs font-bold text-[#F5F2EB] hover:border-[#D4AF65] hover:text-[#D4AF65] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#D4AF65]" />
                    <span>الهاتف: {FORMATTED_PHONE}</span>
                  </a>
                  <a
                    href={getArabicWhatsAppUrl('general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
                    <span>محادثة واتساب سريعة</span>
                  </a>
                </div>
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
                الأسئلة الشائعة حول خدمات الطباعة في دبي
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB] mt-2">
                إجابات شاملة لجميع استفساراتكم
              </h2>
            </div>

            <div className="space-y-3">
              {ARABIC_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#122240] bg-[#081226]/70 overflow-hidden transition-colors"
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

      {/* 5. BOTTOM WHATSAPP CONVERSION BANNER */}
      <section className="py-14 sm:py-16 bg-[#020611] text-center">
        <Container>
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#F5F2EB]">
              جاهز لبدء طباعة مشروعك التجاري في دبي؟
            </h2>
            <p className="text-sm text-[#B0BECE] leading-relaxed">
              أرسل ملفات التصميم أو استفسارك عبر واتساب الآن، وسيقوم فريقنا بمراجعة الجودة وموافاتك بالتكلفة والخيارات خلال دقائق.
            </p>
            <div className="pt-2">
              <a
                href={getArabicWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source_page: '/ar',
                    button_location: 'arabic_footer_banner',
                    language: 'ar',
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="h-5 w-5 fill-current" />
                <span>تواصل معنا عبر واتساب الآن</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
