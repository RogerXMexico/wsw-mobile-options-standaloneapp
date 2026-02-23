// Comprehensive Options Vocabulary Data
// 200+ terms organized by category with rich educational content
// Source: merged from desktop vocabularyCategories, glossary, and additional terms

// ── Enriched Interface ─────────────────────────────────────────────────────────

export type VisualIndicator = 'buy' | 'sell' | 'neutral';

export type VocabularyCategory =
  | 'Basics'
  | 'Greeks'
  | 'Volatility'
  | 'Moneyness'
  | 'Pricing'
  | 'Mechanics'
  | 'Trading'
  | 'Order Types'
  | 'Strategies'
  | 'Flow & Signals'
  | 'Risk Management'
  | 'Market Structure'
  | 'Advanced Concepts';

export interface VocabularyTerm {
  term: string;
  definition: string;
  category: VocabularyCategory;
  abbrev?: string;
  example?: string;
  tip?: string;
  visual?: VisualIndicator;
}

// ── Category Metadata ──────────────────────────────────────────────────────────

export interface CategoryMeta {
  key: VocabularyCategory;
  description: string;
  color: string; // hex color for the category accent
}

export const CATEGORY_META: CategoryMeta[] = [
  { key: 'Basics', description: 'Fundamental options concepts every trader must know', color: '#10b981' },
  { key: 'Greeks', description: 'Risk metrics that quantify how option prices change', color: '#a855f7' },
  { key: 'Volatility', description: 'Understanding and measuring market uncertainty', color: '#8b5cf6' },
  { key: 'Moneyness', description: 'Where the strike sits relative to stock price', color: '#06b6d4' },
  { key: 'Pricing', description: 'What the numbers on an options chain mean', color: '#f59e0b' },
  { key: 'Mechanics', description: 'How options markets work behind the scenes', color: '#64748b' },
  { key: 'Trading', description: 'Order execution and position management', color: '#10b981' },
  { key: 'Order Types', description: 'The four ways to enter or exit an options position', color: '#34d399' },
  { key: 'Strategies', description: 'Common options strategies and combinations', color: '#06b6d4' },
  { key: 'Flow & Signals', description: 'Signals indicating smart money or institutional activity', color: '#f43f5e' },
  { key: 'Risk Management', description: 'Protecting capital and managing exposure', color: '#f59e0b' },
  { key: 'Market Structure', description: 'How exchanges, market makers, and clearing work', color: '#64748b' },
  { key: 'Advanced Concepts', description: 'Deeper topics for experienced traders', color: '#a855f7' },
];

// ── All Categories (for filter pills) ──────────────────────────────────────────

export const ALL_CATEGORIES: string[] = [
  'All',
  ...CATEGORY_META.map(c => c.key),
];

// ── Vocabulary Terms ───────────────────────────────────────────────────────────

export const VOCABULARY_TERMS: VocabularyTerm[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // BASICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Call Option',
    definition: 'A contract giving the holder the RIGHT to BUY 100 shares of the underlying stock at the strike price before expiration. Calls increase in value when the stock goes up.',
    category: 'Basics',
    example: 'You buy 1 AAPL $180 Call expiring in 30 days. If AAPL goes to $190, your call lets you buy at $180 — a $10 intrinsic gain.',
    tip: 'Calls are bullish bets or income tools (when sold). Most beginners start here.',
    visual: 'buy',
  },
  {
    term: 'Put Option',
    definition: 'A contract giving the holder the RIGHT to SELL 100 shares of the underlying stock at the strike price before expiration. Puts increase in value when the stock goes down.',
    category: 'Basics',
    example: 'You buy 1 TSLA $250 Put. If TSLA drops to $230, your put lets you sell at $250 — a $20 intrinsic gain.',
    tip: 'Puts are used for bearish bets or as portfolio insurance to protect stock holdings.',
    visual: 'sell',
  },
  {
    term: 'Strike Price',
    definition: 'The price at which the option holder can buy (call) or sell (put) the underlying stock if they exercise the option.',
    category: 'Basics',
    example: '$150 strike call = right to BUY stock at $150. $150 strike put = right to SELL stock at $150.',
    tip: 'Choose strikes based on your probability preference and risk/reward goals.',
  },
  {
    term: 'Premium',
    definition: 'The total price paid for an option contract. Premium = Intrinsic Value + Extrinsic (Time) Value. This is what the buyer pays and the seller collects.',
    category: 'Basics',
    example: 'You pay $3.50 premium for a call = $350 total cost (options are priced per share, 100 shares per contract).',
    tip: 'Remember: Option prices shown are per-share. Multiply by 100 for your actual cost.',
  },
  {
    term: 'Expiration Date',
    abbrev: 'DTE (Days to Expiry)',
    definition: 'The last day the option can be traded or exercised. After this date, the option ceases to exist. All extrinsic value is gone.',
    category: 'Basics',
    example: '45 DTE = option expires in 45 days. 0 DTE = expires today.',
    tip: 'Longer DTE = more time value, slower decay. Shorter DTE = cheaper, faster decay, more gamma risk.',
  },
  {
    term: 'Contract',
    definition: 'One standard option contract represents 100 shares of the underlying stock. When you see a price of $2.50, your actual cost is $250.',
    category: 'Basics',
    example: 'Buying 5 contracts at $1.00 each costs $500 total (5 x 100 x $1.00) and controls 500 shares.',
    tip: 'Always think in total dollars, not per-share price. A "cheap" $0.05 option still costs $5 per contract.',
  },
  {
    term: 'Underlying',
    definition: 'The stock, ETF, or index that the option contract is based on. Options derive their value from the underlying asset.',
    category: 'Basics',
    example: 'AAPL options have Apple stock as the underlying. SPX options have the S&P 500 index as the underlying.',
    tip: 'Know your underlying well before trading its options. The stock drives everything.',
  },
  {
    term: 'Option Chain',
    definition: 'A listing of all available option contracts for a given underlying, organized by expiration date and strike price. Shows calls on one side, puts on the other.',
    category: 'Basics',
    example: 'The AAPL option chain shows all available strikes from $120 to $220 across multiple expiration dates.',
    tip: 'Focus on liquid strikes (high OI, tight spreads) when building your trades.',
  },
  {
    term: 'Long',
    definition: 'You BOUGHT the option. You have rights, not obligations. Your maximum risk is the premium paid.',
    category: 'Basics',
    example: 'Long 1 SPY $450 Call means you bought it. You have the right to buy SPY at $450.',
    tip: 'Being long means you want the option to increase in value so you can sell it for a profit.',
    visual: 'buy',
  },
  {
    term: 'Short',
    definition: 'You SOLD the option. You have obligations to fulfill if assigned. You collected premium upfront but face potential losses.',
    category: 'Basics',
    example: 'Short 1 SPY $450 Put means you sold it. You may be forced to buy SPY at $450 if assigned.',
    tip: 'Short options benefit from time decay but carry obligation risk. Always know your max loss.',
    visual: 'sell',
  },
  {
    term: 'Moneyness',
    definition: 'Describes an option\'s relationship to the current stock price. Deep ITM (Delta >0.80), ATM (Delta ~0.50), OTM (Delta <0.30), Deep OTM (Delta <0.10).',
    category: 'Basics',
    tip: 'Moneyness determines the mix of intrinsic and extrinsic value in the premium.',
  },
  {
    term: 'Greeks',
    definition: 'The five key risk measurements for options: Delta (directional exposure), Gamma (rate of Delta change), Theta (time decay), Vega (volatility sensitivity), and Rho (interest rate sensitivity).',
    category: 'Basics',
    tip: 'Mastering the Greeks is what separates gamblers from traders.',
  },
  {
    term: 'Option Writer',
    definition: 'The seller of an option contract. The writer collects premium but takes on the obligation to buy or sell shares if assigned.',
    category: 'Basics',
    example: 'If you STO a covered call, you are the option writer. You receive premium but may have to sell your shares.',
    tip: 'Writers profit when options expire worthless or decrease in value.',
    visual: 'sell',
  },
  {
    term: 'Option Holder',
    definition: 'The buyer of an option contract. The holder pays premium and gains the right (not obligation) to exercise.',
    category: 'Basics',
    example: 'If you BTO a put, you are the holder. You paid premium and can exercise your right to sell shares at the strike.',
    tip: 'Holders need the stock to move enough to overcome the premium paid.',
    visual: 'buy',
  },
  {
    term: 'Derivative',
    definition: 'A financial instrument whose value is derived from an underlying asset. Options are derivatives because their price depends on the underlying stock.',
    category: 'Basics',
    tip: 'Options, futures, and swaps are all derivatives. The underlying asset is what matters.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER TYPES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Buy to Open',
    abbrev: 'BTO',
    definition: 'Opening a NEW position by BUYING an option. You pay premium to acquire rights. This makes you the option BUYER (holder).',
    category: 'Order Types',
    example: 'You BTO 1 AAPL $180 Call = You paid premium to have the RIGHT to buy 100 shares of AAPL at $180.',
    tip: 'BTO positions have defined risk (max loss = premium paid) but require the stock to move in your favor to profit.',
    visual: 'buy',
  },
  {
    term: 'Buy to Close',
    abbrev: 'BTC',
    definition: 'CLOSING an existing SHORT position by buying back the option you previously sold. You pay to exit and eliminate your obligation.',
    category: 'Order Types',
    example: 'You previously STO a put for $2.00 credit. Stock went up, put is now $0.50. You BTC to close for $0.50, keeping $1.50 profit.',
    tip: 'BTC when you want to take profits early, cut losses, or free up margin on a short position.',
    visual: 'buy',
  },
  {
    term: 'Sell to Open',
    abbrev: 'STO',
    definition: 'Opening a NEW position by SELLING an option. You collect premium but take on an OBLIGATION. This makes you the option SELLER (writer).',
    category: 'Order Types',
    example: 'You STO 1 AAPL $170 Put for $3.00 = You collected $300 premium but must buy 100 AAPL shares at $170 if assigned.',
    tip: 'STO positions benefit from time decay (theta) but can have significant or unlimited risk depending on the strategy.',
    visual: 'sell',
  },
  {
    term: 'Sell to Close',
    abbrev: 'STC',
    definition: 'CLOSING an existing LONG position by selling the option you previously bought. You exit your position and receive premium back.',
    category: 'Order Types',
    example: 'You BTO a call for $1.00. Stock rallied, call is now worth $4.00. You STC for $4.00, making $3.00 profit.',
    tip: 'STC to realize gains, cut losses, or exit before expiration. Don\'t let winning trades turn into losers!',
    visual: 'sell',
  },
  {
    term: 'Limit Order',
    definition: 'An order to buy or sell at a specific price or better. You control the price but not whether or when it fills.',
    category: 'Order Types',
    example: 'You place a limit order to buy a call at $2.50. The order only fills if someone is willing to sell at $2.50 or less.',
    tip: 'Always use limit orders for options. Market orders on wide spreads can cost you dearly.',
  },
  {
    term: 'Market Order',
    definition: 'An order that executes immediately at the best available price. Guarantees execution but not price.',
    category: 'Order Types',
    example: 'You place a market order to buy a call. It fills instantly but you might pay the full ask price on a wide spread.',
    tip: 'Avoid market orders on options with wide bid-ask spreads. You could lose hundreds instantly.',
  },
  {
    term: 'Stop Order',
    definition: 'An order that becomes a market order once a specified price is reached. Used for limiting losses or protecting profits.',
    category: 'Order Types',
    example: 'You bought a call at $3.00 and set a stop at $1.50. If it drops to $1.50, a market order triggers to sell.',
    tip: 'Stop orders on options can be dangerous in illiquid markets. Wide spreads mean poor fill prices.',
  },
  {
    term: 'GTC Order',
    abbrev: 'Good Till Cancelled',
    definition: 'An order that remains active until it is either filled or manually cancelled by the trader.',
    category: 'Order Types',
    tip: 'GTC orders are useful for setting target exit prices, but review them regularly to make sure they still make sense.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GREEKS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Delta',
    abbrev: 'Δ',
    definition: 'How much the option price changes per $1 move in the stock. Also approximates probability of expiring ITM. Range: 0 to 1 (calls) or -1 to 0 (puts).',
    category: 'Greeks',
    example: 'Delta 0.60 call: If stock goes up $1, option gains ~$0.60. Also ~60% chance of expiring ITM.',
    tip: 'Delta 0.50 = ATM option. Use delta to estimate directional exposure: 10 contracts x 0.50 delta = exposure of 500 shares.',
  },
  {
    term: 'Gamma',
    abbrev: 'Γ',
    definition: 'How fast delta changes as the stock moves. High gamma means delta changes rapidly. Highest for ATM options near expiration.',
    category: 'Greeks',
    example: 'Gamma 0.05: If stock moves $1, delta changes by 0.05 (e.g., delta goes from 0.50 to 0.55).',
    tip: 'Gamma risk explodes near expiration for ATM options. Small moves cause huge delta swings.',
  },
  {
    term: 'Theta',
    abbrev: 'Θ',
    definition: 'Daily time decay: how much value the option loses each day just from time passing. Almost always negative for long options.',
    category: 'Greeks',
    example: 'Theta -0.05: Option loses $5 per contract per day ($0.05 x 100 shares).',
    tip: 'Theta accelerates as expiration approaches. The last 30 days see the fastest decay.',
  },
  {
    term: 'Vega',
    abbrev: 'ν',
    definition: 'How much the option price changes per 1% change in implied volatility. Higher for longer-dated options.',
    category: 'Greeks',
    example: 'Vega 0.15: If IV increases 1% (e.g., 30% to 31%), option gains $0.15 ($15 per contract).',
    tip: 'IV crush after earnings can devastate option buyers even if the stock moves the right direction!',
  },
  {
    term: 'Rho',
    abbrev: 'ρ',
    definition: 'How much the option price changes per 1% change in interest rates. Usually minor for short-dated options, more relevant for LEAPS.',
    category: 'Greeks',
    example: 'Rho 0.10 on a LEAP: If interest rates rise 1%, the call gains ~$0.10.',
    tip: 'Rho is often ignored, but in rising rate environments, it can matter for long-dated positions.',
  },
  {
    term: 'Theta Decay',
    definition: 'The daily erosion of an option\'s extrinsic value as expiration approaches. Not linear — accelerates exponentially in the final 30 days, with the steepest drop in the last week.',
    category: 'Greeks',
    example: 'A 45 DTE option might lose $2/day in theta but a 7 DTE option of the same strike could lose $10/day.',
    tip: 'ATM options have the highest theta. Sellers profit from theta; buyers fight against it. The "45 DTE, close at 21 DTE" framework is popular for sellers.',
  },
  {
    term: 'Gamma Risk',
    definition: 'The danger of accelerating losses when gamma is high, typically for short options near ATM as expiration approaches. High gamma means delta changes rapidly, so positions can swing from profitable to catastrophic in minutes.',
    category: 'Greeks',
    example: 'A short 0 DTE ATM straddle can go from breakeven to -$2,000 in minutes if the stock surges.',
    tip: 'This is why 0 DTE trading is so dangerous for sellers. Manage gamma risk by closing positions before expiration.',
  },
  {
    term: 'Charm',
    definition: 'The rate at which delta changes over time (delta decay). Measures how delta shifts as one day passes, separate from stock price movement.',
    category: 'Greeks',
    tip: 'Charm explains why OTM option deltas shrink and ITM option deltas grow as expiration nears, even with no price change.',
  },
  {
    term: 'Vanna',
    definition: 'The rate of change of delta with respect to changes in implied volatility. Shows how delta shifts when IV moves.',
    category: 'Greeks',
    tip: 'Vanna is important for understanding how volatility changes affect your directional exposure.',
  },
  {
    term: 'Volga',
    abbrev: 'Vomma',
    definition: 'The sensitivity of vega to changes in implied volatility. Measures how vega itself changes when IV moves.',
    category: 'Greeks',
    tip: 'Volga matters most for OTM options and during volatility spikes. Dealers hedge volga exposure, which can amplify market moves.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLATILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Implied Volatility',
    abbrev: 'IV',
    definition: 'The market\'s expectation of future volatility, "backed out" from option prices. Higher IV = more expensive options. Think of it as the market\'s fear gauge.',
    category: 'Volatility',
    example: 'AAPL IV at 25% is calm. TSLA IV at 60% is volatile. Meme stock IV at 150%+ is extreme.',
    tip: 'Compare current IV to historical IV (IV Rank/Percentile). High IV = good for selling, low IV = good for buying.',
  },
  {
    term: 'Historical Volatility',
    abbrev: 'HV',
    definition: 'A measure of how much the stock has ACTUALLY moved in the past, calculated from historical price data. Compare to IV to find opportunity.',
    category: 'Volatility',
    example: 'If HV is 20% but IV is 35%, the market is pricing in more future volatility than what has occurred. Options may be overpriced.',
    tip: 'When IV >> HV, options are expensive (sell premium). When IV << HV, options may be cheap (buy premium).',
  },
  {
    term: 'IV Rank',
    definition: 'Where current IV sits relative to its 52-week range, expressed as a percentile (0-100). Tells you if IV is historically high or low for this stock.',
    category: 'Volatility',
    example: 'IV Rank of 80 means current IV is near the top of its yearly range. Good time to sell premium.',
    tip: 'High IV Rank (>50) = good for selling premium. Low IV Rank (<30) = options are cheap, consider buying.',
  },
  {
    term: 'IV Percentile',
    definition: 'The percentage of days over the past year that IV was below the current level. Uses frequency instead of range — often considered more reliable than IV Rank.',
    category: 'Volatility',
    example: 'IV Percentile of 90% means IV was lower than today on 90% of trading days.',
    tip: 'IV Percentile is less distorted by single IV spikes. Many professional traders prefer it over IV Rank.',
  },
  {
    term: 'IV Crush',
    definition: 'The sudden, sharp drop in implied volatility after a known event (like earnings). Options lose value rapidly even if the stock moves in your favor.',
    category: 'Volatility',
    example: 'NFLX IV is 80% before earnings. After the report, IV drops to 30% overnight. Your long calls lose value despite the stock moving up 3%.',
    tip: 'Never buy naked options into earnings expecting a big move. IV crush can wipe out your profits. Spread strategies reduce IV crush impact.',
  },
  {
    term: 'Volatility Skew',
    definition: 'The pattern where OTM puts are priced higher (higher IV) than equidistant OTM calls. The market prices crash risk more aggressively than rally risk.',
    category: 'Volatility',
    example: 'A $100 stock: the $90 put might have 35% IV while the $110 call has only 28% IV. Downside protection costs more.',
    tip: 'Skew is why put spreads often collect more credit than call spreads at the same distance from ATM.',
  },
  {
    term: 'Volatility Smile',
    definition: 'A U-shaped curve showing that both deep OTM puts and deep OTM calls have higher IV than ATM options. Common in indices and around binary events.',
    category: 'Volatility',
    example: 'Before a major Fed announcement, both far OTM puts and calls have elevated IV, creating a "smile" when plotted.',
    tip: 'The smile reflects the market pricing in the chance of extreme moves in either direction.',
  },
  {
    term: 'Expected Move',
    definition: 'The market\'s predicted price range for a given period, derived from IV. Calculated as Stock Price x IV x sqrt(DTE/365). Approximately 68% of the time (1 standard deviation), the stock stays within this range.',
    category: 'Volatility',
    example: 'A $100 stock with 30% IV: expected move over 30 days is roughly +/-$8.66.',
    tip: 'Use expected move to set strike prices and evaluate if your trade has a realistic chance of profit.',
  },
  {
    term: 'Implied Move',
    definition: 'The expected price move around a specific event (usually earnings), extracted from option prices. Calculated by looking at the ATM straddle price for the nearest expiration after the event.',
    category: 'Volatility',
    example: 'If the ATM straddle costs $5 on a $100 stock, the market implies a +/-$5 (5%) move around earnings.',
    tip: 'Compare the implied move to actual historical earnings moves to find over- or under-priced events.',
  },
  {
    term: 'VIX',
    definition: 'The CBOE Volatility Index, often called the "fear index." It measures the expected 30-day volatility of the S&P 500, derived from SPX option prices.',
    category: 'Volatility',
    example: 'VIX at 15 = calm markets. VIX at 30+ = elevated fear. VIX at 50+ = panic (rare, like March 2020).',
    tip: 'VIX tends to spike during sell-offs and drift lower during rallies. You cannot trade VIX directly — only VIX futures and options.',
  },
  {
    term: 'Realized Volatility',
    definition: 'The actual volatility that occurred over a past time period. Calculated from actual stock price changes. Compare to implied volatility to see if options were overpriced or underpriced.',
    category: 'Volatility',
    example: 'If IV was 30% when you sold a straddle and realized vol came in at 20%, you profited from the volatility risk premium.',
    tip: 'Consistently selling when IV > realized vol is the foundation of many professional options strategies.',
  },
  {
    term: 'Volatility Risk Premium',
    abbrev: 'VRP',
    definition: 'The tendency for implied volatility to exceed realized volatility. Options are systematically overpriced because market participants pay extra for insurance against uncertainty.',
    category: 'Volatility',
    tip: 'The VRP is why option sellers tend to win over time. But the risk is that when vol explodes, losses can be severe.',
  },
  {
    term: 'Term Structure',
    definition: 'The pattern of implied volatility across different expiration dates. In normal markets, longer-dated options have higher IV (contango). Before events, near-term IV can spike above long-term (backwardation).',
    category: 'Volatility',
    tip: 'Term structure helps you choose which expiration to trade. Calendar spreads exploit differences in term structure.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MONEYNESS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'In The Money',
    abbrev: 'ITM',
    definition: 'Option has intrinsic value. CALLS: strike price is below the stock price. PUTS: strike price is above the stock price. Would be worth something if exercised now.',
    category: 'Moneyness',
    example: 'Stock at $150. The $140 Call is $10 ITM. The $160 Put is $10 ITM.',
    tip: 'Deep ITM options behave more like stock (high delta). Less leverage but more reliable.',
    visual: 'buy',
  },
  {
    term: 'At The Money',
    abbrev: 'ATM',
    definition: 'Strike price equals (or is very close to) the current stock price. Has the most extrinsic value and highest gamma. Delta is approximately 0.50.',
    category: 'Moneyness',
    example: 'Stock at $150, the $150 strike is ATM. It has the highest time value of any strike.',
    tip: 'ATM options have the most time value to lose. Great for sellers, tricky for buyers.',
  },
  {
    term: 'Out of The Money',
    abbrev: 'OTM',
    definition: 'Option has NO intrinsic value. CALLS: strike is above stock price. PUTS: strike is below stock price. 100% extrinsic value — worthless if exercised now.',
    category: 'Moneyness',
    example: 'Stock at $150. The $160 Call is $10 OTM. The $140 Put is $10 OTM.',
    tip: 'OTM options are cheaper (more leverage) but have lower probability of profit. Most expire worthless.',
    visual: 'sell',
  },
  {
    term: 'Deep In The Money',
    definition: 'An option that is significantly ITM, typically with a delta above 0.80. These behave almost like owning the underlying stock.',
    category: 'Moneyness',
    example: 'Stock at $150, the $120 Call has ~$30 of intrinsic value and delta near 0.95. Almost like owning shares.',
    tip: 'Deep ITM calls are sometimes used as stock replacement with less capital outlay.',
  },
  {
    term: 'Deep Out of The Money',
    definition: 'An option that is far OTM, typically with a delta below 0.10. Very cheap but extremely unlikely to be profitable. Often called "lottery tickets."',
    category: 'Moneyness',
    example: 'Stock at $150, the $200 Call with 2 weeks to expiry might cost $0.05. Almost certainly expires worthless.',
    tip: 'Buying deep OTM options feels cheap but the probability of profit is very low. Selling them can be profitable but risky.',
  },
  {
    term: 'Intrinsic Value',
    definition: 'The "real" value if exercised immediately. For calls: Stock Price - Strike (if positive). For puts: Strike - Stock Price (if positive). Only ITM options have intrinsic value.',
    category: 'Moneyness',
    example: 'Stock at $105, $100 Call has $5 intrinsic value. That $100 Call is $5 "in the money."',
    tip: 'Only ITM options have intrinsic value. OTM options are 100% extrinsic value.',
  },
  {
    term: 'Extrinsic Value',
    abbrev: 'Time Value',
    definition: 'The portion of premium above intrinsic value. This is what you pay for TIME and UNCERTAINTY. Decays to zero at expiration.',
    category: 'Moneyness',
    example: '$100 Call trading at $7.00 with $5 intrinsic = $2.00 extrinsic value (time value).',
    tip: 'Option sellers profit from extrinsic value decay. Buyers need movement to overcome it.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Bid',
    definition: 'The highest price a BUYER is currently willing to pay. If you want to sell immediately, you receive the bid price.',
    category: 'Pricing',
    example: 'Bid: $2.45 means market makers will buy your option for $2.45 right now.',
    tip: 'Never market sell into the bid on wide spreads — you are giving away money. Use limit orders.',
    visual: 'buy',
  },
  {
    term: 'Ask',
    abbrev: 'Offer',
    definition: 'The lowest price a SELLER is currently willing to accept. If you want to buy immediately, you pay the ask price.',
    category: 'Pricing',
    example: 'Ask: $2.55 means the cheapest available option costs $2.55.',
    tip: 'The ask is always higher than the bid. This difference is how market makers profit.',
    visual: 'sell',
  },
  {
    term: 'Bid-Ask Spread',
    definition: 'The difference between bid and ask prices. TIGHT spreads (small difference) = good liquidity. WIDE spreads = poor liquidity, harder to trade and more expensive to enter/exit.',
    category: 'Pricing',
    example: 'Bid $2.45 / Ask $2.55 = $0.10 spread (tight, good). Bid $2.00 / Ask $3.00 = $1.00 spread (wide, bad).',
    tip: 'Wide spreads are a hidden cost. A $1.00 spread means you lose $100 per contract the moment you enter!',
  },
  {
    term: 'Mid Price',
    abbrev: 'Mark',
    definition: 'The midpoint between bid and ask. Often used as the "fair value" for an option. Most traders place limit orders near the mid.',
    category: 'Pricing',
    example: 'Bid $2.45 / Ask $2.55 -> Mid = $2.50. Try to buy at $2.48-$2.50 rather than paying $2.55.',
    tip: 'Start your limit orders at the mid and adjust. You will often get filled better than the ask.',
  },
  {
    term: 'Last',
    definition: 'The price of the most recent trade. Can be misleading if it happened hours ago or in low volume.',
    category: 'Pricing',
    example: 'Last: $2.30 but Bid/Ask is $2.45/$2.55. The last trade is stale — current value is around $2.50.',
    tip: 'Don\'t rely on "Last" for illiquid options. Always check the current bid/ask.',
  },
  {
    term: 'Natural Price',
    definition: 'Buying at the ask or selling at the bid. This is the price for immediate execution but usually the worst fill you can get.',
    category: 'Pricing',
    tip: 'Trading at natural prices (paying the ask to buy, hitting the bid to sell) costs you the entire spread. Use limit orders at the mid.',
  },
  {
    term: 'Theoretical Value',
    definition: 'The calculated fair price of an option based on a pricing model (like Black-Scholes), using the current stock price, strike, time to expiration, IV, and interest rates.',
    category: 'Pricing',
    tip: 'Theoretical value helps identify whether the market is pricing an option cheap or expensive relative to the model.',
  },
  {
    term: 'Put-Call Parity',
    definition: 'A fundamental pricing relationship: Call Price - Put Price = Stock Price - Strike Price (adjusted for interest and dividends). Keeps options fairly priced relative to each other.',
    category: 'Pricing',
    example: 'A synthetic long (long call + short put) behaves identically to owning stock because of put-call parity.',
    tip: 'If put-call parity breaks, arbitrageurs instantly correct it. It is why a synthetic position replicates stock.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MECHANICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Exercise',
    definition: 'When the option BUYER uses their right to buy (call) or sell (put) shares at the strike price. The buyer chooses whether and when to exercise.',
    category: 'Mechanics',
    example: 'You hold a $100 Call on a stock trading at $115. You exercise and buy 100 shares at $100, immediately worth $115.',
    tip: 'Most options are never exercised — they are sold to close instead. Exercising forfeits remaining extrinsic value.',
  },
  {
    term: 'Assignment',
    definition: 'When the option SELLER is forced to fulfill their obligation because the buyer exercised. The OCC randomly selects sellers for assignment.',
    category: 'Mechanics',
    example: 'You sold a $100 Call. The stock is at $115 and the buyer exercises. You must sell 100 shares at $100.',
    tip: 'Assignment can happen at any time for American-style options. Close short ITM options before expiration to avoid surprises.',
  },
  {
    term: 'Exercise vs Assignment',
    definition: 'Exercise is what the option BUYER does (choosing to use their right). Assignment is what happens to the SELLER (forced to fulfill their obligation). Buyers exercise; sellers get assigned.',
    category: 'Mechanics',
    tip: 'The OCC randomly assigns sellers when buyers exercise. Not all sellers of ITM options are assigned.',
  },
  {
    term: 'Early Exercise',
    definition: 'When an option buyer exercises before expiration. Most common for deep ITM calls the day before ex-dividend to capture the dividend.',
    category: 'Mechanics',
    example: 'A stock goes ex-dividend tomorrow for $2. Someone exercises their deep ITM $80 call on the stock at $110 to capture the $2 dividend.',
    tip: 'As a seller, early exercise can disrupt your position and trigger unexpected margin requirements.',
  },
  {
    term: 'Open Interest',
    abbrev: 'OI',
    definition: 'The TOTAL number of outstanding contracts that haven\'t been closed or exercised. Updates once daily after market close. High OI = better liquidity.',
    category: 'Mechanics',
    example: 'SPY $450 Put has 50,000 OI = There are 50,000 open contracts of this put that someone is holding.',
    tip: 'High OI = tighter spreads, easier to trade. Low OI options can be hard to exit at fair prices.',
  },
  {
    term: 'Volume',
    definition: 'The number of contracts traded TODAY. Resets to zero at market open each day. High volume = active trading interest.',
    category: 'Mechanics',
    example: 'TSLA $250 Call has 15,000 volume = 15,000 contracts of this specific option traded today.',
    tip: 'Compare volume to open interest. Volume > OI often signals NEW positions being established.',
  },
  {
    term: 'Volume vs OI Relationship',
    definition: 'Comparing today\'s volume to existing OI reveals whether traders are opening NEW positions or closing EXISTING ones.',
    category: 'Mechanics',
    example: 'If OI is 1,000 and today\'s volume is 5,000, massive new positioning is happening (5x normal activity).',
    tip: 'Volume >> OI = New money flowing in. Volume with decreasing OI = Positions being closed out.',
  },
  {
    term: 'Settlement',
    definition: 'The process of finalizing an options trade. Options can settle with physical delivery (shares change hands) or cash settlement (cash difference is paid).',
    category: 'Mechanics',
    example: 'Equity options settle physically (you get/deliver shares). SPX options settle in cash — no stock delivery.',
    tip: 'Know your settlement type. Cash-settled options (like SPX) have no assignment risk from stock delivery.',
  },
  {
    term: 'American vs European Options',
    definition: 'American-style options (most US equities) can be exercised any time before expiration. European-style (index options like SPX, XSP) can only be exercised at expiration and settle in cash.',
    category: 'Mechanics',
    example: 'AAPL options are American-style (exercise anytime). SPX options are European-style (exercise only at expiration).',
    tip: 'European-style options have no early assignment risk, making them preferred for selling strategies.',
  },
  {
    term: 'Options Clearing Corporation',
    abbrev: 'OCC',
    definition: 'The central clearinghouse for all US-listed options. The OCC guarantees every trade, manages assignment, and eliminates counterparty risk.',
    category: 'Mechanics',
    tip: 'The OCC sits between every buyer and seller. You never need to worry about the other side defaulting.',
  },
  {
    term: 'Automatic Exercise',
    definition: 'The OCC automatically exercises options that are at least $0.01 ITM at expiration, unless the holder gives contrary instructions.',
    category: 'Mechanics',
    tip: 'If you don\'t want an ITM option exercised at expiration, you must submit a "Do Not Exercise" notice. Close positions before expiration to avoid surprises.',
  },
  {
    term: 'Expiration Cycle',
    definition: 'The schedule of available expiration dates. Most stocks have monthly expirations (third Friday), plus weekly expirations for liquid names, and LEAPS for longer-term.',
    category: 'Mechanics',
    tip: 'Monthly expirations tend to have the most open interest and liquidity. Weeklys are popular for short-term trades.',
  },
  {
    term: 'Contract Multiplier',
    definition: 'Standard equity options have a 100x multiplier, meaning each contract controls 100 shares. Mini options (where available) use a 10x multiplier.',
    category: 'Mechanics',
    example: 'An option priced at $3.00 costs $300 per contract ($3.00 x 100). Two contracts = $600.',
    tip: 'Always multiply the quoted price by 100 to get the real cost of a standard options contract.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRADING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Debit',
    definition: 'You PAY money to enter the trade. Net debit trades cost you premium upfront. Buying options and debit spreads are debit trades.',
    category: 'Trading',
    example: 'You buy a $5 call spread for $2.00 debit = you pay $200 per contract. Max loss is the debit paid.',
    tip: 'Debit trades have defined max loss equal to the premium paid. You need the stock to move to profit.',
    visual: 'buy',
  },
  {
    term: 'Credit',
    definition: 'You RECEIVE money to enter the trade. Net credit trades put premium in your pocket upfront. Selling options and credit spreads are credit trades.',
    category: 'Trading',
    example: 'You sell a put spread and collect $1.50 credit = $150 received per contract. Max profit is the credit collected.',
    tip: 'Credit trades have max profit equal to the credit received. You profit from time decay and the stock not moving against you.',
    visual: 'sell',
  },
  {
    term: 'Fill',
    definition: 'When your order is executed. A "fill" means your trade was completed at a specific price.',
    category: 'Trading',
    example: 'Your limit order to buy at $2.50 got a fill at $2.48 — even better than your limit price.',
    tip: 'Be patient with fills. Start at the mid price and slowly adjust toward the natural price if needed.',
  },
  {
    term: 'Slippage',
    definition: 'The difference between your expected execution price and the actual fill price. More common with market orders on illiquid options.',
    category: 'Trading',
    example: 'You expected to sell at $2.50 but got filled at $2.40. That $0.10 slippage cost you $10 per contract.',
    tip: 'Minimize slippage by trading liquid options with tight bid-ask spreads and using limit orders.',
  },
  {
    term: 'Liquidity',
    definition: 'How easily you can enter and exit a position at a fair price. Measured by bid-ask spread width, volume, and open interest.',
    category: 'Trading',
    example: 'SPY options are extremely liquid (penny-wide spreads). A small-cap stock might have $0.50+ wide spreads.',
    tip: 'Stick to liquid underlyings when starting out. Poor liquidity is a hidden cost that erodes returns.',
  },
  {
    term: 'Rolling',
    definition: 'Closing an existing option position and simultaneously opening a new one, usually at a different strike or expiration. Used to manage and extend positions.',
    category: 'Trading',
    example: 'Your short $50 put is being tested. You roll down and out: close the $50 put, open the $45 put at a later expiration for a credit.',
    tip: 'Rolling buys you time and can improve your position. Always ensure you are rolling for a net credit on credit trades.',
  },
  {
    term: 'Roll Up',
    definition: 'Rolling to a higher strike price. Common with calls when the stock has moved up and you want to capture more upside or adjust your position.',
    category: 'Trading',
    tip: 'Roll up your short calls in covered call strategies when the stock rallies through your strike.',
  },
  {
    term: 'Roll Down',
    definition: 'Rolling to a lower strike price. Common with puts when the stock has dropped and your short put is being tested.',
    category: 'Trading',
    tip: 'Rolling down a short put gives you a lower obligation price but may lock in some losses on the original position.',
  },
  {
    term: 'Roll Out',
    definition: 'Rolling to a later expiration date at the same strike. Extends the duration of your trade, often collecting additional time premium.',
    category: 'Trading',
    tip: 'Rolling out buys more time for your thesis to play out. Credit sellers often roll out to avoid assignment.',
  },
  {
    term: 'Leg',
    definition: 'A single component of a multi-option strategy. A vertical spread has 2 legs. An iron condor has 4 legs.',
    category: 'Trading',
    example: 'A bull call spread has 2 legs: one long call (lower strike) and one short call (higher strike).',
    tip: 'When possible, enter multi-leg trades as a single order to avoid "legging risk" — getting one fill but not the other.',
  },
  {
    term: 'Legging In',
    definition: 'Entering a multi-leg strategy one leg at a time rather than as a single combined order. Riskier but can sometimes get better prices.',
    category: 'Trading',
    tip: 'Legging in is risky because the market can move between legs. Use combined orders (spreads) when possible.',
  },
  {
    term: 'Probability of Profit',
    abbrev: 'POP',
    definition: 'The statistical likelihood that a trade will make at least $0.01 at expiration, based on current option pricing. Derived from delta.',
    category: 'Trading',
    example: 'A 30-Delta short put has roughly a 70% POP. But high POP trades win often and win small.',
    tip: 'POP alone does not determine if a trade is good. You need to consider Expected Value (avg win x win rate - avg loss x loss rate).',
  },
  {
    term: 'Risk/Reward Ratio',
    definition: 'The ratio of potential profit to potential loss. A 1:3 risk/reward means you risk $1 to potentially make $3.',
    category: 'Trading',
    example: 'A debit spread costs $1.00 with a max profit of $4.00 = 1:4 risk/reward. Looks great, but POP is lower.',
    tip: 'There is always a tradeoff between probability and risk/reward. High POP = low risk/reward. Low POP = high risk/reward.',
  },
  {
    term: 'Breakeven',
    definition: 'The stock price at which your trade makes $0 at expiration. For long calls: strike + premium. For long puts: strike - premium.',
    category: 'Trading',
    example: 'You buy a $100 Call for $3.00. Breakeven = $103. The stock must be above $103 at expiration for profit.',
    tip: 'Factor in commissions and fees when calculating your true breakeven. Every dollar counts.',
  },
  {
    term: 'Max Profit',
    definition: 'The most money a trade can make. Defined for spreads and most multi-leg strategies. Undefined (unlimited) for naked long calls.',
    category: 'Trading',
    example: 'A $5-wide bull call spread bought for $2.00 has max profit of $3.00 ($5.00 width - $2.00 cost).',
  },
  {
    term: 'Max Loss',
    definition: 'The most money a trade can lose. Defined for spreads and long options. Can be unlimited for naked short calls.',
    category: 'Trading',
    example: 'A long call purchased for $3.00 has max loss of $3.00 (the premium paid). A naked short call has unlimited max loss.',
    tip: 'Always know your max loss BEFORE entering a trade. If you can not define it, reconsider the strategy.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Covered Call',
    definition: 'Selling a call option against 100 shares of stock you already own. Generates income from the premium collected, but caps your upside at the strike price.',
    category: 'Strategies',
    example: 'You own 100 AAPL at $170. You sell 1 AAPL $180 Call for $3.00. If AAPL stays below $180, you keep the $300.',
    tip: 'Covered calls are the most popular income strategy. Think of it as getting paid rent on stock you own.',
    visual: 'sell',
  },
  {
    term: 'Cash-Secured Put',
    abbrev: 'CSP',
    definition: 'Selling a put option while holding enough cash to buy the shares if assigned. You get paid to wait for a dip to buy stock at a lower price.',
    category: 'Strategies',
    example: 'You want to buy AAPL at $160. You sell 1 AAPL $160 Put for $4.00. If it drops to $160, you buy shares and keep the $400.',
    tip: 'CSPs are a great way to enter stock positions. You get paid while you wait for your target price.',
    visual: 'sell',
  },
  {
    term: 'Vertical Spread',
    definition: 'A two-leg strategy using options of the same type (both calls or both puts) and same expiration but different strikes. Can be debit (buying) or credit (selling).',
    category: 'Strategies',
    example: 'Bull call spread: Buy $100 Call, Sell $105 Call. Max profit = $5 width - debit paid. Defined risk.',
    tip: 'Verticals define your risk and reduce cost compared to naked options. They are the building blocks of many strategies.',
  },
  {
    term: 'Bull Call Spread',
    definition: 'A debit spread using calls. Buy a lower strike call, sell a higher strike call, same expiration. Profits if the stock goes up moderately.',
    category: 'Strategies',
    example: 'Buy $100 Call for $5, Sell $110 Call for $2 = $3 debit. Max profit = $7 ($10 width - $3 debit).',
    tip: 'Cheaper than buying a naked call because the short call offsets some cost. Tradeoff: capped upside.',
    visual: 'buy',
  },
  {
    term: 'Bear Put Spread',
    definition: 'A debit spread using puts. Buy a higher strike put, sell a lower strike put, same expiration. Profits if the stock goes down moderately.',
    category: 'Strategies',
    example: 'Buy $110 Put for $6, Sell $100 Put for $2 = $4 debit. Max profit = $6 ($10 width - $4 debit).',
    tip: 'Defined risk bearish play. Cheaper than buying a naked put.',
    visual: 'sell',
  },
  {
    term: 'Bull Put Spread',
    definition: 'A credit spread using puts. Sell a higher strike put, buy a lower strike put. Profits if stock stays above the short strike. Bullish to neutral.',
    category: 'Strategies',
    example: 'Sell $100 Put for $3, Buy $95 Put for $1 = $2 credit. Max profit = $2 credit. Max loss = $3 ($5 width - $2 credit).',
    tip: 'Popular credit strategy. You collect premium and profit from time decay as long as the stock does not drop too much.',
    visual: 'buy',
  },
  {
    term: 'Bear Call Spread',
    definition: 'A credit spread using calls. Sell a lower strike call, buy a higher strike call. Profits if stock stays below the short strike. Bearish to neutral.',
    category: 'Strategies',
    example: 'Sell $110 Call for $3, Buy $115 Call for $1 = $2 credit. Max profit = $2. Max loss = $3.',
    tip: 'Use when you are bearish or think the stock will stay below a certain level.',
    visual: 'sell',
  },
  {
    term: 'Straddle',
    definition: 'Buying both a call and put at the same strike and expiration. Profits from a big move in EITHER direction. You pay double premium, so you need a significant move.',
    category: 'Strategies',
    example: 'Buy $100 Call and $100 Put for a total of $5. Stock must move above $105 or below $95 to profit.',
    tip: 'Long straddles are expensive. Best used when you expect a much bigger move than the market is pricing in.',
  },
  {
    term: 'Strangle',
    definition: 'Buying an OTM call and OTM put at different strikes, same expiration. Cheaper than a straddle but needs an even bigger move to profit.',
    category: 'Strategies',
    example: 'Buy $105 Call and $95 Put for $3 total. Stock must move above $108 or below $92 to profit.',
    tip: 'Short strangles (selling both sides) are popular income trades but carry significant risk.',
  },
  {
    term: 'Iron Condor',
    definition: 'A four-leg neutral strategy: sell an OTM put spread and an OTM call spread. Profits if the stock stays between the short strikes. Defined risk.',
    category: 'Strategies',
    example: 'Sell $95/$90 put spread + Sell $105/$110 call spread for $2 credit. Stock must stay between $95-$105.',
    tip: 'Iron condors profit from time decay and low volatility. Close at 50% of max profit to manage risk.',
  },
  {
    term: 'Iron Butterfly',
    definition: 'Like an iron condor but with the short strikes at the same price (ATM). Higher credit received but narrower profit zone.',
    category: 'Strategies',
    example: 'Sell $100 Call + Sell $100 Put + Buy $105 Call + Buy $95 Put. Maximum profit if stock pins at $100.',
    tip: 'Iron butterflies have higher max profit than condors but lower probability. Best for range-bound stocks.',
  },
  {
    term: 'Calendar Spread',
    abbrev: 'Time Spread',
    definition: 'Buying a longer-dated option and selling a shorter-dated option at the same strike. Profits from time decay differential and/or IV increase.',
    category: 'Strategies',
    example: 'Sell the 30-DTE $100 Call, Buy the 60-DTE $100 Call. The short leg decays faster than the long leg.',
    tip: 'Calendars benefit from a quiet market and rising IV. Be aware of ex-dividend dates and early assignment risk.',
  },
  {
    term: 'Diagonal Spread',
    definition: 'Similar to a calendar but with different strikes AND different expirations. Combines directional bias with time decay collection.',
    category: 'Strategies',
    example: 'Buy a 60-DTE $95 Call (deep ITM), Sell a 30-DTE $105 Call (OTM). A "poor man\'s covered call."',
    tip: 'Diagonal spreads are versatile. The "poor man\'s covered call" lets you simulate covered calls with less capital.',
  },
  {
    term: 'Butterfly Spread',
    definition: 'A three-strike strategy with limited risk and limited profit. Buy 1 lower, sell 2 middle, buy 1 upper strike. Max profit if stock pins at the middle strike.',
    category: 'Strategies',
    example: 'Buy 1 $95 Call, Sell 2 $100 Calls, Buy 1 $105 Call for $1 debit. Max profit = $4 if stock at $100.',
    tip: 'Butterflies are cheap to enter but need precision. Best for targeting a specific price at expiration.',
  },
  {
    term: 'Protective Put',
    definition: 'Buying a put option against stock you own as insurance. Limits downside while keeping unlimited upside. Also called a "married put."',
    category: 'Strategies',
    example: 'You own 100 AAPL at $170. You buy 1 $160 Put for $3. Your max loss is now $13 ($10 to strike + $3 premium).',
    tip: 'Protective puts are like buying insurance. The cost (premium) is the price of peace of mind.',
    visual: 'buy',
  },
  {
    term: 'Collar',
    definition: 'Owning stock + buying a protective put + selling a covered call. The call premium offsets the put cost. Limits both downside and upside.',
    category: 'Strategies',
    example: 'Own stock at $100. Buy $95 Put for $2. Sell $105 Call for $2. Net cost: $0 ("zero-cost collar"). Protected between $95-$105.',
    tip: 'Collars are popular for protecting gains on concentrated stock positions with minimal or zero net cost.',
  },
  {
    term: 'Naked Option',
    definition: 'Selling an option without owning the underlying stock (for calls) or having cash to cover (for puts). Very high risk. Requires margin approval.',
    category: 'Strategies',
    example: 'Selling a naked $200 Call on TSLA. If TSLA rallies to $300, you owe $100 x 100 shares = $10,000 per contract.',
    tip: 'Naked calls have unlimited risk. Naked puts have substantial risk. Defined-risk spreads are usually a better choice.',
    visual: 'sell',
  },
  {
    term: 'LEAPS',
    abbrev: 'Long-Term Equity Anticipation Securities',
    definition: 'Options with expiration dates more than one year away. Lower theta decay rate, higher vega sensitivity. Used for long-term directional bets or stock replacement.',
    category: 'Strategies',
    example: 'Buying a LEAPS $150 Call on AAPL expiring in 18 months gives you long-term bullish exposure with less capital than buying shares.',
    tip: 'Deep ITM LEAPS calls (delta >0.80) are popular for stock replacement strategies at a fraction of the capital.',
  },
  {
    term: 'Ratio Spread',
    definition: 'A strategy using unequal numbers of long and short options. For example, buying 1 call and selling 2 calls at a higher strike. Can create "free" trades but adds naked risk.',
    category: 'Strategies',
    example: 'Buy 1 $100 Call, Sell 2 $110 Calls. If the debit is zero, you have a free trade if stock stays below $110.',
    tip: 'Ratio spreads have a naked component. Make sure you understand the extra risk from the additional short legs.',
  },
  {
    term: 'Backspread',
    definition: 'A ratio spread with more long options than short. Benefits from large moves. Opposite of a front spread.',
    category: 'Strategies',
    example: 'Sell 1 $100 Call, Buy 2 $110 Calls. You profit if the stock makes a big upward move beyond $110.',
    tip: 'Backspreads are useful when you expect a big move but want to partially finance it by selling a closer option.',
  },
  {
    term: 'Synthetic Long',
    definition: 'Combining a long call and short put at the same strike and expiration to replicate owning 100 shares of stock. Same risk/reward as stock ownership.',
    category: 'Strategies',
    example: 'Buy $100 Call + Sell $100 Put = behaves like buying 100 shares at $100 (put-call parity).',
    tip: 'Synthetics require less capital than buying stock but carry the same directional risk.',
  },
  {
    term: 'Synthetic Short',
    definition: 'Combining a long put and short call at the same strike and expiration to replicate shorting 100 shares of stock.',
    category: 'Strategies',
    example: 'Buy $100 Put + Sell $100 Call = behaves like shorting 100 shares at $100.',
    tip: 'Useful when you want short stock exposure but your broker makes it difficult to borrow shares.',
  },
  {
    term: 'Jade Lizard',
    definition: 'A strategy that combines a short put with a short call spread. Collects premium with no upside risk (if structured correctly). Downside risk exists.',
    category: 'Strategies',
    tip: 'Structure a jade lizard so the total credit received exceeds the width of the call spread. This eliminates upside risk.',
  },
  {
    term: 'Wheel Strategy',
    definition: 'A repeating cycle of selling cash-secured puts until assigned, then selling covered calls on the shares until called away. Generates consistent income.',
    category: 'Strategies',
    example: 'Sell CSP on AAPL at $160 -> get assigned -> sell covered calls at $170 -> called away -> sell CSP again.',
    tip: 'The wheel works best on stocks you would be happy owning long-term at the put strike price.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FLOW & SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Sweep',
    definition: 'An aggressive order that "sweeps" across multiple exchanges to get filled FAST, often paying the ask. Indicates urgency and conviction.',
    category: 'Flow & Signals',
    example: 'A trader needs 5,000 contracts NOW. Instead of waiting at mid, they sweep all available asks across exchanges.',
    tip: 'Sweeps often signal conviction. Someone wants in badly enough to pay up for speed.',
    visual: 'buy',
  },
  {
    term: 'Block',
    definition: 'A single large order executed at one price, usually negotiated between institutions away from the public market.',
    category: 'Flow & Signals',
    example: '10,000 contracts of SPY calls traded as a single block at $2.50. This was a pre-arranged institutional trade.',
    tip: 'Blocks represent planned institutional positions. Less urgent than sweeps but still meaningful.',
  },
  {
    term: 'Unusual Activity',
    abbrev: 'UOA',
    definition: 'Options volume significantly higher than normal (often 2x+ average). May indicate informed trading ahead of news or events.',
    category: 'Flow & Signals',
    example: 'XYZ averages 500 contracts/day. Today it has 15,000 with no news. That is unusual activity worth investigating.',
    tip: 'UOA is not always "smart money." Could be hedging, closing positions, or retail hype. Context matters.',
  },
  {
    term: 'Put/Call Ratio',
    definition: 'Ratio of put volume to call volume. High ratio = more puts (bearish or hedging). Low ratio = more calls (bullish sentiment).',
    category: 'Flow & Signals',
    example: 'P/C ratio of 0.7 = 70 puts for every 100 calls traded. P/C of 1.5 = 150 puts per 100 calls.',
    tip: 'Extreme P/C ratios can be contrarian signals. Everyone bearish? Might be time to buy.',
  },
  {
    term: 'Opening vs Closing',
    definition: 'Whether the trade is establishing a NEW position (opening) or exiting an EXISTING one (closing). Huge difference in interpretation!',
    category: 'Flow & Signals',
    example: 'Big call buying sounds bullish, but if it is "buy to close" they are exiting shorts — could actually be bearish covering.',
    tip: 'Always check if large trades are opening or closing. The same action can have opposite meanings.',
  },
  {
    term: 'At Bid vs At Ask',
    definition: 'Where the trade executed relative to the quote. AT ASK = buyer initiated (aggressive buying). AT BID = seller initiated (aggressive selling).',
    category: 'Flow & Signals',
    example: '5,000 calls trade at the ask price = someone paid up to buy. That is bullish aggression.',
    tip: 'At-ask trades show more conviction than at-bid. Watch for patterns of aggressive buying or selling.',
  },
  {
    term: 'Dark Pool',
    definition: 'Private exchanges where institutional investors trade large blocks of stock without showing their orders to the public market. Reduces market impact.',
    category: 'Flow & Signals',
    tip: 'Dark pool prints on the tape can indicate institutional accumulation or distribution. Volume without visible bids/asks.',
  },
  {
    term: 'Gamma Exposure',
    abbrev: 'GEX',
    definition: 'The aggregate gamma held by market makers at each strike price. Positive GEX = market makers hedge in a stabilizing way. Negative GEX = they hedge in a destabilizing way.',
    category: 'Flow & Signals',
    tip: 'High positive GEX acts as a "magnet" for stock price. Negative GEX environments see larger, faster moves.',
  },
  {
    term: 'Delta Exposure',
    abbrev: 'DEX',
    definition: 'The aggregate directional exposure market makers carry from their option positions. Shows the net directional tilt of the options market.',
    category: 'Flow & Signals',
    tip: 'DEX changes as the stock moves, forcing market makers to buy or sell stock to stay hedged.',
  },
  {
    term: 'Max Pain',
    definition: 'The strike price at which the total value of all outstanding options (both puts and calls) would be the lowest. Theory suggests stock tends to gravitate toward max pain at expiration.',
    category: 'Flow & Signals',
    example: 'If max pain for SPY this Friday is $450, the theory predicts SPY will gravitate toward $450 by expiration.',
    tip: 'Max pain is a useful reference but not a reliable predictor. It works best for large, liquid names near expiration.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RISK MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Margin Requirement',
    definition: 'The cash or collateral your broker requires you to hold when selling options. Defined-risk trades (spreads) have fixed margin equal to max loss. Naked options have dynamic margin.',
    category: 'Risk Management',
    example: 'A $5-wide put spread requires $500 margin per contract minus credit received. A naked put might require $5,000+.',
    tip: 'Defined-risk trades are more margin-efficient and capital-friendly than naked positions.',
  },
  {
    term: 'Buying Power',
    definition: 'The amount of capital available in your account to open new positions. Selling naked options consumes significant buying power — often 10-20x the premium collected.',
    category: 'Risk Management',
    example: 'A short strangle collecting $200 might require $5,000+ in buying power. Always check BP reduction before entering.',
    tip: 'Monitor buying power utilization. Using too much leaves you vulnerable to margin calls during volatility spikes.',
  },
  {
    term: 'Buying Power Reduction',
    abbrev: 'BPR',
    definition: 'The amount of buying power consumed by opening a new position. Shows the real capital impact of each trade.',
    category: 'Risk Management',
    tip: 'Never use more than 50% of your total buying power. Leave room for adjustments and adverse moves.',
  },
  {
    term: 'Margin Call',
    definition: 'A demand from your broker to deposit more funds or close positions because your account equity has fallen below the maintenance margin requirement.',
    category: 'Risk Management',
    tip: 'Margin calls force you to sell at the worst possible time. Prevent them by managing position size and using defined-risk strategies.',
  },
  {
    term: 'Pin Risk',
    definition: 'The danger that a stock closes right at your short strike at expiration. You will not know if you are assigned until after the market closes, creating uncertainty over the weekend.',
    category: 'Risk Management',
    example: 'Your short $100 Put and the stock closes at exactly $100. You might or might not be assigned — unknown until Monday.',
    tip: 'Close or roll short options near the money before expiration day to avoid pin risk.',
  },
  {
    term: 'Assignment Risk',
    definition: 'The risk of being assigned on a short option before expiration (early assignment). Most common with short ITM calls right before an ex-dividend date, or deep ITM short puts.',
    category: 'Risk Management',
    tip: 'American-style options can be assigned at any time. European-style only at expiration. Watch ex-dividend dates closely.',
  },
  {
    term: 'Position Sizing',
    definition: 'Determining how many contracts to trade based on account size, risk tolerance, and strategy. The most critical element of risk management.',
    category: 'Risk Management',
    example: 'With a $50,000 account, risking 2% per trade = $1,000 max risk. If a spread has $200 max loss, trade 5 contracts.',
    tip: 'Never risk more than 2-5% of your account on a single trade. Consistent small bets beat occasional large bets.',
  },
  {
    term: 'Portfolio Beta-Weighting',
    definition: 'Expressing all positions in terms of one underlying (usually SPY) to understand your total directional exposure. Helps see if you are too bullish or bearish overall.',
    category: 'Risk Management',
    tip: 'Beta-weighting helps you see your true market exposure. A "neutral" portfolio should have near-zero beta-weighted delta.',
  },
  {
    term: 'Defined Risk',
    definition: 'A trade where the maximum possible loss is known and limited at entry. Spreads, butterflies, and long options are defined risk.',
    category: 'Risk Management',
    example: 'A $5-wide bull call spread bought for $2 has a defined max loss of $2 per share ($200 per contract).',
    tip: 'Beginners should stick to defined-risk strategies until they deeply understand margin and position management.',
  },
  {
    term: 'Undefined Risk',
    definition: 'A trade where the maximum possible loss is theoretically unlimited (naked calls) or very large (naked puts). Requires higher margin and more active management.',
    category: 'Risk Management',
    example: 'A naked short call has unlimited risk because the stock can theoretically rise forever.',
    tip: 'Undefined risk is not inherently bad but requires experience, discipline, and adequate buying power.',
  },
  {
    term: 'Hedge',
    definition: 'A position taken to reduce or offset the risk of another position. Options are commonly used to hedge stock portfolios.',
    category: 'Risk Management',
    example: 'Buying SPY puts to protect a stock portfolio against a market downturn.',
    tip: 'Perfect hedges are expensive. Partial hedges (collars, put spreads) provide good protection at lower cost.',
  },
  {
    term: 'Portfolio Margin',
    definition: 'A risk-based margin methodology that calculates margin based on the overall risk of the portfolio rather than individual positions. Typically requires $100K+ and special approval.',
    category: 'Risk Management',
    tip: 'Portfolio margin is more capital-efficient for hedged portfolios but can be dangerous if not properly managed.',
  },
  {
    term: 'Tail Risk',
    definition: 'The risk of extreme, unexpected market moves (3+ standard deviations). These "black swan" events are rare but can cause devastating losses.',
    category: 'Risk Management',
    tip: 'Always have a plan for tail risk. Even low-probability events happen eventually. OTM put protection or position limits help.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKET STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Market Maker',
    definition: 'A firm or individual obligated to provide continuous bid and ask quotes for options, ensuring liquidity. They profit from the bid-ask spread and manage risk by hedging.',
    category: 'Market Structure',
    example: 'Citadel Securities and Wolverine Trading are major options market makers. They quote thousands of options continuously.',
    tip: 'Market makers are not your enemy — they provide liquidity. But they always have an edge through the bid-ask spread.',
  },
  {
    term: 'Delta Hedging',
    definition: 'The practice of buying or selling shares of the underlying stock to offset the delta exposure from an options position. Market makers do this constantly.',
    category: 'Market Structure',
    example: 'A market maker sells 100 calls with delta 0.50 each. They buy 5,000 shares (100 x 50) to be delta neutral.',
    tip: 'Market maker hedging flows can actually move stock prices, especially around large option expirations.',
  },
  {
    term: 'NBBO',
    abbrev: 'National Best Bid and Offer',
    definition: 'The best (highest) bid and best (lowest) ask across all exchanges. Your order must be filled at or better than the NBBO.',
    category: 'Market Structure',
    tip: 'The NBBO protects you from getting a worse price than the best available quote. But it can be penny-wide or dollar-wide.',
  },
  {
    term: 'OPRA',
    abbrev: 'Options Price Reporting Authority',
    definition: 'The system that consolidates and distributes real-time options quote and trade data from all US options exchanges.',
    category: 'Market Structure',
    tip: 'OPRA data is what powers your broker\'s option chain display. Any delay in OPRA data means you see stale prices.',
  },
  {
    term: 'CBOE',
    abbrev: 'Chicago Board Options Exchange',
    definition: 'The largest US options exchange and birthplace of listed options trading (founded 1973). Home of the VIX and SPX options.',
    category: 'Market Structure',
    tip: 'CBOE-listed products like SPX and VIX options are European-style with cash settlement — popular with institutional traders.',
  },
  {
    term: 'Options Approval Level',
    definition: 'Broker-assigned tiers that determine which option strategies you can trade, based on your experience, net worth, and risk tolerance.',
    category: 'Market Structure',
    example: 'Level 1: covered calls. Level 2: long options. Level 3: spreads. Level 4: naked options.',
    tip: 'Start at a lower level and gain experience. Higher levels give more flexibility but also more ways to blow up your account.',
  },
  {
    term: 'Pattern Day Trader',
    abbrev: 'PDT',
    definition: 'SEC rule: if you make 4+ day trades in 5 business days with a margin account under $25,000, you are flagged as a pattern day trader and restricted.',
    category: 'Market Structure',
    tip: 'Cash accounts are not subject to PDT rules (but have settlement delays). Or maintain $25K+ in your margin account.',
  },
  {
    term: 'Reg T Margin',
    definition: 'The standard margin requirement set by the Federal Reserve. Generally requires 50% of the position value as initial margin for stock. Options margin rules vary by strategy.',
    category: 'Market Structure',
    tip: 'Reg T margin is less favorable than portfolio margin but is the default for most retail accounts.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Black-Scholes Model',
    definition: 'The foundational mathematical model for pricing European-style options, developed in 1973. Inputs: stock price, strike, time to expiration, interest rate, and volatility.',
    category: 'Advanced Concepts',
    tip: 'Black-Scholes assumes constant volatility and log-normal returns. Real markets deviate, which is why the volatility smile exists.',
  },
  {
    term: 'Binomial Model',
    definition: 'An options pricing model that uses a step-by-step tree approach to model possible stock price movements. More flexible than Black-Scholes, especially for American-style options.',
    category: 'Advanced Concepts',
    tip: 'The binomial model handles early exercise and dividends better than Black-Scholes. Often used for American-style equity options.',
  },
  {
    term: 'Delta Neutral',
    definition: 'A position with zero net delta, meaning it has no directional bias. Profits from time decay or volatility changes rather than stock price movement.',
    category: 'Advanced Concepts',
    example: 'Selling an ATM straddle is approximately delta neutral. You profit if the stock stays near the strike.',
    tip: 'Delta neutral does not mean risk-free. You still have gamma, theta, and vega exposure.',
  },
  {
    term: 'Gamma Scalping',
    definition: 'A technique where you hold a long options position (long gamma) and repeatedly buy and sell the underlying stock to lock in profits as delta changes.',
    category: 'Advanced Concepts',
    tip: 'Gamma scalping profits from volatility itself. The more the stock moves back and forth, the more you make.',
  },
  {
    term: 'Volatility Arbitrage',
    definition: 'A strategy that attempts to profit from the difference between implied volatility and expected future realized volatility.',
    category: 'Advanced Concepts',
    tip: 'If you believe IV is too high relative to future realized vol, sell options. If too low, buy options. This is the core of many hedge fund strategies.',
  },
  {
    term: 'Mean Reversion',
    definition: 'The tendency of IV to return to its average level after moving to extremes. IV spikes tend to be temporary; IV crushes are often followed by normalization.',
    category: 'Advanced Concepts',
    tip: 'Mean reversion in IV is why selling premium during high IV works over time. Elevated IV rarely persists.',
  },
  {
    term: 'Dispersion Trading',
    definition: 'An advanced strategy that involves selling index options while buying individual component options (or vice versa). Exploits the difference between index and component implied correlations.',
    category: 'Advanced Concepts',
    tip: 'Dispersion trading is primarily institutional. The key insight: index vol is usually cheaper than the sum of individual stock vols because of diversification.',
  },
  {
    term: 'Pinning',
    definition: 'The tendency for stock prices to close near a strike with high open interest at expiration. Caused by market maker hedging activity (delta hedging) as they unwind positions.',
    category: 'Advanced Concepts',
    example: 'A stock with massive OI at the $100 strike might "pin" to $100 on expiration Friday as market makers hedge.',
    tip: 'Pinning is not guaranteed but is more likely when there is very high open interest at a single strike.',
  },
  {
    term: 'OpEx',
    abbrev: 'Options Expiration',
    definition: 'The day options expire, usually the third Friday of each month for monthly contracts. Weekly options expire every Friday. Can cause increased volatility and unusual price action.',
    category: 'Advanced Concepts',
    tip: 'Avoid holding short options through OpEx unless you are comfortable with assignment risk and gamma exposure.',
  },
  {
    term: 'Quad Witching',
    definition: 'The simultaneous expiration of stock index futures, stock index options, stock options, and single stock futures. Occurs four times a year (third Friday of March, June, September, December).',
    category: 'Advanced Concepts',
    tip: 'Quad witching days often see elevated volume and unusual price action as institutions rebalance and roll positions.',
  },
  {
    term: '0 DTE',
    definition: 'Options expiring today (zero days to expiration). Extremely high gamma, rapidly decaying theta. Popular for day trading but very risky due to rapid price swings.',
    category: 'Advanced Concepts',
    example: 'Trading SPX 0 DTE options on a Wednesday morning. Gamma is extreme — a $2 move in SPX can double or zero your position.',
    tip: '0 DTE options can move 100%+ in minutes. Use strict position sizing and stop losses. Not for beginners.',
  },
  {
    term: 'Skew Trade',
    definition: 'A strategy that exploits the difference in IV between two strikes or expirations. Profits when the skew normalizes.',
    category: 'Advanced Concepts',
    tip: 'Skew trades are sophisticated. You need to understand why skew exists before trying to profit from changes in it.',
  },
  {
    term: 'Convexity',
    definition: 'The non-linear payoff profile of options. Small premium can produce large returns. Long options have positive convexity (asymmetric upside).',
    category: 'Advanced Concepts',
    tip: 'Convexity is what makes options powerful. A $1 option can become worth $20 if the stock makes a big move. This asymmetry is the fundamental appeal.',
  },
  {
    term: 'Box Spread',
    definition: 'A combination of a bull call spread and a bear put spread at the same strikes. Creates a risk-free position (in theory) used for financing and arbitrage.',
    category: 'Advanced Concepts',
    tip: 'Box spreads should yield the risk-free rate. Retail traders occasionally use them for margin or tax purposes, but they are complex.',
  },
  {
    term: 'Conversion/Reversal',
    definition: 'Arbitrage strategies that exploit mispricing in put-call parity. A conversion is long stock + long put + short call. A reversal is the opposite.',
    category: 'Advanced Concepts',
    tip: 'These are primarily used by market makers and professional traders. Retail traders rarely see the mispricings needed.',
  },
  {
    term: 'Volatility Surface',
    definition: 'A 3D representation of implied volatility across both strike prices (X-axis) and expiration dates (Y-axis). Shows how IV varies across the entire option chain.',
    category: 'Advanced Concepts',
    tip: 'The volatility surface combines the smile/skew with term structure. Professional traders watch the surface for trading opportunities.',
  },
  {
    term: 'SPAN Margin',
    definition: 'Standard Portfolio Analysis of Risk. A risk-based margin system used by futures and some options exchanges. Considers the overall portfolio risk rather than individual positions.',
    category: 'Advanced Concepts',
    tip: 'SPAN margin is more efficient for hedged portfolios. Understanding it helps you use capital more effectively.',
  },
  {
    term: 'Greeks Profile',
    definition: 'The complete set of Greek values for a position or portfolio. Understanding the full Greeks profile tells you how your position responds to every market variable.',
    category: 'Advanced Concepts',
    tip: 'Always review your total portfolio Greeks, not just individual position Greeks. Opposing positions can offset each other.',
  },
  {
    term: 'Broken Wing Butterfly',
    definition: 'A butterfly spread with unequal wing widths. Moves the risk to one side, creating a credit or zero-cost entry with skewed risk/reward.',
    category: 'Advanced Concepts',
    tip: 'Broken wing butterflies can have zero risk on one side. Popular for earnings plays and range-bound markets.',
  },
  {
    term: 'Christmas Tree Spread',
    definition: 'A variation of a butterfly or ratio spread using three different strikes with unequal quantities. Named for its payoff diagram shape.',
    category: 'Advanced Concepts',
    tip: 'Christmas trees offer unique payoff profiles. They combine directional bias with defined risk at specific price levels.',
  },
  {
    term: 'Condor Spread',
    definition: 'Similar to a butterfly but uses four different strikes. Wider profit zone than a butterfly but lower maximum profit.',
    category: 'Advanced Concepts',
    example: 'Buy $95 Call, Sell $100 Call, Sell $105 Call, Buy $110 Call. Profits if stock stays between $100-$105.',
    tip: 'Condors trade a narrower max profit for a wider profit zone compared to butterflies.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL BASICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Underlying Asset',
    definition: 'The financial instrument (stock, ETF, index, or commodity) on which an options contract is based. The price of the underlying drives the value of the option.',
    category: 'Basics',
    tip: 'Always research the underlying before trading its options. Technical and fundamental analysis still matter.',
  },
  {
    term: 'In-the-Money Amount',
    definition: 'How far an option is in the money, measured in dollars. A $100 call on a $115 stock is $15 ITM.',
    category: 'Basics',
    example: 'The further ITM an option is, the higher its delta and the more it behaves like the underlying stock.',
  },
  {
    term: 'Option Premium Components',
    definition: 'Every option premium consists of two parts: Intrinsic Value (real value from being ITM) and Extrinsic Value (time value from remaining uncertainty). OTM options have zero intrinsic value.',
    category: 'Basics',
    tip: 'Understanding the breakdown of premium is essential for evaluating whether an option is cheap or expensive.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL VOLATILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Volatility Contraction',
    definition: 'A period where implied volatility decreases, causing option premiums to fall. Often occurs after earnings or major events resolve.',
    category: 'Volatility',
    tip: 'Volatility contraction benefits option sellers and hurts option buyers. Plan for it around known events.',
  },
  {
    term: 'Volatility Expansion',
    definition: 'A period where implied volatility increases, causing option premiums to rise. Often occurs ahead of earnings, Fed meetings, or during market stress.',
    category: 'Volatility',
    tip: 'Buy options before vol expansion and sell before contraction. Timing vol changes is key to profitability.',
  },
  {
    term: 'Stochastic Volatility',
    definition: 'A model that treats volatility itself as a random variable that changes over time, rather than being constant as assumed by Black-Scholes.',
    category: 'Volatility',
    tip: 'Real-world volatility clusters — high vol tends to follow high vol. Stochastic models capture this better than constant-vol models.',
  },
  {
    term: 'VVIX',
    definition: 'The volatility of the VIX itself. Measures expected fluctuations in the VIX index. High VVIX means the market expects large swings in volatility.',
    category: 'Volatility',
    tip: 'High VVIX can precede large VIX moves. It is a second-order fear indicator — fear of fear.',
  },
  {
    term: 'Contango',
    definition: 'When longer-dated volatility or futures prices are higher than shorter-dated. This is the normal state for VIX futures and term structure.',
    category: 'Volatility',
    tip: 'Contango in VIX futures means volatility products like UVXY lose value over time due to negative roll yield.',
  },
  {
    term: 'Backwardation',
    definition: 'When shorter-dated volatility or futures prices are higher than longer-dated. Often occurs during market stress when near-term fear spikes.',
    category: 'Volatility',
    tip: 'VIX backwardation is a signal of acute market stress. It typically normalizes as fear subsides.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL GREEKS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Speed',
    definition: 'The third-order Greek measuring the rate of change of gamma with respect to the underlying price. Shows how quickly gamma itself is changing.',
    category: 'Greeks',
    tip: 'Speed is most relevant for large portfolio managers who need to understand how their gamma risk shifts during rapid moves.',
  },
  {
    term: 'Color',
    definition: 'The rate of change of gamma with respect to time. Shows how gamma shifts as time passes, independent of stock price movement.',
    category: 'Greeks',
    tip: 'Color helps explain why ATM gamma increases as expiration approaches, even with no price change in the stock.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL PRICING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Parity',
    definition: 'When an option trades at exactly its intrinsic value with zero extrinsic value. Deep ITM options near expiration often trade at or near parity.',
    category: 'Pricing',
    example: 'A $100 call on a stock at $120, trading at $20.00. That is trading at parity — pure intrinsic value.',
    tip: 'Options trading below parity (below intrinsic value) represent a potential arbitrage opportunity.',
  },
  {
    term: 'Time Decay Curve',
    definition: 'The non-linear pattern of how extrinsic value erodes over time. Decay is slow initially, accelerates around 45 DTE, and becomes exponential in the final week.',
    category: 'Pricing',
    tip: 'Sellers enter at 30-45 DTE to capture the "sweet spot" of accelerating decay. Buyers prefer more time to reduce decay impact.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MECHANICS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Penny Pilot Program',
    definition: 'An exchange program allowing certain actively traded options to be quoted in penny increments ($0.01) instead of nickel ($0.05) increments, resulting in tighter bid-ask spreads.',
    category: 'Mechanics',
    tip: 'Penny-increment options have tighter spreads and lower trading costs. Prefer these over nickel-increment options.',
  },
  {
    term: 'Ex-Dividend Date',
    definition: 'The date on which new buyers of a stock are not entitled to the upcoming dividend. Short call sellers face early assignment risk the day before ex-dividend dates.',
    category: 'Mechanics',
    example: 'AAPL goes ex-dividend on Friday. If you have short ITM calls on Thursday, you may be assigned early so the buyer can capture the dividend.',
    tip: 'Always check ex-dividend dates when holding short calls. Close or roll ITM short calls before ex-dividend to avoid surprise assignment.',
  },
  {
    term: 'Fungibility',
    definition: 'The property that all option contracts with the same terms are interchangeable. You can close a position opened on one exchange by trading on a different exchange.',
    category: 'Mechanics',
    tip: 'Fungibility means you are not locked into a single exchange. Your orders automatically route to the best available price.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL TRADING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Theta Positive',
    definition: 'A position that profits from the passage of time. Credit spreads, iron condors, and short options are theta positive — they gain value each day (all else equal).',
    category: 'Trading',
    tip: 'Theta positive strategies win more often but lose bigger when they lose. Proper position sizing is essential.',
  },
  {
    term: 'Theta Negative',
    definition: 'A position that loses value from the passage of time. Long options and debit spreads are theta negative — you need the stock to move to overcome time decay.',
    category: 'Trading',
    tip: 'Theta negative trades need to be right about direction AND timing. Give yourself enough time for your thesis to play out.',
  },
  {
    term: 'Scalping',
    definition: 'A short-term trading style focused on capturing small, quick profits from minor price movements. Common with 0 DTE options.',
    category: 'Trading',
    tip: 'Scalping options requires fast execution and discipline. Transaction costs and slippage eat into profits quickly.',
  },
  {
    term: 'Paper Trading',
    definition: 'Practicing trading with simulated money rather than real capital. Most brokers offer paper trading accounts to test strategies without financial risk.',
    category: 'Trading',
    tip: 'Paper trade for at least 30 days before risking real money. But know that emotional responses differ with real capital.',
  },
  {
    term: 'Expected Value',
    abbrev: 'EV',
    definition: 'The average outcome of a trade over many repetitions. Calculated as (Probability of Win x Average Win) - (Probability of Loss x Average Loss). Positive EV = profitable strategy over time.',
    category: 'Trading',
    example: 'A trade with 70% POP, $100 avg win, and $250 avg loss: EV = (0.70 x $100) - (0.30 x $250) = $70 - $75 = -$5 (negative EV!).',
    tip: 'High POP does not guarantee positive EV. Always consider the magnitude of wins vs losses, not just frequency.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL STRATEGIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Poor Man\'s Covered Call',
    abbrev: 'PMCC',
    definition: 'A diagonal spread that simulates a covered call using a deep ITM LEAPS call instead of 100 shares. Requires much less capital than a traditional covered call.',
    category: 'Strategies',
    example: 'Buy a 12-month $130 Call (deep ITM, delta 0.85) on a $150 stock. Sell monthly $155 Calls against it.',
    tip: 'The PMCC lets you run a covered call strategy with 1/3 to 1/5 the capital. But it has more complexity and risk.',
  },
  {
    term: 'Short Straddle',
    definition: 'Selling both an ATM call and ATM put at the same strike and expiration. Collects maximum premium but has unlimited risk on both sides.',
    category: 'Strategies',
    example: 'Sell $100 Call + Sell $100 Put for $8 combined. Max profit if stock stays at $100. Breakevens at $92 and $108.',
    tip: 'Short straddles profit from low realized volatility. Manage actively — do not let losses run.',
    visual: 'sell',
  },
  {
    term: 'Short Strangle',
    definition: 'Selling an OTM call and OTM put at different strikes, same expiration. Wider profit zone than a straddle but collects less premium.',
    category: 'Strategies',
    example: 'Sell $105 Call + Sell $95 Put for $4. Stock must stay between ~$91-$109 to profit.',
    tip: 'Short strangles are one of the most popular professional strategies. Manage at 21 DTE or 50% of max profit.',
    visual: 'sell',
  },
  {
    term: 'Credit Spread',
    definition: 'A vertical spread where you receive a net credit. You sell a closer-to-ATM option and buy a further-OTM option for protection. Defined risk, theta positive.',
    category: 'Strategies',
    tip: 'Credit spreads are the bread and butter of income-oriented options trading. They define your risk while collecting premium.',
    visual: 'sell',
  },
  {
    term: 'Debit Spread',
    definition: 'A vertical spread where you pay a net debit. You buy a closer-to-ATM option and sell a further-OTM option to reduce cost. Defined risk, directional.',
    category: 'Strategies',
    tip: 'Debit spreads are cheaper than naked options and have defined risk. Tradeoff: capped max profit.',
    visual: 'buy',
  },
  {
    term: 'Married Put',
    definition: 'Buying a put option simultaneously with purchasing the underlying stock. Identical to a protective put. Provides downside protection from day one.',
    category: 'Strategies',
    tip: 'A married put is essentially buying stock with built-in insurance. The put cost reduces your overall profit potential.',
    visual: 'buy',
  },
  {
    term: 'Straddle Swap',
    definition: 'Closing a straddle at one strike and opening a new one at a different strike or expiration. Used to adjust delta exposure while maintaining a volatility position.',
    category: 'Strategies',
    tip: 'Straddle swaps help you reposition without fully exiting and re-entering, which saves on slippage costs.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL FLOW & SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Whale',
    definition: 'A trader or institution making very large option trades (often millions of dollars in premium). Whale activity can signal strong conviction or upcoming news.',
    category: 'Flow & Signals',
    example: 'A whale buys 20,000 contracts of a $50 call for $2.00 each = $4 million premium. That is conviction.',
    tip: 'Not all whale trades are directional bets. Some are hedges for even larger stock positions.',
  },
  {
    term: 'Smart Money',
    definition: 'A loosely defined term for institutional or professional traders whose activity may indicate informed positioning. Identified by trade size, execution type, and timing.',
    category: 'Flow & Signals',
    tip: 'Be skeptical of "smart money" labels. Even institutions are wrong frequently. Use flow data as one input, not the only one.',
  },
  {
    term: 'Net Premium',
    definition: 'The total dollar amount of premiums paid minus premiums received across all trades for a given option or underlying. Positive = buyers dominating. Negative = sellers dominating.',
    category: 'Flow & Signals',
    tip: 'Net premium gives you a dollar-weighted view of market sentiment. More informative than simple volume.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL RISK MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Stop Loss',
    definition: 'A predetermined price level at which you will exit a losing trade. Can be based on the option price, underlying price, or a percentage of premium.',
    category: 'Risk Management',
    example: 'You buy a call at $3.00 and set a mental stop at $1.50 (50% of premium). If it hits $1.50, you close to preserve capital.',
    tip: 'Hard stops on options can be triggered by temporary volatility. Consider time-based or underlying-price-based stops instead.',
  },
  {
    term: 'Profit Target',
    definition: 'A predetermined price level at which you will exit a winning trade. For credit trades, common targets are 50% or 75% of max profit.',
    category: 'Risk Management',
    example: 'You sell a credit spread for $1.00 credit. Your profit target is $0.50 (50% of max profit). You BTC at $0.50.',
    tip: 'Taking profits at 50% of max profit on credit trades improves win rate and reduces risk exposure time.',
  },
  {
    term: 'Kelly Criterion',
    definition: 'A mathematical formula for optimal position sizing based on win rate and average win/loss ratio. Tells you what percentage of your bankroll to risk per trade.',
    category: 'Risk Management',
    tip: 'Full Kelly is too aggressive for most traders. Half-Kelly or quarter-Kelly provides a good balance of growth and risk.',
  },
  {
    term: 'Correlation Risk',
    definition: 'The risk that positions which appear diversified move together during market stress. Correlations tend to increase during sell-offs.',
    category: 'Risk Management',
    tip: 'Having 10 bull put spreads on different stocks does not protect you if the entire market drops. Sector and market diversification matter.',
  },
  {
    term: 'Black Swan',
    definition: 'An extremely rare, unpredictable event with severe market consequences. Named by Nassim Taleb. Examples: COVID crash, 2008 financial crisis, 9/11.',
    category: 'Risk Management',
    tip: 'You cannot predict black swans, but you can prepare. Never risk more than you can afford to lose. Use defined-risk strategies.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MARKET STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Clearing',
    definition: 'The process by which the OCC (Options Clearing Corporation) ensures both sides of a trade are fulfilled. Clearing removes counterparty risk from options trading.',
    category: 'Market Structure',
    tip: 'Thanks to central clearing, you never need to worry about the other side of your trade defaulting.',
  },
  {
    term: 'Maker-Taker Model',
    definition: 'A fee structure where liquidity providers (makers) receive rebates and liquidity takers pay fees. Encourages tight quotes and deep markets.',
    category: 'Market Structure',
    tip: 'When you trade with a limit order at the bid or ask (adding liquidity), you may get a small rebate. Market orders pay the taker fee.',
  },
  {
    term: 'Payment for Order Flow',
    abbrev: 'PFOF',
    definition: 'The practice where brokers send retail orders to market makers in exchange for payment. The market maker profits from the spread; the broker shares revenue with customers via commission-free trading.',
    category: 'Market Structure',
    tip: 'PFOF is how most commission-free brokers make money. It can result in slightly worse fill prices, though NBBO rules provide a floor.',
  },
  {
    term: 'Designated Market Maker',
    abbrev: 'DMM',
    definition: 'A market maker assigned to specific options classes with the obligation to maintain fair and orderly markets. They must provide continuous two-sided quotes.',
    category: 'Market Structure',
    tip: 'DMMs ensure there is always a bid and ask available. They are especially important for less-liquid options.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ADVANCED CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    term: 'Variance Swap',
    definition: 'A derivative that pays the difference between realized variance and a fixed strike variance. Used by institutions to trade volatility directly.',
    category: 'Advanced Concepts',
    tip: 'Variance swaps are the purest way to trade volatility. They are primarily institutional but influence retail option pricing.',
  },
  {
    term: 'Correlation Trading',
    definition: 'Trading strategies based on the relationship between implied correlation (from index options) and realized correlation among individual stocks.',
    category: 'Advanced Concepts',
    tip: 'When implied correlation is high, selling index options and buying individual stock options can be profitable — this is dispersion trading.',
  },
  {
    term: 'Jump Risk',
    definition: 'The risk of a sudden, large price gap in the underlying that cannot be hedged through continuous delta hedging. Earnings announcements and news events create jump risk.',
    category: 'Advanced Concepts',
    tip: 'Jump risk is why OTM options trade at higher IV than Black-Scholes would predict. The smile/skew compensates for jump risk.',
  },
  {
    term: 'Risk Reversal',
    definition: 'A strategy that combines a short OTM put with a long OTM call (or vice versa). Expresses a directional view at low or zero cost. Also a measure of put/call skew.',
    category: 'Advanced Concepts',
    example: 'Sell $90 Put, Buy $110 Call on a $100 stock for zero cost. Bullish above $110, risk below $90.',
    tip: 'Risk reversals are popular in forex and commodity markets. They express a directional opinion while defining the key risk levels.',
  },
  {
    term: 'Vol of Vol',
    definition: 'The volatility of implied volatility itself. Measures how much IV fluctuates over time. High vol-of-vol means IV is unstable and hard to predict.',
    category: 'Advanced Concepts',
    tip: 'Vol of vol is related to VVIX. Environments with high vol-of-vol require more active management of vega-sensitive positions.',
  },
  {
    term: 'Kurtosis',
    definition: 'A statistical measure of "tail thickness" in a return distribution. Higher kurtosis means more frequent extreme moves than a normal distribution would predict.',
    category: 'Advanced Concepts',
    tip: 'Stock returns have excess kurtosis (fat tails). This is why deep OTM options are more expensive than simple models predict.',
  },
];

// ── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Get all unique categories in the vocabulary
 */
export function getCategories(): VocabularyCategory[] {
  return CATEGORY_META.map(c => c.key);
}

/**
 * Get terms filtered by category
 */
export function getTermsByCategory(category: VocabularyCategory): VocabularyTerm[] {
  return VOCABULARY_TERMS.filter(t => t.category === category);
}

/**
 * Search terms by query (matches term name, definition, abbreviation, example, and tip)
 */
export function searchTerms(query: string): VocabularyTerm[] {
  if (!query || query.trim() === '') return VOCABULARY_TERMS;
  const q = query.toLowerCase().trim();
  return VOCABULARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(q) ||
    t.definition.toLowerCase().includes(q) ||
    (t.abbrev && t.abbrev.toLowerCase().includes(q)) ||
    (t.example && t.example.toLowerCase().includes(q)) ||
    (t.tip && t.tip.toLowerCase().includes(q))
  );
}

/**
 * Get terms filtered by category and search query
 */
export function filterTerms(
  category: string,
  query: string
): VocabularyTerm[] {
  return VOCABULARY_TERMS.filter(t => {
    const matchesCategory = category === 'All' || t.category === category;
    if (!query || query.trim() === '') return matchesCategory;
    const q = query.toLowerCase().trim();
    const matchesSearch =
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      (t.abbrev && t.abbrev.toLowerCase().includes(q)) ||
      (t.example && t.example.toLowerCase().includes(q)) ||
      (t.tip && t.tip.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });
}

/**
 * Group terms by category, preserving category order from CATEGORY_META
 */
export function groupTermsByCategory(
  terms: VocabularyTerm[]
): Record<string, VocabularyTerm[]> {
  const grouped: Record<string, VocabularyTerm[]> = {};
  for (const term of terms) {
    if (!grouped[term.category]) grouped[term.category] = [];
    grouped[term.category].push(term);
  }
  // Return in category order
  const ordered: Record<string, VocabularyTerm[]> = {};
  for (const meta of CATEGORY_META) {
    if (grouped[meta.key]) {
      ordered[meta.key] = grouped[meta.key];
    }
  }
  return ordered;
}

/**
 * Get a single term by name (case-insensitive)
 */
export function getTermByName(name: string): VocabularyTerm | undefined {
  const lower = name.toLowerCase();
  return VOCABULARY_TERMS.find(
    t => t.term.toLowerCase() === lower ||
         (t.abbrev && t.abbrev.toLowerCase() === lower)
  );
}

/**
 * Get count of terms per category
 */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const term of VOCABULARY_TERMS) {
    counts[term.category] = (counts[term.category] || 0) + 1;
  }
  return counts;
}

/**
 * Get the category metadata for a given category key
 */
export function getCategoryMeta(key: VocabularyCategory): CategoryMeta | undefined {
  return CATEGORY_META.find(c => c.key === key);
}

/**
 * Total number of vocabulary terms
 */
export const VOCABULARY_COUNT = VOCABULARY_TERMS.length;
