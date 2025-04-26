import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface LatteArtAnalysis {
  rating: number;
  feedback: string;
  isLatteArt: boolean;
  pattern?: 'Tulip' | 'Rosetta' | 'Heart' | 'Uncertain' | 'No Art';
  confidence: number;
  improvementTips?: string[];
}

export async function analyzeLatteArt(imageBase64: string): Promise<LatteArtAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional barista and latte art expert. Analyze the image following this exact structure:

1. Visual Feature Extraction:
- Describe key visual characteristics (patterns, shapes, layers, edges)

2. Strict Classification:
- Classify into exactly one of these categories:
  - Tulip
  - Rosetta
  - Heart
  - No Art (if no clear latte art is visible)
- If uncertain between two categories, respond "Uncertain"

3. Confidence Scoring:
- Assign confidence score (0-100%)
- If confidence < 60%, explain uncertainty

4. Summary:
- Is it latte art? (Yes/No)
- Final classification
- Confidence score
- Brief improvement tips

5. Specific Improvement Tips (only if it is latte art):
- Focus on exact improvements needed
- Mention specific techniques (milk jug angle, pouring height, wiggling tempo)
- Address microfoam texture
- Suggest specific drills for control and precision

Respond in this exact format, nothing else.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this image following the exact structure provided."
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
    
    // Check if the image is not latte art
    if (!analysis?.includes('Is it latte art? Yes')) {
      return {
        rating: 0,
        feedback: "This image does not appear to be latte art.",
        isLatteArt: false,
        pattern: 'No Art',
        confidence: 0
      };
    }
    
    // Extract pattern
    const patternMatch = analysis?.match(/Final classification:\s*([^\n]+)/i);
    const pattern = patternMatch ? patternMatch[1].trim() as 'Tulip' | 'Rosetta' | 'Heart' | 'Uncertain' | 'No Art' : 'Uncertain';
    
    // Extract confidence
    const confidenceMatch = analysis?.match(/Confidence score:\s*(\d+)%/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 0;
    
    // Extract improvement tips
    const tipsMatch = analysis?.match(/Specific Improvement Tips:([\s\S]*?)(?=\n\n|$)/i);
    const improvementTips = tipsMatch ? tipsMatch[1].split('\n').filter(tip => tip.trim()) : [];
    
    // Calculate rating based on confidence
    const rating = Math.ceil(confidence / 20); // Convert 0-100% to 1-5 scale

    return {
      rating,
      feedback: analysis || '',
      isLatteArt: true,
      pattern,
      confidence,
      improvementTips
    };
  } catch (error) {
    console.error('Error analyzing latte art:', error);
    throw new Error('Failed to analyze latte art');
  }
} 