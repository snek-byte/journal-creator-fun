
export interface JournalChallenge {
  id: string;
  prompt: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'creativity' | 'mindfulness';
  difficulty: 'easy' | 'medium' | 'hard';
}

const challenges: JournalChallenge[] = [
  {
    id: 'reflection-1',
    prompt: 'Write about a moment that changed your perspective on something important.',
    category: 'reflection',
    difficulty: 'medium'
  },
  {
    id: 'gratitude-1',
    prompt: "List three things you're grateful for today and explain why.",
    category: 'gratitude',
    difficulty: 'easy'
  },
  {
    id: 'goals-1',
    prompt: 'What is one goal you want to achieve this month and what steps will you take?',
    category: 'goals',
    difficulty: 'medium'
  },
  {
    id: 'creativity-1',
    prompt: 'Imagine your ideal day five years from now. Describe it in detail.',
    category: 'creativity',
    difficulty: 'medium'
  },
  {
    id: 'mindfulness-1',
    prompt: 'Take a moment to describe your current emotions without judgment.',
    category: 'mindfulness',
    difficulty: 'easy'
  },
  {
    id: 'reflection-2',
    prompt: "Think about a challenge you've recently faced. What did you learn from it?",
    category: 'reflection',
    difficulty: 'medium'
  },
  {
    id: 'gratitude-2',
    prompt: 'Write a thank you letter to someone who has positively impacted your life.',
    category: 'gratitude',
    difficulty: 'hard'
  },
  {
    id: 'goals-2',
    prompt: "What is a habit you'd like to build or break? Why is this important to you?",
    category: 'goals',
    difficulty: 'medium'
  },
  {
    id: 'creativity-2',
    prompt: 'Write a short story inspired by the last dream you remember having.',
    category: 'creativity',
    difficulty: 'hard'
  },
  {
    id: 'mindfulness-2',
    prompt: 'Describe your surroundings right now using all five senses.',
    category: 'mindfulness',
    difficulty: 'easy'
  }
];

export function generateDailyChallenge(): JournalChallenge {
  // Create a deterministic "random" selection based on the current date
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const dateHash = hashCode(dateString);
  
  // Use the hash to select a challenge
  const index = Math.abs(dateHash % challenges.length);
  return challenges[index];
}

// Simple string hash function
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
