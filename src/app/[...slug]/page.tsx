import Workspace from "@/components/workspace";
import { CreditProvider } from "@/components/credit-provider";
export default async function RoutePage({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;return <CreditProvider><Workspace route={slug.join("/")}/></CreditProvider>}
