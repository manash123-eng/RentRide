// Shared seed data + logic, reused by seed.js (CLI) and server.js (auto-seed on empty DB)
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Coupon from "../models/Coupon.js";

const img = (url) => ({ url, publicId: "" });

const vehiclesData = (adminId) => [
  { name: "Tesla Model 3", brand: "Tesla", model: "Model 3", year: 2024, category: "Electric", transmission: "Automatic", fuelType: "Electric", seats: 5, pricePerDay: 5500, discountPercent: 10, location: "Mumbai", description: "Premium electric sedan with autopilot features and long range battery.", licensePlate: "MH01EV1234", mileage: 22000, features: ["Autopilot", "Premium Sound", "Fast Charging"], isFeatured: true, ratingsAverage: 4.8, ratingsCount: 132, images: [img("https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80"), img("https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=1200&q=80")], createdBy: adminId },
  { name: "BMW X5", brand: "BMW", model: "X5", year: 2023, category: "SUV", transmission: "Automatic", fuelType: "Diesel", seats: 7, pricePerDay: 7500, location: "Delhi", description: "Luxury SUV with premium interiors and powerful performance.", licensePlate: "DL02BM5678", mileage: 18500, features: ["Sunroof", "Leather Seats", "4WD"], isFeatured: true, ratingsAverage: 4.6, ratingsCount: 98, images: [img("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80"), img("https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=1200&q=80")], createdBy: adminId },
  { name: "Maruti Swift", brand: "Maruti Suzuki", model: "Swift", year: 2023, category: "Hatchback", transmission: "Manual", fuelType: "Petrol", seats: 5, pricePerDay: 1500, location: "Bangalore", description: "Compact and fuel-efficient hatchback perfect for city drives.", licensePlate: "KA03SW9012", mileage: 32000, features: ["AC", "Power Steering"], isFeatured: false, ratingsAverage: 4.3, ratingsCount: 210, images: [img("https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80"), img("https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80")], createdBy: adminId },
  { name: "Toyota Innova Crysta", brand: "Toyota", model: "Innova Crysta", year: 2023, category: "Van", transmission: "Automatic", fuelType: "Diesel", seats: 7, pricePerDay: 3500, location: "Pune", description: "Spacious and comfortable van ideal for family trips.", licensePlate: "MH04TO3456", mileage: 24000, features: ["Captain Seats", "AC", "Touchscreen"], isFeatured: true, ratingsAverage: 4.5, ratingsCount: 76, images: [img("https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1200&q=80"), img("https://images.unsplash.com/photo-1609520505218-7421df709b76?w=1200&q=80")], createdBy: adminId },
  { name: "Mercedes-Benz E-Class", brand: "Mercedes-Benz", model: "E-Class", year: 2024, category: "Luxury", transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 9500, discountPercent: 15, location: "Mumbai", description: "Executive luxury sedan with cutting-edge technology and comfort.", licensePlate: "MH05MB7890", mileage: 12000, features: ["Massage Seats", "Ambient Lighting", "Premium Audio"], isFeatured: true, ratingsAverage: 4.9, ratingsCount: 64, images: [img("https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80"), img("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80")], createdBy: adminId },
  { name: "Hyundai Creta", brand: "Hyundai", model: "Creta", year: 2023, category: "SUV", transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 2800, location: "Chennai", description: "Stylish compact SUV with great features for daily commute.", licensePlate: "TN06HY2345", mileage: 21000, features: ["Sunroof", "Wireless Charging"], isFeatured: false, ratingsAverage: 4.4, ratingsCount: 143, images: [img("https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80"), img("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80")], createdBy: adminId },
  { name: "Royal Enfield Classic 350", brand: "Royal Enfield", model: "Classic 350", year: 2023, category: "Bike", transmission: "Manual", fuelType: "Petrol", seats: 2, pricePerDay: 900, location: "Goa", description: "Iconic cruiser bike perfect for scenic rides.", licensePlate: "GA07RE6789", mileage: 35000, features: ["ABS", "Dual Channel Braking"], isFeatured: false, ratingsAverage: 4.7, ratingsCount: 187, images: [img("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80"), img("https://images.unsplash.com/photo-1571646750134-38612495d3ee?w=1200&q=80")], createdBy: adminId },
  { name: "Ford Mustang GT", brand: "Ford", model: "Mustang GT", year: 2023, category: "Convertible", transmission: "Automatic", fuelType: "Petrol", seats: 4, pricePerDay: 12000, discountPercent: 8, location: "Mumbai", description: "Iconic American muscle car convertible for an exhilarating drive.", licensePlate: "MH08FM0123", mileage: 9800, features: ["Convertible Top", "Sport Mode", "Premium Sound"], isFeatured: true, ratingsAverage: 4.8, ratingsCount: 51, images: [img("https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=80"), img("https://images.unsplash.com/photo-1494905998402-395d579af36f?w=1200&q=80")], createdBy: adminId },
  { name: "Honda City", brand: "Honda", model: "City", year: 2023, category: "Sedan", transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 2200, location: "Hyderabad", description: "Reliable and comfortable sedan with excellent fuel economy.", licensePlate: "TS09HC4567", mileage: 27000, features: ["Cruise Control", "Rear Camera"], isFeatured: false, ratingsAverage: 4.5, ratingsCount: 165, images: [img("https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80"), img("https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=1200&q=80")], createdBy: adminId },
  { name: "Mahindra Thar", brand: "Mahindra", model: "Thar", year: 2023, category: "SUV", transmission: "Manual", fuelType: "Diesel", seats: 4, pricePerDay: 3200, location: "Jaipur", description: "Rugged off-road SUV built for adventure and tough terrain.", licensePlate: "RJ10MT8901", mileage: 19500, features: ["4x4", "Removable Roof", "Off-road Tyres"], isFeatured: true, ratingsAverage: 4.6, ratingsCount: 112, images: [img("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80"), img("https://images.unsplash.com/photo-1547038577-da80abbc4f19?w=1200&q=80")], createdBy: adminId },
  { name: "Audi Q7", brand: "Audi", model: "Q7", year: 2024, category: "Luxury", transmission: "Automatic", fuelType: "Petrol", seats: 7, pricePerDay: 10500, location: "Bangalore", description: "Full-size luxury SUV with premium quattro all-wheel drive.", licensePlate: "KA11AQ2345", mileage: 8000, features: ["Quattro AWD", "Bang & Olufsen Audio", "Matrix LED"], isFeatured: true, ratingsAverage: 4.9, ratingsCount: 39, images: [img("https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80"), img("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80")], createdBy: adminId },
  { name: "Kia Seltos", brand: "Kia", model: "Seltos", year: 2023, category: "SUV", transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 2900, location: "Kolkata", description: "Feature-loaded compact SUV with bold styling.", licensePlate: "WB12KS6789", mileage: 23000, features: ["Sunroof", "Ventilated Seats", "Bose Audio"], isFeatured: false, ratingsAverage: 4.4, ratingsCount: 88, images: [img("https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"), img("https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=1200&q=80")], createdBy: adminId },
];

/**
 * Populates the database with demo admin/customer accounts, vehicles, and coupons.
 * @param {Object} opts
 * @param {boolean} opts.force - if true, wipes existing Users/Vehicles/Coupons first (used by the CLI seed script).
 *                               if false, only seeds when there are zero vehicles (used for server auto-seed).
 */
export const seedDatabase = async ({ force = false } = {}) => {
  if (!force) {
    const existingVehicleCount = await Vehicle.countDocuments();
    if (existingVehicleCount > 0) {
      return { seeded: false, reason: "Vehicles already exist" };
    }
  } else {
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Coupon.deleteMany();
  }

  // Reuse an existing admin if present (e.g. auto-seed path where users already exist
  // but vehicles were somehow cleared), otherwise create the demo admin/customer.
  let admin = await User.findOne({ email: "admin@rentride.com" });
  if (!admin) {
    admin = await User.create({
      name: "Admin User",
      email: "admin@rentride.com",
      password: "admin123",
      role: "admin",
      phone: "9999999999",
    });
  }

  let customer = await User.findOne({ email: "customer@rentride.com" });
  if (!customer) {
    customer = await User.create({
      name: "John Customer",
      email: "customer@rentride.com",
      password: "customer123",
      role: "customer",
      phone: "8888888888",
    });
  }

  await Vehicle.insertMany(vehiclesData(admin._id));

  const existingCoupons = await Coupon.countDocuments();
  if (existingCoupons === 0) {
    await Coupon.create([
      { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxDiscountAmount: 1000, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), usageLimit: 500 },
      { code: "FLAT500", discountType: "flat", discountValue: 500, minBookingAmount: 3000, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), usageLimit: 200 },
    ]);
  }

  return { seeded: true };
};
