"use client";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";

const codes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");
const display = new Intl.DisplayNames(["en"], { type: "region" });
const displayAr = new Intl.DisplayNames(["ar"], { type: "region" });
const calling: Record<string, string> = { IQ: "+964", EG: "+20", SA: "+966", AE: "+971", QA: "+974", KW: "+965", BH: "+973", OM: "+968", JO: "+962", LB: "+961", MA: "+212", TN: "+216", TR: "+90", GB: "+44", US: "+1", CA: "+1", AU: "+61", IN: "+91", PK: "+92", FR: "+33", DE: "+49" };
const cities: Record<string,string[]> = { IQ:["Baghdad","Erbil","Basra","Mosul","Sulaymaniyah","Najaf","Karbala","Kirkuk","Duhok","Ramadi"], EG:["Cairo","Alexandria","Giza","New Cairo","6th of October City","Sheikh Zayed","Nasr City","Heliopolis","Maadi","Madinaty","Borg El Arab","Mansoura","Tanta","Zagazig","Port Said","Ismailia","Suez","Assiut","Minya","Sohag","Luxor","Aswan"], SA:["Riyadh","Jeddah","Dammam","Mecca","Medina","Khobar","Taif","Abha"], AE:["Dubai","Abu Dhabi","Sharjah","Ajman","Al Ain","Ras Al Khaimah"], QA:["Doha","Al Rayyan","Al Wakrah"], KW:["Kuwait City","Hawalli","Salmiya"], BH:["Manama","Riffa","Muharraq"], OM:["Muscat","Salalah","Sohar"], JO:["Amman","Irbid","Zarqa","Aqaba"], LB:["Beirut","Tripoli","Sidon","Byblos"], MA:["Casablanca","Rabat","Marrakesh","Tangier","Fes"], TN:["Tunis","Sfax","Sousse"], TR:["Istanbul","Ankara","Izmir","Antalya"], GB:["London","Manchester","Birmingham","Edinburgh"], US:["New York","San Francisco","Austin","Seattle","Boston"], CA:["Toronto","Vancouver","Montreal","Ottawa"], DE:["Berlin","Munich","Hamburg","Frankfurt"], FR:["Paris","Lyon","Marseille","Toulouse"], IN:["Mumbai","Bengaluru","Delhi","Hyderabad"] };
const flag = (code:string) => String.fromCodePoint(...[...code].map(c=>c.charCodeAt(0)+127397));
const countries = codes.map(code=>({code,name:display.of(code)||code,nameAr:displayAr.of(code)||display.of(code)||code,flag:flag(code)})).sort((a,b)=>a.name.localeCompare(b.name));

export default function CountryCityPicker({ onSelect, initialCountry = "", locale = "en" }: { onSelect: (city: string, country: string) => void; initialCountry?: string; locale?: string }) {
  const [country,setCountry] = useState(countries.find(c=>c.name===initialCountry||c.code===initialCountry)?.code||"");
  const label=(c:typeof countries[number])=>locale==="ar"?c.nameAr:c.name;
  const [countryQuery,setCountryQuery] = useState(()=>{const c=countries.find(x=>x.name===initialCountry||x.nameAr===initialCountry||x.code===initialCountry);return c?`${c.flag} ${locale==="ar"?c.nameAr:c.name}`:""});
  const [city,setCity] = useState("");
  const selected = countries.find(c=>c.code===country);
  useEffect(()=>{const active=countries.find(c=>c.code===country);if(active)setCountryQuery(`${active.flag} ${locale==="ar"?active.nameAr:active.name}`)},[country,locale]);
  const suggestions = useMemo(()=>cities[country]||[],[country]);
  return <div className="country-city-picker">
    <label>{locale==="ar"?"الدولة":"Country"} <span className="field-hint">{locale==="ar"?"اختر الدولة التي تبحث فيها عن عمل":"Choose where you want to work"}</span></label>
    <div className="country-search-wrap"><Search size={15}/><input aria-label={locale==="ar"?"ابحث عن دولة":"Search countries"} list="qaddemni-country-options" placeholder={locale==="ar"?"اختر الدولة":"Choose your country"} value={countryQuery} onChange={e=>{const value=e.target.value;setCountryQuery(value);const match=countries.find(c=>`${c.flag} ${label(c)}`.toLowerCase()===value.toLowerCase()||label(c).toLowerCase()===value.toLowerCase()||c.name.toLowerCase()===value.toLowerCase());if(match){setCountry(match.code);setCity("")}else setCountry("")}}/><datalist id="qaddemni-country-options">{countries.map(c=><option key={c.code} value={`${c.flag} ${label(c)}`}>{calling[c.code]||""}</option>)}</datalist></div>
    {selected&&<div className="country-preview" aria-live="polite"><span>{selected.flag}</span><strong>{label(selected)}</strong><small>{calling[selected.code]|| (locale==="ar"?"تم اختيار الدولة":"Country selected")}</small></div>}
    <label htmlFor="qaddemni-city">{locale==="ar"?"المدينة":"City"} <span className="field-hint">{locale==="ar"?"اختر من القائمة أو اكتب اسم مدينتك":"Choose a suggestion or type your city"}</span></label>
    <div className="city-search-wrap"><MapPin size={15}/><input id="qaddemni-city" list="qaddemni-city-options" value={city} onChange={e=>setCity(e.target.value)} placeholder={country?(locale==="ar"?"ابحث عن مدينة أو اكتبها":"Search or enter a city"):(locale==="ar"?"اختر الدولة أولاً":"Choose a country first")} disabled={!country}/><datalist id="qaddemni-city-options">{suggestions.map(x=><option value={x} key={x}/>)}</datalist></div>
    <button className="btn primary picker-continue" disabled={!selected||!city.trim()} onClick={()=>selected&&onSelect(city.trim(),selected.name)}>{locale==="ar"?"استخدم هذا الموقع":"Use this location"}</button>
  </div>;
}
