import { Perfume } from './types';
import imperialImg from './assets/images/imperial_perfume_premium_1783777697486.jpg';
import kaaafImg from './assets/images/kaaaf_perfume_premium_1783777681280.jpg';

export const PERFUMES: Perfume[] = [
  {
    id: 'imperial',
    name: 'Imperial',
    tagline: 'The essence of majestic power and timeless sophistication',
    description: 'A grand, opulent fragrance opening with vibrant citrus and rare spices, unfolding into rich oud, amber, and velvet rose, settling on a deep, regal woody base.',
    longDescription: 'Imperial represents the ultimate in olfactory royalty. Crafted for those who command presence without saying a word, this scent is a masterpiece of contrasts. It begins with the bright, sharp notes of Calabrian bergamot entwined with the warmth of rare Persian saffron and green cardamom. As the fragrance settles, a majestic heart of Turkish rose, rich Cambodian oud, and golden amber is revealed. The journey concludes with an enduring, luxurious dry-down of creamy sandalwood, patchouli, and soft leather, providing an extraordinary sillage that lasts all day and night.',
    price50ml: 2499,
    price100ml: 3999,
    image: imperialImg,
    olfactoryFamily: 'Amber Woody Spicy',
    concentration: 'Extrait de Parfum',
    topNotes: ['Calabrian Bergamot', 'Persian Saffron', 'Green Cardamom', 'Pink Pepper'],
    heartNotes: ['Turkish Rose', 'Cambodian Oud Wood', 'Star Jasmine', 'Warm Amber'],
    baseNotes: ['Sandalwood', 'Patchouli', 'Madagascar Vanilla', 'Soft Leather', 'Oakmoss'],
    longevity: '12+ Hours',
    sillage: 'Heavy & Majestic',
    gender: 'Unisex',
    ingredients: [
      'Alcohol Denat. (SDA 40-B)',
      'Parfum (Fragrance)',
      'Aqua (Water)',
      'Linalool',
      'Limonene',
      'Coumarin',
      'Alpha-Isomethyl Ionone',
      'Eugenol',
      'Citral',
      'Cinnamal'
    ],
    rating: 4.9,
    reviewsCount: 148
  },
  {
    id: 'kaaaf',
    name: 'Kaaaf',
    tagline: 'An invigorating wave of cold mountain air and coastal freshness',
    description: 'A crisp, bracing fragrance designed for the modern trailblazer. It begins with an icy burst of sea notes and mint, transitioning to clean aromatics, drying down to white musk.',
    longDescription: 'Kaaaf is a breath of crisp mountain air meeting the wild, salt-sprayed sea. It is engineered for the energetic, contemporary spirit who seeks absolute clarity and freshness. The fragrance opens with an intense blast of cold marine accords, crushed mint leaves, and a bite of green apple. The heart is beautifully aromatic, blending French lavender, clary sage, and sea minerals. This crystalline freshness is anchored by a sophisticated, skin-like base of clean white musk, rich ambergris, and earthy Haitian vetiver, leaving a powerful, revitalizing trail.',
    price50ml: 1999,
    price100ml: 3299,
    image: kaaafImg,
    olfactoryFamily: 'Fresh Aromatic Aquatic',
    concentration: 'Eau de Parfum',
    topNotes: ['Marine Accord', 'Crushed Mint', 'Green Apple', 'Lemon Zest'],
    heartNotes: ['French Lavender', 'Clary Sage', 'Sea Minerals', 'Geranium Leaf'],
    baseNotes: ['White Musk', 'Ambergris', 'Haitian Vetiver', 'Virginia Cedarwood'],
    longevity: '8-10 Hours',
    sillage: 'Moderate to Strong',
    gender: 'Unisex',
    ingredients: [
      'Alcohol Denat. (SDA 40-B)',
      'Parfum (Fragrance)',
      'Aqua (Water)',
      'Benzyl Salicylate',
      'Limonene',
      'Linalool',
      'Citronellol',
      'Geraniol',
      'Hexyl Cinnamal',
      'Citral'
    ],
    rating: 4.8,
    reviewsCount: 112
  }
];

export const GO_DADDY_INSTRUCTIONS = {
  domain: 'deeshop.in',
  platformUrl: 'https://ais-dev-hug6irpkpdruca3i6zojfw-483760666494.asia-southeast1.run.app', // App URL
  records: [
    {
      type: 'A',
      name: '@',
      value: '216.58.200.115', // Sample proxy IP
      ttl: '600 seconds',
      purpose: 'Points your root domain (deeshop.in) directly to the web hosting servers.'
    },
    {
      type: 'CNAME',
      name: 'www',
      value: 'ghs.googlehosted.com',
      ttl: '1 Hour',
      purpose: 'Enables access via the www prefix (www.deeshop.in) with SSL support.'
    },
    {
      type: 'TXT',
      name: '@',
      value: 'google-site-verification=ais-verification-deeshop-76781781',
      ttl: '1 Hour',
      purpose: 'Verifies domain ownership for security, automated SSL certificate generation, and hosting binding.'
    }
  ]
};
