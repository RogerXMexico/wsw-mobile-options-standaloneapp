// Data exports for Wall Street Wildlife Mobile
export * from './types';
export * from './constants';
export {
  EVENT_HORIZONS_LESSONS,
  EVENT_HORIZONS_CASE_STUDIES,
  EVENT_HORIZONS_QUIZ_QUESTIONS,
  type EventHorizonsLesson,
  type CaseStudy,
} from './eventHorizonsLessons';

// Curated Case Studies (detailed historical events)
export {
  CURATED_CASE_STUDIES,
  getCaseStudyById,
  getCaseStudiesByEventType,
  getCaseStudiesForLesson,
  getCaseStudiesByDifficulty,
  getCaseStudiesByTicker,
  getAllCaseStudyTickers,
  getCaseStudyStats,
  type CuratedCaseStudy,
  type TimelineEntry,
  type CaseStudyOutcome,
  type EventType,
} from './curatedCaseStudies';

// Event Horizons Quizzes
export {
  EVENT_HORIZONS_QUIZZES,
  getQuizByLessonId,
  calculateQuizScore,
  getQuestionsByDifficulty,
  getQuestionsByMentor,
  type QuizQuestion,
  type QuizOption,
  type LessonQuiz,
} from './eventHorizonsQuizzes';

// Event Horizons Badges & Missions
export {
  EVENT_HORIZONS_BADGES,
  EVENT_HORIZONS_MISSIONS,
  EVENT_HORIZONS_XP_REWARDS,
  BADGE_RARITY_COLORS,
  getEventHorizonsBadgeById,
  getEventHorizonsBadgesByCategory,
  getEventHorizonsBadgesByRarity,
  getTodaysMissions,
  calculateMissionProgress,
  getTotalXPFromBadges,
  type EventHorizonsMission,
} from './eventHorizonsBadges';
