
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  HexColorPicker, 
  HexColorInput 
} from "react-colorful";

// Add the icon styling options
interface IconStylingOptions {
  color: string;
  size: number;
}

interface IconSelectorProps {
  onIconSelect: (icon: { url: string, style: 'outline' | 'color' }) => void;
  selectedIconId?: string | null;
  iconOptions?: IconStylingOptions;
  onIconUpdate?: (updates: Partial<IconStylingOptions>) => void;
}

export function IconSelector({ 
  onIconSelect, 
  selectedIconId, 
  iconOptions = { 
    color: '#000000', 
    size: 48 
  },
  onIconUpdate 
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [iconStyle, setIconStyle] = useState<'outline' | 'color'>('outline');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIconColor, setCurrentIconColor] = useState(iconOptions.color);
  const [currentIconSize, setCurrentIconSize] = useState(iconOptions.size);
  const [showAllIcons, setShowAllIcons] = useState(false);

  // Reorganized categories in a more logical order
  // OUTLINE ICONS - Black/monochrome line-based icons
  const outlineIconCategories = [
    {
      name: 'Flowers',
      icons: [
        { name: 'Simple Flower', url: 'https://cdn-icons-png.flaticon.com/512/2990/2990007.png' },
        { name: 'Tulip', url: 'https://cdn-icons-png.flaticon.com/512/2518/2518045.png' },
        { name: 'Daisy', url: 'https://cdn-icons-png.flaticon.com/512/2518/2518048.png' },
        { name: 'Rose', url: 'https://cdn-icons-png.flaticon.com/512/2497/2497650.png' },
        { name: 'Sunflower', url: 'https://cdn-icons-png.flaticon.com/512/3784/3784842.png' },
        { name: 'Lily', url: 'https://cdn-icons-png.flaticon.com/512/1539/1539441.png' },
        { name: 'Lotus', url: 'https://cdn-icons-png.flaticon.com/512/5090/5090207.png' },
        { name: 'Cherry Blossom', url: 'https://cdn-icons-png.flaticon.com/512/1599/1599898.png' },
        { name: 'Poppy', url: 'https://cdn-icons-png.flaticon.com/512/3822/3822707.png' },
        { name: 'Hibiscus', url: 'https://cdn-icons-png.flaticon.com/512/4781/4781767.png' },
        { name: 'Dandelion', url: 'https://cdn-icons-png.flaticon.com/512/7794/7794814.png' },
        { name: 'Orchid', url: 'https://cdn-icons-png.flaticon.com/512/3785/3785001.png' },
      ]
    },
    {
      name: 'Plants & Nature',
      icons: [
        { name: 'Tree', url: 'https://cdn-icons-png.flaticon.com/512/490/490091.png' },
        { name: 'Leaf', url: 'https://cdn-icons-png.flaticon.com/512/2925/2925727.png' },
        { name: 'Mountain', url: 'https://cdn-icons-png.flaticon.com/512/553/553989.png' },
        { name: 'Beach', url: 'https://cdn-icons-png.flaticon.com/512/1969/1969029.png' },
        { name: 'Forest', url: 'https://cdn-icons-png.flaticon.com/512/490/490105.png' },
        { name: 'Cactus', url: 'https://cdn-icons-png.flaticon.com/512/2278/2278083.png' },
        { name: 'Plant', url: 'https://cdn-icons-png.flaticon.com/512/628/628324.png' },
      ]
    },
    {
      name: 'Weather',
      icons: [
        { name: 'Sun', url: 'https://cdn-icons-png.flaticon.com/512/2204/2204346.png' },
        { name: 'Cloud', url: 'https://cdn-icons-png.flaticon.com/512/414/414927.png' },
        { name: 'Rain', url: 'https://cdn-icons-png.flaticon.com/512/3313/3313888.png' },
        { name: 'Snow', url: 'https://cdn-icons-png.flaticon.com/512/2204/2204346.png' },
        { name: 'Storm', url: 'https://cdn-icons-png.flaticon.com/512/1146/1146858.png' },
        { name: 'Lightning', url: 'https://cdn-icons-png.flaticon.com/512/56/56393.png' },
        { name: 'Rainbow', url: 'https://cdn-icons-png.flaticon.com/512/1059/1059889.png' },
        { name: 'Umbrella', url: 'https://cdn-icons-png.flaticon.com/512/2554/2554412.png' },
        { name: 'Thermometer', url: 'https://cdn-icons-png.flaticon.com/512/2804/2804311.png' },
        { name: 'Wind', url: 'https://cdn-icons-png.flaticon.com/512/2011/2011448.png' },
      ]
    },
    {
      name: 'Animals',
      icons: [
        { name: 'Cat', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' },
        { name: 'Dog', url: 'https://cdn-icons-png.flaticon.com/512/1998/1998627.png' },
        { name: 'Bird', url: 'https://cdn-icons-png.flaticon.com/512/2194/2194786.png' },
        { name: 'Fish', url: 'https://cdn-icons-png.flaticon.com/512/1998/1998723.png' },
        { name: 'Turtle', url: 'https://cdn-icons-png.flaticon.com/512/4614/4614873.png' },
        { name: 'Rabbit', url: 'https://cdn-icons-png.flaticon.com/512/3065/3065868.png' },
        { name: 'Fox', url: 'https://cdn-icons-png.flaticon.com/512/616/616450.png' },
        { name: 'Lion', url: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png' },
        { name: 'Tiger', url: 'https://cdn-icons-png.flaticon.com/512/371/371152.png' },
        { name: 'Elephant', url: 'https://cdn-icons-png.flaticon.com/512/375/375051.png' },
        { name: 'Penguin', url: 'https://cdn-icons-png.flaticon.com/512/437/437457.png' },
        { name: 'Owl', url: 'https://cdn-icons-png.flaticon.com/512/826/826994.png' },
      ]
    },
    {
      name: 'Food & Drink',
      icons: [
        { name: 'Coffee', url: 'https://cdn-icons-png.flaticon.com/512/985/985454.png' },
        { name: 'Pizza', url: 'https://cdn-icons-png.flaticon.com/512/599/599995.png' },
        { name: 'Burger', url: 'https://cdn-icons-png.flaticon.com/512/877/877951.png' },
        { name: 'Cake', url: 'https://cdn-icons-png.flaticon.com/512/2682/2682446.png' },
        { name: 'Ice Cream', url: 'https://cdn-icons-png.flaticon.com/512/938/938063.png' },
        { name: 'Fruit', url: 'https://cdn-icons-png.flaticon.com/512/3194/3194700.png' },
        { name: 'Vegetables', url: 'https://cdn-icons-png.flaticon.com/512/1682/1682908.png' },
        { name: 'Wine', url: 'https://cdn-icons-png.flaticon.com/512/2405/2405596.png' },
        { name: 'Tea', url: 'https://cdn-icons-png.flaticon.com/512/2935/2935435.png' },
        { name: 'Water', url: 'https://cdn-icons-png.flaticon.com/512/2442/2442988.png' },
        { name: 'Bread', url: 'https://cdn-icons-png.flaticon.com/512/1724/1724624.png' },
        { name: 'Sushi', url: 'https://cdn-icons-png.flaticon.com/512/2252/2252075.png' },
      ]
    },
    {
      name: 'Activities',
      icons: [
        { name: 'Sports', url: 'https://cdn-icons-png.flaticon.com/512/857/857418.png' },
        { name: 'Music', url: 'https://cdn-icons-png.flaticon.com/512/2829/2829076.png' },
        { name: 'Art', url: 'https://cdn-icons-png.flaticon.com/512/681/681662.png' },
        { name: 'Reading', url: 'https://cdn-icons-png.flaticon.com/512/2702/2702134.png' },
        { name: 'Gaming', url: 'https://cdn-icons-png.flaticon.com/512/13/13973.png' },
        { name: 'Hiking', url: 'https://cdn-icons-png.flaticon.com/512/1886/1886046.png' },
        { name: 'Swimming', url: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png' },
        { name: 'Cycling', url: 'https://cdn-icons-png.flaticon.com/512/1199/1199288.png' },
        { name: 'Dancing', url: 'https://cdn-icons-png.flaticon.com/512/2548/2548735.png' },
        { name: 'Shopping', url: 'https://cdn-icons-png.flaticon.com/512/743/743131.png' },
        { name: 'Yoga', url: 'https://cdn-icons-png.flaticon.com/512/3043/3043717.png' },
        { name: 'Photography', url: 'https://cdn-icons-png.flaticon.com/512/2972/2972199.png' },
      ]
    },
    {
      name: 'Travel',
      icons: [
        { name: 'Airplane', url: 'https://cdn-icons-png.flaticon.com/512/2168/2168652.png' },
        { name: 'Car', url: 'https://cdn-icons-png.flaticon.com/512/1048/1048315.png' },
        { name: 'Train', url: 'https://cdn-icons-png.flaticon.com/512/257/257658.png' },
        { name: 'Ship', url: 'https://cdn-icons-png.flaticon.com/512/105/105188.png' },
        { name: 'Compass', url: 'https://cdn-icons-png.flaticon.com/512/3174/3174429.png' },
        { name: 'Map', url: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' },
        { name: 'Suitcase', url: 'https://cdn-icons-png.flaticon.com/512/2285/2285561.png' },
        { name: 'Passport', url: 'https://cdn-icons-png.flaticon.com/512/1934/1934461.png' },
        { name: 'Camera', url: 'https://cdn-icons-png.flaticon.com/512/3178/3178209.png' },
        { name: 'Landmark', url: 'https://cdn-icons-png.flaticon.com/512/1851/1851036.png' },
        { name: 'Bus', url: 'https://cdn-icons-png.flaticon.com/512/2830/2830176.png' },
        { name: 'Bike', url: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' },
      ]
    },
    {
      name: 'Symbols',
      icons: [
        { name: 'Heart', url: 'https://cdn-icons-png.flaticon.com/512/2961/2961957.png' },
        { name: 'Star', url: 'https://cdn-icons-png.flaticon.com/512/149/149220.png' },
        { name: 'Flag', url: 'https://cdn-icons-png.flaticon.com/512/3500/3500833.png' },
        { name: 'Trophy', url: 'https://cdn-icons-png.flaticon.com/512/548/548481.png' },
        { name: 'Medal', url: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png' },
        { name: 'Diamond', url: 'https://cdn-icons-png.flaticon.com/512/1214/1214428.png' },
        { name: 'Crown', url: 'https://cdn-icons-png.flaticon.com/512/1378/1378598.png' },
        { name: 'Ribbon', url: 'https://cdn-icons-png.flaticon.com/512/1710/1710156.png' },
        { name: 'Fire', url: 'https://cdn-icons-png.flaticon.com/512/785/785116.png' },
        { name: 'Infinity', url: 'https://cdn-icons-png.flaticon.com/512/75/75725.png' },
        { name: 'Arrow', url: 'https://cdn-icons-png.flaticon.com/512/1053/1053167.png' },
        { name: 'Clock', url: 'https://cdn-icons-png.flaticon.com/512/2088/2088617.png' },
      ]
    },
  ];

  // COLOR ICONS - Full color icons with vibrant colors
  const colorIconCategories = [
    {
      name: 'Flowers',
      icons: [
        { name: 'Colorful Flower', url: 'https://cdn-icons-png.flaticon.com/512/1647/1647683.png' },
        { name: 'Bouquet', url: 'https://cdn-icons-png.flaticon.com/512/1686/1686375.png' },
        { name: 'Rose', url: 'https://cdn-icons-png.flaticon.com/512/6645/6645301.png' },
        { name: 'Tulip', url: 'https://cdn-icons-png.flaticon.com/512/6604/6604613.png' },
        { name: 'Daisy', url: 'https://cdn-icons-png.flaticon.com/512/867/867891.png' },
        { name: 'Sunflower', url: 'https://cdn-icons-png.flaticon.com/512/2229/2229076.png' },
        { name: 'Lotus', url: 'https://cdn-icons-png.flaticon.com/512/628/628338.png' },
        { name: 'Cherry Blossom', url: 'https://cdn-icons-png.flaticon.com/512/1599/1599733.png' },
        { name: 'Tropical Flower', url: 'https://cdn-icons-png.flaticon.com/512/2558/2558022.png' },
        { name: 'Iris', url: 'https://cdn-icons-png.flaticon.com/512/3901/3901746.png' },
        { name: 'Marigold', url: 'https://cdn-icons-png.flaticon.com/512/8061/8061897.png' },
        { name: 'Hibiscus', url: 'https://cdn-icons-png.flaticon.com/512/1408/1408247.png' },
      ]
    },
    {
      name: 'Plants & Nature',
      icons: [
        { name: 'Tree', url: 'https://cdn-icons-png.flaticon.com/512/7257/7257232.png' },
        { name: 'Leaf', url: 'https://cdn-icons-png.flaticon.com/512/2925/2925727.png' },
        { name: 'Mountain', url: 'https://cdn-icons-png.flaticon.com/512/3309/3309973.png' },
        { name: 'Beach', url: 'https://cdn-icons-png.flaticon.com/512/2333/2333015.png' },
        { name: 'Forest', url: 'https://cdn-icons-png.flaticon.com/512/2534/2534050.png' },
        { name: 'Cactus', url: 'https://cdn-icons-png.flaticon.com/512/2278/2278028.png' },
        { name: 'Plant', url: 'https://cdn-icons-png.flaticon.com/512/2037/2037085.png' },
      ]
    },
    {
      name: 'Weather',
      icons: [
        { name: 'Sun', url: 'https://cdn-icons-png.flaticon.com/512/3104/3104613.png' },
        { name: 'Cloud', url: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' },
        { name: 'Rain', url: 'https://cdn-icons-png.flaticon.com/512/2675/2675876.png' },
        { name: 'Snow', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942441.png' },
        { name: 'Storm', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942166.png' },
        { name: 'Lightning', url: 'https://cdn-icons-png.flaticon.com/512/3104/3104635.png' },
        { name: 'Rainbow', url: 'https://cdn-icons-png.flaticon.com/512/2942/2942446.png' },
        { name: 'Umbrella', url: 'https://cdn-icons-png.flaticon.com/512/2590/2590274.png' },
        { name: 'Thermometer', url: 'https://cdn-icons-png.flaticon.com/512/1684/1684375.png' },
        { name: 'Wind', url: 'https://cdn-icons-png.flaticon.com/512/1585/1585300.png' },
      ]
    },
    {
      name: 'Animals',
      icons: [
        { name: 'Cat', url: 'https://cdn-icons-png.flaticon.com/512/3163/3163178.png' },
        { name: 'Dog', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069197.png' },
        { name: 'Bird', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069105.png' },
        { name: 'Fish', url: 'https://cdn-icons-png.flaticon.com/512/471/471342.png' },
        { name: 'Turtle', url: 'https://cdn-icons-png.flaticon.com/512/2370/2370335.png' },
        { name: 'Rabbit', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' },
        { name: 'Fox', url: 'https://cdn-icons-png.flaticon.com/512/8835/8835701.png' },
        { name: 'Lion', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069002.png' },
        { name: 'Tiger', url: 'https://cdn-icons-png.flaticon.com/512/3186/3186853.png' },
        { name: 'Elephant', url: 'https://cdn-icons-png.flaticon.com/512/7856/7856344.png' },
        { name: 'Penguin', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069037.png' },
        { name: 'Owl', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069162.png' },
      ]
    },
    {
      name: 'Food & Drink',
      icons: [
        { name: 'Pizza', url: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png' },
        { name: 'Burger', url: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
        { name: 'Coffee', url: 'https://cdn-icons-png.flaticon.com/512/3127/3127407.png' },
        { name: 'Cake', url: 'https://cdn-icons-png.flaticon.com/512/3190/3190871.png' },
        { name: 'Fruit', url: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
        { name: 'Ice Cream', url: 'https://cdn-icons-png.flaticon.com/512/3090/3090437.png' },
        { name: 'Sushi', url: 'https://cdn-icons-png.flaticon.com/512/2252/2252075.png' },
        { name: 'Taco', url: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png' },
        { name: 'Pasta', url: 'https://cdn-icons-png.flaticon.com/512/2518/2518046.png' },
        { name: 'Croissant', url: 'https://cdn-icons-png.flaticon.com/512/2729/2729105.png' },
        { name: 'Bread', url: 'https://cdn-icons-png.flaticon.com/512/527/527982.png' },
        { name: 'Donut', url: 'https://cdn-icons-png.flaticon.com/512/1669/1669046.png' },
      ]
    },
    {
      name: 'Activities',
      icons: [
        { name: 'Sport', url: 'https://cdn-icons-png.flaticon.com/512/4219/4219908.png' },
        { name: 'Music', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png' },
        { name: 'Art', url: 'https://cdn-icons-png.flaticon.com/512/1048/1048315.png' },
        { name: 'Reading', url: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' },
        { name: 'Gaming', url: 'https://cdn-icons-png.flaticon.com/512/7101/7101818.png' },
        { name: 'Hiking', url: 'https://cdn-icons-png.flaticon.com/512/7239/7239096.png' },
        { name: 'Camping', url: 'https://cdn-icons-png.flaticon.com/512/1974/1974355.png' },
        { name: 'Photography', url: 'https://cdn-icons-png.flaticon.com/512/3178/3178209.png' },
        { name: 'Cooking', url: 'https://cdn-icons-png.flaticon.com/512/1830/1830839.png' },
        { name: 'Gardening', url: 'https://cdn-icons-png.flaticon.com/512/1518/1518914.png' },
        { name: 'Fishing', url: 'https://cdn-icons-png.flaticon.com/512/2119/2119217.png' },
        { name: 'Painting', url: 'https://cdn-icons-png.flaticon.com/512/1547/1547488.png' },
      ]
    },
    {
      name: 'Travel',
      icons: [
        { name: 'Airplane', url: 'https://cdn-icons-png.flaticon.com/512/826/826437.png' },
        { name: 'Car', url: 'https://cdn-icons-png.flaticon.com/512/3393/3393250.png' },
        { name: 'Train', url: 'https://cdn-icons-png.flaticon.com/512/8613/8613571.png' },
        { name: 'Ship', url: 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png' },
        { name: 'Compass', url: 'https://cdn-icons-png.flaticon.com/512/2785/2785834.png' },
        { name: 'Map', url: 'https://cdn-icons-png.flaticon.com/512/1379/1379505.png' },
        { name: 'Suitcase', url: 'https://cdn-icons-png.flaticon.com/512/149/149337.png' },
        { name: 'Passport', url: 'https://cdn-icons-png.flaticon.com/512/1147/1147125.png' },
        { name: 'Camera', url: 'https://cdn-icons-png.flaticon.com/512/3659/3659860.png' },
        { name: 'Landmark', url: 'https://cdn-icons-png.flaticon.com/512/9490/9490361.png' },
        { name: 'Bus', url: 'https://cdn-icons-png.flaticon.com/512/3034/3034056.png' },
        { name: 'Bike', url: 'https://cdn-icons-png.flaticon.com/512/3198/3198344.png' },
      ]
    },
    {
      name: 'Symbols',
      icons: [
        { name: 'Heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
        { name: 'Star', url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
        { name: 'Flag', url: 'https://cdn-icons-png.flaticon.com/512/3719/3719780.png' },
        { name: 'Trophy', url: 'https://cdn-icons-png.flaticon.com/512/548/548481.png' },
        { name: 'Medal', url: 'https://cdn-icons-png.flaticon.com/512/179/179251.png' },
        { name: 'Diamond', url: 'https://cdn-icons-png.flaticon.com/512/166/166422.png' },
        { name: 'Crown', url: 'https://cdn-icons-png.flaticon.com/512/3141/3141781.png' },
        { name: 'Ribbon', url: 'https://cdn-icons-png.flaticon.com/512/444/444605.png' },
        { name: 'Gift', url: 'https://cdn-icons-png.flaticon.com/512/2696/2696897.png' },
        { name: 'Globe', url: 'https://cdn-icons-png.flaticon.com/512/744/744502.png' },
        { name: 'Fire', url: 'https://cdn-icons-png.flaticon.com/512/740/740791.png' },
        { name: 'Bell', url: 'https://cdn-icons-png.flaticon.com/512/3601/3601157.png' },
      ]
    },
    {
      name: 'Flags',
      icons: [
        { name: 'USA', url: 'https://cdn-icons-png.flaticon.com/512/197/197484.png' },
        { name: 'UK', url: 'https://cdn-icons-png.flaticon.com/512/197/197374.png' },
        { name: 'Canada', url: 'https://cdn-icons-png.flaticon.com/512/197/197430.png' },
        { name: 'France', url: 'https://cdn-icons-png.flaticon.com/512/197/197560.png' },
        { name: 'Germany', url: 'https://cdn-icons-png.flaticon.com/512/197/197571.png' },
        { name: 'Japan', url: 'https://cdn-icons-png.flaticon.com/512/197/197604.png' },
        { name: 'China', url: 'https://cdn-icons-png.flaticon.com/512/197/197375.png' },
        { name: 'Brazil', url: 'https://cdn-icons-png.flaticon.com/512/197/197386.png' },
        { name: 'Mexico', url: 'https://cdn-icons-png.flaticon.com/512/197/197397.png' },
        { name: 'India', url: 'https://cdn-icons-png.flaticon.com/512/197/197419.png' },
        { name: 'Italy', url: 'https://cdn-icons-png.flaticon.com/512/197/197626.png' },
        { name: 'Spain', url: 'https://cdn-icons-png.flaticon.com/512/197/197593.png' },
      ]
    },
  ];

  // Get the right category set based on current iconStyle
  const iconCategories = iconStyle === 'outline' ? outlineIconCategories : colorIconCategories;

  // Function to filter icons based on search term
  const filterIcons = () => {
    // If show all icons is enabled, return all categories
    if (showAllIcons) {
      return iconCategories;
    }
    
    // If no search term and not showing all, return empty
    if (!searchTerm.trim()) {
      return [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return iconCategories
      .map(category => ({
        name: category.name,
        icons: category.icons.filter(icon => 
          icon.name.toLowerCase().includes(lowerSearchTerm) ||
          category.name.toLowerCase().includes(lowerSearchTerm)
        )
      }))
      .filter(category => category.icons.length > 0);
  };

  // Filtering
  const filteredCategories = filterIcons();

  // Handle color change and update parent if needed
  const handleColorChange = (color: string) => {
    setCurrentIconColor(color);
    if (selectedIconId && onIconUpdate) {
      onIconUpdate({ color });
    }
  };

  // Handle size change and update parent if needed
  const handleSizeChange = (values: number[]) => {
    const size = values[0];
    setCurrentIconSize(size);
    if (selectedIconId && onIconUpdate) {
      onIconUpdate({ size });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-tight">Icons & Flags</h3>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="browse" className="text-[10px]">Browse Icons</TabsTrigger>
            <TabsTrigger value="style" className="text-[10px]">Icon Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            {/* Icon style selection */}
            <div className="flex justify-center space-x-2">
              <Button
                size="sm"
                variant={iconStyle === 'outline' ? "default" : "outline"}
                onClick={() => setIconStyle('outline')}
                className="text-xs px-2 py-1"
                type="button"
              >
                Outline
              </Button>
              <Button
                size="sm"
                variant={iconStyle === 'color' ? "default" : "outline"}
                onClick={() => setIconStyle('color')}
                className="text-xs px-2 py-1"
                type="button"
              >
                Color
              </Button>
            </div>
            
            {/* Search input with Show All toggle */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons (e.g., flower, heart, dog)..."
                  className="pl-8 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    <CircleX className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Button
                size="sm"
                variant={showAllIcons ? "default" : "outline"}
                onClick={() => setShowAllIcons(!showAllIcons)}
                className="text-xs w-full"
                type="button"
              >
                {showAllIcons ? "Hide All Icons" : "Show All Icons"}
              </Button>
            </div>
            
            {/* Icon grid */}
            <ScrollArea className="h-[300px] pr-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCategories.length > 0 ? (
                <div className="space-y-4">
                  {filteredCategories.map((category, index) => (
                    category.icons.length > 0 && (
                      <div key={index} className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          {category.name}
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {category.icons.map((icon, iconIndex) => (
                            <button
                              key={iconIndex}
                              className="p-1 bg-white rounded border border-gray-200 hover:border-primary/50 h-12"
                              onClick={() => onIconSelect({ 
                                url: icon.url, 
                                style: iconStyle 
                              })}
                              type="button"
                            >
                              <img 
                                src={icon.url} 
                                alt={icon.name} 
                                className="w-full h-full object-contain" 
                                loading="lazy"
                                onError={(e) => {
                                  console.error(`Failed to load icon: ${icon.url}`);
                                  e.currentTarget.src = 'https://placehold.co/100x100/png?text=Icon+Error';
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-24 text-muted-foreground">
                  {searchTerm ? "No icons found - try a different search term" : "Search for icons or use 'Show All Icons'"}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            {selectedIconId ? (
              <>
                <div className="space-y-3">
                  <h4 className="text-xs font-medium">Icon Color</h4>
                  <HexColorPicker 
                    color={currentIconColor} 
                    onChange={handleColorChange} 
                    className="w-full" 
                  />
                  <div className="flex gap-2 items-center">
                    <span className="text-xs">Hex:</span>
                    <HexColorInput 
                      color={currentIconColor} 
                      onChange={handleColorChange} 
                      className="flex-1 px-2 py-1 text-xs border rounded"
                      prefixed 
                    />
                    <div 
                      className="w-8 h-6 rounded border"
                      style={{ backgroundColor: currentIconColor }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-medium">Icon Size</h4>
                  <Slider
                    value={[currentIconSize]}
                    min={16}
                    max={96}
                    step={4}
                    onValueChange={handleSizeChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Small</span>
                    <span className="text-xs">{currentIconSize}px</span>
                    <span className="text-xs text-muted-foreground">Large</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-center">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    No icon selected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Select an icon from the Browse tab first
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
