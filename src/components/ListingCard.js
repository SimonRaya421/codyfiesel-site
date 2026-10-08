'use client';
import Link from 'next/link';
import { COLORS } from '../lib/brand';
import { trackListingView } from '../lib/tracker';

export default function ListingCard({ listing }) {
  if (!listing) return null;
  const { listingId, mlsId, listPrice, property, address, photos, agent, office, listDate } = listing;
  const id = mlsId || listingId;
  const photo = photos?.[0] || null;
  const beds = property?.bedrooms || '—';
  const baths = property?.bathrooms || '—';
  const sqft = property?.area ? property.area.toLocaleString() : '—';
  const city = address?.city || '';
  const fullAddress = address?.full || address?.streetAddress || '';
  const price = listPrice ? `$${listPrice.toLocaleString()}` : 'Price TBD';
  const agentFirst = agent?.firstName || '';
  const agentLast = agent?.lastName || '';
  const agentName = `${agentFirst} ${agentLast}`.trim();
  const officeName = office?.name || office?.servingName || '';
  const isNew = listDate && (Date.now() - new Date(listDate).getTime()) < 7*24*60*60*1000;

  return (
    <Link href={`/listing/${id}`} onClick={()=>trackListingView(listing)} style={{
      display:'block',background:COLORS.white,border:`1px solid ${COLORS.border}`,borderRadius:'8px',
      overflow:'hidden',textDecoration:'none',color:'inherit',transition:'box-shadow 0.2s ease, transform 0.2s ease',
    }}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)';e.currentTarget.style.transform='translateY(-2px)';}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'relative',width:'100%',paddingTop:'66%',background:COLORS.fog,overflow:'hidden'}}>
        {photo ? (
          <img src={photo} alt={fullAddress||'Property'} loading="lazy" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}} />
        ) : (
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.textMuted,fontSize:'14px'}}>No Photo</div>
        )}
        {isNew && (
          <span style={{position:'absolute',top:'12px',left:'12px',background:COLORS.accentBlue,color:COLORS.white,fontSize:'11px',fontFamily:"'Montserrat',sans-serif",fontWeight:600,letterSpacing:'0.5px',textTransform:'uppercase',padding:'4px 10px',borderRadius:'3px'}}>Just Listed</span>
        )}
      </div>
      <div style={{padding:'16px 18px'}}>
        <p style={{fontFamily:"'Montserrat',sans-serif",fontSize:'20px',fontWeight:700,color:COLORS.black,marginBottom:'4px'}}>{price}</p>
        <p style={{fontSize:'13px',color:COLORS.slate,marginBottom:'6px'}}>{beds} bd &middot; {baths} ba &middot; {sqft} sqft</p>
        <p style={{fontSize:'13px',color:COLORS.black,fontWeight:500,marginBottom:'10px',lineHeight:'1.3'}}>{fullAddress}{city?`, ${city}`:''}</p>
        <div style={{borderTop:`1px solid ${COLORS.border}`,paddingTop:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:'11px',color:COLORS.textMuted,lineHeight:'1.4'}}>
            {agentName ? `Courtesy of ${agentName}${officeName?`, ${officeName}`:''}` : officeName || 'BAREIS MLS'}
          </span>
          <span style={{fontSize:'11px',color:COLORS.textMuted}}>MLS# {id}</span>
        </div>
      </div>
    </Link>
  );
}
