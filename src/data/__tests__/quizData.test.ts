// Tests for quiz data integrity
// Verifies structure and correctness of quiz questions across tiers

import { QUIZ_DATA, getQuizByTier } from '../quizData';
import type { QuizQuestion, QuizTier } from '../quizData';

describe('Quiz Data', () => {
  describe('QUIZ_DATA collection', () => {
    it('contains quiz data for multiple tiers', () => {
      expect(QUIZ_DATA.length).toBeGreaterThanOrEqual(5);
    });

    it('includes tier 0 (Foundations)', () => {
      const tier0 = getQuizByTier(0);
      expect(tier0).toBeDefined();
      expect(tier0!.tierName).toBe('Foundations');
    });

    it('includes tier 5 (Volatility Plays)', () => {
      const tier5 = getQuizByTier(5);
      expect(tier5).toBeDefined();
      expect(tier5!.tierName).toBe('Volatility Plays');
    });

    it('includes tier 10 (Let\'s Play)', () => {
      const tier10 = getQuizByTier(10);
      expect(tier10).toBeDefined();
    });

    it('each tier has a passing score between 0 and 100', () => {
      QUIZ_DATA.forEach((tier: QuizTier) => {
        expect(tier.passingScore).toBeGreaterThan(0);
        expect(tier.passingScore).toBeLessThanOrEqual(100);
      });
    });

    it('each tier has at least one question', () => {
      QUIZ_DATA.forEach((tier: QuizTier) => {
        expect(tier.questions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('question structure', () => {
    // Flatten all questions for per-question validation
    const allQuestions: QuizQuestion[] = QUIZ_DATA.flatMap((tier) => tier.questions);

    it('all questions have a non-empty question text', () => {
      allQuestions.forEach((q) => {
        expect(typeof q.question).toBe('string');
        expect(q.question.length).toBeGreaterThan(0);
      });
    });

    it('all questions have at least 2 options', () => {
      allQuestions.forEach((q) => {
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('all questions have a correctAnswer that is a valid index', () => {
      allQuestions.forEach((q) => {
        expect(typeof q.correctAnswer).toBe('number');
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(q.options.length);
      });
    });

    it('all questions have a unique id', () => {
      const ids = allQuestions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all questions have a non-empty explanation', () => {
      allQuestions.forEach((q) => {
        expect(typeof q.explanation).toBe('string');
        expect(q.explanation.length).toBeGreaterThan(0);
      });
    });

    it('all questions have a valid difficulty level', () => {
      const validDifficulties = ['easy', 'medium', 'hard'];
      allQuestions.forEach((q) => {
        expect(validDifficulties).toContain(q.difficulty);
      });
    });
  });

  describe('getQuizByTier helper', () => {
    it('returns the correct tier quiz', () => {
      const quiz = getQuizByTier(0);
      expect(quiz).toBeDefined();
      expect(quiz!.tierId).toBe(0);
    });

    it('returns undefined for a non-existent tier', () => {
      const quiz = getQuizByTier(999);
      expect(quiz).toBeUndefined();
    });
  });
});
