import { Context, Contract } from "fabric-contract-api";

interface Account {
  accountId: string;
  DEALERID: string;
  MSISDN: string;
  MPIN: string;
  BALANCE: number;
  STATUS: string;
  TRANSAMOUNT?: number;
  TRANSTYPE?: string;
  REMARKS?: string;
}

export class AccountContract extends Contract {
  async CreateAccount(
    ctx: Context,
    accountId: string,
    dealerId: string,
    msisdn: string,
    mpin: string,
    balanceStr: string
  ) {
    const exists = await this.AccountExists(ctx, accountId);
    if (exists) {
      throw new Error(`Account ${accountId} already exists`);
    }
    const account: Account = {
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

  async ReadAccount(ctx: Context, accountId: string) {
    const data = await ctx.stub.getState(accountId);
    if (!data || data.length === 0) {
      throw new Error(`Account ${accountId} does not exist`);
    }
    return JSON.parse(data.toString());
  }

  async UpdateAccount(ctx: Context, accountId: string, updatesJson: string) {
    const account = await this.ReadAccount(ctx, accountId);
    const updates = JSON.parse(updatesJson);
    Object.assign(account, updates);
    await ctx.stub.putState(accountId, Buffer.from(JSON.stringify(account)));
    return account;
  }

  async TransferAmount(
    ctx: Context,
    fromId: string,
    toId: string,
    amountStr: string,
    transtype: string,
    remarks: string
  ) {
    const amount = parseFloat(amountStr);
    const from = await this.ReadAccount(ctx, fromId);
    const to = await this.ReadAccount(ctx, toId);
    if (from.BALANCE < amount) throw new Error("Insufficient funds");
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
  public async GetHistoryForAccount(
    ctx: Context,
    accountId: string
  ): Promise<string> {
    const iterator = await ctx.stub.getHistoryForKey(accountId);
    const results: any[] = [];

    while (true) {
      const res = await iterator.next();
      if (res.value) {
        const record = {
          txId: res.value.txId,
          timestamp: res.value.timestamp,
          isDelete: res.value.isDelete,
          value: res.value.value
            ? JSON.parse(res.value.value.toString())
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

  public async Ping(ctx: Context): Promise<string> {
    console.log("✅ Chaincode Ping() function executed successfully!");
    return "Ping successful! Chaincode is up and running 🚀";
  }

  async AccountExists(ctx: Context, accountId: string) {
    const data = await ctx.stub.getState(accountId);
    return !!data && data.length > 0;
  }
}
