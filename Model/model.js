// File: models.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone_number: String,
  address: String,
  user_type: { type: String, enum: ["customer", "restaurant_owner", "driver", "admin"] },
  likes: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: String,
  cuisine_type: String,
  rating: { type: Number, min: 0, max: 5 },
  menu_items: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
  chefs: [{
    name: String,
    speciality: String,
    bio: String
  }]
});

const menuItemSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "User" },
  order_time: { type: Date, default: Date.now },
  scheduled_time: Date,
  is_preorder: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "in_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  total_amount: Number,
  items: [{
    menu_item: { type: Schema.Types.ObjectId, ref: "MenuItem" },
    quantity: Number,
    subtotal: Number,
  }],
  payment: {
    amount: Number,
    payment_method: String,
    status: { type: String, enum: ["pending", "completed", "failed"] },
    payment_time: Date,
  },
  special_instructions: String,
});

orderSchema.methods.schedulePreOrder = function (scheduledTime) {
  this.scheduled_time = scheduledTime;
  this.is_preorder = true;
  return this.save();
};

orderSchema.methods.cancelPreOrder = function () {
  if (this.is_preorder && this.status === "pending") {
    this.status = "cancelled";
    return this.save();
  }
  throw new Error("This order cannot be cancelled");
};

orderSchema.statics.findUpcomingPreOrders = function (restaurantId) {
  return this.find({
    restaurant: restaurantId,
    is_preorder: true,
    status: { $in: ["pending", "confirmed"] },
    scheduled_time: { $gt: new Date() },
  }).sort({ scheduled_time: 1 });
};

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  review_time: { type: Date, default: Date.now },
});

const promotionSchema = new Schema({
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  code: { type: String, required: true, unique: true },
  discount_amount: Number,
  start_date: Date,
  end_date: Date,
});

const chatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  chef: { type: Schema.Types.ObjectId, ref: "Restaurant.chefs" },
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
  sender_type: { type: String, enum: ["user", "restaurant", "chef"], required: true },
});

const userFollowsSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
  followed: { type: Schema.Types.ObjectId, ref: "User", required: true },
  follow_date: { type: Date, default: Date.now },
});

const activityFeedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  activity_type: { type: String, enum: ["like", "order", "review"], required: true },
  item: { type: Schema.Types.ObjectId, refPath: "item_type" },
  item_type: { type: String, enum: ["MenuItem", "Order", "Review"], required: true },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
const Order = mongoose.model("Order", orderSchema);
const Review = mongoose.model("Review", reviewSchema);
const Promotion = mongoose.model("Promotion", promotionSchema);
const Chat = mongoose.model("Chat", chatSchema);
const UserFollows = mongoose.model("UserFollows", userFollowsSchema);
const ActivityFeed = mongoose.model("ActivityFeed", activityFeedSchema);

module.exports = {
  User,
  Restaurant,
  MenuItem,
  Order,
  Review,
  Promotion,
  Chat,
  UserFollows,
  ActivityFeed
};
