/* ================================================================
   Cleartrip AI · Results Page · results.js
   ================================================================ */

/* ── DATA ──────────────────────────────────────────────────────── */
// Legacy flat list (kept for getItemCoords lookups)
const FLIGHTS = [
  { id:'f1', icon:'🇸🇬', airline:'Singapore Airlines', from:'BLR', to:'NRT',
    dep:'06:30', arr:'20:15', dur:'9h 45m', stops:'1 stop · SIN',
    price:'₹48,200', tag:'✦ AI pick', tagClass:'ai' },
  { id:'f2', icon:'🇯🇵', airline:'Air India + ANA', from:'BLR', to:'NRT',
    dep:'10:00', arr:'01:40+1', dur:'11h 40m', stops:'1 stop · DEL',
    price:'₹38,900', tag:'Cheapest', tagClass:'' },
  { id:'f3', icon:'🇦🇪', airline:'Emirates', from:'BLR', to:'NRT',
    dep:'14:30', arr:'07:10+1', dur:'13h 40m', stops:'1 stop · DXB',
    price:'₹44,600', tag:null, tagClass:'' },
];

/* ── FLIGHT CATEGORIES ─────────────────────────────────────────── */
const FLIGHT_CATEGORIES = [
  {
    id: 'arrive_early',
    title: 'Arrive in Tokyo before the concert',
    subtitle: 'Land by Aug 26 · Give yourself 2 days to settle in',
    aiNote: '✦ Most concert-goers arrive 2 days early — Aug 24 or 26 most popular',
    flights: [
      { id:'fa1', icon:'🇸🇬', airline:'Singapore Airlines',
        from:'BLR', to:'NRT', date:'Mon, Aug 26',
        dep:'06:30', arr:'20:15', dur:'9h 45m', stops:'1 stop · SIN',
        price:'₹48,200', tag:'ai', tagText:'✦ AI pick · Best timing',
        badge: null },
      { id:'fa2', icon:'🇮🇳', airline:'Air India + ANA',
        from:'BLR', to:'NRT', date:'Sat, Aug 24',
        dep:'10:00', arr:'01:40+1', dur:'11h 40m', stops:'1 stop · DEL',
        price:'₹41,600', tag:'deal', tagText:'2 days early',
        badge: 'Extra day in Tokyo' },
      { id:'fa3', icon:'🇦🇪', airline:'Emirates',
        from:'BLR', to:'NRT', date:'Mon, Aug 26',
        dep:'22:15', arr:'14:30+1', dur:'12h 15m', stops:'1 stop · DXB',
        price:'₹44,600', tag: null, tagText: null,
        badge: null },
    ]
  },
  {
    id: 'flexible',
    title: 'Flexible by ±2 days · Save up to 31%',
    subtitle: 'AI compared 400+ date combos · Biggest savings highlighted',
    aiNote: '✦ Flying Aug 23 saves ₹14,800 — prices spike closer to the concert',
    flights: [
      { id:'ff1', icon:'🇸🇬', airline:'Singapore Airlines',
        from:'BLR', to:'NRT', date:'Sat, Aug 23',
        dep:'06:30', arr:'20:15', dur:'9h 45m', stops:'1 stop · SIN',
        price:'₹33,400', tag:'deal', tagText:'Save ₹14,800',
        badge: '3 days before concert' },
      { id:'ff2', icon:'🇮🇳', airline:'IndiGo + ANA',
        from:'BLR', to:'NRT', date:'Sun, Aug 24',
        dep:'08:15', arr:'22:40', dur:'10h 25m', stops:'1 stop · BOM',
        price:'₹36,200', tag:'ai', tagText:'✦ Best value',
        badge: null },
      { id:'ff3', icon:'🇯🇵', airline:'Japan Airlines',
        from:'BLR', to:'NRT', date:'Tue, Aug 27',
        dep:'13:40', arr:'05:20+1', dur:'11h 40m', stops:'1 stop · SIN',
        price:'₹39,800', tag: null, tagText: null,
        badge: 'Arrive day before concert' },
    ]
  },
  {
    id: 'return',
    title: 'Return flights · NRT → BLR',
    subtitle: 'After your last day · Sep 8–10 options',
    aiNote: '✦ Sep 9 morning has the most seat availability right now',
    flights: [
      { id:'fr1', icon:'🇸🇬', airline:'Singapore Airlines',
        from:'NRT', to:'BLR', date:'Tue, Sep 8',
        dep:'11:30', arr:'18:45', dur:'10h 15m', stops:'1 stop · SIN',
        price:'₹51,400', tag: null, tagText: null,
        badge: 'Last day of trip' },
      { id:'fr2', icon:'🇯🇵', airline:'ANA',
        from:'NRT', to:'BLR', date:'Wed, Sep 9',
        dep:'09:40', arr:'16:20', dur:'11h 40m', stops:'1 stop · HND',
        price:'₹39,600', tag:'deal', tagText:'Cheapest return',
        badge: null },
      { id:'fr3', icon:'🇦🇪', airline:'Emirates',
        from:'NRT', to:'BLR', date:'Thu, Sep 10',
        dep:'15:00', arr:'20:30', dur:'13h 30m', stops:'1 stop · DXB',
        price:'₹42,800', tag:'ai', tagText:'✦ Stay one more day',
        badge: 'Sep 10 · Extra night' },
    ]
  },
  {
    id: 'stopover',
    title: 'Stopovers worth turning into mini-trips',
    subtitle: 'Long layovers AI flagged as worth exploring',
    aiNote: '✦ 8hr Singapore layover = time for Gardens by the Bay at sunset',
    flights: [
      { id:'fs1', icon:'🇸🇬', airline:'Singapore Airlines',
        from:'BLR', to:'NRT', date:'Mon, Aug 26',
        dep:'06:30', arr:'20:15', dur:'9h 45m', stops:'8hr layover · SIN',
        price:'₹48,200', tag:'ai', tagText:'✦ Worth the wait',
        badge: null, stopoverTip: '🇸🇬 Explore Singapore · Gardens by the Bay' },
      { id:'fs2', icon:'🇦🇪', airline:'Emirates',
        from:'BLR', to:'NRT', date:'Mon, Aug 26',
        dep:'14:30', arr:'07:10+1', dur:'13h 40m', stops:'6hr layover · DXB',
        price:'₹44,600', tag: null, tagText: null,
        badge: null, stopoverTip: '🇦🇪 Explore Dubai · Dubai Mall + Burj Khalifa' },
    ]
  },
];

// Legacy flat list (kept for getItemCoords)
const HOTELS = [
  { id:'h1', name:'Park Hyatt Tokyo',        coords:[139.6902, 35.6892] },
  { id:'h2', name:'Cerulean Tower Tokyu',    coords:[139.6966, 35.6579] },
  { id:'h3', name:'Hotel Gracery Shinjuku',  coords:[139.7004, 35.6941] },
  { id:'h4', name:'Aman Tokyo',              coords:[139.7574, 35.6867] },
  { id:'h5', name:'Toyoko Inn Narita',       coords:[140.3161, 35.7720] },
  { id:'h6', name:'Richmond Hotel Narita',   coords:[140.3188, 35.7744] },
  { id:'h7', name:'Dormy Inn Akihabara',     coords:[139.7733, 35.6984] },
  { id:'h8', name:'APA Hotel Makuhari',      coords:[140.0432, 35.6476] },
  { id:'h9', name:'Hotel MyStays Asakusa',   coords:[139.7938, 35.7145] },
  { id:'h10',name:'Hostel & Bar Cerulean',   coords:[139.6966, 35.6580] },
];

/* ── HOTEL CATEGORIES ──────────────────────────────────────────── */
const HOTEL_CATEGORIES = [
  {
    id: 'near_concert',
    title: 'Near Hatsune Miku Concert Venue',
    subtitle: 'Makuhari Messe · Aug 28 · Walk or short train ride',
    aiNote: '✦ AI pick — 12 min from venue by taxi · Best availability this week',
    hotels: [
      { id:'h8', name:'APA Hotel Makuhari',
        location:'Mihama-ku · Chiba',
        img:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80&auto=format&fit=crop',
        meta:'Concert zone · Aug 26–Sep 8 · 14 nights',
        rating:'4.3', reviews:'6.1k', price:'₹5,800', priceUnit:'/night',
        tag:'ai', tagText:'✦ Closest to venue',
        coords:[140.0432, 35.6476] },
      { id:'h9', name:'Hotel MyStays Asakusa',
        location:'Asakusa · Tokyo',
        img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&auto=format&fit=crop',
        meta:'30 min to venue · Aug 26–Sep 8',
        rating:'4.5', reviews:'4.2k', price:'₹7,200', priceUnit:'/night',
        tag:null, tagText:null,
        coords:[139.7938, 35.7145] },
    ]
  },
  {
    id: 'near_airport',
    title: 'Near Narita Airport · Best for arrival day',
    subtitle: 'Your flight lands at NRT · Rest before exploring',
    aiNote: '✦ Singapore Airlines lands 20:15 on Aug 26 — stay nearby, head to Tokyo next morning',
    hotels: [
      { id:'h5', name:'Toyoko Inn Narita Airport',
        location:'Narita · Chiba',
        img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop',
        meta:'2 min walk to terminal · Aug 26 only',
        rating:'4.4', reviews:'8.3k', price:'₹4,200', priceUnit:'/night',
        tag:'deal', tagText:'Cheapest near NRT',
        coords:[140.3161, 35.7720] },
      { id:'h6', name:'Richmond Hotel Narita',
        location:'Narita · Chiba',
        img:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80&auto=format&fit=crop',
        meta:'Free shuttle · Breakfast included · Aug 26',
        rating:'4.6', reviews:'3.1k', price:'₹6,100', priceUnit:'/night',
        tag:'ai', tagText:'✦ Best for late arrival',
        coords:[140.3188, 35.7744] },
    ]
  },
  {
    id: 'central',
    title: 'Central Tokyo · Best base for exploring',
    subtitle: 'Shinjuku & Shibuya · 20 min or less to your events',
    aiNote: '✦ 3 of your saved events are within 15 min of Shinjuku',
    hotels: [
      { id:'h1', name:'Park Hyatt Tokyo',
        location:'Shinjuku · Tokyo',
        img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80&auto=format&fit=crop',
        meta:'Pool · Spa · Rooftop bar · Aug 26–Sep 8',
        rating:'4.9', reviews:'2,341', price:'₹18,500', priceUnit:'/night',
        tag:'ai', tagText:'✦ AI top pick',
        coords:[139.6902, 35.6892] },
      { id:'h3', name:'Hotel Gracery Shinjuku',
        location:'Kabukicho · Shinjuku',
        img:'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=700&q=80&auto=format&fit=crop',
        meta:'Godzilla view · Kabukicho · Aug 26–Sep 8',
        rating:'4.5', reviews:'3,102', price:'₹8,200', priceUnit:'/night',
        tag:null, tagText:null,
        coords:[139.7004, 35.6941] },
      { id:'h2', name:'Cerulean Tower Tokyu',
        location:'Shibuya · Tokyo',
        img:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=80&auto=format&fit=crop',
        meta:'Rooftop panorama · Jazz bar · Aug 26–Sep 8',
        rating:'4.7', reviews:'1,820', price:'₹12,800', priceUnit:'/night',
        tag:'deal', tagText:'Best value',
        coords:[139.6966, 35.6579] },
    ]
  },
  {
    id: 'budget',
    title: 'Budget friendly · Under ₹7,000/night',
    subtitle: 'AI found great value — 4★ quality, lower price',
    aiNote: '✦ Dormy Inn Akihabara is 8 min walk to the anime cafes in your plan',
    hotels: [
      { id:'h7', name:'Dormy Inn Akihabara',
        location:'Akihabara · Tokyo',
        img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80&auto=format&fit=crop',
        meta:'Onsen · Near Gundam Cafe · Aug 26–Sep 8',
        rating:'4.6', reviews:'5.4k', price:'₹5,400', priceUnit:'/night',
        tag:'ai', tagText:'✦ Near your events',
        coords:[139.7733, 35.6984] },
      { id:'h10', name:'Hostel & Bar Cerulean',
        location:'Shibuya · Tokyo',
        img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&auto=format&fit=crop',
        meta:'Rooftop bar · Social vibe · Aug 26–Sep 8',
        rating:'4.3', reviews:'2.9k', price:'₹3,800', priceUnit:'/night',
        tag:'deal', tagText:'Cheapest pick',
        coords:[139.6966, 35.6580] },
    ]
  },
  {
    id: 'luxury',
    title: 'Luxury · Splurge-worthy stays',
    subtitle: 'Top-rated · Rooftop bars · Spa · Fine dining',
    aiNote: '✦ Aman Tokyo is 22 min from Makuhari Messe by express train',
    hotels: [
      { id:'h4', name:'Aman Tokyo',
        location:'Otemachi · Tokyo',
        img:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80&auto=format&fit=crop',
        meta:'Urban sanctuary · Fine dining · Aug 26–Sep 8',
        rating:'4.9', reviews:'890', price:'₹38,000', priceUnit:'/night',
        tag:'ai', tagText:'Luxury pick',
        coords:[139.7574, 35.6867] },
    ]
  },
];

const EVENTS = [
  { id:'e1', name:'Senso-ji Temple & Nakamise',
    location:'Asakusa · Tokyo',
    img:'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=700&q=80&auto=format&fit=crop',
    meta:'Half day · Culture · Street food',
    rating:'4.8', reviews:'8.2k', price:'Free',
    tag:'ai', tagText:'✦ AI pick · Hidden tips',
    coords:[139.7967, 35.7148] },
  { id:'e2', name:'teamLab Borderless',
    location:'Azabudai · Tokyo',
    img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80&auto=format&fit=crop',
    meta:'3–4 hrs · Digital art immersion',
    rating:'4.9', reviews:'5.4k', price:'₹3,200',
    tag:'deal', tagText:'Book ahead',
    coords:[139.7330, 35.6654] },
  { id:'e3', name:'Mt. Fuji Day Trip',
    location:'Hakone · Day trip',
    img:'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=700&q=80&auto=format&fit=crop',
    meta:'Full day · Guided · Hotel pickup',
    rating:'4.7', reviews:'3.1k', price:'₹5,800',
    tag:null, tagText:null,
    coords:[138.7274, 35.3606] },
  { id:'e4', name:'Tsukiji Fish Market Tour',
    location:'Tsukiji · Tokyo',
    img:'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=700&q=80&auto=format&fit=crop',
    meta:'2 hrs · Morning · 10+ tastings',
    rating:'4.8', reviews:'2.8k', price:'₹2,400',
    tag:'ai', tagText:'✦ AI pick',
    coords:[139.7706, 35.6654] },
  { id:'e5', name:'Edo Castle & Imperial Palace',
    location:'Marunouchi · Tokyo',
    img:'https://images.unsplash.com/photo-1488702823827-df2beea4b3f7?w=700&q=80&auto=format&fit=crop',
    meta:'Half day · Free entry · History',
    rating:'4.6', reviews:'4.2k', price:'Free',
    tag:null, tagText:null,
    coords:[139.7528, 35.6852] },
];

/* ── EVENT CATEGORIES ──────────────────────────────────────────── */
const EVENT_CATEGORIES = [
  {
    id:'concert_area', anchor:true,
    title:'Near Hatsune Miku Concert Venue',
    subtitle:'Makuhari Messe · Aug 28 · Curated for your trip',
    events:[
      { id:'ca1', name:'Makuhari Seaside Park',
        location:'Mihama-ku · Chiba',
        img:'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80&auto=format&fit=crop',
        meta:'Free · 20 min from venue · Walk & relax pre-show',
        rating:'4.6', reviews:'2.1k', price:'Free',
        tag:'anchor', tagText:'🎤 Concert day',
        coords:[140.0311,35.6458] },
      { id:'ca2', name:'Joypolis SEGA Indoor Park',
        location:'Odaiba · Tokyo',
        img:'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80&auto=format&fit=crop',
        meta:'3–4 hrs · VR rides · Anime games',
        rating:'4.5', reviews:'3.4k', price:'₹3,800',
        tag:'ai', tagText:'✦ Great before concert',
        coords:[139.7756,35.6284] },
      { id:'ca3', name:'AquaCity Odaiba & Rainbow Bridge',
        location:'Odaiba · Tokyo',
        img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80&auto=format&fit=crop',
        meta:'Free · Waterfront · Mt. Fuji views',
        rating:'4.4', reviews:'5.2k', price:'Free',
        tag:null, tagText:null,
        coords:[139.7756,35.6284] },
      { id:'ca4', name:'Warp Tokyo Live Music',
        location:'Koto-ku · Tokyo',
        img:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80&auto=format&fit=crop',
        meta:'Evening · Electronic & anime music',
        rating:'4.7', reviews:'890', price:'₹2,500',
        tag:null, tagText:null,
        coords:[139.8333,35.6288] },
    ]
  },
  {
    id:'free_things',
    title:'Free Things To Do',
    subtitle:'No entry fee · Just your time',
    events:[
      { id:'ft1', name:'Senso-ji Temple & Nakamise',
        location:'Asakusa · Tokyo',
        img:'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80&auto=format&fit=crop',
        meta:'Half day · Culture · Street food',
        rating:'4.8', reviews:'8.2k', price:'Free',
        tag:'ai', tagText:'✦ Top pick',
        coords:[139.7967,35.7148] },
      { id:'ft2', name:'Meiji Shrine & Forest Walk',
        location:'Harajuku · Tokyo',
        img:'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80&auto=format&fit=crop',
        meta:'2 hrs · Peaceful ancient cedar forest',
        rating:'4.7', reviews:'6.8k', price:'Free',
        tag:null, tagText:null,
        coords:[139.6994,35.6763] },
      { id:'ft3', name:'Shibuya Crossing & Sky View',
        location:'Shibuya · Tokyo',
        img:'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80&auto=format&fit=crop',
        meta:"1 hr · World's busiest crossing",
        rating:'4.5', reviews:'12k', price:'Free',
        tag:null, tagText:null,
        coords:[139.7006,35.6591] },
      { id:'ft4', name:'Ueno Park & Street Performers',
        location:'Ueno · Tokyo',
        img:'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80&auto=format&fit=crop',
        meta:'Half day · Zoo · Temples · Cherry trees',
        rating:'4.6', reviews:'9.1k', price:'Free',
        tag:null, tagText:null,
        coords:[139.7726,35.7153] },
    ]
  },
  {
    id:'anime_cafes',
    title:'Anime-Themed Cafes',
    subtitle:'Perfect for Miku fans · Akihabara & beyond',
    events:[
      { id:'ac1', name:'Gundam Cafe Akihabara',
        location:'Akihabara · Tokyo',
        img:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80&auto=format&fit=crop',
        meta:'1.5 hrs · Themed drinks & merch shop',
        rating:'4.4', reviews:'3.2k', price:'₹1,800',
        tag:'ai', tagText:'✦ Miku fans love this',
        coords:[139.7714,35.6984] },
      { id:'ac2', name:'Kirby Café Tokyo',
        location:'Tokyo Skytree · Sumida',
        img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&auto=format&fit=crop',
        meta:'1.5 hrs · Book ahead · Kawaii food',
        rating:'4.6', reviews:'2.1k', price:'₹2,200',
        tag:'deal', tagText:'Book 2 wks ahead',
        coords:[139.8108,35.7101] },
      { id:'ac3', name:'Maid Cafe Experience',
        location:'Akihabara · Tokyo',
        img:'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80&auto=format&fit=crop',
        meta:'1 hr · Cultural · Tea & cakes ceremony',
        rating:'4.3', reviews:'5.6k', price:'₹1,200',
        tag:null, tagText:null,
        coords:[139.7733,35.6998] },
      { id:'ac4', name:'teamLab Borderless',
        location:'Azabudai · Tokyo',
        img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&auto=format&fit=crop',
        meta:'3–4 hrs · Immersive digital art world',
        rating:'4.9', reviews:'5.4k', price:'₹3,200',
        tag:'deal', tagText:'Book ahead',
        coords:[139.7330,35.6654] },
    ]
  },
  {
    id:'day_trips',
    title:'Day Trips from Tokyo',
    subtitle:'Worth the journey · 1–2 hrs away',
    events:[
      { id:'dt1', name:'Mt. Fuji & Kawaguchiko Lake',
        location:'Hakone · 2 hrs from Tokyo',
        img:'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80&auto=format&fit=crop',
        meta:'Full day · Guided · Hotel pickup',
        rating:'4.7', reviews:'3.1k', price:'₹5,800',
        tag:'ai', tagText:'✦ Must do',
        coords:[138.7274,35.3606] },
      { id:'dt2', name:'Nikko Shrines & Waterfalls',
        location:'Nikko · 2 hrs from Tokyo',
        img:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80&auto=format&fit=crop',
        meta:'Full day · UNESCO Heritage · Guided',
        rating:'4.8', reviews:'2.4k', price:'₹4,200',
        tag:null, tagText:null,
        coords:[139.5997,36.7483] },
      { id:'dt3', name:'Kamakura Giant Buddha & Temples',
        location:'Kamakura · 1 hr from Tokyo',
        img:'https://images.unsplash.com/photo-1519998071095-fccdb5e1f9d7?w=600&q=80&auto=format&fit=crop',
        meta:'Half day · Temples · Beach',
        rating:'4.6', reviews:'4.8k', price:'₹800',
        tag:null, tagText:null,
        coords:[139.5347,35.3160] },
    ]
  },
];

/* ── MAP MARKERS ───────────────────────────────────────────────── */
// Haneda Airport (HND) — the flight arrival, visible in central Tokyo map
const AIRPORT_COORDS = [139.7798, 35.5494];
const AIRPORT_LABEL  = '✈ HND · Tokyo';

/* ── PLAN STATE ────────────────────────────────────────────────── */
const DAYS = [
  { label:'Day 1',  date:'Aug 26', dow:'Tue', cls:'d1'  },
  { label:'Day 2',  date:'Aug 27', dow:'Wed', cls:'d2'  },
  { label:'Day 3',  date:'Aug 28', dow:'Thu', cls:'d3', concert:true }, // 🎤 Concert day
  { label:'Day 4',  date:'Aug 29', dow:'Fri', cls:'d4'  },
  { label:'Day 5',  date:'Aug 30', dow:'Sat', cls:'d5'  },
  { label:'Day 6',  date:'Aug 31', dow:'Sun', cls:'d6'  },
  { label:'Day 7',  date:'Sep 1',  dow:'Mon', cls:'d7'  },
  { label:'Day 8',  date:'Sep 2',  dow:'Tue', cls:'d8'  },
  { label:'Day 9',  date:'Sep 3',  dow:'Wed', cls:'d9'  },
  { label:'Day 10', date:'Sep 4',  dow:'Thu', cls:'d10' },
  { label:'Day 11', date:'Sep 5',  dow:'Fri', cls:'d11' },
  { label:'Day 12', date:'Sep 6',  dow:'Sat', cls:'d12' },
  { label:'Day 13', date:'Sep 7',  dow:'Sun', cls:'d13' },
  { label:'Day 14', date:'Sep 8',  dow:'Mon', cls:'d14' },
];
let planItems  = [];
let addedIds   = new Set();

/* ── PLAN ICON SVGs ─────────────────────────────────────────────── */
const PLAN_ICONS = {
  flight: `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 2.5a1.5 1.5 0 0 0-3 0v4.88L2.37 10.1A1 1 0 0 0 2 11v1.5a1 1 0 0 0 1.27.96L8 12.02V14.5l-1.5 1V17l3.5-.8 3.5.8v-1.5L12 14.5v-2.48l4.73 1.44A1 1 0 0 0 18 12.5V11a1 1 0 0 0-.37-.9L12 7.38V2.5z"/></svg>`,
  hotel:  `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12H4V4zm3 2a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7zm-1 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4H6v-4zm2-1a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1z"/></svg>`,
  concert:`<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm-5.9 8a1 1 0 1 0-2 0 7.9 7.9 0 0 0 6.9 7.83V19H7a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-1.17A7.9 7.9 0 0 0 17.9 10a1 1 0 1 0-2 0 5.9 5.9 0 0 1-11.8 0z"/></svg>`,
  cafe:   `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1h1a2 2 0 0 1 0 4h-1.17A5.001 5.001 0 0 1 10 14H6a5 5 0 0 1-4.9-4H1V7a1 1 0 0 1 1-1V5zm2 2v1.17A3 3 0 0 0 6 13h4a3 3 0 0 0 3-3V7H5zm10 0v2h1a0 0 0 0 0 0-2h-1z"/><rect x="7" y="15" width="6" height="2" rx="1"/></svg>`,
  trip:   `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 2L4.27 9H7v8h6V9h2.73L10 2zM3 18h14v1H3v-1z"/></svg>`,
  event:  `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>`,
};

/** Map an event itemId to an icon subtype */
function getEventSubtype(itemId) {
  const base = itemId.split('_')[0];
  if (base === 'concert_aug28' || base === 'ca4') return 'concert';
  if (base.startsWith('ac')) return 'cafe';
  if (base.startsWith('dt')) return 'trip';
  return 'event';
}

/** Render a single icon chip for a plan item */
function getItemIconHtml(item, isNew) {
  let key, colorCls;
  if (item.type === 'flight') {
    key = 'flight'; colorCls = 'hps-icon--flight';
  } else if (item.type === 'hotel') {
    key = 'hotel'; colorCls = 'hps-icon--hotel';
  } else {
    key = item.isAnchor ? 'concert' : getEventSubtype(item.id);
    colorCls = 'hps-icon--event';
  }
  const svgHtml = PLAN_ICONS[key] || PLAN_ICONS.event;
  return `<div class="hps-icon ${colorCls}${isNew ? ' hps-icon--new' : ''}" title="${item.name}">${svgHtml}</div>`;
}
let currentDay = 0;     // day index currently being filled
let itemsOnDay = [];    // {isShort} entries for items on currentDay

/* ── Duration helpers ──────────────────────────────────────────── */
function getEventMeta(itemId) {
  for (const cat of EVENT_CATEGORIES) {
    const e = cat.events.find(e => e.id === itemId);
    if (e) return e.meta || '';
  }
  return EVENTS.find(e => e.id === itemId)?.meta || '';
}

function extractDurationHours(meta) {
  if (!meta) return null;
  const m = meta.toLowerCase();
  const minM = m.match(/(\d+)\s*min/);          if (minM) return +minM[1] / 60;
  const rngM = m.match(/(\d+)[–\-](\d+)\s*hr/); if (rngM) return (+rngM[1] + +rngM[2]) / 2;
  const hrM  = m.match(/(\d+(?:\.\d+)?)\s*hr/); if (hrM)  return +hrM[1];
  if (m.includes('half day')) return 4;
  if (m.includes('full day')) return 8;
  return null;
}

function canAddToCurrentDay(isShort) {
  if (itemsOnDay.length === 0) return true;      // empty day — anything fits
  if (!isShort) return false;                    // long activity needs its own day
  const hasLong = itemsOnDay.some(s => !s.isShort);
  const shorts  = itemsOnDay.filter(s => s.isShort).length;
  return !hasLong && shorts < 3;                 // max 3 short items per day
}

/** Peek at which day the next event would land on without mutating state */
function peekNextEventDay(isShort) {
  const day = canAddToCurrentDay(isShort) ? currentDay : currentDay + 1;
  return day % DAYS.length;
}

/* ── MAP STATE ─────────────────────────────────────────────────── */
let hotelMap   = null;
let eventMap   = null;
let planMap    = null;
let hotelMapReady = false;
let eventMapReady = false;
let planMapReady  = false;
let planMarkers   = [];

const eventMarkerEls  = {};        // eventId → DOM element (for progressive reveal)
const revealedEvents  = new Set(); // eventIds that have been time-revealed

const DAY_COLORS = ['#3B55D9','#C94020','#15803D','#6D28D9','#92600A'];

const MAKUHARI_MESSE_COORDS = [140.0290, 35.6480];

function getItemCoords(planItem) {
  // Concert anchor (Hatsune Miku / Makuhari Messe) — fixed coords
  if (planItem.isAnchor) return MAKUHARI_MESSE_COORDS;

  const dataId = planItem.id.split('_')[0];
  if (planItem.type === 'hotel') return HOTELS.find(h => h.id === dataId)?.coords;
  if (planItem.type === 'event') {
    const legacy = EVENTS.find(e => e.id === dataId);
    if (legacy) return legacy.coords;
    for (const cat of EVENT_CATEGORIES) {
      const e = cat.events.find(e => e.id === dataId);
      if (e) return e.coords;
    }
  }
  return null;
}

/* ── MAP STYLE ─────────────────────────────────────────────────── */
function buildMapStyle() {
  const C = {
    land:'#FAF8F4', water:'#99DAF6', waterway:'#ABDCF0',
    park:'#D8EDD0', building:'#EDE8DF', building_ol:'#D8C9A3',
    road_major:'#E8ECEB', road_minor:'#EAEAEA', road_casing:'#BEBDB7',
    label_city:'#2A1A08', label_place:'#4A3020',
    label_road:'#7A6858', label_water:'#4A7890',
  };
  const ramp = (z1,v1,z2,v2) => ['interpolate',['linear'],['zoom'],z1,v1,z2,v2];
  return {
    version: 8,
    sources: { ofm: { type:'vector', url:'https://tiles.openfreemap.org/planet' } },
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    layers: [
      { id:'bg', type:'background', paint:{'background-color':C.land} },
      { id:'water', type:'fill', source:'ofm', 'source-layer':'water',
        paint:{'fill-color':C.water} },
      { id:'waterway', type:'line', source:'ofm', 'source-layer':'waterway',
        paint:{'line-color':C.waterway,'line-width':ramp(10,0.5,16,3)} },
      { id:'park', type:'fill', source:'ofm', 'source-layer':'landuse',
        filter:['in',['get','class'],['literal',['park','national_park','grass','meadow','recreation_ground']]],
        paint:{'fill-color':C.park} },
      { id:'building', type:'fill', source:'ofm', 'source-layer':'building', minzoom:13,
        paint:{'fill-color':C.building,'fill-outline-color':C.building_ol} },
      { id:'road-casing', type:'line', source:'ofm', 'source-layer':'transportation',
        filter:['in',['get','class'],['literal',['motorway','trunk','primary']]],
        paint:{'line-color':C.road_casing,'line-width':ramp(8,3,16,14)} },
      { id:'road-major', type:'line', source:'ofm', 'source-layer':'transportation',
        filter:['in',['get','class'],['literal',['motorway','trunk','primary','secondary']]],
        paint:{'line-color':C.road_major,'line-width':ramp(8,1,16,9)} },
      { id:'road-minor', type:'line', source:'ofm', 'source-layer':'transportation',
        filter:['in',['get','class'],['literal',['minor','residential','service']]],
        minzoom:13, paint:{'line-color':C.road_minor,'line-width':ramp(13,0.5,16,4)} },
      { id:'label-water', type:'symbol', source:'ofm', 'source-layer':'water_name',
        layout:{'text-field':['coalesce',['get','name:en'],['get','name']],
          'text-font':['Noto Sans Regular'],'text-size':11},
        paint:{'text-color':C.label_water,'text-halo-color':C.water,'text-halo-width':1.5} },
      { id:'label-place', type:'symbol', source:'ofm', 'source-layer':'place', minzoom:5,
        layout:{'text-field':['coalesce',['get','name:en'],['get','name']],
          'text-font':['Noto Sans Regular'],'text-size':ramp(5,10,16,20)},
        paint:{'text-color':C.label_city,'text-halo-color':C.land,'text-halo-width':2} },
      { id:'label-road', type:'symbol', source:'ofm', 'source-layer':'transportation_name', minzoom:14,
        layout:{'text-field':['coalesce',['get','name:en'],['get','name']],
          'text-font':['Noto Sans Regular'],'symbol-placement':'line','text-size':10},
        paint:{'text-color':C.label_road,'text-halo-color':C.land,'text-halo-width':1.5} },
    ]
  };
}

/* ── MAP INIT ──────────────────────────────────────────────────── */
function initHotelMap() {
  if (hotelMap) { hotelMap.resize(); return; }
  const container = document.getElementById('hotel-map');
  if (!container) return;

  hotelMap = new maplibregl.Map({
    container: 'hotel-map',
    style: buildMapStyle(),
    center: [139.6950, 35.6750],
    zoom: 12,
    attributionControl: false,
  });

  hotelMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  hotelMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  hotelMap.on('load', () => {
    hotelMapReady = true;
    addHotelMarkers();
  });
}

function addHotelMarkers() {
  if (!hotelMapReady || !hotelMap) return;

  const bounds = new maplibregl.LngLatBounds();
  const seen = new Set();

  // Hotel price markers (deduplicated across categories)
  HOTEL_CATEGORIES.forEach(cat => {
    cat.hotels.forEach(h => {
      if (seen.has(h.id)) return;
      seen.add(h.id);
      const el = document.createElement('div');
      el.className = 'map-marker-price';
      el.id = 'hmap-' + h.id;
      el.textContent = h.price;
      el.title = h.name;
      el.onclick = () => {
        const card = document.getElementById('hc-' + h.id);
        if (card) card.scrollIntoView({ behavior:'smooth', block:'center' });
        document.querySelectorAll('.map-marker-price').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
      };
      new maplibregl.Marker({ element: el, anchor:'bottom' })
        .setLngLat(h.coords).addTo(hotelMap);
      bounds.extend(h.coords);
    });
  });

  // Flight arrival marker (NRT airport)
  const airportEl = document.createElement('div');
  airportEl.className = 'map-marker-airport';
  airportEl.textContent = '✈ NRT · Your flight lands here';
  new maplibregl.Marker({ element: airportEl, anchor:'bottom' })
    .setLngLat(AIRPORT_COORDS).addTo(hotelMap);
  bounds.extend(AIRPORT_COORDS);

  // Added event markers on the hotel map
  addedIds.forEach(id => {
    for (const cat of EVENT_CATEGORIES) {
      const e = cat.events.find(e => e.id === id);
      if (e && e.coords) {
        const el = document.createElement('div');
        el.className = 'map-marker-event hmap-event';
        el.textContent = e.name.split(' ').slice(0,2).join(' ');
        el.style.borderColor = '#F4632E';
        el.style.color = '#F4632E';
        new maplibregl.Marker({ element: el, anchor:'bottom' })
          .setLngLat(e.coords).addTo(hotelMap);
        bounds.extend(e.coords);
        break;
      }
    }
  });

  hotelMap.fitBounds(bounds, { padding: 60, maxZoom: 12 });
}

function initEventMap() {
  if (eventMap) { eventMap.resize(); return; }
  const container = document.getElementById('event-map');
  if (!container) return;

  eventMap = new maplibregl.Map({
    container: 'event-map',
    style: buildMapStyle(),
    center: [139.7500, 35.6700],
    zoom: 11,
    attributionControl: false,
  });

  eventMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  eventMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  eventMap.on('load', () => {
    eventMapReady = true;
    addEventMarkers();
  });
}

const CAT_COLORS = {
  concert_area: '#8B5CF6',
  free_things:  '#8B5CF6',
  anime_cafes:  '#8B5CF6',
  day_trips:    '#8B5CF6',
};

function addEventMarkers() {
  if (!eventMapReady || !eventMap) return;

  const bounds = new maplibregl.LngLatBounds();

  EVENT_CATEGORIES.forEach(cat => {
    const color = CAT_COLORS[cat.id] || '#1A1A1A';
    cat.events.forEach(e => {
      const subtype = getEventSubtype(e.id);
      const iconSvg = PLAN_ICONS[subtype] || PLAN_ICONS.event;
      const el = document.createElement('div');
      el.className = 'map-marker-event-pin';
      el.id = 'emap-' + e.id;
      el.style.opacity = '0';
      el.style.transition = 'opacity .3s ease';
      el.innerHTML = `
        <div class="empin-dot" style="background:${color}">${iconSvg}</div>
        <div class="empin-label">${e.name}</div>
      `;
      el.onclick = () => {
        const card = document.getElementById('ec-' + e.id);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.map-marker-event-pin').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
      };
      new maplibregl.Marker({ element: el, anchor: 'left' })
        .setLngLat(e.coords)
        .addTo(eventMap);
      eventMarkerEls[e.id] = el;
      bounds.extend(e.coords);
    });
  });

  // Concert venue pin (always visible immediately)
  const concertEl = document.createElement('div');
  concertEl.className = 'map-marker-concert';
  concertEl.textContent = '🎤 Makuhari Messe';
  new maplibregl.Marker({ element: concertEl, anchor: 'bottom' })
    .setLngLat([140.0290, 35.6480])
    .addTo(eventMap);
  bounds.extend([140.0290, 35.6480]);

  // Airport marker
  const airportEl = document.createElement('div');
  airportEl.className = 'map-marker-airport';
  airportEl.textContent = AIRPORT_LABEL;
  new maplibregl.Marker({ element: airportEl, anchor: 'bottom' })
    .setLngLat(AIRPORT_COORDS)
    .addTo(eventMap);
  bounds.extend(AIRPORT_COORDS);

  eventMap.fitBounds(bounds, { padding: 56, maxZoom: 10, duration: 800 });

  // Reveal markers for events already time-triggered (in case map loaded late)
  revealedEvents.forEach(id => {
    if (eventMarkerEls[id]) eventMarkerEls[id].style.opacity = '1';
  });
}

/* ── PRICE CHART ───────────────────────────────────────────────── */
const PRICE_DAYS = [
  { dow:'Mon', date:'Jun 9',  price:'₹52k', h:70,  cheap:false },
  { dow:'Tue', date:'Jun 10', price:'₹49k', h:60,  cheap:false },
  { dow:'Wed', date:'Jun 11', price:'₹38k', h:28,  cheap:true  },
  { dow:'Thu', date:'Jun 12', price:'₹44k', h:50,  cheap:false },
  { dow:'Fri', date:'Jun 13', price:'₹48k', h:62,  cheap:false, sel:true },
  { dow:'Sat', date:'Jun 14', price:'₹67k', h:100, cheap:false },
  { dow:'Sun', date:'Jun 15', price:'₹58k', h:80,  cheap:false },
];

function renderPriceChart() {
  const grid = document.getElementById('priceGrid');
  if (!grid) return;
  grid.innerHTML = PRICE_DAYS.map(p => `
    <div class="pc-day ${p.cheap?'pc-cheap':''} ${p.sel?'pc-sel':''}" onclick="selectPriceDay(this)">
      <div class="pc-dow">${p.dow}</div>
      <div class="pc-date">${p.date}</div>
      <div class="pc-bar-wrap"><div class="pc-bar" style="height:${p.h}%"></div></div>
      <div class="pc-price">${p.price}</div>
    </div>
  `).join('');
}
function selectPriceDay(el) {
  document.querySelectorAll('.pc-day').forEach(d => d.classList.remove('pc-sel'));
  el.classList.add('pc-sel');
}

/* ── FLIGHT CARDS ──────────────────────────────────────────────── */
function renderFlightCard(f) {
  const tagHtml = f.tag === 'ai'   ? `<div class="fl-tag ai">${f.tagText}</div>` :
                  f.tag === 'deal' ? `<div class="fl-tag">${f.tagText}</div>` : '';
  const badgeHtml  = f.badge       ? `<div class="fl-badge">${f.badge}</div>` : '';
  const stopHtml   = f.stopoverTip ? `<div class="fl-stopover-tip">${f.stopoverTip}</div>` : '';
  return `
    <div class="flight-card" id="fc-${f.id}">
      <div class="fl-head">
        <div class="al-logo">${f.icon}</div>
        <div class="fl-airline-meta">
          <div class="fl-airline-name">${f.airline}</div>
          <div class="fl-date-label">${f.date}</div>
          ${badgeHtml}
          ${stopHtml}
        </div>
      </div>
      <div class="fl-route">
        <div><div class="fl-time">${f.dep}</div><div class="fl-city">${f.from}</div></div>
        <div class="fl-mid">
          <div class="fl-stops">${f.stops}</div>
          <div class="fl-line"></div>
          <div class="fl-dur">${f.dur}</div>
        </div>
        <div><div class="fl-time">${f.arr}</div><div class="fl-city">${f.to}</div></div>
      </div>
      <div class="fl-price-wrap">
        <div class="fl-price">${f.price}</div>
        <div class="fl-per">per person</div>
        ${tagHtml}
      </div>
      <button class="book-btn" id="btn-${f.id}"
        onclick="addFlightToplan(event,'fc-${f.id}','${f.id}','${f.airline}','${f.date} · ${f.from}→${f.to}','${f.price}')">
        Book
      </button>
    </div>`;
}

function renderFlights() {
  const list = document.getElementById('flightList');
  if (!list) return;
  list.innerHTML = `<div class="fl-sections">` +
    FLIGHT_CATEGORIES.map(cat => `
      <div class="fl-section">
        <div class="fl-section-hd">
          <div>
            <div class="fl-section-title">${cat.title}</div>
            <div class="fl-section-sub">${cat.subtitle}</div>
          </div>
          <button class="fl-see-all">See all →</button>
        </div>
        <div class="fl-ai-note">${cat.aiNote}</div>
        ${cat.flights.map(f => renderFlightCard(f)).join('')}
      </div>`
    ).join('') + `</div>`;
}

/* ── FLIGHTS LOADER ─────────────────────────────────────────────── */
let flightsLoaderShown = false;

function initFlightsLoader() {
  if (flightsLoaderShown) return;
  flightsLoaderShown = true;

  const loader  = document.getElementById('flLoader');
  const msgEl   = document.getElementById('flLoaderMsg');
  const barEl   = document.getElementById('flLoaderBar');
  const content = document.getElementById('flContent');
  if (!loader || !msgEl) return;

  const msgs = [
    'Reading your plan — concert on Aug 28, 14 days in Tokyo…',
    'Checking outbound flights: BLR → NRT arriving before Aug 26…',
    'Scanning ±2 day windows · Found 31% cheaper options…',
    'Curating return flights after Sep 8 · Done ✓',
  ];
  let mi = 0;
  msgEl.textContent = msgs[mi];
  loader.style.display = 'flex';

  // Cycle messages
  const msgTimer = setInterval(() => {
    mi = (mi + 1) % msgs.length;
    msgEl.style.opacity = '0';
    setTimeout(() => { msgEl.textContent = msgs[mi]; msgEl.style.opacity = '1'; }, 180);
  }, 650);

  // Progress bar
  setTimeout(() => { if (barEl) barEl.style.width = '100%'; }, 80);

  // Dismiss
  setTimeout(() => {
    clearInterval(msgTimer);
    loader.style.opacity = '0';
    loader.style.transform = 'translateY(-8px)';
    loader.style.transition = 'opacity .4s, transform .4s';
    if (content) {
      content.style.transition = 'opacity .4s';
      content.style.opacity = '1';
      content.style.pointerEvents = '';
    }
    setTimeout(() => { loader.style.display = 'none'; }, 450);
  }, 2800);
}

/* ── HOTEL CARDS ────────────────────────────────────────────────── */
function renderHotelCard(h) {
  // Derive stars & type from price if not in data
  const priceNum = parseInt(h.price.replace(/[^\d]/g, '')) || 0;
  const stars    = h.stars || (priceNum >= 15000 ? 5 : priceNum >= 7000 ? 4 : 3);
  const type     = h.type  || 'Hotel';
  const taxesNum = Math.round(priceNum * 0.155);
  const taxes    = '₹' + taxesNum.toLocaleString('en-IN');
  const origNum  = Math.round(priceNum * 1.33);
  const discount = Math.round((1 - priceNum / origNum) * 100);
  const orig     = '₹' + origNum.toLocaleString('en-IN');

  const tagHtml =
    h.tag === 'ai'   ? `<div class="prop-ai-tag">${h.tagText}</div>` :
    h.tag === 'deal' ? `<div class="prop-deal-tag">${h.tagText}</div>` : '';

  return `
    <div class="prop-card" id="hc-${h.id}"
      onclick="addHotelToplan('${h.id}','${h.name}','${h.location}','${h.price}${h.priceUnit}')">
      <div class="prop-img-wrap">
        <img class="prop-img" src="${h.img}" loading="lazy" alt="${h.name}" />
        ${tagHtml}
        <button class="prop-heart-btn" id="bookmark-${h.id}" onclick="event.stopPropagation(); addHotelToplan('${h.id}','${h.name}','${h.location}','${h.price}${h.priceUnit}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="prop-body">
        <div class="prop-name-row">
          <div class="prop-name">${h.name}</div>
          <div class="prop-rating-badge">★ ${h.rating}</div>
        </div>
        <div class="prop-meta-row">
          <span class="prop-type-loc">${stars}-star ${type} · ${h.location}</span>
          <span class="prop-reviews">${h.reviews} ratings</span>
        </div>
        <div class="prop-price-primary">
          <span class="prop-price-main">${h.price}</span><span class="prop-price-taxes"> + ${taxes} taxes &amp; fees / night</span>
        </div>
        <div class="prop-price-secondary">
          <span class="prop-price-orig">${orig}</span>
          <span class="prop-discount">${discount}% off</span>
        </div>
      </div>
    </div>`;
}

function renderHotels() {
  const list = document.getElementById('hotelList');
  if (!list) return;
  list.innerHTML = `<div class="ht-sections">` +
    HOTEL_CATEGORIES.map(cat => `
      <div class="ht-section">
        <div class="ht-section-hd">
          <div>
            <div class="ht-section-title">${cat.title}</div>
            <div class="ht-section-sub">${cat.subtitle}</div>
          </div>
          <button class="ht-see-all">See all →</button>
        </div>
        <div class="ht-ai-note">${cat.aiNote}</div>
        <div class="prop-grid">${cat.hotels.map(h => renderHotelCard(h)).join('')}</div>
      </div>`
    ).join('') + `</div>`;
}

function revealHotelsProgressively() {
  const allCards = document.querySelectorAll('#hotelList .prop-card');
  allCards.forEach((card, i) => {
    setTimeout(() => {
      card.style.transition = 'opacity .38s ease, transform .38s cubic-bezier(.22,1,.36,1)';
      card.style.opacity = '1';
      card.style.transform = 'none';
    }, i * 80);
  });
}

/* ── HOTELS LOADER ──────────────────────────────────────────────── */
let hotelsLoaderShown = false;

function initHotelsLoader() {
  if (hotelsLoaderShown) return;
  hotelsLoaderShown = true;

  const loader  = document.getElementById('htLoader');
  const msgEl   = document.getElementById('htLoaderMsg');
  const barEl   = document.getElementById('htLoaderBar');
  const content = document.getElementById('htContent');
  if (!loader || !msgEl) return;

  const msgs = [
    'Checking your flight — landing at NRT on Aug 26…',
    'Finding hotels near Makuhari Messe concert venue…',
    'Matching proximity to your saved events…',
    'Curating 5 categories across all budgets · Done ✓',
  ];
  let mi = 0;
  msgEl.textContent = msgs[mi];
  loader.style.display = 'flex';

  const msgTimer = setInterval(() => {
    mi = (mi + 1) % msgs.length;
    msgEl.style.opacity = '0';
    setTimeout(() => { msgEl.textContent = msgs[mi]; msgEl.style.opacity = '1'; }, 180);
  }, 650);

  setTimeout(() => { if (barEl) barEl.style.width = '100%'; }, 80);

  setTimeout(() => {
    clearInterval(msgTimer);
    loader.style.opacity = '0';
    loader.style.transform = 'translateY(-8px)';
    loader.style.transition = 'opacity .4s, transform .4s';
    if (content) {
      content.style.transition = 'opacity .4s';
      content.style.opacity = '1';
      content.style.pointerEvents = '';
    }
    setTimeout(() => {
      loader.style.display = 'none';
      revealHotelsProgressively();
      setTimeout(() => initHotelMap(), 100);
    }, 450);
  }, 2800);
}

/* ── EVENT CARDS (Airbnb category sections) ────────────────────── */
function renderEventCard(e) {
  const tagHtml =
    e.tag === 'ai'     ? `<div class="ec-tag ec-tag--ai">${e.tagText}</div>` :
    e.tag === 'deal'   ? `<div class="ec-tag ec-tag--deal">${e.tagText}</div>` :
    e.tag === 'anchor' ? `<div class="ec-tag ec-tag--anchor">${e.tagText}</div>` : '';

  const isFree = e.price === 'Free';
  return `
    <div class="ec-card" id="ec-${e.id}" style="opacity:0;transform:translateY(16px)">
      <div class="ec-img-wrap">
        <img class="ec-img" src="${e.img}" loading="lazy" alt="${e.name}" />
        ${tagHtml}
        <button class="ec-heart" id="heart-${e.id}"
          onclick="addEventToplan(event,'${e.id}','${e.name}','${e.location}','${e.price}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="ec-body">
        <div class="ec-name-row">
          <div class="ec-name">${e.name}</div>
          <div class="ec-rating-badge">★ ${e.rating}</div>
        </div>
        <div class="ec-meta-row">
          <span class="ec-meta-loc">${e.meta} · ${e.location}</span>
          <span class="ec-reviews">${e.reviews}</span>
        </div>
        <div class="ec-price-row">
          <span class="ec-price ${isFree ? 'ec-price--free' : ''}">${e.price}</span>${isFree
            ? '<span class="ec-price-unit"> · Free entry</span>'
            : '<span class="ec-price-unit"> / person</span>'}
        </div>
      </div>
    </div>
  `;
}

function renderEvents() {
  const list = document.getElementById('eventList');
  if (!list) return;
  list.innerHTML = EVENT_CATEGORIES.map(cat => `
    <div class="ev-section ${cat.anchor ? 'ev-section--anchor' : ''}" data-cat="${cat.id}">
      <div class="ev-section-hd" style="opacity:0;transform:translateY(10px)">
        <div>
          <div class="ev-section-title">${cat.anchor ? '<span class="ev-anchor-pip">🎤</span>' : ''}${cat.title}</div>
          <div class="ev-section-sub">${cat.subtitle}</div>
        </div>
        <button class="ev-see-all">See all →</button>
      </div>
      <div class="ev-cards-grid">
        ${cat.events.map(e => renderEventCard(e)).join('')}
      </div>
    </div>
  `).join('');
}

/* ── ADD TO PLAN ───────────────────────────────────────────────── */
function addFlightToplan(evt, cardId, itemId, name, info, price) {
  evt.stopPropagation();
  if (addedIds.has(itemId)) return;
  addedIds.add(itemId);
  const btn = evt.currentTarget;
  btn.textContent = '✓ Booked'; btn.classList.add('added'); btn.disabled = true;
  const cardEl  = document.getElementById(cardId);
  // Target Day 1 column in the horizontal strip
  const day0Col = document.querySelector('#hpsDates [data-day="0"]');
  flyToStrip(cardEl, () => pushToPlan('flight', itemId, name, info, price), day0Col);
}

function addHotelToplan(itemId, name, location, price) {
  if (addedIds.has(itemId)) return;
  addedIds.add(itemId);
  const cardEl = document.getElementById('hc-' + itemId);
  if (!cardEl) return;
  cardEl.classList.add('card-added');
  const marker = document.getElementById('hmap-' + itemId);
  if (marker) { marker.classList.add('added'); marker.classList.remove('active'); }
  // Fly to Day 1 column — hotels span the whole trip
  const day0Col = document.querySelector('#hpsDates [data-day="0"]');
  const bmarkBtn = document.getElementById('bookmark-' + itemId);
  if (bmarkBtn) {
    bmarkBtn.classList.add('hearted');
    bmarkBtn.classList.remove('pop');
    void bmarkBtn.offsetWidth;
    bmarkBtn.classList.add('pop');
  }
  flyToStrip(cardEl, () => {
    // Add hotel to every day so it shows on the full plan
    DAYS.forEach((_, i) => {
      planItems.push({
        id: itemId + '_d' + i,
        type: 'hotel', name, info: location, price,
        day: i,
      });
    });
    const badge = document.getElementById('planBadge');
    if (badge) { badge.textContent = planItems.length; badge.classList.add('show'); badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
    const tabEl = document.getElementById('planTab');
    if (tabEl) {
      tabEl.classList.add('flashing');
      setTimeout(() => { tabEl.classList.remove('flashing'); void tabEl.offsetWidth; }, 500);
    }
    updateHPlanStrip(); updateTabBadges();
  }, day0Col);
}

function addEventToplan(evt, itemId, name, location, price) {
  evt.stopPropagation();
  if (addedIds.has(itemId)) return;
  addedIds.add(itemId);
  const heartBtn = document.getElementById('heart-' + itemId);
  if (heartBtn) {
    heartBtn.classList.add('hearted');
    heartBtn.classList.remove('pop');
    void heartBtn.offsetWidth;
    heartBtn.classList.add('pop');
  }
  const marker = document.getElementById('emap-' + itemId);
  if (marker) marker.classList.add('added');

  // Pre-compute which day this event will land on so the animation targets it
  const meta     = getEventMeta(itemId) || '';
  const dur      = extractDurationHours(meta);
  const longHint = /day trip|day tour|evening|overnight/i.test(meta);
  const isShort  = !longHint && (dur === null || dur <= 1.5);
  const targetDay = peekNextEventDay(isShort);
  const targetCol = document.querySelector(`#hpsDates [data-day="${targetDay}"]`);

  const cardEl = document.getElementById('ec-' + itemId);
  flyToStrip(cardEl, () => pushToPlan('event', itemId, name, location, price), targetCol);
}

function pushToPlan(type, itemId, name, info, price) {
  // Flights always anchor to Day 1
  if (type === 'flight') {
    planItems.push({ id: itemId + '_' + Date.now(), type, name, info, price, day: 0 });
    const badge = document.getElementById('planBadge');
    if (badge) { badge.textContent = planItems.length; badge.classList.add('show'); badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
    const planTabBtn = document.getElementById('planTab');
    if (planTabBtn) { planTabBtn.classList.add('flash'); setTimeout(() => planTabBtn.classList.remove('flash'), 600); }
    updateHPlanStrip(); updateTabBadges();
    return;
  }

  const meta    = type === 'event' ? getEventMeta(itemId) : '';
  const dur     = extractDurationHours(meta);
  // null duration = unknown → treat as short (1 hr default) unless meta hints at a long activity
  const longHint = /day trip|day tour|evening|overnight/i.test(meta);
  const isShort = type === 'event' && !longHint && (dur === null || dur <= 1.5);

  if (!canAddToCurrentDay(isShort)) {
    currentDay++;
    itemsOnDay = [];
  }
  const assignDay = currentDay % DAYS.length;
  itemsOnDay.push({ isShort });

  planItems.push({
    id: itemId + '_' + Date.now(),
    type, name, info, price,
    day: assignDay,
  });

  const badge = document.getElementById('planBadge');
  if (badge) { badge.textContent = planItems.length; badge.classList.add('show'); badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); setTimeout(() => badge.classList.remove('pop'), 400); }

  const tabEl = document.getElementById('planTab');
  if (tabEl) {
    tabEl.classList.add('flashing');
    setTimeout(() => { tabEl.classList.remove('flashing'); void tabEl.offsetWidth; }, 500);
  }

  if (document.getElementById('panel-plan').classList.contains('active')) {
    renderPlan();
    showBookFooter();
  }

  updateHPlanStrip(); updateTabBadges();
}

/* ── FLY TO REVIEW BAR ANIMATION ────────────────────────────────── */
function flyToStrip(cardEl, onComplete, _targetEl) {
  if (!cardEl) { onComplete(); return; }

  const cardRect = cardEl.getBoundingClientRect();

  // Target: the review bar (bottom search area)
  const reviewBar = document.getElementById('reviewBar');
  const bsearch   = document.getElementById('bottomSearch');
  const anchor    = reviewBar || bsearch;
  let targetX, targetY;
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    targetX = r.left + r.width  / 2;
    targetY = r.top  + r.height / 2;
  } else {
    targetX = window.innerWidth  / 2;
    targetY = window.innerHeight - 60;
  }

  const ghost = cardEl.cloneNode(true);
  ghost.className = 'fly-card';
  Object.assign(ghost.style, {
    position:     'fixed',
    top:          cardRect.top    + 'px',
    left:         cardRect.left   + 'px',
    width:        cardRect.width  + 'px',
    height:       cardRect.height + 'px',
    background:   'white',
    zIndex:       '9999',
    borderRadius: '14px',
    overflow:     'hidden',
    boxShadow:    '0 8px 32px rgba(0,0,0,.22)',
    pointerEvents:'none',
  });
  ghost.querySelectorAll('button, input').forEach(el => el.remove());
  document.body.appendChild(ghost);

  const dx = targetX - (cardRect.left + cardRect.width  / 2);
  const dy = targetY - (cardRect.top  + cardRect.height / 2);

  requestAnimationFrame(() => {
    ghost.style.transition = 'transform .15s ease, box-shadow .15s';
    ghost.style.transform  = 'scale(1.04) translateY(-6px)';
    ghost.style.boxShadow  = '0 20px 60px rgba(0,0,0,.3)';
  });

  setTimeout(() => {
    ghost.style.transition    = 'all .48s cubic-bezier(.4,0,.2,1)';
    ghost.style.transform     = `translate(${dx}px,${dy}px) scale(.04)`;
    ghost.style.opacity       = '0';
    ghost.style.borderRadius  = '50%';
  }, 140);

  setTimeout(() => {
    ghost.remove();
    onComplete();
    // Pulse the review bar to confirm arrival
    const bar = document.getElementById('reviewBar');
    if (bar) {
      bar.classList.add('review-bar--pulse');
      setTimeout(() => bar.classList.remove('review-bar--pulse'), 500);
    }
  }, 640);
}

/* ── FLY TO TAB ANIMATION (kept for reference) ─────────────────── */
function flyToTab(cardEl, tabEl, onComplete) {
  if (!cardEl || !tabEl) { onComplete(); return; }
  const cardRect = cardEl.getBoundingClientRect();
  const tabRect  = tabEl.getBoundingClientRect();

  const ghost = cardEl.cloneNode(true);
  ghost.className = 'fly-card';
  Object.assign(ghost.style, {
    top:    cardRect.top    + 'px',
    left:   cardRect.left   + 'px',
    width:  cardRect.width  + 'px',
    height: cardRect.height + 'px',
  });
  ghost.querySelectorAll('button, input').forEach(el => el.remove());
  document.body.appendChild(ghost);

  const destX = tabRect.left + tabRect.width  / 2;
  const destY = tabRect.top  + tabRect.height / 2;
  const dx = destX - (cardRect.left + cardRect.width  / 2);
  const dy = destY - (cardRect.top  + cardRect.height / 2);

  ghost.style.transition = 'transform .15s ease, box-shadow .15s';
  ghost.style.transform  = 'scale(1.04) translateY(-6px)';
  ghost.style.boxShadow  = '0 20px 60px rgba(0,0,0,.3)';

  setTimeout(() => {
    ghost.style.transition = 'all .52s cubic-bezier(.4,0,.2,1)';
    ghost.style.transform  = `translate(${dx}px, ${dy - cardRect.height/2 + 12}px) scale(.06)`;
    ghost.style.opacity    = '0';
    ghost.style.borderRadius = '50%';
  }, 130);

  setTimeout(() => {
    ghost.remove();
    onComplete();
  }, 660);
}

function removeItem(id) {
  planItems = planItems.filter(it => it.id !== id);
  const badge = document.getElementById('planBadge');
  if (badge) { badge.textContent = planItems.length; if (!planItems.length) badge.classList.remove('show'); }
  // Re-render whichever view is active
  if (document.getElementById('panel-plan')?.classList.contains('active')) {
    renderKanban();
  }
  updateHPlanStrip(); updateTabBadges();
  if (!planItems.length) hideBookFooter();
}

/* ── PLAN MAP ──────────────────────────────────────────────────── */
function initPlanMap() {
  // Destroy old instance (its container was recreated by renderPlan)
  if (planMap) { try { planMap.remove(); } catch(e) {} planMap = null; planMapReady = false; }
  planMarkers = [];

  const container = document.getElementById('plan-map');
  if (!container) return;

  planMap = new maplibregl.Map({
    container: 'plan-map',
    style: buildMapStyle(),
    center: [139.720, 35.680],
    zoom: 11,
    attributionControl: false,
  });

  planMap.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  planMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  planMap.on('load', () => {
    planMapReady = true;
    updatePlanRoutes();
  });
}

/* Fetch a road-following route from OSRM's free public server.
   coords: array of [lng, lat] waypoints.
   Returns array of [lng, lat] points following actual roads,
   or falls back to the original straight-line coords on error. */
async function fetchRoadRoute(coords) {
  if (coords.length < 2) return coords;
  try {
    const waypoints = coords.map(c => `${c[0]},${c[1]}`).join(';');
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return coords;
    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates; // already [lng, lat][]
    }
  } catch(_) {}
  return coords; // fallback to straight line
}

async function updatePlanRoutes() {
  if (!planMapReady || !planMap) return;

  // ── Safely remove old plan layers then sources ─────────────────
  const styleLayers = planMap.getStyle().layers || [];
  styleLayers.forEach(l => {
    if (l.id.startsWith('plan-')) {
      try { planMap.removeLayer(l.id); } catch(_) {}
    }
  });
  const styleSources = planMap.getStyle().sources || {};
  Object.keys(styleSources).forEach(id => {
    if (id.startsWith('plan-')) {
      try { planMap.removeSource(id); } catch(_) {}
    }
  });
  planMarkers.forEach(m => m.remove());
  planMarkers = [];

  const allCoords = [];

  // ── Per-day road routes ────────────────────────────────────────
  for (let di = 0; di < DAYS.length; di++) {
    const coords = planItems
      .filter(it => it.day === di)
      .map(it => getItemCoords(it))
      .filter(Boolean);

    if (coords.length === 0) continue;
    coords.forEach(c => allCoords.push(c));

    const color = DAY_COLORS[di % DAY_COLORS.length];
    const srcId = `plan-day-${di}`;

    if (coords.length === 1) {
      planMap.addSource(srcId, { type:'geojson', data:{
        type:'Feature', geometry:{ type:'Point', coordinates: coords[0] }
      }});
      continue;
    }

    // Fetch road-following geometry from OSRM
    const roadCoords = await fetchRoadRoute(coords);

    planMap.addSource(srcId, { type:'geojson', data:{
      type:'Feature', geometry:{ type:'LineString', coordinates: roadCoords }
    }});

    // Glow
    planMap.addLayer({ id:`plan-glow-${di}`, type:'line', source:srcId,
      layout:{ 'line-join':'round','line-cap':'round' },
      paint:{ 'line-color':color, 'line-width':14, 'line-opacity':0.16 } });
    // Main line
    planMap.addLayer({ id:`plan-line-${di}`, type:'line', source:srcId,
      layout:{ 'line-join':'round','line-cap':'round' },
      paint:{ 'line-color':color, 'line-width':3.5, 'line-opacity':0.92 } });
  }

  // ── Between-day connectors (dashed, also road-following) ───────
  for (let di = 0; di < DAYS.length - 1; di++) {
    const curCoords  = planItems.filter(it => it.day === di    ).map(it => getItemCoords(it)).filter(Boolean);
    const nextCoords = planItems.filter(it => it.day === di + 1).map(it => getItemCoords(it)).filter(Boolean);
    if (!curCoords.length || !nextCoords.length) continue;

    const from = curCoords[curCoords.length - 1];
    const to   = nextCoords[0];

    const roadCoords = await fetchRoadRoute([from, to]);

    const srcId = `plan-conn-src-${di}`;
    const layId = `plan-conn-${di}`;
    planMap.addSource(srcId, { type:'geojson', data:{
      type:'Feature', geometry:{ type:'LineString', coordinates: roadCoords }
    }});
    planMap.addLayer({ id: layId, type:'line', source: srcId,
      layout:{ 'line-join':'round','line-cap':'round' },
      paint:{ 'line-color':'#AAAAAA', 'line-width':2, 'line-opacity':0.5,
        'line-dasharray':[4,5] } });
  }

  // ── Markers ────────────────────────────────────────────────────
  planItems.forEach(it => {
    const coords = getItemCoords(it);
    if (!coords) return;

    let iconKey, bgColor;
    if (it.type === 'flight') {
      iconKey = 'flight'; bgColor = '#1d4ed8';
    } else if (it.type === 'hotel') {
      iconKey = 'hotel';  bgColor = '#5b21b6';
    } else {
      iconKey = it.isAnchor ? 'concert' : getEventSubtype(it.id);
      bgColor = '#9d174d';
    }

    const el = document.createElement('div');
    el.className = 'plan-map-marker-wrap';
    el.innerHTML = `
      <div class="plan-map-marker" style="background:${bgColor}">${PLAN_ICONS[iconKey] || PLAN_ICONS.event}</div>
      <div class="plan-map-label">${it.name}</div>
    `;

    const marker = new maplibregl.Marker({ element: el, anchor:'left' })
      .setLngLat(coords)
      .addTo(planMap);
    planMarkers.push(marker);
  });

  // Airport marker
  const airportEl = document.createElement('div');
  airportEl.className = 'map-marker-airport';
  airportEl.textContent = AIRPORT_LABEL;
  const apMarker = new maplibregl.Marker({ element: airportEl, anchor:'bottom' })
    .setLngLat(AIRPORT_COORDS)
    .addTo(planMap);
  planMarkers.push(apMarker);

  // Fit bounds
  if (allCoords.length) {
    const bounds = new maplibregl.LngLatBounds();
    allCoords.forEach(c => bounds.extend(c));
    bounds.extend(AIRPORT_COORDS);
    planMap.fitBounds(bounds, { padding:80, maxZoom:13, duration:800 });
  }
}


/* ── PLAN RENDER ───────────────────────────────────────────────── */
function renderPlan() {
  const wrap = document.getElementById('planWrap');
  if (!wrap) return;

  if (!planItems.length) {
    wrap.innerHTML = `
      <div class="plan-empty">
        <div class="plan-empty-icon">✦</div>
        <div class="plan-empty-title">Your plan is empty</div>
        <div class="plan-empty-sub">
          Book flights, add hotels and heart experiences —<br>they'll appear here, organised by day.
        </div>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="kb-pane" id="kbPane"></div>
    <div class="plan-map-pane">
      <div id="plan-map" class="real-map"></div>
    </div>
  `;
  renderKanban();
  setTimeout(() => initPlanMap(), 80);
}

/* ── KANBAN BOARD ──────────────────────────────────────────────── */
let kbDragId     = null; // id of item being dragged
let kbInsertId   = null; // id of item we'd insert before (null = append)

function renderKanban() {
  const pane = document.getElementById('kbPane');
  if (!pane) return;

  const rowsHtml = DAYS.map((day, di) => {
    const items = planItems.filter(it => it.day === di);

    const cardsHtml = items.map(it => {
      let iconKey, iconCls;
      if (it.type === 'flight')      { iconKey = 'flight';  iconCls = 'kb-icon--flight'; }
      else if (it.type === 'hotel')  { iconKey = 'hotel';   iconCls = 'kb-icon--hotel'; }
      else { iconKey = it.isAnchor ? 'concert' : getEventSubtype(it.id); iconCls = 'kb-icon--event'; }

      return `<div class="kb-card" draggable="true" data-id="${it.id}">
        <div class="kb-card-icon ${iconCls}">${PLAN_ICONS[iconKey] || PLAN_ICONS.event}</div>
        <div class="kb-card-body">
          <div class="kb-card-name">${it.name}</div>
          <div class="kb-card-info">${it.info || ''}</div>
        </div>
        <button class="kb-card-del" onclick="event.stopPropagation();removeItem('${it.id}')">✕</button>
      </div>`;
    }).join('');

    const emptyHint = items.length === 0
      ? `<div class="kb-empty">Drop here</div>` : '';

    return `<div class="kb-row ${day.concert ? 'is-concert' : ''}">
      <div class="kb-day-lbl">
        <div class="kb-lbl-label">${day.label}</div>
        <div class="kb-lbl-date">${day.date}</div>
        <div class="kb-lbl-dow">${day.dow}</div>
        ${day.concert ? '<div class="kb-lbl-concert">🎤</div>' : ''}
      </div>
      <div class="kb-cards" data-day="${di}">${cardsHtml}${emptyHint}</div>
    </div>`;
  }).join('');

  pane.innerHTML = `<div class="kb-body">${rowsHtml}</div>`;
  initKanbanDnd();
}

function initKanbanDnd() {
  // ── Card drag events ───────────────────────────────────────────
  pane_cards: {
    const cards = document.querySelectorAll('#kbPane .kb-card[draggable]');
    cards.forEach(card => {
      card.addEventListener('dragstart', e => {
        kbDragId = card.dataset.id;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.classList.add('kb-dragging'), 0);
      });
      card.addEventListener('dragend', () => {
        kbDragId = null;
        kbInsertId = null;
        document.querySelectorAll('.kb-card.kb-dragging').forEach(c => c.classList.remove('kb-dragging'));
        document.querySelectorAll('.kb-card.kb-insert-before').forEach(c => c.classList.remove('kb-insert-before'));
        document.querySelectorAll('.kb-cards.kb-over').forEach(z => z.classList.remove('kb-over'));
      });
    });
  }

  // ── Drop zone events ───────────────────────────────────────────
  document.querySelectorAll('#kbPane .kb-cards').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('kb-over');

      // Find insert position by x coordinate among non-dragging cards
      const cards = [...zone.querySelectorAll('.kb-card:not(.kb-dragging)')];
      document.querySelectorAll('.kb-card.kb-insert-before').forEach(c => c.classList.remove('kb-insert-before'));

      let insertCard = null;
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2) { insertCard = c; break; }
      }
      kbInsertId = insertCard ? insertCard.dataset.id : null;
      if (insertCard) insertCard.classList.add('kb-insert-before');
    });

    zone.addEventListener('dragleave', e => {
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('kb-over');
        document.querySelectorAll('.kb-card.kb-insert-before').forEach(c => c.classList.remove('kb-insert-before'));
      }
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('kb-over');
      document.querySelectorAll('.kb-card.kb-insert-before').forEach(c => c.classList.remove('kb-insert-before'));

      if (!kbDragId) return;
      const targetDay = parseInt(zone.dataset.day);
      const itemIdx   = planItems.findIndex(it => it.id === kbDragId);
      if (itemIdx === -1) return;

      const [item] = planItems.splice(itemIdx, 1);
      item.day = targetDay;

      if (kbInsertId) {
        // Insert before the target card
        const beforeIdx = planItems.findIndex(it => it.id === kbInsertId);
        planItems.splice(beforeIdx !== -1 ? beforeIdx : planItems.length, 0, item);
      } else {
        // Append after last item of this day, or at end
        const lastOfDay = [...planItems].reverse().find(it => it.day === targetDay);
        const insertAt  = lastOfDay ? planItems.indexOf(lastOfDay) + 1 : planItems.length;
        planItems.splice(insertAt, 0, item);
      }

      kbDragId   = null;
      kbInsertId = null;
      renderKanban();
      updatePlanRoutes();
    });
  });
}

/* ── FILTER PILLS ──────────────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.f-pill').forEach(pill => {
    const drop = pill.querySelector('.f-drop');
    if (!drop) { pill.addEventListener('click', () => pill.classList.toggle('on')); return; }
    pill.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = drop.classList.contains('open');
      closeAllDrops();
      if (!isOpen) { drop.classList.add('open'); pill.classList.add('open'); }
    });
  });
  document.querySelectorAll('.fd-pill').forEach(p =>
    p.addEventListener('click', e => { e.stopPropagation(); p.classList.toggle('on'); }));
  document.querySelectorAll('.fd-opt').forEach(o =>
    o.addEventListener('click', e => { e.stopPropagation(); o.classList.toggle('sel'); }));
  document.querySelectorAll('.fd-time').forEach(t =>
    t.addEventListener('click', e => { e.stopPropagation(); t.classList.toggle('on'); }));

  const fr = document.getElementById('flightPriceRange');
  const fl = document.getElementById('flightPriceVal');
  if (fr) fr.addEventListener('input', () => { fl.textContent = 'up to ₹' + Math.round(fr.value/1000) + 'k'; });

  const hr = document.getElementById('hotelPriceRange');
  const hl = document.getElementById('hotelPriceVal');
  if (hr) hr.addEventListener('input', () => { hl.textContent = 'up to ₹' + Math.round(hr.value/1000) + 'k'; });

  document.addEventListener('click', closeAllDrops);
}

function closeAllDrops() {
  document.querySelectorAll('.f-drop.open').forEach(d => {
    d.classList.remove('open');
    d.closest('.f-pill')?.classList.remove('open');
  });
}

/* ── AI CHIPS ──────────────────────────────────────────────────── */
function initAiChips() {
  document.querySelectorAll('.ai-sug').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = chip.closest('.ai-bar')?.querySelector('.ai-input');
      if (input) { input.value = chip.textContent.trim().replace(/^[^\w]+ ?/, ''); input.focus(); }
    });
  });
}

/* ── FROM/TO SWAP ──────────────────────────────────────────────── */
function initFromTo() {
  const btn  = document.getElementById('ftSwap');
  const from = document.getElementById('ftFrom');
  const to   = document.getElementById('ftTo');
  if (!btn) return;
  btn.onclick = () => {
    const tmp = from.value; from.value = to.value; to.value = tmp;
  };
}

/* ════════════════════════════════════════════════════════════════
   PLAN TIMELINE STRIP
   ════════════════════════════════════════════════════════════════ */

/** Rebuild the horizontal plan strip */
/* ── Tab status badges + Review bar ───────────────────────────── */
const TICK_SVG = `<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function updateTabBadges() {
  const hasFlight = planItems.some(it => it.type === 'flight');
  const hasHotel  = planItems.some(it => it.type === 'hotel');
  const evtCount  = planItems.filter(it => it.type === 'event').length;

  // Review bar
  const bar    = document.getElementById('reviewBar');
  const status = document.getElementById('reviewBarStatus');
  if (!bar || !status) return;

  if (!planItems.length) { bar.classList.remove('visible'); return; }

  const items = [];
  if (hasFlight) items.push(`<span class="rbs-item done">Flights <span class="rbs-tick">${TICK_SVG}</span></span>`);
  if (hasHotel)  items.push(`<span class="rbs-item done">Hotels <span class="rbs-tick">${TICK_SVG}</span></span>`);
  if (evtCount)  items.push(`<span class="rbs-item done">${evtCount} Experience${evtCount !== 1 ? 's' : ''} <span class="rbs-tick">${TICK_SVG}</span></span>`);

  status.innerHTML = items.join('<span style="color:var(--line);font-weight:300">|</span>');
  bar.classList.add('visible');
}

function updateHPlanStrip() {
  const datesEl = document.getElementById('hpsDates');
  if (!datesEl) return;

  const latestId = planItems.length ? planItems[planItems.length - 1].id : null;

  // Build HTML: date + icons (collapsed) + names (revealed on hover)
  const parts = [];
  DAYS.forEach((day, i) => {
    const items   = planItems.filter(it => it.day === i);
    const hasItem = items.length > 0;
    const [mon, num] = day.date.split(' ');

    const iconsHtml = items.map(it => getItemIconHtml(it, it.id === latestId)).join('');

    parts.push(`<div class="hps-day-grp ${hasItem ? 'has-item' : ''} ${day.concert ? 'is-concert' : ''}" data-day="${i}" ${hasItem ? 'onclick="goToPlanTab()"' : ''}>
      <div class="hps-grp-date">
        <span class="hps-day-num">${num}</span>
        <span class="hps-day-mon">${mon}</span>
      </div>
      <div class="hps-grp-icons">${iconsHtml}</div>
    </div>`);

    if (i < DAYS.length - 1) parts.push(`<div class="hps-sep">·</div>`);
  });
  datesEl.innerHTML = parts.join('');

  // Activate CTA
  const ctaBtn = document.getElementById('hpsCtaBtn');
  if (ctaBtn) ctaBtn.classList.toggle('active', planItems.length > 0);

  // Scroll the strip's own container to the latest day (never touches page scroll)
  if (latestId) {
    const latest   = planItems[planItems.length - 1];
    const dayEl    = datesEl.querySelector(`[data-day="${latest.day}"]`);
    const scrollEl = document.getElementById('hpsScroll');
    if (dayEl && scrollEl) {
      setTimeout(() => {
        const target = dayEl.offsetLeft - scrollEl.clientWidth / 2 + dayEl.offsetWidth / 2;
        scrollEl.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      }, 50);
    }
  }
}

/** Rebuild the collapsed rail date rows with item icons */
function updateRailDates() {
  const el = document.getElementById('psRailDates');
  if (!el) return;
  el.innerHTML = DAYS.map((day, i) => {
    const items   = planItems.filter(it => it.day === i);
    const hasItem = items.length > 0;
    const [month, num] = day.date.split(' ');
    const isAnchor = i === 2; // Aug 28
    const color  = hasItem ? DAY_COLORS[i % DAY_COLORS.length] : null;
    const first  = items[0];
    const emoji  = !hasItem ? null :
                   first.isAnchor        ? '🎤' :
                   first.type === 'flight' ? '✈️' :
                   first.type === 'hotel'  ? '🏨' : '🎭';
    const label  = items.length > 1 ? items.length : emoji;
    const dotHtml = hasItem
      ? `<div class="ps-date-dot ps-date-dot--filled" style="background:${color}">${label}</div>`
      : `<div class="ps-date-dot ${isAnchor ? 'is-anchor' : ''}"></div>`;
    return `
      <div class="ps-date-row ${hasItem ? 'has-item' : ''} ${isAnchor ? 'is-anchor' : ''}">
        <div class="ps-date-node">${dotHtml}</div>
        <div class="ps-date-num">${num}</div>
        <div class="ps-date-mon">${month}</div>
      </div>`;
  }).join('');
}
/** Alias called on first load before any items are added */
function initPlanStripDates() { updateRailDates(); }

/** Navigate to the plan tab */
function goToPlanTab() {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const planBtn = document.getElementById('planTab');
  if (planBtn) planBtn.classList.add('active');
  const planPanel = document.getElementById('panel-plan');
  if (planPanel) planPanel.classList.add('active');
  const strip = document.getElementById('hplanStrip');
  const cta   = document.getElementById('hpsCta');
  if (strip) strip.classList.add('strip-hidden');
  if (cta)   cta.classList.add('cta-hidden');
  renderPlan();
  showBookFooter();
}

/** Rebuild the left-side timeline strip */
function updatePlanStrip() {
  const strip = document.getElementById('planStrip');
  if (!strip) return;

  if (!planItems.length) {
    strip.classList.remove('has-items');
    hideBookFooter();
    return;
  }
  strip.classList.add('has-items');

  const sorted = [...planItems].sort((a, b) => a.day - b.day);

  // ── Collapsed rail date rows ────────────────────────────────────
  updateRailDates();

  // ── Expanded panel header ───────────────────────────────────────
  const countEl = document.getElementById('psPanelCount');
  if (countEl) countEl.textContent = `${planItems.length} item${planItems.length !== 1 ? 's' : ''}`;

  const daysUsed    = new Set(planItems.map(it => it.day)).size;
  const progressPct = Math.round((daysUsed / DAYS.length) * 100);
  const fillEl  = document.getElementById('psProgressFill');
  const labelEl = document.getElementById('psProgressLabel');
  if (fillEl)  fillEl.style.width = progressPct + '%';
  if (labelEl) labelEl.textContent = `${daysUsed} of ${DAYS.length} days planned`;

  // ── Full date scaffold — every day, items or not ────────────────
  const timelineEl = document.getElementById('psTimeline');
  if (!timelineEl) { updateBookFooter(); return; }

  const byDay    = {};
  sorted.forEach(it => { (byDay[it.day] = byDay[it.day] || []).push(it); });
  const latestId = planItems[planItems.length - 1]?.id;

  timelineEl.innerHTML = DAYS.map((day, i) => {
    const items   = byDay[i] || [];
    const isEmpty = items.length === 0;
    const color   = DAY_COLORS[i % DAY_COLORS.length];

    const itemsHtml = items.map(it => {
      const emoji = it.isAnchor        ? '🎤' :
                    it.type === 'flight' ? '✈️' :
                    it.type === 'hotel'  ? '🏨' : '🎭';
      return `
        <div class="ps-tl-item ${it.id === latestId ? 'ps-tl-item--new' : ''}" onclick="goToPlanTab()">
          <div class="ps-tl-dot" style="background:${color}">${emoji}</div>
          <div class="ps-tl-body">
            <div class="ps-tl-name">${it.name}</div>
            <div class="ps-tl-info">${it.info}</div>
          </div>
          <div class="ps-tl-price">${it.price}</div>
        </div>`;
    }).join('');

    return `
      <div class="ps-tl-day ${isEmpty ? 'ps-tl-day--empty' : ''}">
        <div class="ps-tl-day-hd" ${isEmpty ? '' : `style="color:${color}"`}>
          <span class="ps-tl-day-label">${day.date}</span>
          <span class="ps-tl-day-dow">${day.dow}</span>
          ${day.concert ? '<span class="ps-concert-pip">🎤</span>' : ''}
        </div>
        ${itemsHtml}
      </div>`;
  }).join('');

  updateBookFooter();
}

/* ── Book Footer ─────────────────────────────────────────────────── */
function showBookFooter() {
  const footer = document.getElementById('planBookFooter');
  if (footer && planItems.length) {
    footer.classList.add('show');
    updateBookFooter();
  }
}
function hideBookFooter() {
  const footer = document.getElementById('planBookFooter');
  if (footer) footer.classList.remove('show');
}
function updateBookFooter() {
  const countEl = document.getElementById('pbfCount');
  const totalEl = document.getElementById('pbfTotal');
  if (countEl) countEl.textContent = `${planItems.length} item${planItems.length !== 1 ? 's' : ''} selected`;
  // rough total from price strings
  if (totalEl) {
    let sum = 0;
    planItems.forEach(it => {
      const n = parseInt((it.price || '').replace(/[₹,k]/gi, m => m==='k'?'000':''), 10);
      if (!isNaN(n)) sum += n;
    });
    totalEl.textContent = sum > 0 ? '₹' + sum.toLocaleString('en-IN') : '';
  }
}

/* ── Book Everything ─────────────────────────────────────────────── */
function bookEverything() {
  // Navigate to plan tab first
  goToPlanTab();

  const panelPlan = document.getElementById('panel-plan');
  if (!panelPlan) return;

  // Inject confirmation overlay into the plan panel
  const overlay = document.createElement('div');
  overlay.className = 'book-confirm-overlay';
  const steps = [
    `Locking flights · Singapore Airlines`,
    `Reserving hotel · Park Hyatt Tokyo`,
    ...planItems.filter(it => it.type === 'event').map(it => `Booking · ${it.name}`),
  ];
  overlay.innerHTML = `
    <div class="bco-icon">🛫</div>
    <div class="bco-title">Booking your trip…</div>
    <div class="bco-pbar-wrap"><div class="bco-pbar" id="bcoBar"></div></div>
    <div class="bco-steps">
      ${steps.map(s => `<div class="bco-step"><div class="bco-tick">○</div><div>${s}</div></div>`).join('')}
    </div>
  `;
  panelPlan.style.position = 'relative';
  panelPlan.appendChild(overlay);

  hideBookFooter();

  const stepEls = overlay.querySelectorAll('.bco-step');
  const bar     = document.getElementById('bcoBar');
  let i = 0;
  function tick() {
    if (i >= stepEls.length) {
      setTimeout(() => {
        overlay.innerHTML = `
          <div class="bco-icon">🎉</div>
          <div class="bco-title">Trip booked!</div>
          <div class="bco-sub">Confirmation &amp; itinerary sent to your email.<br>See you in Tokyo ✨</div>
        `;
      }, 400);
      return;
    }
    stepEls[i].classList.add('done');
    stepEls[i].querySelector('.bco-tick').textContent = '✓';
    if (bar) bar.style.width = ((i + 1) / stepEls.length * 100) + '%';
    i++;
    setTimeout(tick, 750);
  }
  setTimeout(tick, 500);
}

/* ── PROGRESSIVE EVENT REVEAL ──────────────────────────────────── */
function revealEventsProgressively() {
  let delay = 0;
  EVENT_CATEGORIES.forEach(cat => {
    // Reveal section header
    const hdDelay = delay;
    setTimeout(() => {
      const hd = document.querySelector(`.ev-section[data-cat="${cat.id}"] .ev-section-hd`);
      if (hd) {
        hd.style.transition = 'opacity .3s ease, transform .3s ease';
        hd.style.opacity = '1';
        hd.style.transform = 'none';
      }
    }, hdDelay);
    delay += 80;

    // Reveal each card + its map marker
    cat.events.forEach(e => {
      const cardDelay = delay;
      setTimeout(() => {
        const card = document.getElementById('ec-' + e.id);
        if (card) {
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
        revealedEvents.add(e.id);
        if (eventMarkerEls[e.id]) eventMarkerEls[e.id].style.opacity = '1';
      }, cardDelay);
      delay += 100;
    });
    delay += 60; // pause between sections
  });
}

/* ── EVENTS LOADER ─────────────────────────────────────────────── */
function initEventsLoader() {
  const loader  = document.getElementById('evLoader');
  const msgEl   = document.getElementById('evLoaderMsg');
  const barEl   = document.getElementById('evLoaderBar');
  const content = document.getElementById('evContent');
  if (!loader || !msgEl) return;

  msgEl.textContent = 'Curating events & restaurants around 28th August near Hatsune Miku concert…';

  // Progress bar
  setTimeout(() => { if (barEl) barEl.style.width = '100%'; }, 80);

  // Dismiss
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transform = 'translateY(-8px)';
    loader.style.transition = 'opacity .4s, transform .4s';
    if (content) {
      content.style.transition = 'opacity .4s';
      content.style.opacity = '1';
      content.style.pointerEvents = '';
    }
    setTimeout(() => loader.remove(), 450);
    setTimeout(() => revealEventsProgressively(), 200);
  }, 2600);
}

/* ── TABS ──────────────────────────────────────────────────────── */
function initTabs() {
  function moveTabIndicator(activeBtn) {
    const indicator = document.getElementById('tabIndicator');
    if (!indicator || !activeBtn) return;
    // offsetLeft/offsetWidth are relative to the offsetParent (the nav itself),
    // so they're exact — no viewport math, no rounding drift.
    indicator.style.left  = activeBtn.offsetLeft + 'px';
    indicator.style.width = activeBtn.offsetWidth + 'px';
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
      moveTabIndicator(btn);

      const strip = document.getElementById('hplanStrip');
      const cta   = document.getElementById('hpsCta');
      if (btn.dataset.tab === 'plan') {
        renderPlan();
        showBookFooter();
        if (strip) strip.classList.add('strip-hidden');
        if (cta)   cta.classList.add('cta-hidden');
      } else {
        hideBookFooter();
        if (strip) strip.classList.remove('strip-hidden');
        if (cta)   cta.classList.remove('cta-hidden');
      }
      if (btn.dataset.tab === 'flights') setTimeout(() => initFlightsLoader(), 60);
      if (btn.dataset.tab === 'hotels')  setTimeout(() => initHotelsLoader(), 60);
      if (btn.dataset.tab === 'events') setTimeout(() => initEventMap(), 60);
    });
  });

  // Position indicator on load with no transition (snap into place instantly)
  const indicator = document.getElementById('tabIndicator');
  if (indicator) indicator.style.transition = 'none';
  moveTabIndicator(document.querySelector('.tab-btn.active'));
  requestAnimationFrame(() => {
    if (indicator) indicator.style.transition = '';
  });
}

/* ════════════════════════════════════════════════════════════════
   BOTTOM AI SEARCH BAR
   ════════════════════════════════════════════════════════════════ */

const BSEARCH_PLACEHOLDERS = {
  flights: '"Non-stop only" · "Morning departure from BLR" · "Cheapest on Aug 26"',
  hotels:  '"Near the concert venue" · "Ryokan with onsen" · "Under ₹12k/night"',
  events:  '"Things to do near Makuhari Messe" · "Day trip to Mt. Fuji" · "Food tours"',
  plan:    '"Move the hotel to Aug 27" · "Add a free day" · "What\'s missing?"',
};

function initBottomSearch() {
  const textarea = document.getElementById('bsearchInput');
  const send     = document.getElementById('bsearchSend');
  if (!textarea || !send) return;

  // Auto-grow
  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
  }
  textarea.addEventListener('input', autoGrow);
  autoGrow();

  // Send action
  function doSearch() {
    const val = textarea.value.trim();
    if (!val) return;
    send.style.background = 'var(--brand)';
    send.innerHTML = '✓';
    setTimeout(() => {
      send.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`;
      send.style.background = '';
    }, 1200);
  }

  send.addEventListener('click', doSearch);
  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSearch(); }
  });
}

/* ── INIT ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Pre-populate concert anchor into plan strip
  planItems.push({
    id: 'concert_aug28',
    type: 'event',
    name: 'Hatsune Miku Concert',
    info: 'Makuhari Messe · Tokyo',
    price: '🎤 Anchor',
    day: 2,           // Day 3 = Aug 28
    isAnchor: true,
  });
  addedIds.add('concert_aug28');
  currentDay = 3;   // start assigning after the concert day (Aug 28 = day 2)
  itemsOnDay = [];
  // Reflect in plan badge
  const badge = document.getElementById('planBadge');
  if (badge) { badge.textContent = 1; badge.classList.add('show'); }
  // Build the horizontal plan strip
  updateHPlanStrip(); updateTabBadges();

  renderPriceChart();
  renderFlights();
  renderHotels();
  renderEvents();
  initEventsLoader();
  setTimeout(() => initEventMap(), 60);
  initTabs();
  initFilters();
  initAiChips();
  initFromTo();
  initBottomSearch();
});
