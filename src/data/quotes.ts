// Wisdom Quotes for Wall Street Wildlife Mobile
// 219 quotes from the desktop course, organized by cognitive bias
// Displayed throughout the learning experience

export interface WisdomQuote {
  text: string;
  author: string;
  source?: string;
  category: 'trading' | 'wisdom' | 'discipline' | 'risk' | 'patience' | 'psychology';
  bias?: string;
  analysis?: string;
}

// Map bias names to mobile categories
const biasToCategory = (bias: string): WisdomQuote['category'] => {
  switch (bias) {
    case 'Loss Aversion':
    case 'Sunk Cost Fallacy':
    case 'Disposition Effect':
    case 'Endowment Effect':
    case 'Zero-Risk Bias':
    case 'Regret Aversion':
      return 'risk';
    case 'Confirmation Bias':
    case 'Overconfidence':
    case 'Dunning-Kruger Effect':
    case 'Hindsight Bias':
    case 'Narrative Fallacy':
    case 'Framing Effect':
    case 'Affect Heuristic':
    case 'Availability Heuristic':
      return 'psychology';
    case 'Herd Mentality':
    case 'Bandwagon Effect':
    case 'Authority Bias':
    case 'Reactance':
      return 'wisdom';
    case 'Anchoring':
    case 'FOMO':
    case 'Recency Bias':
    case 'Gambler\'s Fallacy':
    case 'Survivorship Bias':
    case 'Decoy Effect':
    case 'Outcome Bias':
      return 'trading';
    case 'Mental Accounting':
      return 'discipline';
    case 'Status Quo Bias':
    case 'Commitment Bias':
    case 'Ostrich Effect':
      return 'patience';
    case 'Home Bias':
    case 'Illusion of Control':
      return 'trading';
    default:
      return 'wisdom';
  }
};

// All 219 wisdom quotes from the desktop course
export const WISDOM_QUOTES: WisdomQuote[] = [
  // === Loss Aversion (7 quotes) ===
  {
    text: "And those who were seen dancing were thought to be insane by those who could not hear the music.",
    author: "Friedrich Nietzsche",
    source: "Thus Spoke Zarathustra",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The crowd\u2019s consensus feels safe, but it\u2019s often wrong at turning points. When everyone agrees a stock is uninvestable, the contrarian hears music the herd cannot. Your edge isn\u2019t in following\u2014it\u2019s in understanding why you\u2019re out of step and being right about it.",
  },
  {
    text: "My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity.",
    author: "Friedrich Nietzsche",
    source: "Ecce Homo",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "Losses loom larger than gains.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "The first rule of compounding: never interrupt it unnecessarily.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "Cowards die many times before their deaths; the valiant never taste of death but once.",
    author: "William Shakespeare",
    source: "Julius Caesar",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    source: "Letters to Lucilius",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "Getting money requires taking risks, being optimistic and putting yourself out there. But keeping money requires the opposite of taking risk. It requires humility, and fear that what you\u2019ve made can be taken away from you just as fast.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },
  {
    text: "An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return.",
    author: "Benjamin Graham",
    source: "The Intelligent Investor",
    category: 'risk',
    bias: "Loss Aversion",
    analysis: "The tendency to feel the pain of losses roughly twice as strongly as the pleasure of equivalent gains. This asymmetry, discovered by Kahneman and Tversky, drives investors to make irrational decisions to avoid losses rather than to acquire gains.",
  },

  // === Confirmation Bias (7 quotes) ===
  {
    text: "Nothing is so firmly believed as that which we least know.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "The eye sees only what the mind is prepared to comprehend.",
    author: "Henri Bergson",
    source: "Creative Evolution",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "The human understanding when it has once adopted an opinion draws all things else to support and agree with it.",
    author: "Francis Bacon",
    source: "Novum Organum",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "The investor\u2019s chief problem \u2014 and even his worst enemy \u2014 is likely to be himself.",
    author: "Benjamin Graham",
    source: "The Intelligent Investor",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "There is nothing either good or bad, but thinking makes it so.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "The most important thing in communication is hearing what isn\u2019t said.",
    author: "Peter Drucker",
    source: "Management: Tasks, Responsibilities, Practices",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },
  {
    text: "Your brain on stocks is a lot like your brain on drugs: after a while, you need a bigger dose of the stimulant to get the same effect.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'psychology',
    bias: "Confirmation Bias",
    analysis: "The tendency to search for, interpret, and remember information that confirms your pre-existing beliefs while ignoring contradictory evidence. This is arguably the most dangerous bias in investing because it makes you blind to the very information that could save you.",
  },

  // === Herd Mentality (7 quotes) ===
  {
    text: "The crowd is untruth. And therefore was Christ crucified, because he, even though he addressed himself to all, would not have to do with the crowd.",
    author: "S\u00F8ren Kierkegaard",
    source: "The Point of View for My Work as an Author",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.",
    author: "Mark Twain",
    source: "Notebook",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "Be fearful when others are greedy, and greedy when others are fearful.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "In my whole life, I have known no wise people who didn\u2019t read all the time \u2014 none, zero.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "Men, it has been well said, think in herds; it will be seen that they go mad in herds, while they only recover their senses slowly, one by one.",
    author: "Charles Mackay",
    source: "Extraordinary Popular Delusions and the Madness of Crowds",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "The individual has always had to struggle to keep from being overwhelmed by the tribe.",
    author: "Friedrich Nietzsche",
    source: "Beyond Good and Evil",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },
  {
    text: "The way of a fool is right in his own eyes, but a wise man listens to advice.",
    author: "William Shakespeare",
    source: "Coriolanus",
    category: 'wisdom',
    bias: "Herd Mentality",
    analysis: "The tendency to follow what the majority is doing, abandoning your own analysis in favor of the crowd\u2019s consensus. In markets, this creates bubbles and panics \u2014 the crowd amplifies both euphoria and fear beyond reason.",
  },

  // === Sunk Cost Fallacy (7 quotes) ===
  {
    text: "You only lose what you cling to.",
    author: "Buddha",
    source: "Dhammapada",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "What is past is prologue.",
    author: "William Shakespeare",
    source: "The Tempest",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "The art of being wise is the art of knowing what to overlook.",
    author: "William James",
    source: "The Principles of Psychology",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "The most important thing to do if you find yourself in a hole is to stop digging.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "Sunk costs are the debts of the ego.",
    author: "Jason Zweig",
    source: "The Devil's Financial Dictionary",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "Let go of certainty. The opposite isn\u2019t uncertainty. It\u2019s openness, curiosity and a willingness to embrace paradox.",
    author: "Tony Robbins",
    source: "Awaken the Giant Within",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },
  {
    text: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'risk',
    bias: "Sunk Cost Fallacy",
    analysis: "The tendency to continue investing in something because of previously invested resources (time, money, effort) rather than future value. The money is already gone \u2014 but your brain treats it as a reason to keep going.",
  },

  // === Overconfidence (7 quotes) ===
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    source: "Apology (via Plato)",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "The world is full of people who have never, since childhood, met an open doorway with an open mind.",
    author: "E.B. White",
    source: "One Man's Meat",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "People who have good trading systems to begin with sometimes fail because they don\u2019t follow their systems. Overconfidence and greed are their undoing.",
    author: "Jesse Livermore",
    source: "Reminiscences of a Stock Operator",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "Acknowledging what you don\u2019t know is the dawning of wisdom.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "The fool doth think he is wise, but the wise man knows himself to be a fool.",
    author: "William Shakespeare",
    source: "As You Like It",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "Presumption is our natural and original disease.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },
  {
    text: "Overconfidence is the most significant of the cognitive biases.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'psychology',
    bias: "Overconfidence",
    analysis: "The tendency to overestimate your own knowledge, abilities, and the precision of your predictions. Studies show that investors who trade most frequently \u2014 driven by overconfidence \u2014 consistently underperform those who trade least.",
  },

  // === Anchoring (7 quotes) ===
  {
    text: "No man ever steps in the same river twice, for it\u2019s not the same river and he\u2019s not the same man.",
    author: "Heraclitus",
    source: "Fragments",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "In the beginner\u2019s mind there are many possibilities, in the expert\u2019s mind there are few.",
    author: "Shunryu Suzuki",
    source: "Zen Mind, Beginner's Mind",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "Anchoring is a subtle but powerful effect. You see a number, and it has an effect on you, whether or not you believe that it should.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "The stock market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "Things alter for the worse spontaneously, if they be not altered for the better designedly.",
    author: "Francis Bacon",
    source: "Essays",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },
  {
    text: "Your Money and Your Brain are locked in a daily battle \u2014 and all too often, your brain is trying to kill your money.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'trading',
    bias: "Anchoring",
    analysis: "The tendency to rely too heavily on the first piece of information encountered when making decisions. In investing, this often manifests as fixating on a stock\u2019s previous high price, purchase price, or an analyst\u2019s initial target.",
  },

  // === FOMO (7 quotes) ===
  {
    text: "Make the best use of what is in your power, and take the rest as it happens.",
    author: "Epictetus",
    source: "Discourses",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "The big money is not in the buying and selling, but in the waiting.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "There is surely nothing quite so useless as doing with great efficiency what should not be done at all.",
    author: "Peter Drucker",
    source: "The Effective Executive",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "An ounce of patience is worth a pound of brains.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "Life is what happens to you while you\u2019re busy making other plans.",
    author: "John Lennon",
    source: "Beautiful Boy",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "The market is designed to transfer money from the Active to the Patient.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },
  {
    text: "Good investing is not necessarily about making good decisions. It\u2019s about consistently not screwing up.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'trading',
    bias: "FOMO",
    analysis: "Fear of Missing Out \u2014 the anxious feeling that others are profiting from an opportunity you\u2019re not part of. FOMO drives investors to chase rallies, buy at tops, and abandon their strategy for the thrill of participation.",
  },

  // === Recency Bias (7 quotes) ===
  {
    text: "Look back over the past, with its changing empires that rose and fell, and you can foresee the future too.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "History doesn\u2019t repeat itself, but it does rhyme.",
    author: "Mark Twain",
    source: "attributed",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "The four most dangerous words in investing are: \u2018This time it\u2019s different.\u2019",
    author: "Sir John Templeton",
    source: "attributed",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "Nothing in this world is harder than speaking the truth, nothing easier than flattery.",
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "The thing that hath been, it is that which shall be; and that which is done is that which shall be done.",
    author: "King Solomon",
    source: "Ecclesiastes",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "Risk is what\u2019s left over when you think you\u2019ve thought of everything.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },
  {
    text: "An investor who has all the answers doesn\u2019t even understand the questions.",
    author: "Jason Zweig",
    source: "The Devil's Financial Dictionary",
    category: 'trading',
    bias: "Recency Bias",
    analysis: "The tendency to overweight recent events and extrapolate them into the future. After a bull market, investors expect continued gains; after a crash, they expect continued losses. The recent past hijacks your sense of the probable future.",
  },

  // === Disposition Effect (7 quotes) ===
  {
    text: "One must imagine Sisyphus happy.",
    author: "Albert Camus",
    source: "The Myth of Sisyphus",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "Cut short your losses; let your profits run on.",
    author: "David Ricardo",
    source: "attributed",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "It was never my thinking that made the big money for me. It was always my sitting.",
    author: "Jesse Livermore",
    source: "Reminiscences of a Stock Operator",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "To be, or not to be, that is the question: Whether \u2019tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "The essence of investment management is the management of risks, not the management of returns.",
    author: "Benjamin Graham",
    source: "The Intelligent Investor",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "Man is the only creature who refuses to be what he is.",
    author: "Albert Camus",
    source: "The Rebel",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },
  {
    text: "Planning is important, but the most important part of every plan is to plan on the plan not going according to plan.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'risk',
    bias: "Disposition Effect",
    analysis: "The tendency to sell winning investments too early to \u2018lock in gains\u2019 while holding losing investments too long hoping they\u2019ll recover. It\u2019s a combination of loss aversion and the desire for the emotional reward of a realized gain.",
  },

  // === Endowment Effect (7 quotes) ===
  {
    text: "You only lose what you cling to.",
    author: "Buddha",
    source: "Dhammapada",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "Once we own a thing, we value it more \u2014 regardless of its objective value.",
    author: "Richard Thaler",
    source: "Misbehaving",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "The things you own end up owning you.",
    author: "Chuck Palahniuk",
    source: "Fight Club",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "Let me embrace thee, sour adversity, for wise men say it is the wisest course.",
    author: "William Shakespeare",
    source: "Henry VI, Part 3",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "The only thing that makes life possible is permanent, intolerable uncertainty; not knowing what comes next.",
    author: "Ursula K. Le Guin",
    source: "The Left Hand of Darkness",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },
  {
    text: "Spending money to show people how much money you have is the fastest way to have less money.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'risk',
    bias: "Endowment Effect",
    analysis: "The tendency to overvalue things simply because you own them. Once you possess a stock, a house, or any asset, you assign it more value than the market does \u2014 not because of analysis, but because of ownership itself.",
  },

  // === Availability Heuristic (7 quotes) ===
  {
    text: "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "We think, each of us, that we\u2019re much more rational than we are. And we think that we make our decisions because we have good reasons to make them. Even when it\u2019s the other way around.",
    author: "Dan Ariely",
    source: "Predictably Irrational",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "Everyone has a plan until they get punched in the mouth.",
    author: "Mike Tyson",
    source: "attributed",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "Man is not a rational animal, he is a rationalizing animal.",
    author: "Robert A. Heinlein",
    source: "Assignment in Eternity",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "We are too much accustomed to attribute to a single cause that which is the product of several, and the majority of our controversies come from that.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },
  {
    text: "Your brain serves up memories and images and stories that have the greatest emotional intensity, not the ones most relevant to the decision at hand.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'psychology',
    bias: "Availability Heuristic",
    analysis: "The tendency to judge the likelihood of events based on how easily examples come to mind. Dramatic, recent, or emotionally vivid events feel more probable than they actually are. Plane crashes feel more dangerous than car rides because they\u2019re more memorable.",
  },

  // === Gambler's Fallacy (7 quotes) ===
  {
    text: "Man\u2019s greatness lies in the power of thought.",
    author: "Blaise Pascal",
    source: "Pens\u00E9es",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "Randomness means that some patterns that are entirely consistent with chance will nonetheless fool you into thinking they are meaningful.",
    author: "Leonard Mlodinow",
    source: "The Drunkard's Walk",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "The market can stay irrational longer than you can stay solvent.",
    author: "John Maynard Keynes",
    source: "attributed",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "If you give a monkey enough darts, one of them will hit the bull\u2019s-eye\u2014and that doesn\u2019t mean the monkey knows how to throw.",
    author: "Jason Zweig",
    source: "The Devil's Financial Dictionary",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "The desire to be right and the desire to have been right are two desires, and the sooner we separate them the better off we are.",
    author: "Nassim Nicholas Taleb",
    source: "The Black Swan",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "There is a tide in the affairs of men, which taken at the flood, leads on to fortune. Omitted, all the voyage of their life is bound in shallows and in miseries.",
    author: "William Shakespeare",
    source: "Julius Caesar",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },
  {
    text: "Chance is the pseudonym of God when he did not want to sign.",
    author: "Anatole France",
    source: "The Garden of Epicurus",
    category: 'trading',
    bias: "Gambler's Fallacy",
    analysis: "The mistaken belief that if something happens more frequently than normal during a given period, it will happen less frequently in the future (or vice versa). Each coin flip is independent \u2014 the universe has no memory of your last trade.",
  },

  // === Hindsight Bias (7 quotes) ===
  {
    text: "The narrative fallacy addresses our limited ability to look at sequences of facts without weaving an explanation into them.",
    author: "Nassim Nicholas Taleb",
    source: "The Black Swan",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "Hindsight bias makes surprises vanish. In hindsight, we can\u2019t believe we were ever surprised by what seems so obvious now.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "Experience is simply the name we give our mistakes.",
    author: "Oscar Wilde",
    source: "The Picture of Dorian Gray",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "We don\u2019t see things as they are, we see them as we are.",
    author: "Ana\u00EFs Nin",
    source: "Seduction of the Minotaur",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "In the real world, it is much harder to figure out what happened in the past than it would seem \u2014 and much easier to construct a plausible narrative afterward.",
    author: "Howard Marks",
    source: "The Most Important Thing",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "My life has been full of terrible misfortunes, most of which never happened.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: 'psychology',
    bias: "Hindsight Bias",
    analysis: "The \u2018I knew it all along\u2019 effect \u2014 the tendency to see past events as having been predictable, even though there was no basis for predicting them. After the fact, everything looks inevitable. This destroys your ability to learn from mistakes.",
  },

  // === Mental Accounting (7 quotes) ===
  {
    text: "Money is fungible. A dollar in one mental account is not worth more or less than a dollar in another.",
    author: "Richard Thaler",
    source: "Misbehaving",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "Annual income twenty pounds, annual expenditure nineteen nineteen six, result happiness. Annual income twenty pounds, annual expenditure twenty pounds nought and six, result misery.",
    author: "Charles Dickens",
    source: "David Copperfield",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus",
    source: "Discourses",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "A penny saved is a penny earned \u2014 but a penny found feels like a penny free.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "Neither a borrower nor a lender be, for loan oft loses both itself and friend.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "Wealth is the ability to fully experience life.",
    author: "Henry David Thoreau",
    source: "Walden",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },
  {
    text: "Money is a terrible master but an excellent servant.",
    author: "P.T. Barnum",
    source: "The Art of Money Getting",
    category: 'discipline',
    bias: "Mental Accounting",
    analysis: "The tendency to treat money differently depending on its source, intended use, or the mental \u2018account\u2019 it belongs to. A dollar is a dollar \u2014 but your brain creates separate buckets that lead to irrational financial decisions.",
  },

  // === Status Quo Bias (7 quotes) ===
  {
    text: "The snake which cannot cast its skin has to die. As well the minds which are prevented from changing their opinions; they cease to be mind.",
    author: "Friedrich Nietzsche",
    source: "Daybreak",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "If you want something you\u2019ve never had, you must be willing to do something you\u2019ve never done.",
    author: "Thomas Jefferson",
    source: "attributed",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "The only thing that is constant is change.",
    author: "Heraclitus",
    source: "Fragments",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "Our favorite holding period is forever \u2014 but only for businesses that maintain their competitive advantages.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.",
    author: "George Bernard Shaw",
    source: "Everybody's Political What's What",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "The reasonable man adapts himself to the world: the unreasonable one persists in trying to adapt the world to himself.",
    author: "George Bernard Shaw",
    source: "Man and Superman",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },
  {
    text: "More money has been lost waiting for corrections and anticipating corrections than in the corrections themselves.",
    author: "Peter Lynch",
    source: "One Up on Wall Street",
    category: 'patience',
    bias: "Status Quo Bias",
    analysis: "The preference for the current state of affairs, where any change is perceived as a loss. Inaction feels safer than action, even when the evidence overwhelmingly supports change. It\u2019s loss aversion applied to the present.",
  },

  // === Narrative Fallacy (7 quotes) ===
  {
    text: "We are narrative animals. We need to explain, to find meaning, to understand. But we explain what we can\u2019t predict and predict what we can\u2019t explain.",
    author: "Nassim Nicholas Taleb",
    source: "Fooled by Randomness",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "People think they know things. They don\u2019t. Everything is a story \u2014 and we construct our stories to make ourselves the hero.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "It takes something more than intelligence to act intelligently.",
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "When the facts change, I change my mind. What do you do, sir?",
    author: "John Maynard Keynes",
    source: "attributed",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "All that glisters is not gold; often have you heard that told.",
    author: "William Shakespeare",
    source: "The Merchant of Venice",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "I am what I am, and that\u2019s all that I am.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },
  {
    text: "The stock market is the story of cycles and of the human behavior that is responsible for overreactions in both directions.",
    author: "Seth Klarman",
    source: "Margin of Safety",
    category: 'psychology',
    bias: "Narrative Fallacy",
    analysis: "The deeply ingrained tendency to create coherent stories to explain random or complex events. We can\u2019t resist turning noise into narrative. In investing, this means we construct convincing explanations for market moves that were, in reality, largely random.",
  },

  // === Dunning-Kruger Effect (7 quotes) ===
  {
    text: "I say let the world go to hell, but I should always have my tea.",
    author: "Fyodor Dostoevsky",
    source: "Notes from Underground",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt.",
    author: "Bertrand Russell",
    source: "Mortals and Others",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "It ain\u2019t what you don\u2019t know that gets you into trouble. It\u2019s what you know for sure that just ain\u2019t so.",
    author: "Mark Twain",
    source: "attributed",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "Know thyself.",
    author: "Socrates",
    source: "attributed (Delphic maxim)",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "People tend to assess their competence in highly favorable terms, and this bias is most extreme for those with the least skill.",
    author: "David Dunning",
    source: "Self-Insight: Roadblocks and Detours on the Path to Knowing Thyself",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "Invest in yourself. Your career is the engine of your wealth.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },
  {
    text: "Man is the only animal that deals in that atrocity of atrocities, War. He is the only one that gathers his brethren about him and goes forth in cold blood and with calm pulse to exterminate his kind.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'psychology',
    bias: "Dunning-Kruger Effect",
    analysis: "A cognitive bias where people with limited knowledge or competence in a domain greatly overestimate their own ability, while true experts tend to underestimate theirs. The less you know, the more confident you feel \u2014 because you don\u2019t know enough to know what you don\u2019t know.",
  },

  // === Survivorship Bias (7 quotes) ===
  {
    text: "All truth passes through three stages: first it is ridiculed, second it is violently opposed, third it is accepted as being self-evident.",
    author: "Arthur Schopenhauer",
    source: "The World as Will and Representation",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "The cemetery of dead funds is huge.",
    author: "Nassim Nicholas Taleb",
    source: "Fooled by Randomness",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "A man hears what he wants to hear and disregards the rest.",
    author: "Paul Simon",
    source: "The Boxer",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "The lucky man is he who knows how much to leave to chance.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "Some are born great, some achieve greatness, and some have greatness thrust upon them.",
    author: "William Shakespeare",
    source: "Twelfth Night",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "Bill Gates went to one of the only high schools in the world that had a computer. The odds of a high school student in 1968 having access to a computer were about one in a million.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },
  {
    text: "An expert is a person who has made all the mistakes that can be made in a very narrow field.",
    author: "Niels Bohr",
    source: "attributed",
    category: 'trading',
    bias: "Survivorship Bias",
    analysis: "The logical error of concentrating on the people or things that passed some selection process and overlooking those that did not. We study the winners and ignore the graveyard of failures, leading to a distorted view of what drives success.",
  },

  // === Framing Effect (7 quotes) ===
  {
    text: "It is not the answer that enlightens, but the question.",
    author: "Eug\u00E8ne Ionesco",
    source: "D\u00E9couvertes",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "The framing of a problem often determines its solution.",
    author: "Amos Tversky",
    source: "Judgment Under Uncertainty",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "All things are subject to interpretation. Whichever interpretation prevails at a given time is a function of power and not truth.",
    author: "Friedrich Nietzsche",
    source: "The Will to Power",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "The eye sees only what the mind is prepared to comprehend.",
    author: "Robertson Davies",
    source: "Tempest-Tost",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "Nothing is either good or bad but thinking makes it so.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "Second-level thinking is deep, complex, and convoluted.",
    author: "Howard Marks",
    source: "The Most Important Thing",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },
  {
    text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
    author: "Albert Einstein",
    source: "attributed",
    category: 'psychology',
    bias: "Framing Effect",
    analysis: "The tendency to draw different conclusions from the same information depending on how it\u2019s presented. A surgery with a \u201890% survival rate\u2019 feels different from one with a \u201810% mortality rate\u2019 \u2014 even though they\u2019re identical.",
  },

  // === Bandwagon Effect (7 quotes) ===
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    source: "Self-Reliance",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "What the wise do in the beginning, fools do in the end.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "People do not decide their futures, they decide their habits and their habits decide their futures.",
    author: "F.M. Alexander",
    source: "attributed",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "Whoso would be a man must be a nonconformist.",
    author: "Ralph Waldo Emerson",
    source: "Self-Reliance",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "How far that little candle throws his beams! So shines a good deed in a naughty world.",
    author: "William Shakespeare",
    source: "The Merchant of Venice",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "The most contrarian thing of all is not to oppose the crowd but to think for yourself.",
    author: "Peter Thiel",
    source: "Zero to One",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },
  {
    text: "The highest form of human intelligence is to observe yourself without judgment.",
    author: "Jiddu Krishnamurti",
    source: "Freedom from the Known",
    category: 'wisdom',
    bias: "Bandwagon Effect",
    analysis: "The tendency to adopt behaviors, beliefs, or investments primarily because many other people are doing so. It\u2019s related to herd mentality but specifically involves the acceleration effect \u2014 the more people join, the faster others follow.",
  },

  // === Reactance (7 quotes) ===
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    author: "Carl Jung",
    source: "Collected Works",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
    author: "Carl Jung",
    source: "Memories, Dreams, Reflections",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "The lady doth protest too much, methinks.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "Rebellion cannot exist without the feeling that somewhere, in some way, you are justified.",
    author: "Albert Camus",
    source: "The Rebel",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "Invert, always invert.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "When people are free to do as they please, they usually imitate each other.",
    author: "Eric Hoffer",
    source: "The Passionate State of Mind",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },
  {
    text: "I wanted to change the world. But I have found that the only thing one can be sure of changing is oneself.",
    author: "Aldous Huxley",
    source: "Point Counter Point",
    category: 'wisdom',
    bias: "Reactance",
    analysis: "The urge to do the opposite of what someone recommends, simply because you feel your freedom of choice is being threatened. When told not to sell, you want to sell. When told to buy, you resist. The rebellion itself becomes the motive.",
  },

  // === Commitment Bias (7 quotes) ===
  {
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
    source: "Man's Search for Meaning",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "Foolish consistency is the hobgoblin of little minds, adored by little statesmen and philosophers and divines.",
    author: "Ralph Waldo Emerson",
    source: "Self-Reliance",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "Once we realize that imperfect understanding is the human condition, there is no shame in being wrong, only in failing to correct our mistakes.",
    author: "George Soros",
    source: "Soros on Soros",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "We are what we pretend to be, so we must be careful about what we pretend to be.",
    author: "Kurt Vonnegut",
    source: "Mother Night",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "I could be bounded in a nutshell, and count myself a king of infinite space, were it not that I have bad dreams.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "The most difficult subjects can be explained to the most slow-witted man if he has not formed any idea of them already.",
    author: "Leo Tolstoy",
    source: "The Kingdom of God Is Within You",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },
  {
    text: "We like to think of ourselves as consistent. The reality is we\u2019re just stubborn.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'patience',
    bias: "Commitment Bias",
    analysis: "The tendency to remain consistent with what we have previously done or said, even when the evidence no longer supports it. Once you\u2019ve publicly committed to a position, changing your mind feels like failure rather than growth.",
  },

  // === Ostrich Effect (7 quotes) ===
  {
    text: "In the midst of winter, I found there was, within me, an invincible summer.",
    author: "Albert Camus",
    source: "Return to Tipasa",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    author: "Albert Camus",
    source: "The Rebel",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "Pain plus reflection equals progress.",
    author: "Ray Dalio",
    source: "Principles",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "He that is robbed, not wanting what is stolen, let him not know it, and he\u2019s not robbed at all.",
    author: "William Shakespeare",
    source: "Othello",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "What information consumes is rather obvious: it consumes the attention of its recipients.",
    author: "Herbert Simon",
    source: "Designing Organizations for an Information-Rich World",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "You can avoid reality, but you cannot avoid the consequences of avoiding reality.",
    author: "Ayn Rand",
    source: "attributed",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },
  {
    text: "The worst financial decisions happen when you\u2019re trying to avoid short-term pain.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'patience',
    bias: "Ostrich Effect",
    analysis: "The tendency to avoid negative financial information by simply not looking at it. Named after the myth that ostriches bury their heads in the sand, this bias leads investors to ignore bad news, skip portfolio reviews, and avoid opening brokerage statements during downturns.",
  },

  // === Affect Heuristic (7 quotes) ===
  {
    text: "The curious paradox is that when I accept myself just as I am, then I can change.",
    author: "Carl Rogers",
    source: "On Becoming a Person",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
    source: "Man's Search for Meaning",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "Give every man thy ear, but few thy voice; take each man\u2019s censure, but reserve thy judgment.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "Your emotions will always try to hijack your financial decisions. That\u2019s not a flaw \u2014 it\u2019s evolution. But you still need to override them.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
    author: "Warren Buffett",
    source: "attributed",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "We are not thinking machines that feel; rather, we are feeling machines that think.",
    author: "Antonio Damasio",
    source: "Descartes' Error",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },
  {
    text: "There is nothing so disobedient as an undisciplined mind, and there is nothing so obedient as a disciplined mind.",
    author: "Buddha",
    source: "Dhammapada",
    category: 'psychology',
    bias: "Affect Heuristic",
    analysis: "The tendency to make judgments based on current emotions rather than objective analysis. When you feel good, investments seem less risky and more rewarding. When you feel bad, everything looks dangerous. Your mood becomes the lens for all decisions.",
  },

  // === Authority Bias (7 quotes) ===
  {
    text: "The individual has always had to struggle to keep from being overwhelmed by the tribe.",
    author: "Friedrich Nietzsche",
    source: "Beyond Good and Evil",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "Unthinking respect for authority is the greatest enemy of truth.",
    author: "Albert Einstein",
    source: "Letter to Jost Winteler",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "You are neither right nor wrong because the crowd disagrees with you. You are right because your data and reasoning are right.",
    author: "Benjamin Graham",
    source: "The Intelligent Investor",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "Question everything. Learn something. Answer nothing.",
    author: "Euripides",
    source: "attributed",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "But man, proud man, drest in a little brief authority, most ignorant of what he\u2019s most assured, plays such fantastic tricks before high heaven as make the angels weep.",
    author: "William Shakespeare",
    source: "Measure for Measure",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "There are two ways to be fooled. One is to believe what isn\u2019t true; the other is to refuse to believe what is true.",
    author: "S\u00F8ren Kierkegaard",
    source: "Works of Love",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },
  {
    text: "I think you have to learn that there\u2019s a company behind every stock and there\u2019s only one real reason why stocks go up.",
    author: "Peter Lynch",
    source: "One Up on Wall Street",
    category: 'wisdom',
    bias: "Authority Bias",
    analysis: "The tendency to attribute greater accuracy and weight to the opinion of an authority figure, regardless of the actual quality of their analysis. A famous investor\u2019s stock pick feels safer than your own research \u2014 even when their track record on that specific type of investment is poor.",
  },

  // === Zero-Risk Bias (7 quotes) ===
  {
    text: "Invert, always invert: Turn a situation or problem upside down. Look at it backward.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "To live is the rarest thing in the world. Most people exist, that is all.",
    author: "Oscar Wilde",
    source: "The Soul of Man Under Socialism",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "Wind extinguishes a candle and energizes fire. Likewise with randomness, uncertainty, chaos: you want to use them, not hide from them.",
    author: "Nassim Nicholas Taleb",
    source: "Antifragile",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "Security is mostly a superstition. Life is either a daring adventure, or nothing.",
    author: "Helen Keller",
    source: "The Open Door",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "Out of this nettle, danger, we pluck this flower, safety.",
    author: "William Shakespeare",
    source: "Henry IV, Part 1",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "The man who has anticipated the coming of troubles takes away their power when they arrive.",
    author: "Seneca",
    source: "Letters to Lucilius",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },
  {
    text: "Ironically, people who try to eliminate risk from their portfolios actually increase it.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'risk',
    bias: "Zero-Risk Bias",
    analysis: "The preference to completely eliminate one type of risk rather than reducing overall risk more effectively. We crave the psychological comfort of zero risk in one area, even if it means accepting greater total risk elsewhere.",
  },

  // === Decoy Effect (7 quotes) ===
  {
    text: "We are pawns in a game whose forces we largely fail to comprehend.",
    author: "Dan Ariely",
    source: "Predictably Irrational",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "Humans rarely choose things in absolute terms. We don\u2019t have an internal value meter that tells us how much things are worth. Rather, we focus on the relative advantage of one thing over another.",
    author: "Dan Ariely",
    source: "Predictably Irrational",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "All the world\u2019s a stage, and all the men and women merely players.",
    author: "William Shakespeare",
    source: "As You Like It",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    source: "attributed",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "I judge you unfortunate because you have never lived through misfortune. You have passed through life without an opponent \u2014 no one can ever know what you are capable of, not even you.",
    author: "Seneca",
    source: "On Providence",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "The three most important words in investing are margin of safety.",
    author: "Warren Buffett",
    source: "The Superinvestors of Graham-and-Doddsville",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },
  {
    text: "Man prefers to will nothingness than to not will.",
    author: "Friedrich Nietzsche",
    source: "On the Genealogy of Morals",
    category: 'trading',
    bias: "Decoy Effect",
    analysis: "The phenomenon where the introduction of a third, asymmetrically dominated option changes your preference between the original two. Marketers exploit this constantly \u2014 and the financial industry is no exception.",
  },

  // === Regret Aversion (7 quotes) ===
  {
    text: "Anxiety is the dizziness of freedom.",
    author: "S\u00F8ren Kierkegaard",
    source: "The Concept of Anxiety",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "In the end, we only regret the chances we didn\u2019t take.",
    author: "Lewis Carroll",
    source: "attributed",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "Twenty years from now you will be more disappointed by the things that you didn\u2019t do than by the ones you did do.",
    author: "Mark Twain",
    source: "attributed",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "There is nothing I regret so much as my good behavior. What demon possessed me that I behaved so well?",
    author: "Henry David Thoreau",
    source: "Walden",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "Our doubts are traitors, and make us lose the good we oft might win, by fearing to attempt.",
    author: "William Shakespeare",
    source: "Measure for Measure",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "You can\u2019t predict. You can prepare.",
    author: "Howard Marks",
    source: "The Most Important Thing",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },
  {
    text: "Use your time well. It is going faster than you think.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'risk',
    bias: "Regret Aversion",
    analysis: "The tendency to avoid making decisions because of the fear of regretting them later. This leads to inaction, which itself becomes the regrettable choice. The fear of future regret paralyzes present action.",
  },

  // === Home Bias (7 quotes) ===
  {
    text: "To a mind that is still, the whole universe surrenders.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    author: "Marcel Proust",
    source: "In Search of Lost Time",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "Diversification is protection against ignorance. It makes little sense if you know what you are doing.",
    author: "Warren Buffett",
    source: "Berkshire Hathaway Shareholder Letter",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "A prophet is not without honor, save in his own country, and in his own house.",
    author: "Jesus Christ",
    source: "Matthew 13:57",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "I am a citizen of the world.",
    author: "Diogenes",
    source: "attributed (via Diogenes Laertius)",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "This above all: to thine own self be true.",
    author: "William Shakespeare",
    source: "Hamlet",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },
  {
    text: "The familiar breeds contempt \u2014 and comfort. Both are enemies of the investor.",
    author: "Jason Zweig",
    source: "The Devil's Financial Dictionary",
    category: 'trading',
    bias: "Home Bias",
    analysis: "The tendency to invest disproportionately in domestic or familiar markets, companies, and assets. Investors typically hold 70-80% domestic stocks even though their country may represent only a fraction of global market capitalization. Familiarity breeds false confidence.",
  },

  // === Illusion of Control (7 quotes) ===
  {
    text: "It\u2019s not what happens to you, but how you react to it that matters.",
    author: "Epictetus",
    source: "Enchiridion",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "God, grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference.",
    author: "Reinhold Niebuhr",
    source: "Serenity Prayer",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "The illusion of control is deeply embedded in the way people think about investing. We think we\u2019re driving, when actually we\u2019re passengers.",
    author: "Daniel Kahneman",
    source: "Thinking, Fast and Slow",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "As flies to wanton boys are we to the gods. They kill us for their sport.",
    author: "William Shakespeare",
    source: "King Lear",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "The desire to understand the world and the desire to control it are among the oldest human instincts.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "You get recessions, you have stock market declines. If you don\u2019t understand that\u2019s going to happen, then you\u2019re not ready, you won\u2019t do well in the markets.",
    author: "Peter Lynch",
    source: "Beating the Street",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },
  {
    text: "Wealth is largely the result of habit.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'trading',
    bias: "Illusion of Control",
    analysis: "The tendency to believe you have more influence over outcomes than you actually do. In investing, this manifests as excessive trading, over-monitoring, and the belief that your actions meaningfully affect stock prices or market outcomes.",
  },

  // === Outcome Bias (7 quotes) ===
  {
    text: "Good decisions are not always rewarded. Bad decisions are not always punished. But over time, good process wins.",
    author: "Morgan Housel",
    source: "The Psychology of Money",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "The quality of a decision cannot be determined by its outcome.",
    author: "Howard Marks",
    source: "The Most Important Thing",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "You can\u2019t judge a decision by its outcome. You can only judge it by the process that went into it.",
    author: "Annie Duke",
    source: "Thinking in Bets",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "Nothing succeeds like success \u2014 and nothing misleads like success.",
    author: "Jason Zweig",
    source: "Your Money and Your Brain",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "By their fruits ye shall know them \u2014 but only over long enough time horizons.",
    author: "Michel de Montaigne",
    source: "Essays",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "If we have our own why of life, we shall get along with almost any how.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
  {
    text: "The best thing a human being can do is to help another human being know more.",
    author: "Charlie Munger",
    source: "Poor Charlie's Almanack",
    category: 'trading',
    bias: "Outcome Bias",
    analysis: "The tendency to judge a decision by its outcome rather than by the quality of the decision-making process at the time it was made. A good process can produce a bad outcome, and a bad process can get lucky. Confusing the two guarantees repeated mistakes.",
  },
];

// Legacy exports for backward compatibility
// Course Goals quotes (subset of WISDOM_QUOTES)
export const COURSE_QUOTES: WisdomQuote[] = [
  WISDOM_QUOTES[0],   // Nietzsche - dancing
  WISDOM_QUOTES[3],   // Munger - compounding
  WISDOM_QUOTES[8],   // Montaigne - firmly believed
];

// Trading wisdom quotes (subset)
export const TRADING_QUOTES: WisdomQuote[] = WISDOM_QUOTES.filter(q => q.category === 'trading');

// Psychology quotes (subset)
export const PSYCHOLOGY_QUOTES: WisdomQuote[] = WISDOM_QUOTES.filter(q => q.category === 'psychology');

// Risk management quotes (subset)
export const RISK_QUOTES: WisdomQuote[] = WISDOM_QUOTES.filter(q => q.category === 'risk');

// Strategy-specific quotes (mapped by bias theme to strategy)
export const STRATEGY_QUOTES: Record<string, WisdomQuote[]> = {
  'long-call': WISDOM_QUOTES.filter(q => q.bias === 'FOMO'),
  'long-put': WISDOM_QUOTES.filter(q => q.bias === 'Loss Aversion'),
  'covered-call': WISDOM_QUOTES.filter(q => q.bias === 'Disposition Effect'),
  'iron-condor': WISDOM_QUOTES.filter(q => q.bias === 'Anchoring'),
  'long-straddle': WISDOM_QUOTES.filter(q => q.bias === 'Status Quo Bias'),
  'bull-call-spread': WISDOM_QUOTES.filter(q => q.bias === 'Confirmation Bias'),
  'bear-put-spread': WISDOM_QUOTES.filter(q => q.bias === 'Herd Mentality'),
  'iron-butterfly': WISDOM_QUOTES.filter(q => q.bias === 'Overconfidence'),
  'protective-put': WISDOM_QUOTES.filter(q => q.bias === 'Sunk Cost Fallacy'),
  'collar': WISDOM_QUOTES.filter(q => q.bias === 'Endowment Effect'),
  'straddle': WISDOM_QUOTES.filter(q => q.bias === 'Recency Bias'),
  'strangle': WISDOM_QUOTES.filter(q => q.bias === 'Gambler\'s Fallacy'),
  'calendar-spread': WISDOM_QUOTES.filter(q => q.bias === 'Hindsight Bias'),
  'diagonal-spread': WISDOM_QUOTES.filter(q => q.bias === 'Narrative Fallacy'),
};

// Get a random quote from a category
export const getRandomQuote = (category?: WisdomQuote['category']): WisdomQuote => {
  const filtered = category ? WISDOM_QUOTES.filter(q => q.category === category) : WISDOM_QUOTES;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// Get a random quote by bias
export const getRandomQuoteByBias = (bias: string): WisdomQuote => {
  const filtered = WISDOM_QUOTES.filter(q => q.bias === bias);
  if (filtered.length === 0) return WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// Get quotes for a specific strategy
export const getQuotesForStrategy = (strategyId: string): WisdomQuote[] => {
  return STRATEGY_QUOTES[strategyId] || [];
};

// Get all course opening quotes
export const getCourseQuotes = (): WisdomQuote[] => {
  return COURSE_QUOTES;
};

// Get all unique biases
export const getAllBiases = (): string[] => {
  return [...new Set(WISDOM_QUOTES.map(q => q.bias).filter(Boolean))] as string[];
};

// Get quotes grouped by bias
export const getQuotesByBias = (): Record<string, WisdomQuote[]> => {
  const grouped: Record<string, WisdomQuote[]> = {};
  for (const quote of WISDOM_QUOTES) {
    if (quote.bias) {
      if (!grouped[quote.bias]) grouped[quote.bias] = [];
      grouped[quote.bias].push(quote);
    }
  }
  return grouped;
};
