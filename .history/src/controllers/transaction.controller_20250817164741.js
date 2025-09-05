// controllers/transaction.controller.js
import * as transactionService from "../services/transaction.service.js";

/**
 * @description
 * Handles the creation of a new transaction.
 */
export const createTransaction = async (req, res) => {
  const { itemsSold, ...transactionData } = req.body;

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

/**
 * @description
 * Retrieves a list of all transactions for a specific store, with optional date filtering.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getTransactionsByStoreId = async (req, res) => {
  const { id: storeId } = req.params;
  const { startDate, endDate } = req.query; // Get date range from query parameters

  if (!storeId) {
    return res
      .status(400)
      .json({ error: "Missing store ID in request parameters." });
  }

  try {
    const transactions = await transactionService.getTransactionsByStoreId(
      parseInt(storeId),
      startDate,
      endDate
    );
    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this store." });
    }
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};
