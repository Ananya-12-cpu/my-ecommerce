// Static mock data for the Offer Zone (customer + admin views).

export interface Offer {
  code: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  color: string;
  colorDark: string;
  expires: string;
}

export const activeOffers: Offer[] = [
  {
    code: "SUMMER25",
    title: "25% off Electronics",
    description: "Headphones, smartwatches, and more.",
    discount: "25% OFF",
    category: "Electronics",
    color: "#2a78d6",
    colorDark: "#3987e5",
    expires: "2026-09-30",
  },
  {
    code: "WELCOME10",
    title: "10% off your first order",
    description: "New customers get a welcome discount storewide.",
    discount: "10% OFF",
    category: "Storewide",
    color: "#1baf7a",
    colorDark: "#199e70",
    expires: "Ongoing",
  },
  {
    code: "FREESHIP",
    title: "Free shipping over $50",
    description: "No code minimum tricks — just free shipping.",
    discount: "FREE SHIP",
    category: "Storewide",
    color: "#eda100",
    colorDark: "#c98500",
    expires: "2026-09-15",
  },
  {
    code: "FLASH15",
    title: "Flash sale: Footwear",
    description: "15% off running shoes and sneakers. Ends soon.",
    discount: "15% OFF",
    category: "Footwear",
    color: "#e34948",
    colorDark: "#e66767",
    expires: "2026-09-10",
  },
  {
    code: "BUNDLE20",
    title: "Buy 2, save 20%",
    description: "Mix and match any two items in a single order.",
    discount: "20% OFF",
    category: "Bundle",
    color: "#4a3aa7",
    colorDark: "#9085e9",
    expires: "2026-10-05",
  },
];

export interface AdminOffer {
  code: string;
  description: string;
  discount: string;
  status: "Active" | "Scheduled" | "Expired";
  redemptions: number;
  expires: string;
}

export const adminOffers: AdminOffer[] = [
  { code: "SUMMER25", description: "25% off Electronics", discount: "25%", status: "Active", redemptions: 341, expires: "2026-09-30" },
  { code: "WELCOME10", description: "10% off first order", discount: "10%", status: "Active", redemptions: 812, expires: "Ongoing" },
  { code: "FREESHIP", description: "Free shipping over $50", discount: "Free shipping", status: "Active", redemptions: 596, expires: "2026-09-15" },
  { code: "FLASH15", description: "Flash sale: Footwear", discount: "15%", status: "Active", redemptions: 128, expires: "2026-09-10" },
  { code: "BUNDLE20", description: "Buy 2, save 20%", discount: "20%", status: "Active", redemptions: 204, expires: "2026-10-05" },
  { code: "HOLIDAY30", description: "30% off Holiday collection", discount: "30%", status: "Scheduled", redemptions: 0, expires: "2026-11-20" },
  { code: "SPRING10", description: "10% off Spring refresh", discount: "10%", status: "Expired", redemptions: 456, expires: "2026-05-01" },
];
