export const defaultMenu = [
  // Starters
  { id: 1, name: 'Paneer Tikka', price: 249, category: 'Starters', description: 'Cottage cheese marinated in spiced yogurt, grilled to perfection', isVeg: true, available: true, isBestSeller: true },
  { id: 2, name: 'Chicken 65', price: 299, category: 'Starters', description: 'Crispy deep-fried chicken with curry leaves and red chillies', isVeg: false, available: true, isBestSeller: true },
  { id: 3, name: 'Veg Spring Rolls', price: 179, category: 'Starters', description: 'Crispy rolls stuffed with seasoned mixed vegetables', isVeg: true, available: true },
  { id: 4, name: 'Seekh Kebab', price: 349, category: 'Starters', description: 'Minced lamb kebabs with aromatic spices, grilled over charcoal', isVeg: false, available: true },

  // Mains
  { id: 5, name: 'Butter Chicken', price: 349, category: 'Mains', description: 'Tender chicken in a rich, creamy tomato-based sauce', isVeg: false, available: true, isBestSeller: true },
  { id: 6, name: 'Dal Makhani', price: 249, category: 'Mains', description: 'Slow-cooked black lentils with butter and cream', isVeg: true, available: true },
  { id: 7, name: 'Palak Paneer', price: 279, category: 'Mains', description: 'Fresh cottage cheese in a smooth spinach gravy', isVeg: true, available: true },
  { id: 8, name: 'Lamb Rogan Josh', price: 399, category: 'Mains', description: 'Aromatic Kashmiri lamb curry with whole spices', isVeg: false, available: true },
  { id: 9, name: 'Chana Masala', price: 229, category: 'Mains', description: 'Hearty chickpeas in a tangy, spiced tomato gravy', isVeg: true, available: true },
  { id: 10, name: 'Fish Curry', price: 379, category: 'Mains', description: 'Coastal-style fish in a coconut-based tangy curry', isVeg: false, available: true },

  // Breads
  { id: 11, name: 'Butter Naan', price: 49, category: 'Breads', description: 'Soft leavened bread baked in tandoor, topped with butter', isVeg: true, available: true },
  { id: 12, name: 'Garlic Naan', price: 59, category: 'Breads', description: 'Naan topped with fresh garlic and coriander', isVeg: true, available: true },
  { id: 13, name: 'Lachha Paratha', price: 55, category: 'Breads', description: 'Flaky whole wheat layered flatbread', isVeg: true, available: true },

  // Rice
  { id: 14, name: 'Chicken Biryani', price: 349, category: 'Rice', description: 'Aromatic basmati rice layered with spiced chicken', isVeg: false, available: true, isBestSeller: true },
  { id: 15, name: 'Veg Biryani', price: 279, category: 'Rice', description: 'Fragrant rice with fresh vegetables and whole spices', isVeg: true, available: true },
  { id: 16, name: 'Jeera Rice', price: 129, category: 'Rice', description: 'Basmati rice tempered with cumin seeds and ghee', isVeg: true, available: true },

  // Desserts
  { id: 17, name: 'Gulab Jamun', price: 99, category: 'Desserts', description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup', isVeg: true, available: true },
  { id: 18, name: 'Kulfi', price: 119, category: 'Desserts', description: 'Traditional Indian ice cream with pistachio and cardamom', isVeg: true, available: true },
  { id: 19, name: 'Rasgulla', price: 89, category: 'Desserts', description: 'Spongy cottage cheese balls in light sugar syrup', isVeg: true, available: true },

  // Drinks
  { id: 20, name: 'Mango Lassi', price: 99, category: 'Drinks', description: 'Chilled yogurt drink blended with fresh Alphonso mangoes', isVeg: true, available: true, isBestSeller: true },
  { id: 21, name: 'Masala Chai', price: 49, category: 'Drinks', description: 'Spiced Indian tea with ginger, cardamom and cinnamon', isVeg: true, available: true },
  { id: 22, name: 'Fresh Lime Soda', price: 69, category: 'Drinks', description: 'Sparkling water with fresh lime juice, sweet or salted', isVeg: true, available: true },
];

export const defaultMenuItems = defaultMenu

export const CATEGORIES = [
  'Starters',
  'Mains',
  'Breads',
  'Rice',
  'Desserts',
  'Drinks',
]