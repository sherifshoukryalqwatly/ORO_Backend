import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderItemSchema = new Schema(
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

    priceAtTime: {
      type: Number,
      required: [true, 'Product price is Required / سعر المنتج مطلوب']
    },

    totalItemPrice: {
      type: Number,
      required: [true, 'Total item price is Required / السعر الإجمالي مطلوب']
    }
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is Required / الاسم الكامل مطلوب']
    },

    phone: {
      type: String,
      required: [true, 'Phone number is Required / رقم الهاتف مطلوب']
    },

    city: {
      type: String,
      required: [true, 'City is Required / المدينة مطلوبة']
    },

    street: {
      type: String,
      required: [true, 'Street is Required / الشارع مطلوب']
    },

    building: {
      type: String,
      required: [true, 'Building is Required / المبنى مطلوب']
    },

    notes: { type: String }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are Required / عناصر الطلب مطلوبة']
    },

    shippingAddress: {
      type: addressSchema,
      required: [true, 'Shipping Address is Required / عنوان الشحن مطلوب']
    },

    paymentMethod: {
      type: String,
      enum: {
        values: ['COD'],
        message: 'Invalid Payment Method / طريقة الدفع غير صالحة'
      },
      required: [true, 'Payment method is Required / طريقة الدفع مطلوبة']
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        message: 'Invalid Order Status / حالة الطلب غير صالحة'
      },
      default: 'pending'
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    },

    couponDiscount: {
      type: Number,
      default: 0
    },

    subtotalPrice: {
      type: Number,
      required: [true, 'Subtotal price is Required / السعر قبل الخصم مطلوب']
    },

    shippingFee: {
      type: Number,
      required: [true, 'Shipping fee is Required / تكلفة الشحن مطلوبة']
    },

    finalPrice: {
      type: Number,
      required: [true, 'Final price is Required / السعر النهائي مطلوب']
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

// ⭐ Virtual: total quantity
OrderSchema.virtual('totalQuantity').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Order = model("Order", orderSchema);
export default Order;