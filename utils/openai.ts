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

    // Parse the analysis response
    const lines = analysis?.split('\n') || [];
    const isCoffee = lines.some(line => line.includes('Is it a valid coffee image? Yes'));
    const isLatteArt = lines.some(line => line.includes('Is it latte art? Yes'));
    
    if (!isCoffee) {
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
        },
        improvementTips: []
      };
    }

    if (!isLatteArt) {
      return {
        rating: 0,
        feedback: "No latte art detected in the image.",
        isLatteArt: false,
        pattern: 'No Art',
        confidence: 0,
        patternComplexity: 0,
        executionScore: 0,
        technicalDetails: {
          milkTexture: "N/A",
          pouringTechnique: "N/A",
          patternDefinition: "N/A"
        },
        improvementTips: []
      };
    }

    // Extract pattern
    const patternLine = lines.find(line => line.includes('Final classification:'));
    const pattern = patternLine?.split(':')[1]?.trim() as 'Tulip' | 'Rosetta' | 'Heart' | 'Swan' | 'Uncertain' | 'No Art';

    // Extract confidence
    const confidenceLine = lines.find(line => line.includes('Confidence score:'));
    const confidence = parseInt(confidenceLine?.split(':')[1]?.trim() || '0');

    // Extract technical details
    const milkTextureLine = lines.find(line => line.includes('Milk texture:'));
    const pouringTechniqueLine = lines.find(line => line.includes('Pouring technique:'));
    const patternDefinitionLine = lines.find(line => line.includes('Pattern definition:'));

    // Extract improvement tips
    const tipsStartIndex = lines.findIndex(line => line.includes('Specific Improvement Tips:'));
    const tipsEndIndex = lines.findIndex((line, index) => index > tipsStartIndex && line.includes(':'));
    const improvementTips = lines
      .slice(tipsStartIndex + 1, tipsEndIndex > tipsStartIndex ? tipsEndIndex : undefined)
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(1).trim());

    // Calculate scores based on analysis
    const patternComplexity = pattern === 'Swan' ? 5 : 
                             pattern === 'Tulip' ? 4 : 
                             pattern === 'Rosetta' ? 3 : 
                             pattern === 'Heart' ? 2 : 1;

    const executionScore = Math.min(5, Math.max(1, Math.floor(confidence / 20)));

    return {
      rating: executionScore,
      feedback: lines.find(line => line.includes('Summary:'))?.split(':')[1]?.trim() || 'No feedback available',
      isLatteArt: true,
      pattern,
      confidence,
      patternComplexity,
      executionScore,
      technicalDetails: {
        milkTexture: milkTextureLine?.split(':')[1]?.trim() || 'Not analyzed',
        pouringTechnique: pouringTechniqueLine?.split(':')[1]?.trim() || 'Not analyzed',
        patternDefinition: patternDefinitionLine?.split(':')[1]?.trim() || 'Not analyzed'
      },
      improvementTips
    };
  } catch (error) {
    console.error('Error analyzing latte art:', error);
    throw new Error('Failed to analyze latte art');
  }
}