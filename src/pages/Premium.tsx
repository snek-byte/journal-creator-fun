
import { useJournalStore } from "@/store/journalStore";
import { Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const premiumContent = [
  {
    id: 'templates',
    title: 'Journal Templates',
    description: 'Access our curated collection of journal templates for different purposes.',
    xpRequired: 100,
    content: "Premium journal templates to help structure your thoughts...",
    icon: "📝"
  },
  {
    id: 'prompts',
    title: 'Advanced Writing Prompts',
    description: 'Get access to our advanced collection of writing prompts.',
    xpRequired: 200,
    content: "Unlock deeper self-reflection with our premium prompts...",
    icon: "✨"
  },
  {
    id: 'themes',
    title: 'Premium Themes',
    description: 'Unlock beautiful premium themes and gradients for your journal.',
    xpRequired: 300,
    content: "Exclusive themes and gradients for your journal entries...",
    icon: "🎨"
  },
  {
    id: 'analytics',
    title: 'Mood Analytics',
    description: 'Get detailed insights into your mood patterns and journaling habits.',
    xpRequired: 500,
    content: "Advanced analytics and mood tracking features...",
    icon: "📊"
  }
];

export default function Premium() {
  const { progress } = useJournalStore();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Premium Content</h1>
          <p className="text-gray-600">
            Unlock premium features by earning XP through regular journaling
          </p>
          <div className="mt-2">
            <Badge variant="secondary" className="text-lg">
              Your XP: {progress.totalXp}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumContent.map((item) => {
            const isUnlocked = progress.totalXp >= item.xpRequired;

            return (
              <Card key={item.id} className="relative overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                    </div>
                    {isUnlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {item.xpRequired} XP required
                    </Badge>
                    <Button
                      variant={isUnlocked ? "default" : "secondary"}
                      disabled={!isUnlocked}
                    >
                      {isUnlocked ? "Access Content" : "Locked"}
                    </Button>
                  </div>
                </div>
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-700 font-medium">
                        Earn {item.xpRequired - progress.totalXp} more XP to unlock
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
