import { jobs } from "./demo-data";
import type { Job } from "@/types";
export interface JobSearch { query?: string; location?: string; mode?: string; type?: string; country?: string; minimumSalary?: number; currency?: string; experienceLevel?: string }
export interface JobSource { search(input?: JobSearch): Promise<Job[]>; getById(id: string): Promise<Job | undefined> }
export class DemoJobSource implements JobSource {
 async search(input: JobSearch = {}) { const q=input.query?.toLowerCase().replaceAll("python","python").replaceAll("برمجة","programming").replaceAll("اسكندرية","alexandria").replaceAll("الإسكندرية","alexandria").replaceAll("القاهرة","cairo"); return jobs.filter(j=>(!q||`${j.title} ${j.company.name} ${j.skills.join(" ")} ${j.location} ${j.country??""}`.toLowerCase().includes(q))&&(!input.location||`${j.location} ${j.city??""} ${j.country??""}`.toLowerCase().includes(input.location.toLowerCase()))&&(!input.mode||input.mode==="All work modes"||input.mode==="Any"||j.mode===input.mode)&&(!input.type||input.type==="All"||j.type===input.type)&&(!input.country||input.country==="All countries"||(j.country??j.company.country??j.location).toLowerCase().includes(input.country.toLowerCase()))&&(!input.currency||input.currency==="Any currency"||j.currency===input.currency)&&(!input.experienceLevel||input.experienceLevel==="Any experience"||j.experienceLevel===input.experienceLevel)&&(!input.minimumSalary||salaryAmount(j)>=input.minimumSalary)); }
 async getById(id: string) { return jobs.find(j=>j.id===id); }
}
function salaryAmount(job: Job) { const amount=job.salary.match(/[\d,]+/)?.[0]?.replaceAll(",","");return Number(amount||0); }
