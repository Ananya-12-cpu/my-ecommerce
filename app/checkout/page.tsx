"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import { useAuth } from "@/lib/auth-context";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex", icon: "💳" },
  { id: "upi", label: "UPI", description: "Pay via any UPI app", icon: "📱" },
  { id: "netbanking", label: "Net Banking", description: "All major banks supported", icon: "🏦" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when your order arrives", icon: "💵" },
];

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank"];

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-white";
const labelClass = "mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [paid, setPaid] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState(BANKS[0]);

  useEffect(() => {
    if (items.length === 0 && !paid) {
      router.replace("/cart");
    }
  }, [items.length, paid, router]);

  const detailsValid =
    method === "card"
      ? cardName.trim().length > 1 &&
        cardNumber.replace(/\s/g, "").length === 16 &&
        expiry.length === 5 &&
        cvv.length >= 3
      : method === "upi"
        ? /^[\w.-]+@[\w]+$/.test(upiId.trim())
        : true;

  function pay() {
    if (!detailsValid) return;
    addOrder(items, totalPrice, user?.email);
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
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <span aria-hidden>🔒</span> Secure payment · Your details are encrypted
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Payment column */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Payment method
          </h2>

          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((m) => {
              const isSelected = method === m.id;
              return (
                <div
                  key={m.id}
                  className={`overflow-hidden rounded-xl border transition-all ${
                    isSelected
                      ? "border-black shadow-sm dark:border-white"
                      : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                  }`}
                >
                  <button
                    onClick={() => setMethod(m.id)}
                    className={`flex w-full items-center gap-4 p-4 text-left ${
                      isSelected ? "bg-zinc-50 dark:bg-zinc-900" : ""
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
                        <span className="animate-scale-in h-2 w-2 rounded-full bg-white dark:bg-black" />
                      )}
                    </span>
                  </button>

                  {isSelected && (
                    <div className="animate-scale-in border-t border-zinc-200 p-4 dark:border-zinc-800">
                      {m.id === "card" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className={labelClass}>Name on card</label>
                            <input
                              className={inputClass}
                              placeholder="Jane Doe"
                              autoComplete="cc-name"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className={labelClass}>Card number</label>
                            <input
                              className={inputClass}
                              placeholder="1234 5678 9012 3456"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Expiry</label>
                            <input
                              className={inputClass}
                              placeholder="MM/YY"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>CVV</label>
                            <input
                              className={inputClass}
                              placeholder="123"
                              inputMode="numeric"
                              type="password"
                              autoComplete="cc-csc"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            />
                          </div>
                        </div>
                      )}

                      {m.id === "upi" && (
                        <div>
                          <label className={labelClass}>UPI ID</label>
                          <input
                            className={inputClass}
                            placeholder="yourname@okbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            A payment request will be sent to your UPI app.
                          </p>
                        </div>
                      )}

                      {m.id === "netbanking" && (
                        <div>
                          <label className={labelClass}>Select your bank</label>
                          <select
                            className={inputClass}
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                          >
                            {BANKS.map((b) => (
                              <option key={b}>{b}</option>
                            ))}
                          </select>
                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            You&apos;ll be redirected to {bank} to complete the payment.
                          </p>
                        </div>
                      )}

                      {m.id === "cod" && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Pay in cash or by UPI to the delivery partner when your order
                          arrives. Please keep the exact amount ready.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary column */}
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-6">
          <h2 className="mb-4 text-lg font-semibold">
            Order summary{" "}
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h2>

          <ul className="max-h-64 divide-y divide-zinc-200 overflow-y-auto dark:divide-zinc-800">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-14 w-14 shrink-0 rounded-lg bg-zinc-200 object-cover dark:bg-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Subtotal</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">Shipping</dt>
              <dd className="text-green-600 dark:text-green-400">Free</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold dark:border-zinc-800">
              <dt>Total</dt>
              <dd>${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>

          <button
            onClick={pay}
            disabled={!detailsValid}
            className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-white dark:text-black"
          >
            {method === "cod" ? "Place order" : `Pay $${totalPrice.toFixed(2)}`}
          </button>

          <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
            🛡️ 100% secure checkout · Easy returns
          </p>
        </aside>
      </div>

      {paid && (
        <div className="animate-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="animate-scale-in w-full max-w-sm rounded-xl bg-white p-8 text-center dark:bg-zinc-900">
            <div className="animate-scale-in animate-pulse-ring mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600 dark:bg-green-900/40 dark:text-green-400">
              ✓
            </div>
            <h2 className="text-xl font-semibold">Payment successful</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Your order has been placed and paid via {selected?.label}.
            </p>
            <button
              onClick={goToOrders}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-black"
            >
              View orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
