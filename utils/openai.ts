import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface LatteArtAnalysis {
  rating: number;
  feedback: string;
}

export async function analyzeLatteArt(imageBase64: string): Promise<LatteArtAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional barista and latte art expert. Analyze the provided latte art image and give detailed feedback. Rate the latte art on a scale of 1-5, where 5 is perfect. Provide specific feedback about the design, symmetry, contrast, and milk texture. Also suggest specific improvements."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this latte art and provide a rating and detailed feedback."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysis = response.choices[0].message.content;
    
    // Parse the response to extract rating and feedback
    // This is a simple implementation - you might want to make it more robust
    const ratingMatch = analysis?.match(/rating:?\s*(\d+(?:\.\d+)?)/i);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
    
    // Remove the rating from the feedback text
    const feedback = analysis?.replace(/rating:?\s*\d+(?:\.\d+)?/i, '').trim() || '';

    return {
      rating: Math.min(Math.max(rating, 1), 5), // Ensure rating is between 1 and 5
      feedback
    };
  } catch (error) {
    console.error('Error analyzing latte art:', error);
    throw new Error('Failed to analyze latte art');
  }
} 