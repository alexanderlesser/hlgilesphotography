import image1 from '../assets/image1.webp'
import image2 from '../assets/image2.webp'
import image3 from '../assets/image3.webp'
import image4 from '../assets/image4.webp'
import image5 from '../assets/image5.webp'
import image6 from '../assets/image6.webp'

export interface Photo {
  id: string;
  src: string;
  title: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  coverImage: string;
}

export const photos: Photo[] = [
  { id: '1', src: image1, title: 'Misty Mountains', category: 'Landscape' },
  { id: '2', src: image2, title: 'Golden Hour Portrait', category: 'Portrait' },
  { id: '3', src: image3, title: 'Concrete Geometry', category: 'Architecture' },
  { id: '4', src: image4, title: 'Morning Dew', category: 'Nature' },
  { id: '5', src: image5, title: 'Night Walker', category: 'Street' },
  { id: '6', src: image6, title: 'Ocean Whispers', category: 'Seascape' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Chasing Light in the Scottish Highlands',
    excerpt: 'A journey through the misty landscapes of Scotland, where every sunrise tells a different story.',
    body: `There's something about the Scottish Highlands that calls to every photographer. The way the light breaks through the clouds, casting golden beams across ancient valleys — it's nothing short of magical.\n\nI spent two weeks traversing the narrow roads and hiking trails of the Highlands, waking before dawn each morning to capture the fleeting moments where mist meets mountain. The unpredictability of the weather became my greatest creative tool.\n\nEach photograph from this series represents a moment of stillness in an ever-changing landscape. The mountains don't move, but the light around them is never the same twice.\n\nThis trip reminded me why I fell in love with photography in the first place — the patience, the waiting, and then suddenly, that perfect convergence of elements that creates something extraordinary.`,
    date: 'February 15, 2026',
    coverImage: image1,
  },
  {
    id: '2',
    title: 'The Art of Natural Light Portraits',
    excerpt: 'Exploring how to harness golden hour for emotionally resonant portrait work.',
    body: `Natural light is the most honest light there is. It doesn't try to be anything — it simply is. And when you learn to work with it rather than against it, your portraits gain a depth that studio lighting can never quite replicate.\n\nIn this post, I want to share some of my techniques for capturing portraits during the golden hour — that magical window just after sunrise or before sunset when the light turns warm and soft.\n\nThe key is positioning. I always place my subject so the light falls at roughly 45 degrees, creating gentle shadows that define the face without harshness. A reflector held low can fill in under-eye shadows naturally.\n\nBut beyond technique, the real secret is connection. When your subject forgets the camera and simply exists in the moment, that's when the magic happens.`,
    date: 'January 28, 2026',
    coverImage: image2,
  },
  {
    id: '3',
    title: 'Finding Beauty in Brutalist Architecture',
    excerpt: 'How concrete structures and harsh angles can create surprisingly delicate photographic compositions.',
    body: `Brutalist architecture gets a bad reputation. People see cold, imposing concrete and feel nothing but indifference or even hostility. But through the lens, these structures transform into something entirely different.\n\nThe strong geometric lines and raw materiality of brutalist buildings create natural compositions. The play of light and shadow on concrete surfaces reveals textures and patterns invisible to the casual observer.\n\nI've spent the last year documenting brutalist buildings across Europe, and what I've found is a kind of accidental beauty — shapes and shadows that the architects may never have intended but that photography can reveal.\n\nThe lesson here extends beyond architecture: beauty exists everywhere, if you're willing to look for it.`,
    date: 'January 10, 2026',
    coverImage: image3,
  },
  {
    id: '4',
    title: 'Macro Photography: Worlds Within Worlds',
    excerpt: 'A deep dive into the miniature worlds revealed by macro lenses and patient observation.',
    body: `When you put a macro lens on your camera, the whole world changes. Suddenly, a single leaf becomes a landscape. A dewdrop becomes a mirror reflecting an entire garden. The ordinary becomes extraordinary.\n\nMacro photography requires a different mindset from other genres. Speed doesn't matter here — patience does. I sometimes spend thirty minutes with a single subject, waiting for the light to shift, for a breeze to settle, for everything to align.\n\nThe technical challenges are real: depth of field at macro distances is razor-thin, and any movement — yours or the subject's — can ruin a shot. But when everything comes together, the results are images that reveal a hidden dimension of the natural world.\n\nI hope these images inspire you to look more closely at the small wonders around you.`,
    date: 'December 22, 2025',
    coverImage: image4,
  },
  {
    id: '5',
    title: 'Street Photography After Dark',
    excerpt: 'Embracing low light and city glow to create atmospheric urban narratives.',
    body: `The city at night is a different place entirely. Familiar streets become stages for stories you'd never notice in daylight. Pools of lamplight, rain-slicked pavements, silhouettes moving through the urban landscape — it's cinema waiting to be captured.\n\nNight street photography demands technical adaptability. High ISO settings, wide apertures, and steady hands are your tools. But more importantly, it demands a willingness to wander, to follow instinct, and to find beauty in the unexpected.\n\nSome of my favourite images from this series were complete accidents — moments I stumbled upon while looking for something else entirely. That's the joy of street photography: you can't plan magic, but you can put yourself in its path.`,
    date: 'December 5, 2025',
    coverImage: image5,
  },
  {
    id: '6',
    title: 'Long Exposure Seascapes',
    excerpt: 'Using time as a creative tool to transform crashing waves into ethereal silk.',
    body: `There's a meditative quality to long exposure seascape photography. You set up your tripod, compose your frame, and then you wait. The shutter opens, and time begins to blur — waves become silk, clouds become brushstrokes, and the chaos of the ocean transforms into something serene.\n\nThe technical approach is straightforward: a sturdy tripod, an ND filter to extend exposure times, and patience. Exposures of 30 seconds to several minutes produce different effects, and experimentation is key.\n\nBut what I love most about this technique is the philosophical dimension. These images show something no human eye can see — they collapse minutes of time into a single frame, revealing patterns and movements that exist only in the photograph.\n\nIt's a reminder that photography doesn't just record reality — it can create entirely new ways of seeing.`,
    date: 'November 18, 2025',
    coverImage: image6,
  },
];