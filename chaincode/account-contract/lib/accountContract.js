"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
class AccountContract extends fabric_contract_api_1.Contract {
    async CreateAccount(ctx, accountId, dealerId, msisdn, mpin, balanceStr) {
        const exists = await this.AccountExists(ctx, accountId);
        if (exists) {
            throw new Error(`Account ${accountId} already exists`);
        }
        const account = {
            accountId,
            DEALERID: dealerId,
            MSISDN: msisdn,
            MPIN: mpin,
            BALANCE: parseFloat(balanceStr),
            STATUS: "ACTIVE",
        };
        await ctx.stub.putState(accountId, Buffer.from(JSON.stringify(account)));
        return account;
    }
    async ReadAccount(ctx, accountId) {
        const data = await ctx.stub.getState(accountId);
        if (!data || data.length === 0) {
            throw new Error(`Account ${accountId} does not exist`);
        }
        return JSON.parse(data.toString());
    }
    async UpdateAccount(ctx, accountId, updatesJson) {
        const account = await this.ReadAccount(ctx, accountId);
        const updates = JSON.parse(updatesJson);
        Object.assign(account, updates);
        await ctx.stub.putState(accountId, Buffer.from(JSON.stringify(account)));
        return account;
    }
    async TransferAmount(ctx, fromId, toId, amountStr, transtype, remarks) {
        const amount = parseFloat(amountStr);
        const from = await this.ReadAccount(ctx, fromId);
        const to = await this.ReadAccount(ctx, toId);
        if (from.BALANCE < amount)
            throw new Error("Insufficient funds");
        from.BALANCE -= amount;
        from.TRANSAMOUNT = amount;
        from.TRANSTYPE = transtype;
        from.REMARKS = remarks;
        to.BALANCE += amount;
        to.TRANSAMOUNT = amount;
        to.TRANSTYPE = transtype;
        to.REMARKS = remarks;
        await ctx.stub.putState(fromId, Buffer.from(JSON.stringify(from)));
        await ctx.stub.putState(toId, Buffer.from(JSON.stringify(to)));
        return { from, to };
    }
    // Get transaction history for an account ID
    async GetHistoryForAccount(ctx, accountId) {
        const iterator = await ctx.stub.getHistoryForKey(accountId);
        const results = [];
        while (true) {
            const res = await iterator.next();
            if (res.value) {
                const record = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    value: res.value.value
                        ? JSON.parse(res.value.value.toString()) // ✅ just .toString(), no argument
                        : null,
                };
                results.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }
        return JSON.stringify(results);
    }
    async AccountExists(ctx, accountId) {
        const data = await ctx.stub.getState(accountId);
        return !!data && data.length > 0;
    }
}
exports.AccountContract = AccountContract;
