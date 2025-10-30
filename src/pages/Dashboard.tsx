import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, Heart, Settings, LogOut, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadUserData(session.user);
        loadOrders(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        navigate("/auth");
      } else {
        loadUserData(data.session.user);
        loadOrders(data.session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = (authUser: any) => {
    setUser({
      name: authUser.email?.split('@')[0] || "User",
      email: authUser.email,
      phone: authUser.phone || "Not provided",
      joinDate: new Date(authUser.created_at).toLocaleDateString(),
      id: authUser.id
    });
  };

  const loadOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*),
        payments (
          amount,
          transaction_id,
          payer_phone,
          status,
          created_at
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      const processedOrders = data?.map(order => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString(),
        status: order.status,
        total: order.total_amount,
        items: order.order_items?.length || 0,
        phone: order.phone_number,
        address: order.delivery_address,
        payment: order.payments?.[0] ? {
          amount: order.payments[0].amount,
          transactionId: order.payments[0].transaction_id,
          payerPhone: order.payments[0].payer_phone,
          paymentStatus: order.payments[0].status,
          paidAt: new Date(order.payments[0].created_at).toLocaleDateString()
        } : null
      })) || [];
      setOrders(processedOrders);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "delivered": return "success";
      case "processing": return "warning";
      case "shipped": return "default";
      case "pending": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">KSh {orders.reduce((sum, order) => sum + Number(order.total), 0)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {orders.length > 0 ? orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">#{order.id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="text-sm text-muted-foreground">{order.items} items</p>
                      <p className="text-xs text-muted-foreground">Phone: {order.phone}</p>
                      <p className="text-xs text-muted-foreground">Address: {order.address}</p>
                      {order.payment && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Payment: KSh {order.payment.amount} - {order.payment.paymentStatus}
                          </p>
                          {order.payment.transactionId && (
                            <p className="text-xs text-muted-foreground">
                              Transaction: {order.payment.transactionId}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Paid on: {order.payment.paidAt}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)} className="mb-2">
                        {order.status}
                      </Badge>
                      <p className="font-semibold">KSh {order.total}</p>
                      {order.payment && order.payment.paymentStatus === 'confirmed' && (
                        <Badge variant="success" className="mt-1 block w-fit ml-auto">
                          Payment Confirmed
                        </Badge>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground py-8">Wishlist feature coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="mt-1 p-2 bg-muted rounded">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="mt-1 p-2 bg-muted rounded">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="mt-1 p-2 bg-muted rounded">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="mt-1 p-2 bg-muted rounded">{user.joinDate}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;