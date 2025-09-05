// controllers/transaction.controller.js
import * as transactionService from "../services/transaction.service.js";

/**
 * @description
 * Handles the creation of a new transaction.
 */
export const createTransaction = async (req, res) => {
  const { itemsSold, ...transactionData } = req.body;

  // Basic validation
  if (
    !transactionData.storeId ||
    !transactionData.cashierId ||
    !itemsSold ||
    itemsSold.length === 0
  ) {
    return res
      .status(400)
      .json({
        error: "Missing required transaction details or itemsSold array.",
      });
  }

  try {
    const newTransaction = await transactionService.processTransaction(
      transactionData,
      itemsSold
    );
    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error processing transaction:", error);
    if (error.message.includes("Insufficient stock")) {
      return res.status(409).json({ error: error.message });
    }
    return res
      .status(500)
      .json({
        error:
          "An internal server error occurred while processing the transaction.",
      });
  }
};
