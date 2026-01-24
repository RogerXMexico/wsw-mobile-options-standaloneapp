# Wall Street Wildlife Options University - Mobile App PRD

**PRD Location:** `/Users/krzysztof/Desktop/wsw-options-mobile/PRD.md`

---

## Executive Summary

Convert the existing Wall Street Wildlife Options University web application into a dedicated React Native mobile app (iOS/Android). The web app at `wswoptionsuniversity.netlify.app` already contains 44+ options strategies, interactive tools, gamification, and a comprehensive curriculum that will serve as the foundation for the mobile experience.

---

## Existing Web App Features (Source of Truth)

**Location:** `/Users/krzysztof/Desktop/Options University/wsw-options-course-aesthetics`

### Current Feature Set to Port

| Category | Components | Priority |
|----------|------------|----------|
| **Core Education** | Dashboard, StrategyDetail, 44+ strategies | P0 |
| **Interactive Tools** | PayoffChart, GreeksVisualizer, OptionsSurface3D | P0 |
| **Calculators** | PositionSizing, POP, ExpectedMove, IVCrush | P1 |
| **Market Data** | IVRankTool, OptionsScreener, OptionsChainViewer, Watchlist | P1 |
| **Practice** | PaperTradingSimulator, StrategyBuilder | P0 |
| **Learning** | OptionsVocabulary, OptionChainTutorial, FirstTradeTutorial, AssignmentExercise, BeginnerMistakes, RollingAdjusting | P1 |
| **Gamification** | JungleTradingAcademy, Leaderboard, BadgeShowcase, DailyMissions, JungleTribes, SocialTradingFeed | P1 |
| **Quizzes** | QuizModal, QuizQuestion, QuizResults, quizData.ts | P0 |
| **Auth & Payments** | AuthModal, UserMenu, PremiumGuard, UpgradeModal | P0 |

### Animal Mascot System (Already Defined)
- **Owl** - Wisdom/Fundamentals instructor
- **Bull** - Bullish strategies guide
- **Bear** - Bearish strategies guide
- **Fox** - Advanced tactics mentor
- **Eagle** - Portfolio overview perspective
- **Badger** - Moderate risk mentor
- **Monkey** - Higher risk/swing trading
- **Sloth** - Conservative strategies
- **Tiger** - Aggressive strategies

---

## Mobile App Architecture

### Tech Stack

```
Frontend:
├── React Native 0.73+
├── TypeScript
├── React Navigation 6
├── Redux Toolkit (state management)
├── React Native Reanimated (animations)
├── Victory Native (charts - replaces Recharts)
├── react-native-three (3D - replaces Three.js)
├── react-native-video (video playback)
└── Lottie (animal mascot animations)

Backend (Reuse existing):
├── Supabase (auth, database)
├── Tradier API (market data)
├── Google Gemini AI (AI analysis)
└── RevenueCat (subscriptions - NEW)

Infrastructure:
├── Expo (managed workflow for faster development)
├── EAS Build (app store builds)
└── Sentry (crash reporting)
```

### Project Structure

```
/wsw-options-mobile
├── /src
│   ├── /components          # Reusable UI components
│   │   ├── /charts          # PayoffChart, GreeksChart, etc.
│   │   ├── /cards           # StrategyCard, QuizCard, etc.
│   │   ├── /forms           # Input components
│   │   ├── /layout          # Headers, TabBar, etc.
│   │   └── /mascots         # Animal mascot components
│   ├── /screens
│   │   ├── /auth            # Login, Register, ForgotPassword
│   │   ├── /onboarding      # Risk assessment, preferences
│   │   ├── /home            # Dashboard, LandingPage
│   │   ├── /learn           # Strategies, Lessons, Tutorials
│   │   ├── /tools           # Calculators, Screeners
│   │   ├── /practice        # PaperTrading, StrategyBuilder
│   │   ├── /academy         # Gamification screens
│   │   └── /settings        # Profile, Subscriptions
│   ├── /navigation          # React Navigation config
│   ├── /store               # Redux slices
│   ├── /services            # API, Auth, Market data
│   ├── /hooks               # Custom hooks (port existing)
│   ├── /contexts            # JungleContext, etc.
│   ├── /utils               # Helpers, calculations
│   ├── /theme               # Colors, typography, spacing
│   ├── /assets              # Images, Lottie files
│   └── /data                # Constants, quizData (port existing)
├── /ios                     # iOS native code
├── /android                 # Android native code
└── app.json                 # Expo config
```

---

## Screen-by-Screen Specification

### 1. Onboarding & Auth

**1.1 Splash Screen**
- Animated jungle scene with WSW logo
- Animal mascot appears with greeting

**1.2 Landing Page** (Port: `LandingPage.tsx`)
- Cinematic intro with neon jungle theme
- "Enter the Jungle" CTA
- Social proof/testimonials

**1.3 Authentication** (Port: `AuthModal.tsx`, `useAuth.ts`)
- Email/password login
- Apple Sign-In
- Google Sign-In
- Password reset flow
- Biometric authentication (Face ID/Touch ID)

**1.4 Risk Assessment** (Port: `RiskAssessmentQuiz.tsx`)
- Questionnaire to match user with animal mentor
- Determines starting curriculum path
- Sets default risk tolerance for calculators

### 2. Main Navigation

**Tab Bar (5 tabs):**
1. **Home** - Dashboard overview
2. **Learn** - Strategies & lessons
3. **Tools** - Calculators & screeners
4. **Practice** - Paper trading
5. **Profile** - Settings & progress

### 3. Home Tab

**3.1 Dashboard** (Port: `Dashboard.tsx`)
- Welcome message with animal mentor
- Learning progress ring
- Daily streak counter
- Quick access tiles:
  - Continue learning
  - Paper trading P&L
  - Daily mission
  - Featured strategy
- Market pulse (if premium)

### 4. Learn Tab

**4.1 Strategy Browser**
- Tier-based organization (8 tiers)
- Search and filter
- Lock icons for premium content
- Progress indicators per tier

**4.2 Strategy Detail** (Port: `StrategyDetail.tsx`)
- Strategy overview with mascot explanation
- Interactive payoff diagram
- Greeks breakdown
- When to use / When to avoid
- Real-world examples
- Related strategies
- Quiz unlock button

**4.3 Educational Modules** (Port tutorials)
- Options Vocabulary glossary
- Reading an Options Chain
- Your First Trade walkthrough
- Assignment & Exercise explained
- Common Beginner Mistakes
- Rolling & Adjusting positions

**4.4 Quizzes** (Port: `QuizModal.tsx`, `quizData.ts`)
- Tier-completion quizzes
- Immediate feedback
- XP rewards
- Retry functionality

### 5. Tools Tab

**5.1 Tools Dashboard**
- Grid of available tools
- Premium badges where applicable

**5.2 Greeks Visualizer** (Port: `GreeksVisualizer.tsx`)
- Interactive sliders for inputs
- Real-time Greeks calculation
- Delta/Gamma/Theta/Vega charts
- Simplified mobile UI

**5.3 Calculators** (Port existing)
- Position Sizing Calculator
- POP Calculator
- Expected Move Calculator
- IV Crush Calculator
- Risk/Reward Module

**5.4 Market Tools** (Premium)
- IV Rank Tool (Tradier API)
- Options Screener
- Options Chain Viewer
- Watchlist with alerts

**5.5 3D Options Surface** (Port: `OptionsSurface3D.tsx`)
- Touch-enabled 3D rotation
- Simplified for mobile performance

### 6. Practice Tab

**6.1 Paper Trading Simulator** (Port: `PaperTradingSimulator.tsx`)
- $10k virtual account (configurable)
- Real-time market data (Tradier)
- Order entry (market, limit, stop)
- Position management
- P&L tracking
- Trade history

**6.2 Strategy Builder** (Port: `StrategyBuilder.tsx`)
- Visual leg builder
- Payoff diagram preview
- Save custom strategies

### 7. Profile Tab

**7.1 User Profile**
- Avatar (animal selection)
- Stats overview
- Current tier/level
- Join date

**7.2 Jungle Academy** (Port gamification)
- XP Bar and level
- Badge collection
- Leaderboard
- Daily missions
- Jungle tribes

**7.3 Settings**
- Notification preferences
- Video quality settings
- Theme (dark mode default, light option)
- Data & privacy
- Subscription management
- Sign out

**7.4 Subscription Management**
- Current plan display
- Upgrade/downgrade options
- Restore purchases
- Billing history

---

## Subscription Tiers

### Free Tier
- Tier 1 & 2 strategies (Foundations, Basic)
- Options Vocabulary
- Basic calculators (Position Sizing, Risk/Reward)
- Limited paper trading (delayed data, 5 trades/day)
- Daily missions (1 per day)

### Premium ($14.99/month or $99.99/year)
- All 44+ strategies (Tiers 1-8)
- All tutorials and educational content
- All calculators and tools
- Real-time paper trading (unlimited)
- IV Rank Tool with live data
- Options Screener
- Watchlist with alerts
- Full quiz access
- Unlimited daily missions
- Leaderboard access
- Badge collection
- Offline downloads

### Pro ($29.99/month or $199.99/year)
- Everything in Premium
- AI-powered strategy recommendations (Gemini)
- Advanced 3D visualizations
- Trade journal with analytics
- Priority support
- Early access to new features
- Jungle Tribes (social features)
- Social Trading Feed

---

## Mobile-Specific Features

### 1. Push Notifications
- Daily learning reminders
- Streak warnings ("Don't lose your 7-day streak!")
- Market alerts (IV spikes, earnings)
- New content announcements
- Achievement unlocked

### 2. Offline Mode
- Download strategies for offline reading
- Cached quiz questions
- Offline calculator functionality
- Sync progress when back online

### 3. Haptic Feedback
- Quiz answer feedback
- Achievement unlocks
- Trade executions
- Tab navigation

### 4. Widgets (iOS/Android)
- Daily strategy tip
- Paper trading P&L
- Streak counter
- Quick launch to continue learning

### 5. Apple Watch / WearOS (Future)
- Daily mission reminder
- P&L glance
- Streak tracking

---

## Implementation Phases

### Phase 1: Foundation (MVP)
1. Project setup with Expo
2. Navigation structure
3. Authentication (Supabase)
4. Theme system (neon jungle)
5. Dashboard home screen
6. Strategy list and detail (Tier 1-2)
7. Basic payoff chart
8. Free tier functionality

### Phase 2: Core Learning
1. Port all 44 strategies
2. Quiz system
3. Progress tracking
4. Options Vocabulary
5. Basic tutorials
6. XP and leveling system

### Phase 3: Tools
1. Greeks Visualizer
2. All calculators
3. Paper Trading Simulator
4. Strategy Builder

### Phase 4: Premium Features
1. RevenueCat integration
2. Tradier API (real-time data)
3. IV Rank Tool
4. Options Screener
5. Watchlist
6. Push notifications

### Phase 5: Gamification & Social
1. Leaderboard
2. Badge system
3. Daily missions
4. Jungle Tribes
5. Social feed

### Phase 6: Polish & Launch
1. Performance optimization
2. Offline mode
3. App Store assets
4. Beta testing
5. Launch

---

## Files to Create (Implementation)

```
1. Initialize Expo project
   - npx create-expo-app wsw-options-mobile --template expo-template-blank-typescript

2. Core configuration
   - app.json (Expo config)
   - tsconfig.json
   - babel.config.js
   - .env (API keys)

3. Navigation setup
   - src/navigation/AppNavigator.tsx
   - src/navigation/AuthNavigator.tsx
   - src/navigation/MainTabNavigator.tsx
   - src/navigation/LearnStackNavigator.tsx

4. Theme & styling
   - src/theme/colors.ts (neon jungle palette)
   - src/theme/typography.ts
   - src/theme/spacing.ts
   - src/theme/index.ts

5. Port data files
   - src/data/constants.ts (from web)
   - src/data/quizData.ts (from web)
   - src/data/strategies.ts

6. Core screens (Phase 1)
   - src/screens/auth/LoginScreen.tsx
   - src/screens/home/DashboardScreen.tsx
   - src/screens/learn/StrategiesScreen.tsx
   - src/screens/learn/StrategyDetailScreen.tsx
```

---

## Key Metrics to Track

- Daily Active Users (DAU)
- Lesson completion rate
- Quiz pass rate
- Paper trading engagement
- Subscription conversion rate
- Churn rate
- Average session duration
- Push notification open rate

---

## Verification Plan

1. **Unit Tests**: Jest for business logic, calculators
2. **Component Tests**: React Native Testing Library
3. **E2E Tests**: Detox for critical flows
4. **Manual Testing**:
   - Complete learning flow on iOS and Android
   - Paper trading functionality
   - Subscription purchase and restore
   - Offline mode verification
   - Push notifications
   - Deep linking
5. **Beta Testing**: TestFlight (iOS) and Internal Testing (Android)

---

## Questions Resolved

- ✅ Platform: React Native (iOS/Android) via Expo
- ✅ Content: Port existing 44+ strategies and tools
- ✅ Features: All existing web features adapted for mobile
- ✅ Simulator: Real-time market data via Tradier API
- ✅ Auth: Supabase + social login + biometrics
- ✅ Payments: RevenueCat for subscriptions
- ✅ Branding: Animal mascots as guides (already designed)
