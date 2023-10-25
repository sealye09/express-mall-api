import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: User ID associated with the address
 *         detail:
 *           type: string
 *           description: Address details
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Address creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Address last update timestamp
 */
const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    detail: { type: String },
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
