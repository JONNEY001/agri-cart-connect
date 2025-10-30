import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Carrot, Wheat, Milk } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const CategorySection = () => {
  const categoryIcons = {
    vegetables: { icon: Carrot, color: "text-green-600", bgColor: "bg-green-50" },
    fruits: { icon: Apple, color: "text-red-500", bgColor: "bg-red-50" },
    grains: { icon: Wheat, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    dairy: { icon: Milk, color: "text-blue-600", bgColor: "bg-blue-50" },
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our wide selection of fresh agricultural products organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const iconConfig = categoryIcons[category.id as keyof typeof categoryIcons] || categoryIcons.vegetables;
            const IconComponent = iconConfig.icon;
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${iconConfig.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${iconConfig.color}`} />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <p className="text-sm font-medium text-primary mb-4">
                    {category.count} Products
                  </p>
                  
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/categories/${category.id}`}>
                      Browse {category.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;