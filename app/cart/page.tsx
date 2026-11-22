"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  EmptyState,
  ItemRow,
  PageContainer,
  QuantityStepper,
  useAnimatedRemove,
} from "@/components/ui";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { removing, remove } = useAnimatedRemove(removeItem);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the shop and add something you like."
        actionLabel="Continue shopping"
        actionHref="/"
      />
    );
  }

  return (
    <PageContainer title="Your cart">
      <ul className="stagger flex flex-col gap-4">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            {...item}
            removing={removing.includes(item.id)}
            onRemove={() => remove(item.id)}
            removeLabel="Remove item"
          >
            <QuantityStepper
              value={item.quantity}
              onChange={(q) => updateQuantity(item.id, q)}
            />
            <p
              key={item.quantity}
              className="animate-bump w-20 text-right font-medium"
            >
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </ItemRow>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button variant="danger-ghost" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
          <p key={totalPrice} className="animate-bump text-2xl font-semibold">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      <Button
        fullWidth
        onClick={() => router.push("/checkout")}
        className="mt-6"
      >
        Checkout
      </Button>
    </PageContainer>
  );
}
