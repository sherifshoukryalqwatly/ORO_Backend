import mongoose from "mongoose";
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    label: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },

    country: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    area: { type: String, trim: true },
    street: { type: String, trim: true },
    building: { type: String, trim: true },

    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{8,15}$/, 'Invalid phone number']
    },

    notes: { type: String, trim: true, maxlength: 300 },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
    },

    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ location: '2dsphere' });
addressSchema.index({ user: 1, isDeleted: 1 });


addressSchema.pre('save', async function (next) {
  if (!this.isDefault) return ;

  await this.constructor.updateMany(
    { user: this.user, _id: { $ne: this._id } },
    { $set: { isDefault: false } }
  );

});

const Address = model('Address', addressSchema);
export default Address;
