import { AccountContract } from "./accountContract";

// Export as named export (TypeScript/ES module)
export const contracts = [new AccountContract()];

// Also provide CommonJS export for Fabric runtime that expects module.exports
module.exports = { contracts };
