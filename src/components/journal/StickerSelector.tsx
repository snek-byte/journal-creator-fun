
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StickerSelectorProps {
  onStickerSelect: (stickerUrl: string) => void;
}

export function StickerSelector({ onStickerSelect }: StickerSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');

  // Real stickers organized by category
  const stickerCategories = {
    basic: [
      '/stickers/star.svg',
      '/stickers/heart.svg',
      '/stickers/happy.svg',
      '/stickers/sad.svg',
      '/stickers/thumbsup.svg',
      '/stickers/cake.svg',
      '/stickers/gift.svg',
      '/stickers/camera.svg',
    ],
    decorative: [
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F33A-rose.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F33B-sunflower.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F33C-blossom.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F337-tulip.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F338-cherryBlossom.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F339-rosette.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F390-windChime.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F380-ribbon.svg',
    ],
    journaling: [
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4DD-memo.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4C3-scrolledPage.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4C4-page.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4D6-openBook.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4DA-books.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4D3-notebook.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4D5-closedBook.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F4D8-blueBook.svg',
    ],
    nature: [
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F332-evergreen.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F333-deciduous.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F334-palmTree.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F335-cactus.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F30A-wave.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F304-sunrise.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F305-sunrise2.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/nature/u1F307-sunset.svg',
    ],
    washi: [
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F389-partyPopper.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F38F-flagInHole.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F387-sparkler.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F388-balloon.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F381-present.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F38B-tanabataTree.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F38D-pineTrees.svg',
      'https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee47d8ad36f5209e38a1c5e4b76aed8/svgs/objects/u1F38E-japaneseDolls.svg',
    ],
  };

  const handleStickerSelect = (stickerUrl: string) => {
    console.log("Sticker selected:", stickerUrl);
    onStickerSelect(stickerUrl);
  };

  const filteredStickers = (stickers: string[]) => {
    if (!searchQuery) return stickers;
    return stickers.filter(sticker => 
      sticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold tracking-tight">Add Stickers</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stickers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="basic" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="basic" className="text-[10px]">Basic</TabsTrigger>
          <TabsTrigger value="decorative" className="text-[10px]">Decor</TabsTrigger>
          <TabsTrigger value="journaling" className="text-[10px]">Journal</TabsTrigger>
          <TabsTrigger value="nature" className="text-[10px]">Nature</TabsTrigger>
          <TabsTrigger value="washi" className="text-[10px]">Washi</TabsTrigger>
        </TabsList>
        
        {Object.entries(stickerCategories).map(([category, stickers]) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[200px] mt-2">
              <div className="grid grid-cols-4 gap-2">
                {filteredStickers(stickers).map((sticker, index) => (
                  <button
                    key={index}
                    className="p-1 rounded hover:bg-accent transition-colors flex items-center justify-center h-12 w-12"
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`Sticker ${index + 1}`}
                      className="h-10 w-10 object-contain" 
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
