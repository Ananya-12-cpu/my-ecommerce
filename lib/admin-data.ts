// Static mock data for the admin analytics & reports dashboards.

export interface Kpi {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  trend: "good" | "bad";
}

export const kpis: Kpi[] = [
  {
    label: "Total revenue",
    value: "$128,450",
    delta: 12.4,
    deltaLabel: "vs last month",
    trend: "good",
  },
  {
    label: "Orders",
    value: "1,284",
    delta: 8.1,
    deltaLabel: "vs last month",
    trend: "good",
  },
  {
    label: "Avg. order value",
    value: "$100.04",
    delta: -1.6,
    deltaLabel: "vs last month",
    trend: "bad",
  },
  {
    label: "Conversion rate",
    value: "3.8%",
    delta: 0.4,
    deltaLabel: "vs last month",
    trend: "good",
  },
];

export interface MonthlyRevenue {
  month: string;
  value: number;
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Feb", value: 12400 },
  { month: "Mar", value: 13800 },
  { month: "Apr", value: 11200 },
  { month: "May", value: 15600 },
  { month: "Jun", value: 17200 },
  { month: "Jul", value: 16100 },
  { month: "Aug", value: 19800 },
  { month: "Sep", value: 21850 },
];

export interface CategorySales {
  category: string;
  percent: number;
  color: string;
  colorDark: string;
}

export const categorySales: CategorySales[] = [
  { category: "Electronics", percent: 42, color: "#2a78d6", colorDark: "#3987e5" },
  { category: "Apparel", percent: 23, color: "#eb6834", colorDark: "#d95926" },
  { category: "Footwear", percent: 18, color: "#1baf7a", colorDark: "#199e70" },
  { category: "Accessories", percent: 11, color: "#eda100", colorDark: "#c98500" },
  { category: "Home", percent: 6, color: "#e87ba4", colorDark: "#d55181" },
];

export interface TopProduct {
  title: string;
  unitsSold: number;
  revenue: string;
}

export const topProducts: TopProduct[] = [
  { title: "Aero Wireless Headphones", unitsSold: 312, revenue: "$28,076.88" },
  { title: "Cloudline Running Shoes", unitsSold: 265, revenue: "$19,872.35" },
  { title: "Pulse Smartwatch", unitsSold: 198, revenue: "$25,542.00" },
  { title: "Everyday Canvas Backpack", unitsSold: 176, revenue: "$9,592.00" },
  { title: "Minimalist Leather Wallet", unitsSold: 154, revenue: "$4,928.00" },
];

export interface OrderStatusBreakdown {
  label: string;
  count: number;
  status: "good" | "warning" | "critical";
}

export const orderStatusBreakdown: OrderStatusBreakdown[] = [
  { label: "Delivered", count: 892, status: "good" },
  { label: "Pending", count: 214, status: "warning" },
  { label: "Cancelled", count: 61, status: "critical" },
];

export interface Report {
  id: string;
  name: string;
  description: string;
  period: string;
  format: "PDF" | "CSV";
  status: "Ready" | "Scheduled";
  date: string;
}

export const reports: Report[] = [
  {
    id: "sales-monthly",
    name: "Monthly Sales Report",
    description: "Revenue, orders, and refunds broken down by day.",
    period: "Aug 2026",
    format: "PDF",
    status: "Ready",
    date: "2026-09-01",
  },
  {
    id: "inventory-snapshot",
    name: "Inventory Snapshot",
    description: "Stock levels and low-stock alerts across all categories.",
    period: "Q3 2026",
    format: "CSV",
    status: "Ready",
    date: "2026-09-02",
  },
  {
    id: "customer-growth",
    name: "Customer Growth Report",
    description: "New signups, repeat purchase rate, and churn.",
    period: "Aug 2026",
    format: "PDF",
    status: "Ready",
    date: "2026-09-01",
  },
  {
    id: "category-performance",
    name: "Category Performance",
    description: "Revenue share and growth by product category.",
    period: "Aug 2026",
    format: "CSV",
    status: "Ready",
    date: "2026-08-31",
  },
  {
    id: "refunds-cancellations",
    name: "Refunds & Cancellations",
    description: "Reasons and totals for cancelled or refunded orders.",
    period: "Aug 2026",
    format: "PDF",
    status: "Scheduled",
    date: "2026-09-05",
  },
  {
    id: "tax-summary",
    name: "Tax Summary",
    description: "Collected tax by region, ready for filing.",
    period: "Q3 2026",
    format: "PDF",
    status: "Scheduled",
    date: "2026-10-01",
  },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  totalSpent: string;
  status: "Active" | "VIP" | "Inactive";
}

export const customers: Customer[] = [
  {
    id: "cus-1",
    name: "Ananya Sen",
    email: "ananya@gmail.com",
    joined: "2025-11-14",
    orders: 18,
    totalSpent: "$1,842.50",
    status: "VIP",
  },
  {
    id: "cus-2",
    name: "Ritwik Das",
    email: "ritwik.das@example.com",
    joined: "2026-01-22",
    orders: 11,
    totalSpent: "$964.20",
    status: "VIP",
  },
  {
    id: "cus-3",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    joined: "2026-03-05",
    orders: 6,
    totalSpent: "$412.75",
    status: "Active",
  },
  {
    id: "cus-4",
    name: "Sourav Ghosh",
    email: "sourav.ghosh@example.com",
    joined: "2026-04-18",
    orders: 4,
    totalSpent: "$298.00",
    status: "Active",
  },
  {
    id: "cus-5",
    name: "Meera Iyer",
    email: "meera.iyer@example.com",
    joined: "2026-05-02",
    orders: 3,
    totalSpent: "$156.40",
    status: "Active",
  },
  {
    id: "cus-6",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    joined: "2026-02-27",
    orders: 2,
    totalSpent: "$89.99",
    status: "Inactive",
  },
  {
    id: "cus-7",
    name: "Kavya Reddy",
    email: "kavya.reddy@example.com",
    joined: "2026-06-11",
    orders: 5,
    totalSpent: "$327.60",
    status: "Active",
  },
  {
    id: "cus-8",
    name: "Debashish Roy",
    email: "debashish.roy@example.com",
    joined: "2025-09-30",
    orders: 1,
    totalSpent: "$54.50",
    status: "Inactive",
  },
];
