import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Star, Filter, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshCartCount } = useCart();

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = async (product: (typeof products)[number]) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({ title: "Please login", description: "Login to add items to your cart" });
      navigate("/auth");
      return;
    }
    const userId = session.user.id;
    
    // Check if item exists
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .single();

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        refreshCartCount();
        toast({ title: "Cart updated", description: "Item quantity increased" });
      }
    } else {
      // Add new item
      const { error } = await supabase
        .from("cart_items")
        .insert({
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          product_price: product.price,
          quantity: 1,
          farmer: product.farmer
        });
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        refreshCartCount();
        toast({ title: "Added to cart", description: "Item added to your cart" });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-muted-foreground">
          Discover fresh, quality agricultural products from local farmers
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 capitalize">
                  {product.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              {product.originalPrice > product.price && (
                <div className="absolute bottom-4 left-4">
                  <Badge variant="destructive">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  <Link to={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{product.farmer}</p>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  <span className="ml-1 text-sm text-muted-foreground">({product.reviews})</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">KSh {product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      KSh {product.originalPrice}
                    </span>
                  )}
                </div>
                <Badge variant={product.inStock ? "success" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <Button 
                className="w-full" 
                disabled={!product.inStock}
                variant={product.inStock ? "default" : "outline"}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products;