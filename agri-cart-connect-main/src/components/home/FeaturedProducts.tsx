import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

const FeaturedProducts = () => {
  // Show first 3 products as featured
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of the finest agricultural products from local farmers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90">
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
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;