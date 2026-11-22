"use client";

import { EmptyState, PageContainer } from "@/components/ui";
import { useOrders } from "@/lib/orders-context";
import { useAuth } from "@/lib/auth-context";

export default function OrdersPage() {
  const { orders: allOrders } = useOrders();
  const { user } = useAuth();
  const orders = user
    ? allOrders.filter((o) => o.userEmail === user.email)
    : [];

  if (!user) {
    return (
      <EmptyState
        title="Please log in"
        description="Log in to see your orders."
        actionLabel="Log in"
        actionHref="/login"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your placed orders will show up here."
        actionLabel="Continue shopping"
        actionHref="/"
      />
    );
  }

  return (
    <PageContainer title="Your orders">

      <ul className="stagger flex flex-col gap-6">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>

            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Qty {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
