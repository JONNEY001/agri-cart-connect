import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

export const addToCart = async (
  product: Product, 
  quantity: number = 1,
  toast: any,
  navigate: any,
  refreshCartCount: () => void
) => {
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
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      refreshCartCount();
      toast({ title: "Cart updated", description: `${quantity} item(s) added to cart` });
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
        quantity: quantity,
        farmer: product.farmer
      });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      refreshCartCount();
      toast({ title: "Added to cart", description: `${quantity} item(s) added to your cart` });
    }
  }
};