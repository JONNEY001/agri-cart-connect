// Product images imports - using available images from assets folder
import tomatoesImage from "@/assets/tomatoes.jpg";
import leafyGreensImage from "@/assets/leafy-greens.jpg";
import mixedFruitsImage from "@/assets/mixed-fruits.jpg";
import carrotsImage from "@/assets/products/organic-carrots.jpg";
import avocadosImage from "@/assets/products/premium-avocados.jpg";
import potatoesImage from "@/assets/products/fresh-potatoes.jpg";
import bananasImage from "@/assets/products/sweet-bananas.jpg";
import applesImage from "@/assets/mixed-fruits.jpg"; // Using mixed fruits as placeholder for apples
import riceImage from "@/assets/products/premium-rice.jpg";
import wheatImage from "@/assets/products/organic-wheat-flour.jpg";
import milkImage from "@/assets/products/fresh-milk.jpg";
import cheeseImage from "@/assets/products/artisan-cheese.jpg";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  farmer: string;
  description: string;
  features: string[];
  specifications: {
    weight: string;
    origin: string;
    harvestDate: string;
    shelfLife: string;
    storageTemp: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    image: tomatoesImage,
    price: 250,
    originalPrice: 300,
    rating: 4.8,
    reviews: 127,
    category: "vegetables",
    inStock: true,
    farmer: "John's Farm",
    description: "Premium quality organic tomatoes grown using sustainable farming practices. Rich in vitamins and perfect for cooking or eating fresh.",
    features: ["100% Organic", "No Pesticides", "Fresh Harvest", "Rich in Vitamins", "Farm to Table"],
    specifications: {
      weight: "1 kg",
      origin: "Nakuru, Kenya",
      harvestDate: "2024-01-15",
      shelfLife: "7-10 days",
      storageTemp: "10-15°C"
    }
  },
  {
    id: 2,
    name: "Leafy Green Vegetables",
    image: leafyGreensImage,
    price: 180,
    originalPrice: 220,
    rating: 4.9,
    reviews: 89,
    category: "vegetables",
    inStock: true,
    farmer: "Green Valley Farm",
    description: "Fresh mix of spinach, kale, and lettuce. Perfect for salads and healthy meals. Grown without chemicals.",
    features: ["Pesticide Free", "Rich in Iron", "Fresh Daily", "Mixed Variety", "Nutrient Dense"],
    specifications: {
      weight: "500g",
      origin: "Kiambu, Kenya",
      harvestDate: "2024-01-16",
      shelfLife: "5-7 days",
      storageTemp: "2-8°C"
    }
  },
  {
    id: 3,
    name: "Mixed Fresh Fruits",
    image: mixedFruitsImage,
    price: 450,
    originalPrice: 500,
    rating: 4.7,
    reviews: 203,
    category: "fruits",
    inStock: true,
    farmer: "Tropical Fruits Co.",
    description: "Assorted seasonal fruits including mangoes, oranges, and pineapples. Perfect for healthy snacking.",
    features: ["Seasonal Selection", "High in Vitamin C", "Natural Sweetness", "Fresh Picked", "Premium Quality"],
    specifications: {
      weight: "2 kg",
      origin: "Coast Province, Kenya",
      harvestDate: "2024-01-14",
      shelfLife: "3-5 days",
      storageTemp: "8-12°C"
    }
  },
  {
    id: 4,
    name: "Organic Carrots",
    image: carrotsImage,
    price: 200,
    originalPrice: 240,
    rating: 4.6,
    reviews: 156,
    category: "vegetables",
    inStock: true,
    farmer: "Highland Farms",
    description: "Sweet and crunchy organic carrots. Rich in beta-carotene and perfect for cooking or snacking.",
    features: ["High Beta-Carotene", "Crunchy Texture", "Organic Certified", "Sweet Flavor", "Versatile Use"],
    specifications: {
      weight: "1 kg",
      origin: "Meru, Kenya",
      harvestDate: "2024-01-13",
      shelfLife: "14-21 days",
      storageTemp: "0-4°C"
    }
  },
  {
    id: 5,
    name: "Premium Avocados",
    image: avocadosImage,
    price: 400,
    originalPrice: 480,
    rating: 4.9,
    reviews: 234,
    category: "fruits",
    inStock: true,
    farmer: "Murang'a Growers",
    description: "Hass avocados with perfect ripeness. Rich in healthy fats and nutrients. Ideal for guacamole or salads.",
    features: ["Hass Variety", "Perfect Ripeness", "Healthy Fats", "Creamy Texture", "Export Quality"],
    specifications: {
      weight: "1 kg (4-5 pieces)",
      origin: "Murang'a, Kenya",
      harvestDate: "2024-01-12",
      shelfLife: "5-7 days",
      storageTemp: "12-15°C"
    }
  },
  {
    id: 6,
    name: "Fresh Potatoes",
    image: potatoesImage,
    price: 150,
    originalPrice: 180,
    rating: 4.5,
    reviews: 98,
    category: "vegetables",
    inStock: true,
    farmer: "Molo Potato Farm",
    description: "High-quality potatoes perfect for cooking. Grown in the highlands for superior taste and texture.",
    features: ["Highland Grown", "Versatile Cooking", "Long Storage", "High Starch", "Premium Grade"],
    specifications: {
      weight: "2 kg",
      origin: "Molo, Kenya",
      harvestDate: "2024-01-10",
      shelfLife: "30-45 days",
      storageTemp: "4-10°C"
    }
  },
  {
    id: 7,
    name: "Sweet Bananas",
    image: bananasImage,
    price: 120,
    originalPrice: 150,
    rating: 4.7,
    reviews: 178,
    category: "fruits",
    inStock: true,
    farmer: "Coast Banana Plantation",
    description: "Sweet and ripe bananas. Rich in potassium and natural energy. Perfect for breakfast or snacking.",
    features: ["High Potassium", "Natural Energy", "Sweet Flavor", "Perfect Ripeness", "Chemical Free"],
    specifications: {
      weight: "1 kg (6-8 pieces)",
      origin: "Kilifi, Kenya",
      harvestDate: "2024-01-15",
      shelfLife: "3-5 days",
      storageTemp: "13-17°C"
    }
  },
  {
    id: 8,
    name: "Red Apples",
    image: applesImage,
    price: 350,
    originalPrice: 400,
    rating: 4.8,
    reviews: 145,
    category: "fruits",
    inStock: true,
    farmer: "Mt. Kenya Orchards",
    description: "Crisp and sweet red apples. Grown in cool highlands for optimal flavor and nutrition.",
    features: ["Highland Grown", "Crisp Texture", "Sweet Flavor", "High Fiber", "Natural Antioxidants"],
    specifications: {
      weight: "1 kg (6-8 pieces)",
      origin: "Nyeri, Kenya",
      harvestDate: "2024-01-11",
      shelfLife: "14-21 days",
      storageTemp: "0-4°C"
    }
  },
  {
    id: 9,
    name: "Premium Rice",
    image: riceImage,
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviews: 67,
    category: "grains",
    inStock: true,
    farmer: "Mwea Rice Scheme",
    description: "High-quality aromatic rice. Perfect for daily meals with excellent texture and taste.",
    features: ["Aromatic", "Long Grain", "Premium Quality", "Low Gluten", "Traditional Variety"],
    specifications: {
      weight: "1 kg",
      origin: "Mwea, Kenya",
      harvestDate: "2024-01-05",
      shelfLife: "12 months",
      storageTemp: "Room Temperature"
    }
  },
  {
    id: 10,
    name: "Organic Wheat Flour",
    image: wheatImage,
    price: 160,
    originalPrice: 200,
    rating: 4.7,
    reviews: 89,
    category: "grains",
    inStock: true,
    farmer: "Uasin Gishu Millers",
    description: "Stone-ground organic wheat flour. Perfect for baking bread, cakes, and traditional foods.",
    features: ["Stone Ground", "Organic Certified", "High Protein", "Fine Texture", "Traditional Process"],
    specifications: {
      weight: "1 kg",
      origin: "Uasin Gishu, Kenya",
      harvestDate: "2024-01-08",
      shelfLife: "6 months",
      storageTemp: "Cool Dry Place"
    }
  },
  {
    id: 11,
    name: "Fresh Farm Milk",
    image: milkImage,
    price: 80,
    originalPrice: 100,
    rating: 4.9,
    reviews: 234,
    category: "dairy",
    inStock: true,
    farmer: "Dairy Farmers Cooperative",
    description: "Fresh pasteurized milk from free-range cows. Rich in calcium and proteins for healthy living.",
    features: ["Pasteurized", "Free Range Cows", "Rich in Calcium", "High Protein", "Fresh Daily"],
    specifications: {
      weight: "1 Liter",
      origin: "Kiambu, Kenya",
      harvestDate: "2024-01-16",
      shelfLife: "5-7 days",
      storageTemp: "2-4°C"
    }
  },
  {
    id: 12,
    name: "Artisan Cheese",
    image: cheeseImage,
    price: 650,
    originalPrice: 750,
    rating: 4.8,
    reviews: 156,
    category: "dairy",
    inStock: true,
    farmer: "Mountain View Dairy",
    description: "Traditional artisan cheese made from fresh farm milk. Aged to perfection with rich flavor and smooth texture.",
    features: ["Artisan Made", "Natural Aging", "Rich Flavor", "Smooth Texture", "Premium Quality"],
    specifications: {
      weight: "500g",
      origin: "Nyandarua, Kenya",
      harvestDate: "2024-01-10",
      shelfLife: "14-21 days",
      storageTemp: "2-4°C"
    }
  }
];

export const categories = [
  {
    id: "vegetables",
    name: "Vegetables",
    description: "Fresh leafy greens, root vegetables, and more",
    count: products.filter(p => p.category === "vegetables").length
  },
  {
    id: "fruits",
    name: "Fruits", 
    description: "Seasonal fruits packed with nutrients",
    count: products.filter(p => p.category === "fruits").length
  },
  {
    id: "grains",
    name: "Grains & Cereals",
    description: "Quality grains for healthy meals",
    count: products.filter(p => p.category === "grains").length
  },
  {
    id: "dairy",
    name: "Dairy Products",
    description: "Fresh milk, cheese, and dairy products", 
    count: products.filter(p => p.category === "dairy").length
  }
];