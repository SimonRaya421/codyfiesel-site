'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { COLORS, SITE, COMPLIANCE, AGENT } from '../lib/brand';
import { trackListingView } from '../lib/tracker';

export default function ListingDetail({ listing }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => { if (listing) trackListingView(listing); }, [listing]);

  const openLightbox = useCallback((index) => {
    setCurrentPhoto(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextPhoto = useCallback(() => {
    if (!listing?.photos) return;
    setCurrentPhoto(prev => (prev + 1) % listing.photos.length);
  }, [listing]);
  const prevPhoto = useCallback(() => {
    if (!listing?.photos) return;
    setCurrentPhoto(prev => (prev - 1 + listing.photos.length) % listing.photos.length);
  }, [listing]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!listing) return null;

  const { listingId, mlsId, listPrice, property, address, photos, agent, office, remarks } = listing;
  const id = mlsId || listingId;
  const price = listPrice ? `$${listPrice.toLocaleString()}` : 'Price TBD';
  const beds = property?.bedrooms || '—';
  const baths = property?.bathrooms || '—';
  const sqft = property?.area ? property.area.toLocaleString() : '—';
  const fullAddress = address?.full || '';
  const city = address?.city || '';
  const state = address?.state || 'CA';
  const zip = address?.postalCode || '';
  const description = remarks || '';
  const lotSize = property?.lotSize ? `${(property.lotSize/43560).toFixed(2)} acres` : null;
  const yearBuilt = property?.yearBuilt || null;
  const garageSpaces = property?.garageSpaces || null;
  const propType = property?.type || '';
  const agentFirst = agent?.firstName || '';
  const agentLast = agent?.lastName || '';
  const listingAgentName = `${agentFirst} ${agentLast}`.trim();
  const listingOfficeName = office?.name || office?.servingName || '';

  return (
    <div style={{paddingTop:'72px'}}>
      {/* Photo Gallery — click any photo to open lightbox */}
      {photos?.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:photos.length>1?'2fr 1fr':'1fr',gap:'4px',maxHeight:'520px',overflow:'hidden',background:COLORS.fog,position:'relative'}}>
          <div style={{position:'relative',minHeight:'400px',cursor:'pointer'}} onClick={()=>openLightbox(0)}>
            <img src={photos[0]} alt={fullAddress} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          {photos.length > 1 && (
            <div style={{display:'grid',gridTemplateRows:'1fr 1fr',gap:'4px'}}>
              {photos.slice(1,3).map((photo,i)=>(
                <div key={i} style={{position:'relative',minHeight:'200px',cursor:'pointer'}} onClick={()=>openLightbox(i+1)}>
                  <img src={photo} alt={`${fullAddress} photo ${i+2}`} loading="lazy" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}} />
                  {/* Show photo count on last visible tile */}
                  {i === 1 && photos.length > 3 && (
                    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{color:'#fff',fontFamily:"'Montserrat',sans-serif",fontSize:'16px',fontWeight:600}}>+{photos.length - 3} photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* View all photos button */}
          <button onClick={()=>openLightbox(0)} style={{
            position:'absolute',bottom:'16px',right:'16px',
            background:'rgba(0,0,0,0.7)',color:'#fff',border:'none',
            padding:'10px 18px',borderRadius:'6px',cursor:'pointer',
            fontFamily:"'Montserrat',sans-serif",fontSize:'13px',fontWeight:600,
            backdropFilter:'blur(4px)',transition:'background 0.2s ease',zIndex:2,
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.9)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.7)'}>
            View all {photos.length} photos
          </button>
        </div>
      )}

      {/* Lightbox Carousel */}
      {lightboxOpen && photos?.length > 0 && (
        <div style={{
          position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.95)',
          display:'flex',alignItems:'center',justifyContent:'center',
        }} onClick={closeLightbox}>
          {/* Close button */}
          <button onClick={closeLightbox} style={{
            position:'absolute',top:'20px',right:'24px',background:'none',border:'none',
            color:'#fff',fontSize:'32px',cursor:'pointer',zIndex:10001,padding:'8px',
            lineHeight:1,fontFamily:'sans-serif',opacity:0.8,
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity='1'}
          onMouseLeave={e=>e.currentTarget.style.opacity='0.8'}>
            &times;
          </button>

          {/* Counter */}
          <div style={{
            position:'absolute',top:'24px',left:'50%',transform:'translateX(-50%)',
            color:'rgba(255,255,255,0.7)',fontFamily:"'Montserrat',sans-serif",fontSize:'14px',fontWeight:500,
          }}>
            {currentPhoto + 1} / {photos.length}
          </div>

          {/* Prev button */}
          {photos.length > 1 && (
            <button onClick={e=>{e.stopPropagation();prevPhoto();}} style={{
              position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',
              background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',
              width:'48px',height:'48px',borderRadius:'50%',cursor:'pointer',
              fontSize:'24px',display:'flex',alignItems:'center',justifyContent:'center',
              transition:'background 0.2s ease',zIndex:10001,
            }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              &#8249;
            </button>
          )}

          {/* Main image */}
          <img
            src={photos[currentPhoto]}
            alt={`${fullAddress} photo ${currentPhoto + 1}`}
            onClick={e=>e.stopPropagation()}
            style={{
              maxWidth:'90vw',maxHeight:'85vh',objectFit:'contain',
              borderRadius:'4px',userSelect:'none',
            }}
          />

          {/* Next button */}
          {photos.length > 1 && (
            <button onClick={e=>{e.stopPropagation();nextPhoto();}} style={{
              position:'absolute',right:'16px',top:'50%',transform:'translateY(-50%)',
              background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',
              width:'48px',height:'48px',borderRadius:'50%',cursor:'pointer',
              fontSize:'24px',display:'flex',alignItems:'center',justifyContent:'center',
              transition:'background 0.2s ease',zIndex:10001,
            }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              &#8250;
            </button>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div style={{
              position:'absolute',bottom:'20px',left:'50%',transform:'translateX(-50%)',
              display:'flex',gap:'8px',maxWidth:'90vw',overflowX:'auto',padding:'8px',
            }} onClick={e=>e.stopPropagation()}>
              {photos.map((photo,i)=>(
                <img
                  key={i}
                  src={photo}
                  alt={`Thumbnail ${i+1}`}
                  onClick={()=>setCurrentPhoto(i)}
                  style={{
                    width:'64px',height:'48px',objectFit:'cover',borderRadius:'4px',
                    cursor:'pointer',opacity:i===currentPhoto?1:0.5,
                    border:i===currentPhoto?'2px solid #fff':'2px solid transparent',
                    transition:'opacity 0.2s ease, border 0.2s ease',flexShrink:0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content + Sidebar */}
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'40px 32px 80px',display:'grid',gridTemplateColumns:'1fr 360px',gap:'48px',alignItems:'start'}}>
        {/* Main Content */}
        <div>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:'32px',fontWeight:700,color:COLORS.black,marginBottom:'4px'}}>{price}</h1>
          <p style={{fontSize:'16px',color:COLORS.slate,marginBottom:'8px'}}>{fullAddress}{city?`, ${city}`:''}{state?`, ${state}`:''} {zip}</p>
          <p style={{fontSize:'15px',color:COLORS.black,fontWeight:500,marginBottom:'32px'}}>
            {beds} bd &middot; {baths} ba &middot; {sqft} sqft{lotSize?` · ${lotSize}`:''}{yearBuilt?` · Built ${yearBuilt}`:''}
          </p>

          {description && (
            <div style={{marginBottom:'40px'}}>
              <h2 style={{fontFamily:"'Montserrat',sans-serif",fontSize:'18px',fontWeight:600,marginBottom:'12px'}}>About This Property</h2>
              <p style={{fontSize:'15px',lineHeight:'1.8',color:COLORS.slate}}>{description}</p>
            </div>
          )}

          <div style={{marginBottom:'40px'}}>
            <h2 style={{fontFamily:"'Montserrat',sans-serif",fontSize:'18px',fontWeight:600,marginBottom:'16px'}}>Property Details</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 32px'}}>
              {[['MLS#',id],['Type',propType],['Bedrooms',beds],['Bathrooms',baths],['Square Feet',sqft],['Lot Size',lotSize||'—'],['Year Built',yearBuilt||'—'],['Garage',garageSpaces?`${garageSpaces} spaces`:'—']].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${COLORS.border}`}}>
                  <span style={{fontSize:'14px',color:COLORS.textMuted}}>{label}</span>
                  <span style={{fontSize:'14px',fontWeight:500,color:COLORS.black}}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Information — attribution at bottom of page ONLY */}
          <div style={{padding:'24px 0',borderTop:`1px solid ${COLORS.border}`}}>
            <h3 style={{fontFamily:"'Montserrat',sans-serif",fontSize:'14px',fontWeight:600,marginBottom:'12px',color:COLORS.black}}>Listing Information</h3>
            <p style={{fontSize:'13px',color:COLORS.textMuted,lineHeight:'1.6'}}>
              {listingAgentName && (<>Listing Courtesy of: {listingAgentName}{listingOfficeName?` — ${listingOfficeName}`:''}<br/></>)}
              {!listingAgentName && listingOfficeName && (<>Listing Courtesy of: {listingOfficeName}<br/></>)}
              MLS# {id}<br/>
              {COMPLIANCE.mlsDisclosure}
            </p>
          </div>
        </div>

        {/* Right Sidebar — site agent as buyer's agent ONLY, NO listing agent section */}
        <div style={{position:'sticky',top:'96px'}}>
          <div style={{background:COLORS.white,border:`1px solid ${COLORS.border}`,borderRadius:'10px',padding:'36px 32px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'18px',marginBottom:'24px'}}>
              <Image src={AGENT.headshot} alt={AGENT.fullName} width={82} height={82} style={{borderRadius:'50%',objectFit:'cover'}} />
              <div>
                <p style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:'22px',color:COLORS.black,lineHeight:'1.2'}}>{AGENT.fullName}</p>
                <p style={{fontSize:'15px',color:COLORS.textMuted,marginTop:'3px'}}>{COMPLIANCE.brokerName}</p>
              </div>
            </div>
            <div style={{marginBottom:'28px'}}>
              <p style={{fontSize:'16px',color:COLORS.black,lineHeight:'1.4',fontWeight:500}}>Work with {AGENT.fullName}</p>
              <p style={{fontSize:'16px',color:COLORS.slate,lineHeight:'1.4',fontStyle:'italic',fontFamily:"'Playfair Display',serif",marginTop:'4px'}}>Strategic Buyer Representation</p>
            </div>
            <a href={SITE.phoneTel} style={{display:'block',textAlign:'center',padding:'16px',background:COLORS.accentBlue,color:COLORS.white,borderRadius:'6px',fontFamily:"'Montserrat',sans-serif",fontSize:'15px',fontWeight:600,textDecoration:'none',marginBottom:'12px',transition:'background 0.25s ease',cursor:'pointer',position:'relative',zIndex:1}}
              onMouseEnter={e=>e.currentTarget.style.background=COLORS.black}
              onMouseLeave={e=>e.currentTarget.style.background=COLORS.accentBlue}>
              Call {SITE.phone}
            </a>
            <button onClick={()=>{window.dispatchEvent(new Event('sr-open-tour-form'));}} style={{display:'block',width:'100%',textAlign:'center',padding:'16px',background:'transparent',color:COLORS.accentBlue,border:`1.5px solid ${COLORS.accentBlue}`,borderRadius:'6px',fontFamily:"'Montserrat',sans-serif",fontSize:'15px',fontWeight:600,cursor:'pointer',transition:'all 0.25s ease',position:'relative',zIndex:1}}
              onMouseEnter={e=>{e.currentTarget.style.background=COLORS.accentBlue;e.currentTarget.style.color=COLORS.white;}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=COLORS.accentBlue;}}>
              Schedule a Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
