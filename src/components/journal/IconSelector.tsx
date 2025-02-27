
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import type { Icon } from '@/types/journal';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IconSelectorProps {
  onIconSelect: (icon: Icon) => void;
}

// Define icon data structure
interface IconData {
  id: string;
  name: string;
  url: string;
  style: 'outline' | 'color';
}

export function IconSelector({ onIconSelect }: IconSelectorProps) {
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState<'outline' | 'color'>('outline');
  const [icons, setIcons] = useState<IconData[]>([]);
  const [recentIcons, setRecentIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  
  // Categories for icons
  const categories = [
    { value: 'all', label: 'All Icons' },
    { value: 'arrows', label: 'Arrows' },
    { value: 'weather', label: 'Weather' },
    { value: 'animals', label: 'Animals' },
    { value: 'food', label: 'Food' },
    { value: 'tech', label: 'Technology' },
    { value: 'transport', label: 'Transportation' },
    { value: 'people', label: 'People' },
    { value: 'nature', label: 'Nature' },
    { value: 'health', label: 'Health' },
    { value: 'business', label: 'Business' },
    { value: 'social', label: 'Social' },
  ];

  // Outline icon data
  const outlineIconSets = {
    all: [
      { name: 'home', label: 'Home' },
      { name: 'mail', label: 'Mail' },
      { name: 'settings', label: 'Settings' },
      { name: 'heart', label: 'Heart' },
      { name: 'tag', label: 'Tag' },
      { name: 'user', label: 'User' },
      { name: 'star', label: 'Star' },
      { name: 'globe', label: 'Globe' },
      { name: 'phone', label: 'Phone' },
      { name: 'bell', label: 'Bell' },
      { name: 'gift', label: 'Gift' },
      { name: 'code', label: 'Code' },
      { name: 'map-pin', label: 'Map Pin' },
      { name: 'image', label: 'Image' },
      { name: 'calendar', label: 'Calendar' },
      { name: 'message', label: 'Message' }
    ],
    arrows: [
      { name: 'arrow-up', label: 'Arrow Up' },
      { name: 'arrow-down', label: 'Arrow Down' },
      { name: 'arrow-left', label: 'Arrow Left' },
      { name: 'arrow-right', label: 'Arrow Right' },
      { name: 'chevron-up', label: 'Chevron Up' },
      { name: 'chevron-down', label: 'Chevron Down' },
      { name: 'chevron-left', label: 'Chevron Left' },
      { name: 'chevron-right', label: 'Chevron Right' },
      { name: 'refresh-cw', label: 'Refresh' },
      { name: 'rotate-cw', label: 'Rotate Clockwise' },
      { name: 'rotate-ccw', label: 'Rotate Counter-Clockwise' },
      { name: 'corner-up-left', label: 'Corner Up Left' },
      { name: 'corner-up-right', label: 'Corner Up Right' },
      { name: 'corner-down-left', label: 'Corner Down Left' },
      { name: 'corner-down-right', label: 'Corner Down Right' },
      { name: 'move', label: 'Move' }
    ],
    weather: [
      { name: 'cloud', label: 'Cloud' },
      { name: 'sun', label: 'Sun' },
      { name: 'moon', label: 'Moon' },
      { name: 'cloud-rain', label: 'Rain' },
      { name: 'cloud-snow', label: 'Snow' },
      { name: 'cloud-lightning', label: 'Lightning' },
      { name: 'cloud-drizzle', label: 'Drizzle' },
      { name: 'wind', label: 'Wind' },
      { name: 'umbrella', label: 'Umbrella' },
      { name: 'thermometer', label: 'Thermometer' },
      { name: 'sunset', label: 'Sunset' },
      { name: 'sunrise', label: 'Sunrise' },
      { name: 'droplets', label: 'Droplets' },
      { name: 'rainbow', label: 'Rainbow' },
      { name: 'cloud-fog', label: 'Fog' },
      { name: 'snowflake', label: 'Snowflake' }
    ],
    animals: [
      { name: 'bird', label: 'Bird' },
      { name: 'fish', label: 'Fish' },
      { name: 'rabbit', label: 'Rabbit' },
      { name: 'dog', label: 'Dog' },
      { name: 'cat', label: 'Cat' },
      { name: 'turtle', label: 'Turtle' },
      { name: 'mouse', label: 'Mouse' },
      { name: 'snake', label: 'Snake' },
      { name: 'bug', label: 'Bug' },
      { name: 'paw-print', label: 'Paw Print' },
      { name: 'feather', label: 'Feather' },
      { name: 'rat', label: 'Rat' },
      { name: 'lion', label: 'Lion' },
      { name: 'frog', label: 'Frog' },
      { name: 'whale', label: 'Whale' },
      { name: 'shark', label: 'Shark' }
    ],
    food: [
      { name: 'coffee', label: 'Coffee' },
      { name: 'pizza', label: 'Pizza' },
      { name: 'cake', label: 'Cake' },
      { name: 'milk', label: 'Milk' },
      { name: 'apple', label: 'Apple' },
      { name: 'cookie', label: 'Cookie' },
      { name: 'wine', label: 'Wine' },
      { name: 'utensils', label: 'Utensils' },
      { name: 'bottle', label: 'Bottle' },
      { name: 'glass', label: 'Glass' },
      { name: 'egg', label: 'Egg' },
      { name: 'candy', label: 'Candy' },
      { name: 'bread', label: 'Bread' },
      { name: 'lemon', label: 'Lemon' },
      { name: 'ice-cream', label: 'Ice Cream' },
      { name: 'cherry', label: 'Cherry' }
    ],
    tech: [
      { name: 'cpu', label: 'CPU' },
      { name: 'database', label: 'Database' },
      { name: 'server', label: 'Server' },
      { name: 'smartphone', label: 'Smartphone' },
      { name: 'tablet', label: 'Tablet' },
      { name: 'laptop', label: 'Laptop' },
      { name: 'monitor', label: 'Monitor' },
      { name: 'printer', label: 'Printer' },
      { name: 'keyboard', label: 'Keyboard' },
      { name: 'mouse', label: 'Mouse' },
      { name: 'battery', label: 'Battery' },
      { name: 'bluetooth', label: 'Bluetooth' },
      { name: 'wifi', label: 'WiFi' },
      { name: 'hard-drive', label: 'Hard Drive' },
      { name: 'save', label: 'Save' },
      { name: 'plug', label: 'Plug' }
    ],
    transport: [
      { name: 'car', label: 'Car' },
      { name: 'truck', label: 'Truck' },
      { name: 'bus', label: 'Bus' },
      { name: 'train', label: 'Train' },
      { name: 'ship', label: 'Ship' },
      { name: 'plane', label: 'Plane' },
      { name: 'bicycle', label: 'Bicycle' },
      { name: 'compass', label: 'Compass' },
      { name: 'navigation', label: 'Navigation' },
      { name: 'map', label: 'Map' },
      { name: 'rocket', label: 'Rocket' },
      { name: 'anchor', label: 'Anchor' },
      { name: 'sailboat', label: 'Sailboat' },
      { name: 'bike', label: 'Bike' },
      { name: 'helicopter', label: 'Helicopter' },
      { name: 'tram', label: 'Tram' }
    ],
    people: [
      { name: 'user', label: 'User' },
      { name: 'users', label: 'Users' },
      { name: 'user-plus', label: 'Add User' },
      { name: 'user-minus', label: 'Remove User' },
      { name: 'user-check', label: 'Check User' },
      { name: 'user-x', label: 'Delete User' },
      { name: 'baby', label: 'Baby' },
      { name: 'accessibility', label: 'Accessibility' },
      { name: 'glasses', label: 'Glasses' },
      { name: 'footprints', label: 'Footprints' },
      { name: 'hand', label: 'Hand' },
      { name: 'brain', label: 'Brain' },
      { name: 'ear', label: 'Ear' },
      { name: 'eye', label: 'Eye' },
      { name: 'smile', label: 'Smile' },
      { name: 'frown', label: 'Frown' }
    ],
    nature: [
      { name: 'leaf', label: 'Leaf' },
      { name: 'tree', label: 'Tree' },
      { name: 'flower', label: 'Flower' },
      { name: 'sun', label: 'Sun' },
      { name: 'mountain', label: 'Mountain' },
      { name: 'cloud', label: 'Cloud' },
      { name: 'droplet', label: 'Droplet' },
      { name: 'wind', label: 'Wind' },
      { name: 'moon', label: 'Moon' },
      { name: 'palmtree', label: 'Palm Tree' },
      { name: 'mountain-snow', label: 'Snow Mountain' },
      { name: 'trees', label: 'Trees' },
      { name: 'waves', label: 'Waves' },
      { name: 'flame', label: 'Flame' },
      { name: 'sprout', label: 'Sprout' },
      { name: 'seedling', label: 'Seedling' }
    ],
    health: [
      { name: 'activity', label: 'Activity' },
      { name: 'heart', label: 'Heart' },
      { name: 'thermometer', label: 'Thermometer' },
      { name: 'pill', label: 'Pill' },
      { name: 'first-aid', label: 'First Aid' },
      { name: 'syringe', label: 'Syringe' },
      { name: 'stethoscope', label: 'Stethoscope' },
      { name: 'lungs', label: 'Lungs' },
      { name: 'brain', label: 'Brain' },
      { name: 'bed', label: 'Bed' },
      { name: 'bandage', label: 'Bandage' },
      { name: 'virus', label: 'Virus' },
      { name: 'flask', label: 'Flask' },
      { name: 'pulse', label: 'Pulse' },
      { name: 'microscope', label: 'Microscope' },
      { name: 'weight', label: 'Weight' }
    ],
    business: [
      { name: 'briefcase', label: 'Briefcase' },
      { name: 'clipboard', label: 'Clipboard' },
      { name: 'file', label: 'File' },
      { name: 'folder', label: 'Folder' },
      { name: 'chart', label: 'Chart' },
      { name: 'pie-chart', label: 'Pie Chart' },
      { name: 'bar-chart', label: 'Bar Chart' },
      { name: 'layers', label: 'Layers' },
      { name: 'trending-up', label: 'Trending Up' },
      { name: 'trending-down', label: 'Trending Down' },
      { name: 'calculator', label: 'Calculator' },
      { name: 'presentation', label: 'Presentation' },
      { name: 'calendar', label: 'Calendar' },
      { name: 'banknote', label: 'Banknote' },
      { name: 'building', label: 'Building' },
      { name: 'landmark', label: 'Landmark' }
    ],
    social: [
      { name: 'facebook', label: 'Facebook' },
      { name: 'twitter', label: 'Twitter' },
      { name: 'instagram', label: 'Instagram' },
      { name: 'linkedin', label: 'LinkedIn' },
      { name: 'youtube', label: 'YouTube' },
      { name: 'github', label: 'GitHub' },
      { name: 'mail', label: 'Mail' },
      { name: 'share', label: 'Share' },
      { name: 'thumbs-up', label: 'Thumbs Up' },
      { name: 'thumbs-down', label: 'Thumbs Down' },
      { name: 'heart', label: 'Heart' },
      { name: 'star', label: 'Star' },
      { name: 'send', label: 'Send' },
      { name: 'message-circle', label: 'Message' },
      { name: 'link', label: 'Link' },
      { name: 'bookmark', label: 'Bookmark' }
    ]
  };

  // Color icon collections with accurate URLs
  const colorIconSets = {
    all: [
      { id: 'color-food-1', name: 'Pizza', url: 'https://img.icons8.com/fluency/96/pizza.png' },
      { id: 'color-food-2', name: 'Coffee', url: 'https://img.icons8.com/fluency/96/coffee.png' },
      { id: 'color-weather-1', name: 'Sun', url: 'https://img.icons8.com/fluency/96/sun.png' },
      { id: 'color-weather-2', name: 'Rain', url: 'https://img.icons8.com/fluency/96/rain.png' },
      { id: 'color-animal-1', name: 'Cat', url: 'https://img.icons8.com/fluency/96/cat.png' },
      { id: 'color-animal-2', name: 'Dog', url: 'https://img.icons8.com/fluency/96/dog.png' },
      { id: 'color-tech-1', name: 'Laptop', url: 'https://img.icons8.com/fluency/96/laptop.png' },
      { id: 'color-tech-2', name: 'Smartphone', url: 'https://img.icons8.com/fluency/96/smartphone.png' },
      { id: 'color-travel-1', name: 'World', url: 'https://img.icons8.com/fluency/96/globe.png' },
      { id: 'color-travel-2', name: 'Airplane', url: 'https://img.icons8.com/fluency/96/airplane-mode-on.png' },
      { id: 'color-nature-1', name: 'Tree', url: 'https://img.icons8.com/fluency/96/deciduous-tree.png' },
      { id: 'color-nature-2', name: 'Leaf', url: 'https://img.icons8.com/fluency/96/leaf.png' },
      { id: 'color-mood-1', name: 'Heart', url: 'https://img.icons8.com/fluency/96/like.png' },
      { id: 'color-mood-2', name: 'Star', url: 'https://img.icons8.com/fluency/96/star.png' },
      { id: 'color-social-1', name: 'Camera', url: 'https://img.icons8.com/fluency/96/camera.png' },
      { id: 'color-social-2', name: 'Mail', url: 'https://img.icons8.com/fluency/96/mail.png' }
    ],
    arrows: [
      { id: 'color-arrow-1', name: 'Up Arrow', url: 'https://img.icons8.com/fluency/96/up--v1.png' },
      { id: 'color-arrow-2', name: 'Down Arrow', url: 'https://img.icons8.com/fluency/96/down--v1.png' },
      { id: 'color-arrow-3', name: 'Left Arrow', url: 'https://img.icons8.com/fluency/96/left--v1.png' },
      { id: 'color-arrow-4', name: 'Right Arrow', url: 'https://img.icons8.com/fluency/96/right--v1.png' },
      { id: 'color-arrow-5', name: 'Up-Left Arrow', url: 'https://img.icons8.com/fluency/96/up-left--v1.png' },
      { id: 'color-arrow-6', name: 'Up-Right Arrow', url: 'https://img.icons8.com/fluency/96/up-right--v1.png' },
      { id: 'color-arrow-7', name: 'Down-Left Arrow', url: 'https://img.icons8.com/fluency/96/down-left--v1.png' },
      { id: 'color-arrow-8', name: 'Down-Right Arrow', url: 'https://img.icons8.com/fluency/96/down-right--v1.png' },
      { id: 'color-arrow-9', name: 'Skip Forward', url: 'https://img.icons8.com/fluency/96/skip-to-start.png' },
      { id: 'color-arrow-10', name: 'Skip Backward', url: 'https://img.icons8.com/fluency/96/end.png' },
      { id: 'color-arrow-11', name: 'Refresh', url: 'https://img.icons8.com/fluency/96/refresh.png' },
      { id: 'color-arrow-12', name: 'Rotate Right', url: 'https://img.icons8.com/fluency/96/rotate-right.png' },
      { id: 'color-arrow-13', name: 'Rotate Left', url: 'https://img.icons8.com/fluency/96/rotate-left.png' },
      { id: 'color-arrow-14', name: 'Expand', url: 'https://img.icons8.com/fluency/96/expand.png' },
      { id: 'color-arrow-15', name: 'Collapse', url: 'https://img.icons8.com/fluency/96/collapse.png' },
      { id: 'color-arrow-16', name: 'Sort', url: 'https://img.icons8.com/fluency/96/sort.png' }
    ],
    weather: [
      { id: 'color-weather-1', name: 'Sun', url: 'https://img.icons8.com/fluency/96/sun.png' },
      { id: 'color-weather-2', name: 'Rain', url: 'https://img.icons8.com/fluency/96/rain.png' },
      { id: 'color-weather-3', name: 'Cloud', url: 'https://img.icons8.com/fluency/96/cloud.png' },
      { id: 'color-weather-4', name: 'Snow', url: 'https://img.icons8.com/fluency/96/snow.png' },
      { id: 'color-weather-5', name: 'Lightning', url: 'https://img.icons8.com/fluency/96/lightning-bolt.png' },
      { id: 'color-weather-6', name: 'Wind', url: 'https://img.icons8.com/fluency/96/wind.png' },
      { id: 'color-weather-7', name: 'Rainbow', url: 'https://img.icons8.com/fluency/96/rainbow.png' },
      { id: 'color-weather-8', name: 'Thermometer', url: 'https://img.icons8.com/fluency/96/thermometer.png' },
      { id: 'color-weather-9', name: 'Umbrella', url: 'https://img.icons8.com/fluency/96/umbrella.png' },
      { id: 'color-weather-10', name: 'Moon', url: 'https://img.icons8.com/fluency/96/moon-symbol.png' },
      { id: 'color-weather-11', name: 'Partly Cloudy', url: 'https://img.icons8.com/fluency/96/partly-cloudy-day.png' },
      { id: 'color-weather-12', name: 'Tornado', url: 'https://img.icons8.com/fluency/96/tornado.png' },
      { id: 'color-weather-13', name: 'Sunrise', url: 'https://img.icons8.com/fluency/96/sunrise.png' },
      { id: 'color-weather-14', name: 'Sunset', url: 'https://img.icons8.com/fluency/96/sunset.png' },
      { id: 'color-weather-15', name: 'Temperature', url: 'https://img.icons8.com/fluency/96/temperature.png' },
      { id: 'color-weather-16', name: 'Hurricane', url: 'https://img.icons8.com/fluency/96/hurricane.png' }
    ],
    animals: [
      { id: 'color-animal-1', name: 'Cat', url: 'https://img.icons8.com/fluency/96/cat.png' },
      { id: 'color-animal-2', name: 'Dog', url: 'https://img.icons8.com/fluency/96/dog.png' },
      { id: 'color-animal-3', name: 'Bird', url: 'https://img.icons8.com/fluency/96/bird.png' },
      { id: 'color-animal-4', name: 'Fish', url: 'https://img.icons8.com/fluency/96/fish.png' },
      { id: 'color-animal-5', name: 'Rabbit', url: 'https://img.icons8.com/fluency/96/rabbit.png' },
      { id: 'color-animal-6', name: 'Turtle', url: 'https://img.icons8.com/fluency/96/turtle.png' },
      { id: 'color-animal-7', name: 'Butterfly', url: 'https://img.icons8.com/fluency/96/butterfly.png' },
      { id: 'color-animal-8', name: 'Bee', url: 'https://img.icons8.com/fluency/96/bee.png' },
      { id: 'color-animal-9', name: 'Paw', url: 'https://img.icons8.com/fluency/96/paw-print.png' },
      { id: 'color-animal-10', name: 'Horse', url: 'https://img.icons8.com/fluency/96/horse.png' },
      { id: 'color-animal-11', name: 'Dolphin', url: 'https://img.icons8.com/fluency/96/dolphin.png' },
      { id: 'color-animal-12', name: 'Elephant', url: 'https://img.icons8.com/fluency/96/elephant.png' },
      { id: 'color-animal-13', name: 'Penguin', url: 'https://img.icons8.com/fluency/96/penguin.png' },
      { id: 'color-animal-14', name: 'Lion', url: 'https://img.icons8.com/fluency/96/lion.png' },
      { id: 'color-animal-15', name: 'Cow', url: 'https://img.icons8.com/fluency/96/cow.png' },
      { id: 'color-animal-16', name: 'Fox', url: 'https://img.icons8.com/fluency/96/fox.png' }
    ],
    food: [
      { id: 'color-food-1', name: 'Pizza', url: 'https://img.icons8.com/fluency/96/pizza.png' },
      { id: 'color-food-2', name: 'Coffee', url: 'https://img.icons8.com/fluency/96/coffee.png' },
      { id: 'color-food-3', name: 'Cake', url: 'https://img.icons8.com/fluency/96/cake.png' },
      { id: 'color-food-4', name: 'Ice Cream', url: 'https://img.icons8.com/fluency/96/ice-cream.png' },
      { id: 'color-food-5', name: 'Salad', url: 'https://img.icons8.com/fluency/96/salad.png' },
      { id: 'color-food-6', name: 'Burger', url: 'https://img.icons8.com/fluency/96/hamburger.png' },
      { id: 'color-food-7', name: 'Sushi', url: 'https://img.icons8.com/fluency/96/sushi.png' },
      { id: 'color-food-8', name: 'Fruit', url: 'https://img.icons8.com/fluency/96/apple.png' },
      { id: 'color-food-9', name: 'Bread', url: 'https://img.icons8.com/fluency/96/bread.png' },
      { id: 'color-food-10', name: 'Croissant', url: 'https://img.icons8.com/fluency/96/croissant.png' },
      { id: 'color-food-11', name: 'Taco', url: 'https://img.icons8.com/fluency/96/taco.png' },
      { id: 'color-food-12', name: 'Cupcake', url: 'https://img.icons8.com/fluency/96/cupcake.png' },
      { id: 'color-food-13', name: 'Cheese', url: 'https://img.icons8.com/fluency/96/cheese.png' },
      { id: 'color-food-14', name: 'Cookie', url: 'https://img.icons8.com/fluency/96/cookie.png' },
      { id: 'color-food-15', name: 'Donut', url: 'https://img.icons8.com/fluency/96/donut.png' },
      { id: 'color-food-16', name: 'Smoothie', url: 'https://img.icons8.com/fluency/96/smoothie.png' }
    ],
    tech: [
      { id: 'color-tech-1', name: 'Laptop', url: 'https://img.icons8.com/fluency/96/laptop.png' },
      { id: 'color-tech-2', name: 'Smartphone', url: 'https://img.icons8.com/fluency/96/smartphone.png' },
      { id: 'color-tech-3', name: 'Computer', url: 'https://img.icons8.com/fluency/96/computer.png' },
      { id: 'color-tech-4', name: 'Game Controller', url: 'https://img.icons8.com/fluency/96/game-controller.png' },
      { id: 'color-tech-5', name: 'Headphones', url: 'https://img.icons8.com/fluency/96/headphones.png' },
      { id: 'color-tech-6', name: 'Keyboard', url: 'https://img.icons8.com/fluency/96/keyboard.png' },
      { id: 'color-tech-7', name: 'Mouse', url: 'https://img.icons8.com/fluency/96/mouse.png' },
      { id: 'color-tech-8', name: 'Printer', url: 'https://img.icons8.com/fluency/96/printer.png' },
      { id: 'color-tech-9', name: 'USB', url: 'https://img.icons8.com/fluency/96/usb-2.png' },
      { id: 'color-tech-10', name: 'Battery', url: 'https://img.icons8.com/fluency/96/full-battery.png' },
      { id: 'color-tech-11', name: 'Wifi', url: 'https://img.icons8.com/fluency/96/wifi.png' },
      { id: 'color-tech-12', name: 'Bluetooth', url: 'https://img.icons8.com/fluency/96/bluetooth.png' },
      { id: 'color-tech-13', name: 'Cloud', url: 'https://img.icons8.com/fluency/96/cloud.png' },
      { id: 'color-tech-14', name: 'Database', url: 'https://img.icons8.com/fluency/96/database.png' },
      { id: 'color-tech-15', name: 'Camera', url: 'https://img.icons8.com/fluency/96/camera.png' },
      { id: 'color-tech-16', name: 'Code', url: 'https://img.icons8.com/fluency/96/code.png' }
    ],
    transport: [
      { id: 'color-transport-1', name: 'Car', url: 'https://img.icons8.com/fluency/96/car.png' },
      { id: 'color-transport-2', name: 'Airplane', url: 'https://img.icons8.com/fluency/96/airplane-mode-on.png' },
      { id: 'color-transport-3', name: 'Bus', url: 'https://img.icons8.com/fluency/96/bus.png' },
      { id: 'color-transport-4', name: 'Bicycle', url: 'https://img.icons8.com/fluency/96/bicycle.png' },
      { id: 'color-transport-5', name: 'Train', url: 'https://img.icons8.com/fluency/96/train.png' },
      { id: 'color-transport-6', name: 'Ship', url: 'https://img.icons8.com/fluency/96/sailing-ship-large.png' },
      { id: 'color-transport-7', name: 'Motorcycle', url: 'https://img.icons8.com/fluency/96/motorcycle.png' },
      { id: 'color-transport-8', name: 'Taxi', url: 'https://img.icons8.com/fluency/96/taxi.png' },
      { id: 'color-transport-9', name: 'Rocket', url: 'https://img.icons8.com/fluency/96/rocket.png' },
      { id: 'color-transport-10', name: 'Helicopter', url: 'https://img.icons8.com/fluency/96/helicopter.png' },
      { id: 'color-transport-11', name: 'Tram', url: 'https://img.icons8.com/fluency/96/tram.png' },
      { id: 'color-transport-12', name: 'Scooter', url: 'https://img.icons8.com/fluency/96/kick-scooter.png' },
      { id: 'color-transport-13', name: 'Truck', url: 'https://img.icons8.com/fluency/96/truck.png' },
      { id: 'color-transport-14', name: 'Cable Car', url: 'https://img.icons8.com/fluency/96/cable-car.png' },
      { id: 'color-transport-15', name: 'Subway', url: 'https://img.icons8.com/fluency/96/subway.png' },
      { id: 'color-transport-16', name: 'Hot Air Balloon', url: 'https://img.icons8.com/fluency/96/air-balloon.png' }
    ],
    people: [
      { id: 'color-people-1', name: 'Person', url: 'https://img.icons8.com/fluency/96/person-male.png' },
      { id: 'color-people-2', name: 'People', url: 'https://img.icons8.com/fluency/96/conference-call.png' },
      { id: 'color-people-3', name: 'User', url: 'https://img.icons8.com/fluency/96/user.png' },
      { id: 'color-people-4', name: 'Man', url: 'https://img.icons8.com/fluency/96/businessman.png' },
      { id: 'color-people-5', name: 'Woman', url: 'https://img.icons8.com/fluency/96/businesswoman.png' },
      { id: 'color-people-6', name: 'Child', url: 'https://img.icons8.com/fluency/96/child-safe-zone.png' },
      { id: 'color-people-7', name: 'Family', url: 'https://img.icons8.com/fluency/96/family.png' },
      { id: 'color-people-8', name: 'Doctor', url: 'https://img.icons8.com/fluency/96/doctor-male.png' },
      { id: 'color-people-9', name: 'Chef', url: 'https://img.icons8.com/fluency/96/chef-hat.png' },
      { id: 'color-people-10', name: 'Athlete', url: 'https://img.icons8.com/fluency/96/running.png' },
      { id: 'color-people-11', name: 'Scientist', url: 'https://img.icons8.com/fluency/96/albert-einstein.png' },
      { id: 'color-people-12', name: 'Artist', url: 'https://img.icons8.com/fluency/96/paint-palette.png' },
      { id: 'color-people-13', name: 'Student', url: 'https://img.icons8.com/fluency/96/student-male.png' },
      { id: 'color-people-14', name: 'Teacher', url: 'https://img.icons8.com/fluency/96/teacher.png' },
      { id: 'color-people-15', name: 'Farmer', url: 'https://img.icons8.com/fluency/96/farmer.png' },
      { id: 'color-people-16', name: 'Engineer', url: 'https://img.icons8.com/fluency/96/engineer.png' }
    ],
    nature: [
      { id: 'color-nature-1', name: 'Tree', url: 'https://img.icons8.com/fluency/96/deciduous-tree.png' },
      { id: 'color-nature-2', name: 'Leaf', url: 'https://img.icons8.com/fluency/96/leaf.png' },
      { id: 'color-nature-3', name: 'Plant', url: 'https://img.icons8.com/fluency/96/potted-plant.png' },
      { id: 'color-nature-4', name: 'Flower', url: 'https://img.icons8.com/fluency/96/flower.png' },
      { id: 'color-nature-5', name: 'Mountain', url: 'https://img.icons8.com/fluency/96/mountain.png' },
      { id: 'color-nature-6', name: 'Beach', url: 'https://img.icons8.com/fluency/96/beach.png' },
      { id: 'color-nature-7', name: 'Forest', url: 'https://img.icons8.com/fluency/96/forest.png' },
      { id: 'color-nature-8', name: 'Water', url: 'https://img.icons8.com/fluency/96/water.png' },
      { id: 'color-nature-9', name: 'Fire', url: 'https://img.icons8.com/fluency/96/fire-element.png' },
      { id: 'color-nature-10', name: 'Earth', url: 'https://img.icons8.com/fluency/96/earth-element.png' },
      { id: 'color-nature-11', name: 'Desert', url: 'https://img.icons8.com/fluency/96/desert.png' },
      { id: 'color-nature-12', name: 'Moon', url: 'https://img.icons8.com/fluency/96/moon-symbol.png' },
      { id: 'color-nature-13', name: 'Sun', url: 'https://img.icons8.com/fluency/96/sun.png' },
      { id: 'color-nature-14', name: 'Cactus', url: 'https://img.icons8.com/fluency/96/cactus.png' },
      { id: 'color-nature-15', name: 'Mushroom', url: 'https://img.icons8.com/fluency/96/mushroom.png' },
      { id: 'color-nature-16', name: 'Lake', url: 'https://img.icons8.com/fluency/96/lake.png' }
    ],
    health: [
      { id: 'color-health-1', name: 'Heart', url: 'https://img.icons8.com/fluency/96/hearts.png' },
      { id: 'color-health-2', name: 'Pulse', url: 'https://img.icons8.com/fluency/96/heart-with-pulse.png' },
      { id: 'color-health-3', name: 'Stethoscope', url: 'https://img.icons8.com/fluency/96/stethoscope.png' },
      { id: 'color-health-4', name: 'First Aid', url: 'https://img.icons8.com/fluency/96/first-aid-kit.png' },
      { id: 'color-health-5', name: 'Pill', url: 'https://img.icons8.com/fluency/96/pill.png' },
      { id: 'color-health-6', name: 'Hospital', url: 'https://img.icons8.com/fluency/96/hospital-3.png' },
      { id: 'color-health-7', name: 'Yoga', url: 'https://img.icons8.com/fluency/96/yoga.png' },
      { id: 'color-health-8', name: 'Fitness', url: 'https://img.icons8.com/fluency/96/dumbbell.png' },
      { id: 'color-health-9', name: 'Healthy Food', url: 'https://img.icons8.com/fluency/96/vegetables-basket.png' },
      { id: 'color-health-10', name: 'Meditation', url: 'https://img.icons8.com/fluency/96/meditation.png' },
      { id: 'color-health-11', name: 'Sleep', url: 'https://img.icons8.com/fluency/96/sleeping.png' },
      { id: 'color-health-12', name: 'Water', url: 'https://img.icons8.com/fluency/96/water-glass.png' },
      { id: 'color-health-13', name: 'Running', url: 'https://img.icons8.com/fluency/96/running.png' },
      { id: 'color-health-14', name: 'Cycling', url: 'https://img.icons8.com/fluency/96/cycling.png' },
      { id: 'color-health-15', name: 'Swimming', url: 'https://img.icons8.com/fluency/96/swimming.png' },
      { id: 'color-health-16', name: 'Brain', url: 'https://img.icons8.com/fluency/96/brain.png' }
    ],
    business: [
      { id: 'color-business-1', name: 'Briefcase', url: 'https://img.icons8.com/fluency/96/briefcase.png' },
      { id: 'color-business-2', name: 'Chart', url: 'https://img.icons8.com/fluency/96/combo-chart.png' },
      { id: 'color-business-3', name: 'Presentation', url: 'https://img.icons8.com/fluency/96/presentation.png' },
      { id: 'color-business-4', name: 'Money', url: 'https://img.icons8.com/fluency/96/money-bag.png' },
      { id: 'color-business-5', name: 'Building', url: 'https://img.icons8.com/fluency/96/company.png' },
      { id: 'color-business-6', name: 'Handshake', url: 'https://img.icons8.com/fluency/96/handshake.png' },
      { id: 'color-business-7', name: 'Calendar', url: 'https://img.icons8.com/fluency/96/calendar.png' },
      { id: 'color-business-8', name: 'Document', url: 'https://img.icons8.com/fluency/96/document.png' },
      { id: 'color-business-9', name: 'Idea', url: 'https://img.icons8.com/fluency/96/idea.png' },
      { id: 'color-business-10', name: 'Target', url: 'https://img.icons8.com/fluency/96/target.png' },
      { id: 'color-business-11', name: 'Clock', url: 'https://img.icons8.com/fluency/96/clock.png' },
      { id: 'color-business-12', name: 'Mail', url: 'https://img.icons8.com/fluency/96/mail.png' },
      { id: 'color-business-13', name: 'Search', url: 'https://img.icons8.com/fluency/96/search.png' },
      { id: 'color-business-14', name: 'Team', url: 'https://img.icons8.com/fluency/96/conference-call.png' },
      { id: 'color-business-15', name: 'Growth', url: 'https://img.icons8.com/fluency/96/increase.png' },
      { id: 'color-business-16', name: 'Phone', url: 'https://img.icons8.com/fluency/96/phone.png' }
    ],
    social: [
      { id: 'color-social-1', name: 'Like', url: 'https://img.icons8.com/fluency/96/like.png' },
      { id: 'color-social-2', name: 'Message', url: 'https://img.icons8.com/fluency/96/speech-bubble.png' },
      { id: 'color-social-3', name: 'Camera', url: 'https://img.icons8.com/fluency/96/camera.png' },
      { id: 'color-social-4', name: 'Video', url: 'https://img.icons8.com/fluency/96/video.png' },
      { id: 'color-social-5', name: 'Share', url: 'https://img.icons8.com/fluency/96/share-rounded.png' },
      { id: 'color-social-6', name: 'Star', url: 'https://img.icons8.com/fluency/96/star.png' },
      { id: 'color-social-7', name: 'Facebook', url: 'https://img.icons8.com/fluency/96/facebook-new.png' },
      { id: 'color-social-8', name: 'Twitter', url: 'https://img.icons8.com/fluency/96/twitter.png' },
      { id: 'color-social-9', name: 'Instagram', url: 'https://img.icons8.com/fluency/96/instagram-new.png' },
      { id: 'color-social-10', name: 'LinkedIn', url: 'https://img.icons8.com/fluency/96/linkedin.png' },
      { id: 'color-social-11', name: 'YouTube', url: 'https://img.icons8.com/fluency/96/youtube-play.png' },
      { id: 'color-social-12', name: 'WhatsApp', url: 'https://img.icons8.com/fluency/96/whatsapp.png' },
      { id: 'color-social-13', name: 'TikTok', url: 'https://img.icons8.com/fluency/96/tiktok.png' },
      { id: 'color-social-14', name: 'Snapchat', url: 'https://img.icons8.com/fluency/96/snapchat.png' },
      { id: 'color-social-15', name: 'Pinterest', url: 'https://img.icons8.com/fluency/96/pinterest.png' },
      { id: 'color-social-16', name: 'Discord', url: 'https://img.icons8.com/fluency/96/discord-logo.png' }
    ]
  };

  // Load recent icons by default
  useEffect(() => {
    loadRecentIcons();
    fetchIcons();
  }, [style, category]);

  const loadRecentIcons = () => {
    try {
      const savedIcons = localStorage.getItem('recentIcons');
      if (savedIcons) {
        setRecentIcons(JSON.parse(savedIcons));
      }
    } catch (error) {
      console.error('Error loading recent icons:', error);
    }
  };

  const saveRecentIcon = (icon: IconData) => {
    try {
      const existingIcons = JSON.parse(localStorage.getItem('recentIcons') || '[]');
      // Check if icon already exists
      const exists = existingIcons.some((s: any) => s.id === icon.id);
      if (!exists) {
        // Add new icon to the front and keep only the last 8
        const updatedIcons = [icon, ...existingIcons].slice(0, 8);
        localStorage.setItem('recentIcons', JSON.stringify(updatedIcons));
        setRecentIcons(updatedIcons);
      }
    } catch (error) {
      console.error('Error saving recent icon:', error);
    }
  };

  // Function to get icons for specific categories and styles
  const fetchIcons = async () => {
    setLoading(true);
    
    try {
      let iconData: IconData[] = [];
      
      if (style === 'outline') {
        // Get outline icons from the predefined sets
        const selectedCategory = category as keyof typeof outlineIconSets;
        const iconSet = selectedCategory in outlineIconSets 
          ? outlineIconSets[selectedCategory] 
          : outlineIconSets.all;
          
        iconData = iconSet.map((icon, index) => ({
          id: `icon-outline-${icon.name}-${index}`,
          name: icon.label,
          url: `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${icon.name}.svg`,
          style: 'outline'
        }));
      } else {
        // Get color icons from predefined sets
        const selectedCategory = category as keyof typeof colorIconSets;
        const iconSet = selectedCategory in colorIconSets 
          ? colorIconSets[selectedCategory] 
          : colorIconSets.all;
          
        iconData = iconSet.map(icon => ({
          ...icon,
          style: 'color'
        }));
      }
      
      setIcons(iconData);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchIcons = async () => {
    if (!search.trim()) {
      fetchIcons();
      return;
    }
    
    setLoading(true);
    try {
      const query = search.toLowerCase().trim();
      let searchResults: IconData[] = [];
      
      if (style === 'outline') {
        // Flatten all outline icon categories for searching
        const allOutlineIcons = Object.values(outlineIconSets).flat();
        
        // Filter icons based on search term
        const filteredIcons = allOutlineIcons.filter(icon => 
          icon.label.toLowerCase().includes(query) || icon.name.toLowerCase().includes(query)
        ).slice(0, 16);
        
        searchResults = filteredIcons.map((icon, index) => ({
          id: `icon-search-outline-${icon.name}-${index}`,
          name: icon.label,
          url: `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${icon.name}.svg`,
          style: 'outline'
        }));
      } else {
        // Flatten all color icon categories for searching
        const allColorIcons = Object.values(colorIconSets).flat();
        
        // Filter icons based on search term
        const filteredIcons = allColorIcons.filter(icon => 
          icon.name.toLowerCase().includes(query)
        ).slice(0, 16);
        
        searchResults = filteredIcons.map(icon => ({
          ...icon,
          style: 'color'
        }));
      }
      
      setIcons(searchResults.length > 0 ? searchResults : []);
    } catch (error) {
      console.error('Error searching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = (icon: IconData) => {
    const selectedIcon: Icon = {
      id: icon.id,
      url: icon.url,
      position: { x: 50, y: 50 },
      style: style, 
      size: 48,
      color: style === 'color' ? undefined : '#000000'
    };
    
    onIconSelect(selectedIcon);
    saveRecentIcon(icon);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
          <DialogDescription>
            Search and select an icon to add to your journal
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select value={style} onValueChange={(value: 'outline' | 'color') => setStyle(value)}>
              <SelectTrigger className="w-1/3">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-2/3">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchIcons()}
              className="flex-1"
            />
            <Button onClick={searchIcons} disabled={loading} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading icons...
                </div>
              ) : icons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No icons found. Try a different search term or category.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {icons.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => handleIconClick(icon)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <img
                        src={icon.url}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = style === 'outline' 
                            ? 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/image.svg'
                            : 'https://img.icons8.com/fluency/96/image.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recent">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {recentIcons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No recent icons. Add some icons to see them here.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {recentIcons.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => handleIconClick(icon)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                    >
                      <img
                        src={icon.url}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = style === 'outline' 
                            ? 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/image.svg'
                            : 'https://img.icons8.com/fluency/96/image.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
