import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface LatteArtAnalysis {
  rating: number;
  feedback: string;
  isLatteArt: boolean;
  pattern?: 'Tulip' | 'Rosetta' | 'Heart' | 'Swan' | 'Uncertain' | 'No Art';
  confidence: number;
  improvementTips?: string[];
  patternComplexity: number; // 1-5
  executionScore: number; // 1-5
  technicalDetails: {
    milkTexture: string;
    pouringTechnique: string;
    patternDefinition: string;
  };
}

export async function analyzeLatteArt(imageBase64: string): Promise<LatteArtAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
You are a professional barista and latte art expert with over 10 years of experience. Analyze the provided image and respond strictly following the structure below. Your answer MUST include exactly these sections and lines, without any additional text:

1. Image Verification:
- Is it a valid coffee image? (Yes/No)
- If "No", briefly explain. If "Yes", proceed.

2. Latte Art Check:
- Is it latte art? (Yes/No)

3. Visual Feature Extraction:
- Describe key visual characteristics: patterns, contrast, symmetry, definition, imperfections.

4. Strict Classification:
- Final classification: (Tulip, Rosetta, Heart, Swan, Uncertain, No Art)

5. Confidence Scoring:
- Confidence score: (0-100%)

6. Specific Improvement Tips:
- (Only if latte art) List tips for improvement.

7. Technical Details:
- Milk texture: (description)
- Pouring technique: (description)
- Pattern definition: (description)

8. Summary:
- Brief overall impression.

IMPORTANT: Your response must follow this structure precisely and must include "Is it a valid coffee image? Yes" and "Is it latte art? Yes" if applicable. Do not add extra text.
`
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
      max_tokens: 800
    });

    const analysis = response.choices[0].message.content;

    // Check if the image is a valid coffee image
    if (!analysis?.includes('Is it a valid coffee image? Yes')) {
      return {
        rating: 0,
        feedback: "This image does not appear to be a top-down view of coffee.",
        isLatteArt: false,
        pattern: 'No Art',
        confidence: 0,
        patternComplexity: 0,
        executionScore: 0,
        technicalDetails: {
          milkTexture: "N/A",
          pouringTechnique: "N/A",
          patternDefinition: "N/A"
        }
      };
    }

    // Check if the image is latte art
    if (!analysis?.includes('Is it latte art? Yes')) {
      return {
        rating: 0,
        feedback: "This image does not appear to be latte art.",
        isLatteArt: false,
        pattern: 'No Art',
        confidence: 0,
        patternComplexity: 0,
        executionScore: 0,
        technicalDetails: {
          milkTexture: "N/A",
          pouringTechnique: "N/A",
          patternDefinition: "N/A"
        }
      };
    }

    // Extract pattern
    const patternMatch = analysis?.match(/Final classification:\s*(.*)/i);
    const pattern = patternMatch ? patternMatch[1].trim() as 'Tulip' | 'Rosetta' | 'Heart' | 'Swan' | 'Uncertain' | 'No Art' : 'Uncertain';

    // Extract confidence
    const confidenceMatch = analysis?.match(/Confidence score:\s*(\d+)%/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 0;

    // Extract improvement tips
    const tipsMatch = analysis?.match(/Specific Improvement Tips:([\s\S]*?)Technical Details:/i);
    const improvementTips = tipsMatch
      ? tipsMatch[1]
          .split('\n')
          .map(tip => tip.trim())
          .filter(tip => tip.length > 0)
      : [];

    // Extract technical details
    const milkTextureMatch = analysis?.match(/Milk texture:\s*(.*)/i);
    const pouringTechniqueMatch = analysis?.match(/Pouring technique:\s*(.*)/i);
    const patternDefinitionMatch = analysis?.match(/Pattern definition:\s*(.*)/i);

    // Calculate pattern complexity (1-5)
    const patternComplexity = pattern === 'Swan' ? 5
                            : pattern === 'Rosetta' ? 4
                            : pattern === 'Tulip' ? 3
                            : pattern === 'Heart' ? 2
                            : 1; // No Art or Uncertain

    // Calculate execution score (1-5) based on confidence
    const executionScore = Math.max(1, Math.ceil(confidence / 20));

    // Final rating (simple weighted average)
    const rating = Math.ceil((confidence * 0.3 + patternComplexity * 0.3 + executionScore * 0.4) / 20);

    return {
      rating,
      feedback: analysis || '',
      isLatteArt: true,
      pattern,
      confidence,
      improvementTips,
      patternComplexity,
      executionScore,
      technicalDetails: {
        milkTexture: milkTextureMatch ? milkTextureMatch[1].trim() : "Not specified",
        pouringTechnique: pouringTechniqueMatch ? pouringTechniqueMatch[1].trim() : "Not specified",
        patternDefinition: patternDefinitionMatch ? patternDefinitionMatch[1].trim() : "Not specified"
      }
    };
  } catch (error) {
    console.error('Error analyzing latte art:', error);
    throw new Error('Failed to analyze latte art');
  }
}