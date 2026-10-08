import Link from 'next/link';
import { COLORS, COMPLIANCE } from '../lib/brand';

export default function NotFound() {
  return (
    <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 32px',textAlign:'center'}}>
      <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:'72px',fontWeight:700,color:COLORS.border,marginBottom:'8px'}}>404</h1>
      <p style={{fontSize:'18px',color:COLORS.slate,marginBottom:'24px'}}>This page could not be found.</p>
      <Link href="/" style={{padding:'12px 28px',background:COLORS.accentBlue,color:COLORS.white,borderRadius:'6px',fontFamily:"'Montserrat',sans-serif",fontSize:'14px',fontWeight:600,textDecoration:'none'}}>Back to Home</Link>
      <p style={{marginTop:'48px',fontSize:'12px',color:COLORS.textMuted}}>{COMPLIANCE.agentName} &middot; {COMPLIANCE.brokerName} &middot; DRE# {COMPLIANCE.agentDRE}</p>
    </div>
  );
}
