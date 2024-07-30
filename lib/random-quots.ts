const relaxingQuotes: string[] = [
  "Remember to take breaks throughout the day and recharge your energy.",
  "Take a deep breath and let go of any tension in your body.",
  "Focus on the present moment and let go of worries about the future.",
  "Find a quiet space to relax and clear your mind.",
  "Take a walk outside and enjoy the beauty of nature.",
  "Practice gratitude for the little things in life that bring you joy.",
  "Listen to soothing music to help calm your mind.",
  "Engage in activities that bring you joy and fulfillment outside of work.",
  "Remember that it's okay to ask for help when you need it.",
  "Take time to appreciate your accomplishments and celebrate your progress.",
];

export const getRandomRelaxingQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * relaxingQuotes.length);
  return relaxingQuotes[randomIndex];
};
