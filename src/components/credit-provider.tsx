"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CREDIT_COSTS, CREDIT_LABELS, createWallet, parseWallet, WALLET_KEY, type CreditAction, type CreditTransaction, type CreditWallet } from "@/lib/credits";

type CreditContextValue = { wallet: CreditWallet; spend: (action: CreditAction, description?: string) => boolean; purchase: (credits: number, packageName: string) => void; refund: (amount: number, description: string) => void; reset: () => void };
const CreditContext = createContext<CreditContextValue | null>(null);
export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<CreditWallet>(() => createWallet());
  useEffect(() => { setWallet(parseWallet(localStorage.getItem(WALLET_KEY))); }, []);
  const persist = useCallback((next: CreditWallet) => { localStorage.setItem(WALLET_KEY, JSON.stringify(next)); setWallet(next); }, []);
  const spend = useCallback((action: CreditAction, description?: string) => {
    const current = parseWallet(localStorage.getItem(WALLET_KEY)); const amount = CREDIT_COSTS[action];
    if (current.balance < amount) return false;
    const balance = current.balance - amount; const transaction: CreditTransaction = { id: `tx-${Date.now()}`, type: action==="application"?"JOB_APPLICATION":"AI_ACTION", amount: -amount, balanceAfter: balance, description: description || CREDIT_LABELS[action], createdAt: new Date().toISOString(), action };
    persist({ ...current, balance, spent: current.spent + amount, transactions: [transaction, ...current.transactions] });
    return true;
  }, [persist]);
  const purchase = useCallback((credits: number, packageName: string) => {
    const current = parseWallet(localStorage.getItem(WALLET_KEY)); const balance = current.balance + credits;
    const transaction: CreditTransaction = { id: `tx-${Date.now()}`, type: "PURCHASE", amount: credits, balanceAfter: balance, description: `${packageName} · demo purchase`, createdAt: new Date().toISOString() };
    persist({ ...current, balance, purchased: current.purchased + credits, transactions: [transaction, ...current.transactions] });
  }, [persist]);
  const refund = useCallback((amount: number, description: string) => { const current=parseWallet(localStorage.getItem(WALLET_KEY));const balance=current.balance+amount;const transaction:CreditTransaction={id:`tx-${Date.now()}`,type:"REFUND",amount,balanceAfter:balance,description,createdAt:new Date().toISOString()};persist({...current,balance,spent:Math.max(0,current.spent-amount),transactions:[transaction,...current.transactions]}); }, [persist]);
  const reset = useCallback(() => { const next = createWallet(); persist(next); }, [persist]);
  const value = useMemo(() => ({ wallet, spend, purchase, refund, reset }), [wallet, spend, purchase, refund, reset]);
  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}
export function useCredits() { const value = useContext(CreditContext); if (!value) throw new Error("useCredits must be used inside CreditProvider"); return value; }
