import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import sustainableFarmingImage from "@/assets/blog/sustainable-farming.jpg";
import organicBenefitsImage from "@/assets/blog/organic-benefits.jpg";

const Blog = () => {
  const { id } = useParams();
  
  const blogPosts = [
    {
      id: 1,
      title: "Sustainable Farming Practices for the Future",
      excerpt: "Learn about modern sustainable farming techniques that protect the environment while ensuring high-quality produce.",
      content: `
        <h2>Introduction to Sustainable Farming</h2>
        <p>Sustainable farming is more than just a buzzword—it's a comprehensive approach to agriculture that prioritizes environmental health, economic profitability, and social equity. As we face growing environmental challenges and an increasing global population, sustainable farming practices have become crucial for ensuring food security while protecting our planet.</p>
        
        <h2>Key Principles of Sustainable Agriculture</h2>
        <p><strong>Soil Health Management:</strong> Healthy soil is the foundation of sustainable farming. Practices like crop rotation, cover cropping, and minimal tillage help maintain soil structure, increase organic matter, and promote beneficial microorganisms.</p>
        
        <p><strong>Water Conservation:</strong> Efficient water use through drip irrigation, rainwater harvesting, and drought-resistant crops helps conserve this precious resource while maintaining crop yields.</p>
        
        <p><strong>Biodiversity Protection:</strong> Maintaining diverse ecosystems on farms supports natural pest control, improves soil health, and creates habitat for beneficial wildlife.</p>
        
        <h2>Modern Techniques and Technologies</h2>
        <p>Today's sustainable farmers are embracing innovative technologies like precision agriculture, IoT sensors for monitoring soil conditions, and drone technology for crop assessment. These tools help optimize resource use while minimizing environmental impact.</p>
        
        <h2>Benefits for Farmers and Consumers</h2>
        <p>Sustainable farming practices not only protect the environment but also provide economic benefits to farmers through reduced input costs and premium pricing for sustainably grown products. Consumers benefit from healthier, more nutritious food while supporting environmentally responsible agriculture.</p>
      `,
      image: sustainableFarmingImage,
      author: "Dr. Sarah Kimani",
      date: "January 15, 2024",
      readTime: "5 min read",
      tags: ["Sustainability", "Environment", "Farming"]
    },
    {
      id: 2,
      title: "The Benefits of Organic Produce",
      excerpt: "Discover why organic fruits and vegetables are better for your health and the environment.",
      content: `
        <h2>What Makes Produce Organic?</h2>
        <p>Organic farming is a method of agriculture that relies on natural processes and materials to grow crops. It prohibits the use of synthetic pesticides, herbicides, fertilizers, and genetically modified organisms (GMOs). Instead, organic farmers use techniques like crop rotation, composting, and biological pest control.</p>
        
        <h2>Health Benefits of Organic Food</h2>
        <p><strong>Reduced Chemical Exposure:</strong> Organic produce contains significantly lower levels of pesticide residues compared to conventionally grown foods, reducing your exposure to potentially harmful chemicals.</p>
        
        <p><strong>Higher Nutrient Content:</strong> Studies have shown that organic fruits and vegetables often contain higher levels of certain nutrients, including antioxidants, vitamin C, and essential minerals.</p>
        
        <p><strong>No GMOs:</strong> Organic certification prohibits the use of genetically modified organisms, giving consumers who prefer non-GMO foods a clear choice.</p>
        
        <h2>Environmental Impact</h2>
        <p>Organic farming practices promote soil health, conserve water, reduce soil erosion, and support biodiversity. By avoiding synthetic chemicals, organic farms create healthier ecosystems that benefit wildlife and surrounding communities.</p>
        
        <h2>Supporting Local Communities</h2>
        <p>When you buy organic produce from local farmers, you're supporting sustainable agricultural practices in your community and helping to build a more resilient local food system.</p>
      `,
      image: organicBenefitsImage,
      author: "John Mwangi",
      date: "January 12, 2024",
      readTime: "4 min read",
      tags: ["Organic", "Health", "Nutrition"]
    }
  ];

  // If viewing a specific post
  if (id) {
    const post = blogPosts.find(p => p.id === parseInt(id));
    if (!post) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/blog">← Back to Blog</Link>
            </Button>
            
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
            />
            
            <div className="flex items-center space-x-4 mb-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">By {post.author}</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    );
  }

  // Blog listing page
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AgriCart Connect Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay updated with the latest trends in agriculture, sustainable farming practices, and tips for healthy living.
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <img
              src={blogPosts[0].image}
              alt={blogPosts[0].title}
              className="w-full h-64 lg:h-full object-cover"
            />
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4">Featured Post</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{blogPosts[0].date}</span>
                <Clock className="h-4 w-4" />
                <span>{blogPosts[0].readTime}</span>
              </div>
              
              <Button asChild>
                <Link to={`/blog/${blogPosts[0].id}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* All Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>

              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                <Link to={`/blog/${post.id}`}>
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">By {post.author}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;