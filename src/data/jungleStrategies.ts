// Jungle Trading Academy - Strategy Definitions for Mobile
// Ported from desktop: wsw-options-course-aesthetics/data/jungleStrategies.ts
// Generated: 2026-02-22
// Entries: 151

export interface JungleStrategyExample {
  scenario: string;
  setup: string;
  outcome: string;
  numbers?: {
    stockPrice: number;
    strikePrice: number;
    premium: number;
    expiration: string;
    result: string;
  };
}

export interface JungleStrategy {
  id: string;
  name: string;
  animalId: string;
  difficulty: number;
  description: string;
  overview: string;
  keyPoints: string[];
  riskProfile: string;
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  bestFor: string;
  avoidWhen: string;
  example: JungleStrategyExample;
  tips: string[];
  commonMistakes: string[];
  relatedStrategies: string[];
}

export const JUNGLE_STRATEGIES: JungleStrategy[] = [
  {
    "id": "sloth-covered-call",
    "name": "Covered Call",
    "animalId": "sloth",
    "difficulty": 1,
    "description": "Generate income by selling call options on stocks you already own.",
    "overview": "The Covered Call is Stanley's favorite strategy - it's like renting out a room in your house. You already own the stock (your house), and you sell someone the right to buy it from you at a higher price (renting the room). You collect premium (rent) while you wait.\n\nThis strategy is perfect for stocks you're willing to hold long-term but want to generate extra income from. It's called \"covered\" because you own the underlying shares - you're protected if the option gets exercised.",
    "keyPoints": [
      "You must own at least 100 shares of the underlying stock",
      "Sell a call option at a strike price above the current stock price",
      "Collect premium immediately as income",
      "Best used on stocks you're bullish or neutral on",
      "Your upside is capped at the strike price + premium received"
    ],
    "riskProfile": "Low risk - you already own the stock. Main \"risk\" is opportunity cost if stock rallies significantly past your strike.",
    "maxProfit": "Strike price - purchase price + premium received (capped)",
    "maxLoss": "Stock price going to $0 minus premium received (same as owning stock)",
    "breakeven": "Original stock purchase price - premium received",
    "bestFor": "Generating income on stocks you plan to hold long-term. Works well in sideways or slightly bullish markets.",
    "avoidWhen": "You expect a massive rally, or you're not willing to sell your shares at the strike price.",
    "example": {
      "scenario": "You own 100 shares of Apple (AAPL) at $170 and want to generate income.",
      "setup": "Sell 1 AAPL call option with a $180 strike, expiring in 30 days, for $3.50 premium.",
      "outcome": "You immediately collect $350 (100 shares × $3.50). If AAPL stays below $180, you keep the premium and your shares. If AAPL goes above $180, your shares get called away at $180, and you profit $10/share + $3.50 premium = $1,350 total.",
      "numbers": {
        "stockPrice": 170,
        "strikePrice": 180,
        "premium": 3.5,
        "expiration": "30 days",
        "result": "$350 income, potential $1,350 max profit"
      }
    },
    "tips": [
      "Choose strike prices 5-10% above current price for balance of premium and upside",
      "Sell options 30-45 days out for optimal time decay",
      "Only use on stocks you'd be happy selling at the strike price",
      "Consider rolling the option if the stock approaches your strike and you want to keep shares"
    ],
    "commonMistakes": [
      "Selling calls on stocks you don't want to lose",
      "Choosing strikes too close to current price (high assignment risk)",
      "Ignoring upcoming earnings or events that could spike the stock",
      "Not having a plan if the stock drops significantly"
    ],
    "relatedStrategies": [
      "sloth-cash-secured-put",
      "sloth-collar"
    ]
  },
  {
    "id": "sloth-cash-secured-put",
    "name": "Cash-Secured Put",
    "animalId": "sloth",
    "difficulty": 2,
    "description": "Get paid to wait for a stock you want to buy at a lower price.",
    "overview": "The Cash-Secured Put is like putting in a lowball offer on a house AND getting paid for making the offer. You sell a put option, agreeing to buy the stock at a lower price if it drops. You collect premium while you wait.\n\nYou need enough cash in your account to buy 100 shares at the strike price (that's the \"cash-secured\" part). If the stock stays above your strike, you keep the premium free and clear. If it drops below, you buy shares at an effective discount.",
    "keyPoints": [
      "You must have cash to buy 100 shares at the strike price",
      "Sell a put option at a strike price below the current stock price",
      "Collect premium immediately",
      "If assigned, you buy stock at strike price minus premium (discount!)",
      "Best on stocks you want to own anyway"
    ],
    "riskProfile": "Low-moderate risk - similar to owning the stock. You're agreeing to buy at a price you've chosen.",
    "maxProfit": "Premium received (if stock stays above strike)",
    "maxLoss": "Strike price - premium received (if stock goes to $0)",
    "breakeven": "Strike price - premium received",
    "bestFor": "Accumulating shares of stocks you want to own. Generating income while waiting for a pullback.",
    "avoidWhen": "You don't actually want to own the stock, or you can't afford to buy 100 shares.",
    "example": {
      "scenario": "You want to buy NVIDIA (NVDA) but think $450 is too expensive. You'd happily buy at $420.",
      "setup": "Sell 1 NVDA put with $420 strike, expiring in 30 days, for $8.00 premium.",
      "outcome": "You collect $800 immediately. If NVDA stays above $420, you keep $800. If NVDA drops to $420 or below, you buy 100 shares at $420 minus $8 = effective price of $412/share.",
      "numbers": {
        "stockPrice": 450,
        "strikePrice": 420,
        "premium": 8,
        "expiration": "30 days",
        "result": "$800 income or shares at $412 effective cost"
      }
    },
    "tips": [
      "Choose strike prices at levels where you'd genuinely want to buy",
      "Keep enough cash reserved - don't overcommit",
      "Use on quality stocks with good fundamentals",
      "Sell puts after a pullback when premiums are higher"
    ],
    "commonMistakes": [
      "Selling puts on stocks you don't want to own",
      "Not having the cash to cover assignment",
      "Chasing premium on risky stocks",
      "Selling too many puts and overexposing your portfolio"
    ],
    "relatedStrategies": [
      "sloth-covered-call",
      "badger-bull-put-spread"
    ]
  },
  {
    "id": "sloth-protective-put",
    "name": "Protective Put",
    "animalId": "sloth",
    "difficulty": 2,
    "description": "Buy insurance for your stock position to limit downside risk.",
    "overview": "The Protective Put is pure portfolio insurance. You own stock and buy a put option to protect against a crash. It's like buying car insurance - you hope you never need it, but you sleep better knowing it's there.\n\nThis strategy costs money (the put premium), but it guarantees a floor on your losses. No matter how far the stock falls, you can always sell at the strike price.",
    "keyPoints": [
      "You own shares and buy a put option on the same stock",
      "The put gives you the right to sell at the strike price",
      "Your maximum loss is capped at: current price - strike price + premium paid",
      "You retain full upside potential (minus the cost of the put)",
      "Great for protecting gains or hedging before uncertain events"
    ],
    "riskProfile": "Very low risk - your downside is defined and limited.",
    "maxProfit": "Unlimited (stock can rise indefinitely, minus put cost)",
    "maxLoss": "Stock price - strike price + premium paid",
    "breakeven": "Stock price + premium paid",
    "bestFor": "Protecting large gains you don't want to lose. Hedging before earnings, elections, or uncertain events.",
    "avoidWhen": "You're confident the stock won't drop, or the premium is too expensive relative to the protection.",
    "example": {
      "scenario": "You bought Tesla (TSLA) at $150 and it's now at $250. You want to protect your $100 gain.",
      "setup": "Buy 1 TSLA put with $230 strike, expiring in 60 days, for $12.00.",
      "outcome": "You pay $1,200 for insurance. If TSLA crashes to $150, you can sell at $230, limiting your loss. If TSLA goes to $300, you make $50/share profit minus $12 insurance cost.",
      "numbers": {
        "stockPrice": 250,
        "strikePrice": 230,
        "premium": 12,
        "expiration": "60 days",
        "result": "Max loss capped at $32/share ($20 drop + $12 premium)"
      }
    },
    "tips": [
      "Buy puts with 2-3 months until expiration for better value",
      "Choose strikes 5-10% below current price for balance of cost and protection",
      "Consider the cost as insurance - don't overpay",
      "Roll or close the put if your thesis changes"
    ],
    "commonMistakes": [
      "Buying protection that's too expensive relative to the risk",
      "Waiting until the stock has already dropped to buy puts",
      "Letting protective puts expire worthless repeatedly (costly habit)",
      "Not considering a collar to offset the cost"
    ],
    "relatedStrategies": [
      "sloth-collar",
      "monkey-long-put"
    ]
  },
  {
    "id": "sloth-collar",
    "name": "Collar Strategy",
    "animalId": "sloth",
    "difficulty": 3,
    "description": "Combine covered call and protective put for near-zero-cost downside protection.",
    "overview": "The Collar is Stanley's masterpiece of risk management. You own stock, buy a protective put (insurance), and sell a covered call (to pay for the insurance). The result? Limited downside, limited upside, and often zero net cost.\n\nIt's like trading some of your upside potential for downside protection. Perfect for locking in gains while staying invested.",
    "keyPoints": [
      "Own 100 shares of stock",
      "Buy an out-of-the-money put (protection)",
      "Sell an out-of-the-money call (income to offset put cost)",
      "Net cost is often zero or very small",
      "Your profit/loss range is capped on both sides"
    ],
    "riskProfile": "Very low risk - both upside and downside are limited.",
    "maxProfit": "Call strike - current stock price (plus any net credit)",
    "maxLoss": "Current stock price - put strike (plus any net debit)",
    "breakeven": "Stock price adjusted for net premium paid/received",
    "bestFor": "Protecting significant gains. Holding through uncertain periods. Sleeping well at night.",
    "avoidWhen": "You expect a massive rally and don't want to cap your upside.",
    "example": {
      "scenario": "You bought META at $200, it's now $350. You want to protect gains but stay invested.",
      "setup": "Buy 1 META $320 put for $15 and sell 1 META $380 call for $14. Net cost: $1 (basically free).",
      "outcome": "You're protected below $320 and capped above $380. Your range is $320-$380 for $1 in cost. You've locked in at least a $119/share gain ($320 floor - $200 cost - $1 net debit).",
      "numbers": {
        "stockPrice": 350,
        "strikePrice": 320,
        "premium": 1,
        "expiration": "45 days",
        "result": "Guaranteed $119-$179 profit per share range"
      }
    },
    "tips": [
      "Structure for zero or small net cost by matching put/call premiums",
      "Use when you have significant unrealized gains to protect",
      "Consider wider collar (further OTM strikes) for more room",
      "Can be adjusted or rolled as the stock moves"
    ],
    "commonMistakes": [
      "Making the collar too tight (strikes too close together)",
      "Forgetting about dividends and early assignment risk",
      "Not understanding the tradeoff you're making",
      "Using collars on every position (over-hedging)"
    ],
    "relatedStrategies": [
      "sloth-covered-call",
      "sloth-protective-put"
    ]
  },
  {
    "id": "sloth-short-straddle",
    "name": "Short Straddle",
    "animalId": "sloth",
    "difficulty": 2,
    "description": "Collect maximum premium by betting on stocks staying put.",
    "overview": "Stanley's Short Straddle is the ultimate \"do nothing\" trade. Sell both a call AND a put at the same strike. Collect premium from both sides. Then... take a nap. If the stock doesn't move much, you profit from both decaying to zero.\n\nWarning: This has unlimited risk, but Stanley only uses it on boring, stable indexes. Slow and steady means... slow and steady.",
    "keyPoints": [
      "Sell ATM call and ATM put at same strike",
      "Collect premium from both options",
      "Maximum profit if stock stays exactly at strike",
      "Profit zone around strike as options decay",
      "UNLIMITED RISK if stock moves significantly"
    ],
    "riskProfile": "HIGH RISK - unlimited losses in both directions. Only for experienced traders on stable underlyings.",
    "maxProfit": "Total premium collected from both options",
    "maxLoss": "Unlimited in both directions",
    "breakeven": "Strike price ± total premium collected",
    "bestFor": "Low volatility environments. Stable indexes. Experienced theta collectors.",
    "avoidWhen": "High volatility, earnings, or any catalyst approaching. Beginners should avoid.",
    "example": {
      "scenario": "SPY at $500, very low volatility, expecting it to stay flat.",
      "setup": "Sell $500 call for $5 and $500 put for $5. Total credit: $10.",
      "outcome": "Max profit: $1,000 if SPY at exactly $500 at expiration. Breakevens: $490 and $510. Beyond that, losses are unlimited.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 10,
        "expiration": "30 days",
        "result": "$1,000 max profit, unlimited risk outside $490-$510"
      }
    },
    "tips": [
      "Only use on stable indexes (SPY, IWM) - never individual stocks",
      "Enter when IV is elevated but expecting calm",
      "Have a plan to hedge or adjust if breached",
      "Consider using iron butterfly instead for defined risk"
    ],
    "commonMistakes": [
      "Using on volatile stocks or before earnings",
      "Not monitoring position regularly",
      "No exit plan when position goes against you",
      "Over-sizing position relative to account"
    ],
    "relatedStrategies": [
      "sloth-short-strangle",
      "sloth-covered-short-straddle"
    ]
  },
  {
    "id": "sloth-short-strangle",
    "name": "Short Strangle",
    "animalId": "sloth",
    "difficulty": 2,
    "description": "Collect premium from both sides with wider profit range than straddle.",
    "overview": "Stanley's short strangle is like the short straddle's more cautious cousin. Sell an OTM call AND an OTM put. You collect less premium, but you get a wider profit zone. The stock can move a bit more before you're in trouble.\n\nThis is Stanley's go-to for income when the market is calm but not totally dead.",
    "keyPoints": [
      "Sell 1 OTM call",
      "Sell 1 OTM put",
      "Collect premium from both sides",
      "Wider profit range than short straddle",
      "UNLIMITED RISK in both directions"
    ],
    "riskProfile": "HIGH RISK - unlimited losses in both directions, but wider profit zone than straddle.",
    "maxProfit": "Total premium collected from both options",
    "maxLoss": "Unlimited in both directions",
    "breakeven": "Call strike + premium, and put strike - premium",
    "bestFor": "Low to moderate volatility. Stable indexes. Theta farming with breathing room.",
    "avoidWhen": "High volatility, major events, or uncertain markets.",
    "example": {
      "scenario": "SPY at $500. Expecting it to stay in a $490-$510 range.",
      "setup": "Sell $510 call for $4 and $490 put for $4. Total credit: $8.",
      "outcome": "Max profit: $800 if SPY between $490-$510. Breakevens: $482 and $518. Wider range than straddle.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 8,
        "expiration": "30 days",
        "result": "$800 max profit, wider profit zone than straddle"
      }
    },
    "tips": [
      "Use on stable indexes, not volatile stocks",
      "Enter when IV is elevated",
      "Have adjustment plan if breached",
      "Consider iron condor for defined risk"
    ],
    "commonMistakes": [
      "Using on individual stocks pre-earnings",
      "Not monitoring the position",
      "No plan for breaches",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "sloth-short-straddle",
      "sloth-jade-lizard"
    ]
  },
  {
    "id": "sloth-jade-lizard",
    "name": "Jade Lizard",
    "animalId": "sloth",
    "difficulty": 3,
    "description": "Neutral income strategy with no upside risk - perfect for patient traders.",
    "overview": "Stanley loves the jade lizard because it removes upside worry completely. Sell an OTM put and an OTM call spread. The credit you collect is MORE than the width of the call spread, so there's zero upside risk.\n\nYou can sit back and relax - the only risk is downside if the stock crashes. That's Stanley's kind of trade.",
    "keyPoints": [
      "Sell 1 OTM put",
      "Sell 1 OTM call, buy 1 higher call",
      "Credit > width of call spread",
      "NO upside risk",
      "Only risk is downside"
    ],
    "riskProfile": "Moderate risk - undefined below short put, ZERO risk above.",
    "maxProfit": "Total credit received",
    "maxLoss": "Put strike - credit (if stock goes to $0)",
    "breakeven": "Put strike - total credit",
    "bestFor": "Neutral to slightly bullish. High IV. Income generation with upside protection.",
    "avoidWhen": "Bearish outlook or very low IV.",
    "example": {
      "scenario": "Stock at $100. Neutral. IV is high.",
      "setup": "Sell $95 put for $4, sell $110 call for $2.50, buy $115 call for $1. Credit: $5.50.",
      "outcome": "If stock above $95: keep $550. No risk above $100 (credit > call spread). Risk below $89.50.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 5.5,
        "expiration": "45 days",
        "result": "$550 max profit, zero upside risk"
      }
    },
    "tips": [
      "Always verify credit > call spread width",
      "Use in high IV environments",
      "Manage at 50% profit",
      "Monitor put side for breaches"
    ],
    "commonMistakes": [
      "Not checking credit vs spread width",
      "Using on bearish stocks",
      "Ignoring downside management",
      "Entering in low IV"
    ],
    "relatedStrategies": [
      "sloth-short-strangle",
      "fox-jade-lizard"
    ]
  },
  {
    "id": "sloth-calendar-spread",
    "name": "Calendar Spread",
    "animalId": "sloth",
    "difficulty": 2,
    "description": "Profit from time decay by selling near-term, buying long-term options.",
    "overview": "Stanley's calendar spread is pure patience. Sell a near-term option, buy the same strike longer-term. The near-term decays faster while your long-term option holds value. Time is your friend.\n\nThis is perfect for Stanley - let time do the work while you nap.",
    "keyPoints": [
      "Sell near-term option",
      "Buy longer-term option at same strike",
      "Profit from faster near-term decay",
      "Directionally neutral initially",
      "Can roll near-term indefinitely"
    ],
    "riskProfile": "Low risk - max loss is debit paid.",
    "maxProfit": "Varies - depends on volatility and time decay",
    "maxLoss": "Net debit paid",
    "breakeven": "At strike at near-term expiration",
    "bestFor": "Range-bound stocks. Farming theta. Low volatility periods.",
    "avoidWhen": "Expecting big moves or through major events.",
    "example": {
      "scenario": "Stock at $100. Expecting it to stay near $100 for a month.",
      "setup": "Sell 30-day $100 call for $4, buy 60-day $100 call for $6. Net: $2 debit.",
      "outcome": "If stock at $100 in 30 days: near-term expires worthless, long-term worth ~$4. Profit: $200.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 2,
        "expiration": "30/60 days",
        "result": "Profit from time decay differential"
      }
    },
    "tips": [
      "Use at-the-money for max theta",
      "Sell 30-45 day, buy 60-90 day",
      "Can roll short option monthly",
      "Close at 50% profit"
    ],
    "commonMistakes": [
      "Using on volatile stocks",
      "Not managing before expiration",
      "Wrong strike selection",
      "Holding through earnings"
    ],
    "relatedStrategies": [
      "fox-calendar-spread",
      "dolphin-calendar-spread"
    ]
  },
  {
    "id": "sloth-covered-short-straddle",
    "name": "Covered Short Straddle",
    "animalId": "sloth",
    "difficulty": 3,
    "description": "Short straddle protected by owning the underlying stock.",
    "overview": "Stanley's covered short straddle is for when you own the stock and want maximum income. You already own 100 shares, so you sell BOTH an ATM call and ATM put. The stock covers the call, and you have capital for the put.\n\nThis collects maximum premium while you hold the stock long-term. Stanley's ultimate income generator.",
    "keyPoints": [
      "Own 100 shares of stock",
      "Sell ATM call (covered by shares)",
      "Sell ATM put (cash-secured)",
      "Collect maximum premium",
      "Upside capped, downside has assignment risk"
    ],
    "riskProfile": "Moderate risk - upside capped, can be assigned more shares on put.",
    "maxProfit": "Premium from call + put",
    "maxLoss": "Stock going to $0 + put assignment",
    "breakeven": "Stock basis - premiums collected",
    "bestFor": "Long-term stock holders. Income generation on stable holdings.",
    "avoidWhen": "Expecting big moves or don't want to add more shares.",
    "example": {
      "scenario": "Own 100 shares of SPY at $495. SPY now at $500.",
      "setup": "Sell $500 call for $6, sell $500 put for $6. Collect $12 total.",
      "outcome": "If SPY at $500: keep $1,200 + shares. If above $500: shares called away at profit. If below $500: buy 100 more shares, average down.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 12,
        "expiration": "30 days",
        "result": "$1,200 income, shares called away or double position"
      }
    },
    "tips": [
      "Only use on stocks you want to own long-term",
      "Have cash ready for put assignment",
      "Use on stable, dividend stocks",
      "Manage aggressively if breached"
    ],
    "commonMistakes": [
      "Not having cash for put assignment",
      "Using on volatile stocks",
      "Forgetting upside is capped",
      "Not wanting to own more shares"
    ],
    "relatedStrategies": [
      "sloth-covered-call",
      "sloth-short-straddle"
    ]
  },
  {
    "id": "badger-bull-put-spread",
    "name": "Bull Put Spread",
    "animalId": "badger",
    "difficulty": 2,
    "description": "A defined-risk way to profit from bullish or neutral stock movement.",
    "overview": "The Bull Put Spread is Boris's bread and butter. You sell a put (collecting premium) and buy a lower-strike put (defining your risk). Your maximum loss is capped, no matter how far the stock falls.\n\nIt's like the cash-secured put's smarter cousin - you still collect premium when you're bullish, but you don't need as much capital and your risk is strictly limited.",
    "keyPoints": [
      "Sell a higher-strike put (closer to stock price)",
      "Buy a lower-strike put (defines max loss)",
      "Net credit received upfront",
      "Max profit if stock stays above the short put strike",
      "Max loss is limited to the width of strikes minus credit received"
    ],
    "riskProfile": "Moderate risk - max loss is defined and known before entering.",
    "maxProfit": "Net credit received",
    "maxLoss": "(Higher strike - lower strike) - net credit received",
    "breakeven": "Higher strike - net credit received",
    "bestFor": "Bullish to neutral outlook. Income generation with defined risk. Capital-efficient trading.",
    "avoidWhen": "You're bearish on the stock or expect significant downside.",
    "example": {
      "scenario": "You're moderately bullish on Amazon (AMZN) trading at $185.",
      "setup": "Sell 1 AMZN $180 put for $4.50, buy 1 AMZN $175 put for $2.50. Net credit: $2.00.",
      "outcome": "Max profit: $200 (if AMZN stays above $180). Max loss: $300 (if AMZN falls below $175). Risk/reward: risk $300 to make $200.",
      "numbers": {
        "stockPrice": 185,
        "strikePrice": 180,
        "premium": 2,
        "expiration": "30 days",
        "result": "Max profit $200, max loss $300"
      }
    },
    "tips": [
      "Aim for credit of at least 1/3 the width of strikes",
      "Use 30-45 day expirations for optimal time decay",
      "Choose short strike with 70-80% probability of profit",
      "Manage early if you hit 50% of max profit"
    ],
    "commonMistakes": [
      "Using strikes that are too wide (excessive risk)",
      "Not considering the risk/reward ratio before entering",
      "Holding to expiration when you could take profits early",
      "Ignoring assignment risk near expiration"
    ],
    "relatedStrategies": [
      "badger-bear-call-spread",
      "badger-iron-condor"
    ]
  },
  {
    "id": "badger-bear-call-spread",
    "name": "Bear Call Spread",
    "animalId": "badger",
    "difficulty": 2,
    "description": "A defined-risk way to profit from bearish or neutral stock movement.",
    "overview": "The Bear Call Spread is the mirror image of the bull put spread. You sell a call (collecting premium) and buy a higher-strike call (capping your risk). Perfect for when you think a stock will stay flat or drop.\n\nThis is Boris's go-to for overextended stocks or bearish setups with defined risk.",
    "keyPoints": [
      "Sell a lower-strike call (closer to stock price)",
      "Buy a higher-strike call (defines max loss)",
      "Net credit received upfront",
      "Max profit if stock stays below the short call strike",
      "Max loss is limited to the width of strikes minus credit"
    ],
    "riskProfile": "Moderate risk - max loss is defined and known before entering.",
    "maxProfit": "Net credit received",
    "maxLoss": "(Higher strike - lower strike) - net credit received",
    "breakeven": "Lower strike + net credit received",
    "bestFor": "Bearish to neutral outlook. Fading rallies. Stocks you think are overextended.",
    "avoidWhen": "You're bullish or the stock is in a strong uptrend.",
    "example": {
      "scenario": "You think Microsoft (MSFT) at $430 is overbought and will pull back or stall.",
      "setup": "Sell 1 MSFT $435 call for $5.00, buy 1 MSFT $440 call for $3.00. Net credit: $2.00.",
      "outcome": "Max profit: $200 (if MSFT stays below $435). Max loss: $300 (if MSFT goes above $440). Breakeven: $437.",
      "numbers": {
        "stockPrice": 430,
        "strikePrice": 435,
        "premium": 2,
        "expiration": "30 days",
        "result": "Max profit $200, max loss $300"
      }
    },
    "tips": [
      "Use after a stock has had a big run-up",
      "Check for upcoming catalysts that could spike the stock",
      "Consider using on indexes for broader market bets",
      "Close early if you hit 50% profit to reduce risk"
    ],
    "commonMistakes": [
      "Fighting strong uptrends",
      "Ignoring earnings or other catalysts",
      "Using strikes too close to current price (high probability of loss)",
      "Over-concentrating bearish bets"
    ],
    "relatedStrategies": [
      "badger-bull-put-spread",
      "badger-iron-condor"
    ]
  },
  {
    "id": "badger-iron-condor",
    "name": "Iron Condor",
    "animalId": "badger",
    "difficulty": 3,
    "description": "Profit from a stock staying within a range - the ultimate neutral strategy.",
    "overview": "The Iron Condor is Boris's pride and joy - a beautiful combination of a bull put spread and a bear call spread on the same stock. You profit when the stock stays between your strikes, collecting premium from both sides.\n\nIt's like setting up walls on both sides and collecting rent from both directions. Perfect for range-bound markets or high IV environments.",
    "keyPoints": [
      "Combines a bull put spread (below the stock) and bear call spread (above)",
      "Four option legs total: sell put, buy lower put, sell call, buy higher call",
      "Maximum profit when stock stays between the two short strikes",
      "Risk is limited to the wider spread width minus total credit",
      "Works best in high implied volatility environments"
    ],
    "riskProfile": "Moderate risk - max loss defined on both sides.",
    "maxProfit": "Total net credit received",
    "maxLoss": "Wider spread width - net credit received",
    "breakeven": "Upper breakeven: short call + credit. Lower: short put - credit.",
    "bestFor": "Range-bound stocks. High IV environments. Earnings plays (after the event).",
    "avoidWhen": "You expect a big move in either direction.",
    "example": {
      "scenario": "SPY is at $520 and you expect it to stay between $510-$530 for the next month.",
      "setup": "Sell $510 put, buy $505 put, sell $530 call, buy $535 call. Total credit: $2.50.",
      "outcome": "Max profit: $250 (if SPY stays between $510-$530). Max loss: $250 (on either side). You're profitable if SPY stays in a $20 range.",
      "numbers": {
        "stockPrice": 520,
        "strikePrice": 510,
        "premium": 2.5,
        "expiration": "30 days",
        "result": "Max profit $250, max loss $250"
      }
    },
    "tips": [
      "Aim for credit of at least 1/3 of the wing width",
      "Use wider wings in high IV, tighter in low IV",
      "Manage at 50% profit or when one side is challenged",
      "Consider delta of short strikes (~15-20 delta is common)"
    ],
    "commonMistakes": [
      "Using iron condors before big announcements",
      "Letting one side get deep in the money without adjusting",
      "Not understanding the probability of touch vs. probability of profit",
      "Over-trading iron condors without conviction"
    ],
    "relatedStrategies": [
      "badger-bull-put-spread",
      "badger-bear-call-spread",
      "badger-calendar-spread"
    ]
  },
  {
    "id": "badger-calendar-spread",
    "name": "Calendar Spread",
    "animalId": "badger",
    "difficulty": 4,
    "description": "Profit from time decay differences between near and far-dated options.",
    "overview": "The Calendar Spread exploits a fundamental truth: near-term options decay faster than longer-term options. You sell a near-term option and buy a longer-term option at the same strike.\n\nAs time passes, your short option loses value faster than your long option, and you pocket the difference. Boris loves this for its elegant use of theta.",
    "keyPoints": [
      "Sell a near-term option (30 days or less)",
      "Buy a longer-term option at the same strike (60+ days)",
      "Net debit to enter (you pay for the spread)",
      "Profits from faster decay of the short option",
      "Best when stock stays near the strike price"
    ],
    "riskProfile": "Moderate risk - max loss is the debit paid.",
    "maxProfit": "Variable - depends on IV and how close stock is to strike at front expiration",
    "maxLoss": "Net debit paid to enter",
    "breakeven": "Complex - depends on IV at front month expiration",
    "bestFor": "Stocks you expect to stay near a certain price. Low to moderate IV environments.",
    "avoidWhen": "You expect a big move, or IV is already very high.",
    "example": {
      "scenario": "Google (GOOGL) is at $175 and you expect it to stay around that level.",
      "setup": "Sell 1 GOOGL $175 call expiring in 30 days for $5. Buy 1 GOOGL $175 call expiring in 60 days for $8. Net debit: $3.",
      "outcome": "If GOOGL stays at $175, the 30-day call expires worthless and your 60-day call still has value. You might close for $5-6, making $2-3 profit.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 175,
        "premium": 3,
        "expiration": "30/60 days",
        "result": "Potential $200-300 profit on $300 risk"
      }
    },
    "tips": [
      "Choose strikes at-the-money or slightly OTM",
      "Watch for IV changes - rising IV helps, falling IV hurts",
      "Close before front month expiration if profitable",
      "Can be converted to other spreads after front month expires"
    ],
    "commonMistakes": [
      "Ignoring IV risk (IV crush can kill the trade)",
      "Holding too long and losing the time decay advantage",
      "Using when stock is likely to move significantly",
      "Not understanding the Greeks dynamics of calendars"
    ],
    "relatedStrategies": [
      "badger-diagonal-spread",
      "badger-iron-condor"
    ]
  },
  {
    "id": "badger-diagonal-spread",
    "name": "Diagonal Spread",
    "animalId": "badger",
    "difficulty": 4,
    "description": "Combine directional bias with time decay - the best of both worlds.",
    "overview": "The Diagonal Spread is like a calendar spread with a directional twist. You buy a longer-term option and sell a near-term option at a different strike. This lets you profit from both time decay AND a directional move.\n\nBoris uses this when he has a directional bias but wants time to work in his favor too.",
    "keyPoints": [
      "Buy a longer-term option (60-90 days out)",
      "Sell a shorter-term option at a different strike (30 days)",
      "Net debit to enter",
      "Profits from time decay AND directional movement",
      "More flexible than straight calendars"
    ],
    "riskProfile": "Moderate risk - debit paid is at risk, but less than a straight long option.",
    "maxProfit": "Variable - can be significant if direction is correct",
    "maxLoss": "Net debit paid (in worst case)",
    "breakeven": "Complex - depends on both time and price movement",
    "bestFor": "Directional bias with patience. Reducing cost basis of long options.",
    "avoidWhen": "You need immediate directional exposure or expect a very fast move.",
    "example": {
      "scenario": "You're bullish on Netflix (NFLX) at $650 but want to reduce your cost.",
      "setup": "Buy 1 NFLX $640 call expiring in 60 days for $35. Sell 1 NFLX $670 call expiring in 30 days for $12. Net debit: $23.",
      "outcome": "If NFLX rises to $670 by first expiration, short call is at breakeven and long call has gained significantly. You could close for $35-40, making $12-17 profit.",
      "numbers": {
        "stockPrice": 650,
        "strikePrice": 640,
        "premium": 23,
        "expiration": "30/60 days",
        "result": "Potential $1,200-1,700 profit on $2,300 risk"
      }
    },
    "tips": [
      "Buy ITM or ATM long option for higher delta",
      "Sell OTM short option for income",
      "Roll the short option if it expires worthless",
      "Consider delta-neutral vs. directional setups"
    ],
    "commonMistakes": [
      "Selling too aggressive of a short strike",
      "Not managing when short strike is breached",
      "Ignoring the impact of IV changes",
      "Over-complicating adjustments"
    ],
    "relatedStrategies": [
      "badger-calendar-spread",
      "monkey-debit-spread"
    ]
  },
  {
    "id": "badger-broken-wing-butterfly",
    "name": "Broken Wing Butterfly",
    "animalId": "badger",
    "difficulty": 3,
    "description": "Asymmetric butterfly with built-in directional bias and better risk/reward.",
    "overview": "Luke's Broken Wing Butterfly is a refined version of the standard butterfly. By moving one wing further out, you create a directional bias and often collect a credit instead of paying a debit. It's strategic precision at its finest.\n\nThis is for when you have a directional lean but want defined risk on both sides.",
    "keyPoints": [
      "Similar to butterfly but with asymmetric wings",
      "One wing is further out than standard butterfly",
      "Often entered for credit or small debit",
      "Directional bias while maintaining defined risk",
      "Better risk/reward than standard butterfly"
    ],
    "riskProfile": "Low-moderate risk - defined on both sides, often credit received.",
    "maxProfit": "Narrower wing width minus net debit (or plus credit)",
    "maxLoss": "Wider wing width minus credit received",
    "breakeven": "Depends on structure - typically two breakevens",
    "bestFor": "Directional bias with protection. High IV environments. Probabilistic trading.",
    "avoidWhen": "No clear directional thesis or very low IV.",
    "example": {
      "scenario": "SPY at $500. Slightly bullish bias. Want defined risk.",
      "setup": "Sell $500/$505 call spread, buy $515 call. Credit: $0.50. (Broken wing call fly)",
      "outcome": "Max profit: $5.50 if SPY at $500 or below. Max loss: $4.50 at $505. Above $515, protected by long call.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 0.5,
        "expiration": "30 days",
        "result": "Risk $450 to make $550 with high probability"
      }
    },
    "tips": [
      "Place broken wing in direction you DON'T expect",
      "Monitor position - can adjust to standard fly if needed",
      "Works best 20-40 days to expiration",
      "Close at 50-75% of max profit"
    ],
    "commonMistakes": [
      "Making wings too asymmetric",
      "Not understanding which direction has more risk",
      "Ignoring early management opportunities",
      "Using on low liquidity underlyings"
    ],
    "relatedStrategies": [
      "badger-iron-condor",
      "fox-broken-wing-butterfly"
    ]
  },
  {
    "id": "badger-pmcc",
    "name": "Poor Man's Covered Call",
    "animalId": "badger",
    "difficulty": 3,
    "description": "Replicate covered calls with LEAPS - same strategy, fraction of the capital.",
    "overview": "Luke's PMCC is strategic capital efficiency. Instead of buying 100 shares, you buy a deep ITM LEAP call and sell shorter-term calls against it. You get covered call economics with 70-80% less capital.\n\nThis is strategic leverage used responsibly. All the upside of covered calls, less capital at risk.",
    "keyPoints": [
      "Buy deep ITM LEAP call (>70 delta, 6+ months out)",
      "Sell shorter-term OTM call against it",
      "Mimics covered call with less capital",
      "Collect premium on short calls regularly",
      "LEAP acts as stock substitute"
    ],
    "riskProfile": "Moderate risk - less capital than covered call, but can lose LEAP value.",
    "maxProfit": "Short call strike - LEAP strike + credits - LEAP cost",
    "maxLoss": "LEAP cost (much less than 100 shares)",
    "breakeven": "LEAP cost - total credits collected",
    "bestFor": "Capital-efficient income generation. Bullish stocks with high premiums.",
    "avoidWhen": "Stock is highly volatile or you can't afford to lose the LEAP.",
    "example": {
      "scenario": "Want covered call exposure on AAPL at $180 but don't want to tie up $18,000.",
      "setup": "Buy $150 LEAP call (12 months) for $35. Sell $190 call (45 days) for $3.",
      "outcome": "You control same upside for $3,500 vs $18,000. Collect $300/month. If called away, profit on both legs.",
      "numbers": {
        "stockPrice": 180,
        "strikePrice": 150,
        "premium": 35,
        "expiration": "12 months / 45 days",
        "result": "Similar returns with 80% less capital"
      }
    },
    "tips": [
      "Buy LEAP with >70 delta (acts like stock)",
      "Sell 30-45 day calls for optimal theta",
      "Avoid earnings on the short call",
      "Roll LEAP when delta drops below 60"
    ],
    "commonMistakes": [
      "Buying LEAP without enough time value",
      "Selling short call too close to LEAP strike",
      "Not managing when short call goes ITM",
      "Using on stocks with poor liquidity"
    ],
    "relatedStrategies": [
      "badger-diagonal-spread",
      "fox-pmcc"
    ]
  },
  {
    "id": "monkey-long-call",
    "name": "Long Call",
    "animalId": "monkey",
    "difficulty": 1,
    "description": "The classic bullish bet - leveraged upside with limited risk.",
    "overview": "The Long Call is Marcus's entry point for catching big moves. You buy a call option, giving you the right to buy stock at a specific price. If the stock rockets up, your profits can be massive. If it doesn't, you lose only what you paid.\n\nThis is leveraged bullish exposure - control 100 shares for a fraction of the cost of buying stock outright.",
    "keyPoints": [
      "Buy a call option at a strike price you expect the stock to exceed",
      "Pay premium upfront (this is your max loss)",
      "Profit when stock rises above strike + premium paid",
      "Leverage: control 100 shares for the cost of the option",
      "Time decay works against you - the clock is ticking"
    ],
    "riskProfile": "Moderate-high risk - you can lose 100% of your premium if wrong.",
    "maxProfit": "Unlimited (stock can rise indefinitely)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike price + premium paid",
    "bestFor": "High-conviction bullish plays. Catching breakouts. Leverage without borrowing.",
    "avoidWhen": "You're unsure of timing, or IV is extremely high (options are expensive).",
    "example": {
      "scenario": "You think AMD will rally from $140 to $160 in the next month.",
      "setup": "Buy 1 AMD $145 call expiring in 30 days for $5.00.",
      "outcome": "If AMD hits $160, your call is worth $15 intrinsic value. Profit: $1,000 (200% return). If AMD stays at $140, you lose $500.",
      "numbers": {
        "stockPrice": 140,
        "strikePrice": 145,
        "premium": 5,
        "expiration": "30 days",
        "result": "$1,000 profit at $160, $500 max loss"
      }
    },
    "tips": [
      "Buy at least 45-60 days out to give yourself time",
      "ATM or slightly ITM calls have higher probability but cost more",
      "Don't hold to expiration - take profits at 50-100% gains",
      "Size positions so you can afford to lose the premium"
    ],
    "commonMistakes": [
      "Buying way OTM calls (\"lottery tickets\") with low probability",
      "Not giving enough time for the move to happen",
      "Holding too long and letting time decay eat your profits",
      "Buying when IV is at peaks (overpaying)"
    ],
    "relatedStrategies": [
      "monkey-long-put",
      "monkey-debit-spread",
      "monkey-straddle"
    ]
  },
  {
    "id": "monkey-long-put",
    "name": "Long Put",
    "animalId": "monkey",
    "difficulty": 1,
    "description": "The classic bearish bet - profit from downside moves with limited risk.",
    "overview": "The Long Put is the bearish counterpart to the long call. You buy a put option, giving you the right to sell stock at a specific price. If the stock tanks, you profit. If it doesn't, you lose only the premium.\n\nMarcus uses this for catching crashes, hedging, or bearish directional plays.",
    "keyPoints": [
      "Buy a put option at a strike price you expect the stock to fall below",
      "Pay premium upfront (this is your max loss)",
      "Profit when stock falls below strike - premium paid",
      "Great for bearish bets without shorting stock",
      "Time decay works against you"
    ],
    "riskProfile": "Moderate-high risk - you can lose 100% of premium if wrong.",
    "maxProfit": "Strike price - premium paid (if stock goes to $0)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike price - premium paid",
    "bestFor": "Bearish plays. Hedging long portfolios. Catching breakdowns.",
    "avoidWhen": "The stock is in a strong uptrend, or you're unsure of timing.",
    "example": {
      "scenario": "You think Meta (META) will drop from $500 to $450 after disappointing guidance.",
      "setup": "Buy 1 META $490 put expiring in 30 days for $12.00.",
      "outcome": "If META drops to $450, your put is worth $40 intrinsic value. Profit: $2,800 (233% return). If META stays at $500, you lose $1,200.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 490,
        "premium": 12,
        "expiration": "30 days",
        "result": "$2,800 profit at $450, $1,200 max loss"
      }
    },
    "tips": [
      "Use for high-conviction bearish thesis only",
      "ITM puts have higher delta and move more with the stock",
      "Consider put spreads to reduce cost",
      "Don't fight strong uptrends"
    ],
    "commonMistakes": [
      "Buying puts on stocks in strong uptrends",
      "Not having a clear catalyst for the drop",
      "Using puts as permanent hedges (expensive)",
      "Waiting too long to take profits"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "monkey-debit-spread",
      "sloth-protective-put"
    ]
  },
  {
    "id": "monkey-debit-spread",
    "name": "Debit Spread",
    "animalId": "monkey",
    "difficulty": 2,
    "description": "A cheaper way to play direction with capped risk and capped reward.",
    "overview": "The Debit Spread (bull call spread or bear put spread) is Marcus's way of making directional bets cheaper. You buy an option and sell a further OTM option to reduce your cost.\n\nYou give up some upside potential in exchange for a lower cost basis. Smart money management for directional plays.",
    "keyPoints": [
      "Bull call spread: Buy lower strike call, sell higher strike call",
      "Bear put spread: Buy higher strike put, sell lower strike put",
      "Net debit to enter (cheaper than naked long options)",
      "Max profit is capped at the width of strikes minus debit",
      "Max loss is the debit paid"
    ],
    "riskProfile": "Moderate risk - defined risk with defined reward.",
    "maxProfit": "Width of strikes - net debit paid",
    "maxLoss": "Net debit paid",
    "breakeven": "Long strike +/- net debit (depending on direction)",
    "bestFor": "Directional plays with defined risk. Reducing cost of long options.",
    "avoidWhen": "You expect a massive move that would exceed your short strike.",
    "example": {
      "scenario": "You're bullish on Disney (DIS) at $95 but want to reduce your cost.",
      "setup": "Buy 1 DIS $95 call for $4.50, sell 1 DIS $100 call for $2.00. Net debit: $2.50.",
      "outcome": "Max profit: $250 (if DIS goes above $100). Max loss: $250. Breakeven: $97.50.",
      "numbers": {
        "stockPrice": 95,
        "strikePrice": 95,
        "premium": 2.5,
        "expiration": "30 days",
        "result": "Max profit $250, max loss $250, 1:1 risk/reward"
      }
    },
    "tips": [
      "Use when you have a price target in mind (for the short strike)",
      "Wider spreads = more profit potential but more risk",
      "Choose spreads where your short strike is at your target price",
      "Close at 50-75% of max profit to reduce risk"
    ],
    "commonMistakes": [
      "Making spreads too narrow (not worth the commission)",
      "Holding to expiration when you can lock in profits",
      "Not considering probability of reaching max profit",
      "Ignoring assignment risk on short leg"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "monkey-long-put",
      "badger-bull-put-spread"
    ]
  },
  {
    "id": "monkey-straddle",
    "name": "Long Straddle",
    "animalId": "monkey",
    "difficulty": 3,
    "description": "Bet on a big move without predicting the direction.",
    "overview": "The Long Straddle is Marcus's \"something big is about to happen\" play. You buy both a call AND a put at the same strike price. If the stock makes a big move in either direction, you profit.\n\nThis is a volatility play - you're betting the stock will move more than the market expects.",
    "keyPoints": [
      "Buy a call AND a put at the same strike (usually ATM)",
      "Profit if stock makes a big move in either direction",
      "Need the move to exceed the total premium paid",
      "Works best before earnings, FDA decisions, or other big events",
      "Time decay hurts both legs - the clock is your enemy"
    ],
    "riskProfile": "High risk - you can lose 100% of both premiums paid.",
    "maxProfit": "Unlimited in either direction (minus premium)",
    "maxLoss": "Total premium paid (if stock stays at strike)",
    "breakeven": "Strike + total premium (upside) or Strike - total premium (downside)",
    "bestFor": "Earnings plays. Expected volatility events. When you don't know direction but expect a big move.",
    "avoidWhen": "IV is already very high (you're overpaying for volatility).",
    "example": {
      "scenario": "NVDA earnings are tomorrow and you expect a big move but don't know which way.",
      "setup": "Buy 1 NVDA $500 call for $20 and 1 NVDA $500 put for $18. Total cost: $38.",
      "outcome": "You need NVDA to move more than $38 from $500 (above $538 or below $462) to profit. If NVDA goes to $550, your call is worth $50 = $1,200 profit.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 38,
        "expiration": "7 days",
        "result": "Profitable above $538 or below $462"
      }
    },
    "tips": [
      "Buy before the event, sell before expiration",
      "Check implied volatility - if already high, consider alternatives",
      "Calculate your breakeven points before entering",
      "Consider selling one leg if direction becomes clear"
    ],
    "commonMistakes": [
      "Buying straddles when IV is at peaks (IV crush after event)",
      "Not calculating breakeven points",
      "Holding through the event and getting IV crushed",
      "Using on stocks that don't actually move much"
    ],
    "relatedStrategies": [
      "monkey-strangle",
      "badger-iron-condor"
    ]
  },
  {
    "id": "monkey-strangle",
    "name": "Long Strangle",
    "animalId": "monkey",
    "difficulty": 3,
    "description": "A cheaper straddle - bet on big moves with OTM options.",
    "overview": "The Long Strangle is like a straddle but cheaper. You buy an OTM call AND an OTM put. The cost is lower, but you need a bigger move to profit.\n\nMarcus uses this when he expects volatility but wants to risk less capital.",
    "keyPoints": [
      "Buy an OTM call (above current price)",
      "Buy an OTM put (below current price)",
      "Cheaper than a straddle but needs bigger move",
      "Wider breakeven points",
      "Same volatility play concept"
    ],
    "riskProfile": "High risk - both options can expire worthless.",
    "maxProfit": "Unlimited in either direction (minus premium)",
    "maxLoss": "Total premium paid",
    "breakeven": "Call strike + total premium (up) or Put strike - total premium (down)",
    "bestFor": "Cheaper volatility plays. Expecting extreme moves.",
    "avoidWhen": "You expect only a moderate move, or IV is already high.",
    "example": {
      "scenario": "Tesla earnings could cause a big move. TSLA at $240.",
      "setup": "Buy 1 TSLA $250 call for $8 and 1 TSLA $230 put for $7. Total cost: $15.",
      "outcome": "Breakevens: $265 upside, $215 downside. Need a 10%+ move to profit. If TSLA hits $280, call is worth $30 = $1,500 profit.",
      "numbers": {
        "stockPrice": 240,
        "strikePrice": 250,
        "premium": 15,
        "expiration": "14 days",
        "result": "Profitable above $265 or below $215"
      }
    },
    "tips": [
      "Choose strikes based on expected move size",
      "Wider strikes = cheaper but lower probability",
      "Consider selling after IV spike, before event",
      "Use on historically volatile stocks"
    ],
    "commonMistakes": [
      "Strikes too far OTM (low probability)",
      "Not accounting for IV crush",
      "Holding through events and getting crushed",
      "Using on low-volatility stocks"
    ],
    "relatedStrategies": [
      "monkey-straddle",
      "badger-iron-condor"
    ]
  },
  {
    "id": "monkey-long-strangle",
    "name": "Long Strangle",
    "animalId": "monkey",
    "difficulty": 3,
    "description": "Cheaper volatility play - catch big swings with wider strikes.",
    "overview": "Krzysztof's Long Strangle is for when you KNOW a big swing is coming but want to risk less capital than a straddle. Buy OTM call and OTM put. The stock needs to move further to profit, but you pay less upfront.\n\nOOH OOH! This is perfect for earnings or catalysts where you expect fireworks!",
    "keyPoints": [
      "Buy OTM call above current price",
      "Buy OTM put below current price",
      "Cheaper than straddle",
      "Need bigger move to profit",
      "Both options can lose value if no move"
    ],
    "riskProfile": "High risk - can lose entire premium if stock stays range-bound.",
    "maxProfit": "Unlimited to upside (call), substantial to downside (put)",
    "maxLoss": "Total premium paid",
    "breakeven": "Call strike + total premium OR Put strike - total premium",
    "bestFor": "Earnings plays. Catalyst-driven moves. When you expect volatility but want less capital at risk.",
    "avoidWhen": "IV is already extremely high or you expect only modest movement.",
    "example": {
      "scenario": "Tech stock at $200. Earnings tomorrow. You expect BIG move but unsure which way.",
      "setup": "Buy $210 call for $5, buy $190 put for $5. Total: $10.",
      "outcome": "Need stock above $220 or below $180 to profit. If stock hits $240, call worth $30, profit: $2,000. If hits $170, put worth $20, profit: $1,000.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 210,
        "premium": 10,
        "expiration": "7 days",
        "result": "Need 10%+ move to profit, risk $1,000"
      }
    },
    "tips": [
      "Choose strikes based on expected move size",
      "Consider closing one side early if direction becomes clear",
      "Watch IV - don't overpay before the event",
      "Calculate breakevens before entering - be realistic"
    ],
    "commonMistakes": [
      "Strikes too wide - unrealistic move needed",
      "Buying when IV is already peaked",
      "Holding both sides through event (pick one!)",
      "Not understanding IV crush impact"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "monkey-strap"
    ]
  },
  {
    "id": "monkey-strap",
    "name": "Strap",
    "animalId": "monkey",
    "difficulty": 4,
    "description": "Bullish volatility bet - 2 calls, 1 put for asymmetric upside.",
    "overview": "Krzysztof's Strap is for when you're BULLISH but want protection. Buy 2 ATM calls and 1 ATM put. You profit from moves either way, but make TWICE as much if it swings up!\n\nThis is the ultimate swing trader setup - positioned for the moonshot with downside coverage!",
    "keyPoints": [
      "Buy 2 ATM calls",
      "Buy 1 ATM put at same strike",
      "More expensive than straddle",
      "Double profit potential on upside",
      "Still protected on downside"
    ],
    "riskProfile": "High risk - higher premium than straddle, can lose it all if no move.",
    "maxProfit": "Unlimited to upside (2 calls), substantial to downside (1 put)",
    "maxLoss": "Total premium paid (2 calls + 1 put)",
    "breakeven": "Strike + (total premium / 2) on upside, Strike - total premium on downside",
    "bestFor": "Bullish earnings plays. Breakout setups with protection. Swing trading catalysts.",
    "avoidWhen": "No directional bias or can't afford the higher premium.",
    "example": {
      "scenario": "Stock at $150. Bullish into earnings but want downside hedge. Expecting MOVE!",
      "setup": "Buy 2 $150 calls for $9 each, buy 1 $150 put for $8. Total: $26.",
      "outcome": "If stock hits $200, 2 calls worth $50 each = $100. Profit: $100 - $26 = $74 × 100 = $7,400! If drops to $100, put worth $50, profit: $2,400.",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 150,
        "premium": 26,
        "expiration": "14 days",
        "result": "2x upside leverage, protected downside"
      }
    },
    "tips": [
      "Use when you have bullish conviction + expect volatility",
      "Calculate both breakevens - know your profit zones",
      "Consider taking profits early on the winning side",
      "Size smaller than normal straddles (higher cost)"
    ],
    "commonMistakes": [
      "Not having genuine bullish bias (use straddle instead)",
      "Paying too much in elevated IV",
      "Holding too long without taking profits",
      "Not understanding the higher breakeven on downside"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "monkey-long-strangle"
    ]
  },
  {
    "id": "monkey-bull-call-spread",
    "name": "Bull Call Spread",
    "animalId": "monkey",
    "difficulty": 2,
    "description": "Defined-risk bullish play - cheaper than long calls with capped upside.",
    "overview": "Marcus's bull call spread is for when you're bullish but want to reduce the cost. Buy a call, sell a higher call. The sale reduces your premium, but caps your upside. It's still leveraged, still aggressive, but with a safety net.\n\nPerfect for swing trades where you know your target price!",
    "keyPoints": [
      "Buy 1 lower strike call",
      "Sell 1 higher strike call",
      "Reduces cost vs long call alone",
      "Caps max profit at short strike",
      "Defined risk, defined reward"
    ],
    "riskProfile": "Moderate risk - max loss is net debit paid.",
    "maxProfit": "Higher strike - lower strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Lower strike + net debit",
    "bestFor": "Bullish plays with a target price. Reducing cost of long calls.",
    "avoidWhen": "You expect unlimited upside or don't have a target.",
    "example": {
      "scenario": "Stock at $100. You think it goes to $110 but not much higher.",
      "setup": "Buy $100 call for $6, sell $110 call for $2. Net: $4 debit.",
      "outcome": "Max profit at $110+: ($110 - $100) - $4 = $600. Max loss: $400. Breakeven: $104.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 4,
        "expiration": "30 days",
        "result": "$600 max profit at $110, $400 max loss"
      }
    },
    "tips": [
      "Use when you have a price target in mind",
      "Sell the call at your target price",
      "Close at 50-75% max profit",
      "Size bigger than long calls (less capital)"
    ],
    "commonMistakes": [
      "Selling short call too close (limiting profit)",
      "Not taking profits at target",
      "Using when expecting huge moves",
      "Holding to expiration unnecessarily"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "monkey-debit-spread"
    ]
  },
  {
    "id": "monkey-long-synthetic-future",
    "name": "Long Synthetic Future",
    "animalId": "monkey",
    "difficulty": 3,
    "description": "Pure bullish delta with options - moves like stock without owning it.",
    "overview": "Marcus's synthetic future is FULL exposure without tying up capital for shares. Buy a call, sell a put at the same strike. You get delta 1.0 - it moves exactly like owning 100 shares - but with way less cash.\n\nThis is for when you're BULLISH and want maximum leverage. All gas, no brakes!",
    "keyPoints": [
      "Buy 1 ATM call",
      "Sell 1 ATM put at same strike",
      "Creates delta 1.0 position",
      "Moves like owning stock",
      "Less capital than buying shares"
    ],
    "riskProfile": "High risk - equivalent to owning stock, full upside and downside.",
    "maxProfit": "Unlimited (same as stock)",
    "maxLoss": "Strike price - net credit (if stock goes to $0)",
    "breakeven": "Strike price - net credit/debit",
    "bestFor": "Maximum bullish exposure. Leveraged plays. Trading like futures.",
    "avoidWhen": "Can't handle full downside or want defined risk.",
    "example": {
      "scenario": "Stock at $200. You want FULL bullish exposure but don't want to drop $20k.",
      "setup": "Buy $200 call for $12, sell $200 put for $11. Net: $1 debit.",
      "outcome": "If stock hits $250, profit $50 - $1 = $4,900. If drops to $150, lose $50 + $1 = -$5,100. Moves dollar-for-dollar with stock.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 1,
        "expiration": "45 days",
        "result": "Delta 1.0 - full stock exposure with options"
      }
    },
    "tips": [
      "Use ATM strikes for true 1.0 delta",
      "Monitor margin requirements",
      "This is NOT hedged - full risk",
      "Exit if thesis changes"
    ],
    "commonMistakes": [
      "Thinking this reduces risk (it doesn't)",
      "Not having margin for short put assignment",
      "Forgetting early assignment risk",
      "Using without strong conviction"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "cheetah-long-synthetic-future"
    ]
  },
  {
    "id": "octopus-naked-put",
    "name": "Naked Put (Cash-Secured Alternative)",
    "animalId": "octopus",
    "difficulty": 3,
    "description": "Aggressive premium collection with significant downside risk.",
    "overview": "The Naked Put is Oscar's high-stakes income strategy. Unlike the cash-secured put, you may not have the full cash to buy shares. You're using margin and leverage, which amplifies both gains and losses.\n\nThis strategy can generate significant income, but a market crash can devastate your account. Oscar manages this risk across multiple positions with his eight arms.",
    "keyPoints": [
      "Sell puts without necessarily having cash to cover",
      "Collect premium upfront",
      "If assigned, you buy stock on margin",
      "Higher leverage = higher risk AND higher return on capital",
      "A significant drop can result in massive losses"
    ],
    "riskProfile": "VERY HIGH risk - losses can exceed your account if the stock crashes.",
    "maxProfit": "Premium received",
    "maxLoss": "(Strike price - $0) × 100 minus premium = theoretically huge",
    "breakeven": "Strike price - premium received",
    "bestFor": "Experienced traders comfortable with margin. High-probability income strategies.",
    "avoidWhen": "You can't afford the risk, you're a beginner, or market conditions are unstable.",
    "example": {
      "scenario": "SPY is at $520 and you want aggressive premium income.",
      "setup": "Sell 1 SPY $500 put for $4.00 without full cash coverage.",
      "outcome": "You collect $400. If SPY stays above $500, you keep it. If SPY crashes to $450, you're assigned at $500 and immediately down $5,000 minus premium.",
      "numbers": {
        "stockPrice": 520,
        "strikePrice": 500,
        "premium": 4,
        "expiration": "30 days",
        "result": "$400 income, potential $46,000+ loss in worst case"
      }
    },
    "tips": [
      "Only use on quality underlying you'd want to own",
      "Keep position sizes small relative to account",
      "Always have a mental stop-loss point",
      "Consider using spreads instead for defined risk"
    ],
    "commonMistakes": [
      "Oversizing positions",
      "Ignoring tail risk (market crashes happen)",
      "Selling puts on meme stocks or low-quality companies",
      "Not having a plan for assignment"
    ],
    "relatedStrategies": [
      "sloth-cash-secured-put",
      "octopus-ratio-spread"
    ]
  },
  {
    "id": "octopus-leveraged-ratio",
    "name": "Leveraged Ratio Spread",
    "animalId": "octopus",
    "difficulty": 4,
    "description": "Leveraged spreads with unbalanced long and short positions.",
    "overview": "The Leveraged Ratio Spread is Oscar's precision tool. You buy one option and sell multiple options at a different strike. This creates leverage within the spread, often for reduced cost or even a credit.\n\nThe danger? If the stock moves too far, your extra short options can cause unlimited losses. Oscar's eight arms are ready to adjust.",
    "keyPoints": [
      "Buy 1 option, sell 2 (or more) at a different strike",
      "Often entered for a credit or reduced debit",
      "Profit zone is between the strikes",
      "Risk is unlimited beyond the short strikes",
      "Requires active management"
    ],
    "riskProfile": "VERY HIGH risk - unlimited loss potential beyond short strikes.",
    "maxProfit": "Depends on structure - often at the short strike",
    "maxLoss": "Unlimited beyond the short strikes",
    "breakeven": "Complex - multiple breakeven points",
    "bestFor": "Experienced traders with specific price targets. Reducing cost of long options.",
    "avoidWhen": "You expect a very large move in either direction, or you're not experienced.",
    "example": {
      "scenario": "You think AAPL at $180 will rise to $190 but not beyond.",
      "setup": "Buy 1 AAPL $180 call for $5.00, sell 2 AAPL $190 calls for $2.50 each. Net cost: $0 (zero cost spread).",
      "outcome": "Max profit at $190: $1,000. Above $200, you start losing. At $210, you've lost $1,000. Unlimited loss above that.",
      "numbers": {
        "stockPrice": 180,
        "strikePrice": 190,
        "premium": 0,
        "expiration": "30 days",
        "result": "$1,000 max profit at $190, unlimited risk above $200"
      }
    },
    "tips": [
      "Always know your breakeven points",
      "Have a strict stop-loss plan",
      "Use only when you have high conviction on a price target",
      "Consider closing one short if the stock approaches"
    ],
    "commonMistakes": [
      "Not understanding the risk profile",
      "Holding when stock breaks through the short strikes",
      "Using without a clear price target",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "octopus-butterfly-precision",
      "monkey-debit-spread"
    ]
  },
  {
    "id": "octopus-leaps",
    "name": "LEAPS (Long-Term Options)",
    "animalId": "octopus",
    "difficulty": 2,
    "description": "Long-term leveraged positions for big conviction plays.",
    "overview": "LEAPS (Long-term Equity Anticipation Securities) are Oscar's way of making long-term leveraged bets. These are options with expirations 1-3 years out. They cost more but give you time for your thesis to play out.\n\nThis is aggressive because you're still using leverage, but the extended time frame makes it more forgiving than short-term options.",
    "keyPoints": [
      "Options expiring 1-3 years in the future",
      "Higher premium but more time for thesis to work",
      "Less time decay pressure than short-term options",
      "Deep ITM LEAPS can act like stock with less capital",
      "Still leveraged - you can lose the entire premium"
    ],
    "riskProfile": "High risk - 100% of premium is at risk, but time is on your side.",
    "maxProfit": "Unlimited for calls (stock appreciation)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike + premium for calls, Strike - premium for puts",
    "bestFor": "Long-term high-conviction plays. Stock replacement strategy. Leveraged investing.",
    "avoidWhen": "You need short-term results, or you're unsure about the long-term thesis.",
    "example": {
      "scenario": "You believe GOOGL (at $170) will be $250+ in 2 years.",
      "setup": "Buy 1 GOOGL $150 LEAP call expiring in 2 years for $45.00.",
      "outcome": "If GOOGL hits $250, your call is worth $100. Profit: $5,500 (122% return). You controlled $17,000 worth of stock for $4,500.",
      "numbers": {
        "stockPrice": 170,
        "strikePrice": 150,
        "premium": 45,
        "expiration": "2 years",
        "result": "$5,500 profit at $250, $4,500 max loss"
      }
    },
    "tips": [
      "Buy ITM for higher delta and stock-like behavior",
      "Consider the cost of capital over 2 years",
      "LEAPS work well for stocks with strong growth narratives",
      "Can sell shorter-term calls against LEAPS (poor man's covered call)"
    ],
    "commonMistakes": [
      "Buying OTM LEAPS (low probability despite long time)",
      "Not accounting for opportunity cost of capital",
      "Panicking and selling during temporary dips",
      "Overconcentrating in single positions"
    ],
    "relatedStrategies": [
      "monkey-long-call",
      "octopus-leveraged-ratio"
    ]
  },
  {
    "id": "octopus-butterfly-precision",
    "name": "Butterfly Spread",
    "animalId": "octopus",
    "difficulty": 4,
    "description": "Precision strike for a specific price target with limited risk.",
    "overview": "The Butterfly Spread is Oscar's surgical strike. You profit most when the stock lands exactly at your middle strike. It's a low-cost, high-reward play for when you have a very specific price target.\n\nThree strikes, four contracts, one target. The risk is limited to the debit paid, but the probability of max profit is low.",
    "keyPoints": [
      "Buy 1 lower strike, sell 2 middle strikes, buy 1 higher strike",
      "All same expiration, equal distance between strikes",
      "Max profit when stock is exactly at middle strike at expiration",
      "Low cost, high potential reward",
      "Limited risk to debit paid"
    ],
    "riskProfile": "Moderate risk - limited to debit paid, but low probability of max profit.",
    "maxProfit": "(Width of wings - debit paid) × 100",
    "maxLoss": "Net debit paid",
    "breakeven": "Lower strike + debit and Upper strike - debit",
    "bestFor": "Specific price targets. Low-cost speculation. Earnings pin plays.",
    "avoidWhen": "You expect a big move or have no price target.",
    "example": {
      "scenario": "You think TSLA will pin around $250 for monthly expiration.",
      "setup": "Buy 1 $240 call, sell 2 $250 calls, buy 1 $260 call. Net debit: $1.50.",
      "outcome": "Max profit at exactly $250: $850 ($1,000 - $150). Breakevens: $241.50 and $258.50.",
      "numbers": {
        "stockPrice": 248,
        "strikePrice": 250,
        "premium": 1.5,
        "expiration": "14 days",
        "result": "$850 max profit at $250, $150 max loss"
      }
    },
    "tips": [
      "Use for stocks that tend to pin at round numbers",
      "Consider wider wings for more forgiving profit range",
      "Can be adjusted as expiration approaches",
      "Check open interest at the middle strike"
    ],
    "commonMistakes": [
      "Expecting the stock to land exactly at your strike",
      "Holding to expiration (management needed)",
      "Using when you expect volatility",
      "Paying too much for the spread"
    ],
    "relatedStrategies": [
      "badger-iron-condor",
      "octopus-leveraged-ratio"
    ]
  },
  {
    "id": "octopus-naked-call",
    "name": "Naked Call (Educational Only)",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "The most dangerous options strategy - selling calls without owning stock.",
    "overview": "WARNING — EXTREME DANGER: This strategy is presented for EDUCATIONAL PURPOSES ONLY.\n\nThe Naked Call is selling a call option without owning the underlying stock. If the stock rockets up, your losses are theoretically UNLIMITED. This has blown up entire accounts and even firms.\n\nOscar includes this so you understand it, not so you use it. Even with eight arms, he rarely touches this one.",
    "keyPoints": [
      "WARNING: UNLIMITED LOSS POTENTIAL",
      "Sell a call without owning the underlying shares",
      "If assigned, you must buy shares at market price and sell at strike",
      "A stock squeeze or gap up can be catastrophic",
      "Margin requirements are significant"
    ],
    "riskProfile": "EXTREME risk - losses are theoretically unlimited.",
    "maxProfit": "Premium received",
    "maxLoss": "UNLIMITED - stock can rise infinitely",
    "breakeven": "Strike price + premium received",
    "bestFor": "NOTHING - this is presented for education only.",
    "avoidWhen": "ALWAYS - unless you are a professional with risk management systems.",
    "example": {
      "scenario": "EDUCATIONAL EXAMPLE ONLY - A trader sells a naked call.",
      "setup": "Sell 1 GME $30 call for $2.00 when GME is at $25. Collect $200.",
      "outcome": "GME squeezes to $400. Trader is assigned, must buy at $400 and sell at $30. Loss: $370 per share = $37,000, minus $200 premium collected = $36,800 total loss on a $200 premium received.",
      "numbers": {
        "stockPrice": 25,
        "strikePrice": 30,
        "premium": 2,
        "expiration": "30 days",
        "result": "$200 max profit, UNLIMITED loss (actual example: $36,800 loss)"
      }
    },
    "tips": [
      "WARNING: DO NOT USE THIS STRATEGY",
      "If you must understand it, know that professionals use strict risk limits",
      "Always have a stop-loss in place",
      "Consider defined-risk alternatives like bear call spreads"
    ],
    "commonMistakes": [
      "Using this strategy at all without professional-level risk management",
      "Thinking \"it won't happen to me\"",
      "Holding through squeezes hoping it reverses",
      "Not having enough margin/capital to cover"
    ],
    "relatedStrategies": [
      "sloth-covered-call",
      "badger-bear-call-spread"
    ]
  },
  {
    "id": "turtle-covered-call",
    "name": "Covered Call",
    "animalId": "turtle",
    "difficulty": 1,
    "description": "Generate steady income by selling calls on stocks you own and plan to hold forever.",
    "overview": "Terry's signature move - the Covered Call is the foundation of conservative options income. You own quality stocks, and you rent out the upside to generate cash flow. It's patient, it's steady, and it lets you sleep at night.\n\nThink of it like owning a rental property and collecting rent. The stock is your property, and the premium is your rent check.",
    "keyPoints": [
      "Own at least 100 shares of a quality stock you believe in long-term",
      "Sell call options at strikes above the current price",
      "Collect premium immediately as income",
      "If called away, you sell at a profit - not a bad outcome",
      "Rinse and repeat month after month for steady income"
    ],
    "riskProfile": "Very low risk - you already own the stock. The \"risk\" is missing out on big rallies.",
    "maxProfit": "Strike price - purchase price + premium (capped but predictable)",
    "maxLoss": "Stock going to zero minus premium collected (same as owning stock)",
    "breakeven": "Stock purchase price - total premiums collected over time",
    "bestFor": "Long-term investors who want income from their holdings. Blue-chip stocks you never want to sell.",
    "avoidWhen": "You expect a massive rally and want full upside exposure.",
    "example": {
      "scenario": "You own 100 shares of Johnson & Johnson (JNJ) at $155 for the long haul.",
      "setup": "Sell 1 JNJ $165 call expiring in 45 days for $2.00.",
      "outcome": "Collect $200 immediately. If JNJ stays below $165, keep shares and premium. If above $165, sell at $165 + keep $200 = nice profit either way.",
      "numbers": {
        "stockPrice": 155,
        "strikePrice": 165,
        "premium": 2,
        "expiration": "45 days",
        "result": "$200 income, $1,200 max profit if called away"
      }
    },
    "tips": [
      "Use on stocks you'd be happy owning for 10+ years",
      "Sell 30-45 days out for optimal theta decay",
      "Choose strikes 5-10% above current price",
      "Be consistent - this is a marathon, not a sprint"
    ],
    "commonMistakes": [
      "Using covered calls on volatile growth stocks",
      "Setting strikes too close and getting called away constantly",
      "Not having a plan for when the stock drops",
      "Overthinking strike selection - keep it simple"
    ],
    "relatedStrategies": [
      "turtle-protective-put",
      "turtle-collar"
    ]
  },
  {
    "id": "turtle-protective-put",
    "name": "Protective Put",
    "animalId": "turtle",
    "difficulty": 2,
    "description": "Buy insurance for your long-term holdings to protect against market crashes.",
    "overview": "Terry always has insurance. The Protective Put is your portfolio's seatbelt - you hope you never need it, but you're grateful it's there when trouble hits.\n\nYou buy put options on stocks you own, creating a floor on your losses. No matter how far the market falls, you can sell at your strike price.",
    "keyPoints": [
      "Own stock and buy puts on the same stock",
      "The put guarantees you can sell at the strike price",
      "Your maximum loss is capped and known",
      "You keep all upside potential minus the put cost",
      "Peace of mind has a price - and it's worth it"
    ],
    "riskProfile": "Very low risk - your downside is strictly limited.",
    "maxProfit": "Unlimited upside minus cost of put",
    "maxLoss": "Stock price - put strike + premium paid",
    "breakeven": "Stock price + premium paid",
    "bestFor": "Protecting large gains. Sleeping well before uncertain events. Long-term peace of mind.",
    "avoidWhen": "Premium is too expensive relative to the protection needed.",
    "example": {
      "scenario": "You own Microsoft (MSFT) at $350 with big gains. Worried about a pullback.",
      "setup": "Buy 1 MSFT $320 put expiring in 90 days for $8.00.",
      "outcome": "Pay $800 for insurance. If MSFT crashes to $250, you can still sell at $320. Max loss capped at $38/share instead of $100+.",
      "numbers": {
        "stockPrice": 350,
        "strikePrice": 320,
        "premium": 8,
        "expiration": "90 days",
        "result": "Max loss $38/share, unlimited upside minus $8"
      }
    },
    "tips": [
      "Buy puts 2-3 months out for better value",
      "Use when you have significant unrealized gains",
      "Consider the cost as insurance premium",
      "Combine with covered calls (collar) to reduce cost"
    ],
    "commonMistakes": [
      "Buying protection after the stock has already dropped",
      "Overpaying for protection you don't need",
      "Letting puts expire and constantly rebuying (expensive habit)",
      "Not considering a collar to offset cost"
    ],
    "relatedStrategies": [
      "turtle-covered-call",
      "turtle-collar"
    ]
  },
  {
    "id": "turtle-collar",
    "name": "Collar",
    "animalId": "turtle",
    "difficulty": 2,
    "description": "Zero-cost protection by combining covered calls and protective puts.",
    "overview": "The Collar is Terry's masterpiece - free insurance. You buy a protective put and pay for it by selling a covered call. The result? Limited downside AND limited upside, often at zero net cost.\n\nIt's the ultimate \"sleep well at night\" strategy for protecting gains while staying invested.",
    "keyPoints": [
      "Own 100 shares of stock",
      "Buy an out-of-the-money put (protection)",
      "Sell an out-of-the-money call (pays for the put)",
      "Net cost is often zero or very small",
      "You lock in a range of outcomes - no surprises"
    ],
    "riskProfile": "Minimal risk - both sides are capped.",
    "maxProfit": "Call strike - current price (plus any net credit)",
    "maxLoss": "Current price - put strike (plus any net debit)",
    "breakeven": "Current stock price adjusted for net premium",
    "bestFor": "Locking in gains. Holding through uncertainty. Peace of mind.",
    "avoidWhen": "You want unlimited upside potential.",
    "example": {
      "scenario": "You bought Apple (AAPL) at $120, now $180. Want to protect gains.",
      "setup": "Buy $170 put for $5, sell $190 call for $5. Net cost: $0.",
      "outcome": "You're guaranteed to sell between $170-$190. Minimum profit: $50/share. Maximum profit: $70/share. Free insurance.",
      "numbers": {
        "stockPrice": 180,
        "strikePrice": 170,
        "premium": 0,
        "expiration": "60 days",
        "result": "Locked in $50-$70 profit per share at zero cost"
      }
    },
    "tips": [
      "Structure for zero cost by matching premiums",
      "Use wider strikes for more room to move",
      "Great before earnings or uncertain events",
      "Can be rolled as time passes"
    ],
    "commonMistakes": [
      "Making the collar too tight",
      "Forgetting about dividend dates",
      "Over-collaring your entire portfolio",
      "Not understanding you're trading upside for protection"
    ],
    "relatedStrategies": [
      "turtle-covered-call",
      "turtle-protective-put"
    ]
  },
  {
    "id": "turtle-cash-secured-put",
    "name": "Cash-Secured Put",
    "animalId": "turtle",
    "difficulty": 1,
    "description": "Get paid to wait for stocks you want to buy at a discount.",
    "overview": "Terry loves this strategy - it's like getting paid to be patient. You sell put options on quality stocks you'd be happy to own, agreeing to buy them at a lower price. Either you keep the premium or you buy shares at a discount. Win-win.\n\nThis is patient capital deployment at its finest. No rushing, no chasing - just waiting for the right price while getting paid to wait.",
    "keyPoints": [
      "Have cash ready to buy 100 shares at the strike price",
      "Sell puts on stocks you genuinely want to own",
      "Collect premium immediately - it's yours to keep",
      "If assigned, you buy at strike minus premium (discount!)",
      "Repeat the process month after month"
    ],
    "riskProfile": "Low risk - you're buying stocks you want at prices you choose.",
    "maxProfit": "Premium received (if stock stays above strike)",
    "maxLoss": "Strike price - premium (if stock goes to $0)",
    "breakeven": "Strike price - premium received",
    "bestFor": "Building positions in quality companies. Generating income while waiting for pullbacks.",
    "avoidWhen": "You don't actually want to own the stock or can't afford assignment.",
    "example": {
      "scenario": "You want to own Coca-Cola (KO) but think $65 is too high. You'd happily buy at $60.",
      "setup": "Sell 1 KO $60 put expiring in 45 days for $1.50 premium.",
      "outcome": "Collect $150 immediately. If KO stays above $60, keep $150. If KO drops to $60, buy 100 shares at effective price of $58.50 ($60 - $1.50).",
      "numbers": {
        "stockPrice": 65,
        "strikePrice": 60,
        "premium": 1.5,
        "expiration": "45 days",
        "result": "$150 income or shares at $58.50 cost basis"
      }
    },
    "tips": [
      "Only use on blue-chip stocks you'd hold forever",
      "Keep adequate cash reserves - don't overcommit",
      "Choose strikes at true support levels",
      "Sell after pullbacks when premiums are elevated"
    ],
    "commonMistakes": [
      "Selling puts on stocks you don't want to own",
      "Not having cash to cover assignment",
      "Chasing premium on risky stocks",
      "Selling too many puts relative to portfolio size"
    ],
    "relatedStrategies": [
      "turtle-covered-call",
      "turtle-collar"
    ]
  },
  {
    "id": "owl-iron-condor",
    "name": "Iron Condor",
    "animalId": "owl",
    "difficulty": 3,
    "description": "A probability-based strategy that profits when stocks stay within a calculated range.",
    "overview": "Oliver loves the Iron Condor because it's pure probability math. You sell both a put spread below the stock and a call spread above it. You profit when the stock stays in your predicted range.\n\nThis is data-driven trading - you calculate the probabilities, set your strikes, and let statistics work in your favor.",
    "keyPoints": [
      "Sell a put spread below current price (bull put spread)",
      "Sell a call spread above current price (bear call spread)",
      "Collect premium from both sides",
      "Profit when stock stays between short strikes",
      "Risk is defined and calculated before entry"
    ],
    "riskProfile": "Moderate risk - defined on both sides, probability-based.",
    "maxProfit": "Total credit received from both spreads",
    "maxLoss": "Width of wider spread minus total credit",
    "breakeven": "Short put - credit (lower) and Short call + credit (upper)",
    "bestFor": "High IV environments. Range-bound markets. Probability-focused traders.",
    "avoidWhen": "You expect a significant directional move.",
    "example": {
      "scenario": "SPY at $500. Your analysis shows 80% chance it stays between $480-$520.",
      "setup": "Sell $485/$480 put spread and $515/$520 call spread. Total credit: $1.80.",
      "outcome": "Max profit: $180 if SPY stays between $485-$515. Max loss: $320 on either wing. 80% probability of profit.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 485,
        "premium": 1.8,
        "expiration": "30 days",
        "result": "$180 max profit, $320 max loss, ~80% win rate"
      }
    },
    "tips": [
      "Choose strikes with 15-20 delta for ~70% probability",
      "Manage at 50% profit to improve win rate",
      "Use in high IV - more premium to collect",
      "Track your actual vs. theoretical win rate"
    ],
    "commonMistakes": [
      "Ignoring IV rank when entering",
      "Not managing positions early",
      "Letting one side go deep ITM without adjusting",
      "Trading too large for account size"
    ],
    "relatedStrategies": [
      "owl-iron-butterfly",
      "owl-diagonal-spread"
    ]
  },
  {
    "id": "owl-iron-butterfly",
    "name": "Iron Butterfly",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Maximum premium collection for a precise price target prediction.",
    "overview": "The Iron Butterfly is Oliver's precision instrument. It's like an iron condor but with the short strikes at the same price. You collect maximum premium but need the stock to land very close to your target.\n\nThis is for when your analysis gives you high confidence in a specific price point.",
    "keyPoints": [
      "Sell both a call and put at the same strike (ATM)",
      "Buy protective wings on both sides",
      "Maximum premium collection at the center strike",
      "Profit zone is narrower than iron condor",
      "Higher reward but lower probability"
    ],
    "riskProfile": "Moderate risk - defined but narrower profit zone.",
    "maxProfit": "Total credit received",
    "maxLoss": "Width of wing minus credit received",
    "breakeven": "Middle strike +/- credit received",
    "bestFor": "Pinning plays. High IV with precise price targets. Monthly OpEx.",
    "avoidWhen": "You expect any significant movement.",
    "example": {
      "scenario": "QQQ at $440. You expect it to pin at $440 for OpEx.",
      "setup": "Sell $440 straddle, buy $430 put and $450 call. Credit: $6.00.",
      "outcome": "Max profit: $600 if QQQ expires at exactly $440. Max loss: $400. Breakevens: $434-$446.",
      "numbers": {
        "stockPrice": 440,
        "strikePrice": 440,
        "premium": 6,
        "expiration": "14 days",
        "result": "$600 max profit at $440, $400 max loss"
      }
    },
    "tips": [
      "Use on indexes that tend to pin at round numbers",
      "Enter 2-3 weeks before expiration",
      "Manage early - don't wait for max profit",
      "Consider adjusting to condor if stock moves"
    ],
    "commonMistakes": [
      "Expecting the stock to land exactly at your strike",
      "Not managing and hoping for pin",
      "Using on individual stocks (too volatile)",
      "Holding through earnings or events"
    ],
    "relatedStrategies": [
      "owl-iron-condor",
      "owl-long-straddle"
    ]
  },
  {
    "id": "owl-diagonal-spread",
    "name": "Diagonal Spread",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Exploit time decay differentials while maintaining directional exposure.",
    "overview": "Oliver's diagonal spread combines his love of theta math with directional analysis. You buy a longer-dated option and sell a shorter-dated option at a different strike.\n\nThe math is elegant: the short option decays faster, generating profit, while the long option maintains your exposure.",
    "keyPoints": [
      "Buy longer-dated option (60-90 days)",
      "Sell shorter-dated option at different strike (30 days)",
      "Profits from theta differential and direction",
      "More complex Greeks to manage",
      "Flexible strategy with many adjustment options"
    ],
    "riskProfile": "Moderate risk - debit paid is at risk.",
    "maxProfit": "Depends on management and direction - can be significant",
    "maxLoss": "Net debit paid in worst case",
    "breakeven": "Complex - depends on time and IV",
    "bestFor": "Directional bias with theta advantage. Reducing cost of long options.",
    "avoidWhen": "You need immediate directional exposure.",
    "example": {
      "scenario": "Moderately bullish on AMD at $150. Want theta on your side.",
      "setup": "Buy $145 call (60 days) for $12, sell $160 call (30 days) for $4. Net: $8.",
      "outcome": "If AMD rises slowly to $160, short call expires worthless, long call gains value. Potential $500+ profit on $800 risk.",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 145,
        "premium": 8,
        "expiration": "30/60 days",
        "result": "Potential $500+ profit, $800 max risk"
      }
    },
    "tips": [
      "Match your directional thesis to strike selection",
      "Monitor IV changes - they affect both legs differently",
      "Plan to roll or close the short option",
      "Use options analysis tools to model outcomes"
    ],
    "commonMistakes": [
      "Not understanding the complex P/L curve",
      "Ignoring IV risk",
      "Letting the short option go ITM without a plan",
      "Over-complicating adjustments"
    ],
    "relatedStrategies": [
      "owl-iron-condor",
      "fox-calendar-spread"
    ]
  },
  {
    "id": "owl-long-straddle",
    "name": "Long Straddle",
    "animalId": "owl",
    "difficulty": 3,
    "description": "A volatility play based on expected vs. implied volatility analysis.",
    "overview": "Oliver uses the long straddle when his analysis shows implied volatility is underpricing expected movement. You buy both a call and put at the same strike, profiting from big moves in either direction.\n\nThis is a pure volatility bet - you're saying the market is wrong about how much the stock will move.",
    "keyPoints": [
      "Buy both a call and put at the same strike (usually ATM)",
      "Profit from large moves in either direction",
      "Compare implied move to your expected move",
      "Time decay works against you on both legs",
      "Need the move to exceed the premium paid"
    ],
    "riskProfile": "High risk - can lose entire premium if stock doesn't move enough.",
    "maxProfit": "Unlimited in either direction",
    "maxLoss": "Total premium paid",
    "breakeven": "Strike +/- total premium paid",
    "bestFor": "When your volatility analysis differs from the market. Pre-event plays.",
    "avoidWhen": "IV is already elevated or you expect range-bound action.",
    "example": {
      "scenario": "GOOGL at $175. Earnings coming. You calculate expected move > implied move.",
      "setup": "Buy $175 call for $8 and $175 put for $7. Total cost: $15.",
      "outcome": "Need GOOGL above $190 or below $160 to profit. If GOOGL hits $200, call worth $25 = $1,000 profit.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 175,
        "premium": 15,
        "expiration": "14 days",
        "result": "Profitable above $190 or below $160"
      }
    },
    "tips": [
      "Calculate breakevens before entering",
      "Compare implied move to historical moves",
      "Consider closing before the event to capture IV expansion",
      "Use sparingly - these are expensive"
    ],
    "commonMistakes": [
      "Buying when IV is already at highs",
      "Holding through IV crush",
      "Not calculating breakeven points",
      "Using on low-volatility stocks"
    ],
    "relatedStrategies": [
      "owl-iron-butterfly",
      "cheetah-long-strangle"
    ]
  },
  {
    "id": "owl-long-call-butterfly",
    "name": "Long Call Butterfly",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Precision profit zone - maximize P&L at a specific price target.",
    "overview": "The Long Call Butterfly is Oliver's precision instrument. You're betting the stock lands exactly at your target. Maximum profit at the middle strike, defined risk everywhere else.\n\nBuy 1 lower call, sell 2 middle calls, buy 1 upper call. It's a three-legged strategy that requires analytical precision.",
    "keyPoints": [
      "Buy low strike call, sell 2 middle strike calls, buy high strike call",
      "Low cost debit spread",
      "Maximum profit at middle strike",
      "Defined risk (debit paid)",
      "Narrow profit zone - requires accuracy"
    ],
    "riskProfile": "Low risk - limited to debit paid.",
    "maxProfit": "Middle strike - low strike - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Lower strike + debit, upper strike - debit",
    "bestFor": "When you have a specific price target. Range-bound stocks. Low volatility.",
    "avoidWhen": "Expecting big moves. High volatility. Uncertain direction.",
    "example": {
      "scenario": "Stock at $100, technical analysis suggests it will pin at $105.",
      "setup": "Buy $100 call, sell 2x $105 calls, buy $110 call. Debit: $1.50.",
      "outcome": "Max profit $350 at exactly $105. Max loss $150 if stock outside $101.50-$108.50.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 105,
        "premium": 1.5,
        "expiration": "30 days",
        "result": "$350 max profit at $105, $150 max loss"
      }
    },
    "tips": [
      "Use technical analysis to pick middle strike",
      "Enter 30-45 days before expiration",
      "Close early at 50-75% profit",
      "Check all strikes for liquidity"
    ],
    "commonMistakes": [
      "Expecting exact price prediction",
      "Using on volatile stocks",
      "Holding to expiration",
      "Ignoring transaction costs"
    ],
    "relatedStrategies": [
      "owl-long-put-butterfly",
      "owl-iron-butterfly"
    ]
  },
  {
    "id": "owl-long-put-butterfly",
    "name": "Long Put Butterfly",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Bearish precision play - profit from stocks pinning at a specific lower level.",
    "overview": "The Long Put Butterfly is the bearish mirror of the call butterfly. Buy 1 upper put, sell 2 middle puts, buy 1 lower put. All puts, but same precision strategy.\n\nOliver uses this when analysis suggests a stock will settle at a specific support level.",
    "keyPoints": [
      "Buy high strike put, sell 2 middle strike puts, buy low strike put",
      "Low cost debit spread",
      "Maximum profit at middle strike",
      "Defined risk (debit paid)",
      "Bearish bias with precision"
    ],
    "riskProfile": "Low risk - limited to debit paid.",
    "maxProfit": "High strike - middle strike - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Upper strike - debit, lower strike + debit",
    "bestFor": "Bearish with specific target. Technical support levels. Low vol environments.",
    "avoidWhen": "Expecting crash. High volatility. No clear target.",
    "example": {
      "scenario": "Stock at $100, chart shows strong support at $95.",
      "setup": "Buy $100 put, sell 2x $95 puts, buy $90 put. Debit: $1.25.",
      "outcome": "Max profit $375 at exactly $95. Max loss $125 outside $98.75-$91.25.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 1.25,
        "expiration": "30 days",
        "result": "$375 max profit at $95, $125 max loss"
      }
    },
    "tips": [
      "Identify strong support/resistance levels",
      "Use RSI and moving averages for targets",
      "Exit at 50-70% profit",
      "Monitor all three strikes"
    ],
    "commonMistakes": [
      "Picking arbitrary price targets",
      "Using on trending stocks",
      "Waiting for max profit",
      "Poor strike selection"
    ],
    "relatedStrategies": [
      "owl-long-call-butterfly",
      "owl-iron-butterfly"
    ]
  },
  {
    "id": "owl-long-call-condor",
    "name": "Long Call Condor",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Wide-range precision - profit from stocks staying within a broader zone.",
    "overview": "The Long Call Condor is Oliver's wide-zone butterfly. Instead of targeting one price, you profit from a range. Buy low call, sell middle-low call, sell middle-high call, buy high call.\n\nIt's less precise than a butterfly but gives you more room to be right. Scholarly balance.",
    "keyPoints": [
      "Buy low call, sell lower-mid call, sell upper-mid call, buy high call",
      "Wider profit zone than butterfly",
      "Lower premium collection but more forgiveness",
      "All calls for directional bias",
      "Defined risk and reward"
    ],
    "riskProfile": "Very low risk - small debit.",
    "maxProfit": "Width of middle spread - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Lower middle strike + debit, upper middle strike - debit",
    "bestFor": "Range-bound stocks. Low volatility. Broader price targets.",
    "avoidWhen": "Expecting breakout. High volatility. Narrow ranges.",
    "example": {
      "scenario": "Stock at $100 expected to trade between $95-$105.",
      "setup": "Buy $90 call, sell $95 call, sell $105 call, buy $110 call. Debit: $1.",
      "outcome": "Max profit $400 if stock between $95-$105. Max loss $100 outside.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 1,
        "expiration": "45 days",
        "result": "$400 max profit, $100 max loss"
      }
    },
    "tips": [
      "Give yourself wide breakevens",
      "Use on stable underlyings",
      "Close at 50% profit",
      "Check liquidity on all 4 strikes"
    ],
    "commonMistakes": [
      "Making wings too narrow",
      "Using on volatile stocks",
      "Holding for max profit",
      "Ignoring bid-ask spreads"
    ],
    "relatedStrategies": [
      "owl-long-put-condor",
      "owl-iron-condor"
    ]
  },
  {
    "id": "owl-long-put-condor",
    "name": "Long Put Condor",
    "animalId": "owl",
    "difficulty": 4,
    "description": "Bearish wide-zone play - profit from stocks staying in a defined range.",
    "overview": "The Long Put Condor is the put version of the call condor. Buy high put, sell upper-mid put, sell lower-mid put, buy low put. Same wide-zone strategy, put construction.\n\nOliver uses this when analysis suggests range-bound behavior with slight bearish tilt.",
    "keyPoints": [
      "Buy high put, sell upper-mid put, sell lower-mid put, buy low put",
      "Wider profit zone than put butterfly",
      "Lower risk, broader range",
      "All puts for bearish lean",
      "Defined max profit and loss"
    ],
    "riskProfile": "Very low risk - small debit.",
    "maxProfit": "Width of middle spread - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Upper middle strike - debit, lower middle strike + debit",
    "bestFor": "Bearish-neutral outlook. Range-bound expectations. Low volatility.",
    "avoidWhen": "Strong trends. High volatility. Narrow expected ranges.",
    "example": {
      "scenario": "Index at $500 expected between $490-$510.",
      "setup": "Buy $520 put, sell $510 put, sell $490 put, buy $480 put. Debit: $1.50.",
      "outcome": "Max profit $850 if index between $490-$510. Max loss $150.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 1.5,
        "expiration": "45 days",
        "result": "$850 max profit, $150 max loss"
      }
    },
    "tips": [
      "Use on stable indexes",
      "Set realistic profit targets",
      "Monitor position daily",
      "Exit early if profitable"
    ],
    "commonMistakes": [
      "Too narrow profit zone",
      "Using on individual stocks",
      "Waiting for expiration",
      "Poor liquidity on outer strikes"
    ],
    "relatedStrategies": [
      "owl-long-call-condor",
      "owl-iron-condor"
    ]
  },
  {
    "id": "owl-double-diagonal",
    "name": "Double Diagonal Spread",
    "animalId": "owl",
    "difficulty": 5,
    "description": "Advanced time decay strategy - profit from theta on both sides with directional flexibility.",
    "overview": "The Double Diagonal is Oliver's most sophisticated play. It's an iron condor with time spreads built in. Sell near-term calls and puts, buy far-term calls and puts at different strikes.\n\nYou profit from theta decay on the short options while maintaining directional protection. Requires constant analysis and adjustment.",
    "keyPoints": [
      "Sell near-term OTM call and put",
      "Buy far-term call and put at wider strikes",
      "Profit from time decay differential",
      "Can adjust by rolling short options",
      "Complex to manage - not for beginners"
    ],
    "riskProfile": "Moderate risk - defined but requires active management.",
    "maxProfit": "Net credit from short options minus long option cost",
    "maxLoss": "Varies - depends on strikes and time",
    "breakeven": "Complex - changes daily with time decay",
    "bestFor": "Skilled traders. Range-bound markets. High IV environments.",
    "avoidWhen": "Beginners. Trending markets. Low volatility. Can't actively manage.",
    "example": {
      "scenario": "Stock at $100 expected to stay range-bound for a month.",
      "setup": "Sell $105 call 30 DTE, sell $95 put 30 DTE. Buy $110 call 60 DTE, buy $90 put 60 DTE. Net credit: $3.",
      "outcome": "If stock stays between $95-$105, short options decay faster. Roll shorts monthly. Can collect $3+ multiple times.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 3,
        "expiration": "30 days short, 60 days long",
        "result": "$300+ per cycle, adjustable position"
      }
    },
    "tips": [
      "Roll short options every 2-3 weeks",
      "Adjust if stock approaches strikes",
      "Track P&L daily",
      "Close if directional move threatens"
    ],
    "commonMistakes": [
      "Set-and-forget mentality",
      "Not understanding time decay dynamics",
      "Poor strike selection",
      "Ignoring adjustment opportunities"
    ],
    "relatedStrategies": [
      "owl-iron-condor",
      "owl-diagonal-spread"
    ]
  },
  {
    "id": "cheetah-long-call",
    "name": "Long Call",
    "animalId": "cheetah",
    "difficulty": 1,
    "description": "Fast, leveraged bullish exposure for momentum plays.",
    "overview": "Chase doesn't wait around. The long call gives you instant leveraged exposure to upside moves. You pay the premium, and if the stock rips, your profits multiply. Speed and timing are everything.\n\nThis is the go-to for catching breakouts and momentum moves.",
    "keyPoints": [
      "Buy a call option for leveraged bullish exposure",
      "Pay premium upfront - this is your max risk",
      "Time is your enemy - move fast or lose value",
      "Best for high-conviction directional plays",
      "Control 100 shares for a fraction of the cost"
    ],
    "riskProfile": "High risk - can lose 100% of premium.",
    "maxProfit": "Unlimited (stock can rise indefinitely)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike price + premium paid",
    "bestFor": "Momentum plays. Breakout trades. Quick directional bets.",
    "avoidWhen": "You're unsure of timing or the setup isn't clean.",
    "example": {
      "scenario": "NVDA breaking out of consolidation at $480. Momentum building fast.",
      "setup": "Buy 1 NVDA $485 call expiring in 14 days for $15.",
      "outcome": "NVDA runs to $520 in a week. Call worth $35. Profit: $2,000 (133% return). Miss the move? Lose $1,500.",
      "numbers": {
        "stockPrice": 480,
        "strikePrice": 485,
        "premium": 15,
        "expiration": "14 days",
        "result": "$2,000 profit at $520, $1,500 max loss"
      }
    },
    "tips": [
      "Wait for clean technical setups",
      "Use shorter expirations for momentum plays",
      "Take profits fast - don't get greedy",
      "Size positions for the speed of the expected move"
    ],
    "commonMistakes": [
      "Chasing moves that have already happened",
      "Holding too long hoping for more",
      "Buying way OTM options with low probability",
      "Fighting the trend"
    ],
    "relatedStrategies": [
      "cheetah-long-put",
      "cheetah-bull-call-spread"
    ]
  },
  {
    "id": "cheetah-long-put",
    "name": "Long Put",
    "animalId": "cheetah",
    "difficulty": 1,
    "description": "Fast bearish exposure to catch breakdowns and crashes.",
    "overview": "Chase hunts in both directions. The long put lets you profit from fast downside moves. When a stock breaks support or panic hits, this is your weapon.\n\nSpeed matters - you need to be in position before the move, not chasing it.",
    "keyPoints": [
      "Buy a put option for leveraged bearish exposure",
      "Profit from downside moves",
      "Great for catching breakdowns and panic selling",
      "Time decay works against you",
      "Can be more explosive than long calls (stocks fall faster than they rise)"
    ],
    "riskProfile": "High risk - can lose 100% of premium.",
    "maxProfit": "Strike price - premium (if stock goes to $0)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike price - premium paid",
    "bestFor": "Breakdown plays. Bearish momentum. Catching crashes.",
    "avoidWhen": "Stock is in a strong uptrend.",
    "example": {
      "scenario": "Stock breaking major support at $100. Momentum accelerating down.",
      "setup": "Buy 1 $98 put expiring in 14 days for $4.",
      "outcome": "Stock crashes to $85. Put worth $13. Profit: $900 (225% return).",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 98,
        "premium": 4,
        "expiration": "14 days",
        "result": "$900 profit at $85, $400 max loss"
      }
    },
    "tips": [
      "Wait for support to break before entering",
      "Stocks fall faster than they rise - be ready",
      "Take profits quickly on panic moves",
      "Don't fight Fed or strong uptrends"
    ],
    "commonMistakes": [
      "Buying puts in strong uptrends",
      "Waiting too long to take profits",
      "Averaging down on losing puts",
      "Not respecting the trend"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "cheetah-long-strangle"
    ]
  },
  {
    "id": "cheetah-bull-call-spread",
    "name": "Bull Call Spread",
    "animalId": "cheetah",
    "difficulty": 2,
    "description": "Defined-risk directional plays with better risk/reward.",
    "overview": "Chase uses bull call spreads when he wants exposure but doesn't want to pay full premium. You buy a call and sell a higher strike call, reducing your cost and defining your max profit.\n\nIt's faster to profit than a naked long call because you need less movement to hit your target.",
    "keyPoints": [
      "Buy a call at lower strike",
      "Sell a call at higher strike to reduce cost",
      "Max profit is capped but cost is lower",
      "Defined risk, defined reward",
      "Faster to profitability than long calls"
    ],
    "riskProfile": "Moderate risk - max loss is the debit paid.",
    "maxProfit": "Width of strikes - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Lower strike + debit paid",
    "bestFor": "Directional plays with a price target. Capital-efficient momentum trades.",
    "avoidWhen": "You expect a massive unlimited move.",
    "example": {
      "scenario": "Bullish on AAPL at $175, targeting $185.",
      "setup": "Buy $175 call for $5, sell $185 call for $2. Net debit: $3.",
      "outcome": "Max profit: $700 if AAPL above $185. Max loss: $300. Risk $300 to make $700.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 175,
        "premium": 3,
        "expiration": "21 days",
        "result": "$700 max profit, $300 max loss"
      }
    },
    "tips": [
      "Set your short strike at your price target",
      "Use tighter spreads for higher probability",
      "Take profits at 50-75% of max",
      "Don't hold to expiration if you can lock in gains"
    ],
    "commonMistakes": [
      "Making spreads too wide",
      "Holding for max profit when you can lock in gains",
      "Ignoring assignment risk near expiration",
      "Using on low-probability setups"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "cheetah-long-strangle"
    ]
  },
  {
    "id": "cheetah-long-strangle",
    "name": "Long Strangle",
    "animalId": "cheetah",
    "difficulty": 3,
    "description": "Catch explosive moves in either direction for less cost than a straddle.",
    "overview": "Chase uses the strangle when he smells blood but doesn't know which direction. You buy an OTM call AND an OTM put. If the stock explodes in either direction, you profit.\n\nIt's cheaper than a straddle but needs a bigger move to profit.",
    "keyPoints": [
      "Buy OTM call above current price",
      "Buy OTM put below current price",
      "Cheaper than straddle but wider breakevens",
      "Need explosive move to profit",
      "Great for earnings or binary events"
    ],
    "riskProfile": "High risk - both options can expire worthless.",
    "maxProfit": "Unlimited in either direction",
    "maxLoss": "Total premium paid",
    "breakeven": "Call strike + total premium OR Put strike - total premium",
    "bestFor": "Earnings plays. Expected volatility spikes. Binary events.",
    "avoidWhen": "IV is already elevated or you expect range-bound trading.",
    "example": {
      "scenario": "TSLA earnings tonight. Expecting fireworks but no idea which direction.",
      "setup": "Buy $260 call for $8 and $240 put for $7. Total: $15. Stock at $250.",
      "outcome": "Need TSLA above $275 or below $225 to profit. If TSLA hits $290, call worth $30 = $1,500 profit.",
      "numbers": {
        "stockPrice": 250,
        "strikePrice": 260,
        "premium": 15,
        "expiration": "7 days",
        "result": "Profitable above $275 or below $225"
      }
    },
    "tips": [
      "Calculate breakevens before entering",
      "Consider selling before the event to capture IV",
      "Use on historically volatile stocks",
      "Size for the risk - you can lose it all"
    ],
    "commonMistakes": [
      "Buying when IV is already maxed",
      "Holding through IV crush",
      "Strikes too far OTM (low probability)",
      "Not taking profits when one leg runs"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "cheetah-long-put",
      "owl-long-straddle"
    ]
  },
  {
    "id": "cheetah-call-backspread",
    "name": "Call Backspread",
    "animalId": "cheetah",
    "difficulty": 4,
    "description": "Bet on explosive upside with limited risk - sell one, buy more.",
    "overview": "The Call Backspread is Chase's rocket ship play. You sell a lower strike call and buy MORE calls at a higher strike. If the stock explodes upward, your long calls multiply the gains. Limited risk, unlimited upside.\n\nThis is for when you smell blood and expect a massive rally. Speed and conviction required.",
    "keyPoints": [
      "Sell 1 ATM or ITM call",
      "Buy 2+ OTM calls at higher strike",
      "Often done for credit or small debit",
      "Profits from explosive upside moves",
      "Unlimited profit potential above breakeven"
    ],
    "riskProfile": "Moderate risk - limited between strikes, unlimited profit above.",
    "maxProfit": "Unlimited above upper breakeven",
    "maxLoss": "Difference between strikes minus credit (or plus debit)",
    "breakeven": "Upper strike + (difference × ratio - credit)",
    "bestFor": "Expecting massive rallies. Low IV environments. High conviction plays.",
    "avoidWhen": "Stock is range-bound or you expect limited movement.",
    "example": {
      "scenario": "NVDA at $900. Earnings coming. You expect a monster move up.",
      "setup": "Sell 1 $900 call for $40, buy 2 $950 calls for $20 each. Net: $0 (free trade).",
      "outcome": "If NVDA hits $1,050, both long calls worth $100 each = $200. Short call -$150. Net profit: $50 per contract = $5,000.",
      "numbers": {
        "stockPrice": 900,
        "strikePrice": 950,
        "premium": 0,
        "expiration": "14 days",
        "result": "Free trade with unlimited upside above $1,000"
      }
    },
    "tips": [
      "Enter when IV is low (before the move)",
      "Use 1:2 or 1:3 ratio for best risk/reward",
      "Size appropriately - these can move fast",
      "Take profits quickly when you get the move"
    ],
    "commonMistakes": [
      "Entering when IV is already elevated",
      "Wrong ratio - losing the free or credit structure",
      "Holding through the move without taking profit",
      "Not understanding the max loss zone"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "cheetah-put-backspread"
    ]
  },
  {
    "id": "cheetah-put-backspread",
    "name": "Put Backspread",
    "animalId": "cheetah",
    "difficulty": 4,
    "description": "Profit from explosive downside moves - sell one, buy more.",
    "overview": "The Put Backspread is Chase's crash play. Sell a higher strike put, buy MORE puts at a lower strike. If the stock crashes, your long puts multiply the profits. Speed meets opportunity.\n\nThis is for when you smell fear in the market and expect a fast drop.",
    "keyPoints": [
      "Sell 1 ATM or ITM put",
      "Buy 2+ OTM puts at lower strike",
      "Often done for credit or small debit",
      "Profits from explosive downside moves",
      "Unlimited profit potential below breakeven"
    ],
    "riskProfile": "Moderate risk - limited between strikes, large profit below.",
    "maxProfit": "Large profits below lower breakeven (lower strike × ratio)",
    "maxLoss": "Difference between strikes minus credit (or plus debit)",
    "breakeven": "Lower strike - (difference × ratio - credit)",
    "bestFor": "Expecting sharp drops. Hedging. Volatility spikes.",
    "avoidWhen": "Market is grinding higher or range-bound.",
    "example": {
      "scenario": "SPY at $500. Market looks toppy. Expecting fast drop.",
      "setup": "Sell 1 $500 put for $10, buy 2 $480 puts for $5 each. Net: $0 (free).",
      "outcome": "If SPY crashes to $450, both puts worth $30 each = $60. Short put -$50. Net: $10 × 100 = $1,000 profit.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 480,
        "premium": 0,
        "expiration": "21 days",
        "result": "Free crash protection with big profit potential"
      }
    },
    "tips": [
      "Great for hedging long portfolios",
      "Enter before volatility spikes",
      "Watch for gap downs - can be very profitable",
      "Don't hold too long after the move"
    ],
    "commonMistakes": [
      "Entering too late (after the drop starts)",
      "Wrong ratio loses the credit/small debit advantage",
      "Forgetting about the max loss zone between strikes",
      "Not sizing for potential volatility"
    ],
    "relatedStrategies": [
      "cheetah-long-put",
      "cheetah-call-backspread"
    ]
  },
  {
    "id": "cheetah-strap",
    "name": "Strap",
    "animalId": "cheetah",
    "difficulty": 4,
    "description": "Bullish volatility play - 2 calls, 1 put for explosive upside.",
    "overview": "The Strap is Chase's asymmetric bet. You buy 2 calls and 1 put at the same strike. You profit from big moves either way, but you're positioned to make TWICE as much on the upside.\n\nThis is for when you expect volatility but have a bullish bias. Double the upside potential.",
    "keyPoints": [
      "Buy 2 ATM calls",
      "Buy 1 ATM put at same strike",
      "Costs more than a straddle",
      "Profits from big moves either direction",
      "2x profit on upside vs downside"
    ],
    "riskProfile": "High risk - can lose entire premium if no move.",
    "maxProfit": "Unlimited to upside (2 calls), large to downside (1 put)",
    "maxLoss": "Total premium paid (2 calls + 1 put)",
    "breakeven": "Strike ± total premium / number of options on that side",
    "bestFor": "Bullish events with volatility. Earnings plays. Breakout setups.",
    "avoidWhen": "IV is extremely high or you have no directional bias.",
    "example": {
      "scenario": "AMD earnings. Bullish but want downside protection. Stock at $150.",
      "setup": "Buy 2 $150 calls for $10 each, buy 1 $150 put for $9. Total: $29.",
      "outcome": "If AMD hits $200, 2 calls worth $50 each = $100. Profit: $100 - $29 = $71 × 100 = $7,100. If AMD drops to $100, put worth $50, profit: $2,100.",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 150,
        "premium": 29,
        "expiration": "7 days",
        "result": "2x upside leverage vs downside"
      }
    },
    "tips": [
      "Use when you have bullish conviction + expect volatility",
      "Calculate both breakevens before entering",
      "Consider closing early to avoid theta decay",
      "Size smaller than a regular straddle (higher cost)"
    ],
    "commonMistakes": [
      "Not having a bullish bias (use straddle instead)",
      "Paying too much premium in high IV",
      "Holding too long and losing to theta",
      "Not taking profits when you get the move"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "cheetah-long-strangle"
    ]
  },
  {
    "id": "cheetah-long-synthetic-future",
    "name": "Long Synthetic Future",
    "animalId": "cheetah",
    "difficulty": 3,
    "description": "Simulate stock ownership with pure delta 1.0 using options only.",
    "overview": "Chase's synthetic future is pure leverage without owning stock. Buy a call, sell a put at the same strike. You get 100% delta exposure - moves exactly like owning 100 shares - but for way less capital.\n\nThis is for maximum speed with defined risk. You're locked into the position like owning stock, but with options' capital efficiency.",
    "keyPoints": [
      "Buy 1 ATM call",
      "Sell 1 ATM put at same strike",
      "Creates delta 1.0 - moves like owning stock",
      "Requires less capital than buying shares",
      "Captures full upside, full downside"
    ],
    "riskProfile": "High risk - equivalent to owning stock but with margin requirements.",
    "maxProfit": "Unlimited (same as stock ownership)",
    "maxLoss": "Strike price - net credit received (if stock goes to $0)",
    "breakeven": "Strike price - net credit/debit",
    "bestFor": "Maximum bullish exposure with capital efficiency. Trading futures-like positions.",
    "avoidWhen": "You can't handle the full downside risk or want defined risk.",
    "example": {
      "scenario": "TSLA at $250. You want full exposure but don't want to tie up $25,000.",
      "setup": "Buy $250 call for $15, sell $250 put for $14. Net debit: $1.",
      "outcome": "If TSLA hits $300, profit $50/share - $1 = $4,900. If drops to $200, lose $50/share + $1 = -$5,100. Moves exactly like owning stock.",
      "numbers": {
        "stockPrice": 250,
        "strikePrice": 250,
        "premium": 1,
        "expiration": "45 days",
        "result": "Delta 1.0 position, moves $1 for every $1 stock move"
      }
    },
    "tips": [
      "Use at-the-money strikes for true 1.0 delta",
      "Monitor margin requirements closely",
      "This is NOT a hedge - it's full exposure",
      "Exit fast if the trade thesis breaks"
    ],
    "commonMistakes": [
      "Thinking this reduces risk (it doesn't)",
      "Not accounting for assignment risk on the short put",
      "Forgetting about margin requirements",
      "Using in choppy markets where timing is unclear"
    ],
    "relatedStrategies": [
      "cheetah-long-call",
      "bull-long-synthetic-future"
    ]
  },
  {
    "id": "cheetah-bull-call-ladder",
    "name": "Bull Call Ladder",
    "animalId": "cheetah",
    "difficulty": 4,
    "description": "Aggressive ladder structure for explosive moves with capped upside.",
    "overview": "Chase's bull call ladder is for when you expect a HUGE move but want to fund it aggressively. Buy a call, sell another, sell a third higher. The second and third sales fund the position, but create risk if the stock rips too far.\n\nThis is speed trading with a twist - profit big in the zone, but watch out above.",
    "keyPoints": [
      "Buy 1 ITM or ATM call",
      "Sell 1 call higher",
      "Sell 1 call even higher",
      "Often entered for credit or small debit",
      "Profit zone between short strikes"
    ],
    "riskProfile": "High risk - unlimited loss if stock moves way beyond upper short strike.",
    "maxProfit": "At the middle short strike (limited)",
    "maxLoss": "Unlimited above upper strike",
    "breakeven": "Lower breakeven at long call strike + net debit; upper breakeven varies",
    "bestFor": "Bullish but want to cap gains to reduce cost. Moderately aggressive moves.",
    "avoidWhen": "Stock could explode beyond your strikes or you can't monitor.",
    "example": {
      "scenario": "AMD at $140. Expect move to $155 but not beyond $165.",
      "setup": "Buy $140 call for $10, sell $150 call for $5, sell $160 call for $3. Net: $2 debit.",
      "outcome": "Max profit at $150: $10/share - $2 = $800. Above $160, losses accelerate. Below $140, lose $200.",
      "numbers": {
        "stockPrice": 140,
        "strikePrice": 150,
        "premium": 2,
        "expiration": "30 days",
        "result": "$800 max profit at $150, unlimited risk above $160"
      }
    },
    "tips": [
      "Use when you have high conviction of a range",
      "Monitor closely if stock approaches upper strike",
      "Consider closing early at 50-70% profit",
      "Have a plan to convert or hedge if breached"
    ],
    "commonMistakes": [
      "Not understanding the unlimited upside risk",
      "Using on stocks with unpredictable volatility",
      "No exit plan if stock rips past upper strike",
      "Oversizing the position"
    ],
    "relatedStrategies": [
      "cheetah-bull-call-spread",
      "bull-bull-call-ladder"
    ]
  },
  {
    "id": "fox-pmcc",
    "name": "Poor Man's Covered Call",
    "animalId": "fox",
    "difficulty": 3,
    "description": "Get covered call exposure with a fraction of the capital using LEAPS.",
    "overview": "Fiona's clever twist on the covered call. Instead of buying 100 shares, you buy a deep ITM LEAP call. Then you sell short-term calls against it, just like a covered call but with way less capital.\n\nIt's the same income strategy, but capital efficient. Classic fox thinking - find the angle others miss.",
    "keyPoints": [
      "Buy a deep ITM LEAP call (6+ months, high delta)",
      "Sell short-term OTM calls against it monthly",
      "Collect premium like a covered call",
      "Requires 1/3 to 1/2 the capital of owning shares",
      "Your LEAP acts like synthetic stock"
    ],
    "riskProfile": "Moderate risk - LEAP can lose value, but less capital at risk than owning shares.",
    "maxProfit": "Short call strike - LEAP strike - net debit + premiums collected",
    "maxLoss": "Net debit paid for LEAP minus premiums collected",
    "breakeven": "LEAP strike + net debit paid",
    "bestFor": "Capital-efficient income. Bullish stocks you can't afford to buy 100 shares of.",
    "avoidWhen": "Stock is in a downtrend or LEAP premiums are too expensive.",
    "example": {
      "scenario": "Want covered call income on AMZN ($185) but can't afford $18,500 for shares.",
      "setup": "Buy $160 LEAP call (1 year) for $35. Sell monthly $195 calls for $3.",
      "outcome": "Pay $3,500 for LEAP instead of $18,500 for shares. Collect ~$300/month selling calls. Same income strategy, 1/5 the capital.",
      "numbers": {
        "stockPrice": 185,
        "strikePrice": 160,
        "premium": 35,
        "expiration": "12 months",
        "result": "$300/month income on $3,500 capital vs $18,500"
      }
    },
    "tips": [
      "Buy LEAPs with 0.80+ delta (deep ITM)",
      "Use 9-12 month LEAPs minimum",
      "Sell 30-45 day calls against it",
      "Roll the LEAP before it gets too short"
    ],
    "commonMistakes": [
      "Buying LEAPs that aren't deep enough ITM",
      "Selling calls too aggressive (getting \"called away\")",
      "Forgetting LEAPs have expiration dates",
      "Using on bearish or highly volatile stocks"
    ],
    "relatedStrategies": [
      "fox-diagonal-spread",
      "fox-calendar-spread"
    ]
  },
  {
    "id": "fox-diagonal-spread",
    "name": "Diagonal Spread",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Combine time decay and directional bias for sophisticated plays.",
    "overview": "Fiona's diagonal spread exploits multiple market inefficiencies at once. You're playing theta decay, directional movement, and sometimes IV skew all in one trade.\n\nBuy a longer-dated option, sell a shorter-dated option at a different strike. Time works for you while you wait for your directional thesis to play out.",
    "keyPoints": [
      "Buy longer-dated option (60+ days)",
      "Sell shorter-dated option at different strike (30 days)",
      "Profits from theta differential",
      "Can be structured bullish or bearish",
      "Multiple ways to win"
    ],
    "riskProfile": "Moderate risk - debit paid is max loss.",
    "maxProfit": "Depends on direction and management",
    "maxLoss": "Net debit paid",
    "breakeven": "Complex - varies with time and price",
    "bestFor": "Patient directional plays. Exploiting time decay. Sophisticated traders.",
    "avoidWhen": "You need immediate directional exposure.",
    "example": {
      "scenario": "Bullish on META at $500, expecting gradual rise to $550.",
      "setup": "Buy $480 call (60 days) for $40, sell $530 call (30 days) for $12. Net: $28.",
      "outcome": "If META rises slowly, short call decays faster. At $530 in 30 days, short expires worthless, long call worth ~$55. Profit: $1,500+.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 480,
        "premium": 28,
        "expiration": "30/60 days",
        "result": "$1,500+ potential profit, $2,800 max risk"
      }
    },
    "tips": [
      "Match strikes to your price and time targets",
      "Monitor and manage the short option actively",
      "Consider rolling the short option for more income",
      "Understand the Greeks interaction"
    ],
    "commonMistakes": [
      "Not managing when short option is challenged",
      "Ignoring IV changes between expirations",
      "Over-complicating the position",
      "Not having clear profit targets"
    ],
    "relatedStrategies": [
      "fox-pmcc",
      "fox-calendar-spread",
      "fox-broken-wing-butterfly"
    ]
  },
  {
    "id": "fox-broken-wing-butterfly",
    "name": "Broken Wing Butterfly",
    "animalId": "fox",
    "difficulty": 5,
    "description": "A skewed butterfly that can be entered for a credit with directional bias.",
    "overview": "Fiona's broken wing butterfly is a regular butterfly with one wing \"broken\" - moved further out. This creates an asymmetric payoff where you can enter for a credit while still having a profit zone.\n\nIt's like getting paid to have a lottery ticket. Classic fox - always finding the angle.",
    "keyPoints": [
      "Standard butterfly structure but with unequal wing widths",
      "Can be entered for a credit instead of debit",
      "Has a directional bias based on which wing is broken",
      "Profit zone is skewed toward one direction",
      "No risk on one side, defined risk on the other"
    ],
    "riskProfile": "Moderate risk - defined on one side, no risk on the other.",
    "maxProfit": "Width of narrow wing + credit received",
    "maxLoss": "Width of wide wing - credit - width of narrow wing",
    "breakeven": "Complex - depends on structure",
    "bestFor": "Directional bias with credit entry. Reducing cost of butterflies.",
    "avoidWhen": "You expect a move toward your wide wing.",
    "example": {
      "scenario": "Bullish on SPY at $500. Want a butterfly that pays you to enter.",
      "setup": "Buy $495 call, sell 2x $505 calls, buy $520 call. Credit: $0.50.",
      "outcome": "Max profit at $505: $1,050. No risk below $495 (keep $50 credit). Risk only above $505 toward $520: $450 max loss.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 505,
        "premium": 0.5,
        "expiration": "21 days",
        "result": "$1,050 max profit, $450 max loss, no risk to upside"
      }
    },
    "tips": [
      "Use when you have a directional bias",
      "Structure for a credit to have no-risk side",
      "Watch the wide wing side for losses",
      "Great for earnings plays with directional lean"
    ],
    "commonMistakes": [
      "Not understanding the asymmetric risk",
      "Letting the wide wing get tested without adjusting",
      "Using without a clear directional thesis",
      "Overcomplicating adjustments"
    ],
    "relatedStrategies": [
      "fox-diagonal-spread",
      "octopus-butterfly-precision"
    ]
  },
  {
    "id": "fox-calendar-spread",
    "name": "Calendar Spread",
    "animalId": "fox",
    "difficulty": 3,
    "description": "Profit from time decay differential between near and far-dated options.",
    "overview": "Fiona's calendar spread exploits the fact that near-term options decay faster than longer-term ones. Sell the fast-decaying option, buy the slow-decaying one at the same strike.\n\nYou profit from the difference in decay rates. It's like the market paying you for understanding theta math.",
    "keyPoints": [
      "Sell near-term option (30 days or less)",
      "Buy longer-term option at same strike (60+ days)",
      "Net debit to enter",
      "Profits when stock stays near the strike",
      "Benefits from IV expansion in back month"
    ],
    "riskProfile": "Moderate risk - debit paid is max loss.",
    "maxProfit": "Variable - depends on stock price and IV at front expiration",
    "maxLoss": "Net debit paid",
    "breakeven": "Complex - depends on IV",
    "bestFor": "Range-bound stocks. Low IV environments. Stocks expected to stay flat.",
    "avoidWhen": "You expect a big move or IV crush.",
    "example": {
      "scenario": "MSFT at $420. You expect it to stay around this level.",
      "setup": "Sell $420 call (30 days) for $8, buy $420 call (60 days) for $14. Net debit: $6.",
      "outcome": "If MSFT at $420 at front expiration, short call expires, long call worth ~$10-12. Profit: $400-600.",
      "numbers": {
        "stockPrice": 420,
        "strikePrice": 420,
        "premium": 6,
        "expiration": "30/60 days",
        "result": "$400-600 potential profit, $600 max risk"
      }
    },
    "tips": [
      "Use ATM or slightly OTM strikes",
      "Enter in low IV - rising IV helps the trade",
      "Close before front expiration for best results",
      "Can convert to other spreads after front expires"
    ],
    "commonMistakes": [
      "Using when IV is already high",
      "Holding too long into front expiration",
      "Not understanding IV risk",
      "Using when you expect a move"
    ],
    "relatedStrategies": [
      "fox-diagonal-spread",
      "fox-pmcc"
    ]
  },
  {
    "id": "fox-twisted-sister",
    "name": "Twisted Sister",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Asymmetric iron condor with unbalanced wings - find the market's blind spot.",
    "overview": "The Twisted Sister is Fiona's most cunning creation. It's an iron condor but with unequal wing widths. You exploit skew, probability, and market inefficiency all at once. One side has wider wings, one has narrower - creating an asymmetric risk/reward profile.\n\nThis is for when you see an angle others miss. Classic fox cunning.",
    "keyPoints": [
      "Sell put spread and call spread (like iron condor)",
      "But make the wings different widths",
      "Often entered for better credit or risk profile",
      "Directional bias while collecting premium",
      "Exploits volatility skew"
    ],
    "riskProfile": "Moderate - defined but asymmetric on each side.",
    "maxProfit": "Net credit received",
    "maxLoss": "Width of wider wing minus credit",
    "breakeven": "Short strikes ± credit (adjusted for wing widths)",
    "bestFor": "Directional bias with income. Exploiting skew. High IV environments.",
    "avoidWhen": "No clear probability advantage or low liquidity.",
    "example": {
      "scenario": "SPY at $500. Slightly bullish. Want asymmetric risk.",
      "setup": "Sell $480/$475 put spread (narrow), sell $520/$530 call spread (wide). Credit: $2.00.",
      "outcome": "Max profit: $200. Max loss on put side: $300. Max loss on call side: $800. But probability favors the call side staying OTM.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 480,
        "premium": 2,
        "expiration": "30 days",
        "result": "Asymmetric risk tilted to your thesis"
      }
    },
    "tips": [
      "Make wider wing in direction you DON'T expect",
      "Use probability analysis to justify asymmetry",
      "Monitor both sides independently",
      "Close at 50% profit to improve win rate"
    ],
    "commonMistakes": [
      "Making wings too asymmetric without justification",
      "Not understanding which side has more risk",
      "Ignoring skew changes",
      "Over-complicating the structure"
    ],
    "relatedStrategies": [
      "fox-broken-wing-butterfly",
      "octopus-seagull"
    ]
  },
  {
    "id": "fox-ratio-spread",
    "name": "Ratio Spread",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Sell more options than you buy - profit from limited moves with edge.",
    "overview": "The Ratio Spread is Fiona's edge play. Buy one option, sell two or more at a different strike. Often entered for credit or small debit. You profit if the stock moves toward your short strikes but not through them.\n\nIt's all about finding that sweet spot where probability favors you. That's the angle.",
    "keyPoints": [
      "Buy 1 option at one strike",
      "Sell 2+ options at another strike",
      "Often done for credit (the edge)",
      "Profit zone between strikes",
      "Undefined risk beyond short strikes"
    ],
    "riskProfile": "Moderate to high - defined below, unlimited above (call ratio) or large below (put ratio).",
    "maxProfit": "At short strike price",
    "maxLoss": "Unlimited on call ratios, substantial on put ratios",
    "breakeven": "Short strike ± (max profit / number of extra shorts)",
    "bestFor": "Moderately bullish/bearish with high conviction of range. Credit collection.",
    "avoidWhen": "Uncertain about range or can't monitor position.",
    "example": {
      "scenario": "Stock at $100. You think it rallies to $110 but not beyond.",
      "setup": "Buy 1 $100 call for $8, sell 2 $110 calls for $4 each. Net: $0 (free trade).",
      "outcome": "Max profit at $110: Long call worth $10, short calls worthless. Profit: $1,000. Above $120: starts losing. Below $100: lose time value.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 110,
        "premium": 0,
        "expiration": "45 days",
        "result": "Free trade with $1,000 profit at $110, risk above $120"
      }
    },
    "tips": [
      "Use 1:2 ratio for balanced risk/reward",
      "Enter when IV is relatively high",
      "Have a plan if stock breaches short strikes",
      "Consider closing early at 50-70% profit"
    ],
    "commonMistakes": [
      "Not understanding unlimited/large risk beyond shorts",
      "Wrong ratio - losing the credit advantage",
      "No exit plan if position moves against you",
      "Using on highly volatile stocks"
    ],
    "relatedStrategies": [
      "fox-broken-wing-butterfly",
      "octopus-ratio-spread"
    ]
  },
  {
    "id": "fox-long-call-butterfly",
    "name": "Long Call Butterfly",
    "animalId": "fox",
    "difficulty": 3,
    "description": "Precision trade with low cost and high reward potential in a narrow range.",
    "overview": "Fiona's butterfly is all about finding the sweet spot. Buy one lower call, sell two middle calls, buy one higher call. Low cost, high precision. If the stock lands right in the middle, you profit big.\n\nThis is the fox's favorite - low risk, defined reward, and you look like a genius when it works.",
    "keyPoints": [
      "Buy 1 lower strike call",
      "Sell 2 middle strike calls",
      "Buy 1 higher strike call",
      "All strikes equally spaced",
      "Low cost, capped profit and loss"
    ],
    "riskProfile": "Low risk - max loss is the premium paid (debit).",
    "maxProfit": "Middle strike - lower strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Lower strike + debit, and upper strike - debit",
    "bestFor": "Low volatility. Stocks expected to land at a specific price. Precision plays.",
    "avoidWhen": "High volatility or uncertain direction.",
    "example": {
      "scenario": "Stock at $100. Expect it to pin at $105 by expiration.",
      "setup": "Buy $100 call for $7, sell 2 $105 calls for $4 each, buy $110 call for $2. Net: $1 debit.",
      "outcome": "At $105: worth $5 - $1 = $400 profit. Outside $101-$109, lose $100 max.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 105,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit at $105, $100 max loss"
      }
    },
    "tips": [
      "Use when IV is low and you expect it to stay low",
      "Enter when stock is near middle strike",
      "Close early if you get 50-70% of max profit",
      "Best 30-45 days to expiration"
    ],
    "commonMistakes": [
      "Entering when too far from middle strike",
      "Using in high IV (better spreads available)",
      "Holding to expiration (gamma risk)",
      "Not closing early when profitable"
    ],
    "relatedStrategies": [
      "fox-broken-wing-butterfly",
      "dolphin-long-call-butterfly"
    ]
  },
  {
    "id": "fox-long-put-butterfly",
    "name": "Long Put Butterfly",
    "animalId": "fox",
    "difficulty": 3,
    "description": "Bearish precision play with low cost and defined risk/reward.",
    "overview": "Same concept as the call butterfly, but using puts for a bearish lean. Fiona uses this when she expects a stock to settle at a lower price - like after a pullback completes.\n\nLow cost, high precision, defined risk. Classic fox efficiency.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 2 middle strike puts",
      "Buy 1 lower strike put",
      "All strikes equally spaced",
      "Low cost with capped profit/loss"
    ],
    "riskProfile": "Low risk - max loss is the premium paid.",
    "maxProfit": "Higher strike - middle strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Upper strike - debit, and lower strike + debit",
    "bestFor": "Bearish precision. Expecting stock to land at a specific lower price.",
    "avoidWhen": "Uncertain direction or high volatility.",
    "example": {
      "scenario": "Stock at $100, pulled back from $110. Expect it to settle at $95.",
      "setup": "Buy $100 put for $7, sell 2 $95 puts for $4 each, buy $90 put for $2. Net: $1 debit.",
      "outcome": "At $95: worth $5 - $1 = $400 profit. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit at $95, $100 max loss"
      }
    },
    "tips": [
      "Enter when stock near middle strike",
      "Use in low IV environments",
      "Take profits at 50-70% max",
      "Avoid holding through expiration"
    ],
    "commonMistakes": [
      "Entering too early before pullback completes",
      "Using when volatility is expanding",
      "Not managing at 50% profit",
      "Holding to expiration"
    ],
    "relatedStrategies": [
      "fox-long-call-butterfly",
      "dolphin-long-put-butterfly"
    ]
  },
  {
    "id": "fox-jade-lizard",
    "name": "Jade Lizard",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Neutral-bullish credit spread with no upside risk - the perfect edge.",
    "overview": "Fiona's jade lizard is pure edge. Sell an OTM put and an OTM call spread. You collect more credit than the width of the call spread - meaning ZERO upside risk. You only lose if the stock crashes below your put.\n\nIt's asymmetric risk/reward. The fox always finds the angle.",
    "keyPoints": [
      "Sell 1 OTM put",
      "Sell 1 OTM call, buy 1 higher call",
      "Credit received > width of call spread",
      "No upside risk (credit covers call spread)",
      "Risk only on downside"
    ],
    "riskProfile": "Moderate risk - undefined risk below short put, zero risk above.",
    "maxProfit": "Total credit received",
    "maxLoss": "Put strike - credit (if stock goes to $0)",
    "breakeven": "Put strike - credit received",
    "bestFor": "Neutral to bullish. High IV. Collecting premium with an edge.",
    "avoidWhen": "Bearish outlook or IV is too low for good credit.",
    "example": {
      "scenario": "Stock at $100. Neutral to bullish. IV is high.",
      "setup": "Sell $95 put for $4, sell $110 call for $2.50, buy $115 call for $1. Credit: $5.50.",
      "outcome": "If stock stays above $95: keep $550. Below $89.50: start losing. No risk above $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 5.5,
        "expiration": "45 days",
        "result": "$550 max profit, zero upside risk"
      }
    },
    "tips": [
      "Ensure credit > width of call spread",
      "Use when IV rank is high",
      "Manage at 50% profit",
      "Monitor the put side closely"
    ],
    "commonMistakes": [
      "Not verifying credit > call spread width",
      "Using on bearish stocks",
      "Ignoring the downside risk",
      "Entering in low IV"
    ],
    "relatedStrategies": [
      "fox-broken-wing-butterfly",
      "sloth-jade-lizard"
    ]
  },
  {
    "id": "fox-double-diagonal",
    "name": "Double Diagonal",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Calendar spreads on both sides - profit from time decay in a range.",
    "overview": "The double diagonal is Fiona's time decay masterpiece. Sell near-term calls and puts, buy long-term calls and puts at different strikes. Profit from theta while having flexibility to adjust.\n\nYou're selling time to the impatient while staying protected. Pure fox efficiency.",
    "keyPoints": [
      "Sell near-term OTM call and put",
      "Buy longer-term call and put at different strikes",
      "Profit from time decay",
      "Adjustable position with multiple expirations",
      "Directionally neutral with flexibility"
    ],
    "riskProfile": "Low to moderate risk - defined risk with time advantage.",
    "maxProfit": "Premium decay of short options",
    "maxLoss": "Net debit paid or loss at strikes",
    "breakeven": "Depends on structure - typically near short strikes ± debit",
    "bestFor": "Range-bound markets. High IV in near-term. Time decay farming.",
    "avoidWhen": "Expecting big moves or low IV.",
    "example": {
      "scenario": "Stock at $100. Expect range of $95-$105 for next month.",
      "setup": "Sell 30-day $105 call for $2 and $95 put for $2. Buy 60-day $110 call for $1.50 and $90 put for $1.50. Net: $1 credit.",
      "outcome": "If stock stays $95-$105: near-term options decay, keep credit + decay value. Max profit: ~$200-300.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 1,
        "expiration": "30/60 days",
        "result": "Profit from time decay in range"
      }
    },
    "tips": [
      "Use 30-45 day shorts, 60-90 day longs",
      "Enter when IV is elevated",
      "Manage or roll shorts at 21 days",
      "Can convert to iron condor if needed"
    ],
    "commonMistakes": [
      "Not understanding the complexity",
      "Poor strike selection",
      "Ignoring adjustment opportunities",
      "Using in low IV"
    ],
    "relatedStrategies": [
      "fox-diagonal-spread",
      "chameleon-double-diagonal"
    ]
  },
  {
    "id": "fox-seagull",
    "name": "Seagull",
    "animalId": "fox",
    "difficulty": 4,
    "description": "Bullish collar with a twist - sell put, buy call spread for upside.",
    "overview": "Fiona's seagull is a clever take on protection. Sell an OTM put to fund buying a call spread. You get upside participation with limited capital, and downside risk starts below the short put.\n\nIt's like a collar, but instead of capping upside at one strike, you extend it. Classic fox optimization.",
    "keyPoints": [
      "Sell 1 OTM put",
      "Buy 1 ATM or OTM call",
      "Sell 1 higher call",
      "Put premium funds the call spread",
      "Upside participation with downside risk"
    ],
    "riskProfile": "Moderate risk - undefined below short put, capped upside.",
    "maxProfit": "Higher call strike - lower call strike - net debit",
    "maxLoss": "Short put strike - credit (if stock goes to $0)",
    "breakeven": "Stock entry price or short put strike - credit",
    "bestFor": "Bullish with limited capital. Want upside exposure but need to fund it.",
    "avoidWhen": "Bearish or can't handle downside risk below short put.",
    "example": {
      "scenario": "Stock at $100. Bullish but want to reduce cost.",
      "setup": "Sell $90 put for $2, buy $105 call for $3, sell $115 call for $1. Net: $0.",
      "outcome": "Free trade! Profit from $105-$115. Risk below $90 (covered by $2 credit). Max profit: $1,000.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 105,
        "premium": 0,
        "expiration": "45 days",
        "result": "$1,000 max profit, risk below $90"
      }
    },
    "tips": [
      "Use when you want bullish exposure cheap",
      "Ensure put premium funds most of call spread",
      "Monitor downside closely",
      "Can add to existing long stock"
    ],
    "commonMistakes": [
      "Not understanding downside risk",
      "Poor strike selection on the put",
      "Ignoring assignment risk",
      "Using on bearish stocks"
    ],
    "relatedStrategies": [
      "fox-broken-wing-butterfly",
      "octopus-seagull"
    ]
  },
  {
    "id": "retriever-bull-put-spread",
    "name": "Bull Put Spread",
    "animalId": "retriever",
    "difficulty": 2,
    "description": "A friendly, defined-risk way to profit when stocks stay above your level.",
    "overview": "Goldie loves the bull put spread because it's straightforward and forgiving. You sell a put and buy a lower put to define your risk. If the stock stays above your short strike, you keep the premium!\n\nIt's like getting paid to be optimistic - and Goldie is always optimistic!",
    "keyPoints": [
      "Sell higher strike put (closer to stock price)",
      "Buy lower strike put (defines your max loss)",
      "Collect credit upfront",
      "Max profit if stock stays above short strike",
      "Risk is clearly defined before you enter"
    ],
    "riskProfile": "Low-moderate risk - defined and known before entry.",
    "maxProfit": "Credit received",
    "maxLoss": "Width of strikes minus credit received",
    "breakeven": "Short strike minus credit received",
    "bestFor": "Bullish to neutral outlook. Income with defined risk. Learning spread trading.",
    "avoidWhen": "You're bearish or expect a significant drop.",
    "example": {
      "scenario": "You like DIS at $95 and think it'll stay above $90.",
      "setup": "Sell $90 put for $2.50, buy $85 put for $1.00. Credit: $1.50.",
      "outcome": "Max profit: $150 if DIS stays above $90. Max loss: $350 if DIS below $85. Easy to understand!",
      "numbers": {
        "stockPrice": 95,
        "strikePrice": 90,
        "premium": 1.5,
        "expiration": "30 days",
        "result": "$150 max profit, $350 max loss"
      }
    },
    "tips": [
      "Choose short strikes with high probability of expiring OTM",
      "Use 30-45 day expirations",
      "Take profits at 50% of max to reduce risk",
      "Start small and learn the mechanics"
    ],
    "commonMistakes": [
      "Chasing premium with strikes too close to price",
      "Not having a plan for when the trade goes against you",
      "Holding to expiration when you can take profits",
      "Overtrading - quality over quantity"
    ],
    "relatedStrategies": [
      "retriever-bear-call-spread",
      "retriever-bull-call-spread"
    ]
  },
  {
    "id": "retriever-bear-call-spread",
    "name": "Bear Call Spread",
    "animalId": "retriever",
    "difficulty": 2,
    "description": "Defined-risk income when you think a stock won't rise much.",
    "overview": "Even optimistic Goldie knows that not everything goes up! The bear call spread lets you profit when a stock stays flat or drops. Sell a call, buy a higher call to cap your risk.\n\nIt's the mirror image of the bull put spread - same friendly structure, opposite direction.",
    "keyPoints": [
      "Sell lower strike call",
      "Buy higher strike call (defines max loss)",
      "Collect credit upfront",
      "Profit when stock stays below short call",
      "Risk is clearly defined"
    ],
    "riskProfile": "Low-moderate risk - defined before entry.",
    "maxProfit": "Credit received",
    "maxLoss": "Width of strikes minus credit",
    "breakeven": "Short strike plus credit received",
    "bestFor": "Neutral to bearish outlook. Fading rallies. Defined-risk income.",
    "avoidWhen": "You're bullish or expect a breakout.",
    "example": {
      "scenario": "XYZ rallied to $110 and you think it's topped out.",
      "setup": "Sell $112 call for $2.00, buy $117 call for $0.75. Credit: $1.25.",
      "outcome": "Max profit: $125 if stock stays below $112. Max loss: $375 if above $117.",
      "numbers": {
        "stockPrice": 110,
        "strikePrice": 112,
        "premium": 1.25,
        "expiration": "30 days",
        "result": "$125 max profit, $375 max loss"
      }
    },
    "tips": [
      "Use after stocks have had big run-ups",
      "Check for resistance levels to place your short strike",
      "Be aware of earnings and catalysts",
      "Take profits early when you can"
    ],
    "commonMistakes": [
      "Fighting strong uptrends",
      "Ignoring upcoming bullish catalysts",
      "Placing strikes too close to current price",
      "Not cutting losses when the trade fails"
    ],
    "relatedStrategies": [
      "retriever-bull-put-spread",
      "retriever-bull-call-spread"
    ]
  },
  {
    "id": "retriever-bull-call-spread",
    "name": "Bull Call Spread",
    "animalId": "retriever",
    "difficulty": 2,
    "description": "Defined-risk bullish plays with a clear target.",
    "overview": "Goldie gets excited about upside potential! The bull call spread is a debit spread that profits from stock increases. Buy a call, sell a higher call to reduce cost.\n\nYou know your max profit and max loss before you enter. No surprises - just like Goldie's straightforward personality!",
    "keyPoints": [
      "Buy lower strike call",
      "Sell higher strike call to reduce cost",
      "Pay net debit to enter",
      "Max profit when stock above short strike",
      "Defined risk equals the debit paid"
    ],
    "riskProfile": "Moderate risk - defined debit is max loss.",
    "maxProfit": "Width of strikes minus debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Long strike plus debit paid",
    "bestFor": "Bullish plays with a price target. Reducing cost of long calls.",
    "avoidWhen": "You expect a massive rally beyond your target.",
    "example": {
      "scenario": "You're bullish on PYPL at $62, targeting $70.",
      "setup": "Buy $62 call for $4, sell $70 call for $1.50. Net debit: $2.50.",
      "outcome": "Max profit: $550 if PYPL above $70. Max loss: $250. Great risk/reward!",
      "numbers": {
        "stockPrice": 62,
        "strikePrice": 62,
        "premium": 2.5,
        "expiration": "45 days",
        "result": "$550 max profit, $250 max loss"
      }
    },
    "tips": [
      "Set your short strike at your realistic price target",
      "Give yourself enough time for the move",
      "Close at 50-75% of max profit",
      "Don't make spreads too narrow (not worth the fees)"
    ],
    "commonMistakes": [
      "Setting unrealistic price targets",
      "Not enough time until expiration",
      "Holding for max profit when you could lock in gains",
      "Ignoring the overall market trend"
    ],
    "relatedStrategies": [
      "retriever-bull-put-spread",
      "retriever-bear-call-spread"
    ]
  },
  {
    "id": "retriever-covered-call",
    "name": "Covered Call",
    "animalId": "retriever",
    "difficulty": 1,
    "description": "Generate steady income by selling calls on stocks you already own.",
    "overview": "Goldie loves covered calls - it's like earning treats for doing what you already love! You own the stock (like having your favorite toy), and you sell someone the right to buy it from you at a higher price. You collect premium while you wait!\n\nThis is one of Goldie's favorite ways to earn extra income from stocks you're holding long-term. It's safe, it's simple, and it works!",
    "keyPoints": [
      "Own at least 100 shares of stock you like",
      "Sell call options above the current price",
      "Collect premium immediately - instant reward!",
      "If called away, you sell at a profit anyway",
      "Repeat monthly for consistent income"
    ],
    "riskProfile": "Very low risk - you already own the stock. Main \"risk\" is missing big rallies.",
    "maxProfit": "Strike price - your purchase price + premium (capped but predictable)",
    "maxLoss": "Stock going to zero minus premiums collected (same as stock ownership)",
    "breakeven": "Your purchase price minus total premiums collected over time",
    "bestFor": "Generating income from stocks you plan to hold. Blue-chip dividend stocks.",
    "avoidWhen": "You expect a massive rally and want unlimited upside.",
    "example": {
      "scenario": "You own 100 shares of Coca-Cola (KO) at $58 for the long haul.",
      "setup": "Sell 1 KO $62 call expiring in 45 days for $1.50.",
      "outcome": "Collect $150 right away! If KO stays below $62, keep shares and premium. If above $62, sell at $62 + keep $150 = $550 total profit. Win-win!",
      "numbers": {
        "stockPrice": 58,
        "strikePrice": 62,
        "premium": 1.5,
        "expiration": "45 days",
        "result": "$150 income, $550 max profit if called away"
      }
    },
    "tips": [
      "Use on quality stocks you'd hold forever",
      "Sell 30-45 days out for the best decay",
      "Pick strikes 5-10% above current price",
      "Stay consistent - this is a long game!"
    ],
    "commonMistakes": [
      "Using on volatile growth stocks",
      "Setting strikes too close to current price",
      "Panicking when the stock dips",
      "Overthinking the strike selection"
    ],
    "relatedStrategies": [
      "retriever-cash-secured-put",
      "retriever-protective-put"
    ]
  },
  {
    "id": "retriever-cash-secured-put",
    "name": "Cash-Secured Put",
    "animalId": "retriever",
    "difficulty": 1,
    "description": "Get paid to wait for stocks you want to buy at lower prices.",
    "overview": "This is Goldie's smart shopping strategy! Instead of chasing stocks at high prices, you get PAID to wait for a better entry point. Sell a put at a price you'd happily pay, collect premium, and wait eagerly!\n\nIf the stock comes down to your price, you buy it at a discount. If it doesn't, you keep the premium anyway. It's like getting paid to be patient!",
    "keyPoints": [
      "Keep cash ready to buy 100 shares at your strike",
      "Sell puts at prices you genuinely want to buy",
      "Collect premium right away",
      "Get assigned = buy at a discount you chose!",
      "Expire worthless = free premium, try again"
    ],
    "riskProfile": "Low-moderate risk - same as owning stock from the strike price.",
    "maxProfit": "Premium received (if stock stays above strike)",
    "maxLoss": "Strike price × 100 minus premium (if stock goes to zero)",
    "breakeven": "Strike price minus premium received",
    "bestFor": "Building positions in quality stocks. Getting paid to wait for pullbacks.",
    "avoidWhen": "You don't actually want to own the stock or can't afford 100 shares.",
    "example": {
      "scenario": "You want to own Disney (DIS) but $95 feels a bit high. You'd love it at $90.",
      "setup": "Sell 1 DIS $90 put expiring in 30 days for $2.00.",
      "outcome": "Collect $200 immediately! If DIS stays above $90, keep the $200. If DIS drops to $90, you buy 100 shares at an effective price of $88 ($90 - $2). Either way, you win!",
      "numbers": {
        "stockPrice": 95,
        "strikePrice": 90,
        "premium": 2,
        "expiration": "30 days",
        "result": "$200 income or shares at $88 effective cost"
      }
    },
    "tips": [
      "Choose strikes where you'd genuinely want to buy",
      "Keep the cash reserved - don't spend it!",
      "Use on quality companies with good fundamentals",
      "Sell after pullbacks when premiums are juicier"
    ],
    "commonMistakes": [
      "Selling puts on stocks you don't want",
      "Not having cash to cover if assigned",
      "Chasing high premiums on risky stocks",
      "Selling too many puts and getting overexposed"
    ],
    "relatedStrategies": [
      "retriever-covered-call",
      "retriever-bull-put-spread"
    ]
  },
  {
    "id": "retriever-protective-put",
    "name": "Protective Put",
    "animalId": "retriever",
    "difficulty": 1,
    "description": "Buy insurance to protect your stock holdings from big drops.",
    "overview": "Goldie believes in protecting what you love! The protective put is like insurance for your stocks - you buy puts on stocks you own to create a safety floor. No matter how far the market falls, you can sell at your strike price.\n\nYou keep all the upside potential while limiting your downside. It costs a little premium, but peace of mind is worth it!",
    "keyPoints": [
      "Own stock and buy puts on the same stock",
      "The put guarantees you can sell at strike price",
      "Your maximum loss is capped and known",
      "Keep all upside potential minus put cost",
      "Sleep well knowing you're protected!"
    ],
    "riskProfile": "Very low risk - downside is strictly limited by the put.",
    "maxProfit": "Unlimited upside minus cost of put",
    "maxLoss": "Stock price - put strike + premium paid",
    "breakeven": "Stock price + premium paid for the put",
    "bestFor": "Protecting gains you've already made. Holding through uncertain times.",
    "avoidWhen": "Premium is too expensive or you don't have significant gains to protect.",
    "example": {
      "scenario": "You own Amazon (AMZN) at $150 with nice gains. Worried about a market pullback.",
      "setup": "Buy 1 AMZN $140 put expiring in 90 days for $5.00.",
      "outcome": "Pay $500 for insurance. If AMZN crashes to $100, you can still sell at $140. Max loss: only $15/share instead of $50. Keep all upside if AMZN rallies!",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 140,
        "premium": 5,
        "expiration": "90 days",
        "result": "Max loss $15/share, unlimited upside minus $5"
      }
    },
    "tips": [
      "Buy puts 2-3 months out for better value",
      "Use when you have unrealized gains worth protecting",
      "Think of the cost as insurance premium",
      "Consider covered calls to help offset the cost"
    ],
    "commonMistakes": [
      "Buying protection after the stock already dropped",
      "Overpaying for puts you don't really need",
      "Constantly rebuying puts that expire (gets expensive)",
      "Not considering other protective strategies"
    ],
    "relatedStrategies": [
      "retriever-covered-call",
      "retriever-bull-put-spread"
    ]
  },
  {
    "id": "retriever-iron-condor",
    "name": "Iron Condor",
    "animalId": "retriever",
    "difficulty": 3,
    "description": "Profit when a stock stays within a range - collect from both sides!",
    "overview": "The iron condor might sound complicated, but Goldie will break it down! It's really just combining two spreads you already know - a bull put spread below the stock and a bear call spread above it. You collect premium from BOTH sides!\n\nYou profit when the stock stays between your strikes. It's like setting up two fences and getting paid as long as the stock stays in the yard!",
    "keyPoints": [
      "Combine bull put spread (below) + bear call spread (above)",
      "Four total options: sell put, buy lower put, sell call, buy higher call",
      "Collect credit from both spreads",
      "Max profit when stock stays between short strikes",
      "Risk is defined on both sides"
    ],
    "riskProfile": "Moderate risk - defined on both sides, probability-based.",
    "maxProfit": "Total credit received from both spreads",
    "maxLoss": "Width of wider spread minus total credit",
    "breakeven": "Short put - credit (lower) and Short call + credit (upper)",
    "bestFor": "Range-bound markets. High IV environments. Earning steady income.",
    "avoidWhen": "You expect a big move in either direction or before major news.",
    "example": {
      "scenario": "QQQ is at $450 and you think it'll stay between $440-$460.",
      "setup": "Sell $440/$435 put spread for $1.50, sell $460/$465 call spread for $1.50. Total credit: $3.00.",
      "outcome": "Max profit: $300 if QQQ stays between $440-$460. Max loss: $200 if it moves beyond either wing. You have a nice wide range to win!",
      "numbers": {
        "stockPrice": 450,
        "strikePrice": 440,
        "premium": 3,
        "expiration": "30 days",
        "result": "$300 max profit, $200 max loss"
      }
    },
    "tips": [
      "Start with wider wings for more room to win",
      "Use on stocks that tend to stay in ranges",
      "Manage at 50% profit to lock in gains",
      "Choose strikes with 70-80% probability of success"
    ],
    "commonMistakes": [
      "Using before earnings or big announcements",
      "Making the range too narrow (low win rate)",
      "Letting one side go bad without adjusting",
      "Not understanding it's really just two spreads"
    ],
    "relatedStrategies": [
      "retriever-bull-put-spread",
      "retriever-bear-call-spread"
    ]
  },
  {
    "id": "bull-long-call",
    "name": "Long Call",
    "animalId": "bull",
    "difficulty": 1,
    "description": "Pure bullish leverage - the classic bet on upside.",
    "overview": "Bruno only sees one direction: UP. The long call is his bread and butter. Buy a call, and if the stock rallies, you multiply your gains. It's simple, it's bullish, it's Bruno.\n\nWhy complicate things when you know the market goes up in the long run?",
    "keyPoints": [
      "Buy a call for leveraged upside exposure",
      "Premium paid is your maximum risk",
      "Profits are theoretically unlimited",
      "Time decay works against you",
      "Best for high-conviction bullish plays"
    ],
    "riskProfile": "High risk - can lose entire premium.",
    "maxProfit": "Unlimited",
    "maxLoss": "Premium paid",
    "breakeven": "Strike + premium",
    "bestFor": "Bullish conviction plays. Catching rallies. Leveraged upside.",
    "avoidWhen": "You're uncertain about direction or timing.",
    "example": {
      "scenario": "Bruno sees BA at $180 and believes it's going to $220.",
      "setup": "Buy 1 BA $185 call expiring in 45 days for $8.",
      "outcome": "BA rallies to $220. Call worth $35. Profit: $2,700 (337% return)!",
      "numbers": {
        "stockPrice": 180,
        "strikePrice": 185,
        "premium": 8,
        "expiration": "45 days",
        "result": "$2,700 profit at $220, $800 max loss"
      }
    },
    "tips": [
      "Buy on pullbacks, not at highs",
      "Give yourself time - 45+ days",
      "ATM or slightly OTM for balance of cost and probability",
      "Take profits - don't let winners turn to losers"
    ],
    "commonMistakes": [
      "Buying at tops after big rallies",
      "Too short expiration",
      "Way OTM strikes (lottery tickets)",
      "Holding through pullbacks hoping for recovery"
    ],
    "relatedStrategies": [
      "bull-bull-call-spread",
      "bull-bull-put-spread"
    ]
  },
  {
    "id": "bull-bull-call-spread",
    "name": "Bull Call Spread",
    "animalId": "bull",
    "difficulty": 2,
    "description": "Directional bullish plays with defined risk and reward.",
    "overview": "Bruno likes to charge forward, but even bulls can be smart about risk. The bull call spread gives you bullish exposure at reduced cost. Buy a call, sell a higher call.\n\nYou cap your upside but also reduce your risk. Sometimes the smart bull wins.",
    "keyPoints": [
      "Buy lower strike call",
      "Sell higher strike call",
      "Net debit to enter",
      "Defined max profit at short strike",
      "Reduced cost compared to long call"
    ],
    "riskProfile": "Moderate risk - debit is max loss.",
    "maxProfit": "Width of strikes minus debit",
    "maxLoss": "Debit paid",
    "breakeven": "Long strike + debit",
    "bestFor": "Bullish plays with a price target. Capital efficiency.",
    "avoidWhen": "You expect a massive rally.",
    "example": {
      "scenario": "Bullish on V at $280, targeting $300.",
      "setup": "Buy $280 call for $8, sell $300 call for $2. Net debit: $6.",
      "outcome": "Max profit: $1,400 if V above $300. Max loss: $600. Risk $600 to make $1,400.",
      "numbers": {
        "stockPrice": 280,
        "strikePrice": 280,
        "premium": 6,
        "expiration": "45 days",
        "result": "$1,400 max profit, $600 max loss"
      }
    },
    "tips": [
      "Set your short strike at your target",
      "Use 45+ days to expiration",
      "Close at 50-75% max profit",
      "Great for earnings plays with bullish bias"
    ],
    "commonMistakes": [
      "Spreads too narrow",
      "Not enough time",
      "Holding for max profit",
      "Fighting bearish trends"
    ],
    "relatedStrategies": [
      "bull-long-call",
      "bull-bull-put-spread"
    ]
  },
  {
    "id": "bull-bull-put-spread",
    "name": "Bull Put Spread",
    "animalId": "bull",
    "difficulty": 2,
    "description": "Get paid for your bullish conviction with defined risk.",
    "overview": "Bruno sells bull put spreads because he gets paid to be bullish. Sell a put spread below the current price and collect premium. As long as the stock doesn't crash, you win.\n\nIt's like the market paying you for your optimism!",
    "keyPoints": [
      "Sell higher strike put",
      "Buy lower strike put for protection",
      "Collect credit upfront",
      "Profit if stock stays above short strike",
      "Defined risk on downside"
    ],
    "riskProfile": "Moderate risk - defined on entry.",
    "maxProfit": "Credit received",
    "maxLoss": "Width of strikes minus credit",
    "breakeven": "Short strike minus credit",
    "bestFor": "Bullish outlook. Income generation. High-probability trades.",
    "avoidWhen": "You expect a significant pullback.",
    "example": {
      "scenario": "Bullish on COST at $900, confident it stays above $870.",
      "setup": "Sell $870 put for $8, buy $860 put for $4. Credit: $4.",
      "outcome": "Max profit: $400 if COST above $870. Max loss: $600. 70%+ win rate typical.",
      "numbers": {
        "stockPrice": 900,
        "strikePrice": 870,
        "premium": 4,
        "expiration": "30 days",
        "result": "$400 max profit, $600 max loss"
      }
    },
    "tips": [
      "Choose strikes with high probability OTM",
      "Use on quality stocks you'd buy anyway",
      "Take profits at 50%",
      "Don't fight strong downtrends"
    ],
    "commonMistakes": [
      "Chasing premium with aggressive strikes",
      "Ignoring market conditions",
      "Holding losing positions too long",
      "Overleveraging"
    ],
    "relatedStrategies": [
      "bull-long-call",
      "bull-bull-call-spread",
      "bull-cash-secured-put"
    ]
  },
  {
    "id": "bull-cash-secured-put",
    "name": "Cash-Secured Put",
    "animalId": "bull",
    "difficulty": 2,
    "description": "Get paid to wait for pullbacks on stocks you want to own.",
    "overview": "Bruno uses cash-secured puts to get paid while waiting for buying opportunities. Sell a put at a price you'd happily buy the stock. Collect premium while you wait.\n\nIf assigned, you buy a stock you wanted anyway at a discount. If not, free money!",
    "keyPoints": [
      "Sell put at strike where you'd buy the stock",
      "Keep cash reserved to buy shares if assigned",
      "Collect premium immediately",
      "Get assigned = buy at discount",
      "Expire worthless = keep premium"
    ],
    "riskProfile": "Moderate risk - same as owning stock from strike price.",
    "maxProfit": "Premium received",
    "maxLoss": "Strike price × 100 minus premium (if stock goes to zero)",
    "breakeven": "Strike minus premium",
    "bestFor": "Accumulating quality stocks. Income while waiting for pullbacks.",
    "avoidWhen": "You don't actually want to own the stock.",
    "example": {
      "scenario": "Bruno loves AAPL at $175 but would prefer to buy at $160.",
      "setup": "Sell $160 put for $3 with $16,000 cash reserved.",
      "outcome": "If AAPL stays above $160, keep $300. If below, buy AAPL at effective price of $157.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 160,
        "premium": 3,
        "expiration": "45 days",
        "result": "$300 income or shares at $157 effective price"
      }
    },
    "tips": [
      "Only use on stocks you truly want to own",
      "Set strike at your target buy price",
      "Keep cash reserved - no margin games",
      "Great after stocks pull back (higher premiums)"
    ],
    "commonMistakes": [
      "Selling puts on stocks you wouldn't buy",
      "Overcommitting capital",
      "Chasing premium on risky stocks",
      "Not having a plan for assignment"
    ],
    "relatedStrategies": [
      "bull-bull-put-spread",
      "bull-zebra"
    ]
  },
  {
    "id": "bull-zebra",
    "name": "ZEBRA (Zero Extrinsic Back Ratio)",
    "animalId": "bull",
    "difficulty": 4,
    "description": "Synthetic stock position with no time decay and limited downside.",
    "overview": "Bruno's sophisticated play - the ZEBRA gives you stock-like upside with NO time decay and LIMITED downside. Buy 2 ATM calls, sell 1 ITM call. The extrinsic values cancel out.\n\nIt's like owning stock but with a safety net. Even Bruno appreciates protection sometimes.",
    "keyPoints": [
      "Buy 2 ATM calls",
      "Sell 1 ITM call",
      "Net delta near 100 (like stock)",
      "Minimal or zero extrinsic value (no time decay)",
      "Defined downside risk"
    ],
    "riskProfile": "Moderate risk - defined on downside, unlimited upside.",
    "maxProfit": "Unlimited (like stock)",
    "maxLoss": "Debit paid (limited)",
    "breakeven": "Depends on structure - approximately short strike + debit",
    "bestFor": "Stock replacement with protection. Long-term bullish plays.",
    "avoidWhen": "You expect range-bound trading.",
    "example": {
      "scenario": "Want stock-like exposure to GOOGL at $175 with protection.",
      "setup": "Buy 2 GOOGL $175 calls for $8 each, sell 1 GOOGL $165 call for $15. Net debit: $1.",
      "outcome": "Position moves like stock above $175. Max loss ~$1,100 if GOOGL at $175 (short strike ITM, longs worthless). Below $165, loss is only the $100 debit. Unlimited upside.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 175,
        "premium": 1,
        "expiration": "90 days",
        "result": "Stock-like gains, ~$1,100 max loss"
      }
    },
    "tips": [
      "Use for longer-term bullish positions",
      "Structure for minimal extrinsic value",
      "Great for expensive stocks",
      "Monitor and roll as needed"
    ],
    "commonMistakes": [
      "Not understanding the structure",
      "Using for short-term trades",
      "Ignoring assignment risk on short ITM call",
      "Over-complicating the position"
    ],
    "relatedStrategies": [
      "bull-long-call",
      "bull-bull-call-spread"
    ]
  },
  {
    "id": "bull-long-synthetic-future",
    "name": "Long Synthetic Future",
    "animalId": "bull",
    "difficulty": 3,
    "description": "Stock-like exposure with options - full bullish delta without owning shares.",
    "overview": "Bruno's synthetic future is PURE BULLISH POWER. Buy a call, sell a put at the same strike. You get delta 1.0 - it moves exactly like owning stock - but with options leverage.\n\nThis is for when Bruno's conviction is through the roof. Maximum bullish exposure!",
    "keyPoints": [
      "Buy 1 ATM call",
      "Sell 1 ATM put at same strike",
      "Delta 1.0 - moves like stock",
      "Less capital than buying shares",
      "Full upside and downside exposure"
    ],
    "riskProfile": "High risk - same as owning stock, full upside and downside.",
    "maxProfit": "Unlimited (same as owning stock)",
    "maxLoss": "Strike - net credit (if stock to $0)",
    "breakeven": "Strike - net credit/debit",
    "bestFor": "Maximum bullish conviction. Leveraged stock exposure.",
    "avoidWhen": "Can't handle full downside risk.",
    "example": {
      "scenario": "Stock at $150. Bruno is ALL IN bullish.",
      "setup": "Buy $150 call for $10, sell $150 put for $9. Net: $1 debit.",
      "outcome": "If stock hits $200, profit $50 - $1 = $4,900. If drops to $100, lose $50 + $1 = -$5,100. Moves like owning stock.",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 150,
        "premium": 1,
        "expiration": "60 days",
        "result": "Delta 1.0 - full stock movement"
      }
    },
    "tips": [
      "Use ATM for true 1.0 delta",
      "Understand margin requirements",
      "This is NOT hedged",
      "Only use with high conviction"
    ],
    "commonMistakes": [
      "Thinking this reduces risk",
      "Not having margin for put assignment",
      "Using without strong bullish thesis",
      "Ignoring early assignment risk"
    ],
    "relatedStrategies": [
      "bull-long-call",
      "cheetah-long-synthetic-future"
    ]
  },
  {
    "id": "bull-bull-call-ladder",
    "name": "Bull Call Ladder",
    "animalId": "bull",
    "difficulty": 4,
    "description": "Bullish play with funded upside but capped gains.",
    "overview": "Bruno's bull call ladder is for when he's bullish to a point. Buy a call, sell two higher calls at different strikes. The sales fund the position, but cap your max gain.\n\nBruno uses this when he's bullish but wants to reduce cost. It's still upside-focused!",
    "keyPoints": [
      "Buy 1 lower strike call",
      "Sell 1 middle strike call",
      "Sell 1 higher strike call",
      "Often entered for credit or small debit",
      "Profit zone between strikes"
    ],
    "riskProfile": "High risk - unlimited loss above highest strike.",
    "maxProfit": "At middle strike (capped)",
    "maxLoss": "Unlimited above upper strike",
    "breakeven": "Long call + debit on downside; varies on upside",
    "bestFor": "Bullish with price target. Want to reduce cost.",
    "avoidWhen": "Expecting unlimited rally or can't monitor.",
    "example": {
      "scenario": "Stock at $100. Bruno thinks it goes to $115 but caps at $120.",
      "setup": "Buy $100 call for $9, sell $110 call for $4, sell $120 call for $2. Net: $3 debit.",
      "outcome": "Max profit at $110: $10 - $3 = $700. Above $120, losses mount. Below $100, lose $300.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 110,
        "premium": 3,
        "expiration": "45 days",
        "result": "$700 max profit at $110, unlimited risk above $120"
      }
    },
    "tips": [
      "Use when you have a target range",
      "Monitor if approaching upper strike",
      "Close early at 50-70% profit",
      "Have plan to convert if breached"
    ],
    "commonMistakes": [
      "Not understanding unlimited upside risk",
      "Using on unpredictable stocks",
      "No exit plan above upper strike",
      "Oversizing the position"
    ],
    "relatedStrategies": [
      "bull-bull-call-spread",
      "cheetah-bull-call-ladder"
    ]
  },
  {
    "id": "bull-strap",
    "name": "Strap",
    "animalId": "bull",
    "difficulty": 4,
    "description": "Bullish volatility play - 2 calls, 1 put for asymmetric upside.",
    "overview": "Bruno's strap is for when volatility is coming but he's BULLISH. Buy 2 ATM calls and 1 ATM put. You profit from big moves either way, but make TWICE as much on the upside.\n\nThis is Bruno's way of playing volatility - with a bullish tilt!",
    "keyPoints": [
      "Buy 2 ATM calls",
      "Buy 1 ATM put at same strike",
      "More expensive than straddle",
      "Double upside profit potential",
      "Still protected on downside"
    ],
    "riskProfile": "High risk - can lose entire premium if no move.",
    "maxProfit": "Unlimited to upside (2 calls), large to downside (1 put)",
    "maxLoss": "Total premium (2 calls + 1 put)",
    "breakeven": "Strike + (premium / 2) up, Strike - premium down",
    "bestFor": "Bullish volatility plays. Earnings with upside bias.",
    "avoidWhen": "No directional bias or IV too high.",
    "example": {
      "scenario": "Stock at $100. Earnings coming. Bruno expects big move UP.",
      "setup": "Buy 2 $100 calls for $6 each, buy 1 $100 put for $5. Total: $17.",
      "outcome": "If stock hits $150, 2 calls worth $50 each = $100. Profit: $100 - $17 = $8,300! If drops to $50, put worth $50, profit: $3,300.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 17,
        "expiration": "14 days",
        "result": "2x upside vs downside"
      }
    },
    "tips": [
      "Use when bullish + expecting volatility",
      "Calculate both breakevens",
      "Take profits early on winning side",
      "Size smaller than straddles (higher cost)"
    ],
    "commonMistakes": [
      "Not having bullish bias (use straddle)",
      "Paying too much in high IV",
      "Holding too long",
      "Not understanding higher downside breakeven"
    ],
    "relatedStrategies": [
      "bull-long-call",
      "cheetah-strap"
    ]
  },
  {
    "id": "octopus-ratio-spread",
    "name": "Ratio Spread",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Leveraged spreads with unlimited risk for precise price targets.",
    "overview": "Oscar manages ratio spreads with multiple tentacles ready to adjust. Buy one option, sell multiple at a different strike. You get leverage and often a credit entry, but beware - unlimited risk lurks beyond your strikes.\n\nThis requires constant monitoring and adjustment. Oscar has eight arms for a reason.",
    "keyPoints": [
      "Buy 1 option, sell 2+ at different strike",
      "Often entered for credit or reduced debit",
      "Max profit typically at short strike",
      "UNLIMITED RISK beyond short strikes",
      "Requires active management"
    ],
    "riskProfile": "VERY HIGH - unlimited loss potential.",
    "maxProfit": "Width of spread + credit (at short strike)",
    "maxLoss": "UNLIMITED beyond short strikes",
    "breakeven": "Multiple breakevens - complex",
    "bestFor": "Experienced traders with specific targets. Reducing cost of directional plays.",
    "avoidWhen": "You can't monitor constantly or expect large moves.",
    "example": {
      "scenario": "Bullish on XYZ at $100, targeting $110, confident it won't exceed $120.",
      "setup": "Buy 1 $100 call for $5, sell 2 $110 calls for $2.50 each. Net cost: $0.",
      "outcome": "Max profit at $110: $1,000. Above $120, losses are unlimited. Requires strict management.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 110,
        "premium": 0,
        "expiration": "30 days",
        "result": "$1,000 max profit, unlimited risk above $120"
      }
    },
    "tips": [
      "Always have a stop-loss plan",
      "Use only with high conviction on price target",
      "Consider closing one short if tested",
      "Never let unlimited risk run unmanaged"
    ],
    "commonMistakes": [
      "Holding when stock blows through short strikes",
      "Not understanding the risk profile",
      "Using without a clear price target",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "octopus-call-backspread",
      "octopus-short-straddle"
    ]
  },
  {
    "id": "octopus-call-backspread",
    "name": "Call Backspread",
    "animalId": "octopus",
    "difficulty": 4,
    "description": "Profit from explosive upside moves with limited risk if wrong.",
    "overview": "Oscar's call backspread is the opposite of a ratio spread - sell 1 option, buy 2+ at a higher strike. You want the stock to EXPLODE higher. If it doesn't, your loss is limited.\n\nIt's a volatility and direction play combined. Oscar uses this for potential moonshots.",
    "keyPoints": [
      "Sell 1 lower strike call",
      "Buy 2+ higher strike calls",
      "Often entered for credit or small debit",
      "Profits from large upside moves",
      "Limited loss if stock stays flat or drops"
    ],
    "riskProfile": "Moderate initial risk, unlimited reward.",
    "maxProfit": "Unlimited on upside",
    "maxLoss": "Width of strikes minus credit (if entered for credit)",
    "breakeven": "Complex - depends on structure",
    "bestFor": "Expecting explosive moves. Pre-earnings plays. Volatility expansion.",
    "avoidWhen": "You expect the stock to stay range-bound.",
    "example": {
      "scenario": "Expecting TSLA to either explode higher or stay flat before earnings.",
      "setup": "Sell 1 $250 call for $20, buy 2 $260 calls for $10 each. Net: $0.",
      "outcome": "If TSLA explodes to $300, profit = $3,000. If flat or down, break even. Max loss at $260: $1,000.",
      "numbers": {
        "stockPrice": 250,
        "strikePrice": 260,
        "premium": 0,
        "expiration": "14 days",
        "result": "$3,000+ profit at $300, $1,000 max loss at $260"
      }
    },
    "tips": [
      "Use for expected volatility expansion",
      "Great for earnings or binary events",
      "Structure for credit when possible",
      "Close if the explosive move happens"
    ],
    "commonMistakes": [
      "Using when IV is already maxed",
      "Not closing when move happens",
      "Fighting the trend",
      "Over-complicating adjustments"
    ],
    "relatedStrategies": [
      "octopus-ratio-spread",
      "octopus-short-strangle"
    ]
  },
  {
    "id": "octopus-short-straddle",
    "name": "Short Straddle",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Maximum premium collection for stocks you expect to stay put.",
    "overview": "Oscar's short straddle is for when he's certain a stock won't move much. Sell BOTH an ATM call AND an ATM put. Maximum premium, but unlimited risk in both directions.\n\nThis requires nerves of steel and constant monitoring. Oscar has eight arms ready to adjust.",
    "keyPoints": [
      "Sell ATM call and ATM put at same strike",
      "Maximum premium collection",
      "Profit if stock stays near strike",
      "UNLIMITED RISK in both directions",
      "Requires active management"
    ],
    "riskProfile": "EXTREME - unlimited loss both directions.",
    "maxProfit": "Total premium received",
    "maxLoss": "UNLIMITED in both directions",
    "breakeven": "Strike +/- total premium",
    "bestFor": "High IV environments. Stocks expected to pin. Expert traders only.",
    "avoidWhen": "You expect any significant move or can't monitor constantly.",
    "example": {
      "scenario": "SPY at $500, IV elevated, expecting it to pin for monthly OpEx.",
      "setup": "Sell $500 call for $8 and $500 put for $8. Total credit: $16.",
      "outcome": "Max profit: $1,600 if SPY at exactly $500. Breakevens: $484 and $516. Beyond that, unlimited losses.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 16,
        "expiration": "14 days",
        "result": "$1,600 max profit, unlimited risk outside $484-$516"
      }
    },
    "tips": [
      "Only use when IV is elevated",
      "Have strict stop-losses in place",
      "Consider converting to iron butterfly for defined risk",
      "Never hold through major events"
    ],
    "commonMistakes": [
      "Using without proper risk management",
      "Holding through earnings or events",
      "Letting losses run hoping for mean reversion",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "octopus-short-strangle",
      "octopus-iron-butterfly"
    ]
  },
  {
    "id": "octopus-short-strangle",
    "name": "Short Strangle",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Collect premium from both sides with wider profit zone than straddle.",
    "overview": "Oscar's short strangle is a wider short straddle. Sell OTM call AND OTM put, creating a wider profit zone. Less premium than a straddle, but more room for the stock to move.\n\nStill unlimited risk, still requires constant management. Oscar's tentacles are always busy.",
    "keyPoints": [
      "Sell OTM call above stock price",
      "Sell OTM put below stock price",
      "Wider profit zone than straddle",
      "Less premium but higher probability",
      "UNLIMITED RISK in both directions"
    ],
    "riskProfile": "EXTREME - unlimited loss both directions.",
    "maxProfit": "Total premium received",
    "maxLoss": "UNLIMITED in both directions",
    "breakeven": "Put strike - premium (lower) and Call strike + premium (upper)",
    "bestFor": "High IV. Range-bound expectations. Premium collection.",
    "avoidWhen": "Expected big move or can't monitor constantly.",
    "example": {
      "scenario": "QQQ at $440, elevated IV, expecting range-bound trading.",
      "setup": "Sell $420 put for $5 and $460 call for $5. Total credit: $10.",
      "outcome": "Max profit: $1,000 if QQQ stays between $420-$460. Breakevens: $410 and $470.",
      "numbers": {
        "stockPrice": 440,
        "strikePrice": 420,
        "premium": 10,
        "expiration": "30 days",
        "result": "$1,000 max profit, unlimited risk outside $410-$470"
      }
    },
    "tips": [
      "Choose strikes with 15-20 delta",
      "Use in high IV environments",
      "Manage at 50% profit",
      "Have defined stop-losses"
    ],
    "commonMistakes": [
      "Holding through big moves",
      "Not having stop-losses",
      "Oversizing for premium",
      "Using in low IV"
    ],
    "relatedStrategies": [
      "octopus-short-straddle",
      "octopus-iron-butterfly"
    ]
  },
  {
    "id": "octopus-iron-butterfly",
    "name": "Iron Butterfly",
    "animalId": "octopus",
    "difficulty": 4,
    "description": "Defined-risk version of the short straddle for max premium at a target.",
    "overview": "Oscar converts short straddles to iron butterflies when he wants defined risk. Sell the ATM straddle, then buy protective wings. You get the high premium of a straddle with limited risk.\n\nMaximum profit when stock lands exactly at your strike. Precision trading with protection.",
    "keyPoints": [
      "Sell ATM call and put (straddle)",
      "Buy OTM call and put (wings)",
      "High premium collection with defined risk",
      "Max profit at center strike",
      "Narrower profit zone but limited risk"
    ],
    "riskProfile": "Moderate - defined on both sides.",
    "maxProfit": "Credit received",
    "maxLoss": "Width of wing minus credit",
    "breakeven": "Center strike +/- credit received",
    "bestFor": "High IV. Expected pinning. Defined-risk premium collection.",
    "avoidWhen": "You expect significant movement.",
    "example": {
      "scenario": "IWM at $200, expecting to pin for OpEx.",
      "setup": "Sell $200 straddle, buy $190 put and $210 call. Credit: $7.",
      "outcome": "Max profit: $700 at exactly $200. Max loss: $300 beyond wings. Breakevens: $193-$207.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 7,
        "expiration": "14 days",
        "result": "$700 max profit, $300 max loss"
      }
    },
    "tips": [
      "Use for pinning plays on indexes",
      "Enter 2-3 weeks before expiration",
      "Manage early - don't wait for perfection",
      "Can adjust to condor if stock moves"
    ],
    "commonMistakes": [
      "Expecting exact pin at strike",
      "Holding too long for max profit",
      "Using on volatile individual stocks",
      "Not managing when tested"
    ],
    "relatedStrategies": [
      "octopus-short-straddle",
      "owl-iron-condor"
    ]
  },
  {
    "id": "octopus-broken-wing-butterfly",
    "name": "Broken Wing Butterfly",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Directional butterfly with asymmetric risk/reward for credit entry.",
    "overview": "Oscar's broken wing butterfly is a regular butterfly with one wing extended. This creates asymmetric payoff - often entered for a credit with risk only on one side.\n\nIt's complex, it's directional, and it requires Oscar's full attention to manage properly.",
    "keyPoints": [
      "Standard butterfly with unequal wing widths",
      "Can enter for credit",
      "Directional bias built in",
      "No risk on one side, defined on other",
      "Max profit at middle strike"
    ],
    "riskProfile": "Moderate - asymmetric, defined on one side only.",
    "maxProfit": "Narrow wing width + credit",
    "maxLoss": "Wide wing width - narrow wing - credit",
    "breakeven": "Complex - depends on structure",
    "bestFor": "Directional bias with premium collection. Earnings plays.",
    "avoidWhen": "Expecting move toward the wide wing.",
    "example": {
      "scenario": "Bearish on XYZ at $100, expecting drop to $95.",
      "setup": "Buy $100 put, sell 2x $95 puts, buy $85 put. Credit: $0.75.",
      "outcome": "Max profit at $95: $575. No risk above $100 (keep credit). Risk below $85: $425.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 0.75,
        "expiration": "21 days",
        "result": "$575 max profit at $95, $425 max loss below $85"
      }
    },
    "tips": [
      "Align broken wing with your directional thesis",
      "Enter for credit when possible",
      "Watch the wide wing side closely",
      "Great for earnings with directional lean"
    ],
    "commonMistakes": [
      "Ignoring the risk on wide wing side",
      "Using without clear directional view",
      "Over-complicating management",
      "Not taking profits when available"
    ],
    "relatedStrategies": [
      "octopus-iron-butterfly",
      "fox-broken-wing-butterfly"
    ]
  },
  {
    "id": "octopus-seagull",
    "name": "Seagull",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Complex three-legged structure for directional bias with reduced cost and unique risk profile.",
    "overview": "Oscar's Seagull is advanced portfolio management. It's a directional play (bull or bear) where you buy a spread and sell an OTM option to finance it. Named after the payoff diagram that looks like a seagull in flight.\n\nThis is multi-dimensional thinking - direction, cost reduction, and risk management all in one structure. Oscar uses this to express conviction while managing capital efficiently.",
    "keyPoints": [
      "Buy vertical spread (debit spread) for direction",
      "Sell far OTM option on opposite side to reduce cost",
      "Creates unique three-strike structure",
      "Directional play with reduced capital requirement",
      "Risk on the short option side if wrong"
    ],
    "riskProfile": "Moderate to high - defined on spread side, undefined on short option side.",
    "maxProfit": "Width of spread minus net debit (or plus net credit)",
    "maxLoss": "Net debit paid (or unlimited/large on short option side)",
    "breakeven": "Long strike of spread + net cost (for call seagull)",
    "bestFor": "Strong directional conviction with capital efficiency. Advanced traders who can monitor.",
    "avoidWhen": "Uncertain about direction or can't actively manage the short option.",
    "example": {
      "scenario": "Bullish on stock at $100. Want leveraged exposure but reduce cost.",
      "setup": "Buy $100/$110 call spread for $5, sell $80 put for $2. Net: $3 debit. (Bull call seagull)",
      "outcome": "Max profit at $110+: $7 per share = $700. Below $80: losses accelerate on short put. Breakeven: $103.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 3,
        "expiration": "45 days",
        "result": "Risk $300 to make $700, but watch that short put"
      }
    },
    "tips": [
      "Use when you have HIGH conviction on direction",
      "Place short option far enough OTM for safety",
      "Monitor the short option - be ready to adjust",
      "Close early at 50-70% of max profit"
    ],
    "commonMistakes": [
      "Selling the far option too close to current price",
      "Not understanding the risk if stock moves against you",
      "Forgetting to monitor the short leg",
      "Using on volatile stocks without protection plan"
    ],
    "relatedStrategies": [
      "octopus-broken-wing-butterfly",
      "fox-seagull",
      "wolf-seagull"
    ]
  },
  {
    "id": "octopus-jade-lizard",
    "name": "Jade Lizard",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Advanced neutral strategy with zero upside risk - asymmetric premium collection.",
    "overview": "Oscar's jade lizard is pure mathematical beauty. Sell an OTM put and an OTM call spread. The credit collected EXCEEDS the width of the call spread - meaning ZERO upside risk.\n\nThis is asymmetric risk engineering. Eight arms working in perfect coordination to create an edge.",
    "keyPoints": [
      "Sell 1 OTM put",
      "Sell 1 OTM call, buy 1 higher call",
      "Credit > width of call spread",
      "ZERO risk on upside",
      "Only risk is downside below put"
    ],
    "riskProfile": "Moderate risk - undefined below short put, zero above.",
    "maxProfit": "Total credit received",
    "maxLoss": "Put strike - credit (if stock to $0)",
    "breakeven": "Put strike - total credit",
    "bestFor": "Neutral to bullish. High IV. Premium collection with edge.",
    "avoidWhen": "Bearish or IV too low for adequate credit.",
    "example": {
      "scenario": "Stock at $100. IV elevated. Neutral bias.",
      "setup": "Sell $90 put for $4, sell $115 call for $3, buy $120 call for $1. Credit: $6.",
      "outcome": "If stock above $90: keep $600. Zero risk above $100 (credit > $5 spread width). Risk below $84.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 6,
        "expiration": "45 days",
        "result": "$600 max profit, zero upside risk"
      }
    },
    "tips": [
      "CRITICAL: Verify credit > call spread width",
      "Enter in high IV environments",
      "Manage at 50% profit",
      "Monitor put side for breaches"
    ],
    "commonMistakes": [
      "Not ensuring credit exceeds spread width",
      "Using on bearish stocks",
      "Ignoring downside management",
      "Entering in low IV"
    ],
    "relatedStrategies": [
      "octopus-iron-butterfly",
      "fox-jade-lizard"
    ]
  },
  {
    "id": "octopus-strap",
    "name": "Strap",
    "animalId": "octopus",
    "difficulty": 5,
    "description": "Bullish volatility structure - 2 calls, 1 put for asymmetric profit potential.",
    "overview": "Oscar's strap is volatility trading with directional bias. Buy 2 ATM calls and 1 ATM put. You profit from big moves either direction, but make DOUBLE on the upside.\n\nThis requires precise timing and volatility analysis. Oscar times this for when IV is low but expansion is imminent - with a bullish lean.",
    "keyPoints": [
      "Buy 2 ATM calls",
      "Buy 1 ATM put at same strike",
      "Higher cost than straddle",
      "Profit from big moves both ways",
      "2x profit on upside vs downside"
    ],
    "riskProfile": "High risk - can lose entire premium if no significant move.",
    "maxProfit": "Unlimited to upside (2 calls), large to downside (1 put)",
    "maxLoss": "Total premium paid (2 calls + 1 put)",
    "breakeven": "Strike + (total premium / 2) on upside; Strike - total premium on downside",
    "bestFor": "Bullish volatility expansion plays. Pre-earnings with upside bias.",
    "avoidWhen": "IV already elevated or no directional conviction.",
    "example": {
      "scenario": "Stock at $200. Volatility low but catalyst coming. Bullish lean.",
      "setup": "Buy 2 $200 calls for $12 each, buy 1 $200 put for $10. Total: $34.",
      "outcome": "If stock hits $300, 2 calls worth $100 each = $200. Profit: $200 - $34 = $16,600! If drops to $100, put worth $100, profit: $6,600.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 34,
        "expiration": "21 days",
        "result": "2x upside leverage vs downside"
      }
    },
    "tips": [
      "Enter when IV is low but expecting expansion",
      "Calculate both breakevens precisely",
      "Consider closing early to lock profits",
      "Size appropriately for high premium cost"
    ],
    "commonMistakes": [
      "Entering when IV already high",
      "No genuine bullish bias (use straddle)",
      "Holding too long through theta decay",
      "Not taking profits when you get the move"
    ],
    "relatedStrategies": [
      "octopus-short-straddle",
      "cheetah-strap"
    ]
  },
  {
    "id": "bear-long-put",
    "name": "Long Put",
    "animalId": "bear",
    "difficulty": 1,
    "description": "Profit from downside moves while keeping your bullish holdings.",
    "overview": "Bertha uses long puts to profit from the crashes she always sees coming. Buy puts to benefit from downside moves. If you're right, you make money while others panic.\n\nIt's also a great hedge for your portfolio. Bertha always has protection in place.",
    "keyPoints": [
      "Buy put options for bearish exposure",
      "Profit from stock declines",
      "Max loss is premium paid",
      "Great for hedging or bearish directional plays",
      "Stocks often fall faster than they rise"
    ],
    "riskProfile": "Moderate - premium paid is max loss.",
    "maxProfit": "Strike - premium (if stock goes to $0)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike - premium",
    "bestFor": "Bearish plays. Hedging. Crash protection.",
    "avoidWhen": "Stock is in strong uptrend with no signs of weakness.",
    "example": {
      "scenario": "Bertha sees weakness in XYZ at $100, expects drop to $80.",
      "setup": "Buy 1 $95 put expiring in 45 days for $4.",
      "outcome": "If XYZ drops to $80, put worth $15. Profit: $1,100 (275% return).",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 4,
        "expiration": "45 days",
        "result": "$1,100 profit at $80, $400 max loss"
      }
    },
    "tips": [
      "Wait for technical breakdown confirmation",
      "ITM puts have higher delta for faster profits",
      "Stocks fall faster - take profits quickly",
      "Consider spreads to reduce cost"
    ],
    "commonMistakes": [
      "Fighting strong uptrends",
      "Not taking profits on panic days",
      "Holding too long",
      "Buying expensive puts in high IV"
    ],
    "relatedStrategies": [
      "bear-protective-put",
      "bear-bear-put-spread"
    ]
  },
  {
    "id": "bear-protective-put",
    "name": "Protective Put",
    "animalId": "bear",
    "difficulty": 2,
    "description": "Insurance for your long positions - sleep well during crashes.",
    "overview": "Bertha's signature move - the protective put. Buy puts on stocks you own to guarantee a floor on your losses. The crash is always coming - be prepared.\n\nYes, it costs money. Yes, it's worth it. Ask anyone who had protection in 2008 or 2020.",
    "keyPoints": [
      "Own stock + buy puts on same stock",
      "Creates a floor on your losses",
      "Keep all upside potential minus put cost",
      "Peace of mind during volatility",
      "Insurance isn't free - but neither is a crash"
    ],
    "riskProfile": "Very low - downside strictly limited.",
    "maxProfit": "Unlimited upside minus put cost",
    "maxLoss": "Stock price - strike + premium",
    "breakeven": "Stock price + premium",
    "bestFor": "Protecting gains. Hedging before uncertain events. Sleeping well.",
    "avoidWhen": "Premium is too expensive relative to protection needed.",
    "example": {
      "scenario": "Own NVDA at $480 with big gains. Worried about pullback.",
      "setup": "Buy $450 put expiring in 60 days for $15.",
      "outcome": "Pay $1,500 for insurance. If NVDA crashes to $350, sell at $450. Saved $10,000 minus $1,500 = $8,500 protected.",
      "numbers": {
        "stockPrice": 480,
        "strikePrice": 450,
        "premium": 15,
        "expiration": "60 days",
        "result": "Max loss capped at $45/share, unlimited upside"
      }
    },
    "tips": [
      "Buy when you're nervous, not after the drop",
      "Use 60-90 day puts for better value",
      "Consider collars to offset cost",
      "Don't over-insure - balance cost and protection"
    ],
    "commonMistakes": [
      "Buying after the crash already happened",
      "Overpaying for protection",
      "Constantly rolling puts (expensive)",
      "Not actually using protection when offered"
    ],
    "relatedStrategies": [
      "bear-long-put",
      "bear-bear-put-spread"
    ]
  },
  {
    "id": "bear-bear-put-spread",
    "name": "Bear Put Spread",
    "animalId": "bear",
    "difficulty": 2,
    "description": "Defined-risk bearish plays that reduce the cost of being defensive.",
    "overview": "Bertha uses bear put spreads when she wants bearish exposure at reduced cost. Buy a put, sell a lower put to offset some cost. You cap your profit but reduce your risk.\n\nIt's a smart way to bet on downside without paying full put premium.",
    "keyPoints": [
      "Buy higher strike put",
      "Sell lower strike put to reduce cost",
      "Net debit to enter",
      "Max profit when stock below lower strike",
      "Defined risk equals debit paid"
    ],
    "riskProfile": "Moderate - debit paid is max loss.",
    "maxProfit": "Width of strikes minus debit",
    "maxLoss": "Debit paid",
    "breakeven": "Long strike minus debit",
    "bestFor": "Bearish plays with defined risk. Hedging at reduced cost.",
    "avoidWhen": "You expect only a small drop.",
    "example": {
      "scenario": "Bearish on AAPL at $185, expecting drop to $170.",
      "setup": "Buy $180 put for $5, sell $170 put for $2. Net debit: $3.",
      "outcome": "Max profit: $700 if AAPL below $170. Max loss: $300. Risk $300 to make $700.",
      "numbers": {
        "stockPrice": 185,
        "strikePrice": 180,
        "premium": 3,
        "expiration": "30 days",
        "result": "$700 max profit, $300 max loss"
      }
    },
    "tips": [
      "Set long strike near current price for higher delta",
      "Set short strike at your downside target",
      "Close at 50-75% max profit",
      "Great for hedging portfolio risk"
    ],
    "commonMistakes": [
      "Spreads too narrow",
      "Fighting uptrends",
      "Holding for max profit",
      "Not having a clear downside thesis"
    ],
    "relatedStrategies": [
      "bear-long-put",
      "bear-put-backspread"
    ]
  },
  {
    "id": "bear-put-backspread",
    "name": "Put Backspread",
    "animalId": "bear",
    "difficulty": 4,
    "description": "Profit from crashes with limited risk if you're wrong.",
    "overview": "Bertha's put backspread is built for crashes. Sell 1 put, buy 2 lower puts. If the market collapses, your profits accelerate. If you're wrong, losses are limited.\n\nIt's the ultimate \"I told you so\" trade for when the crash finally comes.",
    "keyPoints": [
      "Sell 1 higher strike put",
      "Buy 2+ lower strike puts",
      "Often entered for credit or small debit",
      "Profits accelerate on large down moves",
      "Limited loss if stock rallies"
    ],
    "riskProfile": "Moderate risk, unlimited reward on downside.",
    "maxProfit": "Unlimited on downside (theoretically strike price)",
    "maxLoss": "Width of strikes minus credit (if entered for credit)",
    "breakeven": "Complex - multiple breakevens",
    "bestFor": "Crash protection. Expecting volatility expansion. Black swan events.",
    "avoidWhen": "You expect only mild weakness.",
    "example": {
      "scenario": "Bertha thinks the market is due for a crash. SPY at $500.",
      "setup": "Sell 1 $490 put for $12, buy 2 $470 puts for $6 each. Net: $0.",
      "outcome": "If SPY crashes to $400, profit = $5,000. If flat or up, break even. Max loss at $470: $2,000.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 470,
        "premium": 0,
        "expiration": "30 days",
        "result": "$5,000 profit at $400, $2,000 max loss at $470"
      }
    },
    "tips": [
      "Use for tail risk hedging",
      "Enter for credit when possible",
      "Great before uncertain events",
      "Size for the risk at the short strike"
    ],
    "commonMistakes": [
      "Using as primary directional bet",
      "Not understanding the loss zone",
      "Holding too long without adjustment",
      "Expecting small moves to profit"
    ],
    "relatedStrategies": [
      "bear-bear-put-spread",
      "bear-long-put"
    ]
  },
  {
    "id": "bear-short-synthetic-future",
    "name": "Short Synthetic Future",
    "animalId": "bear",
    "difficulty": 3,
    "description": "Full bearish exposure with options - pure delta -1.0 position.",
    "overview": "Bertha's short synthetic future is for maximum bearish exposure. Sell a call, buy a put at the same strike. You get delta -1.0 - moves exactly like shorting 100 shares - but with options.\n\nThis is for when Bertha's crash conviction is absolute. Full downside exposure!",
    "keyPoints": [
      "Sell 1 ATM call",
      "Buy 1 ATM put at same strike",
      "Delta -1.0 - moves like short stock",
      "Less capital than shorting shares",
      "Full downside and upside exposure"
    ],
    "riskProfile": "High risk - same as shorting stock, unlimited loss on upside.",
    "maxProfit": "Strike - net debit (if stock to $0)",
    "maxLoss": "Unlimited (if stock rallies)",
    "breakeven": "Strike + net credit/debit",
    "bestFor": "Maximum bearish conviction. Short exposure without borrowing shares.",
    "avoidWhen": "Can't handle unlimited upside risk.",
    "example": {
      "scenario": "Stock at $200. Bertha expects crash.",
      "setup": "Sell $200 call for $11, buy $200 put for $10. Net: $1 credit.",
      "outcome": "If stock crashes to $100, profit $100 + $1 = $10,100. If rallies to $300, lose $100 - $1 = -$9,900. Moves like short stock.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 1,
        "expiration": "60 days",
        "result": "Delta -1.0 - full short exposure"
      }
    },
    "tips": [
      "Use ATM for true -1.0 delta",
      "Understand unlimited upside risk",
      "Monitor margin requirements",
      "Only use with high bearish conviction"
    ],
    "commonMistakes": [
      "Thinking this reduces risk",
      "Not understanding unlimited loss potential",
      "Using without strong thesis",
      "Ignoring early assignment risk"
    ],
    "relatedStrategies": [
      "bear-long-put",
      "wolf-short-synthetic-future"
    ]
  },
  {
    "id": "bear-bear-put-ladder",
    "name": "Bear Put Ladder",
    "animalId": "bear",
    "difficulty": 4,
    "description": "Bearish ladder for moderate declines with funded position.",
    "overview": "Bertha's bear put ladder is for controlled pessimism. Buy a put, sell two lower puts at different strikes. The sales fund the position, but create risk if the stock crashes too far.\n\nThis is for when Bertha expects a decline but not total collapse.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 1 middle strike put",
      "Sell 1 lower strike put",
      "Often entered for credit or small debit",
      "Profit zone between strikes"
    ],
    "riskProfile": "High risk - unlimited loss if stock crashes below lowest strike.",
    "maxProfit": "At middle strike (limited)",
    "maxLoss": "Unlimited below lower strike",
    "breakeven": "Upper put - debit on upside; varies on downside",
    "bestFor": "Bearish with target range. Want to reduce cost.",
    "avoidWhen": "Expecting total crash or can't monitor.",
    "example": {
      "scenario": "Stock at $100. Bertha expects drop to $85 but not below $75.",
      "setup": "Buy $100 put for $8, sell $90 put for $4, sell $80 put for $2. Net: $2 debit.",
      "outcome": "Max profit at $90: $10 - $2 = $800. Below $80, losses mount. Above $100, lose $200.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 2,
        "expiration": "45 days",
        "result": "$800 max profit at $90, unlimited risk below $80"
      }
    },
    "tips": [
      "Use when you have target decline range",
      "Monitor if approaching lower strike",
      "Close early at 50-70% profit",
      "Have plan to convert if breached"
    ],
    "commonMistakes": [
      "Not understanding unlimited downside risk",
      "Using on stocks that could crash",
      "No exit plan below lower strike",
      "Oversizing the position"
    ],
    "relatedStrategies": [
      "bear-bear-put-spread",
      "wolf-bear-put-ladder"
    ]
  },
  {
    "id": "bear-strip",
    "name": "Strip",
    "animalId": "bear",
    "difficulty": 4,
    "description": "Bearish volatility play - 2 puts, 1 call for asymmetric downside.",
    "overview": "Bertha's strip is for when volatility is coming and she's BEARISH. Buy 2 ATM puts and 1 ATM call. You profit from big moves either way, but make DOUBLE on the downside.\n\nThis is Bertha's way to profit from the crash while staying protected if she's wrong.",
    "keyPoints": [
      "Buy 2 ATM puts",
      "Buy 1 ATM call at same strike",
      "More expensive than straddle",
      "Double downside profit potential",
      "Still protected on upside"
    ],
    "riskProfile": "High risk - can lose entire premium if no move.",
    "maxProfit": "Large to downside (2 puts), unlimited to upside (1 call)",
    "maxLoss": "Total premium (2 puts + 1 call)",
    "breakeven": "Strike - (premium / 2) down, Strike + premium up",
    "bestFor": "Bearish volatility plays. Crash protection with asymmetric profit.",
    "avoidWhen": "No directional bias or IV too high.",
    "example": {
      "scenario": "Stock at $200. Expecting big move DOWN.",
      "setup": "Buy 2 $200 puts for $12 each, buy 1 $200 call for $10. Total: $34.",
      "outcome": "If stock crashes to $100, 2 puts worth $100 each = $200. Profit: $200 - $34 = $16,600! If rallies to $300, call worth $100, profit: $6,600.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 34,
        "expiration": "21 days",
        "result": "2x downside leverage vs upside"
      }
    },
    "tips": [
      "Use when bearish + expecting volatility",
      "Calculate both breakevens",
      "Take profits early on winning side",
      "Size smaller (higher cost)"
    ],
    "commonMistakes": [
      "Not having bearish bias (use straddle)",
      "Paying too much in high IV",
      "Holding too long",
      "Not understanding higher upside breakeven"
    ],
    "relatedStrategies": [
      "bear-long-put",
      "wolf-strip"
    ]
  },
  {
    "id": "bear-long-put-butterfly",
    "name": "Long Put Butterfly",
    "animalId": "bear",
    "difficulty": 3,
    "description": "Precision bearish play with low cost and defined risk.",
    "overview": "Bertha's put butterfly is for when she expects a specific decline. Buy one higher put, sell two middle puts, buy one lower put. Low cost, defined risk, big profit if stock lands at middle strike.\n\nThis is precision pessimism with limited capital at risk.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 2 middle strike puts",
      "Buy 1 lower strike put",
      "All strikes equally spaced",
      "Low cost with capped profit/loss"
    ],
    "riskProfile": "Low risk - max loss is premium paid.",
    "maxProfit": "Higher strike - middle strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Upper strike - debit, and lower strike + debit",
    "bestFor": "Bearish precision. Expecting stock at specific lower price.",
    "avoidWhen": "Uncertain direction or high volatility.",
    "example": {
      "scenario": "Stock at $100. Bertha expects drop to exactly $90.",
      "setup": "Buy $100 put for $7, sell 2 $90 puts for $4 each, buy $80 put for $2. Net: $1 debit.",
      "outcome": "At $90: worth $10 - $1 = $900 profit. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 1,
        "expiration": "30 days",
        "result": "$900 max profit at $90, $100 max loss"
      }
    },
    "tips": [
      "Enter when stock near middle strike",
      "Use in low IV",
      "Take profits at 50-70% max",
      "Avoid holding to expiration"
    ],
    "commonMistakes": [
      "Entering too early",
      "Using in expanding volatility",
      "Not managing at 50% profit",
      "Holding to expiration"
    ],
    "relatedStrategies": [
      "bear-bear-put-spread",
      "fox-long-put-butterfly"
    ]
  },
  {
    "id": "bear-long-put-condor",
    "name": "Long Put Condor",
    "animalId": "bear",
    "difficulty": 3,
    "description": "Wider-range bearish butterfly with larger profit zone.",
    "overview": "Bertha's put condor is like a butterfly with a wider wingspan. Four strikes instead of three. Buy a put, sell two middle puts at different strikes, buy a lower put.\n\nWider profit zone than butterfly, but lower max profit. For when Bertha's bearish but not precise.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 1 upper-middle put",
      "Sell 1 lower-middle put",
      "Buy 1 lower strike put",
      "Wider profit range than butterfly"
    ],
    "riskProfile": "Low risk - max loss is debit paid.",
    "maxProfit": "Middle strikes spread - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Upper strike - debit, and lower strike + debit",
    "bestFor": "Bearish range prediction. Wider target than butterfly.",
    "avoidWhen": "Expecting sharp precise move.",
    "example": {
      "scenario": "Stock at $100. Bertha expects drop to $85-$90 range.",
      "setup": "Buy $100 put for $6, sell $95 put for $4, sell $85 put for $2, buy $80 put for $1. Net: $1 debit.",
      "outcome": "Max profit in $85-$95 range: ~$400. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit in range, $100 max loss"
      }
    },
    "tips": [
      "Use for wider bearish ranges",
      "Close at 50% profit",
      "Best in low IV",
      "Monitor near expiration"
    ],
    "commonMistakes": [
      "Using when expecting sharp move",
      "Poor strike selection",
      "Holding to expiration",
      "Not closing early"
    ],
    "relatedStrategies": [
      "bear-long-put-butterfly",
      "dolphin-long-put-condor"
    ]
  },
  {
    "id": "dolphin-collar",
    "name": "Collar",
    "animalId": "dolphin",
    "difficulty": 2,
    "description": "Perfect balance of protection and participation - the graceful hedge.",
    "overview": "Diana's collar strategy is the epitome of balance. Own stock, buy a protective put, sell a covered call to pay for it. You get downside protection AND stay in the game.\n\nIt's not about maximizing gains - it's about navigating markets with grace.",
    "keyPoints": [
      "Own 100 shares of stock",
      "Buy OTM put for protection",
      "Sell OTM call to offset put cost",
      "Creates a trading range with defined outcomes",
      "Often costs zero or very little"
    ],
    "riskProfile": "Very low - both sides capped.",
    "maxProfit": "Call strike - current price + net credit (if any)",
    "maxLoss": "Current price - put strike + net debit (if any)",
    "breakeven": "Current price adjusted for net premium",
    "bestFor": "Protecting gains. Balancing risk and reward. Peaceful portfolio management.",
    "avoidWhen": "You need maximum upside exposure.",
    "example": {
      "scenario": "Own MSFT at $400 with nice gains. Want protection but stay invested.",
      "setup": "Buy $380 put for $8, sell $420 call for $8. Net cost: $0.",
      "outcome": "Protected below $380, capped above $420. Guaranteed to exit between $380-$420. Free protection.",
      "numbers": {
        "stockPrice": 400,
        "strikePrice": 380,
        "premium": 0,
        "expiration": "60 days",
        "result": "Exit guaranteed between $380-$420 at zero cost"
      }
    },
    "tips": [
      "Structure for zero or minimal cost",
      "Use wider strikes for more room",
      "Great for concentrated positions",
      "Roll as positions evolve"
    ],
    "commonMistakes": [
      "Making collars too tight",
      "Forgetting about dividends",
      "Over-collaring the portfolio",
      "Not understanding the tradeoffs"
    ],
    "relatedStrategies": [
      "dolphin-iron-condor",
      "dolphin-calendar-spread"
    ]
  },
  {
    "id": "dolphin-iron-condor",
    "name": "Iron Condor",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Balanced income from both sides with defined risk.",
    "overview": "Diana's iron condor is about balance - sell premium above AND below, stay protected with wings. You profit from the stock staying in a range, which happens more often than dramatic moves.\n\nIt's a probability game, and Diana loves probability.",
    "keyPoints": [
      "Sell OTM put spread below price",
      "Sell OTM call spread above price",
      "Collect premium from both sides",
      "Profit in a defined range",
      "Risk limited by long wings"
    ],
    "riskProfile": "Moderate - defined on both sides.",
    "maxProfit": "Total credit received",
    "maxLoss": "Wider wing width minus credit",
    "breakeven": "Short strikes +/- credit",
    "bestFor": "Range-bound markets. Balanced income. Probability trading.",
    "avoidWhen": "Expecting a big directional move.",
    "example": {
      "scenario": "QQQ at $450. Diana expects it to stay between $430-$470.",
      "setup": "Sell $435/$430 put spread, sell $465/$470 call spread. Credit: $2.",
      "outcome": "Max profit: $200 between $435-$465. Max loss: $300 beyond wings.",
      "numbers": {
        "stockPrice": 450,
        "strikePrice": 435,
        "premium": 2,
        "expiration": "30 days",
        "result": "$200 max profit, $300 max loss, ~70% probability"
      }
    },
    "tips": [
      "Choose balanced deltas on both sides",
      "Manage at 50% profit",
      "Use in higher IV environments",
      "Adjust if one side is threatened"
    ],
    "commonMistakes": [
      "Ignoring IV when entering",
      "Letting one side go deep ITM",
      "Holding to expiration",
      "Trading too large"
    ],
    "relatedStrategies": [
      "dolphin-collar",
      "dolphin-calendar-spread"
    ]
  },
  {
    "id": "dolphin-calendar-spread",
    "name": "Calendar Spread",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Profit from time passing while maintaining balanced exposure.",
    "overview": "Diana's calendar spread exploits the difference in time decay rates. Sell a near-term option, buy a longer-term option at the same strike. Time works in your favor while you stay balanced.\n\nIt's elegant, it's balanced, and it rewards patience - Diana's style.",
    "keyPoints": [
      "Sell near-term option (30 days)",
      "Buy longer-term option at same strike (60+ days)",
      "Net debit to enter",
      "Profits from theta differential",
      "Best when stock stays near strike"
    ],
    "riskProfile": "Moderate - debit paid is max loss.",
    "maxProfit": "Variable - depends on IV and stock price at front expiration",
    "maxLoss": "Debit paid",
    "breakeven": "Complex - depends on IV",
    "bestFor": "Stocks expected to consolidate. Balanced theta plays. IV expansion.",
    "avoidWhen": "Expecting a big move or IV crush.",
    "example": {
      "scenario": "GOOGL at $175, expecting consolidation around this level.",
      "setup": "Sell $175 call (30 days) for $6, buy $175 call (60 days) for $10. Debit: $4.",
      "outcome": "If GOOGL stays at $175, front call expires, back call worth ~$8-10. Profit: $400-600.",
      "numbers": {
        "stockPrice": 175,
        "strikePrice": 175,
        "premium": 4,
        "expiration": "30/60 days",
        "result": "$400-600 potential profit, $400 max risk"
      }
    },
    "tips": [
      "Use ATM strikes for maximum theta capture",
      "Enter in lower IV environments",
      "Close before front expiration",
      "Watch for IV changes between months"
    ],
    "commonMistakes": [
      "Using in high IV (IV crush hurts)",
      "Holding through front expiration",
      "Expecting big moves",
      "Ignoring IV risk"
    ],
    "relatedStrategies": [
      "dolphin-collar",
      "dolphin-iron-condor"
    ]
  },
  {
    "id": "dolphin-covered-call",
    "name": "Graceful Income",
    "animalId": "dolphin",
    "difficulty": 1,
    "description": "Generate consistent income while maintaining your long-term positions.",
    "overview": "Diana's Graceful Income strategy is covered calls done with balance and intelligence. Own quality stocks, sell calls against them, collect premium month after month. It's steady, it's consistent, it's graceful.\n\nThis isn't about chasing premium - it's about sustainable income that lets you stay invested long-term.",
    "keyPoints": [
      "Own 100 shares of quality stock",
      "Sell OTM calls above current price",
      "Collect premium immediately",
      "Keep shares if below strike, sell at profit if above",
      "Repeat process monthly for consistent income"
    ],
    "riskProfile": "Very low risk - you own the underlying, just limiting upside.",
    "maxProfit": "Strike price - stock cost + total premiums collected",
    "maxLoss": "Stock price decline to zero minus premiums (same as owning stock)",
    "breakeven": "Original cost basis - all premiums collected",
    "bestFor": "Long-term investors seeking income. Quality dividend stocks. Balanced portfolios.",
    "avoidWhen": "Expecting explosive rally or on stocks you never want to sell.",
    "example": {
      "scenario": "Own 100 shares of Disney (DIS) at $95. Want to generate income.",
      "setup": "Sell 1 DIS $105 call expiring in 45 days for $2.50.",
      "outcome": "Collect $250 premium. If DIS stays below $105, keep shares and premium. If above $105, sell at $105 for $10/share gain + $2.50 premium = $1,250 total profit.",
      "numbers": {
        "stockPrice": 95,
        "strikePrice": 105,
        "premium": 2.5,
        "expiration": "45 days",
        "result": "$250 income or $1,250 total profit if called away"
      }
    },
    "tips": [
      "Choose strikes that allow for reasonable appreciation",
      "Use on stocks with good fundamentals",
      "Sell 30-45 days out for optimal time decay",
      "Be willing to let shares go at the strike price"
    ],
    "commonMistakes": [
      "Using on growth stocks you want to keep forever",
      "Strikes too close causing constant assignments",
      "Not having a plan if stock drops significantly",
      "Chasing premium over protecting the position"
    ],
    "relatedStrategies": [
      "dolphin-collar",
      "dolphin-calendar-spread"
    ]
  },
  {
    "id": "dolphin-diagonal-spread",
    "name": "Balanced Diagonal",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Combine time decay and directional bias with elegant precision.",
    "overview": "Diana's Balanced Diagonal combines the best of calendars and verticals. Buy a longer-dated option, sell a shorter-dated option at a different strike. You profit from time decay AND directional movement - balanced perfection.\n\nThis is options trading at its most elegant. Multiple profit sources, defined risk, adaptable.",
    "keyPoints": [
      "Buy longer-dated option (60-90 days)",
      "Sell shorter-dated option at different strike (30 days)",
      "Profit from theta decay differential",
      "Directional exposure maintained",
      "Can roll short option repeatedly"
    ],
    "riskProfile": "Moderate - net debit paid is primary risk.",
    "maxProfit": "Variable - depends on management and price movement",
    "maxLoss": "Net debit paid (worst case)",
    "breakeven": "Complex - depends on time, IV, and strike selection",
    "bestFor": "Moderate directional bias with time on your side. Reducing option costs.",
    "avoidWhen": "Need immediate directional exposure or can't actively manage.",
    "example": {
      "scenario": "Moderately bullish on MSFT at $400. Want theta working for you.",
      "setup": "Buy $390 call (90 days) for $20, sell $410 call (30 days) for $6. Net: $14.",
      "outcome": "If MSFT rises to $410, short call expires, long call gains. Profit potential: $400-800. Can roll short call monthly.",
      "numbers": {
        "stockPrice": 400,
        "strikePrice": 390,
        "premium": 14,
        "expiration": "30/90 days",
        "result": "Risk $1,400 for potential $400-800+ profit"
      }
    },
    "tips": [
      "Match strikes to your directional thesis",
      "Plan to roll the short option 3-4 times",
      "Monitor IV changes - they affect legs differently",
      "Close if profit reaches 50-75% early"
    ],
    "commonMistakes": [
      "Not understanding the complex P/L dynamics",
      "Letting short option go deep ITM without rolling",
      "Ignoring IV risk on both legs",
      "Over-adjusting the position"
    ],
    "relatedStrategies": [
      "dolphin-calendar-spread",
      "fox-diagonal-spread"
    ]
  },
  {
    "id": "dolphin-long-call-butterfly",
    "name": "Long Call Butterfly",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Balanced precision play with low cost and defined risk.",
    "overview": "Diana's call butterfly is elegance incarnate. Buy low call, sell two middle calls, buy high call. Low cost, defined risk, maximum profit if stock lands precisely in the middle.\n\nThis is for balanced traders who prefer precision over aggression.",
    "keyPoints": [
      "Buy 1 lower strike call",
      "Sell 2 middle strike calls",
      "Buy 1 higher strike call",
      "All strikes equally spaced",
      "Low cost, capped profit/loss"
    ],
    "riskProfile": "Low risk - max loss is premium paid.",
    "maxProfit": "Middle strike - lower strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Lower strike + debit, and upper strike - debit",
    "bestFor": "Neutral plays. Low volatility. Specific price targets.",
    "avoidWhen": "High volatility or uncertain direction.",
    "example": {
      "scenario": "Stock at $100. Diana expects it to settle at $105.",
      "setup": "Buy $100 call for $7, sell 2 $105 calls for $4 each, buy $110 call for $2. Net: $1 debit.",
      "outcome": "At $105: worth $5 - $1 = $400 profit. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 105,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit at $105, $100 max loss"
      }
    },
    "tips": [
      "Enter when stock near middle strike",
      "Use in low IV",
      "Close at 50-70% max profit",
      "Best 30-45 days out"
    ],
    "commonMistakes": [
      "Entering too far from middle strike",
      "Using in high IV",
      "Holding to expiration",
      "Not taking early profits"
    ],
    "relatedStrategies": [
      "dolphin-long-put-butterfly",
      "fox-long-call-butterfly"
    ]
  },
  {
    "id": "dolphin-long-put-butterfly",
    "name": "Long Put Butterfly",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Bearish precision with balanced risk/reward.",
    "overview": "Diana's put butterfly mirrors the call version. Buy high put, sell two middle puts, buy low put. Perfect for when you expect a specific decline with grace.\n\nBalanced, defined risk, elegant profit profile.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 2 middle strike puts",
      "Buy 1 lower strike put",
      "All strikes equally spaced",
      "Low cost, capped profit/loss"
    ],
    "riskProfile": "Low risk - max loss is premium paid.",
    "maxProfit": "Higher strike - middle strike - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Upper strike - debit, and lower strike + debit",
    "bestFor": "Bearish precision. Specific lower price targets.",
    "avoidWhen": "High volatility or uncertain direction.",
    "example": {
      "scenario": "Stock at $100. Diana expects drop to $95.",
      "setup": "Buy $100 put for $7, sell 2 $95 puts for $4 each, buy $90 put for $2. Net: $1 debit.",
      "outcome": "At $95: worth $5 - $1 = $400 profit. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 95,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit at $95, $100 max loss"
      }
    },
    "tips": [
      "Enter when stock near middle strike",
      "Use in low IV",
      "Close at 50-70% profit",
      "Avoid holding to expiration"
    ],
    "commonMistakes": [
      "Entering too early",
      "Using in expanding volatility",
      "Not managing early",
      "Holding to expiration"
    ],
    "relatedStrategies": [
      "dolphin-long-call-butterfly",
      "fox-long-put-butterfly"
    ]
  },
  {
    "id": "dolphin-long-call-condor",
    "name": "Long Call Condor",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Wider butterfly with more forgiving profit zone.",
    "overview": "Diana's call condor is the butterfly's more forgiving cousin. Four strikes with wider middle range. Buy call, sell two middle calls at different strikes, buy higher call.\n\nWider profit zone, lower max profit - the epitome of balance.",
    "keyPoints": [
      "Buy 1 lower strike call",
      "Sell 1 lower-middle call",
      "Sell 1 upper-middle call",
      "Buy 1 higher strike call",
      "Wider profit range than butterfly"
    ],
    "riskProfile": "Low risk - max loss is debit paid.",
    "maxProfit": "Middle strikes spread - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Lower strike + debit, and upper strike - debit",
    "bestFor": "Neutral range predictions. More flexibility than butterfly.",
    "avoidWhen": "Expecting sharp moves.",
    "example": {
      "scenario": "Stock at $100. Diana expects $105-$110 range.",
      "setup": "Buy $100 call for $6, sell $105 call for $4, sell $110 call for $2, buy $115 call for $1. Net: $1 debit.",
      "outcome": "Max profit in $105-$110 range: ~$400. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 107.5,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit in range, $100 max loss"
      }
    },
    "tips": [
      "Use for wider neutral ranges",
      "Close at 50% profit",
      "Best in low IV",
      "Monitor near expiration"
    ],
    "commonMistakes": [
      "Using when expecting sharp moves",
      "Poor strike selection",
      "Holding to expiration",
      "Not closing early"
    ],
    "relatedStrategies": [
      "dolphin-long-put-condor",
      "dolphin-iron-condor"
    ]
  },
  {
    "id": "dolphin-long-put-condor",
    "name": "Long Put Condor",
    "animalId": "dolphin",
    "difficulty": 3,
    "description": "Bearish-neutral condor with wide profit zone.",
    "overview": "Diana's put condor is graceful pessimism. Buy high put, sell two middle puts at different strikes, buy low put. Wider profit zone than butterfly.\n\nBalanced bearish play with forgiveness built in.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 1 upper-middle put",
      "Sell 1 lower-middle put",
      "Buy 1 lower strike put",
      "Wider profit range than butterfly"
    ],
    "riskProfile": "Low risk - max loss is debit paid.",
    "maxProfit": "Middle strikes spread - net debit",
    "maxLoss": "Net debit paid",
    "breakeven": "Upper strike - debit, and lower strike + debit",
    "bestFor": "Bearish range predictions. Wider targets.",
    "avoidWhen": "Expecting sharp precise moves.",
    "example": {
      "scenario": "Stock at $100. Diana expects $85-$90 range.",
      "setup": "Buy $100 put for $6, sell $95 put for $4, sell $85 put for $2, buy $80 put for $1. Net: $1 debit.",
      "outcome": "Max profit in $85-$95 range: ~$400. Max loss: $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 1,
        "expiration": "30 days",
        "result": "$400 max profit in range, $100 max loss"
      }
    },
    "tips": [
      "Use for wider bearish ranges",
      "Close at 50% profit",
      "Best in low IV",
      "Monitor near expiration"
    ],
    "commonMistakes": [
      "Using for sharp moves",
      "Poor strike selection",
      "Holding to expiration",
      "Not closing early"
    ],
    "relatedStrategies": [
      "dolphin-long-call-condor",
      "bear-long-put-condor"
    ]
  },
  {
    "id": "dolphin-seagull",
    "name": "Seagull",
    "animalId": "dolphin",
    "difficulty": 4,
    "description": "Balanced directional play with reduced cost and managed risk.",
    "overview": "Diana's seagull is directional balance. Buy a call spread (or put spread), sell an OTM option on the opposite side to reduce cost. Named after the payoff that looks like a seagull.\n\nDirectional with capital efficiency - the dolphin way.",
    "keyPoints": [
      "Buy vertical spread for direction",
      "Sell far OTM option opposite side",
      "Reduces position cost",
      "Directional with defined profit zone",
      "Risk on short option side"
    ],
    "riskProfile": "Moderate - defined on spread side, undefined on short option.",
    "maxProfit": "Width of spread - net cost",
    "maxLoss": "Net debit or large on short option side",
    "breakeven": "Long strike of spread + net cost",
    "bestFor": "Directional conviction with capital efficiency.",
    "avoidWhen": "Uncertain direction or can't monitor short option.",
    "example": {
      "scenario": "Bullish on stock at $100. Want balanced exposure.",
      "setup": "Buy $100/$110 call spread for $5, sell $85 put for $2. Net: $3 debit.",
      "outcome": "Max profit at $110+: $7 = $700. Below $85: losses on short put. Breakeven: $103.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 105,
        "premium": 3,
        "expiration": "45 days",
        "result": "Risk $300 to make $700, balanced approach"
      }
    },
    "tips": [
      "Use with moderate directional conviction",
      "Place short option safely OTM",
      "Monitor short option",
      "Close at 50-70% profit"
    ],
    "commonMistakes": [
      "Selling short option too close",
      "Not understanding short option risk",
      "Not monitoring position",
      "Using on high volatility"
    ],
    "relatedStrategies": [
      "dolphin-collar",
      "fox-seagull"
    ]
  },
  {
    "id": "chameleon-long-straddle",
    "name": "Event Straddle",
    "animalId": "chameleon",
    "difficulty": 3,
    "description": "Profit from big moves around binary events like earnings or FDA decisions.",
    "overview": "The Event Straddle is Cameron's signature move for binary events. Buy both a call and a put at the same strike, positioned for a big move in either direction. When the event hits, one side explodes in value.\n\nPerfect for earnings announcements, FDA decisions, or any catalyst where you expect fireworks but don't know which direction.",
    "keyPoints": [
      "Buy ATM call and ATM put with same strike and expiration",
      "Profit when stock moves big in either direction",
      "Time entry just before the catalyst event",
      "IV crush after the event is your enemy - factor it in",
      "Need the move to exceed the combined premium paid"
    ],
    "riskProfile": "Limited risk - max loss is the total premium paid.",
    "maxProfit": "Unlimited on the upside, substantial on the downside",
    "maxLoss": "Total premium paid for both options",
    "breakeven": "Strike ± total premium paid",
    "bestFor": "Binary events. Earnings with history of big moves. FDA decisions. Legal rulings.",
    "avoidWhen": "IV is already extremely elevated. The expected move is priced in.",
    "example": {
      "scenario": "Tesla earnings tonight. Stock at $250. Historical moves of 10%+ after earnings.",
      "setup": "Buy 1 TSLA $250 call for $12 and 1 TSLA $250 put for $11. Total cost: $23.",
      "outcome": "Need TSLA to move above $273 or below $227 to profit. If it moves 12% ($30), one side is worth ~$30, profit of $7.",
      "numbers": {
        "stockPrice": 250,
        "strikePrice": 250,
        "premium": 23,
        "expiration": "2 days",
        "result": "Profit if move exceeds 9.2% in either direction"
      }
    },
    "tips": [
      "Research historical moves for the specific event",
      "Compare implied move to historical average moves",
      "Enter close to the event to minimize theta decay",
      "Consider selling before announcement to avoid IV crush"
    ],
    "commonMistakes": [
      "Ignoring IV crush - the move must exceed what's priced in",
      "Buying too early and losing to time decay",
      "Not understanding the expected move calculation",
      "Holding through the event without a plan"
    ],
    "relatedStrategies": [
      "chameleon-long-strangle",
      "chameleon-iron-butterfly"
    ]
  },
  {
    "id": "chameleon-long-strangle",
    "name": "Wide Event Strangle",
    "animalId": "chameleon",
    "difficulty": 3,
    "description": "A cheaper alternative to the straddle for event plays - needs a bigger move.",
    "overview": "The Wide Event Strangle is Cameron's budget-friendly event play. Buy an OTM call and an OTM put, reducing your cost but requiring a larger move to profit.\n\nUse this when you expect fireworks but want to risk less capital. The tradeoff: you need a bigger move to break even.",
    "keyPoints": [
      "Buy OTM call (above current price) and OTM put (below)",
      "Lower cost than a straddle but needs bigger move",
      "Works when you expect extreme volatility",
      "Both options can expire worthless if stock stays range-bound",
      "Wider strikes = lower cost but higher breakeven"
    ],
    "riskProfile": "Limited risk - max loss is the total premium paid.",
    "maxProfit": "Unlimited on upside, substantial on downside",
    "maxLoss": "Total premium paid",
    "breakeven": "Call strike + total premium OR put strike - total premium",
    "bestFor": "Events where you expect massive moves. Lower capital requirements.",
    "avoidWhen": "You only expect a moderate move. IV is astronomical.",
    "example": {
      "scenario": "Biotech FDA decision. Stock at $100. Binary outcome - approval or rejection.",
      "setup": "Buy $110 call for $4 and $90 put for $3. Total cost: $7.",
      "outcome": "Need stock above $117 or below $83 to profit. On approval, stock might hit $140 (call worth $30). On rejection, might hit $60 (put worth $30).",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 110,
        "premium": 7,
        "expiration": "5 days",
        "result": "Need 17%+ move to profit"
      }
    },
    "tips": [
      "Use for truly binary events with extreme potential moves",
      "Calculate your breakevens before entering",
      "Consider the probability of each outcome",
      "Can sell one side after the event if direction is clear"
    ],
    "commonMistakes": [
      "Using for events with typically small moves",
      "Strikes too wide - requiring unrealistic moves",
      "Not accounting for IV crush impact",
      "Holding losing positions hoping for a reversal"
    ],
    "relatedStrategies": [
      "chameleon-long-straddle",
      "chameleon-iron-condor"
    ]
  },
  {
    "id": "chameleon-iron-condor",
    "name": "Post-Event Iron Condor",
    "animalId": "chameleon",
    "difficulty": 3,
    "description": "Sell premium after the event when IV crushes and the stock settles.",
    "overview": "The Post-Event Iron Condor is Cameron's follow-up move. After an event passes and IV crushes, sell an iron condor to capture the remaining inflated premium as the stock settles into a range.\n\nThis is playing the other side - profiting from the calm after the storm instead of the storm itself.",
    "keyPoints": [
      "Enter AFTER the event when IV has crushed but is still elevated",
      "Sell OTM put spread and OTM call spread",
      "Profit from continued IV decline and range-bound action",
      "Stock has \"digested\" the news and found new range",
      "Time decay works in your favor"
    ],
    "riskProfile": "Defined risk - max loss is spread width minus credit.",
    "maxProfit": "Net credit received",
    "maxLoss": "Spread width - credit received",
    "breakeven": "Short strikes ± credit received",
    "bestFor": "Post-earnings plays. After FDA decisions. When IV is still elevated post-event.",
    "avoidWhen": "Stock is still moving erratically. More catalysts coming soon.",
    "example": {
      "scenario": "Apple reported earnings. Stock moved 5%, now at $190. IV still elevated at 35%.",
      "setup": "Sell $180/$175 put spread and $200/$205 call spread for $1.50 total credit.",
      "outcome": "If AAPL stays between $180-$200 for 2 weeks, keep full $150 credit. Max loss $350 if it breaks either side.",
      "numbers": {
        "stockPrice": 190,
        "strikePrice": 180,
        "premium": 1.5,
        "expiration": "14 days",
        "result": "Max profit $150, max loss $350"
      }
    },
    "tips": [
      "Wait 1-2 days after event for dust to settle",
      "Check that IV is still above normal levels",
      "Use wider wings in uncertain environments",
      "Manage at 50% profit to reduce risk"
    ],
    "commonMistakes": [
      "Entering before the event (wrong strategy)",
      "Not waiting for the initial move to complete",
      "Ignoring upcoming secondary catalysts",
      "Making strikes too tight in volatile names"
    ],
    "relatedStrategies": [
      "chameleon-iron-butterfly",
      "chameleon-calendar-spread"
    ]
  },
  {
    "id": "chameleon-iron-butterfly",
    "name": "Event Pin Play",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Bet on a stock pinning to a specific price after an event.",
    "overview": "The Event Pin Play is Cameron's precision strike. When you believe a stock will land at a specific price after an event (often a round number or key technical level), the iron butterfly maximizes profit at that exact strike.\n\nHigher risk, higher reward than the iron condor. Use when you have a specific price target.",
    "keyPoints": [
      "Sell ATM call and ATM put at your target pin price",
      "Buy OTM wings for protection",
      "Maximum profit if stock lands exactly at short strikes",
      "Higher credit than iron condor but narrower profit zone",
      "Requires precise prediction of landing price"
    ],
    "riskProfile": "Defined risk - but narrow profit zone.",
    "maxProfit": "Net credit received (at the exact strike)",
    "maxLoss": "Wing width - credit received",
    "breakeven": "Short strike ± credit received",
    "bestFor": "When you have a specific target price. Round number pins. Key support/resistance.",
    "avoidWhen": "High uncertainty about landing price. Very volatile names.",
    "example": {
      "scenario": "Netflix at $680 before earnings. You think it lands near $700 round number.",
      "setup": "Sell $700 straddle, buy $690 put and $710 call for $6.00 net credit.",
      "outcome": "If NFLX pins at $700, keep $600. Max loss $400 if it moves beyond wings.",
      "numbers": {
        "stockPrice": 680,
        "strikePrice": 700,
        "premium": 6,
        "expiration": "3 days",
        "result": "Max profit $600 at $700, max loss $400"
      }
    },
    "tips": [
      "Target round numbers or key technical levels",
      "Works best when you have edge on landing price",
      "Use tighter wings for more credit but more risk",
      "Close early if stock moves away from target"
    ],
    "commonMistakes": [
      "Overconfidence in predicting exact price",
      "Using on highly volatile names",
      "Not closing when the pin thesis is broken",
      "Ignoring the narrow profit zone reality"
    ],
    "relatedStrategies": [
      "chameleon-iron-condor",
      "chameleon-calendar-spread"
    ]
  },
  {
    "id": "chameleon-calendar-spread",
    "name": "IV Crush Calendar",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Exploit the IV difference between pre-event and post-event options.",
    "overview": "The IV Crush Calendar is Cameron's sophisticated play on volatility term structure. Sell the expensive pre-event options and buy the cheaper post-event dated options. Profit when IV crushes the front month.\n\nThis trade bets that IV will crush after the event while your longer-dated option retains value.",
    "keyPoints": [
      "Sell near-term option covering the event (high IV)",
      "Buy longer-term option past the event (lower IV)",
      "Profit from IV crush in the front month",
      "Stock needs to stay near strike price",
      "Complex Greeks management required"
    ],
    "riskProfile": "Defined risk - max loss is debit paid.",
    "maxProfit": "Variable - depends on IV collapse and stock position",
    "maxLoss": "Net debit paid",
    "breakeven": "Complex - depends on IV changes",
    "bestFor": "When front-month IV is significantly elevated. Earnings calendar plays.",
    "avoidWhen": "IV term structure is flat. Stock likely to move far from strike.",
    "example": {
      "scenario": "Amazon earnings in 5 days. Front-month IV 45%, back-month IV 32%.",
      "setup": "Sell $185 call expiring in 5 days for $8. Buy $185 call expiring in 35 days for $12. Net debit: $4.",
      "outcome": "If AMZN stays near $185 and front-month IV crushes to 25%, front call worth $2, back call worth $10. Spread value: $8. Profit: $4.",
      "numbers": {
        "stockPrice": 185,
        "strikePrice": 185,
        "premium": 4,
        "expiration": "5/35 days",
        "result": "Potential 100% return if IV crushes as expected"
      }
    },
    "tips": [
      "Check IV term structure before entering",
      "Need significant IV premium in front month",
      "Close before event if profitable",
      "Have a plan if stock moves significantly"
    ],
    "commonMistakes": [
      "Ignoring stock movement risk",
      "Not understanding Vega exposure across expirations",
      "Holding through the event expecting more gains",
      "Using when IV term structure doesn't justify the trade"
    ],
    "relatedStrategies": [
      "chameleon-iron-condor",
      "chameleon-long-straddle"
    ]
  },
  {
    "id": "chameleon-long-guts",
    "name": "Long Guts",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Aggressive volatility play - buy ITM call and put for maximum delta exposure.",
    "overview": "Cameron's Long Guts is for when both markets - options and prediction - are screaming that a massive move is coming. Instead of buying ATM options (straddle), you buy ITM call and ITM put. Higher cost, but more intrinsic value and less theta decay.\n\nThis is for events where you know something big is happening, and you want maximum directional exposure when it does.",
    "keyPoints": [
      "Buy ITM call (in-the-money)",
      "Buy ITM put (in-the-money)",
      "More expensive than straddle",
      "Higher delta = more directional exposure",
      "Less theta decay (more intrinsic value)"
    ],
    "riskProfile": "High risk - high premium paid, but mostly intrinsic value.",
    "maxProfit": "Unlimited to upside (call), substantial to downside (put)",
    "maxLoss": "Total premium paid minus intrinsic value",
    "breakeven": "Call strike + total premium, Put strike - total premium",
    "bestFor": "High-conviction binary events. When prediction markets signal big move. Aggressive volatility plays.",
    "avoidWhen": "Uncertain about size of move or can't afford the premium.",
    "example": {
      "scenario": "Election night. Prediction markets showing 50/50. HUGE move expected. SPY at $500.",
      "setup": "Buy $490 call (ITM) for $26, buy $510 put (ITM) for $26. Total: $52.",
      "outcome": "If SPY hits $600, call worth $110, profit: $5,800. If SPY drops to $400, put worth $110, profit: $5,800. Intrinsic: $20, time premium at risk: $32.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 490,
        "premium": 52,
        "expiration": "7 days",
        "result": "Need move beyond $458 or $542 to profit"
      }
    },
    "tips": [
      "Use when prediction markets + options both signal volatility",
      "Higher delta means faster profits when move happens",
      "Less theta decay than ATM straddles",
      "Calculate intrinsic vs extrinsic before entering"
    ],
    "commonMistakes": [
      "Not understanding you're paying for intrinsic value",
      "Using when move won't be large enough",
      "Holding too long after event (still have time decay)",
      "Not comparing to straddle cost/benefit"
    ],
    "relatedStrategies": [
      "chameleon-long-straddle",
      "chameleon-short-guts"
    ]
  },
  {
    "id": "chameleon-short-guts",
    "name": "Short Guts",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Sell ITM options when both markets suggest volatility is overpriced.",
    "overview": "Cameron's Short Guts is the inverse - when options AND prediction markets are both screaming about a move, but Cameron's analysis says they're both wrong. Sell ITM call and ITM put. Collect massive premium. If the stock stays put, you win big.\n\nWarning: This is high risk. Only for when BOTH market signals are clearly overpriced.",
    "keyPoints": [
      "Sell ITM call (in-the-money)",
      "Sell ITM put (in-the-money)",
      "Collect large premium",
      "Profit if stock stays relatively stable",
      "HIGH RISK - unlimited on one side, substantial on other"
    ],
    "riskProfile": "VERY HIGH RISK - large losses if stock moves significantly.",
    "maxProfit": "Total premium collected minus intrinsic value given up",
    "maxLoss": "Unlimited to upside (short call), substantial to downside (short put)",
    "breakeven": "Call strike + premium collected, Put strike - premium collected",
    "bestFor": "When both markets overprice an event. Contrarian volatility plays. Experienced traders only.",
    "avoidWhen": "Any uncertainty about the event outcome. Beginners should avoid entirely.",
    "example": {
      "scenario": "Earnings event. Everyone expects 20% move. You think 5% max. Stock at $100.",
      "setup": "Sell $90 put (ITM) for $15, sell $110 call (ITM) for $15. Total credit: $30.",
      "outcome": "If stock stays near $100, keep most of premium. But if stock hits $80 or $120, significant losses. Breakevens: $60 and $140.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 30,
        "expiration": "14 days",
        "result": "Collect $3,000 premium but exposed to large moves"
      }
    },
    "tips": [
      "Only when BOTH options and prediction markets overprice",
      "Have hedges or adjustment plan ready",
      "Monitor constantly - this can go wrong fast",
      "Consider using a wider short strangle instead (lower risk)"
    ],
    "commonMistakes": [
      "Underestimating the move that could happen",
      "Not monitoring position constantly",
      "Over-sizing position",
      "Using without both market signals supporting thesis"
    ],
    "relatedStrategies": [
      "chameleon-short-straddle",
      "chameleon-long-guts"
    ]
  },
  {
    "id": "chameleon-short-strangle",
    "name": "Post-Event Short Strangle",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Sell OTM options after event when IV crushes for premium collection.",
    "overview": "Cameron's short strangle is for AFTER the event. IV has crushed, the dust has settled, and now inflated premium remains. Sell OTM call and put, profit from the calm.\n\nThis is playing the aftermath - when everyone else is done, Cameron collects.",
    "keyPoints": [
      "Enter AFTER event when IV crushed",
      "Sell OTM call and OTM put",
      "Collect premium from both sides",
      "Profit if stock stays in range",
      "UNLIMITED RISK both directions"
    ],
    "riskProfile": "HIGH RISK - unlimited both directions, but post-event probabilities favor range.",
    "maxProfit": "Total premium collected",
    "maxLoss": "Unlimited both directions",
    "breakeven": "Call strike + premium, Put strike - premium",
    "bestFor": "Post-event calm. IV still elevated but move complete.",
    "avoidWhen": "More events coming or IV not elevated enough.",
    "example": {
      "scenario": "Earnings passed. Stock at $100. IV crushed from 80 to 40 but still elevated.",
      "setup": "Sell $110 call for $3, sell $90 put for $3. Credit: $6.",
      "outcome": "Max profit $600 if stock stays $90-$110. Breakevens: $84 and $116.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 6,
        "expiration": "14 days",
        "result": "$600 max profit, unlimited risk outside range"
      }
    },
    "tips": [
      "Wait for IV to crush first",
      "Ensure no more catalysts coming",
      "Use on indexes for more stability",
      "Have adjustment plan ready"
    ],
    "commonMistakes": [
      "Entering before event",
      "Not checking for follow-up catalysts",
      "No monitoring plan",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "chameleon-iron-condor",
      "wolf-short-strangle"
    ]
  },
  {
    "id": "chameleon-broken-wing-butterfly",
    "name": "Event Broken-Wing Butterfly",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Asymmetric butterfly for directional bias with event volatility edge.",
    "overview": "Cameron's broken-wing butterfly is for events with directional lean. Like a regular butterfly but with one wing moved for asymmetry. Often entered for credit, skews profit toward expected direction.\n\nThis is event trading with an angle - capture the move AND the edge.",
    "keyPoints": [
      "Like butterfly but strikes not equally spaced",
      "One wing moved for directional bias",
      "Often entered for credit",
      "Profit zone skewed to expected side",
      "Defined risk with asymmetric reward"
    ],
    "riskProfile": "Low to moderate - defined on both sides but asymmetric.",
    "maxProfit": "At short strikes (asymmetric)",
    "maxLoss": "Defined based on wing widths",
    "breakeven": "Multiple - depends on structure",
    "bestFor": "Events with directional lean. Capturing edge with skew.",
    "avoidWhen": "No directional conviction or uncertain outcome.",
    "example": {
      "scenario": "Earnings. Stock at $100. Slight bullish lean expected.",
      "setup": "Buy $95 call, sell 2 $100 calls, buy $110 call (wider upside wing). Credit: $1.",
      "outcome": "Max profit at $100: $400. Bullish bias accommodated. Max loss: $400 below, $900 above.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 1,
        "expiration": "7 days",
        "result": "Profit zone favors slight bullish move"
      }
    },
    "tips": [
      "Move wing on side you think less likely",
      "Try for credit entry",
      "Understand asymmetric risk",
      "Close early if move happens"
    ],
    "commonMistakes": [
      "Not understanding risk on wider wing",
      "Wrong directional bias",
      "Poor strike selection",
      "Holding to expiration"
    ],
    "relatedStrategies": [
      "chameleon-iron-butterfly",
      "fox-broken-wing-butterfly"
    ]
  },
  {
    "id": "chameleon-double-diagonal",
    "name": "Event Double Diagonal",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Multi-expiration strategy for before and after event volatility.",
    "overview": "Cameron's double diagonal spans the event. Sell near-term options at different strikes, buy longer-term protection. Collect premium before event, adjust after.\n\nThis is multi-dimensional event trading - time, volatility, and direction all at play.",
    "keyPoints": [
      "Sell near-term call and put (around event)",
      "Buy longer-term call and put (different strikes)",
      "Profit from time decay differential",
      "Adjust after event when near-term expires",
      "Complex multi-leg position"
    ],
    "riskProfile": "Moderate - defined with long options, but requires management.",
    "maxProfit": "Premium decay of short options",
    "maxLoss": "Net debit or strikes minus credit",
    "breakeven": "Complex - multiple breakevens based on time and strikes",
    "bestFor": "Pre-event setup with post-event adjustment plan.",
    "avoidWhen": "Can't actively manage or uncertain about event timing.",
    "example": {
      "scenario": "Stock at $100. Earnings in 30 days. Expecting $95-$105 range.",
      "setup": "Sell 30-day $105 call + $95 put. Buy 60-day $110 call + $90 put. Net: $2 credit.",
      "outcome": "If stock stays range: near-term decays, keep credit. After event: adjust longs based on new reality.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 2,
        "expiration": "30/60 days",
        "result": "Profit from time decay in range, protected beyond"
      }
    },
    "tips": [
      "Enter 30-45 days before event",
      "Have adjustment plan post-event",
      "Monitor IV changes closely",
      "Can convert to other strategies"
    ],
    "commonMistakes": [
      "Not understanding complexity",
      "No post-event plan",
      "Ignoring IV dynamics",
      "Over-adjusting"
    ],
    "relatedStrategies": [
      "chameleon-iron-condor",
      "fox-double-diagonal"
    ]
  },
  {
    "id": "chameleon-seagull",
    "name": "Event Seagull",
    "animalId": "chameleon",
    "difficulty": 4,
    "description": "Directional event play with reduced cost and managed risk profile.",
    "overview": "Cameron's event seagull is for directional event bets. Buy a call spread (or put spread), sell an OTM option opposite side. Reduces cost, creates unique risk/reward for event outcomes.\n\nThis is event directionality with capital efficiency built in.",
    "keyPoints": [
      "Buy vertical spread for event direction",
      "Sell far OTM option opposite side",
      "Reduces net cost",
      "Directional event exposure",
      "Risk on short option side if wrong"
    ],
    "riskProfile": "Moderate to high - defined on spread, undefined on short option.",
    "maxProfit": "Width of spread - net cost",
    "maxLoss": "Net debit or large on short option side",
    "breakeven": "Long strike of spread + net cost",
    "bestFor": "Directional event conviction with capital efficiency.",
    "avoidWhen": "Uncertain about direction or can't monitor short option.",
    "example": {
      "scenario": "Bullish on earnings. Stock at $100.",
      "setup": "Buy $100/$115 call spread for $7, sell $80 put for $3. Net: $4.",
      "outcome": "Max profit at $115+: $11 = $1,100. Below $80: losses on put. Breakeven: $104.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 107.5,
        "premium": 4,
        "expiration": "7 days",
        "result": "Risk $400 to make $1,100 on bullish event"
      }
    },
    "tips": [
      "Use with strong directional event thesis",
      "Place short option far OTM",
      "Monitor short option",
      "Close after event resolves"
    ],
    "commonMistakes": [
      "Short option too close",
      "Not understanding short option risk",
      "Wrong directional call",
      "Not closing after event"
    ],
    "relatedStrategies": [
      "chameleon-broken-wing-butterfly",
      "dolphin-seagull"
    ]
  },
  {
    "id": "wolf-bear-put-spread",
    "name": "Predator Put Spread",
    "animalId": "wolf",
    "difficulty": 2,
    "description": "A calculated bearish strike with defined risk - the wolf's precision attack.",
    "overview": "The Predator Put Spread is Wolfgang's controlled aggression. Buy a put to profit from downside, sell a lower put to reduce cost and define risk. You stalk your target, wait for weakness, then strike.\n\nThis isn't gambling on crashes - it's calculated destruction with known maximum loss.",
    "keyPoints": [
      "Buy a put at or near the money",
      "Sell a lower strike put to reduce cost",
      "Profit when stock falls to or below short strike",
      "Maximum loss is limited to net debit paid",
      "Patience - wait for the right entry"
    ],
    "riskProfile": "Defined risk - max loss is the debit paid.",
    "maxProfit": "(Strike width - debit paid) × 100",
    "maxLoss": "Net debit paid",
    "breakeven": "Long put strike - net debit",
    "bestFor": "Bearish setups with clear downside targets. Defined risk shorting.",
    "avoidWhen": "Stock is in a strong uptrend. No clear catalyst for downside.",
    "example": {
      "scenario": "Stock XYZ at $100 showing weakness. Support at $90 likely to break.",
      "setup": "Buy $100 put for $5, sell $90 put for $2. Net debit: $3.",
      "outcome": "Max profit $700 if stock falls to $90 or below. Max loss $300 if stock stays above $100.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 3,
        "expiration": "30 days",
        "result": "Risk $300 to make $700 (2.3:1 reward/risk)"
      }
    },
    "tips": [
      "Wait for confirmation of weakness before entering",
      "Target stocks breaking key support levels",
      "Use 30-45 day expirations for time to work",
      "Take profits at 50-75% of max profit"
    ],
    "commonMistakes": [
      "Fighting strong uptrends",
      "Impatient entries without confirmation",
      "Holding losing trades hoping for reversal",
      "Over-sizing bearish positions"
    ],
    "relatedStrategies": [
      "wolf-long-put",
      "wolf-bear-call-spread"
    ]
  },
  {
    "id": "wolf-bear-call-spread",
    "name": "Patient Premium Harvest",
    "animalId": "wolf",
    "difficulty": 2,
    "description": "Collect premium while waiting - profit from stocks that stay flat or fall.",
    "overview": "The Patient Premium Harvest is how Wolfgang profits while stalking. Sell a call spread above the market, collecting premium as you wait for your bearish thesis to play out. Time decay is your ally.\n\nEven if the stock doesn't crash, you profit from it not rising. Patience pays.",
    "keyPoints": [
      "Sell a call at or above current price",
      "Buy a higher strike call for protection",
      "Collect net credit upfront",
      "Profit if stock stays flat or falls",
      "Time decay works in your favor"
    ],
    "riskProfile": "Defined risk - max loss is spread width minus credit.",
    "maxProfit": "Net credit received",
    "maxLoss": "Strike width - credit received",
    "breakeven": "Short call strike + credit received",
    "bestFor": "Bearish to neutral outlook. Overextended stocks. Premium collection.",
    "avoidWhen": "Strong bullish momentum. Upcoming positive catalysts.",
    "example": {
      "scenario": "Stock ABC at $50 is overextended after a big rally. Expecting pullback.",
      "setup": "Sell $52 call for $2.00, buy $57 call for $0.75. Net credit: $1.25.",
      "outcome": "Max profit $125 if stock stays below $52. Max loss $375 if stock goes above $57.",
      "numbers": {
        "stockPrice": 50,
        "strikePrice": 52,
        "premium": 1.25,
        "expiration": "30 days",
        "result": "Risk $375 to make $125 (1:3 risk/reward, but high probability)"
      }
    },
    "tips": [
      "Sell after significant rallies",
      "Use 70%+ probability of profit strikes",
      "Close at 50% of max profit",
      "Watch for trend changes that invalidate thesis"
    ],
    "commonMistakes": [
      "Selling into strong uptrends",
      "Strikes too close to current price",
      "Not managing when thesis is wrong",
      "Ignoring upcoming earnings or events"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "wolf-iron-condor"
    ]
  },
  {
    "id": "wolf-long-put",
    "name": "The Kill Shot",
    "animalId": "wolf",
    "difficulty": 2,
    "description": "Pure directional bearish aggression - for when you smell blood.",
    "overview": "The Kill Shot is Wolfgang's most aggressive move. A naked long put with no hedges. Use only when you've stalked your prey thoroughly and see clear weakness. High conviction, defined risk.\n\nThis is not for everyday use. This is for the kill.",
    "keyPoints": [
      "Buy a put option, typically ATM or slightly OTM",
      "No additional legs - pure directional bet",
      "Profit from significant downside moves",
      "Time decay is your enemy",
      "Requires high conviction and good timing"
    ],
    "riskProfile": "Defined risk - premium paid. But can lose 100% of premium.",
    "maxProfit": "Substantial (strike price - premium, × 100)",
    "maxLoss": "Premium paid",
    "breakeven": "Strike price - premium paid",
    "bestFor": "High conviction bearish thesis. Event-driven downside. Portfolio hedging.",
    "avoidWhen": "Uncertain about direction. No clear catalyst. Just \"feels\" bearish.",
    "example": {
      "scenario": "Company ABC just issued terrible guidance. Stock at $80, heading lower.",
      "setup": "Buy 1 ABC $80 put for $4.00.",
      "outcome": "If stock falls to $65, put worth $15. Profit: $11 per share ($1,100). If stock stays above $80, lose $400.",
      "numbers": {
        "stockPrice": 80,
        "strikePrice": 80,
        "premium": 4,
        "expiration": "30 days",
        "result": "2.75:1 reward/risk if target hit"
      }
    },
    "tips": [
      "Only use with high conviction and clear catalyst",
      "Size appropriately - this can go to zero",
      "Have a profit target and stop loss",
      "Consider spreads to reduce cost if uncertain"
    ],
    "commonMistakes": [
      "Using without conviction (gambling)",
      "Over-sizing positions",
      "Fighting uptrends",
      "Holding too long as theta decays"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "wolf-put-backspread"
    ]
  },
  {
    "id": "wolf-put-backspread",
    "name": "Crash Positioning",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Position for market crashes with limited upfront cost.",
    "overview": "Crash Positioning is Wolfgang's apocalypse trade. Sell one put, buy two lower puts. Small credit or small debit to enter, but if the market truly crashes, profits explode exponentially.\n\nThis is how the wolf positions for rare but devastating events. Patient. Waiting. Ready.",
    "keyPoints": [
      "Sell 1 higher strike put",
      "Buy 2 lower strike puts",
      "Enter for small credit or small debit",
      "Limited risk on upside, unlimited profit on crash",
      "Benefits from volatility expansion"
    ],
    "riskProfile": "Limited risk in between strikes, unlimited profit on crash.",
    "maxProfit": "Unlimited on extreme downside",
    "maxLoss": "Difference between strikes × 100 (in the middle zone)",
    "breakeven": "Complex - two breakeven points",
    "bestFor": "Crash protection. Black swan positioning. High anxiety markets.",
    "avoidWhen": "Markets are calm and trending up. No systemic concerns.",
    "example": {
      "scenario": "SPY at $520. Geopolitical tensions rising. Want crash protection.",
      "setup": "Sell 1 SPY $500 put for $8, buy 2 SPY $480 puts for $4 each. Net: $0 (free entry).",
      "outcome": "If SPY crashes to $450, the two $480 puts are worth $30 each ($6,000) minus the $500 put loss ($5,000). Net profit: $1,000. Max loss is $2,000 if SPY lands at $480 (the valley of death - width between strikes).",
      "numbers": {
        "stockPrice": 520,
        "strikePrice": 500,
        "premium": 0,
        "expiration": "45 days",
        "result": "Free entry, explosive profits on crash"
      }
    },
    "tips": [
      "Structure for zero cost or small credit if possible",
      "Use on indexes for broad market crash protection",
      "Roll forward if expiring without crash",
      "This is insurance, not a trading strategy"
    ],
    "commonMistakes": [
      "Expecting frequent payoffs (crashes are rare)",
      "Paying too much debit to enter",
      "Closing too early on small moves",
      "Using as primary strategy instead of insurance"
    ],
    "relatedStrategies": [
      "wolf-long-put",
      "wolf-bear-put-spread"
    ]
  },
  {
    "id": "wolf-iron-condor",
    "name": "The Patient Trap",
    "animalId": "wolf",
    "difficulty": 3,
    "description": "Set the trap and wait - profit from stocks staying in a range.",
    "overview": "The Patient Trap is Wolfgang's waiting game. Set up an iron condor - walls on both sides - and let time decay work for you. The stock is your prey trapped in a range. Patience is the weapon.\n\nCollect premium while you wait for your directional opportunity. Even a wolf must rest between hunts.",
    "keyPoints": [
      "Sell OTM put spread below market",
      "Sell OTM call spread above market",
      "Collect premium from both sides",
      "Profit when stock stays in range",
      "Manage if stock approaches either side"
    ],
    "riskProfile": "Defined risk on both sides.",
    "maxProfit": "Net credit received",
    "maxLoss": "Wider spread width - credit",
    "breakeven": "Short strikes ± total credit",
    "bestFor": "Range-bound markets. High IV environments. Income while waiting.",
    "avoidWhen": "Expecting a directional move. Trending markets.",
    "example": {
      "scenario": "Stock DEF at $200, consolidating after earnings. Range: $190-$210.",
      "setup": "Sell $190/$185 put spread, sell $210/$215 call spread. Total credit: $2.00.",
      "outcome": "Max profit $200 if stock stays between $190-$210. Max loss $300 on either side.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 190,
        "premium": 2,
        "expiration": "30 days",
        "result": "67% max return on risk"
      }
    },
    "tips": [
      "Use in high IV environments for better premiums",
      "Set strikes at 15-20 delta for balance",
      "Close at 50% profit to reduce risk",
      "Be ready to take directional trade if range breaks"
    ],
    "commonMistakes": [
      "Using in trending markets",
      "Ignoring when one side is threatened",
      "Strikes too tight in volatile stocks",
      "Not having a directional backup plan"
    ],
    "relatedStrategies": [
      "wolf-bear-call-spread",
      "wolf-calendar-spread"
    ]
  },
  {
    "id": "wolf-calendar-spread",
    "name": "The Stalking Position",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Establish position cheaply while waiting for the right moment to strike.",
    "overview": "The Stalking Position is how Wolfgang builds his attack at low cost. Buy a longer-dated option and sell near-term options against it repeatedly. Reduce your cost basis while maintaining the ability to strike.\n\nThis is patient, methodical positioning. The wolf doesn't rush - he stalks.",
    "keyPoints": [
      "Buy longer-dated put for your bearish thesis",
      "Sell shorter-dated puts against it to reduce cost",
      "Roll the short put as it expires",
      "Gradually reduce cost basis to zero or credit",
      "Strike when the moment is right"
    ],
    "riskProfile": "Defined risk - debit paid for calendar.",
    "maxProfit": "Variable - depends on final positioning",
    "maxLoss": "Net debit paid (can be reduced over time)",
    "breakeven": "Depends on how many times you sell against",
    "bestFor": "Building bearish positions cheaply. Patient thesis development.",
    "avoidWhen": "You need immediate directional exposure.",
    "example": {
      "scenario": "Bearish on stock GHI ($150) over 3 months, but timing uncertain.",
      "setup": "Buy $145 put expiring in 90 days for $6. Sell $145 put expiring in 30 days for $3. Net debit: $3.",
      "outcome": "After 30 days, if stock still near $150, short put expires worthless. Sell another monthly put for $2.50. Net cost now $0.50. After 60 days, may have free position.",
      "numbers": {
        "stockPrice": 150,
        "strikePrice": 145,
        "premium": 3,
        "expiration": "30/90 days",
        "result": "Potential to own put for free after rolling"
      }
    },
    "tips": [
      "Choose long-dated option at your target strike",
      "Sell monthlies systematically against it",
      "Don't get greedy - manage the short options",
      "Be ready to remove the short if move begins"
    ],
    "commonMistakes": [
      "Selling short option when move is starting",
      "Being too aggressive with short strikes",
      "Forgetting this is a stalking position, not income",
      "Not removing short when thesis plays out"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "wolf-iron-condor"
    ]
  },
  {
    "id": "wolf-strip",
    "name": "The Downside Hunt",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Bearish volatility play - 2 puts, 1 call for asymmetric downside.",
    "overview": "The Downside Hunt is Wolfgang's preferred volatility position when he senses weakness. Buy 2 puts and 1 call at the same strike. You profit from moves either way, but make TWICE as much on the downside.\n\nThe pack circles when blood is in the water. This positions you for the kill.",
    "keyPoints": [
      "Buy 2 ATM puts",
      "Buy 1 ATM call at same strike",
      "Costs more than a straddle",
      "Profits from big moves either direction",
      "2x profit on downside vs upside"
    ],
    "riskProfile": "High risk - can lose entire premium if no significant move.",
    "maxProfit": "Large to downside (2 puts), unlimited to upside (1 call)",
    "maxLoss": "Total premium paid (2 puts + 1 call)",
    "breakeven": "Strike ± total premium / number of options on that side",
    "bestFor": "Bearish events with volatility. Market topping signals. Breakdown setups.",
    "avoidWhen": "No clear weakness visible or IV is extremely elevated.",
    "example": {
      "scenario": "Market looking toppy. SPY at $500. Expecting a drop but want upside protection.",
      "setup": "Buy 2 $500 puts for $12 each, buy 1 $500 call for $11. Total: $35.",
      "outcome": "If SPY drops to $450, 2 puts worth $50 each = $100. Profit: $100 - $35 = $65 × 100 = $6,500. If SPY rallies to $550, call worth $50, profit: $1,500.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 35,
        "expiration": "14 days",
        "result": "2x downside leverage vs upside"
      }
    },
    "tips": [
      "Use when you have bearish conviction + expect volatility",
      "Calculate both breakevens - critical for position management",
      "Consider closing early to capture volatility expansion",
      "Size smaller than normal straddles (higher cost)"
    ],
    "commonMistakes": [
      "Not having a true bearish bias (use straddle instead)",
      "Overpaying in elevated IV environments",
      "Holding through theta decay without movement",
      "Not taking profits when the drop materializes"
    ],
    "relatedStrategies": [
      "wolf-long-put",
      "wolf-put-backspread"
    ]
  },
  {
    "id": "wolf-seagull",
    "name": "The Patient Stalker",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Bearish position with capped risk - wait for weakness, strike precisely.",
    "overview": "The Patient Stalker is Wolfgang's calculated bearish setup. Buy a put, sell a lower put, sell an OTM call to finance. Limited risk, significant profit potential on downside, and the call premium reduces your cost.\n\nThe wolf doesn't rush. Wait for the right setup, then execute with precision.",
    "keyPoints": [
      "Buy ATM or slightly OTM put",
      "Sell further OTM put (creates put spread)",
      "Sell OTM call to reduce net cost",
      "Bearish bias with defined risk",
      "Call adds risk if stock rallies significantly"
    ],
    "riskProfile": "Moderate - defined downside risk, unlimited upside risk from short call.",
    "maxProfit": "Put spread width minus net premium (capped)",
    "maxLoss": "Net debit paid (if any) or unlimited if stock rallies past call",
    "breakeven": "Long put strike - (spread width - net premium)",
    "bestFor": "Bearish setups with clear resistance above. Reducing cost of put spreads.",
    "avoidWhen": "Stock shows potential for breakout. Unclear directional bias.",
    "example": {
      "scenario": "Stock at $100 with strong resistance at $110. Expecting drop to $85.",
      "setup": "Buy $100 put for $6, sell $85 put for $2, sell $110 call for $3. Net: $1 debit.",
      "outcome": "If stock drops to $85, put spread worth $15. Profit: $15 - $1 = $1,400. Max risk: $100 if called away. Breakeven: $99.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 1,
        "expiration": "45 days",
        "result": "$1,400 max profit, $100 risk above call strike"
      }
    },
    "tips": [
      "Choose call strike at strong resistance level",
      "Monitor the short call - manage if breached",
      "Best in low-to-moderate IV environments",
      "Consider closing early at 50-70% of max profit"
    ],
    "commonMistakes": [
      "Selling call too close - getting assigned unexpectedly",
      "Not managing the short call if stock rallies",
      "Using in high volatility without protection",
      "Forgetting the unlimited upside risk"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "fox-seagull"
    ]
  },
  {
    "id": "wolf-short-strangle",
    "name": "The Patient Trap",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Sell premium on both sides and wait for stock to stay in your kill zone.",
    "overview": "Wolfgang's short strangle is patience personified. Sell OTM call and put, then wait. The wolf doesn't chase - he sets the trap and lets the prey come to him. If stock stays in range, you collect.\n\nThis requires discipline and monitoring. The wolf always watches.",
    "keyPoints": [
      "Sell OTM call",
      "Sell OTM put",
      "Collect premium from both",
      "Profit if stock stays in range",
      "UNLIMITED RISK both directions"
    ],
    "riskProfile": "HIGH RISK - unlimited both directions, requires monitoring.",
    "maxProfit": "Total premium collected",
    "maxLoss": "Unlimited both directions",
    "breakeven": "Call strike + premium, Put strike - premium",
    "bestFor": "Range-bound stocks. High IV environments. Patient traders.",
    "avoidWhen": "Major catalysts approaching or can't monitor.",
    "example": {
      "scenario": "Stock at $100. Expecting range of $90-$110 for next month.",
      "setup": "Sell $110 call for $4, sell $90 put for $4. Credit: $8.",
      "outcome": "Max profit $800 if stock stays $90-$110. Breakevens: $82 and $118.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 8,
        "expiration": "30 days",
        "result": "$800 max profit, unlimited risk outside range"
      }
    },
    "tips": [
      "Wait for high IV to enter",
      "Use on stable stocks or indexes",
      "Have adjustment plan for breaches",
      "Consider iron condor for defined risk"
    ],
    "commonMistakes": [
      "Using on volatile stocks",
      "Not monitoring position",
      "No breach management plan",
      "Oversizing positions"
    ],
    "relatedStrategies": [
      "wolf-iron-condor",
      "chameleon-short-strangle"
    ]
  },
  {
    "id": "wolf-ratio-spread",
    "name": "The Calculated Ambush",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Buy one, sell multiple - profit in the sweet spot, manage beyond.",
    "overview": "Wolfgang's ratio spread is precision hunting. Buy one option, sell two or more at different strike. Often entered for credit. Profit zone is defined, but risk exists if the stock moves too far.\n\nThe wolf calculates every angle before striking.",
    "keyPoints": [
      "Buy 1 option",
      "Sell 2+ options at different strike",
      "Often entered for credit",
      "Profit zone between strikes",
      "Undefined risk beyond short strikes"
    ],
    "riskProfile": "Moderate to high - defined on one side, unlimited/large on other.",
    "maxProfit": "At short strike",
    "maxLoss": "Unlimited (call ratio) or substantial (put ratio)",
    "breakeven": "Short strike +/- (max profit / extra shorts)",
    "bestFor": "Directional with range conviction. Credit collection.",
    "avoidWhen": "Uncertain about range or can't monitor.",
    "example": {
      "scenario": "Stock at $100. Expecting move to $110 but not beyond.",
      "setup": "Buy 1 $100 call for $8, sell 2 $110 calls for $4 each. Net: $0.",
      "outcome": "Max profit at $110: $1,000. Above $120: losses mount. Below $100: lose time value.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 110,
        "premium": 0,
        "expiration": "45 days",
        "result": "Free trade, $1,000 max profit, risk above $120"
      }
    },
    "tips": [
      "Use 1:2 ratio for balance",
      "Enter in elevated IV",
      "Have plan if breached",
      "Close at 50-70% profit"
    ],
    "commonMistakes": [
      "Not understanding unlimited risk",
      "Wrong ratio selection",
      "No exit plan",
      "Using on volatile stocks"
    ],
    "relatedStrategies": [
      "wolf-iron-condor",
      "fox-ratio-spread"
    ]
  },
  {
    "id": "wolf-short-synthetic-future",
    "name": "The Full Predator",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Maximum bearish exposure - full short stock equivalent with options.",
    "overview": "Wolfgang's short synthetic is for when he's certain of the kill. Sell call, buy put at same strike. Delta -1.0 - moves exactly like shorting stock. Maximum bearish exposure.\n\nThis is the wolf's final strike - patient setup, devastating execution.",
    "keyPoints": [
      "Sell 1 ATM call",
      "Buy 1 ATM put at same strike",
      "Delta -1.0 - like short stock",
      "Less capital than shorting shares",
      "Full downside and upside exposure"
    ],
    "riskProfile": "HIGH RISK - same as short stock, unlimited upside loss.",
    "maxProfit": "Strike - net debit (if stock to $0)",
    "maxLoss": "Unlimited (if stock rallies)",
    "breakeven": "Strike + net credit/debit",
    "bestFor": "Maximum bearish conviction. Short exposure without borrowing.",
    "avoidWhen": "Can't handle unlimited upside risk.",
    "example": {
      "scenario": "Stock at $200. Wolfgang sees total breakdown coming.",
      "setup": "Sell $200 call for $11, buy $200 put for $10. Net: $1 credit.",
      "outcome": "If crashes to $100, profit $100 + $1 = $10,100. If rallies to $300, lose $100 - $1 = -$9,900.",
      "numbers": {
        "stockPrice": 200,
        "strikePrice": 200,
        "premium": 1,
        "expiration": "60 days",
        "result": "Delta -1.0 - full short exposure"
      }
    },
    "tips": [
      "Use ATM for true -1.0 delta",
      "Understand unlimited upside risk",
      "Monitor margin requirements",
      "Only with high conviction"
    ],
    "commonMistakes": [
      "Thinking this reduces risk",
      "Not understanding unlimited loss",
      "Using without strong thesis",
      "Ignoring early assignment"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "bear-short-synthetic-future"
    ]
  },
  {
    "id": "wolf-bear-put-ladder",
    "name": "The Layered Trap",
    "animalId": "wolf",
    "difficulty": 4,
    "description": "Bearish ladder with funded position but controlled range expectations.",
    "overview": "Wolfgang's bear put ladder is strategic depth. Buy put, sell two lower puts at different strikes. The sales fund the position but create risk if stock crashes too far.\n\nThe wolf plans multiple outcomes - profit in the zone, manage beyond.",
    "keyPoints": [
      "Buy 1 higher strike put",
      "Sell 1 middle strike put",
      "Sell 1 lower strike put",
      "Often entered for credit/small debit",
      "Profit zone between strikes"
    ],
    "riskProfile": "HIGH RISK - unlimited loss if stock crashes below lowest strike.",
    "maxProfit": "At middle strike (limited)",
    "maxLoss": "Unlimited below lower strike",
    "breakeven": "Upper put - debit on upside; varies on downside",
    "bestFor": "Bearish with target range. Cost reduction.",
    "avoidWhen": "Expecting total crash or can't monitor.",
    "example": {
      "scenario": "Stock at $100. Expecting drop to $85 but not below $75.",
      "setup": "Buy $100 put for $8, sell $90 put for $4, sell $80 put for $2. Net: $2 debit.",
      "outcome": "Max profit at $90: $10 - $2 = $800. Below $80: losses mount. Above $100: lose $200.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 90,
        "premium": 2,
        "expiration": "45 days",
        "result": "$800 max profit, unlimited risk below $80"
      }
    },
    "tips": [
      "Use with target range conviction",
      "Monitor if approaching lower strike",
      "Close at 50-70% profit",
      "Have conversion plan if breached"
    ],
    "commonMistakes": [
      "Not understanding unlimited downside",
      "Using on crash-prone stocks",
      "No exit plan below lower strike",
      "Oversizing"
    ],
    "relatedStrategies": [
      "wolf-bear-put-spread",
      "bear-bear-put-ladder"
    ]
  },
  {
    "id": "wolf-short-guts",
    "name": "The Contrarian Trap",
    "animalId": "wolf",
    "difficulty": 5,
    "description": "Sell ITM options when everyone expects move but wolf sees calm.",
    "overview": "Wolfgang's short guts is ultimate contrarian patience. When everyone expects volatility, sell ITM call and ITM put. Collect massive premium. If stock stays put, the wolf wins big.\n\nThis requires absolute conviction and risk management. Advanced predators only.",
    "keyPoints": [
      "Sell ITM call",
      "Sell ITM put",
      "Collect large premium",
      "Profit if stock stays stable",
      "VERY HIGH RISK both directions"
    ],
    "riskProfile": "EXTREME RISK - large losses if stock moves significantly.",
    "maxProfit": "Total premium - intrinsic value given up",
    "maxLoss": "Unlimited upside (call), substantial downside (put)",
    "breakeven": "Call strike + premium, Put strike - premium",
    "bestFor": "Contrarian plays when volatility overpriced. Expert only.",
    "avoidWhen": "Any uncertainty. Beginners avoid entirely.",
    "example": {
      "scenario": "Stock at $100. Everyone expects 20% move. Wolf sees 5% max.",
      "setup": "Sell $90 put (ITM) for $15, sell $110 call (ITM) for $15. Credit: $30.",
      "outcome": "Max profit if stock stays $90-$110: keep intrinsic + time value. Outside: large losses.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 30,
        "expiration": "14 days",
        "result": "Large credit, extreme risk if wrong"
      }
    },
    "tips": [
      "Only when volatility grossly overpriced",
      "Have strict risk management",
      "Monitor constantly",
      "Consider iron butterfly instead"
    ],
    "commonMistakes": [
      "Underestimating move potential",
      "Not monitoring constantly",
      "Oversizing",
      "Using without conviction"
    ],
    "relatedStrategies": [
      "wolf-short-strangle",
      "chameleon-short-guts"
    ]
  },
  {
    "id": "kangaroo-long-straddle",
    "name": "The Big Jump",
    "animalId": "kangaroo",
    "difficulty": 3,
    "description": "Position for explosive moves in either direction - pure volatility play.",
    "overview": "The Big Jump is Joey's signature move. Buy both a call and put at the same strike, betting that the stock will make a massive move. Direction doesn't matter - size of the move does.\n\nWhen volatility explodes, one leg of your straddle explodes with it. This is how kangaroos profit from chaos.",
    "keyPoints": [
      "Buy ATM call and ATM put at same strike and expiration",
      "Profit from big moves in either direction",
      "Need the move to exceed total premium paid",
      "IV expansion helps even before the move",
      "Time decay is your enemy - trade with purpose"
    ],
    "riskProfile": "Defined risk - total premium paid is max loss.",
    "maxProfit": "Unlimited on upside, substantial on downside",
    "maxLoss": "Total premium paid",
    "breakeven": "Strike ± total premium paid",
    "bestFor": "Pre-event volatility. Earnings. Merger announcements. FDA decisions.",
    "avoidWhen": "IV is already extremely high. Stock is range-bound.",
    "example": {
      "scenario": "Stock XYZ at $100 with major announcement tomorrow. Expecting 15%+ move.",
      "setup": "Buy $100 call for $6 and $100 put for $5. Total cost: $11.",
      "outcome": "Need stock above $111 or below $89 to profit. If it moves 20%, one side worth ~$20, profit of $900.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 11,
        "expiration": "7 days",
        "result": "Profit if move exceeds 11% in either direction"
      }
    },
    "tips": [
      "Time entry just before expected volatility event",
      "Compare implied move to your expected move",
      "Consider selling before event to capture IV expansion",
      "Close winning side quickly - don't get greedy"
    ],
    "commonMistakes": [
      "Buying when IV is already maxed",
      "Holding too long after the event (IV crush kills)",
      "Not taking profits when available",
      "Using on stocks that historically don't move big"
    ],
    "relatedStrategies": [
      "kangaroo-long-strangle",
      "kangaroo-call-backspread"
    ]
  },
  {
    "id": "kangaroo-long-strangle",
    "name": "The Wide Bounce",
    "animalId": "kangaroo",
    "difficulty": 3,
    "description": "A cheaper volatility play that requires an even bigger jump.",
    "overview": "The Wide Bounce is Joey's cost-effective chaos play. Buy an OTM call AND an OTM put - less upfront cost but you need a bigger bounce to profit.\n\nPerfect when you're certain of a big move but want to risk less capital. The wider you go, the cheaper it gets - but the bigger the jump you need.",
    "keyPoints": [
      "Buy OTM call above current price",
      "Buy OTM put below current price",
      "Lower cost than straddle but higher breakevens",
      "Need larger move to profit",
      "Works best for extreme volatility expectations"
    ],
    "riskProfile": "Defined risk - total premium paid.",
    "maxProfit": "Unlimited on upside, substantial on downside",
    "maxLoss": "Total premium paid",
    "breakeven": "Call strike + premium OR put strike - premium",
    "bestFor": "Expecting massive moves. Lower capital risk.",
    "avoidWhen": "Only moderate move expected. High IV environment.",
    "example": {
      "scenario": "Biotech at $50 with FDA decision. Binary outcome expected.",
      "setup": "Buy $55 call for $2 and $45 put for $2. Total cost: $4.",
      "outcome": "Need stock above $59 or below $41 to profit. On approval: $70 = $1,100 profit. On rejection: $30 = $1,100 profit.",
      "numbers": {
        "stockPrice": 50,
        "strikePrice": 55,
        "premium": 4,
        "expiration": "14 days",
        "result": "Need 18%+ move to profit"
      }
    },
    "tips": [
      "Choose strikes based on expected move magnitude",
      "Use for truly binary events",
      "Can close one side early if direction becomes clear",
      "Watch IV - don't overpay for the setup"
    ],
    "commonMistakes": [
      "Strikes too wide - unrealistic moves needed",
      "Using for small expected moves",
      "Holding both sides through event",
      "Ignoring IV crush impact"
    ],
    "relatedStrategies": [
      "kangaroo-long-straddle",
      "kangaroo-put-backspread"
    ]
  },
  {
    "id": "kangaroo-call-backspread",
    "name": "Rocket Jump",
    "animalId": "kangaroo",
    "difficulty": 4,
    "description": "Positioned for explosive upside with limited downside risk.",
    "overview": "The Rocket Jump is Joey's moonshot trade. Sell one call, buy two higher calls. If the stock rockets, your profits accelerate. If it doesn't, you're protected.\n\nThis is for when you expect fireworks to the upside. The bigger the jump, the bigger the bounty.",
    "keyPoints": [
      "Sell 1 lower strike call",
      "Buy 2 higher strike calls",
      "Often entered for small credit or small debit",
      "Profits accelerate on explosive upside",
      "Limited loss if stock drops or stays flat"
    ],
    "riskProfile": "Limited risk, unlimited reward potential.",
    "maxProfit": "Unlimited on explosive upside",
    "maxLoss": "Width of strikes minus any credit",
    "breakeven": "Upper strike + (max loss / shares)",
    "bestFor": "Expecting moonshots. Pre-earnings bullish bets. Squeeze candidates.",
    "avoidWhen": "Expecting only moderate upside. Bearish outlook.",
    "example": {
      "scenario": "Meme stock at $30 with potential squeeze setup.",
      "setup": "Sell 1 $35 call for $4, buy 2 $40 calls for $2 each. Net: $0.",
      "outcome": "If stock explodes to $60: 2×$40 calls worth $20 each = $4,000, minus $35 call loss of $2,500 = $1,500 profit. If flat: keep $0, max loss at $40 = $500.",
      "numbers": {
        "stockPrice": 30,
        "strikePrice": 40,
        "premium": 0,
        "expiration": "21 days",
        "result": "Free entry, explosive profits above $45"
      }
    },
    "tips": [
      "Use for high-conviction explosive upside plays",
      "Structure for credit when possible",
      "Don't hold if the explosion happens - take profits",
      "Size for the max loss zone, not the potential gain"
    ],
    "commonMistakes": [
      "Using without genuine explosion catalyst",
      "Holding through the move hoping for more",
      "Not understanding the loss zone",
      "Over-sizing based on potential gains"
    ],
    "relatedStrategies": [
      "kangaroo-long-straddle",
      "kangaroo-put-backspread"
    ]
  },
  {
    "id": "kangaroo-put-backspread",
    "name": "Crash Landing",
    "animalId": "kangaroo",
    "difficulty": 4,
    "description": "Positioned for explosive downside - profit from crashes.",
    "overview": "The Crash Landing is Joey's bear market bounty. Sell one put, buy two lower puts. When markets crater, your profits multiply. When they don't, your risk is contained.\n\nNot every jump goes up. Sometimes the biggest opportunities are in the crash.",
    "keyPoints": [
      "Sell 1 higher strike put",
      "Buy 2 lower strike puts",
      "Enter for small credit or debit",
      "Profits accelerate on market crashes",
      "Limited risk on the upside"
    ],
    "riskProfile": "Limited risk, massive reward on crashes.",
    "maxProfit": "Substantial on extreme downside",
    "maxLoss": "Width of strikes minus any credit",
    "breakeven": "Lower strike - (max loss / shares)",
    "bestFor": "Crash protection. Black swan positioning. Bearish chaos.",
    "avoidWhen": "Markets calm and bullish. No systemic concerns.",
    "example": {
      "scenario": "SPY at $500, macro concerns building, wanting crash exposure.",
      "setup": "Sell 1 $480 put for $10, buy 2 $460 puts for $5 each. Net: $0.",
      "outcome": "If SPY crashes to $400: 2×$460 puts worth $60 each = $12,000, minus $480 put loss of $8,000 = $4,000 profit. Max loss at $460 = $2,000.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 460,
        "premium": 0,
        "expiration": "45 days",
        "result": "Free crash insurance with $4,000+ potential"
      }
    },
    "tips": [
      "Use as crash insurance, not primary strategy",
      "Structure for zero cost if possible",
      "Hold through volatility - this is for rare events",
      "Size appropriately - max loss can still hurt"
    ],
    "commonMistakes": [
      "Expecting frequent payoffs",
      "Paying too much to enter",
      "Closing on small dips",
      "Using as main directional strategy"
    ],
    "relatedStrategies": [
      "kangaroo-long-strangle",
      "kangaroo-call-backspread"
    ]
  },
  {
    "id": "kangaroo-short-straddle",
    "name": "The Stillness Bet",
    "animalId": "kangaroo",
    "difficulty": 5,
    "description": "Bet against big moves - profit when the jungle stays quiet.",
    "overview": "The Stillness Bet is Joey's contrarian play. When everyone expects chaos, sometimes the market stays still. Sell both a call and put at the same strike, collecting maximum premium.\n\nThis is dangerous territory - unlimited risk if wrong. But when volatility is overpriced, this is how you profit from the calm.",
    "keyPoints": [
      "Sell ATM call and ATM put at same strike",
      "Collect maximum premium",
      "Profit if stock stays near strike",
      "UNLIMITED RISK on both sides",
      "Requires constant monitoring and adjustment"
    ],
    "riskProfile": "EXTREME - unlimited risk in both directions.",
    "maxProfit": "Total premium received",
    "maxLoss": "Unlimited in both directions",
    "breakeven": "Strike ± total premium received",
    "bestFor": "High IV environments where you expect calm. Overpriced volatility.",
    "avoidWhen": "Genuine catalysts expected. You can't monitor constantly.",
    "example": {
      "scenario": "Stock at $100, IV spiked to 80% on fears that didn't materialize.",
      "setup": "Sell $100 call for $10 and $100 put for $10. Total credit: $20.",
      "outcome": "Max profit $2,000 if stock at exactly $100. Breakevens: $80 and $120. Beyond that, unlimited losses.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 20,
        "expiration": "30 days",
        "result": "$2,000 max profit, unlimited risk outside $80-$120"
      }
    },
    "tips": [
      "Only use when IV is extremely elevated",
      "Have strict stop-loss rules",
      "Consider converting to iron butterfly for defined risk",
      "Never hold through actual catalysts"
    ],
    "commonMistakes": [
      "Selling into genuine volatility events",
      "Not having stop-losses",
      "Letting losses run hoping for mean reversion",
      "Over-sizing for the premium"
    ],
    "relatedStrategies": [
      "kangaroo-iron-butterfly",
      "kangaroo-long-straddle"
    ]
  },
  {
    "id": "kangaroo-iron-butterfly",
    "name": "The Contained Bounce",
    "animalId": "kangaroo",
    "difficulty": 4,
    "description": "High premium collection with defined risk - the disciplined stillness bet.",
    "overview": "The Contained Bounce is Joey's disciplined version of the stillness bet. Sell the straddle but buy protective wings. You get high premium with defined maximum loss.\n\nWhen you want to bet on calm but can't stomach unlimited risk, this is your play.",
    "keyPoints": [
      "Sell ATM call and put (straddle)",
      "Buy OTM call and put (wings) for protection",
      "High premium with defined risk",
      "Max profit at exact strike price",
      "Narrower profit zone than iron condor"
    ],
    "riskProfile": "Defined risk on both sides.",
    "maxProfit": "Net credit received",
    "maxLoss": "Wing width - credit received",
    "breakeven": "Strike ± credit received",
    "bestFor": "High IV. Expected pinning. Defined-risk premium collection.",
    "avoidWhen": "Expecting significant movement in either direction.",
    "example": {
      "scenario": "Index at $500 expected to pin for monthly expiration.",
      "setup": "Sell $500 straddle, buy $490 put and $510 call. Net credit: $8.",
      "outcome": "Max profit $800 at exactly $500. Max loss $200 beyond wings. Breakevens: $492-$508.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 8,
        "expiration": "14 days",
        "result": "$800 max profit, $200 max loss"
      }
    },
    "tips": [
      "Use for pinning plays on indexes",
      "Enter 2-3 weeks before expiration",
      "Close early - don't need max profit",
      "Adjust to iron condor if stock moves"
    ],
    "commonMistakes": [
      "Expecting exact pin at strike",
      "Holding too long",
      "Using on volatile individual stocks",
      "Not adjusting when tested"
    ],
    "relatedStrategies": [
      "kangaroo-short-straddle",
      "kangaroo-long-straddle"
    ]
  },
  {
    "id": "kangaroo-ratio-spread",
    "name": "The Leveraged Hop",
    "animalId": "kangaroo",
    "difficulty": 4,
    "description": "Sell more contracts than you buy - profit from moderate moves with unlimited risk on extremes.",
    "overview": "The Leveraged Hop is Joey's way of collecting premium while betting on a directional bounce. Buy 1, sell 2. If the stock makes a moderate move, you win big. But if it jumps too far - watch out mate!\n\nThis is a credit spread on steroids. More premium, more risk, more excitement.",
    "keyPoints": [
      "Buy 1 call, sell 2 calls at higher strike",
      "Net credit or small debit to enter",
      "Max profit between strikes",
      "Unlimited risk if stock explodes higher",
      "Best for moderate bullish bias"
    ],
    "riskProfile": "Unlimited risk above upper breakeven.",
    "maxProfit": "Short strike - long strike - debit (or + credit)",
    "maxLoss": "Unlimited above upper breakeven",
    "breakeven": "Long strike + max profit, then again above short strike",
    "bestFor": "Moderate bullish outlook. High IV environments. Premium collection.",
    "avoidWhen": "Expecting massive rallies. Low volatility. Uncertain direction.",
    "example": {
      "scenario": "Stock at $50, expect move to $55 but not beyond $60.",
      "setup": "Buy 1x $50 call for $5, sell 2x $55 calls at $2 each. Net debit: $1.",
      "outcome": "Max profit $400 at $55. Above $60 losses are unlimited. Below $49, lose $100.",
      "numbers": {
        "stockPrice": 50,
        "strikePrice": 55,
        "premium": 1,
        "expiration": "45 days",
        "result": "$400 max profit, unlimited risk above $60"
      }
    },
    "tips": [
      "Close early when profitable",
      "Set stop-loss above short strike",
      "Never ignore unlimited risk",
      "Use only with directional conviction"
    ],
    "commonMistakes": [
      "Ignoring the unlimited risk component",
      "Using in explosive volatility environments",
      "Not having exit plan for adverse moves",
      "Holding through earnings or catalysts"
    ],
    "relatedStrategies": [
      "kangaroo-call-backspread",
      "kangaroo-long-strangle"
    ]
  },
  {
    "id": "kangaroo-strap",
    "name": "The Bullish Bounce",
    "animalId": "kangaroo",
    "difficulty": 5,
    "description": "2 calls + 1 put - explosive upside leverage with downside protection.",
    "overview": "G'day! The Bullish Bounce is Joey's go-to when he's leaning bullish but still wants protection. Buy 2 calls and 1 put at the same strike. You get 2x the upside leverage!\n\nIt's a straddle with an extra call. More expensive, but if the stock jumps up, you're laughing all the way to the bank.",
    "keyPoints": [
      "Buy 2 ATM calls + 1 ATM put",
      "Higher cost than regular straddle",
      "Double leverage on upside",
      "Still protected on downside",
      "Best for bullish volatility plays"
    ],
    "riskProfile": "Limited to debit paid.",
    "maxProfit": "Unlimited upside",
    "maxLoss": "Total debit paid",
    "breakeven": "Strike - debit/3, and strike + (debit x 2)/3",
    "bestFor": "Bullish bias with volatility spike expected. Earnings plays leaning up.",
    "avoidWhen": "Bearish or neutral outlook. Low volatility. Expensive premium.",
    "example": {
      "scenario": "Stock at $100, bullish into earnings but want protection.",
      "setup": "Buy 2x $100 calls at $5 each, buy 1x $100 put at $4. Total debit: $14.",
      "outcome": "If stock hits $120, calls worth $40, put worthless = $26 profit. Below $86, losses mount to $1400 max.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 14,
        "expiration": "30 days",
        "result": "Unlimited upside, $1400 max loss"
      }
    },
    "tips": [
      "Use only with strong bullish conviction",
      "Enter when IV is relatively low",
      "Target 2x-3x return, then exit",
      "Don't hold to expiration"
    ],
    "commonMistakes": [
      "Using with neutral bias (use straddle instead)",
      "Entering when IV is already elevated",
      "Not setting profit targets",
      "Holding through theta decay"
    ],
    "relatedStrategies": [
      "kangaroo-long-straddle",
      "kangaroo-strip"
    ]
  },
  {
    "id": "kangaroo-strip",
    "name": "The Bearish Crash Play",
    "animalId": "kangaroo",
    "difficulty": 5,
    "description": "1 call + 2 puts - explosive downside leverage with upside protection.",
    "overview": "The Bearish Crash Play is Joey's weapon when he smells blood in the water. Buy 1 call and 2 puts at the same strike. You get 2x the downside leverage!\n\nIt's the inverse of the strap. More bearish, more protective on crashes, but you're still covered if you're wrong.",
    "keyPoints": [
      "Buy 1 ATM call + 2 ATM puts",
      "Higher cost than regular straddle",
      "Double leverage on downside",
      "Still protected on upside",
      "Best for bearish volatility plays"
    ],
    "riskProfile": "Limited to debit paid.",
    "maxProfit": "Massive on downside (puts 2x leveraged)",
    "maxLoss": "Total debit paid",
    "breakeven": "Strike + debit/3, and strike - (debit x 2)/3",
    "bestFor": "Bearish bias with volatility spike. Market crash protection. Shorting conviction plays.",
    "avoidWhen": "Bullish outlook. Low volatility. Expensive premium.",
    "example": {
      "scenario": "Index at $500, expecting crash or major pullback.",
      "setup": "Buy 1x $500 call at $15, buy 2x $500 puts at $16 each. Total debit: $47.",
      "outcome": "If index crashes to $450, puts worth $100, call worthless = $5,300 profit. Below $476.50, massive profit. Max loss at $500: $4,700. Above $547, call profits.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 47,
        "expiration": "30 days",
        "result": "Massive downside profit, $4700 max loss"
      }
    },
    "tips": [
      "Use for crash protection or bearish events",
      "Enter when bearish catalysts are brewing",
      "Exit at 2x-3x return",
      "Consider selling before expiration"
    ],
    "commonMistakes": [
      "Using without bearish conviction",
      "Entering when IV is maxed out",
      "Holding through full theta decay",
      "Not sizing appropriately"
    ],
    "relatedStrategies": [
      "kangaroo-put-backspread",
      "kangaroo-strap"
    ]
  },
  {
    "id": "kangaroo-long-guts",
    "name": "The Maximum Delta Play",
    "animalId": "kangaroo",
    "difficulty": 5,
    "description": "Buy ITM call + ITM put - high delta straddle for explosive moves.",
    "overview": "The Maximum Delta Play is Joey's nuclear option. Instead of buying ATM options, you buy ITM on both sides. More expensive, but way more delta!\n\nWhen you're certain of a massive move but don't know which direction - this is your weapon. High delta, high cost, high reward.",
    "keyPoints": [
      "Buy ITM call + ITM put",
      "Much higher cost than ATM straddle",
      "Higher delta means faster profits",
      "Less theta decay than ATM",
      "Best for confirmed major events"
    ],
    "riskProfile": "Limited to very high debit paid.",
    "maxProfit": "Unlimited on both sides",
    "maxLoss": "Total debit paid (very high)",
    "breakeven": "Strikes ± remaining premium after intrinsic value",
    "bestFor": "Known major volatility events. Binary outcomes. Massive moves expected.",
    "avoidWhen": "Uncertain direction. No catalyst. Expensive premium environment.",
    "example": {
      "scenario": "Stock at $100, major court ruling tomorrow - massive move certain.",
      "setup": "Buy $95 call at $8, buy $105 put at $8. Total debit: $16 ($10 intrinsic + $6 extrinsic).",
      "outcome": "Need move beyond $89-$111 to profit. But delta is much higher than ATM straddle.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 16,
        "expiration": "7 days",
        "result": "Higher delta, $1,600 max loss"
      }
    },
    "tips": [
      "Use only for confirmed major catalysts",
      "Calculate breakevens carefully",
      "Exit quickly after move happens",
      "Don't use for speculative plays"
    ],
    "commonMistakes": [
      "Using without clear catalyst",
      "Underestimating cost",
      "Not accounting for intrinsic value in breakeven",
      "Holding too long after event"
    ],
    "relatedStrategies": [
      "kangaroo-long-straddle",
      "kangaroo-short-guts"
    ]
  },
  {
    "id": "kangaroo-twisted-sister",
    "name": "The Time Twisted Bounce",
    "animalId": "kangaroo",
    "difficulty": 5,
    "description": "Buy long-dated call, sell 2 near-term calls - profit from time decay AND direction.",
    "overview": "The Time Twisted Bounce is Joey's sneaky play. Buy a long-dated call as your base, then sell 2 short-dated calls against it. You collect premium now, and if you're right about direction, the long call covers you!\n\nIt's like a diagonal on steroids. More premium, more risk, but way more fun when it works.",
    "keyPoints": [
      "Buy far-dated call (LEAPS)",
      "Sell 2 near-term calls at higher strike",
      "Collect premium from theta decay",
      "Long call provides upside coverage",
      "Complex position to manage"
    ],
    "riskProfile": "Defined risk below, unlimited risk on extreme rallies.",
    "maxProfit": "Between strikes when short calls expire",
    "maxLoss": "Debit paid (below strikes) or unlimited (if stock explodes)",
    "breakeven": "Complex - varies with time",
    "bestFor": "Bullish outlook with high short-term IV. Skilled traders only.",
    "avoidWhen": "New to options. Expecting huge rally. Can't actively manage.",
    "example": {
      "scenario": "Stock at $50, expecting move to $55 over time.",
      "setup": "Buy 1x $50 call 180 DTE at $8, sell 2x $55 calls 30 DTE at $1.50 each. Net debit: $5.",
      "outcome": "Collect $300 every month selling short calls. If stock hits $55, max profit. Above $60, trouble.",
      "numbers": {
        "stockPrice": 50,
        "strikePrice": 55,
        "premium": 5,
        "expiration": "30 days short, 180 days long",
        "result": "Max profit at $55, unlimited risk above $60"
      }
    },
    "tips": [
      "Actively manage - don't set and forget",
      "Roll short calls if tested",
      "Close if stock approaches danger zone",
      "Track P&L daily"
    ],
    "commonMistakes": [
      "Ignoring unlimited risk component",
      "Not rolling short calls",
      "Using without active management plan",
      "Underestimating complexity"
    ],
    "relatedStrategies": [
      "kangaroo-ratio-spread",
      "kangaroo-call-backspread"
    ]
  },
  {
    "id": "panda-covered-call",
    "name": "Bamboo Income",
    "animalId": "panda",
    "difficulty": 1,
    "description": "Steady income generation on stocks you own - the peaceful way to grow wealth.",
    "overview": "Bamboo Income is Puffy's favorite - simple, steady, stress-free. Own quality stocks, sell calls against them, collect premium like harvesting bamboo. No drama, no stress, just consistent income.\n\nThis is how you generate returns while barely lifting a finger. The panda way.",
    "keyPoints": [
      "Own 100 shares of quality stock",
      "Sell OTM call options monthly",
      "Collect premium as steady income",
      "If called away, you sell at a profit anyway",
      "Repeat month after month"
    ],
    "riskProfile": "Low risk - you own the stock anyway.",
    "maxProfit": "Strike - stock cost + premium (capped)",
    "maxLoss": "Stock going to zero (same as holding stock)",
    "breakeven": "Stock purchase price - accumulated premiums",
    "bestFor": "Generating income on long-term holdings. Reducing cost basis.",
    "avoidWhen": "You expect massive upside and don't want to cap gains.",
    "example": {
      "scenario": "Own 100 shares of solid dividend stock at $50. Want extra income.",
      "setup": "Sell $55 call expiring in 30 days for $1.50.",
      "outcome": "Collect $150. If stock below $55, keep shares and premium. If above $55, sell at $55 plus keep $150. Repeat next month.",
      "numbers": {
        "stockPrice": 50,
        "strikePrice": 55,
        "premium": 1.5,
        "expiration": "30 days",
        "result": "$150/month = 3% monthly return potential"
      }
    },
    "tips": [
      "Use on stocks you'd hold long-term anyway",
      "Sell 30-45 days out for optimal decay",
      "Choose strikes 5-10% OTM for balance",
      "Be willing to let shares go at the strike"
    ],
    "commonMistakes": [
      "Using on stocks you love and don't want called away",
      "Strikes too close risking assignment",
      "Ignoring earnings and events",
      "Chasing premium on volatile stocks"
    ],
    "relatedStrategies": [
      "panda-cash-secured-put",
      "panda-collar"
    ]
  },
  {
    "id": "panda-cash-secured-put",
    "name": "Patient Accumulation",
    "animalId": "panda",
    "difficulty": 2,
    "description": "Get paid while waiting to buy stocks you want at lower prices.",
    "overview": "Patient Accumulation is Puffy's buying strategy. Want to own a stock at a lower price? Sell a put at that price and get paid to wait. If the stock drops, you buy at your price. If it doesn't, you keep the premium.\n\nNo rushing, no chasing. Just patient, paid waiting.",
    "keyPoints": [
      "Set aside cash to buy 100 shares",
      "Sell put at price you'd happily buy",
      "Collect premium while waiting",
      "If assigned, you own shares at discount",
      "If not assigned, collect premium and repeat"
    ],
    "riskProfile": "Low-moderate - same as buying stock at strike.",
    "maxProfit": "Premium received (if not assigned)",
    "maxLoss": "Strike minus premium (if stock goes to zero)",
    "breakeven": "Strike price - premium received",
    "bestFor": "Accumulating positions in quality stocks. Generating income while waiting.",
    "avoidWhen": "You don't actually want to own the stock.",
    "example": {
      "scenario": "Want to buy AAPL at $170 but currently $185. Set aside $17,000.",
      "setup": "Sell $170 put expiring in 45 days for $3.",
      "outcome": "Collect $300. If AAPL stays above $170, keep $300 and repeat. If AAPL drops to $165, you buy at effective $167 ($170 - $3 premium).",
      "numbers": {
        "stockPrice": 185,
        "strikePrice": 170,
        "premium": 3,
        "expiration": "45 days",
        "result": "1.76% return on capital in 45 days ($300 / $17,000)"
      }
    },
    "tips": [
      "Only use on stocks you genuinely want to own",
      "Set strike at price you consider a bargain",
      "Keep cash reserved - don't overcommit",
      "Roll down and out if stock approaches strike but you're not ready"
    ],
    "commonMistakes": [
      "Chasing premium on stocks you don't want",
      "Not having the cash to buy if assigned",
      "Selling puts on volatile/risky stocks",
      "Too many open positions"
    ],
    "relatedStrategies": [
      "panda-covered-call",
      "panda-protective-put"
    ]
  },
  {
    "id": "panda-protective-put",
    "name": "Peace of Mind",
    "animalId": "panda",
    "difficulty": 2,
    "description": "Insurance for your holdings - sleep soundly knowing your downside is protected.",
    "overview": "Peace of Mind is Puffy's insurance policy. Own stocks? Buy puts to protect them. Yes, it costs money. But it buys something priceless: peaceful sleep.\n\nWhen markets crash, you're protected. When they don't, you paid for peace. Both are valuable.",
    "keyPoints": [
      "Own stock you want to protect",
      "Buy puts to set a floor on losses",
      "Pay premium for insurance",
      "Keep full upside minus premium cost",
      "Sleep well during market turmoil"
    ],
    "riskProfile": "Very low - downside is strictly limited.",
    "maxProfit": "Unlimited (stock can rise indefinitely)",
    "maxLoss": "Stock price - strike + premium paid",
    "breakeven": "Current stock price + premium paid",
    "bestFor": "Protecting large gains. Hedging before uncertain periods.",
    "avoidWhen": "Premium is excessive. You're confident in no downside.",
    "example": {
      "scenario": "Own NVDA at $400, up 100% from $200. Want to protect gains.",
      "setup": "Buy $380 put expiring in 90 days for $20.",
      "outcome": "Pay $2,000 for insurance. If NVDA crashes to $300, sell at $380. Saved $8,000 minus $2,000 insurance = $6,000 protected.",
      "numbers": {
        "stockPrice": 400,
        "strikePrice": 380,
        "premium": 20,
        "expiration": "90 days",
        "result": "Floor at $360 effective ($380 - $20 premium)"
      }
    },
    "tips": [
      "Buy when calm, not after crash starts",
      "Use longer expirations for better value",
      "Consider collars to offset cost",
      "Think of it as insurance, not a trade"
    ],
    "commonMistakes": [
      "Buying after the crash already happened",
      "Too short expiration (expensive)",
      "Constantly buying protection (adds up)",
      "Forgetting you have protection and panic selling"
    ],
    "relatedStrategies": [
      "panda-collar",
      "panda-covered-call"
    ]
  },
  {
    "id": "panda-collar",
    "name": "The Peaceful Range",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Free downside protection by giving up some upside - ultimate peace.",
    "overview": "The Peaceful Range is Puffy's masterpiece. Own stock, buy a protective put, sell a call to pay for it. Result? Free (or cheap) protection with capped upside.\n\nYou trade unlimited upside potential for guaranteed peace. Most days, that's a zen trade.",
    "keyPoints": [
      "Own 100 shares",
      "Buy OTM put for protection",
      "Sell OTM call to offset put cost",
      "Net cost often zero",
      "Both upside and downside are limited"
    ],
    "riskProfile": "Very low - capped on both sides.",
    "maxProfit": "Call strike - current price + any net credit",
    "maxLoss": "Current price - put strike + any net debit",
    "breakeven": "Stock price adjusted for net premium",
    "bestFor": "Protecting significant gains. Holding through uncertainty.",
    "avoidWhen": "You want maximum upside participation.",
    "example": {
      "scenario": "Own GOOGL at $180, up nicely. Want protection but stay invested.",
      "setup": "Buy $170 put for $5, sell $190 call for $5. Net cost: $0.",
      "outcome": "Protected below $170, capped above $190. Guaranteed exit between $170-$190. Zero cost for this peace.",
      "numbers": {
        "stockPrice": 180,
        "strikePrice": 170,
        "premium": 0,
        "expiration": "60 days",
        "result": "Free protection with $170-$190 range"
      }
    },
    "tips": [
      "Structure for zero cost when possible",
      "Use wider range for more room",
      "Great for concentrated positions",
      "Roll or adjust as stock moves"
    ],
    "commonMistakes": [
      "Range too tight",
      "Forgetting about dividends",
      "Not adjusting when thesis changes",
      "Over-collaring entire portfolio"
    ],
    "relatedStrategies": [
      "panda-covered-call",
      "panda-protective-put"
    ]
  },
  {
    "id": "panda-calendar-spread",
    "name": "Time Flows Like a River",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Profit from time passing - the most zen of all trades.",
    "overview": "Time Flows Like a River is Puffy's theta play. Sell near-term option, buy longer-term option. Time decays the short option faster than the long. You profit from the passage of time itself.\n\nNo predicting direction. No stress. Just let time do its work.",
    "keyPoints": [
      "Sell shorter-dated option",
      "Buy longer-dated option at same strike",
      "Profit from differential time decay",
      "Best when stock stays near strike",
      "Time is your friend"
    ],
    "riskProfile": "Moderate - max loss is debit paid.",
    "maxProfit": "Variable - depends on IV and position",
    "maxLoss": "Net debit paid",
    "breakeven": "Complex - depends on theta and vega",
    "bestFor": "Stocks expected to consolidate. Low-stress income.",
    "avoidWhen": "Expecting big moves. IV term structure inverted.",
    "example": {
      "scenario": "MSFT at $420, expected to consolidate for a few weeks.",
      "setup": "Sell $420 call (30 days) for $10. Buy $420 call (60 days) for $16. Debit: $6.",
      "outcome": "If MSFT stays at $420, front call decays to $0, back call worth ~$12-14. Profit: $600-800.",
      "numbers": {
        "stockPrice": 420,
        "strikePrice": 420,
        "premium": 6,
        "expiration": "30/60 days",
        "result": "Potential 100-130% return on debit"
      }
    },
    "tips": [
      "Use ATM strikes for maximum theta",
      "Enter when front-month IV is higher",
      "Close before front expiration",
      "Don't fight the direction if stock moves"
    ],
    "commonMistakes": [
      "Using when IV term structure doesn't support",
      "Holding through front expiration",
      "Expecting big moves",
      "Not adjusting if stock moves away"
    ],
    "relatedStrategies": [
      "panda-collar",
      "panda-iron-condor"
    ]
  },
  {
    "id": "panda-iron-condor",
    "name": "The Gentle Range",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Collect premium from both sides - profit from peaceful markets.",
    "overview": "The Gentle Range is Puffy's income machine. Sell premium above AND below the stock, protected by wings. The stock just needs to stay in a range - which it usually does.\n\nNo stress about direction. Just collect your premium and enjoy life.",
    "keyPoints": [
      "Sell OTM put spread below price",
      "Sell OTM call spread above price",
      "Collect premium from both sides",
      "Profit if stock stays in range",
      "Defined risk from long wings"
    ],
    "riskProfile": "Moderate - defined on both sides.",
    "maxProfit": "Net credit received",
    "maxLoss": "Wider wing width - credit",
    "breakeven": "Short strikes ± credit received",
    "bestFor": "Range-bound markets. Steady income. Peaceful trading.",
    "avoidWhen": "Strong trends. Major catalysts coming.",
    "example": {
      "scenario": "SPY at $500, expecting range-bound action.",
      "setup": "Sell $480/$475 put spread, sell $520/$525 call spread. Total credit: $1.50.",
      "outcome": "Max profit $150 if SPY stays between $480-$520. Max loss $350 on either side.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 480,
        "premium": 1.5,
        "expiration": "30 days",
        "result": "Risk $350 to make $150, ~70% probability"
      }
    },
    "tips": [
      "Use on indexes for more predictable ranges",
      "Choose 15-20 delta strikes for balance",
      "Close at 50% profit",
      "Adjust if one side is tested"
    ],
    "commonMistakes": [
      "Using in trending markets",
      "Ignoring when one side is breached",
      "Strikes too tight",
      "Holding to expiration"
    ],
    "relatedStrategies": [
      "panda-calendar-spread",
      "panda-collar"
    ]
  },
  {
    "id": "panda-short-straddle",
    "name": "Zen Straddle",
    "animalId": "panda",
    "difficulty": 2,
    "description": "The ultimate calm - collect premium from both sides while the market stays still.",
    "overview": "Puffy's Zen Straddle is inner peace meets income. Sell both an ATM call and ATM put. Collect maximum premium. Then breathe deeply and let time decay work its magic.\n\nWarning: This has unlimited risk. But Puffy only uses it on calm, stable indexes with a plan. No stress, just theta.",
    "keyPoints": [
      "Sell ATM call and ATM put at same strike",
      "Maximum premium collection",
      "Profit from time decay on both sides",
      "Best in low volatility environments",
      "UNLIMITED RISK - requires monitoring"
    ],
    "riskProfile": "HIGH RISK - unlimited losses in both directions, but used with discipline on stable underlyings.",
    "maxProfit": "Total premium collected from both options",
    "maxLoss": "Unlimited in both directions",
    "breakeven": "Strike ± total premium collected",
    "bestFor": "Low volatility periods. Stable indexes. Theta harvesting. Experienced traders.",
    "avoidWhen": "High volatility. Catalysts approaching. Any uncertainty. Beginners.",
    "example": {
      "scenario": "SPY at $500. VIX at 12. Market expected to consolidate peacefully.",
      "setup": "Sell $500 call for $6, sell $500 put for $6. Total credit: $12.",
      "outcome": "Max profit: $1,200 if SPY at exactly $500. Breakevens: $488 and $512. Profit zone narrows as time passes, but so does risk.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 12,
        "expiration": "45 days",
        "result": "$1,200 max profit, unlimited risk outside range"
      }
    },
    "tips": [
      "Only use on stable, liquid indexes (SPY, IWM, QQQ)",
      "Enter when VIX is elevated but expecting calm",
      "Have adjustment plan - convert to iron butterfly if breached",
      "Close at 50-70% profit to reduce tail risk"
    ],
    "commonMistakes": [
      "Using on individual stocks (too volatile)",
      "Not monitoring daily",
      "No adjustment plan when tested",
      "Over-sizing relative to account"
    ],
    "relatedStrategies": [
      "panda-covered-short-straddle",
      "panda-iron-condor"
    ]
  },
  {
    "id": "panda-long-call-condor",
    "name": "The Peaceful Call Condor",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Defined risk, defined profit - the zen approach to range trading.",
    "overview": "The Peaceful Call Condor is Puffy's wide-zone, low-stress trade. It's like a butterfly but with wider wings - more room to breathe, more peace of mind.\n\nYou profit if the stock stays within a range. Low cost, low maintenance, low stress. The bamboo way.",
    "keyPoints": [
      "Buy low call, sell middle-low call, sell middle-high call, buy high call",
      "Wider profit zone than butterfly",
      "Lower premium but also lower risk",
      "All calls, so bullish bias",
      "Defined max profit and loss"
    ],
    "riskProfile": "Low risk - defined debit.",
    "maxProfit": "Middle spread width - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Lower middle strike + debit, upper middle strike - debit",
    "bestFor": "Range-bound stocks. Low volatility. Patient traders.",
    "avoidWhen": "Expecting big moves. High volatility. Tight ranges.",
    "example": {
      "scenario": "Stock at $100 expected to stay between $95-$105.",
      "setup": "Buy $90 call, sell $95 call, sell $105 call, buy $110 call. Debit: $1.",
      "outcome": "Max profit $400 if stock between $95-$105. Max loss $100 outside wings.",
      "numbers": {
        "stockPrice": 100,
        "strikePrice": 100,
        "premium": 1,
        "expiration": "45 days",
        "result": "$400 max profit, $100 max loss"
      }
    },
    "tips": [
      "Give yourself wide breakevens",
      "Enter when IV is moderate",
      "Close early at 50% profit",
      "Use on stable underlyings"
    ],
    "commonMistakes": [
      "Making wings too narrow",
      "Holding for max profit",
      "Using on volatile stocks",
      "Not checking liquidity"
    ],
    "relatedStrategies": [
      "panda-iron-condor",
      "panda-long-put-condor"
    ]
  },
  {
    "id": "panda-long-put-condor",
    "name": "The Peaceful Put Condor",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Wide range protection - profit from stability with a bearish tilt.",
    "overview": "The Peaceful Put Condor is the mirror of the call condor. Same peace, same wide range, but using all puts. Slight bearish bias.\n\nPerfect for when you want to profit from stability but prefer working with puts. Still zen, still defined risk.",
    "keyPoints": [
      "Buy low put, sell middle-low put, sell middle-high put, buy high put",
      "Wider profit zone than put butterfly",
      "Lower premium but lower risk",
      "All puts, so slight bearish bias",
      "Defined max profit and loss"
    ],
    "riskProfile": "Low risk - defined debit.",
    "maxProfit": "Middle spread width - debit paid",
    "maxLoss": "Debit paid",
    "breakeven": "Upper middle strike - debit, lower middle strike + debit",
    "bestFor": "Range-bound stocks. Bearish-neutral outlook. Low stress trading.",
    "avoidWhen": "Expecting big moves. High volatility. Bullish outlook.",
    "example": {
      "scenario": "Index at $500 expected to stay between $490-$510.",
      "setup": "Buy $520 put, sell $510 put, sell $490 put, buy $480 put. Debit: $1.50.",
      "outcome": "Max profit $850 if index between $490-$510. Max loss $150 outside wings.",
      "numbers": {
        "stockPrice": 500,
        "strikePrice": 500,
        "premium": 1.5,
        "expiration": "45 days",
        "result": "$850 max profit, $150 max loss"
      }
    },
    "tips": [
      "Use on indexes for stability",
      "Exit at 50-70% max profit",
      "Check all 4 strikes have liquidity",
      "Keep position small"
    ],
    "commonMistakes": [
      "Using on individual stocks",
      "Too narrow profit zone",
      "Holding to expiration",
      "Ignoring bid-ask spreads"
    ],
    "relatedStrategies": [
      "panda-long-call-condor",
      "panda-iron-condor"
    ]
  },
  {
    "id": "panda-covered-short-straddle",
    "name": "Maximum Zen Income",
    "animalId": "panda",
    "difficulty": 3,
    "description": "Own the stock, sell both call and put - ultimate premium collection with stock ownership.",
    "overview": "Maximum Zen Income is Puffy's most advanced income strategy. You own 100 shares of stock AND sell both a call and put against it. Triple income: dividends + call premium + put premium.\n\nThis requires serious zen. You're selling unlimited upside and taking on extra downside risk. But the premium collection is massive.",
    "keyPoints": [
      "Own 100 shares of stock",
      "Sell ATM call (covered)",
      "Sell ATM put (cash-secured or naked)",
      "Massive premium from both options",
      "Best on stable dividend stocks"
    ],
    "riskProfile": "HIGH RISK - capped upside, amplified downside. Only for experienced zen masters.",
    "maxProfit": "Call strike - stock cost + both premiums + dividends",
    "maxLoss": "If assigned on put, you own 200 shares at strike, minus premiums",
    "breakeven": "Stock price - total premium collected",
    "bestFor": "Stable dividend aristocrats. Very low volatility. Sideways markets.",
    "avoidWhen": "Volatile stocks. Catalysts. Uncertain conditions. Beginners.",
    "example": {
      "scenario": "Own 100 shares of KO at $60. Stock stable, collecting dividends.",
      "setup": "Sell $60 call for $2, sell $60 put for $2. Total premium: $4.",
      "outcome": "Collect $400 + dividends. If called away, profit is $400. If put assigned, own 200 shares at $56 effective cost.",
      "numbers": {
        "stockPrice": 60,
        "strikePrice": 60,
        "premium": 4,
        "expiration": "45 days",
        "result": "$400 premium, capped upside, risk of 200 shares"
      }
    },
    "tips": [
      "Only use on ultra-stable blue chips",
      "Have cash for potential put assignment",
      "Enter when stock is range-bound",
      "Close early if stock trends"
    ],
    "commonMistakes": [
      "Using on volatile stocks",
      "Not having cash for put assignment",
      "Letting both options get assigned",
      "Ignoring stock fundamentals"
    ],
    "relatedStrategies": [
      "panda-short-straddle",
      "panda-covered-call"
    ]
  }
];

/** Get jungle strategies for a specific animal */
export const getStrategiesByAnimal = (animalId: string): JungleStrategy[] => {
  return JUNGLE_STRATEGIES.filter(s => s.animalId === animalId);
};

/** Get a specific jungle strategy by ID */
export const getJungleStrategy = (id: string): JungleStrategy | undefined => {
  return JUNGLE_STRATEGIES.find(s => s.id === id);
};

/** Get jungle strategies matching a core strategy name (e.g., 'covered-call') */
export const getJungleStrategiesForCoreStrategy = (coreStrategyId: string): JungleStrategy[] => {
  return JUNGLE_STRATEGIES.filter(s => {
    const coreName = coreStrategyId.replace(/^(express-|mirror-)/, '');
    return s.name.toLowerCase().replace(/[\s-]/g, '') === coreName.replace(/-/g, '') ||
           s.id.endsWith(coreName);
  });
};

/** Get all unique animal IDs */
export const getUniqueAnimals = (): string[] => {
  return [...new Set(JUNGLE_STRATEGIES.map(s => s.animalId))];
};

