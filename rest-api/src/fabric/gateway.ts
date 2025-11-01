import { Gateway, Wallets } from "fabric-network";
import * as path from "path";
import * as fs from "fs";

export async function getContract() {
  const ccpPath = path.resolve(
    __dirname,
    "../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"
  );

  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  // Wallet to hold user credentials
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Identity name (must exist in wallet)
  const identity = await wallet.get("appUser");
  if (!identity) {
    throw new Error("appUser identity not found in wallet. Register it first.");
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("accountcc");
  return { gateway, contract };
}
