export const products = [
  {
    type: "subscription",
    priceId: "price_1M9NO0FkmmuOs718SNBdrtPw",
    referenceId: "basic",
    interval: "month",
    price: 9,
    currency: "USD",
  },
  {
    type: "subscription",
    priceId: "price_1M9NOjFkmmuOs718vaedJF6b",
    referenceId: "basic",
    interval: "year",
    price: 90,
    currency: "USD",
  },
  {
    type: "subscription",
    priceId: "price_1JZ9aHLzJ6Z6y3zZ",
    referenceId: "pro",
    interval: "month",
    price: 49,
    currency: "USD",
  },
  {
    type: "subscription",
    priceId: "price_1JZ9aHLzJ6Z6y3zZ",
    referenceId: "pro",
    interval: "year",
    price: 490,
    currency: "USD",
  },
  {
    type: "one-time",
    priceId: "price_1PHjoxFkmmuOs718Orzx98rv",
    referenceId: "lifetime",
    price: 799,
    currency: "USD",
  },
] as const satisfies ({
  priceId: string;
  referenceId: string;
  price: number;
  currency?: string;
} & (
  | {
      type: "one-time";
    }
  | {
      type: "subscription";
      interval: "month" | "year";
    }
))[];
