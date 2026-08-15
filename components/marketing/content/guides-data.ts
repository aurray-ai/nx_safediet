export type GuideSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type Guide = {
  slug: string;
  pillarSlug: "ai-meal-planning" | "grocery-delivery" | "kitchen-pantry-tracker" | "split-grocery-bills";
  tag: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  readingTime: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "split-grocery-bills-with-roommates",
    pillarSlug: "split-grocery-bills",
    tag: "Split",
    title: "How to Split Grocery Bills Fairly With Roommates",
    excerpt:
      "Uneven shops, forgotten IOUs and awkward reminders — here's how to actually split a household's food costs without it becoming a source of tension.",
    metaDescription:
      "A practical guide to splitting grocery bills fairly with roommates or flatmates — what actually works, and where spreadsheets and IOUs tend to fall apart.",
    publishedAt: "2026-02-03",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Why grocery bills are harder to split than rent",
        paragraphs: [
          "Rent is one number, split one way, once a month. Groceries aren't like that — one person does a big shop on Monday, someone else grabs milk on Wednesday, and by the weekend nobody can quite remember who paid for what. That's usually why grocery-splitting arrangements between roommates quietly fall apart, even when everyone means well.",
          "The problem isn't usually fairness in principle — it's that tracking it by memory or a shared notes app doesn't hold up once a household has more than two people or more than a couple of weeks of history.",
        ],
      },
      {
        heading: "The three approaches most households try first",
        paragraphs: [
          "Before settling on something that works, most households cycle through a few options:",
        ],
        list: [
          "One person pays for everything and gets reimbursed — works until that person is fronting hundreds of pounds and chasing people for their share.",
          "Everyone buys their own food separately — avoids the splitting problem entirely, but makes shared meals and bulk buying nearly impossible.",
          "A shared spreadsheet or notes app — better than nothing, but relies on everyone remembering to log every purchase, and it rarely survives more than a few weeks.",
        ],
      },
      {
        heading: "What actually works: one pooled budget, tracked automatically",
        paragraphs: [
          "The households that stick with a system long-term tend to have one thing in common: contributions and spending are tracked automatically, in one place, rather than relying on someone remembering to update a shared document.",
          "That usually means a single shared grocery budget that everyone contributes to, with purchases logged against it as they happen rather than reconstructed later. It removes the two things that cause most of the friction — someone forgetting to log a purchase, and someone having to manually calculate who owes what at the end of the month.",
        ],
      },
      {
        heading: "Equal split vs. weighted split",
        paragraphs: [
          "An equal split works well when everyone eats roughly the same amount and shops together. It breaks down when one person eats out most nights, has different dietary needs, or is away for stretches of the month.",
          "A weighted split — where contributions are proportional to something like how many shared meals someone actually eats — is worth considering for households where consumption genuinely isn't even. The important thing is agreeing on the method upfront, not renegotiating it every time someone feels shortchanged.",
        ],
      },
      {
        heading: "How SafeDiet handles this",
        paragraphs: [
          "SafeDiet's shared budgeting feature is built around this exact problem: one pooled weekly or monthly budget that every household member contributes to, with spending tracked in real time and a running balance showing who owes what — no spreadsheet required. It's free for every member of a household, whether or not they're subscribed to SafeDiet Plus.",
        ],
      },
    ],
  },
  {
    slug: "meal-planning-on-a-student-budget",
    pillarSlug: "ai-meal-planning",
    tag: "Plan",
    title: "How to Meal Plan on a Student Budget in the UK",
    excerpt:
      "Cheap doesn't have to mean boring or unhealthy. A realistic approach to planning a week of meals as a student without blowing your loan on takeaways.",
    metaDescription:
      "A realistic guide to meal planning on a student budget in the UK — how to plan a full week of meals without overspending or eating the same thing every day.",
    publishedAt: "2026-01-19",
    readingTime: "5 min read",
    sections: [
      {
        heading: "The real problem isn't cooking — it's planning ahead",
        paragraphs: [
          "Most students already know how to cook a handful of meals. The reason budgets slip isn't a lack of ability, it's a lack of planning — nothing in the fridge on a Tuesday night means a takeaway, and one takeaway a week adds up to a meaningful chunk of a student loan by the end of term.",
          "A weekly meal plan, decided before you shop, is the single biggest lever for keeping food spending predictable — because it turns 'what do I feel like eating' into 'what did I already decide to eat,' which removes most of the decisions that lead to overspending.",
        ],
      },
      {
        heading: "Set a weekly number before you plan anything",
        paragraphs: [
          "Pick a realistic weekly food budget first, based on what you can actually afford, not what a meal-prep influencer says is possible. Everything else — what meals go on the plan, what you buy — should work backwards from that number, not the other way around.",
        ],
      },
      {
        heading: "Build meals around a handful of cheap, flexible staples",
        paragraphs: [
          "A small set of ingredients that show up across multiple meals keeps costs down and reduces waste, because you're not buying a specialty item for one recipe that then sits unused.",
        ],
        list: [
          "Rice, pasta and oats as flexible bases that work across breakfast, lunch and dinner",
          "Tinned beans, lentils and chickpeas — cheap protein that doesn't spoil",
          "Frozen vegetables — often cheaper than fresh and with a much longer usable window",
          "Eggs — one of the cheapest protein sources per meal, and useful in almost anything",
        ],
      },
      {
        heading: "Plan meals, then shop — not the other way around",
        paragraphs: [
          "Shopping without a plan tends to mean buying whatever looks good in the moment, which is exactly how a food budget drifts. Deciding the week's meals first, then shopping for just what those meals need, keeps the trolley aligned with the budget you actually set.",
        ],
      },
      {
        heading: "Where AI planning actually helps",
        paragraphs: [
          "This is the part that's genuinely tedious to do manually every week — balancing a budget, a few dietary needs, and not eating the same three meals on repeat. SafeDiet's AI meal planner takes a weekly budget and any dietary requirements and builds a full week of breakfast, lunch and dinner around it automatically, with any meal swappable if it's not what you're in the mood for. It's free to start, with no credit card required.",
        ],
      },
    ],
  },
  {
    slug: "buying-groceries-direct-from-wholesalers",
    pillarSlug: "grocery-delivery",
    tag: "Source",
    title: "Buying Groceries Direct From Wholesalers: How It Actually Works",
    excerpt:
      "\"Cut out the middleman\" gets thrown around a lot — here's what actually happens between a farm and your kitchen, and why it changes the price.",
    metaDescription:
      "How buying groceries direct from farms, manufacturers and wholesalers actually works, and why it typically costs less than a standard supermarket shop.",
    publishedAt: "2026-01-08",
    readingTime: "5 min read",
    sections: [
      {
        heading: "What a supermarket price actually includes",
        paragraphs: [
          "When you buy a bag of rice or a box of tomatoes at a supermarket, the price isn't just the cost of the item — it includes the retailer's own margin, the cost of running physical stores, and everything in between the original source and the shelf.",
          "None of that is unreasonable — retail is a real business with real costs — but it does mean the price on the shelf is higher than what the retailer itself paid further up the chain.",
        ],
      },
      {
        heading: "What 'direct' actually means",
        paragraphs: [
          "Buying direct means going to the same tier of the supply chain a retailer would normally buy from, instead of buying from the retailer itself.",
        ],
        list: [
          "Produce and dairy sourced directly from farms",
          "Packaged staples sourced directly from manufacturers",
          "Bulk items sourced directly from wholesalers",
        ],
      },
      {
        heading: "Why this usually costs less, not more",
        paragraphs: [
          "It's a common assumption that skipping a store means less convenience for a small saving. In practice, because the retail markup is removed entirely rather than negotiated down, the savings are usually more significant than people expect — commonly in the 20–30% range compared to standard retail pricing for the same items.",
        ],
      },
      {
        heading: "Does buying direct mean less choice or lower quality?",
        paragraphs: [
          "Not inherently — a farm-direct tomato is the same tomato a supermarket would otherwise buy and mark up. The tradeoff is usually about convenience and range rather than quality: a direct-sourcing model works best when it's paired with a plan (so orders are for specific items needed, not a full browse-everything supermarket aisle experience).",
        ],
      },
      {
        heading: "How SafeDiet applies this",
        paragraphs: [
          "SafeDiet buys groceries this way by design — produce and dairy farm-direct, pantry staples manufacturer-direct, bulk items wholesaler-direct — and matches what's ordered to your actual weekly meal plan, so there's no need to browse a full catalogue to find what you need. Everything is delivered straight to your door.",
        ],
      },
    ],
  },
  {
    slug: "reduce-food-waste-with-a-tracked-pantry",
    pillarSlug: "kitchen-pantry-tracker",
    tag: "Stock",
    title: "5 Ways to Reduce Food Waste With a Tracked Pantry",
    excerpt:
      "Most food waste isn't one big mistake — it's a slow drift of small ones. Here's how knowing what's actually in your kitchen fixes most of it.",
    metaDescription:
      "Five practical ways tracking your kitchen and pantry reduces food waste, from avoiding duplicate purchases to knowing what's about to go unused.",
    publishedAt: "2025-12-14",
    readingTime: "4 min read",
    sections: [
      {
        heading: "1. You stop buying things you already have",
        paragraphs: [
          "The single most common cause of food waste isn't spoilage — it's duplication. Without a clear view of what's already in the cupboard, it's easy to buy a second jar of something that's already half-used at the back of a shelf.",
        ],
      },
      {
        heading: "2. Ingredients earmarked for a meal don't get used for something else",
        paragraphs: [
          "When groceries are bought against a specific meal plan, it's easy to accidentally use an ingredient meant for Thursday's dinner earlier in the week — and then find yourself short later. Tracking what's reserved for an upcoming meal, separately from general stock, avoids that.",
        ],
      },
      {
        heading: "3. You notice what's running low before it becomes an emergency",
        paragraphs: [
          "A pantry that's tracked shows what's genuinely running low, rather than relying on a last-minute check of the fridge before deciding what to order. That turns restocking into a planned, deliberate decision instead of a reactive one.",
        ],
      },
      {
        heading: "4. Deliveries get used, not forgotten",
        paragraphs: [
          "A grocery delivery that isn't logged anywhere is easy to partially forget about — items get pushed to the back of a cupboard and rediscovered past their best. Importing a delivery straight into a tracked inventory means everything that arrives is accounted for from day one.",
        ],
      },
      {
        heading: "5. You can actually see the pattern over time",
        paragraphs: [
          "A one-off effort to 'use up the fridge' helps for a week. A tracked pantry shows the pattern — which items consistently go unused — so the underlying buying habit can actually change, not just the symptom.",
        ],
      },
      {
        heading: "How SafeDiet handles this",
        paragraphs: [
          "SafeDiet's kitchen tracker automatically imports delivered orders into your inventory, tracks what's reserved for upcoming meals versus what's general stock, and gives a clear view of what's on hand — so less ends up forgotten, duplicated, or wasted.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
