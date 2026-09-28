"use client";
import { useEffect, useState } from "react";
import { Activity, Info } from "lucide-react";
import { profile as seedProfile } from "@/lib/demo-data";
import { explainJobMatch } from "@/lib/matching";
import type { Job, Profile } from "@/types";
import { useLocale } from "@/lib/use-locale";
export default function JobMatchBreakdown({job}:{job:Job}){const {t}=useLocale();const [profile,setProfile]=useState<Profile>(seedProfile);useEffect(()=>{try{const saved=localStorage.getItem("career-profile");if(saved)setProfile({...seedProfile,...JSON.parse(saved)})}catch{}},[]);const match=explainJobMatch(profile,job);return <section className="job-match-explanation"><div className="match-explanation-heading"><div><p className="eyebrow">{t("YOUR PROFILE MATCH")}</p><h3>{match.overall}% <span>{t("overall fit")}</span></h3></div><div className="match-known"><Activity size={12}/> {match.knownCount}/8 {t("signals informed")}</div></div><p className="match-explanation-text">{t(match.explanation)}</p><div className="match-dimensions">{match.dimensions.map(d=><div className="match-dimension" key={d.key}><div><span>{t(d.label)}</span><strong>{d.known?`${d.score}%`:"—"}</strong></div><div className="match-track"><i style={{width:`${d.score}%`}}/></div><small>{t(d.note)}</small></div>)}</div><div className="match-caveat"><Info size={12}/> {t("Demo estimate based on profile details you provided. Missing signals are shown as unknown, not assumed.")}</div></section>}
