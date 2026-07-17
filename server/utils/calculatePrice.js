export const calculateNumberOfDays = (pickupDate, returnDate) => {
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end - start);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days < 1 ? 1 : days;
};

export const calculateBookingPrice = ({ pricePerDay, numberOfDays, discountPercent = 0, coupon = null }) => {
  let basePrice = pricePerDay * numberOfDays;
  let discountAmount = (basePrice * discountPercent) / 100;

  if (coupon) {
    let couponDiscount = 0;
    if (coupon.discountType === "percentage") {
      couponDiscount = (basePrice * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount > 0) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
      }
    } else {
      couponDiscount = coupon.discountValue;
    }
    discountAmount += couponDiscount;
  }

  const subTotal = basePrice - discountAmount;
  const taxAmount = Math.round(subTotal * 0.18 * 100) / 100;
  const totalPrice = Math.round((subTotal + taxAmount) * 100) / 100;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount,
    totalPrice,
  };
};

export const calculateLateFee = (returnDate, actualReturnDate, pricePerDay) => {
  if (!actualReturnDate) return 0;
  const scheduled = new Date(returnDate);
  const actual = new Date(actualReturnDate);
  if (actual <= scheduled) return 0;
  const extraDays = Math.ceil((actual - scheduled) / (1000 * 60 * 60 * 24));
  return Math.round(extraDays * pricePerDay * 0.5 * 100) / 100;
};
