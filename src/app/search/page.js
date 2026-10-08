import { COLORS, COMPLIANCE, SITE, AGENT, BROKER } from '../../lib/brand';
import { fetchListings } from '../../lib/simplyrets';
import ListingCard from '../../components/ListingCard';
import Link from 'next/link';

const SERVICE_AREA_CITIES = [
  'Santa Rosa','Petaluma','Healdsburg','Sonoma','Windsor','Rohnert Park',
  'Cotati','Sebastopol','Cloverdale','Glen Ellen','Kenwood','Guerneville',
  'Bodega Bay','Bodega','Occidental','Forestville','Graton','Penngrove',
  'Geyserville','Cazadero','Jenner','Monte Rio','Dillon Beach',
  'Sea Ranch','Annapolis','Camp Meeker','Fulton','Larkfield',
  'San Rafael','Novato','Mill Valley','Tiburon','Sausalito','Larkspur',
  'Corte Madera','San Anselmo','Fairfax','Ross','Belvedere','Stinson Beach',
  'Bolinas','Point Reyes Station','Inverness','Greenbrae','Kentfield',
  'Woodacre','Lagunitas','Nicasio','Tomales','Marshall',
  'Napa','St. Helena','Calistoga','Yountville','American Canyon',
  'Angwin','Deer Park','Rutherford','Oakville',
];

const CITY_CHIPS = [
  'Healdsburg','Sonoma','Glen Ellen','Kenwood','Sebastopol',
  'Santa Rosa','Petaluma','Rohnert Park','Cotati','Windsor',
  'Cloverdale','Bodega Bay','The Sea Ranch','Guerneville',
  'Forestville','Occidental',
  'Mill Valley','Tiburon','Sausalito','Belvedere','Larkspur',
  'Corte Madera','San Rafael','Novato',
  'Napa','Yountville','St. Helena','Calistoga',
];

const PROPERTY_TYPES = [
  {label:'All Types',value:''},
  {label:'Single Family',value:'residential'},
  {label:'Condo / Townhome',value:'condominium'},
  {label:'Multi-Family',value:'multifamily'},
  {label:'Land',value:'land'},
];

const BED_OPTIONS = [
  {label:'Any Beds',value:''},{label:'1+',value:'1'},{label:'2+',value:'2'},
  {label:'3+',value:'3'},{label:'4+',value:'4'},{label:'5+',value:'5'},
];

const PRICE_OPTIONS = [
  {label:'No Min',value:''},{label:'$300K+',value:'300000'},
  {label:'$500K+',value:'500000'},{label:'$750K+',value:'750000'},
  {label:'$1M+',value:'1000000'},{label:'$1.5M+',value:'1500000'},
  {label:'$2M+',value:'2000000'},{label:'$3M+',value:'3000000'},
];

const MAX_PRICE_OPTIONS = [
  {label:'No Max',value:''},{label:'$500K',value:'500000'},
  {label:'$750K',value:'750000'},{label:'$1M',value:'1000000'},
  {label:'$1.5M',value:'1500000'},{label:'$2M',value:'2000000'},
  {label:'$3M',value:'3000000'},{label:'$5M',value:'5000000'},
];

export async function generateMetadata({ searchParams }) {
  const city = searchParams?.city || '';
  const title = city
    ? `${city} Homes for Sale | ${SITE.name}`
    : `Search Homes | ${AGENT.tagline} | ${AGENT.fullName}`;
  const description = city
    ? `Browse active listings in ${city}. Find your next home in Wine Country with ${AGENT.fullName}, ${BROKER.name}.`
    : 'Search homes for sale across Sonoma, Marin, and Napa counties. Live MLS data powered by BAREIS.';
  return {
    title,
    description,
    alternates: {
      canonical: '/search',
    },
  };
}

export default async function SearchPage({ searchParams }) {

  const city = searchParams?.city || '';
  const cities = searchParams?.cities || '';
  const counties = searchParams?.counties || '';
  const type = searchParams?.type || '';
  const minbeds = searchParams?.minbeds || '';
  const minbaths = searchParams?.minbaths || '';
  const minprice = searchParams?.minprice || '';
  const maxprice = searchParams?.maxprice || '';
  const minsqft = searchParams?.minsqft || '';
  const query = (searchParams?.q || '').trim();

  const apiParams = { status: 'active', limit: 48 };

  const matchedCity = query
    ? SERVICE_AREA_CITIES.find(c => c.toLowerCase() === query.toLowerCase())
    : null;
  const partialCity = query && !matchedCity
    ? SERVICE_AREA_CITIES.find(c => c.toLowerCase().includes(query.toLowerCase()))
    : null;
  const looksLikeAddress = query && /\d/.test(query);

  // Multi-city support: ?cities=Petaluma,Sebastopol or ?city=Petaluma
  const parsedCities = cities
    ? cities.split(',').map(c => c.trim()).filter(Boolean)
    : [];
  // Counties: ?counties=Sonoma,Marin → SimplyRETS counties param
  const parsedCounties = counties
    ? counties.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  if (parsedCounties.length > 0) {
    apiParams.counties = parsedCounties;
  }
  if (parsedCities.length > 0) {
    apiParams.cities = parsedCities;
  } else if (city) {
    apiParams.cities = [city];
  } else if (looksLikeAddress) {
    apiParams.q = query;
  } else if (matchedCity) {
    apiParams.cities = [matchedCity];
  } else if (partialCity) {
    apiParams.cities = [partialCity];
  } else if (query) {
    apiParams.q = query;
  } else {
    apiParams.cities = [
      'Santa Rosa','Petaluma','Healdsburg','Sonoma','Windsor',
      'Sebastopol','Bodega Bay','Novato','San Rafael','Napa',
      'St. Helena','Calistoga','Glen Ellen','Mill Valley',
    ];
  }

  if (type) {
    apiParams.type = type;
  } else {
    apiParams.type = ['residential', 'rental', 'condominium', 'multifamily', 'land', 'commercial'];
  }
  if (minbeds) apiParams.minbeds = parseInt(minbeds, 10);
  if (minbaths) apiParams.minbathrooms = parseInt(minbaths, 10);
  if (minprice) apiParams.minprice = parseInt(minprice, 10);
  if (maxprice) apiParams.maxprice = parseInt(maxprice, 10);
  if (minsqft) apiParams.minarea = parseInt(minsqft, 10);

  let listings = [];
  let fetchError = null;
  try {
    listings = await fetchListings(apiParams);
    if (!apiParams.q) {
      listings = listings.filter(l => {
        const c = l?.address?.city || '';
        return SERVICE_AREA_CITIES.some(s => s.toLowerCase() === c.toLowerCase());
      });
    }
  } catch (err) {
    console.error('[SearchPage] fetch error:', err);
    fetchError = err.message;
  }

  const heading = city
    ? `Homes for Sale in ${city}`
    : query
      ? `Search Results for "${query}"`
      : 'Search All Homes';

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#FFFFFF'}}>
      <div style={{backgroundColor:'#1A1A1B',padding:'100px 24px 32px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',fontWeight:400,color:'#FFFFFF',margin:'0 0 8px 0'}}>{heading}</h1>
          <p style={{fontFamily:"'Open Sans',sans-serif",fontSize:'0.95rem',color:'rgba(255,255,255,0.6)',margin:'0 0 24px 0'}}>Sonoma &middot; Marin &middot; Napa</p>
          <form action="/search" method="GET" role="search" aria-label="Property search" style={{display:'flex',gap:8,marginBottom:20,maxWidth:600}}>
            <input type="text" name="q" defaultValue={query||city} aria-label="Search by city, neighborhood, or address" placeholder="Search by city, neighborhood, or address..." style={{flex:1,padding:'12px 16px',fontSize:'1rem',fontFamily:"'Open Sans',sans-serif",border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,backgroundColor:'rgba(255,255,255,0.1)',color:'#FFFFFF',outline:'none'}} />
            <button type="submit" style={{padding:'12px 24px',backgroundColor:'#2F4A63',color:'#FFFFFF',border:'none',borderRadius:6,fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:'0.9rem',cursor:'pointer',letterSpacing:'0.5px'}}>SEARCH</button>
          </form>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            <Link href="/search" style={{padding:'6px 14px',borderRadius:20,fontSize:'0.8rem',fontFamily:"'Open Sans',sans-serif",textDecoration:'none',backgroundColor:!city?'#2F4A63':'rgba(255,255,255,0.1)',color:'#FFFFFF',border:'1px solid rgba(255,255,255,0.2)'}}>All Areas</Link>
            {CITY_CHIPS.map(c=>(
              <Link key={c} href={`/search?city=${encodeURIComponent(c)}${type?`&type=${type}`:''}${minbeds?`&minbeds=${minbeds}`:''}${minprice?`&minprice=${minprice}`:''}${maxprice?`&maxprice=${maxprice}`:''}`} style={{padding:'6px 14px',borderRadius:20,fontSize:'0.8rem',fontFamily:"'Open Sans',sans-serif",textDecoration:'none',backgroundColor:city===c?'#2F4A63':'rgba(255,255,255,0.1)',color:'#FFFFFF',border:'1px solid rgba(255,255,255,0.2)'}}>{c}</Link>
            ))}
          </div>
        </div>
      </div>
      <div style={{backgroundColor:'#F4F4F2',borderBottom:'1px solid #E0E0E0',padding:'16px 24px'}}>
        <form action="/search" method="GET" style={{maxWidth:1200,margin:'0 auto',display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
          {city && <input type="hidden" name="city" value={city} />}
          <select name="type" defaultValue={type} aria-label="Property type" style={{padding:'8px 12px',borderRadius:6,border:'1px solid #CCC',fontFamily:"'Open Sans',sans-serif",fontSize:'0.85rem',backgroundColor:'#FFFFFF',minWidth:150}}>
            {PROPERTY_TYPES.map(t=>(<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
          <select name="minbeds" defaultValue={minbeds} aria-label="Minimum bedrooms" style={{padding:'8px 12px',borderRadius:6,border:'1px solid #CCC',fontFamily:"'Open Sans',sans-serif",fontSize:'0.85rem',backgroundColor:'#FFFFFF',minWidth:100}}>
            {BED_OPTIONS.map(b=>(<option key={b.value} value={b.value}>{b.label}</option>))}
          </select>
          <select name="minprice" defaultValue={minprice} aria-label="Minimum price" style={{padding:'8px 12px',borderRadius:6,border:'1px solid #CCC',fontFamily:"'Open Sans',sans-serif",fontSize:'0.85rem',backgroundColor:'#FFFFFF',minWidth:120}}>
            {PRICE_OPTIONS.map(p=>(<option key={p.value} value={p.value}>{p.label}</option>))}
          </select>
          <select name="maxprice" defaultValue={maxprice} aria-label="Maximum price" style={{padding:'8px 12px',borderRadius:6,border:'1px solid #CCC',fontFamily:"'Open Sans',sans-serif",fontSize:'0.85rem',backgroundColor:'#FFFFFF',minWidth:120}}>
            {MAX_PRICE_OPTIONS.map(p=>(<option key={p.value} value={p.value}>{p.label}</option>))}
          </select>
          <button type="submit" style={{padding:'8px 20px',backgroundColor:'#2F4A63',color:'#FFFFFF',border:'none',borderRadius:6,fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:'0.8rem',cursor:'pointer',letterSpacing:'0.5px'}}>APPLY FILTERS</button>
          {(type||minbeds||minprice||maxprice||city||query) && (<Link href="/search" style={{fontFamily:"'Open Sans',sans-serif",fontSize:'0.8rem',color:'#2F4A63',textDecoration:'underline'}}>Clear All</Link>)}
        </form>
      </div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 24px 64px'}}>
        {fetchError ? (
          <div style={{textAlign:'center',padding:'60px 24px',fontFamily:"'Open Sans',sans-serif",color:'#4A4E51'}}>
            <p style={{fontSize:'1.1rem',marginBottom:8}}>Unable to load listings right now.</p>
            <p style={{fontSize:'0.9rem',color:'#999'}}>Please try again in a moment.</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 24px',fontFamily:"'Open Sans',sans-serif",color:'#4A4E51'}}>
            <p style={{fontSize:'1.2rem',marginBottom:12}}>No listings match your search.</p>
            <p style={{fontSize:'0.95rem',color:'#777',marginBottom:24}}>Try broadening your filters or searching a different area.</p>
            <Link href="/search" style={{display:'inline-block',padding:'10px 24px',backgroundColor:'#2F4A63',color:'#FFFFFF',borderRadius:6,fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:'0.85rem',textDecoration:'none'}}>VIEW ALL LISTINGS</Link>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:24}}>
            {listings.map(listing=>(<ListingCard key={listing.mlsId} listing={listing} />))}
          </div>
        )}
        <div style={{marginTop:48,padding:'16px 0',borderTop:'1px solid #E0E0E0',textAlign:'center'}}>
          <p style={{fontFamily:"'Open Sans',sans-serif",fontSize:'0.7rem',color:'#999',lineHeight:1.5}}>
            Information is deemed reliable but not guaranteed. Data provided by BAREIS MLS. IDX information is provided exclusively for personal, non-commercial use. DRE# {COMPLIANCE.agentDRE} &middot; Broker DRE# {COMPLIANCE.brokerDRE}
          </p>
        </div>
      </div>
    </div>
  );
}
