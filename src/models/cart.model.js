import mongoose from "mongoose";
const { Schema, model } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, 'Product Id is Required / الرقم المميز للمنتج مطلوب']
    },

    productNameAtAddition: {
      type: String,
      trim: true
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is Required / الكمية مطلوبة'],
      min: [1, 'Quantity must be at least 1 / يجب أن تكون الكمية 1 على الأقل']
    },

    priceAtAddition: {
      type: Number,
      required: [true, 'Price at addition is Required / سعر الإضافة مطلوب'],
      min: [0, 'Price must be positive']
    },

    totalItemPrice: {
      type: Number
    }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    items: {
      type: [cartItemSchema],
      default: []
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index
cartSchema.index({ user: 1 },{ unique:true });

// 🔹 Virtuals
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => 
    sum + (item.totalItemPrice || 0), 0
  );
});

cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// 🔹 Calculate totals
cartSchema.pre('save', function (next) {

  this.items.forEach(item => {
    item.totalItemPrice = item.quantity * item.priceAtAddition;
  });
});

const Cart = model("Cart", cartSchema);
export default Cart;
