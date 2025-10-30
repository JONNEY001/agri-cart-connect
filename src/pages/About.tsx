import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Target, Award, Leaf, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import farmersTeamImage from "@/assets/about/farmers-team.jpg";
import missionImage from "@/assets/about/mission.jpg";
import sustainableFarmingImage from "@/assets/blog/sustainable-farming.jpg";
import organicBenefitsImage from "@/assets/blog/organic-benefits.jpg";

const About = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Sustainable Farming Practices for the Future",
      excerpt: "Learn about modern sustainable farming techniques that protect the environment while ensuring high-quality produce.",
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
      image: organicBenefitsImage,
      author: "John Mwangi",
      date: "January 12, 2024",
      readTime: "4 min read",
      tags: ["Organic", "Health", "Nutrition"]
    }
  ];

  const teamMembers = [
    {
      name: "James Kiprotich",
      role: "Founder & CEO",
      description: "20+ years in agricultural business"
    },
    {
      name: "Mary Wanjiku",
      role: "Head of Operations",
      description: "Expert in supply chain management"
    },
    {
      name: "Peter Ochieng",
      role: "Quality Assurance",
      description: "Ensuring premium product standards"
    }
  ];

  const achievements = [
    { number: "500+", label: "Happy Customers" },
    { number: "50+", label: "Partner Farmers" },
    { number: "1000+", label: "Orders Delivered" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About AgriCart Connect</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting farmers directly with consumers to deliver the freshest, highest quality agricultural products while supporting local communities and sustainable farming practices.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src={missionImage}
            alt="Our Mission"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To bridge the gap between farmers and consumers by providing a platform that ensures fair prices for farmers while delivering fresh, quality produce to customers. We believe in sustainable agriculture and community empowerment.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <img
            src={farmersTeamImage}
            alt="Our Vision"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become Kenya's leading agricultural marketplace, promoting sustainable farming practices and creating economic opportunities for rural communities while providing urban consumers with access to fresh, affordable produce.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>
                <div className="text-muted-foreground">{achievement.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
          <Button variant="outline" asChild>
            <Link to="/blog">View All Posts</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  {post.title}
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
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Promoting eco-friendly farming practices that protect our environment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quality</h3>
              <p className="text-sm text-muted-foreground">
                Ensuring only the highest quality products reach our customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Supporting local farmers and building stronger communities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Complete transparency in our processes and farmer partnerships
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-muted/30 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Fresh?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust AgriCart Connect for their daily fresh produce needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;