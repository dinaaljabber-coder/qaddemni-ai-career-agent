export type VerificationChannel = "email" | "sms" | "whatsapp";
export type VerificationResult = { ok: boolean; code?: string; error?: string; expiresAt?: number; retryAt?: number };
export interface EmailVerificationProvider { sendOTP(destination: string): Promise<VerificationResult>; verifyOTP(destination: string, code: string): Promise<VerificationResult> }
export interface PhoneVerificationProvider { sendOTP(destinationE164: string, channel: "sms" | "whatsapp"): Promise<VerificationResult>; verifyOTP(destinationE164: string, channel: "sms" | "whatsapp", code: string): Promise<VerificationResult> }
type Challenge = { hash: string; expiresAt: number; retryAt: number; attempts: number };
const challenges = new Map<string, Challenge>();
const hashCode = async (code: string) => { const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(code));return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,"0")).join(""); };
export class DemoVerificationProvider implements EmailVerificationProvider, PhoneVerificationProvider {
 async sendOTP(destination: string): Promise<VerificationResult>;
 async sendOTP(destination: string, channel: VerificationChannel): Promise<VerificationResult>;
 async sendOTP(destination: string, channel: VerificationChannel = "email"): Promise<VerificationResult> {
  const key=`${channel}:${destination.toLowerCase()}`;const current=challenges.get(key);const now=Date.now();if(current&&now<current.retryAt)return {ok:false,error:"Please wait before requesting another code.",retryAt:current.retryAt};
  const values=new Uint32Array(1);crypto.getRandomValues(values);const code=String(values[0]%1_000_000).padStart(6,"0");const expiresAt=now+5*60_000;challenges.set(key,{hash:await hashCode(code),expiresAt,retryAt:now+30_000,attempts:0});return {ok:true,code,expiresAt,retryAt:now+30_000};
 }
 async verifyOTP(destination: string, code: string): Promise<VerificationResult>;
 async verifyOTP(destination: string, channel: "sms" | "whatsapp", code: string): Promise<VerificationResult>;
 async verifyOTP(destination: string, codeOrChannel: string, maybeCode?: string): Promise<VerificationResult> {
  const channel: VerificationChannel=maybeCode?codeOrChannel as VerificationChannel:"email";const code=maybeCode??codeOrChannel;
  const key=`${channel}:${destination.toLowerCase()}`;const challenge=challenges.get(key);if(!challenge)return {ok:false,error:"Request a demo verification code first."};if(Date.now()>challenge.expiresAt){challenges.delete(key);return {ok:false,error:"This code expired. Request a new demo code."};}if(challenge.attempts>=5){challenges.delete(key);return {ok:false,error:"Too many incorrect attempts. Request a new demo code."};}if(!/^\d{6}$/.test(code))return {ok:false,error:"Enter the 6-digit code."};if(await hashCode(code)!==challenge.hash){challenge.attempts+=1;return {ok:false,error:`Incorrect code. ${5-challenge.attempts} attempts remaining.`};}challenges.delete(key);return {ok:true};
 }
}
export function normalizeE164(countryCode: string, number: string) { const digits=number.replace(/[^\d+]/g,"").replace(/^0+/,"");const prefix=countryCode.startsWith("+")?countryCode:`+${countryCode}`;const normalized=`${prefix}${digits.replace(/^\+/g,"")}`;return /^\+[1-9]\d{7,14}$/.test(normalized)?normalized:null; }
