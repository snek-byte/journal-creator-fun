
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
  onStickerResize?: (size: number) => void;
  currentStickerSize?: number;
  selectedStickerId?: string | null;
}

// Giphy API sticker interface
interface GiphySticker {
  id: string;
  url: string;
  images: {
    fixed_width: {
      url: string;
      width: string;
      height: string;
    },
    original: {
      url: string;
    }
  };
  title: string;
}

// Combined sticker interface for our component
interface StoreSticker {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  keywords: string[];
  source: 'local' | 'giphy' | 'flaticon' | 'icons8' | 'emoji';
  isTransparent?: boolean;
}

export function StickerSelector({ 
  onStickerSelect, 
  onStickerResize,
  currentStickerSize = 100,
  selectedStickerId
}: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickerSize, setStickerSize] = useState(currentStickerSize);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allStickers, setAllStickers] = useState<StoreSticker[]>([]);
  const [giphyStickers, setGiphyStickers] = useState<StoreSticker[]>([]);
  
  // API Keys (these are public API keys - free tier)
  const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';
  
  // Update local size when prop changes
  useEffect(() => {
    setStickerSize(currentStickerSize);
  }, [currentStickerSize]);
  
  // Load local stickers
  useEffect(() => {
    // Pre-defined stickers array
    const localStickers: StoreSticker[] = [
      // Built-in stickers
      { id: 'star', url: '/stickers/star.svg', title: 'Star', category: 'basic', keywords: ['star', 'achievement', 'award'], source: 'local', isTransparent: true },
      { id: 'heart', url: '/stickers/heart.svg', title: 'Heart', category: 'basic', keywords: ['heart', 'love', 'like'], source: 'local', isTransparent: true },
      { id: 'thumbsup', url: '/stickers/thumbsup.svg', title: 'Thumbs Up', category: 'basic', keywords: ['thumbs up', 'like', 'approval'], source: 'local', isTransparent: true },
      { id: 'happy', url: '/stickers/happy.svg', title: 'Happy Face', category: 'emotions', keywords: ['happy', 'smile', 'emotion'], source: 'local', isTransparent: true },
      { id: 'sad', url: '/stickers/sad.svg', title: 'Sad Face', category: 'emotions', keywords: ['sad', 'unhappy', 'emotion'], source: 'local', isTransparent: true },
      { id: 'gift', url: '/stickers/gift.svg', title: 'Gift', category: 'celebration', keywords: ['gift', 'present', 'birthday', 'celebration'], source: 'local', isTransparent: true },
      { id: 'cake', url: '/stickers/cake.svg', title: 'Cake', category: 'celebration', keywords: ['cake', 'birthday', 'celebration', 'dessert'], source: 'local', isTransparent: true },
      { id: 'camera', url: '/stickers/camera.svg', title: 'Camera', category: 'objects', keywords: ['camera', 'photo', 'picture'], source: 'local', isTransparent: true },
      
      // Flaticon transparent stickers with attribution - Animals
      { id: 'cat1', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png', title: 'Cat', category: 'animals', keywords: ['cat', 'pet', 'animal'], source: 'flaticon', isTransparent: true },
      { id: 'dog1', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864593.png', title: 'Dog', category: 'animals', keywords: ['dog', 'pet', 'animal'], source: 'flaticon', isTransparent: true },
      { id: 'rabbit1', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', title: 'Rabbit', category: 'animals', keywords: ['rabbit', 'bunny', 'pet', 'animal'], source: 'flaticon', isTransparent: true },
      { id: 'elephant1', url: 'https://cdn-icons-png.flaticon.com/512/2395/2395796.png', title: 'Elephant', category: 'animals', keywords: ['elephant', 'animal', 'wildlife'], source: 'flaticon', isTransparent: true },
      { id: 'lion1', url: 'https://cdn-icons-png.flaticon.com/512/616/616412.png', title: 'Lion', category: 'animals', keywords: ['lion', 'animal', 'wildlife'], source: 'flaticon', isTransparent: true },
      { id: 'giraffe1', url: 'https://cdn-icons-png.flaticon.com/512/2395/2395752.png', title: 'Giraffe', category: 'animals', keywords: ['giraffe', 'animal', 'wildlife'], source: 'flaticon', isTransparent: true },
      { id: 'monkey1', url: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png', title: 'Monkey', category: 'animals', keywords: ['monkey', 'animal', 'wildlife'], source: 'flaticon', isTransparent: true },
      { id: 'penguin1', url: 'https://cdn-icons-png.flaticon.com/512/2395/2395766.png', title: 'Penguin', category: 'animals', keywords: ['penguin', 'animal', 'bird'], source: 'flaticon', isTransparent: true },
      { id: 'fish1', url: 'https://cdn-icons-png.flaticon.com/512/1728/1728939.png', title: 'Fish', category: 'animals', keywords: ['fish', 'animal', 'sea'], source: 'flaticon', isTransparent: true },
      { id: 'turtle1', url: 'https://cdn-icons-png.flaticon.com/512/5964/5964985.png', title: 'Turtle', category: 'animals', keywords: ['turtle', 'animal', 'reptile'], source: 'flaticon', isTransparent: true },
      { id: 'fox1', url: 'https://cdn-icons-png.flaticon.com/512/4663/4663450.png', title: 'Fox', category: 'animals', keywords: ['fox', 'animal', 'wildlife'], source: 'flaticon', isTransparent: true },
      { id: 'owl1', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069167.png', title: 'Owl', category: 'animals', keywords: ['owl', 'animal', 'bird'], source: 'flaticon', isTransparent: true },
      
      // Nature
      { id: 'flower1', url: 'https://cdn-icons-png.flaticon.com/512/826/826957.png', title: 'Flower', category: 'nature', keywords: ['flower', 'plant', 'nature'], source: 'flaticon', isTransparent: true },
      { id: 'tree1', url: 'https://cdn-icons-png.flaticon.com/512/489/489969.png', title: 'Tree', category: 'nature', keywords: ['tree', 'plant', 'nature'], source: 'flaticon', isTransparent: true },
      { id: 'sun1', url: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', title: 'Sun', category: 'nature', keywords: ['sun', 'weather', 'sunny'], source: 'flaticon', isTransparent: true },
      { id: 'cloud1', url: 'https://cdn-icons-png.flaticon.com/512/414/414927.png', title: 'Cloud', category: 'nature', keywords: ['cloud', 'weather', 'cloudy'], source: 'flaticon', isTransparent: true },
      { id: 'rainbow1', url: 'https://cdn-icons-png.flaticon.com/512/4838/4838145.png', title: 'Rainbow', category: 'nature', keywords: ['rainbow', 'weather', 'colorful'], source: 'flaticon', isTransparent: true },
      { id: 'leaf1', url: 'https://cdn-icons-png.flaticon.com/512/2925/2925577.png', title: 'Leaf', category: 'nature', keywords: ['leaf', 'plant', 'nature'], source: 'flaticon', isTransparent: true },
      { id: 'cactus1', url: 'https://cdn-icons-png.flaticon.com/512/2933/2933707.png', title: 'Cactus', category: 'nature', keywords: ['cactus', 'plant', 'nature'], source: 'flaticon', isTransparent: true },
      { id: 'moon1', url: 'https://cdn-icons-png.flaticon.com/512/1812/1812654.png', title: 'Moon', category: 'nature', keywords: ['moon', 'night', 'sky'], source: 'flaticon', isTransparent: true },
      { id: 'raindrop1', url: 'https://cdn-icons-png.flaticon.com/512/427/427112.png', title: 'Raindrop', category: 'nature', keywords: ['raindrop', 'rain', 'water'], source: 'flaticon', isTransparent: true },
      { id: 'snowflake1', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942441.png', title: 'Snowflake', category: 'nature', keywords: ['snowflake', 'snow', 'winter'], source: 'flaticon', isTransparent: true },
      { id: 'mountain1', url: 'https://cdn-icons-png.flaticon.com/512/1497/1497000.png', title: 'Mountain', category: 'nature', keywords: ['mountain', 'nature', 'landscape'], source: 'flaticon', isTransparent: true },
      { id: 'planet1', url: 'https://cdn-icons-png.flaticon.com/512/3594/3594414.png', title: 'Planet', category: 'nature', keywords: ['planet', 'space', 'astronomy'], source: 'flaticon', isTransparent: true },
      
      // Food
      { id: 'pizza1', url: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png', title: 'Pizza', category: 'food', keywords: ['pizza', 'food', 'meal'], source: 'flaticon', isTransparent: true },
      { id: 'icecream1', url: 'https://cdn-icons-png.flaticon.com/512/938/938063.png', title: 'Ice Cream', category: 'food', keywords: ['ice cream', 'dessert', 'cold'], source: 'flaticon', isTransparent: true },
      { id: 'coffee1', url: 'https://cdn-icons-png.flaticon.com/512/924/924514.png', title: 'Coffee', category: 'food', keywords: ['coffee', 'drink', 'hot'], source: 'flaticon', isTransparent: true },
      { id: 'burger1', url: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', title: 'Burger', category: 'food', keywords: ['burger', 'food', 'fast food'], source: 'flaticon', isTransparent: true },
      { id: 'fruit1', url: 'https://cdn-icons-png.flaticon.com/512/415/415682.png', title: 'Apple', category: 'food', keywords: ['apple', 'fruit', 'food'], source: 'flaticon', isTransparent: true },
      { id: 'donut1', url: 'https://cdn-icons-png.flaticon.com/512/541/541732.png', title: 'Donut', category: 'food', keywords: ['donut', 'dessert', 'sweet'], source: 'flaticon', isTransparent: true },
      { id: 'cake2', url: 'https://cdn-icons-png.flaticon.com/512/3637/3637252.png', title: 'Birthday Cake', category: 'food', keywords: ['cake', 'birthday', 'dessert'], source: 'flaticon', isTransparent: true },
      { id: 'sushi1', url: 'https://cdn-icons-png.flaticon.com/512/2252/2252075.png', title: 'Sushi', category: 'food', keywords: ['sushi', 'japanese', 'food'], source: 'flaticon', isTransparent: true },
      { id: 'taco1', url: 'https://cdn-icons-png.flaticon.com/512/189/189046.png', title: 'Taco', category: 'food', keywords: ['taco', 'mexican', 'food'], source: 'flaticon', isTransparent: true },
      { id: 'cupcake1', url: 'https://cdn-icons-png.flaticon.com/512/992/992763.png', title: 'Cupcake', category: 'food', keywords: ['cupcake', 'dessert', 'sweet'], source: 'flaticon', isTransparent: true },
      { id: 'cookie1', url: 'https://cdn-icons-png.flaticon.com/512/1047/1047711.png', title: 'Cookie', category: 'food', keywords: ['cookie', 'dessert', 'sweet'], source: 'flaticon', isTransparent: true },
      { id: 'watermelon1', url: 'https://cdn-icons-png.flaticon.com/512/874/874997.png', title: 'Watermelon', category: 'food', keywords: ['watermelon', 'fruit', 'food'], source: 'flaticon', isTransparent: true },
      
      // Travel
      { id: 'plane1', url: 'https://cdn-icons-png.flaticon.com/512/3126/3126609.png', title: 'Plane', category: 'travel', keywords: ['plane', 'travel', 'airplane', 'flight'], source: 'flaticon', isTransparent: true },
      { id: 'suitcase1', url: 'https://cdn-icons-png.flaticon.com/512/2553/2553627.png', title: 'Suitcase', category: 'travel', keywords: ['suitcase', 'travel', 'luggage'], source: 'flaticon', isTransparent: true },
      { id: 'map1', url: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', title: 'Map', category: 'travel', keywords: ['map', 'travel', 'location', 'direction'], source: 'flaticon', isTransparent: true },
      { id: 'car1', url: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png', title: 'Car', category: 'travel', keywords: ['car', 'travel', 'vehicle'], source: 'flaticon', isTransparent: true },
      { id: 'bus1', url: 'https://cdn-icons-png.flaticon.com/512/1023/1023435.png', title: 'Bus', category: 'travel', keywords: ['bus', 'travel', 'transport'], source: 'flaticon', isTransparent: true },
      { id: 'train1', url: 'https://cdn-icons-png.flaticon.com/512/3066/3066994.png', title: 'Train', category: 'travel', keywords: ['train', 'travel', 'transport'], source: 'flaticon', isTransparent: true },
      { id: 'boat1', url: 'https://cdn-icons-png.flaticon.com/512/2055/2055058.png', title: 'Boat', category: 'travel', keywords: ['boat', 'travel', 'ship'], source: 'flaticon', isTransparent: true },
      { id: 'passport1', url: 'https://cdn-icons-png.flaticon.com/512/1147/1147129.png', title: 'Passport', category: 'travel', keywords: ['passport', 'travel', 'document'], source: 'flaticon', isTransparent: true },
      { id: 'compass1', url: 'https://cdn-icons-png.flaticon.com/512/3106/3106703.png', title: 'Compass', category: 'travel', keywords: ['compass', 'travel', 'navigation'], source: 'flaticon', isTransparent: true },
      { id: 'hotel1', url: 'https://cdn-icons-png.flaticon.com/512/1285/1285089.png', title: 'Hotel', category: 'travel', keywords: ['hotel', 'travel', 'accommodation'], source: 'flaticon', isTransparent: true },
      { id: 'beach1', url: 'https://cdn-icons-png.flaticon.com/512/7794/7794575.png', title: 'Beach', category: 'travel', keywords: ['beach', 'travel', 'vacation'], source: 'flaticon', isTransparent: true },
      { id: 'mountains1', url: 'https://cdn-icons-png.flaticon.com/512/2939/2939889.png', title: 'Mountains', category: 'travel', keywords: ['mountains', 'travel', 'hiking'], source: 'flaticon', isTransparent: true },
      
      // School
      { id: 'book1', url: 'https://cdn-icons-png.flaticon.com/512/3616/3616986.png', title: 'Book', category: 'school', keywords: ['book', 'study', 'reading', 'education'], source: 'flaticon', isTransparent: true },
      { id: 'pencil1', url: 'https://cdn-icons-png.flaticon.com/512/2919/2919592.png', title: 'Pencil', category: 'school', keywords: ['pencil', 'write', 'drawing', 'education'], source: 'flaticon', isTransparent: true },
      { id: 'backpack1', url: 'https://cdn-icons-png.flaticon.com/512/2553/2553685.png', title: 'Backpack', category: 'school', keywords: ['backpack', 'bag', 'school'], source: 'flaticon', isTransparent: true },
      { id: 'notebook1', url: 'https://cdn-icons-png.flaticon.com/512/3209/3209265.png', title: 'Notebook', category: 'school', keywords: ['notebook', 'notes', 'school'], source: 'flaticon', isTransparent: true },
      { id: 'calculator1', url: 'https://cdn-icons-png.flaticon.com/512/943/943252.png', title: 'Calculator', category: 'school', keywords: ['calculator', 'math', 'school'], source: 'flaticon', isTransparent: true },
      { id: 'ruler1', url: 'https://cdn-icons-png.flaticon.com/512/625/625632.png', title: 'Ruler', category: 'school', keywords: ['ruler', 'measure', 'school'], source: 'flaticon', isTransparent: true },
      { id: 'globe1', url: 'https://cdn-icons-png.flaticon.com/512/44/44386.png', title: 'Globe', category: 'school', keywords: ['globe', 'world', 'geography'], source: 'flaticon', isTransparent: true },
      { id: 'schoolbus1', url: 'https://cdn-icons-png.flaticon.com/512/3097/3097166.png', title: 'School Bus', category: 'school', keywords: ['school bus', 'bus', 'school'], source: 'flaticon', isTransparent: true },
      
      // Emotions
      { id: 'smileFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129282.png', title: 'Smile', category: 'emotions', keywords: ['smile', 'happy', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'sadFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129212.png', title: 'Sad', category: 'emotions', keywords: ['sad', 'unhappy', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'loveFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129285.png', title: 'Love', category: 'emotions', keywords: ['love', 'heart', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'coolFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129283.png', title: 'Cool', category: 'emotions', keywords: ['cool', 'sunglasses', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'angryFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129272.png', title: 'Angry', category: 'emotions', keywords: ['angry', 'mad', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'surprisedFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129271.png', title: 'Surprised', category: 'emotions', keywords: ['surprised', 'shocked', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'laughFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129276.png', title: 'Laugh', category: 'emotions', keywords: ['laugh', 'haha', 'emotion'], source: 'flaticon', isTransparent: true },
      { id: 'tiredFace1', url: 'https://cdn-icons-png.flaticon.com/512/3129/3129286.png', title: 'Tired', category: 'emotions', keywords: ['tired', 'sleepy', 'emotion'], source: 'flaticon', isTransparent: true },
      
      // Sports
      { id: 'soccer1', url: 'https://cdn-icons-png.flaticon.com/512/53/53283.png', title: 'Soccer Ball', category: 'sports', keywords: ['soccer', 'football', 'sport'], source: 'flaticon', isTransparent: true },
      { id: 'basketball1', url: 'https://cdn-icons-png.flaticon.com/512/889/889455.png', title: 'Basketball', category: 'sports', keywords: ['basketball', 'ball', 'sport'], source: 'flaticon', isTransparent: true },
      { id: 'tennis1', url: 'https://cdn-icons-png.flaticon.com/512/2151/2151199.png', title: 'Tennis', category: 'sports', keywords: ['tennis', 'racket', 'sport'], source: 'flaticon', isTransparent: true },
      { id: 'baseball1', url: 'https://cdn-icons-png.flaticon.com/512/3790/3790217.png', title: 'Baseball', category: 'sports', keywords: ['baseball', 'ball', 'sport'], source: 'flaticon', isTransparent: true },
      { id: 'volleyball1', url: 'https://cdn-icons-png.flaticon.com/512/2834/2834395.png', title: 'Volleyball', category: 'sports', keywords: ['volleyball', 'ball', 'sport'], source: 'flaticon', isTransparent: true },
      { id: 'trophy1', url: 'https://cdn-icons-png.flaticon.com/512/3113/3113169.png', title: 'Trophy', category: 'sports', keywords: ['trophy', 'award', 'winner'], source: 'flaticon', isTransparent: true },
      { id: 'medal1', url: 'https://cdn-icons-png.flaticon.com/512/3250/3250256.png', title: 'Medal', category: 'sports', keywords: ['medal', 'award', 'winner'], source: 'flaticon', isTransparent: true },
      
      // Icons8 Beautiful Stickers
      { id: 'unicorn1', url: 'https://img.icons8.com/stickers/100/null/unicorn.png', title: 'Unicorn', category: 'fantasy', keywords: ['unicorn', 'fantasy', 'magical'], source: 'icons8', isTransparent: true },
      { id: 'dragon1', url: 'https://img.icons8.com/stickers/100/null/dragon.png', title: 'Dragon', category: 'fantasy', keywords: ['dragon', 'fantasy', 'magical'], source: 'icons8', isTransparent: true },
      { id: 'mermaid1', url: 'https://img.icons8.com/stickers/100/null/mermaid.png', title: 'Mermaid', category: 'fantasy', keywords: ['mermaid', 'fantasy', 'magical', 'sea'], source: 'icons8', isTransparent: true },
      { id: 'fairy1', url: 'https://img.icons8.com/stickers/100/null/fairy.png', title: 'Fairy', category: 'fantasy', keywords: ['fairy', 'fantasy', 'magical'], source: 'icons8', isTransparent: true },
      { id: 'wizard1', url: 'https://img.icons8.com/stickers/100/null/wizard.png', title: 'Wizard', category: 'fantasy', keywords: ['wizard', 'fantasy', 'magical'], source: 'icons8', isTransparent: true },
      { id: 'dinosaur1', url: 'https://img.icons8.com/stickers/100/null/dinosaur.png', title: 'Dinosaur', category: 'animals', keywords: ['dinosaur', 'animal', 'prehistoric'], source: 'icons8', isTransparent: true },
      { id: 'robot1', url: 'https://img.icons8.com/stickers/100/null/robot.png', title: 'Robot', category: 'tech', keywords: ['robot', 'technology', 'ai'], source: 'icons8', isTransparent: true },
      { id: 'astronaut1', url: 'https://img.icons8.com/stickers/100/null/astronaut.png', title: 'Astronaut', category: 'space', keywords: ['astronaut', 'space', 'cosmos'], source: 'icons8', isTransparent: true },
      { id: 'alien1', url: 'https://img.icons8.com/stickers/100/null/alien.png', title: 'Alien', category: 'space', keywords: ['alien', 'space', 'fantasy'], source: 'icons8', isTransparent: true },
      { id: 'rocket1', url: 'https://img.icons8.com/stickers/100/null/rocket.png', title: 'Rocket', category: 'space', keywords: ['rocket', 'space', 'ship'], source: 'icons8', isTransparent: true },
      { id: 'rainbow2', url: 'https://img.icons8.com/stickers/100/null/rainbow.png', title: 'Rainbow', category: 'nature', keywords: ['rainbow', 'nature', 'colorful'], source: 'icons8', isTransparent: true },
      { id: 'cloud2', url: 'https://img.icons8.com/stickers/100/null/cloud.png', title: 'Cloud', category: 'nature', keywords: ['cloud', 'nature', 'weather'], source: 'icons8', isTransparent: true },
      { id: 'sun2', url: 'https://img.icons8.com/stickers/100/null/sun.png', title: 'Sun', category: 'nature', keywords: ['sun', 'nature', 'weather'], source: 'icons8', isTransparent: true },
      { id: 'moon2', url: 'https://img.icons8.com/stickers/100/null/moon.png', title: 'Moon', category: 'nature', keywords: ['moon', 'nature', 'night'], source: 'icons8', isTransparent: true },
      { id: 'star2', url: 'https://img.icons8.com/stickers/100/null/star.png', title: 'Star', category: 'nature', keywords: ['star', 'nature', 'night'], source: 'icons8', isTransparent: true },
      { id: 'heart2', url: 'https://img.icons8.com/stickers/100/null/like.png', title: 'Heart', category: 'emotions', keywords: ['heart', 'love', 'emotion'], source: 'icons8', isTransparent: true },
      { id: 'crown1', url: 'https://img.icons8.com/stickers/100/null/crown.png', title: 'Crown', category: 'objects', keywords: ['crown', 'royal', 'king'], source: 'icons8', isTransparent: true },
      { id: 'diamond1', url: 'https://img.icons8.com/stickers/100/null/diamond.png', title: 'Diamond', category: 'objects', keywords: ['diamond', 'gem', 'jewel'], source: 'icons8', isTransparent: true },
      { id: 'camera2', url: 'https://img.icons8.com/stickers/100/null/camera.png', title: 'Camera', category: 'objects', keywords: ['camera', 'photo', 'picture'], source: 'icons8', isTransparent: true },
      { id: 'gift2', url: 'https://img.icons8.com/stickers/100/null/gift.png', title: 'Gift', category: 'objects', keywords: ['gift', 'present', 'box'], source: 'icons8', isTransparent: true },
      
      // Emoji style stickers
      { id: 'emoji-smile', url: 'https://em-content.zobj.net/source/skype/289/grinning-face_1f600.png', title: 'Smile', category: 'emoji', keywords: ['smile', 'happy', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-laugh', url: 'https://em-content.zobj.net/source/skype/289/face-with-tears-of-joy_1f602.png', title: 'Laugh', category: 'emoji', keywords: ['laugh', 'joy', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-heart-eyes', url: 'https://em-content.zobj.net/source/skype/289/smiling-face-with-heart-eyes_1f60d.png', title: 'Heart Eyes', category: 'emoji', keywords: ['love', 'heart', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-cool', url: 'https://em-content.zobj.net/source/skype/289/smiling-face-with-sunglasses_1f60e.png', title: 'Cool', category: 'emoji', keywords: ['cool', 'sunglasses', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-thinking', url: 'https://em-content.zobj.net/source/skype/289/thinking-face_1f914.png', title: 'Thinking', category: 'emoji', keywords: ['thinking', 'thought', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-party', url: 'https://em-content.zobj.net/source/skype/289/partying-face_1f973.png', title: 'Party', category: 'emoji', keywords: ['party', 'celebration', 'emotion'], source: 'emoji', isTransparent: true },
      { id: 'emoji-fire', url: 'https://em-content.zobj.net/source/skype/289/fire_1f525.png', title: 'Fire', category: 'emoji', keywords: ['fire', 'hot', 'flame'], source: 'emoji', isTransparent: true },
      { id: 'emoji-heart', url: 'https://em-content.zobj.net/source/skype/289/red-heart_2764-fe0f.png', title: 'Heart', category: 'emoji', keywords: ['heart', 'love', 'romance'], source: 'emoji', isTransparent: true },
      { id: 'emoji-rainbow', url: 'https://em-content.zobj.net/source/skype/289/rainbow_1f308.png', title: 'Rainbow', category: 'emoji', keywords: ['rainbow', 'colors', 'nature'], source: 'emoji', isTransparent: true },
      { id: 'emoji-star', url: 'https://em-content.zobj.net/source/skype/289/star_2b50.png', title: 'Star', category: 'emoji', keywords: ['star', 'night', 'sky'], source: 'emoji', isTransparent: true },
      { id: 'emoji-cake', url: 'https://em-content.zobj.net/source/skype/289/birthday-cake_1f382.png', title: 'Cake', category: 'emoji', keywords: ['cake', 'birthday', 'celebration'], source: 'emoji', isTransparent: true },
      { id: 'emoji-gift', url: 'https://em-content.zobj.net/source/skype/289/wrapped-gift_1f381.png', title: 'Gift', category: 'emoji', keywords: ['gift', 'present', 'celebration'], source: 'emoji', isTransparent: true },
    ];
    
    setAllStickers(prevStickers => {
      const combinedStickers = [...localStickers];
      
      // Deduplicate stickers by ID
      const uniqueStickers = combinedStickers.filter((sticker, index, self) => 
        index === self.findIndex(s => s.id === sticker.id)
      );
      
      return uniqueStickers;
    });
    
    // Load Giphy stickers
    fetchGiphyStickers('trending');
    
  }, []);
  
  // Function to fetch stickers from Giphy API
  const fetchGiphyStickers = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const endpoint = searchTerm === 'trending' 
        ? `https://api.giphy.com/v1/stickers/trending?api_key=${GIPHY_API_KEY}&limit=50`
        : `https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=50`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const formattedStickers: StoreSticker[] = data.data.map((sticker: GiphySticker) => ({
          id: `giphy-${sticker.id}`,
          url: sticker.images.original.url,
          thumbnailUrl: sticker.images.fixed_width.url,
          title: sticker.title || 'Giphy Sticker',
          category: 'giphy',
          keywords: sticker.title ? sticker.title.split(' ') : ['sticker'],
          source: 'giphy',
          isTransparent: true
        }));
        
        setGiphyStickers(formattedStickers);
        
        // Add to all stickers
        setAllStickers(prevStickers => {
          const combinedStickers = [...prevStickers, ...formattedStickers];
          
          // Deduplicate stickers by ID
          const uniqueStickers = combinedStickers.filter((sticker, index, self) => 
            index === self.findIndex(s => s.id === sticker.id)
          );
          
          return uniqueStickers;
        });
      }
    } catch (error) {
      console.error('Error fetching Giphy stickers:', error);
      toast.error('Failed to load stickers from Giphy');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim().length < 2) return;
    
    fetchGiphyStickers(searchQuery);
  };
  
  // Filter stickers based on search and category
  const filteredStickers = allStickers.filter(sticker => {
    // Filter by category
    if (selectedCategory !== 'all' && selectedCategory !== sticker.source && 
        selectedCategory !== sticker.category) {
      return false;
    }
    
    // Filter by search query (if not empty and we're not already searching via API)
    if (searchQuery && (sticker.source === 'local' || sticker.source === 'flaticon' || sticker.source === 'icons8' || sticker.source === 'emoji')) {
      return sticker.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      ) || sticker.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const handleStickerSelect = (url: string) => {
    console.log("Sticker selected:", url);
    onStickerSelect(url);
  };
  
  const handleSizeChange = (value: number[]) => {
    const newSize = value[0];
    setStickerSize(newSize);
    if (onStickerResize) {
      console.log("Resizing sticker to:", newSize);
      onStickerResize(newSize);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const loadMoreGiphyStickers = () => {
    const categories = ['cute', 'funny', 'love', 'animals', 'food', 'travel', 'happy', 'celebration', 'nature'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    fetchGiphyStickers(randomCategory);
  };
  
  console.log("Current sticker size:", stickerSize);
  console.log("Selected sticker ID:", selectedStickerId);
  console.log("Total stickers available:", allStickers.length);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Stickers ({allStickers.length})</h3>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stickers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          size="sm" 
          onClick={handleSearch}
          disabled={searchQuery.trim().length < 2 || isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>
      
      {/* Sticker resizer control */}
      <div className={`space-y-2 ${selectedStickerId ? '' : 'opacity-50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-xs font-medium">Sticker Size</h4>
          </div>
          <span className="text-xs text-muted-foreground">{stickerSize}px</span>
        </div>
        <Slider 
          value={[stickerSize]}
          min={20} 
          max={250} 
          step={1}
          onValueChange={handleSizeChange}
          disabled={!selectedStickerId}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          {selectedStickerId 
            ? "Adjust the size of the selected sticker" 
            : "Select a sticker to resize it"}
        </p>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all" className="text-[10px]">All</TabsTrigger>
          <TabsTrigger value="emotions" className="text-[10px]">Emotions</TabsTrigger>
          <TabsTrigger value="animals" className="text-[10px]">Animals</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
        </TabsList>
        
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="food" className="text-[10px]">Food</TabsTrigger>
          <TabsTrigger value="travel" className="text-[10px]">Travel</TabsTrigger>
          <TabsTrigger value="emoji" className="text-[10px]">Emoji</TabsTrigger>
          <TabsTrigger value="giphy" className="text-[10px]">Giphy</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[300px] pr-2">
          {isLoading && searchQuery ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Searching for stickers...</p>
            </div>
          ) : filteredStickers.length > 0 ? (
            <div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {filteredStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-24 flex items-center justify-center p-2"
                    onClick={() => handleStickerSelect(sticker.url)}
                  >
                    <img 
                      src={sticker.thumbnailUrl || sticker.url} 
                      alt={sticker.title} 
                      className="max-h-full object-contain" 
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              
              {/* Load more button */}
              {selectedCategory === 'all' || selectedCategory === 'giphy' ? (
                <div className="flex justify-center mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={loadMoreGiphyStickers}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Load more stickers
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground">
              <p>No stickers found.</p>
              <p className="text-xs mt-1">Try a different search term or category.</p>
            </div>
          )}
          
          {!isLoading && filteredStickers.length > 0 && (
            <div className="mt-4 mb-2 text-center">
              <p className="text-xs text-muted-foreground">
                Found {filteredStickers.length} stickers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Stickers provided by Giphy, Icons8, Flaticon, and Emoji
              </p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
