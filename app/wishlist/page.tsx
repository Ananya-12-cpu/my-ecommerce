"use client";

import AddToCartButton from "@/components/AddToCartButton";
import { EmptyState, ItemRow, PageContainer, useAnimatedRemove } from "@/components/ui";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { removing, remove } = useAnimatedRemove(removeItem);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save products you love for later."
        actionLabel="Continue shopping"
        actionHref="/"
      />
    );
  }

  return (
    <PageContainer title="Your wishlist">
      <ul className="stagger flex flex-col gap-4">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            {...item}
            removing={removing.includes(item.id)}
            onRemove={() => remove(item.id)}
            removeLabel="Remove from wishlist"
          >
            <div className="w-32 shrink-0">
              <AddToCartButton
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
              />
            </div>
          </ItemRow>
        ))}
      </ul>
    </PageContainer>
  );
}
