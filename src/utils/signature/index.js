/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// export { Bls12381G2KeyPair } from "@mattrglobal/bls12381-key-pair";
// export { BbsBlsSignature2020 } from "./BbsBlsSignature2020";
// export { BbsBlsSignatureProof2020 } from "./BbsBlsSignatureProof2020";

// export { deriveProof } from "./deriveProof";

const { Bls12381G2KeyPair } = require("@mattrglobal/bls12381-key-pair");
const { BbsBlsSignature2020 } = require("./BbsBlsSignature2020");
const { BbsBlsSignatureProof2020 } = require("./BbsBlsSignatureProof2020");
const { deriveProof } = require("./deriveProof");

module.exports = {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
};