
export const moodOptions = [
  { value: 'happy', label: 'Happy', icon: '😊' },
  { value: 'sad', label: 'Sad', icon: '😢' },
  { value: 'angry', label: 'Angry', icon: '😠' },
  { value: 'excited', label: 'Excited', icon: '🤩' },
  { value: 'relaxed', label: 'Relaxed', icon: '😌' },
  { value: 'anxious', label: 'Anxious', icon: '😰' },
  { value: 'grateful', label: 'Grateful', icon: '🙏' },
  { value: 'confused', label: 'Confused', icon: '😕' },
  { value: 'stressed', label: 'Stressed', icon: '😫' },
  { value: 'calm', label: 'Calm', icon: '😇' },
  { value: 'neutral', label: 'Neutral', icon: '😐' }
];

export const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lato', label: 'Lato' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'playfair display', label: 'Playfair Display' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'source serif pro', label: 'Source Serif Pro' },
  { value: 'josefin sans', label: 'Josefin Sans' },
  { value: 'work sans', label: 'Work Sans' },
  { value: 'quicksand', label: 'Quicksand' },
  { value: 'space grotesk', label: 'Space Grotesk' },
  { value: 'dm sans', label: 'DM Sans' },
  { value: 'nunito', label: 'Nunito' },
  { value: 'raleway', label: 'Raleway' },
  { value: 'dancing script', label: 'Dancing Script' },
  { value: 'pacifico', label: 'Pacifico' },
  { value: 'great vibes', label: 'Great Vibes' },
  { value: 'satisfy', label: 'Satisfy' },
  { value: 'caveat', label: 'Caveat' },
  { value: 'sacramento', label: 'Sacramento' },
  { value: 'carattere', label: 'Carattere' },
  { value: 'birthstone', label: 'Birthstone' },
  { value: 'lobster', label: 'Lobster' },
  { value: 'petit formal script', label: 'Petit Formal Script' }
];

export const fontSizes = [
  { value: '12px', label: 'Small' },
  { value: '16px', label: 'Medium' },
  { value: '20px', label: 'Large' },
  { value: '24px', label: 'X-Large' },
  { value: '32px', label: 'XX-Large' },
  { value: '48px', label: 'Huge' }
];

export const fontWeights = [
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi-Bold' },
  { value: 'bold', label: 'Bold' }
];

export const gradients = [
  // Original gradients
  { label: 'Sunset', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { label: 'Ocean', value: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)' },
  { label: 'Lavender', value: 'linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)' },
  { label: 'Lemon', value: 'linear-gradient(184.1deg, rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2%)' },
  { label: 'Watermelon', value: 'linear-gradient(180deg, rgb(254,100,121) 0%, rgb(251,221,186) 100%)' },
  { label: 'Autumn', value: 'linear-gradient(111.4deg, rgba(238,113,113,1) 1%, rgba(246,215,148,1) 58%)' },
  { label: 'Cool Blue', value: 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)' },
  { label: 'Vintage', value: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)' },
  { label: 'Warm Rose', value: 'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)' },
  { label: 'Mint Sky', value: 'linear-gradient(60deg, #abecd6 0%, #fbed96 100%)' },
  { label: 'Soft Peach', value: 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)' },
  { label: 'Clean', value: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)' },
  
  // New gradients (adding 12 more)
  { label: 'Royal Purple', value: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)' },
  { label: 'Citrus Sunset', value: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)' },
  { label: 'Fresh Mint', value: 'linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)' },
  { label: 'Summer Green', value: 'linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)' },
  { label: 'Mango Tango', value: 'linear-gradient(90deg, hsla(22, 100%, 78%, 1) 0%, hsla(2, 78%, 62%, 1) 100%)' },
  { label: 'Sakura', value: 'linear-gradient(90deg, rgb(245,152,168) 0%, rgb(246,237,178) 100%)' },
  { label: 'Honey Gold', value: 'linear-gradient(90.5deg, rgba(255,207,139,0.50) 1.1%, rgba(255,207,139,1) 81.3%)' },
  { label: 'Deep Ocean', value: 'linear-gradient(to right, #243949 0%, #517fa4 100%)' },
  { label: 'Spring Meadow', value: 'linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)' },
  { label: 'Soft Sky', value: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)' },
  { label: 'Rose Gold', value: 'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)' },
  { label: 'Desert Sand', value: 'linear-gradient(to top, #e6b980 0%, #eacda3 100%)' }
];
