// DeliverIQ – Sample discount coupons
export const COUPONS = [
  { code: "SPICE50",   discount: 100,  type: "flat",    minOrder: 199, description: "50% OFF up to ₹100 on Spice Garden" },
  { code: "PIZZA2X",   discount: 15,   type: "percent", minOrder: 299, description: "15% OFF on Pizza Studio orders" },
  { code: "BURGER30",  discount: 30,   type: "percent", minOrder: 299, description: "30% OFF on Burger House orders" },
  { code: "SOUTH100",  discount: 100,  type: "flat",    minOrder: 199, description: "FLAT ₹100 OFF – first South Express order" },
  { code: "DRAGON20",  discount: 20,   type: "percent", minOrder: 199, description: "20% OFF at Dragon Palace" },
  { code: "SWEET15",   discount: 15,   type: "percent", minOrder: 149, description: "15% OFF on Sweet Bliss dessert combos" },
  { code: "GREENFREE", discount: 29,   type: "flat",    minOrder: 299, description: "Free delivery at Green Bowl" },
  { code: "CHAI10",    discount: 10,   type: "percent", minOrder: 79,  description: "10% OFF at Chai & Bytes" },
  { code: "WELCOME50", discount: 50,   type: "flat",    minOrder: 149, description: "New user: ₹50 OFF on first order" },
  { code: "SAVE100",   discount: 100,  type: "flat",    minOrder: 399, description: "₹100 OFF on orders above ₹399" },
];

export function applyCoupon(code, subtotal) {
  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, message: "Invalid coupon code." };
  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Minimum order ₹${coupon.minOrder} required for this coupon.`,
    };
  }
  let discount = 0;
  if (coupon.type === "flat") {
    discount = coupon.discount;
  } else {
    discount = Math.round((subtotal * coupon.discount) / 100);
  }
  discount = Math.min(discount, subtotal);
  return {
    valid: true,
    discount,
    message: `✓ ${coupon.description}`,
    coupon,
  };
}

