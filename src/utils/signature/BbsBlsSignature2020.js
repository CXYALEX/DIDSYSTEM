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

/* eslint-disable @typescript-eslint/no-explicit-any */
// import jsonld from "jsonld";
// import { suites, SECURITY_CONTEXT_URL } from "jsonld-signatures";
// import { Bls12381G2KeyPair } from "@mattrglobal/bls12381-key-pair";

// import { w3cDate } from "./util";

const jsonld = require("jsonld");
const { suites, SECURITY_CONTEXT_URL } = require("jsonld-signatures");
const { Bls12381G2KeyPair } = require("@mattrglobal/bls12381-key-pair");

const { w3cDate } = require("./util");

/**
 * A BBS+ signature suite for use with BLS12-381 key pairs
 */
class BbsBlsSignature2020 extends suites.LinkedDataProof {
  /**
   * Default constructor
   * @param options {SignatureSuiteOptions} options for constructing the signature suite
   */
  constructor(options = {}) {
    const {
      verificationMethod,
      signer,
      key,
      date,
      useNativeCanonize,
      LDKeyClass,
    } = options;
    // validate common options
    if (
      verificationMethod !== undefined &&
      typeof verificationMethod !== "string"
    ) {
      throw new TypeError('"verificationMethod" must be a URL string.');
    }
    super({
      type: "sec:BbsBlsSignature2020",
    });

    this.proof = {
      "@context": [
        {
          sec: "https://w3id.org/security#",
          proof: {
            "@id": "sec:proof",
            "@type": "@id",
            "@container": "@graph",
          },
        },
        "https://w3id.org/security/bbs/v1",
      ],
      type: "BbsBlsSignature2020",
    };

    this.LDKeyClass = LDKeyClass ?? Bls12381G2KeyPair;
    this.signer = signer;
    this.verificationMethod = verificationMethod;
    this.proofSignatureKey = "proofValue";
    if (key) {
      if (verificationMethod === undefined) {
        this.verificationMethod = key.id;
      }
      this.key = key;
      if (typeof key.signer === "function") {
        this.signer = key.signer();
      }
      if (typeof key.verifier === "function") {
        this.verifier = key.verifier();
      }
    }
    if (date) {
      this.date = new Date(date);
      if (isNaN(this.date)) {
        throw TypeError(`"date" "${date}" is not a valid date.`);
      }
    }
    this.useNativeCanonize = useNativeCanonize;
  }

  /**
   * @param options {CreateProofOptions} options for creating the proof
   *
   * @returns {Promise<object>} Resolves with the created proof object.
   */
  async createProof(options) {
    const { document, purpose, documentLoader, expansionMap, compactProof } =
      options;

    let proof;
    if (this.proof) {
      // use proof JSON-LD document passed to API
      proof = await jsonld.compact(this.proof, SECURITY_CONTEXT_URL, {
        documentLoader,
        expansionMap,
        compactToRelative: false,
      });
    } else {
      // create proof JSON-LD document
      proof = { "@context": SECURITY_CONTEXT_URL };
    }

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if (proof.created === undefined && date === undefined) {
      date = new Date();
    }

    // ensure date is in string format
    if (date !== undefined && typeof date !== "string") {
      date = w3cDate(date);
    }

    // add API overrides
    if (date !== undefined) {
      proof.created = date;
    }

    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }

    // allow purpose to update the proof; the `proof` is in the
    // SECURITY_CONTEXT_URL `@context` -- therefore the `purpose` must
    // ensure any added fields are also represented in that same `@context`
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap,
    });

    // create data to sign
    var verifyData = (
      await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof,
      })
    ).map((item) => new Uint8Array(Buffer.from(item)));
    console.warn("Creating proof using wasm module");
    console.warn("!!!messages decoded: ", verifyData.map(arr => {
      return new TextDecoder().decode(arr);
    }));
    var decodedmessage = verifyData.map(arr => {
      return new TextDecoder().decode(arr);
    })
    var decodedmessage2 = verifyData.map(arr => {
      return new TextDecoder().decode(arr);
    })

    var newMessages=[]
    for (var item in decodedmessage)
      newMessages.push(decodedmessage[item])


    for (var item in decodedmessage2){
      if(decodedmessage2[item].indexOf("#int>")!=-1){
          var attributeNameStart=decodedmessage2[item].indexOf("#")
          var start=decodedmessage2[item].indexOf("\"")
          var attributeName=decodedmessage2[item].substring(attributeNameStart+1,start)
          attributeName=attributeName.substring(0,attributeName.indexOf(">"))
          var end=decodedmessage2[item].lastIndexOf("\"")
          var attributeValue=decodedmessage2[item].substring(start+1,end)
          console.log(attributeValue)
          if(this.isIntegerUsingParseInt(attributeValue)){
            newMessages.push(attributeValue)
          }
      }
    }

   console.log("new message to be signed:",newMessages)

   verifyData = newMessages.map((item) => new Uint8Array(Buffer.from(item)));

    // sign data
    proof = await this.sign({
      verifyData,
      document,
      proof,
      documentLoader,
      expansionMap,
    });

    return proof;
  }


   isIntegerUsingParseInt(str) {
    const num = parseInt(str, 10);
    return !isNaN(num) && num.toString() === str;
}

  /**
   * @param options {object} options for verifying the proof.
   *
   * @returns {Promise<{object}>} Resolves with the verification result.
   */
  async verifyProof(options) {
    const { proof, document, documentLoader, expansionMap, purpose } = options;

    try {
      // create data to verify
      var verifyData = (
        await this.createVerifyData({
          document,
          proof,
          documentLoader,
          expansionMap,
          compactProof: false,
        })
      ).map((item) => new Uint8Array(Buffer.from(item)));


    var decodedmessage = verifyData.map(arr => {
          return new TextDecoder().decode(arr);
        })
    var decodedmessage2 = verifyData.map(arr => {
          return new TextDecoder().decode(arr);
        })

    var newMessages=[]
    for (var item in decodedmessage)
      newMessages.push(decodedmessage[item])

    for (var item in decodedmessage2){
      if(decodedmessage2[item].indexOf("#int>")!=-1){
          var start=decodedmessage2[item].indexOf("\"")
          var end=decodedmessage2[item].lastIndexOf("\"")
          var attributeValue=decodedmessage2[item].substring(start+1,end)
          if(this.isIntegerUsingParseInt(attributeValue)){
            newMessages.push(attributeValue)
          }
      }
    }
    // console.log("message to be verified:",newMessages)
    verifyData = newMessages.map((item) => new Uint8Array(Buffer.from(item)));

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap,
      });
      console.log("verifyData",newMessages)
      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        document,
        proof,
        documentLoader,
        expansionMap,
      });
      if (!verified) {
        throw new Error("Invalid signature.");
      }

      // ensure proof was performed for a valid purpose
      const { valid, error } = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap,
      });
      if (!valid) {
        throw error;
      }

      return { verified: true };
    } catch (error) {
      return { verified: false, error };
    }
  }

  async canonize(input, options) {
    const { documentLoader, expansionMap, skipExpansion } = options;
    return jsonld.canonize(input, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: this.useNativeCanonize,
    });
  }

  async canonizeProof(proof, options) {
    const { documentLoader, expansionMap } = options;
    proof = { ...proof };
    delete proof[this.proofSignatureKey];
    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false,
    });
  }

  /**
   * @param document {CreateVerifyDataOptions} options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyData(options) {
    const { proof, document, documentLoader, expansionMap } = options;

    const proofStatements = await this.createVerifyProofData(proof, {
      documentLoader,
      expansionMap,
    });
    const documentStatements = await this.createVerifyDocumentData(document, {
      documentLoader,
      expansionMap,
    });

    // concatenate c14n proof options and c14n document
    return proofStatements.concat(documentStatements);
  }

  /**
   * @param proof to canonicalize
   * @param options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyProofData(
    proof,
    { documentLoader, expansionMap }
  ) {
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap,
    });

    return c14nProofOptions.split("\n").filter((_) => _.length > 0);
  }

  /**
   * @param document to canonicalize
   * @param options to create verify data
   *
   * @returns {Promise<{string[]>}.
   */
  async createVerifyDocumentData(
    document,
    { documentLoader, expansionMap }
  ) {
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap,
    });

    return c14nDocument.split("\n").filter((_) => _.length > 0);
  }

  /**
   * @param document {object} to be signed.
   * @param proof {object}
   * @param documentLoader {function}
   * @param expansionMap {function}
   */
  async getVerificationMethod({ proof, documentLoader }) {
    let { verificationMethod } = proof;

    if (typeof verificationMethod === "object") {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it
    const result = await jsonld.frame(
      verificationMethod,
      {
        "@context": [
          "https://w3id.org/security/v2",
          "https://w3id.org/security/suites/jws-2020/v1",
        ],
        "@embed": "@always",
        id: verificationMethod,
      },
      {
        documentLoader,
        compactToRelative: false,
        expandContext: SECURITY_CONTEXT_URL,
      }
    );
    if (!result) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // ensure verification method has not been revoked
    if (result.revoked !== undefined) {
      throw new Error("The verification method has been revoked.");
    }

    return result;
  }

  /**
   * @param options {SuiteSignOptions} Options for signing.
   *
   * @returns {Promise<{object}>} the proof containing the signature value.
   */
  async sign(options) {
    const { verifyData, proof } = options;

    if (!(this.signer && typeof this.signer.sign === "function")) {
      throw new Error(
        "A signer API with sign function has not been specified."
      );
    }

    const proofValue = await this.signer.sign({
      data: verifyData,
    });

    proof[this.proofSignatureKey] = Buffer.from(proofValue).toString("base64");

    return proof;
  }

  /**
   * @param verifyData {VerifySignatureOptions} Options to verify the signature.
   *
   * @returns {Promise<boolean>}
   */
  async verifySignature(options) {
    const { verificationMethod, verifyData, proof } = options;
    let { verifier } = this;

    if (!verifier) {
      const key = verificationMethod.publicKeyJwk
        ? await this.LDKeyClass.fromJwk(verificationMethod)
        : await this.LDKeyClass.from(verificationMethod);
      verifier = key.verifier(key, this.alg, this.type);
    }

    return await verifier.verify({
      data: verifyData,
      signature: new Uint8Array(
        Buffer.from(proof[this.proofSignatureKey], "base64")
      ),
    });
  }

  static proofType = [
    "BbsBlsSignature2020",
    "sec:BbsBlsSignature2020",
    "https://w3id.org/security#BbsBlsSignature2020",
  ];
}

module.exports = {
  BbsBlsSignature2020,
};