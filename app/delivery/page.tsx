"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CustomerGuard from "@/components/CustomerGuard";
import { useDeliveryLocation } from "@/lib/delivery-context";

const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Loading map…
      </div>
    ),
  }
);

interface Pin {
  lat: number;
  lng: number;
}

function DeliveryLocationPicker() {
  const { location, setLocation } = useDeliveryLocation();
  const [pin, setPin] = useState<Pin | null>(
    location ? { lat: location.lat, lng: location.lng } : null
  );
  const [address, setAddress] = useState<string | null>(
    location?.address ?? null
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handlePick(lat: number, lng: number) {
    setPin({ lat, lng });
    setSaved(false);
    setError(null);
    setAddress(null);
    setIsLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();
      setAddress(data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setError("Couldn't fetch a street address, showing coordinates instead.");
    } finally {
      setIsLoadingAddress(false);
    }
  }

  function handleSave() {
    if (!pin || !address) return;
    setLocation({ lat: pin.lat, lng: pin.lng, address });
    setSaved(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Set delivery location
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Click anywhere on the map to drop a pin at your delivery address.
      </p>

      <div className="mt-6 h-96 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <LocationPickerMap
          position={pin ? [pin.lat, pin.lng] : null}
          onPick={handlePick}
        />
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Selected address
        </p>

        {!pin && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            No location selected yet. Click on the map to pin one.
          </p>
        )}

        {pin && isLoadingAddress && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Looking up address…
          </p>
        )}

        {pin && !isLoadingAddress && address && (
          <p className="mt-2 text-sm">{address}</p>
        )}

        {error && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={!pin || isLoadingAddress || !address}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Save delivery location
        </button>

        {saved && (
          <p className="mt-2 text-sm text-[#006300] dark:text-[#0ca30c]">
            Delivery location saved.
          </p>
        )}
      </div>
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <CustomerGuard>
      <DeliveryLocationPicker />
    </CustomerGuard>
  );
}
