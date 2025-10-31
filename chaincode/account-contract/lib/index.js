"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = void 0;
const accountContract_1 = require("./accountContract");
// Export as named export (TypeScript/ES module)
exports.contracts = [new accountContract_1.AccountContract()];
// Also provide CommonJS export for Fabric runtime that expects module.exports
module.exports = { contracts: exports.contracts };
