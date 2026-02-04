import mongoose from "mongoose"
const { Schema, model } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, 'Product Id is Required / الرقم المميز للمنتج مطلوب']
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is Required / الكمية مطلوبة'],
      min: [1, 'Quantity must be at least 1 / يجب أن تكون الكمية 1 على الأقل']
    },

    priceAtAddition: {
      type: Number,
      required: [true, 'Price at addition is Required / سعر الإضافة مطلوب']
    },

    totalItemPrice: {
      type: Number,
      required: [true, 'Total item price is Required / السعر الإجمالي مطلوب']
    }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    items: {
      type: [cartItemSchema],
      default: []
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ⭐ Virtual total price
CartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
});
// ⭐ Virtual total price
CartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = model("Cart", cartSchema);
export default Cart;