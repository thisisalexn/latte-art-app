import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Attempt = {
  id: string;
  imageUri: string;
  date: string;
  rating: number;
  feedback: string;
  pattern: string;
  patternComplexity: number;
  executionScore: number;
  technicalDetails: {
    milkTexture: string;
    pouringTechnique: string;
    patternDefinition: string;
  };
};

type HistoryContextType = {
  history: Attempt[];
  addAttempt: (attempt: Attempt) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}

const STORAGE_KEY = '@latte_art_history';

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from storage on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        } else {
          // Only set example data if no stored history exists
          setHistory(EXAMPLE_ATTEMPTS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLE_ATTEMPTS));
        }
      } catch (error: unknown) {
        console.error('Error loading history:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        .catch(error => console.error('Error saving history:', error));
    }
  }, [history, isInitialized]);

  const addAttempt = (attempt: Attempt) => {
    setHistory((prev) => [attempt, ...prev]);
  };

  return (
    <HistoryContext.Provider value={{ history, addAttempt }}>
      {children}
    </HistoryContext.Provider>
  );
}

const EXAMPLE_ATTEMPTS: Attempt[] = [
  {
    id: '1',
    imageUri: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
    date: '2024-06-01',
    rating: 4.2,
    feedback: 'Good symmetry, but could improve milk texture',
    pattern: 'Heart',
    patternComplexity: 2,
    executionScore: 4,
    technicalDetails: {
      milkTexture: "Slightly too foamy",
      pouringTechnique: "Good angle, but inconsistent speed",
      patternDefinition: "Clear heart shape with minor asymmetry"
    }
  },
  {
    id: '2',
    imageUri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    date: '2024-06-02',
    rating: 3.8,
    feedback: 'Nice attempt at a rosetta, work on contrast',
    pattern: 'Rosetta',
    patternComplexity: 4,
    executionScore: 3,
    technicalDetails: {
      milkTexture: "Good microfoam consistency",
      pouringTechnique: "Needs more controlled wiggling",
      patternDefinition: "Basic rosetta structure visible"
    }
  },
  {
    id: '3',
    imageUri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    date: '2024-06-03',
    rating: 4.5,
    feedback: 'Excellent tulip! Perfect milk texture',
    pattern: 'Tulip',
    patternComplexity: 3,
    executionScore: 5,
    technicalDetails: {
      milkTexture: "Perfect microfoam",
      pouringTechnique: "Excellent control and timing",
      patternDefinition: "Clear, well-defined layers"
    }
  },
]; 