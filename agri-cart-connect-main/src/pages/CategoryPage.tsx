import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { products, categories } from "@/data/products";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const category = categories.find(cat => cat.id === categoryId);
  
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = !categoryId || categoryId === "all" || product.category === categoryId;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {category ? category.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {category ? category.description : "Browse all our fresh agricultural products"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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

      {/* Categories Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={!categoryId || categoryId === "all" ? "default" : "outline"}
          asChild
          size="sm"
        >
          <Link to="/categories">All Categories</Link>
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={categoryId === cat.id ? "default" : "outline"}
            asChild
            size="sm"
          >
            <Link to={`/categories/${cat.id}`}>
              {cat.name} ({cat.count})
            </Link>
          </Button>
        ))}
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
              {product.originalPrice && product.originalPrice > product.price && (
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
                  {product.originalPrice && product.originalPrice > product.price && (
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

export default CategoryPage;