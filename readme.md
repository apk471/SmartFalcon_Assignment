# Hyperledger Fabric Asset Management System

Blockchain-based financial asset management system built with Hyperledger Fabric.

## Output

Please check the outputs of the routes in ` SmartFalcone Output.pdf` file

## Assignment Overview

This project implements a complete blockchain solution for managing financial assets with features:

- Asset creation, updating, and querying
- Transaction tracking and history
- RESTful API for easy integration
- Docker containerization

## Prerequisites

- Docker & Docker Compose
- Node.js 16+
- Hyperledger Fabric 2.5+

## Quick Start

### Level 1: Setup Network

```bash
cd fabric-samples/test-network
./network.sh up createChannel -c mychannel
```

### Level 2: Deploy Chaincode

```bash
cd asset-transfer-basic/chaincode-typescript-asset-management
npm install && npm run build
```

### Level 3: Run REST API

```bash
cd asset-management-api
docker-compose up -d
```

## Architecture

```
┌─────────────┐
│ Client App │
└──────┬──────┘
│ HTTP/REST
┌──────▼──────┐
│ REST API │
└──────┬──────┘
│ Gateway
┌──────▼──────┐
│ Fabric │
│ Network │
│ (Peers + │
│ Orderers) │
└──────┬──────┘
│
┌──────▼──────┐
│ Chaincode │
│ (Smart │
│ Contract) │
└──────┬──────┘
│
┌──────▼──────┐
│ Ledger │
│ (Blockchain)│
└─────────────┘
```

## Technology Stack

- **Blockchain**: Hyperledger Fabric 2.5
- **Smart Contract**: TypeScript
- **REST API**: Node.js, Express
- **Containerization**: Docker
- **SDK**: Fabric Gateway SDK

## Asset Structure

```typescript
{
DEALERID: string,
MSISDN: string,
MPIN: string,
BALANCE: number,
STATUS: string,
TRANSAMOUNT: number,
TRANSTYPE: string,
REMARKS: string
}
```

## Testing

```bash

# Test chaincode directly

peer chaincode query -C mychannel -n assetmanagement -c '{"function":"GetAllAssets","Args":[]}'

# Test REST API

curl http://localhost:3000/api/assets
\`\`\`

## 📝 License

```
