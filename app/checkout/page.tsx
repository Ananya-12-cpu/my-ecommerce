"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: "💳" },
  { id: "upi", label: "UPI", description: "Pay via any UPI app", icon: "📱" },
  { id: "netbanking", label: "Net Banking", description: "All major banks supported", icon: "🏦" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: "💵" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !paid) {
      router.replace("/cart");
    }
  }, [items.length, paid, router]);

  function pay() {
    addOrder(items, totalPrice);
    clearCart();
    setPaid(true);
  }

  function goToOrders() {
    router.push("/orders");
  }

  if (items.length === 0 && !paid) {
    return null;
  }

  const selected = PAYMENT_METHODS.find((m) => m.id === method);

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Choose a payment method
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Total to pay:{" "}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          ${totalPrice.toFixed(2)}
        </span>
      </p>

      <div className="flex flex-col gap-3">
        {PAYMENT_METHODS.map((m) => {
          const isSelected = method === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800">
                {m.icon}
              </span>
              <div className="flex-1">
                <p className="font-medium">{m.label}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {m.description}
                </p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-black bg-black dark:border-white dark:bg-white"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-white dark:bg-black" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={pay}
        className="mt-8 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        Pay ${totalPrice.toFixed(2)}
      </button>

      {paid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600 dark:bg-green-900/40 dark:text-green-400">
              ✓
            </div>
            <h2 className="text-xl font-semibold">Payment successful</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Your order has been placed and paid via {selected?.label}.
            </p>
            <button
              onClick={goToOrders}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              View orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
