import Address from "../models/Address.js";
import User from "../models/User.js";

/**
 * @swagger
 * /api/users/address/{id}:
 *   get:
 *     summary: Get user address
 *     description: Retrieve the user's addresses, including the default address, by user ID.
 *     tags: [Addresses]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User address fetched successfully.
 *       401:
 *         description: Invalid user id.
 *       500:
 *         description: Internal server error.
 */
export async function getUserAddress(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("address").populate("default_address").exec();
    if (!user) {
      res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }
    const address = user.address;
    res.status(200).json({
      code: 200,
      message: "User address fetched successfully",
      data: { address, default_address: user.default_address },
    });
  } catch (error) {
    console.error("Error getting user address:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/users/address:
 *   post:
 *     summary: Add user address
 *     description: Add a new address for the user and set it as the default address if the user doesn't have one.
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               detail:
 *                 type: string
 *                 description: Address details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User address added successfully.
 *       401:
 *         description: Invalid user id.
 *       500:
 *         description: Internal server error.
 */
export async function addUserAddress(req, res) {
  const { id, detail } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }

    const newAddress = await Address.create({ detail, user: id });
    user.address.push(newAddress._id);

    // 如果用户没有默认地址，则将添加的地址设置为默认地址
    if (!user.default_address) {
      user.default_address = newAddress._id;
    }

    await user.save();

    res.status(200).json({
      code: 200,
      message: "User address added successfully",
      data: { address: newAddress },
    });
  } catch (error) {
    console.error("Error adding user address:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/users/address/update:
 *   post:
 *     summary: Update user address
 *     description: Update an existing address for the user.
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               address:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Address ID
 *                   detail:
 *                     type: string
 *                     description: Address details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User address updated successfully.
 *       401:
 *         description: Invalid address id or user id.
 *       500:
 *         description: Internal server error.
 */
export async function updateUserAddress(req, res) {
  const { id, address } = req.body;
  try {
    const addressToUpdate = await Address.findById(address.id);
    const userId = addressToUpdate.user;

    if (!addressToUpdate) {
      return res.status(401).json({ code: 401, message: "Invalid address id", data: {} });
    }
    if (userId != id) {
      return res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }

    addressToUpdate.detail = address.detail;
    await addressToUpdate.save();

    res.status(200).json({
      code: 200,
      message: "User address updated successfully",
      data: { address: addressToUpdate },
    });
  } catch (error) {
    console.error("Error updating user address:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/users/address/default:
 *   post:
 *     summary: Update user default address
 *     description: Update the user's default address.
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               addressId:
 *                 type: string
 *                 description: Address ID to set as default
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default address updated successfully.
 *       401:
 *         description: Invalid user id or address not found.
 *       500:
 *         description: Internal server error.
 */
export async function updateUserDefaultAddress(req, res) {
  const { id, addressId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(401).json({ code: 401, message: "Address not found", data: {} });
    }

    user.default_address = address._id;
    await user.save();

    res.status(200).json({ code: 200, message: "Default address updated successfully", data: {} });
  } catch (error) {
    console.error("Error updating default address:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}

/**
 * @swagger
 * /api/users/address/delete:
 *   delete:
 *     summary: Delete user address
 *     description: Delete a user's address by ID.
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *               addressId:
 *                 type: string
 *                 description: Address ID to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User address deleted successfully.
 *       401:
 *         description: Invalid user id or address not found.
 *       500:
 *         description: Internal server error.
 */
export async function deleteAddress(req, res) {
  const { id, addressId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ code: 401, message: "Invalid user id", data: {} });
    }

    // 查找要删除的地址在用户地址数组中的索引
    const addressIndex = user.address.findIndex((item) => item._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(401).json({ code: 401, message: "Address not found", data: {} });
    }

    // 从用户地址数组中移除对应的地址
    user.address.splice(addressIndex, 1);

    // 如果要删除的地址是用户的默认地址，则将用户的默认地址设置为用户地址数组中的第一个地址
    if (user.default_address.toString() === addressId) {
      user.default_address = user.address[0]._id;
    }

    await user.save();

    // 删除地址
    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ code: 200, message: "User address deleted successfully", data: {} });
  } catch (error) {
    console.error("Error deleting user address:", error);
    res.status(500).json({ code: 500, message: "Internal server error", data: {} });
  }
}
