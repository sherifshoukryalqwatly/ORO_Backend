import mongoose from "mongoose"
const { Schema, model } = mongoose;
/* =====================
    ADDRESS
===================== */
const addressSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        country: String,
        city: String,
        area: String,
        street: String,
        building: String,
        notes: String,
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);


const Address = model('Address', addressSchema);
export default Address;