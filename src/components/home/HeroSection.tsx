import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Truck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Fresh From Farm
            <span className="block text-accent">To Your Table</span>
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Connect directly with local farmers and get the freshest agricultural products delivered to your doorstep. Quality guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/products">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/80">Local Farmers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold">24hrs</div>
              <div className="text-sm text-white/80">Fresh Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;