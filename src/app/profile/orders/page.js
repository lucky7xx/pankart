"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Package } from "lucide-react";

const OrdersPage = () => {
  const router = useRouter();

  // Fetch orders
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>
              Failed to load your orders: {error.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Button variant="outline" onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>

      {data?.data?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
            <CardDescription>
              You haven&apos;t placed any orders yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/products")}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data?.data?.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Unknown date";
    }
  };

  const getStatusBadge = (order) => {
    if (order.isDelivered) {
      return <Badge className="bg-green-500">Delivered</Badge>;
    } else if (order.isPaid) {
      return <Badge className="bg-blue-500">Shipped</Badge>;
    } else {
      return <Badge className="bg-yellow-500">Processing</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Order #{order._id.substring(order._id.length - 8)}
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(order.createdAt)}
            </CardDescription>
          </div>
          <div>
            {getStatusBadge(order)}
            <div className="text-sm text-gray-500 mt-1">
              Total: ${order.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Status</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Order placed</span>
              </div>

              <div className="flex items-center">
                {order.isPaid ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                )}
                <span>Payment {order.isPaid ? "completed" : "processing"}</span>
                {order.isPaid && order.paidAt && (
                  <span className="ml-2 text-gray-500">
                    on {formatDate(order.paidAt)}
                  </span>
                )}
              </div>

              <div className="flex items-center">
                {order.isDelivered ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Package className="h-4 w-4 text-blue-500 mr-2" />
                )}
                <span>{order.isDelivered ? "Delivered" : "Shipping"}</span>
                {order.isDelivered && order.deliveredAt && (
                  <span className="ml-2 text-gray-500">
                    on {formatDate(order.deliveredAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
