import type { Job } from "@/types";

export type ParsedJobSearch = { query: string; city?: string; cities?: string[]; country?: string; mode?: string; type?: string; skill?: string; minimumSalary?: number; currency?: string; entryOnly?: boolean; nearMe?: boolean; relocation?: boolean };
const cityNames = ["Alexandria","Cairo","Giza","New Cairo","6th October","Sheikh Zayed","Nasr City","Heliopolis","Maadi","Madinaty","Borg El Arab","Port Said","Ismailia","Suez","Mansoura","Tanta","Zagazig","Assiut","Minya","Sohag","Luxor","Aswan","Baghdad","Erbil","Basra","Riyadh","Jeddah","Dubai","Abu Dhabi","Doha","Kuwait City","Manama","Muscat","Amman","Beirut","Casablanca","Tunis"];
const arabicCities: Record<string,string> = { "اسكندرية":"Alexandria","الإسكندرية":"Alexandria","الاسكندرية":"Alexandria","القاهرة":"Cairo","الجيزة":"Giza","بغداد":"Baghdad","أربيل":"Erbil","البصرة":"Basra","الرياض":"Riyadh","جدة":"Jeddah","دبي":"Dubai","الدوحة":"Doha","عمان":"Amman" };
const countries = ["Egypt","Iraq","Saudi Arabia","United Arab Emirates","UAE","Qatar","Kuwait","Bahrain","Oman","Jordan","Lebanon","Morocco","Tunisia"];
const stopwords = new Set(["find","show","me","jobs","job","near","nearby","in","at","for","only","want","looking","search","opportunities","that","accept","above","over","from","with","the","a","an","please","part","time","junior","entry","level","intern","internship","student","fresh","remote","hybrid","onsite","freelance","contract","python","javascript","java","sql","it","data","support","developer","بدي","عايزة","عاوزة","شغل","وظائف","وظيفة","في","من","قريب","قريبة","لي","محتاج","محتاجة","هاتلي","ابحث","عن"]);
const skills = ["python","javascript","typescript","java","sql","it support","cybersecurity","networking","data","artificial intelligence","ai","design","figma","excel","marketing","sales","accounting","customer support"];

export function parseNaturalLanguageJobSearch(input: string, currentCity?: string): ParsedJobSearch {
  const original = input.trim(); const lower = original.toLowerCase();
  const normalized = Object.entries(arabicCities).reduce((value,[word,city])=>value.replaceAll(word.toLowerCase(),city.toLowerCase()),lower);
  const matchedCities = cityNames.filter(name=>normalized.includes(name.toLowerCase()));const canRelocate=/(can relocate|could relocate|willing to relocate|can move|ممكن أتنقل|ممكن اروح القاهرة|ممكن أروح القاهرة|أقدر أتنقل)/i.test(normalized);const noRelocate=/(no relocation|cannot relocate|don't want to move|not relocate|مش عايزة أنقل|مش عايز أنقل|مش هانتقل)/i.test(normalized);const city = matchedCities[0];
  const country = countries.find(name=>normalized.includes(name.toLowerCase()) || (name==="Egypt"&&normalized.includes("مصر")) || (name==="Iraq"&&normalized.includes("العراق")));
  const mode = /(remote|ريموت|عن بعد|من البيت|البيت)/i.test(normalized)?"Remote":/(hybrid|هجين)/i.test(normalized)?"Hybrid":/(on.site|onsite|office|مكتب|حضوري)/i.test(normalized)?"On-site":undefined;
  const type = /(part[ -]?time|دوام جزئي|جزئي)/i.test(normalized)?"Part-time":/(intern|internship|تدريب|متدرب)/i.test(normalized)?"Internship":/(freelance|فريلانسر|حر)/i.test(normalized)?"Freelance":/(contract|عقد)/i.test(normalized)?"Contract":undefined;
  const salaryMatch = normalized.match(/(?:above|over|from|minimum|at least|starts? at|starts? from|أكثر من|فوق|يبدأ من|ابتداء من)\s*([\d,.]+)\s*(k|thousand|ألف)?\s*(egp|le|pounds?|usd|\$|sar|aed|iqd|جنيه|دولار|ريال)?/i);
  const minimumSalary = salaryMatch?Number(salaryMatch[1].replaceAll(",",""))*(salaryMatch[2]?1000:1):undefined; const currencyWord=salaryMatch?.[3]?.toLowerCase();
  const currency = currencyWord?(/egp|le|pound|جنيه/i.test(currencyWord)?"EGP":/sar|ريال/i.test(currencyWord)?"SAR":/aed/i.test(currencyWord)?"AED":/iqd/i.test(currencyWord)?"IQD":"USD"):undefined;
  const skill = skills.find(value=>normalized.includes(value)); const tokens=normalized.split(/[^\p{L}\p{N}]+/u).filter(token=>token.length>2&&!stopwords.has(token)&&!cityNames.some(name=>name.toLowerCase()===token)&&!countries.some(name=>name.toLowerCase()===token));
  const selectedCities=canRelocate?matchedCities:matchedCities.slice(0,1);return { query: original, city: city || (/near me|nearby|قريب مني/i.test(normalized)?currentCity:undefined), cities:selectedCities, country, mode, type, skill: skill || tokens[0], minimumSalary, currency, entryOnly: /(junior|entry.level|intern|internship|student|fresh|خريج|مبتدئ|تدريب|طالب)/i.test(normalized), nearMe: /near me|nearby|قريب مني/i.test(normalized), relocation:canRelocate&&!noRelocate };
}

function salaryValue(job: Job) { const match=job.salary.match(/[\d,]+(?:\.\d+)?/); if(!match)return undefined; let value=Number(match[0].replaceAll(",","")); if(/\bk\b/i.test(job.salary))value*=1000; return value; }
export function filterJobsByNaturalLanguage(jobs: Job[], parsed: ParsedJobSearch) {
  return jobs.filter(job=>{
    const content=`${job.title} ${job.company.name} ${job.skills.join(" ")} ${job.location} ${job.country??job.company.country??""} ${job.description} ${job.type} ${job.experienceLevel??""}`.toLowerCase();
    const words=parsed.skill?.toLowerCase().split(/\s+/).filter(Boolean)||[]; const skillMatch=!words.length||words.some(word=>content.includes(word));
    const jobPlace=`${job.city??job.location} ${job.governorate??""}`.toLowerCase();const locations=parsed.cities?.length?parsed.cities:parsed.city?[parsed.city]:[];const cityMatch=!locations.length||locations.some(city=>city==="Remote"||jobPlace.includes(city.toLowerCase()))||(job.mode==="Remote"&&parsed.nearMe);
    const countryText=`${job.country??job.company.country??job.location}`.toLowerCase(); const countryMatch=!parsed.country||countryText.includes(parsed.country.toLowerCase())||(parsed.country==="United Arab Emirates"&&/uae|emirates/i.test(job.location));
    const amount=salaryValue(job); const salaryMatch=!parsed.minimumSalary||(parsed.currency?job.currency===parsed.currency&&!!amount&&amount>=parsed.minimumSalary:!amount||amount>=parsed.minimumSalary);
    return skillMatch&&cityMatch&&countryMatch&&(!parsed.mode||job.mode===parsed.mode)&&(!parsed.type||job.type===parsed.type)&&(!parsed.entryOnly||job.experienceLevel==="Entry"||job.type==="Internship")&&salaryMatch;
  });
}
