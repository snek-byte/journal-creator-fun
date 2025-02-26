import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/store/journalStore";
import { CalendarDays, BookOpen, Award, Star } from "lucide-react";
import { JournalEditor } from "@/components/JournalEditor";
import { format } from "date-fns";
import { moodOptions } from "@/constants/moods";
import { Link } from "react-router-dom";

export default function Index() {
  const { entries, progress, badges, dailyChallenge } = useJournalStore();

  const recentEntries = entries.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Journal Dashboard</h1>
            <p className="text-gray-600">Track your progress and write daily entries</p>
          </div>
          <Link to="/premium">
            <Button variant="outline" className="gap-2">
              <Star className="w-4 h-4" />
              Premium Content
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold">{progress.totalXp}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-full">
                <CalendarDays className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold">{progress.currentStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">{progress.totalEntries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-full">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <p className="text-2xl font-bold">{progress.earnedBadges.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border ${
                  progress.earnedBadges.includes(badge.id)
                    ? "bg-white"
                    : "bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(entry.date), "MMMM d, yyyy")}
                    </p>
                    {entry.mood && (
                      <div className="text-lg">
                        {entry.mood && moodOptions.find(m => m.value === entry.mood)?.icon}
                      </div>
                    )}
                  </div>
                  {entry.challengeId && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      Challenge Completed
                    </span>
                  )}
                </div>
                <p className="line-clamp-3">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journal Editor */}
        <JournalEditor />
      </div>
    </div>
  );
}
