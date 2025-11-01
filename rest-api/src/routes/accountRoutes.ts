import express from "express";
import { getContract } from "../fabric/gateway.js";

const router = express.Router();

// POST /createAccount
router.post("/createAccount", async (req, res) => {
  try {
    const { accountId, dealerId, msisdn, mpin, balance } = req.body;
    const { gateway, contract } = await getContract();

    await contract.submitTransaction(
      "CreateAccount",
      accountId,
      dealerId,
      msisdn,
      mpin,
      balance.toString()
    );

    await gateway.disconnect();
    res.json({ message: "✅ Account created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /getAccount/:id
router.get("/getAccount/:id", async (req, res) => {
  try {
    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction(
      "ReadAccount",
      req.params.id
    );
    await gateway.disconnect();
    res.json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/createAccount", async (req, res) => {
  try {
    const { accountId, dealerId, msisdn, mpin, balance } = req.body;
    const { gateway, contract } = await getContract();

    await contract.submitTransaction(
      "CreateAccount",
      accountId,
      dealerId,
      msisdn,
      mpin,
      balance.toString()
    );

    await gateway.disconnect();
    res.json({ message: "✅ Account created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/accounts/:id", async (req, res) => {
  try {
    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction(
      "ReadAccount",
      req.params.id
    );
    await gateway.disconnect();
    res.json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/accounts/:id", async (req, res) => {
  try {
    const accountId = req.params.id;
    const updates = req.body; // expect JSON object
    const { gateway, contract } = await getContract();

    await contract.submitTransaction(
      "UpdateAccount",
      accountId,
      JSON.stringify(updates)
    );

    await gateway.disconnect();
    res.json({ message: `✅ Account ${accountId} updated successfully` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/accounts/transfer", async (req, res) => {
  try {
    const { from, to, amount, transtype, remarks } = req.body;
    const { gateway, contract } = await getContract();

    await contract.submitTransaction(
      "TransferAmount",
      from,
      to,
      amount.toString(),
      transtype,
      remarks
    );

    await gateway.disconnect();
    res.json({ message: "💸 Transfer successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/accounts/:id/history", async (req, res) => {
  try {
    const { gateway, contract } = await getContract();
    const result = await contract.evaluateTransaction(
      "GetHistoryForAccount",
      req.params.id
    );
    await gateway.disconnect();
    res.json(JSON.parse(result.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
