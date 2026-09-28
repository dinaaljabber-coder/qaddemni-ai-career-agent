"use client";
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <main className="content"><div className="empty-state"><div className="empty-icon">!</div><h1 className="h1" style={{fontSize:25}}>We hit a small snag.</h1><p>Try loading this page again.</p><button className="btn primary" onClick={()=>reset()}>Try again</button></div></main>}
