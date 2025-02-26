
export const generatePrompt = async (mood: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch('https://api.thewriter.ly/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `Generate a thoughtful journal prompt for someone feeling ${mood}. The prompt should help them process and reflect on their emotions.`,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate prompt');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating prompt:', error);
    return getDefaultPrompt(mood);
  }
};

// Fallback prompts in case the API fails
const getDefaultPrompt = (mood: string): string => {
  const prompts = {
    happy: "What moments contributed to your happiness today? How can you create more of these positive experiences?",
    sad: "Write about what's weighing on your heart today. What would make you feel even a little bit better?",
    stressed: "List your current stressors and brainstorm one small step you could take to address each one.",
    calm: "Describe the elements in your environment or routine that help you maintain this sense of peace.",
    neutral: "Reflect on your current state of mind. What would make today more meaningful for you?"
  };
  return prompts[mood as keyof typeof prompts] || prompts.neutral;
};
