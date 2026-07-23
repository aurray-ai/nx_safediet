export type PlannedMeal = { name: string; kcal: number };
export type DayPlan = { day: string; breakfast: PlannedMeal; lunch: PlannedMeal; dinner: PlannedMeal };

export const weekPlan: DayPlan[] = [
  {
    day: "Mon",
    breakfast: { name: "Greek Yogurt Parfait", kcal: 350 },
    lunch: { name: "Lunch Chicken Bowl", kcal: 660 },
    dinner: { name: "Dinner with Quinoa", kcal: 650 },
  },
  {
    day: "Tue",
    breakfast: { name: "Oatmeal with Berries", kcal: 320 },
    lunch: { name: "Jollof Rice with Chicken", kcal: 700 },
    dinner: { name: "Veg Stir Fry with Tofu", kcal: 580 },
  },
  {
    day: "Wed",
    breakfast: { name: "Avocado Toast", kcal: 380 },
    lunch: { name: "Lentil Soup & Bread", kcal: 520 },
    dinner: { name: "Grilled Fish & Veggies", kcal: 600 },
  },
  {
    day: "Thu",
    breakfast: { name: "Smoothie Bowl", kcal: 330 },
    lunch: { name: "Pasta Primavera", kcal: 600 },
    dinner: { name: "Chicken Suya Bowl", kcal: 650 },
  },
  {
    day: "Fri",
    breakfast: { name: "Boiled Eggs & Toast", kcal: 310 },
    lunch: { name: "Quinoa Salad Bowl", kcal: 560 },
    dinner: { name: "Turkey Meatballs & Veg", kcal: 580 },
  },
  {
    day: "Sat",
    breakfast: { name: "Pancakes & Fruits", kcal: 420 },
    lunch: { name: "Banga Soup & Fufu", kcal: 660 },
    dinner: { name: "Jollof Rice & Plantain", kcal: 700 },
  },
  {
    day: "Sun",
    breakfast: { name: "Fruit Salad & Yogurt", kcal: 300 },
    lunch: { name: "Grilled Fish Bowl", kcal: 620 },
    dinner: { name: "Veggie Fried Rice", kcal: 550 },
  },
];

export type FeaturedMeal = {
  tag: string;
  name: string;
  kcal: number;
  protein: number;
  minutes: number;
  price: string;
};

export const featuredMeals: FeaturedMeal[] = [
  { tag: "High Protein", name: "Grilled Chicken Bowl with Avocado", kcal: 650, protein: 35, minutes: 25, price: "£2.80" },
  { tag: "Budget Friendly", name: "Jollof Rice with Chicken", kcal: 700, protein: 28, minutes: 40, price: "£1.90" },
  { tag: "Quick & Easy", name: "Salmon with Quinoa & Steamed Veggies", kcal: 650, protein: 40, minutes: 25, price: "£3.20" },
  { tag: "Plant Based", name: "Lentil & Sweet Potato Curry", kcal: 560, protein: 22, minutes: 35, price: "£1.70" },
  { tag: "Low Carb", name: "Zucchini Noodles with Pesto Chicken", kcal: 530, protein: 38, minutes: 20, price: "£2.60" },
];
