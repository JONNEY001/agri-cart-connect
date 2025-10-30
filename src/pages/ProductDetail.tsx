import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RefreshCcw } from "lucide-react";
import { products } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";
import { addToCart as addToCartUtil } from "@/utils/cartUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();
  
  // In a real app, this would be fetched based on the ID
  const product = products.find(p => p.id === parseInt(id || "1")) || products[0];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            {product.originalPrice > product.price && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">From {product.farmer}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary">KSh {product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                KSh {product.originalPrice}
              </span>
            )}
            <Badge variant={product.inStock ? "success" : "destructive"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1" 
                disabled={!product.inStock}
                onClick={() => addToCartUtil(product, quantity, toast, navigate, refreshCartCount)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart - KSh {product.price * quantity}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Quality Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;