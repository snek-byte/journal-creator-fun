import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from './image-uploader/ImageUploader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ImageOff, ChevronDown } from "lucide-react";

interface BackgroundImageSelectorProps {
  onBackgroundSelect: (imageUrl: string) => void;
  currentBackground?: string;
}

export function BackgroundImageSelector({ onBackgroundSelect, currentBackground }: BackgroundImageSelectorProps) {
  const [activeTab, setActiveTab] = useState("papers");
  const [showMorePapers, setShowMorePapers] = useState<number>(1);
  const [showMorePatterns, setShowMorePatterns] = useState<number>(1);
  const [showMoreNature, setShowMoreNature] = useState<boolean>(false);
  const [showMoreGradients, setShowMoreGradients] = useState<boolean>(false);
  const [hasBackground, setHasBackground] = useState<boolean>(false);
  
  useEffect(() => {
    setHasBackground(!!currentBackground);
  }, [currentBackground]);
  
  const paperBackgrounds = [
    { name: "Vintage Parchment", url: "https://www.transparenttextures.com/patterns/old-map.png", bgColor: '#e8dcb5' },
    { name: "Concrete Wall", url: "https://www.transparenttextures.com/patterns/concrete-wall.png", bgColor: '#d3d3d3' },
    { name: "Dark Leather", url: "https://www.transparenttextures.com/patterns/leather.png", bgColor: '#584235' },
    { name: "Blue Fabric", url: "https://www.transparenttextures.com/patterns/textured-stripes.png", bgColor: '#bacbdf' },
    { name: "Cork Board", url: "https://www.transparenttextures.com/patterns/cork-board.png", bgColor: '#d8bc8a' },
    { name: "Denim", url: "https://www.transparenttextures.com/patterns/denim.png", bgColor: '#4a6a8f' },
    { name: "Washed Silk", url: "https://www.transparenttextures.com/patterns/clean-gray-paper.png", bgColor: '#f1eee9' },
    { name: "Groovy Paper", url: "https://www.transparenttextures.com/patterns/groovepaper.png", bgColor: '#fffcf5' },
    
    { name: "Brushed Alu", url: "https://www.transparenttextures.com/patterns/brushed-alum.png", bgColor: '#b8b8b8' },
    { name: "Cross Stripes", url: "https://www.transparenttextures.com/patterns/cross-stripes.png", bgColor: '#e8e8e8' },
    { name: "Wave Pattern", url: "https://www.transparenttextures.com/patterns/wave-grid.png", bgColor: '#eaf7f7' },
    { name: "Noise Pattern", url: "https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png", bgColor: '#f5f5f5' },
    { name: "Carbon Fiber", url: "https://www.transparenttextures.com/patterns/carbon-fibre-v2.png", bgColor: '#282828' },
    { name: "Shattered Dark", url: "https://www.transparenttextures.com/patterns/shattered-dark.png", bgColor: '#3a3a3a' },
    { name: "Flower Pattern", url: "https://www.transparenttextures.com/patterns/flowers.png", bgColor: '#f8f3e9' },
    { name: "Gray Washed Wall", url: "https://www.transparenttextures.com/patterns/gray-sand.png", bgColor: '#d9d9d9' },
    
    { name: "Real Carbon", url: "https://www.transparenttextures.com/patterns/real-carbon-fibre.png", bgColor: '#2d2d2d' },
    { name: "Green Fibers", url: "https://www.transparenttextures.com/patterns/green-fibers.png", bgColor: '#e9f0e0' },
    { name: "Linen Dark", url: "https://www.transparenttextures.com/patterns/dark-linen.png", bgColor: '#2d2c2c' },
    { name: "Checkered Light", url: "https://www.transparenttextures.com/patterns/light-paper-fibers.png", bgColor: '#f0f0f0' },
    { name: "Pinstriped Suit", url: "https://www.transparenttextures.com/patterns/pinstriped-suit.png", bgColor: '#2b303b' },
    { name: "Cream Pixels", url: "https://www.transparenttextures.com/patterns/cream-pixels.png", bgColor: '#fffbea' },
    { name: "Silver Scales", url: "https://www.transparenttextures.com/patterns/silver-scales.png", bgColor: '#e0e0e0' },
    { name: "Fabric Plaid", url: "https://www.transparenttextures.com/patterns/fabric-plaid.png", bgColor: '#c3dbd4' },
    { name: "Batthern", url: "https://www.transparenttextures.com/patterns/batthern.png", bgColor: '#e1ddda' },
    { name: "Escheresque", url: "https://www.transparenttextures.com/patterns/escheresque.png", bgColor: '#d6d6d6' },
    { name: "Embossed Paper", url: "https://www.transparenttextures.com/patterns/45-degree-fabric-light.png", bgColor: '#f7f7f7' },
    { name: "Binding Dark", url: "https://www.transparenttextures.com/patterns/binding-dark.png", bgColor: '#2c2c2c' },
    
    { name: "Handmade Paper", url: "https://www.transparenttextures.com/patterns/handmade-paper.png", bgColor: '#f5f2e8' },
    { name: "Rice Paper", url: "https://www.transparenttextures.com/patterns/rice-paper.png", bgColor: '#f7f3ea' },
    { name: "Fiber Paper", url: "https://www.transparenttextures.com/patterns/paper-fibers.png", bgColor: '#f3efea' },
    { name: "Watercolor Paper", url: "https://www.transparenttextures.com/patterns/white-paperboard.png", bgColor: '#f9f9f9' },
    { name: "Kraft Paper", url: "https://www.transparenttextures.com/patterns/kraft-paper.png", bgColor: '#d3b683' },
    { name: "Notebook Paper", url: "https://www.transparenttextures.com/patterns/notebook-dark.png", bgColor: '#e8e8e8' },
    { name: "Parchment", url: "https://www.transparenttextures.com/patterns/parchment.png", bgColor: '#e9dfb8' },
    { name: "Cardboard", url: "https://www.transparenttextures.com/patterns/cardboard.png", bgColor: '#d1bc8a' },
    { name: "Japanese Paper", url: "https://www.transparenttextures.com/patterns/japanese-paper.png", bgColor: '#f7f4ef' },
    { name: "Natural Paper", url: "https://www.transparenttextures.com/patterns/natural-paper.png", bgColor: '#f4efe4' },
    { name: "Paper Fibers 2", url: "https://www.transparenttextures.com/patterns/paper-1.png", bgColor: '#f0ece0' },
    { name: "Recycled Paper", url: "https://www.transparenttextures.com/patterns/recycled-paper.png", bgColor: '#e4e1d1' },
    { name: "Soft Wallpaper", url: "https://www.transparenttextures.com/patterns/soft-wallpaper.png", bgColor: '#f0eee9' },
    { name: "Textured Paper", url: "https://www.transparenttextures.com/patterns/textured-paper.png", bgColor: '#f7f2e8' },
    { name: "Exclusive Paper", url: "https://www.transparenttextures.com/patterns/exclusive-paper.png", bgColor: '#f3f1ec' },
    { name: "Old Paper", url: "https://www.transparenttextures.com/patterns/old-paper.png", bgColor: '#e0d4b6' },
    { name: "Sand Paper", url: "https://www.transparenttextures.com/patterns/sandpaper.png", bgColor: '#e8e4d8' },
    { name: "Rough Paper", url: "https://www.transparenttextures.com/patterns/rough-cloth.png", bgColor: '#ebe7db' },
    { name: "Watercolor", url: "https://www.transparenttextures.com/patterns/watercolor.png", bgColor: '#f1eeee' },
    { name: "Grainy Texture", url: "https://www.transparenttextures.com/patterns/graphy.png", bgColor: '#eae6dc' },
    
    { name: "Lined Paper", url: "https://www.transparenttextures.com/patterns/lined-paper.png", bgColor: '#f5f5f5' },
    { name: "Legal Pad", url: "https://www.transparenttextures.com/patterns/low-contrast-linen.png", bgColor: '#fefbe2' },
    { name: "Antique Paper", url: "https://www.transparenttextures.com/patterns/paper-2.png", bgColor: '#f0ead6' },
    { name: "Construction Paper", url: "https://www.transparenttextures.com/patterns/subtle-white-feathers.png", bgColor: '#f5e7c0' },
    { name: "Old Parchment", url: "https://www.transparenttextures.com/patterns/noisy.png", bgColor: '#e1bc91' },
    { name: "Newsprint", url: "https://www.transparenttextures.com/patterns/newspaper.png", bgColor: '#efefef' },
    { name: "Notebook Grid", url: "https://www.transparenttextures.com/patterns/project-paper.png", bgColor: '#ffffff' },
    { name: "Rice Sheet", url: "https://www.transparenttextures.com/patterns/white-sand.png", bgColor: '#f9f8f2' },
    { name: "Creased Paper", url: "https://www.transparenttextures.com/patterns/subtle-white-feathers.png", bgColor: '#f9f5eb' },
    { name: "Artisan Paper", url: "https://www.transparenttextures.com/patterns/paper-3.png", bgColor: '#f8f4e9' },
    
    { name: "Laid Paper", url: "https://www.transparenttextures.com/patterns/subtle-zebra-3d.png", bgColor: '#f2efe4' },
    { name: "Woven Paper", url: "https://www.transparenttextures.com/patterns/woven.png", bgColor: '#f5f1e8' },
    { name: "Linen Sheet", url: "https://www.transparenttextures.com/patterns/subtle-grey.png", bgColor: '#f9f8f5' },
    { name: "Manuscript", url: "https://www.transparenttextures.com/patterns/pineapple-cut.png", bgColor: '#eae0cb' },
    { name: "Papyrus", url: "https://www.transparenttextures.com/patterns/beige-paper.png", bgColor: '#e6d7b8' },
    { name: "Manila Paper", url: "https://www.transparenttextures.com/patterns/connected.png", bgColor: '#f5e9c1' },
    { name: "Sketch Paper", url: "https://www.transparenttextures.com/patterns/white-brushed.png", bgColor: '#ffffff' },
    { name: "Book Page", url: "https://www.transparenttextures.com/patterns/white-carbonfiber.png", bgColor: '#f5f5f0' },
    { name: "Stationery", url: "https://www.transparenttextures.com/patterns/subtle-stripes.png", bgColor: '#fafaff' },
    { name: "Watermark Paper", url: "https://www.transparenttextures.com/patterns/light-wool.png", bgColor: '#f8f8f8' },
    
    { name: "Cotton Paper", url: "https://www.transparenttextures.com/patterns/notebook.png", bgColor: '#f4f4f4' },
    { name: "Pressed Paper", url: "https://www.transparenttextures.com/patterns/silver-scales.png", bgColor: '#f0f0f0' },
    { name: "Archives", url: "https://www.transparenttextures.com/patterns/subtle-white-feathers.png", bgColor: '#f0e6d2' },
    { name: "Aged Document", url: "https://www.transparenttextures.com/patterns/xv.png", bgColor: '#e8d8b5' },
    { name: "Fine Paper", url: "https://www.transparenttextures.com/patterns/subtle-surface.png", bgColor: '#fafaf8' },
    { name: "Letterhead", url: "https://www.transparenttextures.com/patterns/subtlenet2.png", bgColor: '#f9f9f9' },
    { name: "Rustic Paper", url: "https://www.transparenttextures.com/patterns/skin-side-up.png", bgColor: '#e8dfca' },
    { name: "Scroll Texture", url: "https://www.transparenttextures.com/patterns/az-subtle.png", bgColor: '#e5dabc' },
    { name: "Bamboo Paper", url: "https://www.transparenttextures.com/patterns/tiny-grid.png", bgColor: '#f1ebd5' },
    { name: "Velvet Paper", url: "https://www.transparenttextures.com/patterns/worn-dots.png", bgColor: '#f2efea' }
  ];
  
  const initialNatureBackgrounds = [
    { name: "Mountains", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Waterfall", url: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Desert", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&h=1000&q=80" }
  ];
  
  const additionalNatureBackgrounds = [
    { name: "Mountains Lake", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Autumn Forest", url: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Waterfalls", url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Snow Mountains", url: "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Calm Lake", url: "https://images.unsplash.com/photo-1489619243109-4e0ea59cfe10?auto=format&fit=crop&w=800&h=1000&q=80" },
    { name: "Northern Lights", url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&h=1000&q=80" }
  ];
  
  const natureBackgrounds = showMoreNature 
    ? [...initialNatureBackgrounds, ...additionalNatureBackgrounds]
    : initialNatureBackgrounds;
  
  const initialGradientBackgrounds = [
    { name: "Sunset", url: "linear-gradient(to right, #f83600 0%, #f9d423 100%)" },
    { name: "Blue-Purple", url: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)" },
    { name: "Pink-Orange", url: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)" },
    { name: "Green-Blue", url: "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)" },
    { name: "Purple-Pink", url: "linear-gradient(to right, #8e2de2 0%, #4a00e0 100%)" },
    { name: "Yellow-Orange", url: "linear-gradient(to right, #f6d365 0%, #fda085 100%)" }
  ];
  
  const additionalGradientBackgrounds = [
    { name: "Teal-Turquoise", url: "linear-gradient(to right, #0093E9 0%, #80D0C7 100%)" },
    { name: "Blue-Pink", url: "linear-gradient(to right, #2980B9 0%, #6DD5FA 50%, #FFFFFF 100%)" },
    { name: "Pink-Purple", url: "linear-gradient(to right, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)" },
    { name: "Orange-Red", url: "linear-gradient(to right, #ff512f 0%, #f09819 100%)" },
    { name: "Green-Yellow", url: "linear-gradient(to right, #C6FFDD 0%, #FBD786 50%, #f7797d 100%)" },
    { name: "Light Blue", url: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }
  ];
  
  const gradientBackgrounds = showMoreGradients
    ? [...initialGradientBackgrounds, ...additionalGradientBackgrounds]
    : initialGradientBackgrounds;
  
  const patternBackgrounds = [
    { name: "Blue Chevron", url: "https://www.transparenttextures.com/patterns/45-degree-fabric-light.png", bgColor: '#A9D0F5' },
    { name: "Red Plaid", url: "https://www.transparenttextures.com/patterns/fabric-plaid.png", bgColor: '#F5A9A9' },
    { name: "Green Diamonds", url: "https://www.transparenttextures.com/patterns/diamond-upholstery.png", bgColor: '#A9F5A9' },
    { name: "Purple Squares", url: "https://www.transparenttextures.com/patterns/checkered-pattern.png", bgColor: '#BCA9F5' },
    { name: "Yellow Stripes", url: "https://www.transparenttextures.com/patterns/diagonal-striped-brick.png", bgColor: '#F5F6A9' },
    { name: "Orange Weave", url: "https://www.transparenttextures.com/patterns/clean-textile.png", bgColor: '#F5C8A9' },
    { name: "Pink Dots", url: "https://www.transparenttextures.com/patterns/dots.png", bgColor: '#F5A9D0' },
    { name: "Teal Geometric", url: "https://www.transparenttextures.com/patterns/cubes.png", bgColor: '#A9F5F2' },
    { name: "Mint Herringbone", url: "https://www.transparenttextures.com/patterns/diagmonds.png", bgColor: '#D4F5D8' },
    
    { name: "Coral Lattice", url: "https://www.transparenttextures.com/patterns/crosses.png", bgColor: '#F8C4B4' },
    { name: "Sky Waves", url: "https://www.transparenttextures.com/patterns/wave-grid.png", bgColor: '#B5D8F7' },
    { name: "Lavender Circles", url: "https://www.transparenttextures.com/patterns/circles.png", bgColor: '#E0D5F2' },
    { name: "Lime Zigzag", url: "https://www.transparenttextures.com/patterns/zig-zag.png", bgColor: '#DBFAA9' },
    { name: "Peach Basketweave", url: "https://www.transparenttextures.com/patterns/basket-weave.png", bgColor: '#FFE0B5' },
    { name: "Berry Grid", url: "https://www.transparenttextures.com/patterns/grid.png", bgColor: '#E5A9B5' },
    { name: "Aqua Hexagons", url: "https://www.transparenttextures.com/patterns/hexellence.png", bgColor: '#A0E4E0' },
    { name: "Lemon Houndstooth", url: "https://www.transparenttextures.com/patterns/houndstooth.png", bgColor: '#FFF8B5' },
    { name: "Blush Moroccan", url: "https://www.transparenttextures.com/patterns/moroccan-flower.png", bgColor: '#F7CAD0' },
    
    { name: "Indigo Denim", url: "https://www.transparenttextures.com/patterns/denim.png", bgColor: '#3D5A80' },
    { name: "Cherry Crosshatch", url: "https://www.transparenttextures.com/patterns/crosshatch.png", bgColor: '#E63946' },
    { name: "Sage Argyle", url: "https://www.transparenttextures.com/patterns/argyle.png", bgColor: '#84A98C' },
    { name: "Marigold Triangles", url: "https://www.transparenttextures.com/patterns/triangles.png", bgColor: '#FCBF49' },
    { name: "Ruby Stars", url: "https://www.transparenttextures.com/patterns/stardust.png", bgColor: '#D62828' },
    { name: "Turquoise Scale", url: "https://www.transparenttextures.com/patterns/scales.png", bgColor: '#2A9D8F' },
    { name: "Amethyst Trellis", url: "https://www.transparenttextures.com/patterns/dark-geometric.png", bgColor: '#6A4C93' },
    { name: "Sunflower Polka", url: "https://www.transparenttextures.com/patterns/large-leather.png", bgColor: '#F4D35E' },
    { name: "Cobalt Herringbone", url: "https://www.transparenttextures.com/patterns/herringbone.png", bgColor: '#1D3557' },
    
    { name: "Sienna Wicker", url: "https://www.transparenttextures.com/patterns/woven.png", bgColor: '#BC6C25' },
    { name: "Emerald Celtic", url: "https://www.transparenttextures.com/patterns/cream-dust.png", bgColor: '#2D6A4F' },
    { name: "Rust Checker", url: "https://www.transparenttextures.com/patterns/checkered-light-emboss.png", bgColor: '#A4462B' },
    { name: "Slate Diamond", url: "https://www.transparenttextures.com/patterns/diamond-eyes.png", bgColor: '#415A77' },
    { name: "Olive Weave", url: "https://www.transparenttextures.com/patterns/binding-light.png", bgColor: '#606C38' },
    { name: "Ochre Lattice", url: "https://www.transparenttextures.com/patterns/clean-gray-paper.png", bgColor: '#DDA15E' },
    { name: "Dusty Rose Damask", url: "https://www.transparenttextures.com/patterns/otis-redding.png", bgColor: '#BC8F8F' },
    { name: "Forest Plaid", url: "https://www.transparenttextures.com/patterns/plaid.png", bgColor: '#344E41' },
    { name: "Terracotta Ikat", url: "https://www.transparenttextures.com/patterns/classy-fabric.png", bgColor: '#C87547' },
    { name: "Powder Dot", url: "https://www.transparenttextures.com/patterns/white-diamond-dark.png", bgColor: '#9AB2CE' },
    
    { name: "Maroon Tartan", url: "https://www.transparenttextures.com/patterns/tartan.png", bgColor: '#800020' },
    { name: "Navy Pinstripe", url: "https://www.transparenttextures.com/patterns/pinstripe-light.png", bgColor: '#0A2463' },
    { name: "Crimson Quatrefoil", url: "https://www.transparenttextures.com/patterns/connected.png", bgColor: '#DC143C' },
    { name: "Violet Paisley", url: "https://www.transparenttextures.com/patterns/paisley.png", bgColor: '#7F00FF' },
    { name: "Scarlet Harlequin", url: "https://www.transparenttextures.com/patterns/green-dust-and-scratches.png", bgColor: '#FF2400' },
    { name: "Azure Basketweave", url: "https://www.transparenttextures.com/patterns/dark-brick-wall.png", bgColor: '#007FFF' },
    { name: "Gold Geometric", url: "https://www.transparenttextures.com/patterns/gplay.png", bgColor: '#FFD700' },
    { name: "Coral Fishscale", url: "https://www.transparenttextures.com/patterns/arches.png", bgColor: '#FF7F50' },
    { name: "Lilac Lattice", url: "https://www.transparenttextures.com/patterns/subtle-stripes.png", bgColor: '#C8A2C8' },
    
    { name: "Burgundy Brocade", url: "https://www.transparenttextures.com/patterns/skulls.png", bgColor: '#800020' },
    { name: "Jade Trellis", url: "https://www.transparenttextures.com/patterns/squared-metal.png", bgColor: '#00A86B' },
    { name: "Amber Chevron", url: "https://www.transparenttextures.com/patterns/asfalt-light.png", bgColor: '#FFBF00' },
    { name: "Teal Tribal", url: "https://www.transparenttextures.com/patterns/triangular.png", bgColor: '#008080' },
    { name: "Bronze Heraldic", url: "https://www.transparenttextures.com/patterns/binding-dark.png", bgColor: '#CD7F32' },
    { name: "Magenta Mosaic", url: "https://www.transparenttextures.com/patterns/ps-neutral.png", bgColor: '#FF00FF' },
    { name: "Cerulean Damask", url: "https://www.transparenttextures.com/patterns/dark-dotted-2.png", bgColor: '#007BA7' },
    { name: "Vermilion Arabesque", url: "https://www.transparenttextures.com/patterns/arabesque.png", bgColor: '#E34234' },
    { name: "Sapphire Deco", url: "https://www.transparenttextures.com/patterns/inspiration-geometry.png", bgColor: '#0F52BA' },
    
    { name: "Verdant Celtic", url: "https://www.transparenttextures.com/patterns/graphy-dark.png", bgColor: '#00703C' },
    { name: "Saffron Honeycomb", url: "https://www.transparenttextures.com/patterns/honey-im-subtle.png", bgColor: '#F4C430' },
    { name: "Plum Scrollwork", url: "https://www.transparenttextures.com/patterns/swirl.png", bgColor: '#8E4585' },
    { name: "Russet Kilim", url: "https://www.transparenttextures.com/patterns/ecailles.png", bgColor: '#80461B' },
    { name: "Cobalt Filigree", url: "https://www.transparenttextures.com/patterns/giftly.png", bgColor: '#0047AB' },
    { name: "Celadon Interlace", url: "https://www.transparenttextures.com/patterns/hexabump.png", bgColor: '#ACE1AF' },
    { name: "Brick Medallion", url: "https://www.transparenttextures.com/patterns/french-stucco.png", bgColor: '#B22222' },
    { name: "Alabaster Tracery", url: "https://www.transparenttextures.com/patterns/light-sketch.png", bgColor: '#F2F0E6' },
    { name: "Aubergine Fleur", url: "https://www.transparenttextures.com/patterns/subtle-freckles.png", bgColor: '#3D0C02' },
    { name: "Topaz Trellis", url: "https://www.transparenttextures.com/patterns/black-thread-light.png", bgColor: '#FFC87C' },
    { name: "Charcoal Labyrinth", url: "https://www.transparenttextures.com/patterns/maze.png", bgColor: '#36454F' },
    { name: "Garnet Octagon", url: "https://www.transparenttextures.com/patterns/cartographer.png", bgColor: '#733635' }
  ];
  
  const handleBackgroundSelect = (url: string, bgColor?: string) => {
    console.log("Selected background:", url);
    if (bgColor) {
      const combinedBackground = `url(${url}), ${bgColor}`;
      onBackgroundSelect(combinedBackground);
    } else {
      onBackgroundSelect(url);
    }
    setHasBackground(true);
  };

  const handleClearBackground = () => {
    onBackgroundSelect("");
    setHasBackground(false);
  };

  const getPatternBackgroundStyle = (url: string, bgColor: string = '#faf9f6') => {
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat',
      backgroundColor: bgColor,
      backgroundBlendMode: 'overlay',
    };
  };
  
  const renderPaperBackgrounds = () => {
    const chunks = [];
    const itemsPerChunk = 6;
    
    for (let i = 0; i < paperBackgrounds.length; i += itemsPerChunk) {
      const chunk = paperBackgrounds.slice(i, i + itemsPerChunk);
      const chunkIndex = Math.floor(i / itemsPerChunk) + 1;
      
      if (chunkIndex <= showMorePapers) {
        chunks.push(
          <div key={`paper-chunk-${chunkIndex}`} className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {chunk.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url, bg.bgColor)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url, bg.bgColor)}
                  />
                </button>
              ))}
            </div>
            
            {chunkIndex < Math.ceil(paperBackgrounds.length / itemsPerChunk) && chunkIndex === showMorePapers && (
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={() => setShowMorePapers(prev => prev + 1)}
                className="w-full text-xs flex items-center justify-center"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More Paper Textures
              </Button>
            )}
            
            {chunkIndex > 1 && chunkIndex === showMorePapers && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMorePapers(1)}
                className="w-full text-xs mt-1 flex items-center justify-center"
              >
                <X className="mr-1 h-3 w-3" /> Close
              </Button>
            )}
          </div>
        );
      }
    }
    
    return chunks;
  };
  
  const renderPatternBackgrounds = () => {
    const chunks = [];
    const itemsPerChunk = 6;
    
    for (let i = 0; i < patternBackgrounds.length; i += itemsPerChunk) {
      const chunk = patternBackgrounds.slice(i, i + itemsPerChunk);
      const chunkIndex = Math.floor(i / itemsPerChunk) + 1;
      
      if (chunkIndex <= showMorePatterns) {
        chunks.push(
          <div key={`pattern-chunk-${chunkIndex}`} className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {chunk.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url, bg.bgColor)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={getPatternBackgroundStyle(bg.url, bg.bgColor)}
                  />
                </button>
              ))}
            </div>
            
            {chunkIndex < Math.ceil(patternBackgrounds.length / itemsPerChunk) && chunkIndex === showMorePatterns && (
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={() => setShowMorePatterns(prev => prev + 1)}
                className="w-full text-xs flex items-center justify-center"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More Patterns
              </Button>
            )}
            
            {chunkIndex > 1 && chunkIndex === showMorePatterns && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMorePatterns(1)}
                className="w-full text-xs mt-1 flex items-center justify-center"
              >
                <X className="mr-1 h-3 w-3" /> Close
              </Button>
            )}
          </div>
        );
      }
    }
    
    return chunks;
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold tracking-tight">Background Images & Patterns</h3>
        {hasBackground && (
          <Button 
            variant="outline"
            size="sm"
            onClick={handleClearBackground}
            className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
            title="Remove Background"
          >
            <ImageOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Remove Background</span>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="papers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-2">
          <TabsTrigger value="papers" className="text-[10px]">Papers</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="patterns" className="text-[10px]">Patterns</TabsTrigger>
          <TabsTrigger value="gradients" className="text-[10px]">Gradients</TabsTrigger>
          <TabsTrigger value="upload" className="text-[10px]">Upload</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[260px]">
          <TabsContent value="papers" className="mt-0 space-y-4">
            {renderPaperBackgrounds()}
          </TabsContent>
          
          <TabsContent value="nature" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {natureBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full"
                    style={{ 
                      backgroundImage: `url(${bg.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </button>
              ))}
            </div>
            
            {!showMoreNature && additionalNatureBackgrounds.length > 0 && (
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={() => setShowMoreNature(true)}
                className="w-full text-xs flex items-center justify-center"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More Nature Images
              </Button>
            )}
            
            {showMoreNature && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMoreNature(false)}
                className="w-full text-xs mt-1 flex items-center justify-center"
              >
                <X className="mr-1 h-3 w-3" /> Close
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-0 space-y-4">
            {renderPatternBackgrounds()}
          </TabsContent>
          
          <TabsContent value="gradients" className="mt-0 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {gradientBackgrounds.map((bg, index) => (
                <button
                  key={index}
                  className="bg-white rounded overflow-hidden border border-gray-200 hover:border-primary/50 h-20"
                  onClick={() => handleBackgroundSelect(bg.url)}
                  type="button"
                  title={bg.name}
                >
                  <div 
                    className="w-full h-full rounded" 
                    style={{ background: bg.url }}
                  />
                </button>
              ))}
            </div>
            
            {!showMoreGradients && additionalGradientBackgrounds.length > 0 && (
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={() => setShowMoreGradients(true)}
                className="w-full text-xs flex items-center justify-center"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More Gradients
              </Button>
            )}
            
            {showMoreGradients && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMoreGradients(false)}
                className="w-full text-xs mt-1 flex items-center justify-center"
              >
                <X className="mr-1 h-3 w-3" /> Close
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="mt-0 space-y-4">
            <ImageUploader 
              onImageSelect={handleBackgroundSelect} 
            />
          </TabsContent>
        </ScrollArea>
        
        <Separator className="my-2" />
      </Tabs>
    </div>
  );
}
