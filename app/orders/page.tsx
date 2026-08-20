"use client";

import Link from "next/link";
import { useOrders } from "@/lib/orders-context";

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Your placed orders will show up here.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Your orders</h1>

      <ul className="flex flex-col gap-6">
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
    </div>
  );
}
