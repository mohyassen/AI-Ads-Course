import { motion, useMotionValue, useSpring } from "motion/react";
import { 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Users, 
  Video, 
  Zap, 
  Mic, 
  Music, 
  Target, 
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  X,
  Copy,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Player from "@vimeo/player";
import { AnimatePresence } from "motion/react";

import instructorImg from "./assets/images/regenerated_image_1778569407530.jpg";
import logoImg from "./assets/images/logo.png";

// --- Components ---

const PromoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const PROMO_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const DISCOUNT_CODE = "YASSEN20";

  // Initialize countdown
  useEffect(() => {
    let startTime = localStorage.getItem("promoStartTime");
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem("promoStartTime", startTime);
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - parseInt(startTime!);
      const remaining = PROMO_DURATION - elapsed;

      if (remaining <= 0) {
        setHasEnded(true);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(timer);
      } else {
        const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft({ d, h, m, s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show popup after 5 seconds only once per session
  useEffect(() => {
    const sessionSeen = sessionStorage.getItem("promoSeen_v2");
    if (sessionSeen) return;

    const timeout = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("promoSeen_v2", "true");
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const closePopup = () => setIsVisible(false);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-14 h-16 md:w-16 md:h-20 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-[0_0_15px_rgba(178,31,45,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] md:text-xs text-white/40 mt-2 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(178,31,45,0.2)] text-center p-8 md:p-12"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-red/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-red/10 blur-[80px] rounded-full" />

            <button 
              onClick={closePopup}
              className="absolute top-6 left-6 text-white/30 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-red/10 border border-primary-red/20 text-primary-red text-xs font-bold mb-6">
                <Clock size={14} />
                <span>عرض لفترة محدودة</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">خصم إضافي 20% <br/> لمـدة محـدودة</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                استخدم كود الخصم الآن واحصل على خصم إضافي على الكورس، واستمتع بكل التحديثات القادمة مدى الحياة.
              </p>

              {/* Countdown Timer */}
              <div className="mb-10">
                <p className="text-sm text-white/40 mb-4 font-medium">
                  {hasEnded ? "انتهى العرض" : "ينتهي العرض خلال"}
                </p>
                {!hasEnded && timeLeft && (
                  <div className="flex justify-center items-center gap-3 md:gap-4" dir="ltr">
                    <TimeUnit value={timeLeft.d} label="أيام" />
                    <span className="text-2xl font-bold text-white/20 mt-[-20px]">:</span>
                    <TimeUnit value={timeLeft.h} label="ساعات" />
                    <span className="text-2xl font-bold text-white/20 mt-[-20px]">:</span>
                    <TimeUnit value={timeLeft.m} label="دقائق" />
                    <span className="text-2xl font-bold text-white/20 mt-[-20px]">:</span>
                    <TimeUnit value={timeLeft.s} label="ثواني" />
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div className="mb-10">
                <div 
                  onClick={handleCopyCode}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-red/50 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-black border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-primary-red/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-red/10 rounded-lg flex items-center justify-center text-primary-red">
                        <Copy size={18} />
                      </div>
                      <span className="text-xl font-mono font-bold tracking-widest">{DISCOUNT_CODE}</span>
                    </div>
                    <span className="text-xs font-bold text-primary-red uppercase tracking-wider">
                      {isCopied ? "تم النسخ" : "نسخ الكود"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <a 
                  href="https://mohamedyassen.nzmly.com/l/hJXAPcMbba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-primary-red hover:bg-red-700 text-white text-xl font-bold rounded-2xl transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(178,31,45,0.3)] flex items-center justify-center gap-2 group"
                >
                  الحق الخصم الآن
                  <ArrowRight size={20} className="group-hover:translate-x-[-4px] transition-transform rotate-180" />
                </a>

                <button 
                  onClick={closePopup}
                  className="text-white/30 hover:text-white text-sm font-medium transition-colors"
                >
                  لاحقًا
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MouseGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  // More fluid spring physics for a luxurious "trailing" feel
  const springConfig = { damping: 40, stiffness: 80, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [mouseX, mouseY, isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      style={{
        left: smoothX,
        top: smoothY,
      }}
      className="mouse-glow"
    />
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-lg border-b border-white/5">
    <div className="flex items-center gap-4">
      <img src={logoImg} alt="Logo" className="h-12 w-auto object-contain" />
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
      <a href="#projects" className="hover:text-white transition-colors">مشاريع الدورات</a>
      <a href="#content" className="hover:text-white transition-colors">المحتوى</a>
      <a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
    </div>
    <a 
      href="https://mohamedyassen.nzmly.com/l/hJXAPcMbba" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="px-6 py-2 bg-primary-red hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95 text-center inline-block"
    >
      اشترك الآن
    </a>
  </nav>
);

const Hero = () => {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize Vimeo Player
  useEffect(() => {
    if (shouldPlay && iframeRef.current && !playerRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      // Ensure we stay in sync with initial muted state
      player.setMuted(true);
      setIsMuted(true);
    }
  }, [shouldPlay]);

  const toggleMute = async () => {
    if (playerRef.current) {
      const currentMuted = await playerRef.current.getMuted();
      const newMuted = !currentMuted;
      await playerRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
      
      if (!newMuted) {
        playerRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 cinematic-gradient opacity-60" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-red/20 border border-primary-red/30 text-primary-red text-sm font-bold mb-4">
              <Sparkles size={16} />
              <span>كورس احترافي متكامل</span>
            </div>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-red to-black rounded-full blur opacity-40 animate-pulse"></div>
                <img 
                  src={instructorImg} 
                  alt="Yassen" 
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-2xl" 
                />
                <div className="absolute -bottom-1 -right-1 bg-primary-red rounded-full p-1 border border-black">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
              تعلّم صناعة الإعلانات <br/>
              <span className="text-primary-red drop-shadow-[0_0_20px_rgba(178,31,45,0.6)]">بالذكاء الاصطناعي</span> باحتراف
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6 font-medium max-w-3xl mx-auto">
              حوّل أفكارك إلى فيديوهات إعلانية متكاملة باستخدام أدوات الذكاء الاصطناعي. من كتابة البرومبت، وتجهيز المشاهد، وتوليد الفيديو، إلى تزامن الصوت وصناعة فيديوهات UGC والأغاني الإعلانية.
            </p>
            <p className="text-lg text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto">
              كورس عملي مصمم للمصممين، وصنّاع المحتوى، والمسوقين، وأصحاب المشاريع الذين يريدون استخدام الذكاء الاصطناعي لصناعة محتوى إعلاني احترافي قابل للنشر والاستخدام التجاري.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <a 
                href="https://mohamedyassen.nzmly.com/l/hJXAPcMbba" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-12 py-5 bg-primary-red hover:bg-red-700 text-white text-xl font-bold rounded-xl transition-all hover:scale-105 flex items-center gap-2 group shadow-[0_0_30px_rgba(127,29,29,0.3)]"
              >
                 اشترك الآن
                 <ArrowRight size={24} className="group-hover:translate-x-[-4px] transition-transform rotate-180" />
              </a>
              <a href="#projects" className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white text-xl font-bold rounded-xl border border-white/10 transition-all hover:scale-105 backdrop-blur-sm inline-block">
                شاهد المشاريع
              </a>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-3 text-base text-white/50">
              <CheckCircle2 size={20} className="text-primary-red" />
              <span>ابدأ رحلتك في صناعة محتوى إعلاني أكثر احترافية، بسرعة أكبر، وبتكلفة أقل.</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative group w-full max-w-6xl mt-8"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-red to-black rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center shadow-2xl">
              {shouldPlay ? (
                <>
                  <iframe 
                    ref={iframeRef}
                    src={`https://player.vimeo.com/video/1191421992?autoplay=1&muted=1&loop=1&autopause=0&badge=0&player_id=0&app_id=58479&controls=0&title=0&byline=0&portrait=0`}
                    title="Vimeo video player"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full object-cover brightness-100 scale-105"
                  ></iframe>
                  <motion.button 
                    onClick={toggleMute}
                    animate={{ 
                      boxShadow: [
                        "0 0 0px rgba(178,31,45,0)", 
                        "0 0 20px rgba(178,31,45,0.4)", 
                        "0 0 0px rgba(178,31,45,0)"
                      ],
                      borderColor: [
                        "rgba(255,255,255,0.1)",
                        "rgba(178,31,45,0.5)",
                        "rgba(255,255,255,0.1)"
                      ]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute bottom-6 right-6 z-20 p-4 bg-black/60 backdrop-blur-md border rounded-full text-white hover:bg-primary-red transition-colors group shadow-xl"
                    title={isMuted ? "تفعيل الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </motion.button>
                </>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-zinc-900 pointer-events-none" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl glass-card border-white/5 hover:border-primary-red/30 transition-all duration-500 group"
  >
    <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-red/20 transition-colors">
      <Icon className="text-primary-red" size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-white/60 leading-relaxed">{description}</p>
  </motion.div>
);

const ShowcaseCard = ({ size, videoUrl }: { size: string, videoUrl?: string }) => {
  const isVimeo = videoUrl?.includes('vimeo');
  const vimeoId = isVimeo ? videoUrl?.split('/').pop()?.split('?')[0] : null;
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Optional: You could set it to false here to stop video when scrolled away
          // But usually we just want to delay initial load
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Start loading slightly before it enters
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={cardRef}
      whileHover={{ scale: 1.02 }}
      className={`${size} relative rounded-3xl overflow-hidden group border border-white/10 hover:border-primary-red/50 transition-all duration-500 bg-zinc-900 aspect-video`}
    >
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
           <div className="w-12 h-12 border-2 border-primary-red/20 border-t-primary-red rounded-full animate-spin" />
        </div>
      )}
      
      {isVisible && (
        <>
          {isVimeo ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&autopause=0&background=1&quality=720p`}
              className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none brightness-[0.7] group-hover:brightness-100"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-abstract-motion-of-red-and-white-smoke-on-a-black-background-44026-large.mp4"}
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.7] group-hover:brightness-100"
            />
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between"
      >
        <span className="text-lg font-bold">{question}</span>
        <ChevronDown className={`text-primary-red transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden text-right"
      >
        <p className="pb-6 text-white/60 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-primary-red selection:text-white relative" dir="rtl">
      <MouseGlow />
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Value Prop Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center border border-white/10 p-12 lg:p-20 rounded-[3rem] bg-zinc-900/50 backdrop-blur-sm relative">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-red rounded-full flex items-center justify-center text-white shadow-lg">
                <Target size={24} />
             </div>
             <h2 className="text-3xl lg:text-5xl font-bold mb-8">كورس عملي لبناء إعلانات كاملة بالذكاء الاصطناعي</h2>
             <p className="text-xl text-white/70 leading-relaxed">
               هذا الكورس لا يشرح الأدوات فقط، بل يقدّم لك طريقة عمل واضحة تساعدك على الانتقال من الفكرة إلى إعلان كامل. ستتعلّم كيف تبني المشهد، كيف تكتب البرومبت، كيف تحافظ على ثبات المنتج أو الشخصية، وكيف تخرج بفيديو جاهز للنشر يخدم أهدافك التسويقية.
             </p>
          </div>
        </div>
      </section>

      {/* Project Showcase - Bento Grid */}
      <section id="projects" className="py-24 px-6 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">مشاريع الدورات</h2>
            <p className="text-xl text-white/50">بعض نماذج المشاريع التي ستتمكن من تنفيذها بعد الكورس.</p>
          </div>
          
          <div className="bento-grid">
            <ShowcaseCard size="md:col-span-2 md:row-span-2" videoUrl="https://vimeo.com/1191424985" />
            <ShowcaseCard size="md:col-span-2 md:row-span-2" videoUrl="https://vimeo.com/1191423673" />
            <ShowcaseCard size="md:col-span-1 md:row-span-1" videoUrl="https://vimeo.com/1191427070" />
            <ShowcaseCard size="md:col-span-1 md:row-span-1" videoUrl="https://vimeo.com/1191427462" />
            <ShowcaseCard size="md:col-span-1 md:row-span-1" videoUrl="https://vimeo.com/1191428173" />
            <ShowcaseCard size="md:col-span-1 md:row-span-1" videoUrl="https://vimeo.com/1191428755" />
            <ShowcaseCard size="md:col-span-2 md:row-span-2" videoUrl="https://vimeo.com/1191424163" />
            <ShowcaseCard size="md:col-span-2 md:row-span-2" videoUrl="https://vimeo.com/1191426702" />
          </div>
        </div>
      </section>

      {/* What You Will Learn */}
      <section className="py-24 px-6 relative bg-zinc-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">ماذا ستتعلم داخل الكورس؟</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="كتابة البرومبت باحتراف" 
              description="ستتعلم كيف تحوّل أي فكرة أو صورة أو مشهد إلى برومبت واضح ومنظم يساعد أدوات الذكاء الاصطناعي على إنتاج نتائج أقرب لما تتخيله."
            />
            <FeatureCard 
              icon={Video} 
              title="تجهيز المشاهد قبل التوليد" 
              description="ستتعلم كيفية بناء المشهد، تحديد الزوايا، الإضاءة، ترتيب العناصر، وتجهيز المراجع البصرية قبل البدء في توليد الفيديو."
            />
            <FeatureCard 
              icon={Play} 
              title="توليد فيديوهات إعلانية" 
              description="ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء فيديوهات إعلانية مخصصة للمنتجات والخدمات والحملات التجارية."
            />
            <FeatureCard 
              icon={Users} 
              title="تثبيت الشخصية والمنتج والمكان" 
              description="ستتعلم كيف تقلل مشكلة تغيّر العناصر بين المشاهد، لتحصل على فيديو أكثر اتساقًا واحترافية."
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="صناعة فيديو كامل من الصفر" 
              description="ستتبع Workflow عمليًا يبدأ من الفكرة وينتهي بفيديو إعلاني جاهز."
            />
            <FeatureCard 
              icon={Sparkles} 
              title="صناعة فيديو CGI" 
              description="ستتعلم كيف تقوم على توليد فيديوهات CGI لأي منتج"
            />
            <FeatureCard 
              icon={Target} 
              title="صناعة فيديوهات UGC بيعية" 
              description="ستتعلم كيف تبني فيديوهات تظهر وكأنها محتوى طبيعي وواقعي، ولكنها في نفس الوقت تخدم الهدف التسويقي والبيعي."
            />
            <FeatureCard 
              icon={Mic} 
              title="تزامن الصوت مع الفيديو" 
              description="ستتعلم كيف تضيف الصوت إلى الشخصية وتجعل حركة الفم متزامنة مع الكلام."
            />
            <FeatureCard 
              icon={Music} 
              title="صناعة أغاني إعلانية" 
              description="ستتعلم كيف تنشئ أغنية قصيرة أو Jingle بسيط لدعم الإعلان أو ترسيخ اسم المنتج في ذهن الجمهور."
            />
          </div>
        </div>
      </section>

      {/* Course Content - Modules */}
      <section id="content" className="py-24 px-6 bg-black">
        <div className="container mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">محتوى الكورس</h2>
          </div>
          <div className="max-w-5xl mx-auto space-y-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="p-8 rounded-2xl border border-white/5 bg-zinc-900/30 flex flex-col md:flex-row items-center gap-8 group hover:border-primary-red/20 transition-all text-right">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red text-2xl font-bold">
                  {num}
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    {num === 1 && "صناعة الإعلانات بالذكاء الاصطناعي"}
                    {num === 2 && "الأفكار وكتابة البرومبت"}
                    {num === 3 && "تثبيت الشخصية والمنتج"}
                    {num === 4 && "توليد الفيديوهات"}
                    {num === 5 && "فيديوهات UGC والصوت"}
                    {num === 6 && "الأغاني الإعلانية"}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {num === 1 && "فهم دور الذكاء الاصطناعي في صناعة الإعلانات، وكيفية استخدامه كأداة عملية في الإنتاج وصناعة المحتوى."}
                    {num === 2 && "تعلّم كيفية استخراج الأفكار، تحليل المشاهد، وبناء برومبتات قوية ومنظمة."}
                    {num === 3 && "تعلّم كيفية الحفاظ على نفس الشخصية والمنتج داخل المشاهد، وتقليل التغيّر بين اللقطات."}
                    {num === 4 && "تعلّم كيفية تجهيز المشاهد، تثبيت العناصر، وتنفيذ فيديو كامل خطوة بخطوة."}
                    {num === 5 && "تعلّم كيفية إنشاء فيديوهات UGC، اختيار السكريبت، إضافة الصوت، ومزامنة الكلام مع الفيديو."}
                    {num === 6 && "تعلّم كيفية إنشاء أغنية أو Jingle بالذكاء الاصطناعي واستخدامه داخل المحتوى الإعلاني."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10">
              <img src={instructorImg} alt="Instructor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              
           </div>
           <div className="text-right">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">لمن هذا الكورس؟</h2>
              <p className="text-xl text-white/70 mb-10 leading-relaxed">
                هذا الكورس مناسب لكل من يرغب في استخدام الذكاء الاصطناعي لصناعة محتوى إعلاني احترافي، وخاصة:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "مصممي الجرافيك",
                  "صنّاع المحتوى",
                  "المسوقين",
                  "أصحاب المشاريع",
                  "الفريلانسرز",
                  "المبتدئين في أدوات AI",
                  "مطوري المهارات",
                  "عشاق التكنولوجيا"
                ].map((item) => (
                  <motion.div 
                    key={item} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-primary-red/40 hover:shadow-[0_0_25px_rgba(178,31,45,0.2)] transition-all duration-300 group cursor-default relative"
                  >
                     <div className="absolute inset-0 bg-primary-red/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                     <CheckCircle2 className="text-primary-red group-hover:drop-shadow-[0_0_10px_rgba(178,31,45,0.8)] transition-all z-10" size={20} />
                     <span className="font-bold z-10 group-hover:text-white transition-colors">{item}</span>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Why This Course */}
      <section className="py-24 px-6 cinematic-gradient">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">لماذا هذا الكورس مختلف؟</h2>
          <p className="text-2xl text-white/80 leading-relaxed mb-12">
            لأن الكورس لا يقدّم شرحًا نظريًا فقط، ولا يركز على أداة واحدة، بل يقدّم لك طريقة عمل متكاملة تساعدك على صناعة إعلان كامل خطوة بخطوة.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-right">
            <div className="p-10 rounded-[2rem] glass-card border-primary-red/10">
              <h3 className="text-xl font-bold mb-4 text-primary-red">التركيز على النتيجة</h3>
              <p className="text-white/60">الهدف ليس فقط أن تشاهد الشرح، بل أن تصبح قادرًا على تنفيذ مشاريع حقيقية بنفسك.</p>
            </div>
            <div className="p-10 rounded-[2rem] glass-card border-primary-red/10">
              <h3 className="text-xl font-bold mb-4 text-primary-red">طريقة عمل متكاملة</h3>
              <p className="text-white/60">ستتعلم كيف تبدأ من الفكرة، ثم تنتقل إلى كتابة البرومبت، ثم تجهيز المشاهد، ثم توليد الفيديو.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">ماذا ستحصل عليه؟</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "محاضرات عملية منظمة",
              "أمثلة تطبيقية واضحة",
              "ملفات تساعدك في التطبيق",
              "تاسكات عملية داخل الكورس",
              "نماذج برومبتات قابلة للتعديل",
              "شرح Workflow واضح",
              "مشاريع قابلة للتنفيذ",
              "تحديثات دورية للمحتوى"
            ].map((benefit) => (
              <div key={benefit} className="p-8 rounded-2xl border border-white/5 bg-zinc-900/20 text-center hover:bg-zinc-900/40 transition-colors">
                <div className="w-12 h-12 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-primary-red" size={24} />
                </div>
                <h4 className="font-bold text-lg">{benefit}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-zinc-950">
        <div className="container mx-auto max-w-4xl">
           <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-2">
            <FAQItem 
              question="هل الكورس مناسب للمبتدئين؟" 
              answer="نعم. تم تصميم الكورس بطريقة واضحة وعملية تبدأ من الأساسيات وتنتقل تدريجيًا إلى تنفيذ مشاريع متقدمة." 
            />
            <FAQItem 
              question="هل يجب أن أكون مصممًا؟" 
              answer="ليس شرطًا، ولكن أي خلفية في التصميم أو المحتوى أو التسويق ستساعدك على الاستفادة بشكل أكبر." 
            />
            <FAQItem 
              question="هل سأتمكن من تنفيذ فيديوهات بعد الكورس؟" 
              answer="نعم. الهدف الأساسي من الكورس هو أن تتعلم تنفيذ مشاريع واضحة وقابلة للتطبيق بنفسك." 
            />
            <FAQItem 
              question="هل يتضمن الكورس فيديوهات UGC؟" 
              answer="نعم. ستتعلم كيفية إنشاء فيديوهات UGC بيعية باستخدام الذكاء الاصطناعي." 
            />
            <FAQItem 
              question="هل يتضمن الكورس تزامن الصوت مع الفيديو؟" 
              answer="نعم. ستتعلم كيفية إضافة الصوت ومزامنته مع حركة الفم داخل الفيديو." 
            />
            <FAQItem 
              question="هل يتضمن الكورس صناعة أغاني بالذكاء الاصطناعي؟" 
              answer="نعم. ستتعلم كيفية إنشاء أغنية قصيرة أو Jingle إعلاني باستخدام أدوات الذكاء الاصطناعي." 
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-red/10 blur-[120px] rounded-full opacity-50" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-7xl font-bold mb-8">ابدأ الآن في تعلّم صناعة الإعلانات بالذكاء الاصطناعي</h2>
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              إذا كنت تريد تطوير مهاراتك في صناعة الفيديوهات الإعلانية، وإنشاء محتوى احترافي باستخدام الذكاء الاصطناعي، فهذا الكورس صُمم ليمنحك طريقة عمل واضحة ومباشرة تساعدك على الوصول إلى نتائج حقيقية.
            </p>
            <a 
              href="https://mohamedyassen.nzmly.com/l/hJXAPcMbba" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-12 py-6 bg-primary-red hover:bg-red-700 text-white text-2xl font-bold rounded-2xl transition-all hover:scale-110 shadow-[0_0_40px_rgba(127,29,29,0.4)] active:scale-95 inline-block"
            >
              اشترك الآن
            </a>
            <p className="mt-8 text-white/40 text-sm">سيتم تحويلك إلى صفحة التسجيل الخاصة بالكورس لإتمام الاشتراك.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm bg-black">
        <div className="container mx-auto">
          <img src={logoImg} alt="Logo" className="h-16 w-auto mx-auto mb-6 opacity-50 hover:opacity-100 transition-opacity" />
          <p>جميع الحقوق محفوظة | All rights reserved</p>

        </div>
      </footer>
      
      <PromoPopup />
    </div>
  );
}
