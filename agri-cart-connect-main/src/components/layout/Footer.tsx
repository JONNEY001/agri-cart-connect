import { Link } from "react-router-dom";
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8" />
              <span className="font-bold text-xl">AgriCart Connect</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Connecting farmers directly with consumers for fresh, quality agricultural products.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-accent transition-colors">Categories</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories/vegetables" className="hover:text-accent transition-colors">Vegetables</Link></li>
              <li><Link to="/categories/fruits" className="hover:text-accent transition-colors">Fruits</Link></li>
              <li><Link to="/categories/grains" className="hover:text-accent transition-colors">Grains</Link></li>
              <li><Link to="/categories/dairy" className="hover:text-accent transition-colors">Dairy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@agricartconnect.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 AgriCart Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;