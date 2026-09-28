import { ArrowUpRight, BadgeCheck, BriefcaseBusiness, Compass, FileText, LocateFixed, Sparkles, UserRound, Workflow } from "lucide-react";
import { translate, type Locale } from "@/lib/i18n";

const journey = [
  { label: "Profile", detail: "Start with your story", icon: UserRound },
  { label: "Discover", detail: "Explore relevant roles", icon: Compass },
  { label: "Match", detail: "See why they fit", icon: BadgeCheck },
  { label: "Prepare", detail: "Shape your application", icon: FileText },
  { label: "Apply", detail: "You choose what to send", icon: BriefcaseBusiness },
  { label: "Follow up", detail: "Keep every next step close", icon: ArrowUpRight },
];

export function CareerAgentVisual({ locale = "en" }: { locale?: Locale }) {
  const t = (text: string) => translate(text, locale);
  return <div className="career-agent-visual" role="img" aria-label={t("Example career profile connecting location, work preferences, and skills to three strong job matches")}>
    <svg className="career-network-lines" viewBox="0 0 520 390" fill="none" aria-hidden="true">
      <path d="M260 190C178 153 143 91 65 83M260 190C346 148 381 91 455 78M260 202C171 236 124 298 61 315M260 202C353 243 402 303 463 314"/>
      <circle cx="65" cy="83" r="4"/><circle cx="455" cy="78" r="4"/><circle cx="61" cy="315" r="4"/><circle cx="463" cy="314" r="4"/>
    </svg>
    <div className="agent-orbit orbit-a"/><div className="agent-orbit orbit-b"/>
    <div className="agent-core"><span className="agent-core-spark"><Sparkles size={18}/></span><span className="agent-core-q">Q</span><i/></div>
    <div className="agent-context location"><span><LocateFixed size={14}/></span><div><small>{t("Based in")}</small><strong>{locale === "ar" ? "الإسكندرية" : "Alexandria"}</strong></div></div>
    <div className="agent-context schedule"><span><BriefcaseBusiness size={14}/></span><div><small>{t("Looking for")}</small><strong>{t("Part-time")}</strong></div></div>
    <div className="agent-context skill"><span className="skill-dot">Py</span><div><small>{t("Strength")}</small><strong>Python</strong></div></div>
    <div className="agent-context education"><span><UserRound size={14}/></span><div><small>{t("Experience")}</small><strong>{t("Early career")}</strong></div></div>
    <div className="agent-result"><span className="result-check"><BadgeCheck size={16}/></span><div><strong>{t("3 strong matches")}</strong><small>{t("Chosen for your goals")}</small></div><span className="result-score">87%<small>{t("profile fit")}</small></span></div>
    <div className="agent-caption"><Workflow size={13}/> {t("A clearer path, one step at a time")}</div>
  </div>;
}

const journeyArabic = [
  ["الملف المهني", "ابدأ بقصتك"], ["اكتشف", "استكشف الفرص المناسبة"], ["التوافق", "افهم أسباب الملاءمة"],
  ["التجهيز", "جهّز طلبك"], ["التقديم", "أنت تختار ما ترسله"], ["المتابعة", "تابع خطوتك التالية"],
];

export function CareerJourney({ compact = false, locale = "en" }: { compact?: boolean; locale?: "en" | "ar" }) {
  return <div className={`career-journey ${compact ? "compact" : ""}`} role="list" aria-label={locale === "ar" ? "مسار مسيرتك المهنية" : "Your career journey"}>
    {journey.map(({ label, detail, icon: Icon }, index) => <div className={`journey-step ${index === 0 ? "current" : ""}`} key={label} role="listitem">
      <span className="journey-step-node"><Icon size={compact ? 15 : 17}/></span>
      <span className="journey-step-copy"><strong>{locale === "ar" ? journeyArabic[index][0] : label}</strong><small>{locale === "ar" ? journeyArabic[index][1] : detail}</small></span>
      {index < journey.length - 1 && <span className="journey-step-link" aria-hidden="true"/>}
    </div>)}
  </div>;
}

export function QaddemniPulse({ label = "Putting your career context to work" }: { label?: string }) {
  return <span className="qaddemni-pulse" role="status"><span className="pulse-network" aria-hidden="true"><i/><i/><i/></span>{label}</span>;
}

export function CareerEmptyIllustration({ kind = "path" }: { kind?: "path" | "document" | "roles" }) {
  const Icon = kind === "document" ? FileText : kind === "roles" ? BriefcaseBusiness : Workflow;
  return <span className="career-empty-art" aria-hidden="true"><i/><i/><i/><span><Icon size={22}/></span></span>;
}
