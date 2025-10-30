import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) navigate("/auth");
      else loadCart();
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) navigate("/auth");
      else loadCart();
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data, error } = await supabase.from("cart_items").select("*").order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCartItems(data || []);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(id);
      return;
    }
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
      refreshCartCount();
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCartItems(prev => prev.filter(item => item.id !== id));
      refreshCartCount();
      toast({ title: "Item removed", description: "Item removed from cart" });
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.product_price) * item.quantity), 0);
  }, [cartItems]);

  const delivery = 150; // Fixed delivery fee
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (!address || !phone) {
      toast({ title: "Missing information", description: "Please provide delivery address and phone number", variant: "destructive" });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          total_amount: total,
          phone_number: phone,
          delivery_address: address,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        product_price: item.product_price,
        quantity: item.quantity,
        farmer: item.farmer
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initiate M-Pesa payment
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: phone.replace(/^0/, '254'), // Convert to international format
          amount: total,
          orderId: order.id
        }
      });

      if (error) throw error;

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", session.user.id);
      setCartItems([]);
      refreshCartCount();
      
      toast({ 
        title: "Payment initiated", 
        description: "Please complete the payment on your phone" 
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({ 
        title: "Checkout failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some fresh products to get started</p>
          <Button asChild>
            <Link to="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-sm text-muted-foreground">{item.farmer}</p>
                    <p className="font-medium text-primary">KSh {item.product_price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">KSh {Number(item.product_price) * item.quantity}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KSh {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>KSh {delivery}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>KSh {total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your M-Pesa number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Checkout */}
          <Button 
            onClick={handleCheckout}
            className="w-full" 
            size="lg"
            variant="hero"
          >
            Proceed to M-Pesa Payment
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link to="/products">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;