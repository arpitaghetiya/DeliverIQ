// DeliverIQ – Sample restaurant and menu data
// Note: These are realistic demo listings, not real restaurant availability.

export const CATEGORIES = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "biryani", label: "Biryani", emoji: "🍛" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burger", label: "Burger", emoji: "🍔" },
  { id: "south-indian", label: "South Indian", emoji: "🥘" },
  { id: "chinese", label: "Chinese", emoji: "🍜" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "healthy", label: "Healthy", emoji: "🥗" },
];

export const RESTAURANTS = [
  {
    id: 1,
    name: "Spice Garden",
    tagline: "Authentic North Indian flavours",
    cuisine: ["North Indian", "Biryani", "Mughlai"],
    categories: ["biryani"],
    rating: 4.5,
    reviews: 2340,
    deliveryTime: "25-35 min",
    deliveryFee: 29,
    minOrder: 149,
    priceForOne: 350,
    offer: "50% OFF up to ₹100",
    couponCode: "SPICE50",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    bgColor: "#fff0dc",
    distance: 2.4,
    menu: [
      {
        category: "Biryani",
        items: [
          { id: 101, name: "Chicken Dum Biryani", description: "Slow-cooked basmati rice with tender chicken, aromatic spices and saffron", price: 299, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
          { id: 102, name: "Veg Dum Biryani", description: "Fragrant basmati with seasonal vegetables and whole spices", price: 229, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80" },
          { id: 103, name: "Mutton Biryani", description: "Tender mutton pieces layered with long-grain rice and caramelised onions", price: 349, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
        ],
      },
      {
        category: "Main Course",
        items: [
          { id: 104, name: "Butter Chicken", description: "Creamy tomato-based curry with succulent chicken tikka", price: 269, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { id: 105, name: "Dal Makhani", description: "Slow-cooked black lentils in rich buttery gravy", price: 199, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
          { id: 106, name: "Paneer Tikka Masala", description: "Smoky paneer cubes in spiced onion-tomato gravy", price: 249, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        ],
      },
      {
        category: "Breads & Sides",
        items: [
          { id: 107, name: "Butter Naan (2 pcs)", description: "Soft leavened flatbread fresh from the tandoor", price: 59, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80" },
          { id: 108, name: "Raita", description: "Chilled yoghurt with cucumber and roasted cumin", price: 49, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Pizza Studio",
    tagline: "Hand-tossed, wood-fired perfection",
    cuisine: ["Pizza", "Italian", "Pasta"],
    categories: ["pizza"],
    rating: 4.3,
    reviews: 1870,
    deliveryTime: "30-40 min",
    deliveryFee: 39,
    minOrder: 199,
    priceForOne: 400,
    offer: "Buy 1 Get 1 Free",
    couponCode: "PIZZA2X",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    bgColor: "#ffe8dc",
    distance: 3.1,
    menu: [
      {
        category: "Classic Pizzas",
        items: [
          { id: 201, name: "Margherita", description: "San Marzano tomato, fresh mozzarella, basil — a timeless classic", price: 249, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
          { id: 202, name: "BBQ Chicken", description: "Smoky BBQ sauce, grilled chicken, red onion, jalapeños", price: 329, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
          { id: 203, name: "Veggie Supreme", description: "Bell peppers, olives, mushrooms, sun-dried tomato, pesto base", price: 289, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80" },
          { id: 204, name: "Pepperoni Blast", description: "Double pepperoni, mozzarella, spicy tomato sauce", price: 349, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" },
        ],
      },
      {
        category: "Pasta",
        items: [
          { id: 205, name: "Penne Arrabbiata", description: "Spicy tomato and garlic sauce, fresh herbs", price: 199, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80" },
          { id: 206, name: "Chicken Alfredo", description: "Creamy parmesan sauce with grilled chicken and fettuccine", price: 269, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80" },
        ],
      },
      {
        category: "Sides & Drinks",
        items: [
          { id: 207, name: "Garlic Bread (4 pcs)", description: "Toasted with herb butter and parmesan", price: 99, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80" },
          { id: 208, name: "Cold Coffee", description: "Chilled espresso blended with milk and ice cream", price: 89, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Burger House",
    tagline: "Juicy, stacked, legendary burgers",
    cuisine: ["Burgers", "Fast Food", "Wraps"],
    categories: ["burger"],
    rating: 4.2,
    reviews: 1540,
    deliveryTime: "20-30 min",
    deliveryFee: 19,
    minOrder: 99,
    priceForOne: 250,
    offer: "30% OFF on orders above ₹299",
    couponCode: "BURGER30",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    bgColor: "#fff1c9",
    distance: 1.8,
    menu: [
      {
        category: "Signature Burgers",
        items: [
          { id: 301, name: "Classic Smash Burger", description: "Double smashed patty, American cheese, pickles, special sauce, brioche bun", price: 219, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
          { id: 302, name: "Crispy Chicken Burger", description: "Buttermilk fried chicken, coleslaw, sriracha mayo", price: 199, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80" },
          { id: 303, name: "Mushroom Swiss Burger", description: "Beef patty, sautéed mushrooms, Swiss cheese, garlic aioli", price: 249, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
          { id: 304, name: "Veg Peri Peri Burger", description: "Crispy veggie patty, peri peri sauce, lettuce, tomato", price: 169, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&q=80" },
        ],
      },
      {
        category: "Sides",
        items: [
          { id: 305, name: "Loaded Fries", description: "Seasoned fries topped with cheese sauce and jalapeños", price: 129, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
          { id: 306, name: "Onion Rings", description: "Golden beer-battered onion rings with dipping sauce", price: 99, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80" },
        ],
      },
      {
        category: "Shakes",
        items: [
          { id: 307, name: "Chocolate Shake", description: "Thick and creamy chocolate milkshake", price: 109, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "South Express",
    tagline: "Authentic south Indian home-style cooking",
    cuisine: ["South Indian", "Dosa", "Idli"],
    categories: ["south-indian"],
    rating: 4.6,
    reviews: 3120,
    deliveryTime: "20-30 min",
    deliveryFee: 15,
    minOrder: 99,
    priceForOne: 180,
    offer: "FLAT ₹100 OFF on first order",
    couponCode: "SOUTH100",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
    bgColor: "#e8f3dd",
    distance: 2.2,
    menu: [
      {
        category: "Dosas",
        items: [
          { id: 401, name: "Masala Dosa", description: "Crisp rice crepe filled with spiced potato masala, served with sambhar & chutneys", price: 129, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80" },
          { id: 402, name: "Ghee Roast Dosa", description: "Golden, lacy dosa roasted in pure ghee", price: 149, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=80" },
          { id: 403, name: "Egg Dosa", description: "Thin dosa topped with spiced scrambled egg", price: 159, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?w=400&q=80" },
        ],
      },
      {
        category: "Idli & Vada",
        items: [
          { id: 404, name: "Idli (3 pcs)", description: "Steamed rice cakes with sambhar and coconut chutney", price: 89, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80" },
          { id: 405, name: "Medu Vada (2 pcs)", description: "Crispy lentil doughnuts with sambhar and chutney", price: 79, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1610461888750-10bfc601b4a6?w=400&q=80" },
        ],
      },
      {
        category: "Rice & Meals",
        items: [
          { id: 406, name: "South Indian Thali", description: "Complete meal: rice, rasam, sambar, 2 curries, papad, dessert", price: 229, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80" },
          { id: 407, name: "Lemon Rice", description: "Tangy rice tempered with mustard seeds, curry leaves and peanuts", price: 99, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Dragon Palace",
    tagline: "Pan-Asian flavours, every wok-tossed bite",
    cuisine: ["Chinese", "Thai", "Asian"],
    categories: ["chinese"],
    rating: 4.1,
    reviews: 980,
    deliveryTime: "35-45 min",
    deliveryFee: 49,
    minOrder: 199,
    priceForOne: 320,
    offer: "20% OFF",
    couponCode: "DRAGON20",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
    bgColor: "#fce4e4",
    distance: 4.5,
    menu: [
      {
        category: "Starters",
        items: [
          { id: 501, name: "Veg Spring Rolls (6 pcs)", description: "Golden crispy rolls stuffed with cabbage and glass noodles", price: 149, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1548504769-900b70ed122e?w=400&q=80" },
          { id: 502, name: "Chicken Manchurian", description: "Crispy chicken balls tossed in spicy Manchurian sauce", price: 219, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1626508035297-0045dad00e73?w=400&q=80" },
          { id: 503, name: "Prawn Toast", description: "Prawn paste on toasted bread, sesame seeds, sweet chilli dip", price: 249, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80" },
        ],
      },
      {
        category: "Noodles & Rice",
        items: [
          { id: 504, name: "Veg Hakka Noodles", description: "Stir-fried noodles with vegetables, soy and sesame oil", price: 179, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80" },
          { id: 505, name: "Chicken Fried Rice", description: "Wok-tossed rice with egg, chicken, spring onion and soy", price: 199, isVeg: false, isBestseller: true, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80" },
          { id: 506, name: "Schezwan Fried Rice", description: "Fiery Schezwan sauce with scrambled egg and mixed veg", price: 189, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Sweet Bliss Bakery",
    tagline: "Handcrafted desserts that make life sweeter",
    cuisine: ["Desserts", "Bakery", "Ice Cream"],
    categories: ["desserts"],
    rating: 4.7,
    reviews: 2650,
    deliveryTime: "25-35 min",
    deliveryFee: 25,
    minOrder: 149,
    priceForOne: 200,
    offer: "15% OFF on dessert combos",
    couponCode: "SWEET15",
    isVeg: true,
    isPureVeg: true,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
    bgColor: "#fce4f9",
    distance: 1.5,
    menu: [
      {
        category: "Cakes",
        items: [
          { id: 601, name: "Chocolate Truffle Cake (slice)", description: "Rich dark chocolate sponge with truffle ganache and cocoa dusting", price: 149, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
          { id: 602, name: "Red Velvet Cake (slice)", description: "Classic red velvet with velvety cream cheese frosting", price: 139, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&q=80" },
          { id: 603, name: "Blueberry Cheesecake", description: "New York-style baked cheesecake with blueberry compote", price: 179, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80" },
        ],
      },
      {
        category: "Ice Cream",
        items: [
          { id: 604, name: "Belgian Waffle Sundae", description: "Crispy waffle, 2 scoops vanilla, chocolate drizzle, whipped cream", price: 189, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80" },
          { id: 605, name: "Brownie à la Mode", description: "Warm fudge brownie with vanilla ice cream", price: 159, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
        ],
      },
      {
        category: "Beverages",
        items: [
          { id: 606, name: "Mango Smoothie", description: "Fresh Alphonso mango blended with yoghurt and honey", price: 99, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Green Bowl",
    tagline: "Feel-good food, plant-powered goodness",
    cuisine: ["Healthy", "Salads", "Wraps", "Bowls"],
    categories: ["healthy"],
    rating: 4.4,
    reviews: 760,
    deliveryTime: "20-30 min",
    deliveryFee: 29,
    minOrder: 149,
    priceForOne: 300,
    offer: "Free delivery on orders above ₹299",
    couponCode: "GREENFREE",
    isVeg: true,
    isPureVeg: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    bgColor: "#e3f8e5",
    distance: 2.9,
    menu: [
      {
        category: "Bowls",
        items: [
          { id: 701, name: "Buddha Bowl", description: "Quinoa, roasted chickpeas, avocado, mixed greens, tahini dressing", price: 299, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { id: 702, name: "Poke Bowl", description: "Cauliflower rice, edamame, cucumber, pickled ginger, ponzu dressing", price: 329, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
        ],
      },
      {
        category: "Salads",
        items: [
          { id: 703, name: "Greek Salad", description: "Tomato, cucumber, kalamata olives, feta, oregano, olive oil", price: 199, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },
          { id: 704, name: "Caesar Salad", description: "Romaine, house-made caesar dressing, croutons, parmesan", price: 219, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80" },
        ],
      },
      {
        category: "Wraps & Sandwiches",
        items: [
          { id: 705, name: "Hummus Wrap", description: "Whole wheat wrap, hummus, roasted pepper, rocket, feta", price: 229, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80" },
          { id: 706, name: "Avocado Toast", description: "Sourdough, smashed avocado, cherry tomatoes, everything bagel spice", price: 189, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80" },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Chai & Bytes Café",
    tagline: "Desi chai, comfort snacks, great vibes",
    cuisine: ["Snacks", "Cafe", "North Indian", "Beverages"],
    categories: ["south-indian", "healthy"],
    rating: 4.3,
    reviews: 1230,
    deliveryTime: "15-25 min",
    deliveryFee: 15,
    minOrder: 79,
    priceForOne: 150,
    offer: "10% OFF on all orders",
    couponCode: "CHAI10",
    isVeg: false,
    isPureVeg: false,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    bgColor: "#fff9e6",
    distance: 0.9,
    menu: [
      {
        category: "Chai & Coffee",
        items: [
          { id: 801, name: "Masala Chai (2 cups)", description: "Strong ginger-cardamom tea with full-cream milk", price: 59, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" },
          { id: 802, name: "Filter Coffee", description: "South Indian decoction with frothed milk", price: 49, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80" },
        ],
      },
      {
        category: "Snacks",
        items: [
          { id: 803, name: "Vada Pav", description: "Mumbai's favourite: spiced potato fritter in a pav bun with chutneys", price: 49, isVeg: true, isBestseller: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80" },
          { id: 804, name: "Samosa (2 pcs)", description: "Crispy pastry with spiced peas and potato filling", price: 39, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80" },
          { id: 805, name: "Egg Bhurji Pav", description: "Spiced scrambled eggs with buttered pav", price: 89, isVeg: false, isBestseller: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
          { id: 806, name: "Pav Bhaji", description: "Rich vegetable mash with butter-toasted pav", price: 109, isVeg: true, isBestseller: false, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80" },
        ],
      },
    ],
  },
];

export function getRestaurantById(id) {
  return RESTAURANTS.find((r) => r.id === parseInt(id));
}

export function searchRestaurants(query, categoryId) {
  let results = RESTAURANTS;
  if (categoryId && categoryId !== "all") {
    results = results.filter((r) => r.categories.includes(categoryId));
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        r.menu.some((section) =>
          section.items.some(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
          )
        )
    );
  }
  return results;
}

