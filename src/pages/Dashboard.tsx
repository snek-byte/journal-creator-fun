
import { useJournalStore } from "@/store/journalStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarDays, Trophy, Star, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { entries, progress, badges } = useJournalStore();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Journal Dashboard</h1>
        <Button asChild>
          <Link to="/write">Write New Entry</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center">
          <CalendarDays className="w-8 h-8 mb-2 text-primary" />
          <h3 className="font-semibold">Current Streak</h3>
          <p className="text-2xl font-bold">{progress.currentStreak} days</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 mb-2 text-primary" />
          <h3 className="font-semibold">Total XP</h3>
          <p className="text-2xl font-bold">{progress.totalXp} XP</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <Star className="w-8 h-8 mb-2 text-primary" />
          <h3 className="font-semibold">Badges Earned</h3>
          <p className="text-2xl font-bold">{progress.earnedBadges.length}</p>
        </Card>

        <Card className="p-4 flex flex-col items-center">
          <BookOpen className="w-8 h-8 mb-2 text-primary" />
          <h3 className="font-semibold">Total Entries</h3>
          <p className="text-2xl font-bold">{entries.length}</p>
        </Card>
      </div>

      {/* Badges Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  {progress.earnedBadges.includes(badge.id) ? (
                    <Badge variant="default">Earned!</Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Entries */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Entries</h2>
        <div className="space-y-4">
          {entries.slice(0, 5).map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  {entry.mood && (
                    <Badge variant="outline">
                      Mood: {entry.mood.name}
                    </Badge>
                  )}
                </div>
                <p className="line-clamp-2">{entry.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
