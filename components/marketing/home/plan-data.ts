export type PlannedMeal = { name: string; kcal: number; image: string };
export type DayPlan = { day: string; breakfast: PlannedMeal; lunch: PlannedMeal; dinner: PlannedMeal };

function mealImage(filename: string): string {
  return `/meals/${encodeURIComponent(filename)}`;
}

export const weekPlan: DayPlan[] = [
  {
    day: "Mon",
    breakfast: { name: "Greek Yogurt Parfait", kcal: 350, image: mealImage("Greek Yogurt Parfait.png") },
    lunch: { name: "Lunch Chicken Bowl", kcal: 660, image: mealImage("Chicken Bowl.png") },
    dinner: { name: "Dinner with Quinoa", kcal: 650, image: mealImage("Dinner with Quinoa.png") },
  },
  {
    day: "Tue",
    breakfast: { name: "Oatmeal with Berries", kcal: 320, image: mealImage("Oatmeal with Berries.png") },
    lunch: { name: "Jollof Rice with Chicken", kcal: 700, image: mealImage("Jollof Rice with Chicken.png") },
    dinner: { name: "Veg Stir Fry with Tofu", kcal: 580, image: mealImage("Veg Stir Fry with Tofu.png") },
  },
  {
    day: "Wed",
    breakfast: { name: "Avocado Toast", kcal: 380, image: mealImage("Avocado Toast.png") },
    lunch: { name: "Lentil Soup & Bread", kcal: 520, image: mealImage("Lentil Soup & Bread.png") },
    dinner: { name: "Grilled Fish & Veggies", kcal: 600, image: mealImage("Grilled Fish & Veggies.png") },
  },
  {
    day: "Thu",
    breakfast: { name: "Smoothie Bowl", kcal: 330, image: mealImage("Smoothie Bowl.png") },
    lunch: { name: "Pasta Primavera", kcal: 600, image: mealImage("Pasta Primavera.png") },
    dinner: { name: "Chicken Suya Bowl", kcal: 650, image: mealImage("Chicken Suya Bowl.png") },
  },
  {
    day: "Fri",
    breakfast: { name: "Boiled Eggs & Toast", kcal: 310, image: mealImage("Boiled Eggs & Toast.png") },
    lunch: { name: "Quinoa Salad Bowl", kcal: 560, image: mealImage("Quinoa Salad Bowl.png") },
    dinner: { name: "Turkey Meatballs & Veg", kcal: 580, image: mealImage("Turkey Meatballs & Veg.png") },
  },
  {
    day: "Sat",
    breakfast: { name: "Pancakes & Fruits", kcal: 420, image: mealImage("Pancakes & Fruits.png") },
    lunch: { name: "Banga Soup & Fufu", kcal: 660, image: mealImage("Banga Soup & Fufu.png") },
    dinner: { name: "Jollof Rice & Plantain", kcal: 700, image: mealImage("Jollof Rice & Plantain.png") },
  },
  {
    day: "Sun",
    breakfast: { name: "Fruit Salad & Yogurt", kcal: 300, image: mealImage("Fruit Salad & Yogurt.png") },
    lunch: { name: "Grilled Fish Bowl", kcal: 620, image: mealImage("Grilled Fish Bowl.png") },
    dinner: { name: "Veggie Fried Rice", kcal: 550, image: mealImage("Veggie Fried Rice.png") },
  },
];

export type FeaturedMeal = {
  tag: string;
  name: string;
  kcal: number;
  protein: number;
  minutes: number;
  price: string;
  image?: string;
};

export const featuredMeals: FeaturedMeal[] = [
  {
    tag: "High Protein",
    name: "Grilled Chicken Bowl with Avocado",
    kcal: 650,
    protein: 35,
    minutes: 25,
    price: "£2.80",
    image: mealImage("Grilled Chicken Bowl with Avocado.png"),
  },
  {
    tag: "Budget Friendly",
    name: "Jollof Rice with Chicken",
    kcal: 700,
    protein: 28,
    minutes: 40,
    price: "£1.90",
    image: mealImage("Jollof Rice with Chicken.png"),
  },
  {
    tag: "Quick & Easy",
    name: "Salmon with Quinoa & Steamed Veggies",
    kcal: 650,
    protein: 40,
    minutes: 25,
    price: "£3.20",
    image: mealImage("Salmon with Quinoa & Steamed Veggies.png"),
  },
  {
    tag: "Plant Based",
    name: "Lentil & Sweet Potato Curry",
    kcal: 560,
    protein: 22,
    minutes: 35,
    price: "£1.70",
    image: mealImage("Lentil & Sweet Potato Curry.png"),
  },
  {
    tag: "Low Carb",
    name: "Zucchini Noodles with Pesto Chicken",
    kcal: 530,
    protein: 38,
    minutes: 20,
    price: "£2.60",
    image: mealImage("Zucchini Noodles with Pesto Chicken.png"),
  },
];

export type CatalogMeal = { name: string; kcal: number; image: string; mealType: string; price?: string };

export const catalogMeals: CatalogMeal[] = (() => {
  const byName = new Map<string, CatalogMeal>();

  weekPlan.forEach((day) => {
    (
      [
        ["Breakfast", day.breakfast],
        ["Lunch", day.lunch],
        ["Dinner", day.dinner],
      ] as const
    ).forEach(([mealType, meal]) => {
      if (!byName.has(meal.name)) {
        byName.set(meal.name, { name: meal.name, kcal: meal.kcal, image: meal.image, mealType });
      }
    });
  });

  featuredMeals.forEach((meal) => {
    byName.set(meal.name, {
      name: meal.name,
      kcal: meal.kcal,
      image: meal.image ?? mealImage(`${meal.name}.png`),
      mealType: "Featured",
      price: meal.price,
    });
  });

  return Array.from(byName.values());
})();

export type HouseholdMember = { name: string; initials: string; color: string };

export const householdMembers: HouseholdMember[] = [
  { name: "Emmanuel", initials: "E", color: "#3E6B52" },
  { name: "Sarah", initials: "S", color: "#B3624A" },
  { name: "Alex", initials: "A", color: "#8C5B6B" },
  { name: "Chidi", initials: "C", color: "#D9A43D" },
];

export type Contribution = {
  member: HouseholdMember;
  category: string;
  timestamp: string;
  amount: string;
  status: "Paid";
};

export const recentContributions: Contribution[] = [
  { member: householdMembers[0], category: "Groceries", timestamp: "May 21, 11:24 AM", amount: "£41.20", status: "Paid" },
  { member: householdMembers[1], category: "Vegetables", timestamp: "May 21, 9:16 AM", amount: "£35.80", status: "Paid" },
  { member: householdMembers[2], category: "Protein", timestamp: "May 20, 6:45 PM", amount: "£69.00", status: "Paid" },
];
