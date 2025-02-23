# Decentralized Identity System Solution

## Overview
A decentralized identity system design where Issuer, Holder, and Verifier components run on user frontends implemented with Vue.js, managing private keys locally. The backend manages DIDs and credential information for issuers and holders through a database. The Verifiable Data Registry (VDR) comprises blockchain and IPFS infrastructure:
- Holders register DIDs on blockchain
- Issuers register credential IDs on blockchain
![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/471dae0b-c5f0-46fd-ac08-7a46c1287291/f6d87a5a-29fe-43b5-9b6b-f77e3ce31c72/image.png)

## Design Objectives
* Selective Disclosure
* Non-Transferability 
* Unlinkability
* Credential Revocation

## System Architecture

### Architectural Diagram

```plaintext
+--------------------+        +--------------------+
|                    |        |                    |
|      Frontend      |        |       Backend      | 
|    (Vue.js App)    |        |      (Flask)       |
|                    |        |                    |
|  +--------------+  | <----> |  +--------------+  |
|  | BBS+ Sig/Ver |  |        |  |   Database   |  |
|  +--------------+  |        |  +--------------+  |
|                    |        |                    |
|                    |        |                    |
+--------------------+        +--------------------+
          |                              |
          v                              v
+--------------------+        +--------------------+
|                    |        |                    |
|       IPFS         |        |     Blockchain     |
|                    |        |                    |
|  +--------------+  |        |  +--------------+  |
|  |  Creds State |  |        |  |   DID Mgmt   |  |
|  +--------------+  |        |  | SmartContract|  |
|                    |        |  +--------------+  |
|                    |        |                    |
+--------------------+        +--------------------+
```

### Technology Stack

- **Frontend**
  - Vue
  - web3.js
  - Axios
  - JSON-LD & BBS+ Library (ref: https://github.com/mattrglobal/jsonld-signatures-bbs)
- **Backend**
  - Flask
  - Flask-login
  - SQLAlchemy
  - Blockchain

## System Module Design

### 1. User Registration & Authentication

- **Registration**
  - Parameters: `username`, `password`, `role`
  - Process:
    1. Frontend collects user information and sends POST request to `/api/register`
    2. Backend stores user information
    3. Returns registration success message

- **Login**
  - Parameters: `username`, `password`
  - Process:
    1. Frontend sends POST request to `/api/login`
    2. Backend verifies credentials, saves user ID to session
    3. Redirects to homepage

### 2. Holder Module

- **Register DID** (including others' DIDs)
  - Method: POST
  - Path: `/api/holder/{username}/registerdid`
  - Process:
    1. User interacts directly with blockchain through web3.js to register DID
    2. Displays list of registered DIDs

- **Apply for Credential** (and add credentials)
  - Method: POST
  - Path: `/api/holder/{username}/credentials/apply-credential`
  - Parameters: `username`, `did`, `issuer`, `scheme`, `attribute`
  - Process:
    1. Frontend sends credential application form to backend
    2. Backend adds credential application to corresponding issuer's `waited issued list` (DB of Backend)

- **View Credential**
  - Method: GET
  - Path: `/api/holder/{username}/credentials/{credentialID}`
  - Process:
    1. View specific credential

- **Generate Credential Presentation**
  - Method: POST
  - Path: `/api/holder/{username}/credentials/presentation-credential`
  - Parameters: `predicate`
  - Process:
    1. Frontend generates derived credential using BBS+ algorithm
    2. Displays Presentation (JSON)
    3. Future consideration: Generate QR code for Presentation

### 3. Issuer Module

- **Create Credential Template**
  - Method: POST
  - Path: `/api/issuer/{username}/template/create-template`
  - Process:
    1. Issuer inputs template attributes (JSON), initializes parameters using BBS+ algorithm
    2. Frontend sends template and corresponding BBS+ parameters to backend
    3. Backend saves credential template to template list

- **Issue Credential**
  - Method: POST
  - Path: `/api/issuer/{username}/credentials/issue-credential`
  - Process:
    1. Display corresponding issuer's `waited issued list` on frontend
    2. Select a credential and generate signature using BBS+ algorithm
    3. Send credential and signature to backend
    4. Backend saves credential to valid credential list
    5. Backend uploads credentialID to blockchain (smart contract)

- **Revoke Credential**
  - Method: POST
  - Path: `/api/holder/{username}/credentials/revoke-credential`
  - Parameters: `credentialID`
  - Process:
    1. Remove credentialID from blockchain

### JSON-LD & BBS+ Signature Library
References:
1. https://trinsic-id.github.io/json-bbs-signatures/#using-json-path
2. https://www.w3.org/TR/json-ld11/#advanced-concepts
3. https://github.com/mattrglobal/jsonld-signatures-bbs/tree/master

#### Functional Design
Implement BBS+ signature algorithm in JavaScript:
1. Implement credential template, credential, and credential presentation
2. Implement credentialSignature base class, BBS+Signature algorithm class, and Signature adapter

- **initCreds: Initialize Parameters**
  - Input: Credential template
  - Output: Generators, parameters of BBS

- **signCreds: Sign Credential**
  - Input: Credential request (JSON), issuer public key
  - Output: Credential & proof (JSON)

- **verifyCreds: Verify Credential**
  - Input: Credential & proof (JSON)
  - Output: 1/0

- **createPres: Create Verifiable Presentation**
  - Input: Credential & proof (JSON)
  - Output: Verifiable presentation (JSON)

- **verifyPres: Verify Presentation**
  - Input: Verifiable presentation (JSON)
  - Output: 1/0

#### Examples
[Previous JSON examples remain unchanged as they are already in English]

### Predicate Proof Implementation
Implementation of predicate proof on web client:
* Reference: https://github.com/iden3/wasmsnark
* Requirement: Prove that a is in commitment (BBS+) and satisfies a predicate
* Advanced requirement: Recursive SNARK

### Credential Revocation Proof
1. Develop a credential smart contract
2. Implement non-membership/membership proof (low priority)

## Database Design

### 1. Users Table

| Column Name       | Type         | Description              |
|------------------|--------------|--------------------------|
| username         | VARCHAR(50)  | Username                 |
| userid           | SERIAL       | User ID                  |
| Hash of password | SERIAL       | Password hash            |

### 2. User DID Table

| Column Name      | Type         | Description              |
|------------------|--------------|--------------------------|
| userid           | SERIAL       | User ID                  |
| userDID          | VARCHAR(50)  | User DID                 |
| public key       | VARCHAR(50)  | User public key          |

### 3. Credential Request Table

| Column Name      | Type         | Description              |
|------------------|--------------|--------------------------|
| CredentialID     | SERIAL       | Credential ID            |
| issuer DID       | SERIAL       | Issuer ID                |
| Credential Req   | JSON         | Credential request       |

### 4. Credentials Table

| Column Name      | Type         | Description              |
|------------------|--------------|--------------------------|
| credential ID    | SERIAL       | Credential ID            |
| holder DID       | SERIAL       | Username                 |
| expirationDate   | VARCHAR(50)  | Expiration date          |
| issueDate        | VARCHAR(50)  | Issue date               |
| credentialState  | BOOL         | Revocation status        |

### 5. Credential Template Table
[To be detailed based on specific requirements]