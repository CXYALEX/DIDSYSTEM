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

const jsonld = require("jsonld");
const { suites, SECURITY_CONTEXT_URL } = require("jsonld-signatures");
const { randomBytes } = require("@stablelib/random");
const { Bls12381G2KeyPair } = require("@mattrglobal/bls12381-key-pair");

const { BbsBlsSignature2020 } = require("./BbsBlsSignature2020");
const { blsCreateProofMulti, blsVerifyProofMulti } = require("../bbs/wasm_module");
// const { blsCreateProof, blsVerifyProof } = require("../bbs/wasm_module");

class BbsBlsSignatureProof2020 extends suites.LinkedDataProof {
  constructor({ useNativeCanonize, key, LDKeyClass } = {}) {
    super({
      type: "sec:BbsBlsSignatureProof2020",
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
      type: "BbsBlsSignatureProof2020",
    };
    this.mappedDerivedProofType =
      "https://w3id.org/security#BbsBlsSignature2020";
    this.supportedDeriveProofType =
      BbsBlsSignatureProof2020.supportedDerivedProofType;

    this.LDKeyClass = LDKeyClass ?? Bls12381G2KeyPair;
    this.proofSignatureKey = "proofValue";
    this.key = key;
    this.useNativeCanonize = useNativeCanonize;
  }

  /**
   * Derive a proof from a proof and reveal document
   *
   * @param options {object} options for deriving a proof.
   *
   * @returns {Promise<object>} Resolves with the derived proof object.
   */
  async deriveProof(options) {
    const {
      document,
      proof,
      revealDocument,
      documentLoader,
      expansionMap,
      skipProofCompaction,
    } = options;
    let { nonce } = options;

    // Validate that the input proof document has a proof compatible with this suite
    if (
      !BbsBlsSignatureProof2020.supportedDerivedProofType.includes(proof.type)
    ) {
      throw new TypeError(
        `proof document proof incompatible, expected proof types of ${JSON.stringify(
          BbsBlsSignatureProof2020.supportedDerivedProofType
        )} received ${proof.type}`
      );
    }

    //Extract the BBS signature from the input proof
    const signature = Buffer.from(proof[this.proofSignatureKey], "base64");

    //Initialize the BBS signature suite
    const suite = new BbsBlsSignature2020();

    //Initialize the derived proof
    let derivedProof;
    if (this.proof) {
      // use proof JSON-LD document passed to API
      derivedProof = await jsonld.compact(this.proof, SECURITY_CONTEXT_URL, {
        documentLoader,
        expansionMap,
        compactToRelative: false,
      });
    } else {
      // create proof JSON-LD document
      derivedProof = { "@context": SECURITY_CONTEXT_URL };
    }
    // ensure proof type is set
    derivedProof.type = this.type;

    // Get the input document statements
    const documentStatements = await suite.createVerifyDocumentData(document, {
      documentLoader,
      expansionMap,
      compactProof: !skipProofCompaction,
    });

    // Get the proof statements
    const proofStatements = await suite.createVerifyProofData(proof, {
      documentLoader,
      expansionMap,
      compactProof: !skipProofCompaction,
    });

    // Transform any blank node identifiers for the input
    // document statements into actual node identifiers
    // e.g _:c14n0 => urn:bnid:_:c14n0
    const transformedInputDocumentStatements = documentStatements.map(
      (element) => element.replace(/(_:c14n[0-9]+)/g, "<urn:bnid:$1>")
    );

    //Transform the resulting RDF statements back into JSON-LD
    const compactInputProofDocument = await jsonld.fromRDF(
      transformedInputDocumentStatements.join("\n")
    );
    console.log("stemp2",compactInputProofDocument,revealDocument,{documentLoader})
    // Frame the result to create the reveal document result
    const revealDocumentResult = await jsonld.frame(
      compactInputProofDocument,
      revealDocument,
      { documentLoader },

    );
    console.log("stemp3")
    // Canonicalize the resulting reveal document
    const revealDocumentStatements = await suite.createVerifyDocumentData(
      revealDocumentResult,
      {
        documentLoader,
        expansionMap,
      }
    );


    //Get the indicies of the revealed statements from the transformed input document offset
    //by the number of proof statements
    const numberOfProofStatements = proofStatements.length;

    console.warn("Reveal document statements: ", revealDocument.credentialSubject);

    //Always reveal all the statements associated to the original proof
    //these are always the first statements in the normalized form
    const proofRevealIndicies = Array.from(
      Array(numberOfProofStatements).keys()
    );

    //Reveal the statements indicated from the reveal document
    const documentRevealIndicies = revealDocumentStatements.map(
      (key) =>
        transformedInputDocumentStatements.indexOf(key) +
        numberOfProofStatements
    );

    // Check there is not a mismatch
    if (documentRevealIndicies.length !== revealDocumentStatements.length) {
      throw new Error(
        "Some statements in the reveal document not found in original proof"
      );
    }

    // Combine all indicies to get the resulting list of revealed indicies
    const revealIndicies = proofRevealIndicies.concat(documentRevealIndicies);

    // Create a nonce if one is not supplied
    if (!nonce) {
      nonce = await randomBytes(50);
    }

    // Set the nonce on the derived proof
    derivedProof.nonce = Buffer.from(nonce).toString("base64");

    //Combine all the input statements that
    //were originally signed to generate the proof
    const allInputStatements = proofStatements
      .concat(documentStatements)
      .map((item) => new Uint8Array(Buffer.from(item)));



    
    // Fetch the verification method
    const verificationMethod = await this.getVerificationMethod({
      proof,
      document,
      documentLoader,
      expansionMap,
    });

    // Construct a key pair class from the returned verification method
    const key = verificationMethod.publicKeyJwk
      ? await this.LDKeyClass.fromJwk(verificationMethod)
      : await this.LDKeyClass.from(verificationMethod);

    // Compute the proof


    // const outputProof = await blsCreateProof({
    //   signature: new Uint8Array(signature),
    //   publicKey: new Uint8Array(key.publicKeyBuffer),
    //   messages: allInputStatements,
    //   nonce: nonce,
    //   revealed: revealIndicies,
    // });
    console.warn("Creating proof using wasm module");
    console.warn("messages decoded: ", allInputStatements.map(arr => {
      return new TextDecoder().decode(arr);
    }));

    // var decodedmessage = allInputStatements.map(arr => {
    //   return new TextDecoder().decode(arr);
    // })
    // var decodedmessage2 = allInputStatements.map(arr => {
    //   return new TextDecoder().decode(arr);
    // })

    // var newMessages=[]
    // for (var item in decodedmessage)
    //   newMessages.push(decodedmessage[item])

    // for (var item in decodedmessage2){
    //   if(decodedmessage2[item].indexOf("#int>")!=-1){
    //       var attributeNameStart=decodedmessage2[item].indexOf("#")
    //       var start=decodedmessage2[item].indexOf("\"")
    //       var attributeName=decodedmessage2[item].substring(attributeNameStart+1,start)
    //       attributeName=attributeName.substring(0,attributeName.indexOf(">"))
    //       var end=decodedmessage2[item].lastIndexOf("\"")
    //       var attributeValue=decodedmessage2[item].substring(start+1,end)
    //       console.log(attributeValue)
    //       if(this.isIntegerUsingParseInt(attributeValue)){
    //         newMessages.push(attributeValue)
    //       }
    //   }
    // }
    // const decodedMessages = allInputStatements.map(arr => new TextDecoder().decode(arr));
    // const newMessages = [...decodedMessages];
    
    // // 用于存储整数相关信息
    // const integerInfo = [];
    
    // // 处理整数属性
    // decodedMessages.forEach((message, originalIndex) => {
    //   if (message.includes("#int>")) {
    //     const valueStart = message.indexOf("\"");
    //     const valueEnd = message.lastIndexOf("\"");
    //     const value = message.substring(valueStart + 1, valueEnd);
        
    //     if (this.isIntegerUsingParseInt(value)) {
    //       integerInfo.push({
    //         value,
    //         originalIndex,
    //         newIndex: newMessages.length  // 将要添加到的新位置
    //       });
    //       newMessages.push(value);
    //     }
    //   }
    // });
    
    // console.log("Integer Information:", integerInfo);
    // console.log("Messages to be verified:", newMessages);
    
    // const verifyData = newMessages.map(item => new Uint8Array(Buffer.from(item)));
    const decodedMessages = allInputStatements.map(arr => new TextDecoder().decode(arr));
    const newMessages = [...decodedMessages];

    // 先获取 rangeFields
    const credentialSubject = revealDocument.credentialSubject;
    const rangeFields = [];

    // 获取所有带range的字段
    Object.entries(credentialSubject).forEach(([fieldName, value]) => {
        if (typeof value === 'string' && value.includes('range-')) {
            const [, min, max] = value.split('-');
            rangeFields.push({
                fieldName,
                min: parseInt(min),
                max: parseInt(max)
            });
        }
    });

    // 用于存储整数相关信息
    const integerInfo = [];

    // 处理整数属性
    decodedMessages.forEach((message, originalIndex) => {
      // 首先检查是否是 #int> 类型
      if (message.includes("#int>")) {
          const valueStart = message.indexOf("\"");
          const valueEnd = message.lastIndexOf("\"");
          const value = message.substring(valueStart + 1, valueEnd);
          
          if (this.isIntegerUsingParseInt(value)) {
              // 添加到 newMessages
              const newIndex = newMessages.length;
              newMessages.push(value);
              
              // 检查是否匹配任何 rangeFields 中的字段名
              const matchingField = rangeFields.find(field => 
                  message.includes(field.fieldName)
              );
              
              // 如果找到匹配的字段名，则添加到 integerInfo
              if (matchingField) {
                  integerInfo.push({
                      fieldName: matchingField.fieldName,
                      value,
                      originalIndex,
                      newIndex,
                      range: {
                          min: matchingField.min,
                          max: matchingField.max
                      }
                  });
              }
          }
      }
    });
  

    console.log("Range Fields:", rangeFields);
    console.log("Integer Information:", integerInfo);
    console.log("Messages to be verified:", newMessages);

    const verifyData = newMessages.map(item => new Uint8Array(Buffer.from(item)));

    const modifiedMessages = verifyData.map(arr => {
      // 创建一个新的 Uint8Array，长度比原数组多1
      const newArr = new Uint8Array(arr.length + 1);
      // 第一位设为0
      newArr[0] = 0;
      // 将原数组的内容复制到新数组的后面
      newArr.set(arr, 1);
      return newArr;
    });

    // console.warn("modifiedMessages: ", modifiedMessages);
    // let range = [[16, 18, 60]];
    const range = integerInfo.map(info => [
      info.newIndex,
      info.range.min,
      info.range.max
    ]);
    console.warn("range: ", range);

    const outputProof = await blsCreateProofMulti({
      signature: [new Uint8Array(signature)], 
      publicKey: [new Uint8Array(key.publicKeyBuffer)],
      messages: [modifiedMessages], 
      nonce: nonce,
      revealed: [revealIndicies], 
      equivs: [[]], 
      range: [range] 
    }); 

    // console.warn("signature: ", [new Uint8Array(signature)]);
    // console.warn("publicKey: ", [new Uint8Array(key.publicKeyBuffer)]);
    // console.warn("messages: ", [modifiedMessages]);
    // console.warn("nonce: ", nonce);
    // console.warn("revealed: ", [revealIndicies]);
    // console.warn("Output proof: ", outputProof);
    
    // Set the proof value on the derived proof
    // derivedProof.proofValue = Buffer.from(outputProof).toString("base64");
    const base64Proof = outputProof.map(innerArray => {
      return Buffer.from(innerArray).toString("base64");
    });
  
    // 如果你需要将结果赋值给 derivedProof.proofValue
    // derivedProof.proofValue = base64Proof[0]; // 如果只需要第一个proof
    // 或者
    derivedProof.proofValue = base64Proof;
    // console.warn("derivedProof: ", derivedProof);
    // Set the relevant proof elements on the derived proof from the input proof
    derivedProof.verificationMethod = proof.verificationMethod;
    derivedProof.proofPurpose = proof.proofPurpose;
    derivedProof.created = proof.created;
    
    // let outputBase64 = revealIndicies.push(255);
    console.warn("revealIndicies: ", revealIndicies);
    // let revealIndicies_base64 = Buffer.from(revealIndicies).toString("base64");
    // derivedProof.domain = revealIndicies_base64;

    const flattenedRange = range.flat();

    // 创建一个新的 Uint32Array，包含:
    // 1. revealIndicies 的长度
    // 2. range 的行数（有几组范围值）
    // 3. 原始数据
    const combinedArray = new Uint32Array(2 + revealIndicies.length + flattenedRange.length);
    
    // 添加元信息
    combinedArray[0] = revealIndicies.length;  // revealIndicies 的长度
    combinedArray[1] = range.length;           // range 的行数
    
    // 复制原有的 revealIndicies
    combinedArray.set(revealIndicies, 2);
    
    // 复制 range 值
    combinedArray.set(flattenedRange, 2 + revealIndicies.length);
    console.warn("combinedArray: ", combinedArray);
    // 转换为 base64
    let revealIndicies_base64 = Buffer.from(combinedArray.buffer).toString("base64");
    derivedProof.domain = revealIndicies_base64;

    return {
      document: {...revealDocumentResult},
      proof: derivedProof,
      // revealIndicies: revealIndicies_base64,
    };
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
    const { document, documentLoader, expansionMap, purpose} = options;
    const { proof } = options;
    
    try {

      // Validate that the input proof document has a proof compatible with this suite
      proof.type = this.mappedDerivedProofType;
      // Get the proof statements
      const proofStatements = await this.createVerifyProofData(proof, {
        documentLoader,
        expansionMap,
      });

      // Get the document statements
      const documentStatements = await this.createVerifyProofData(document, {
        documentLoader,
        expansionMap,
      });

      // Transform the blank node identifier placeholders for the document statements
      // back into actual blank node identifiers
      const transformedDocumentStatements = documentStatements.map((element) =>
        element.replace(/<urn:bnid:(_:c14n[0-9]+)>/g, "$1")
      );

      // Combine all the statements to be verified
      const statementsToVerify = proofStatements
        .concat(transformedDocumentStatements)
        .map((item) => new Uint8Array(Buffer.from(item)));

      // Fetch the verification method
      
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap,
      });

      // Construct a key pair class from the returned verification method
      const key = verificationMethod.publicKeyJwk
        ? await this.LDKeyClass.fromJwk(verificationMethod)
        : await this.LDKeyClass.from(verificationMethod);

      // Verify the proof
      console.warn("Verifying proof using wasm module");
      // const verified = await blsVerifyProof({
      //   proof: new Uint8Array(Buffer.from(proof.proofValue, "base64")),
      //   publicKey: new Uint8Array(key.publicKeyBuffer),
      //   messages: statementsToVerify,
      //   nonce: new Uint8Array(Buffer.from(proof.nonce, "base64")),
      // });

      // const revealIndicies = [ 0, 1, 2, 3 ];

      
      // console.warn("messages decoded: ", statementsToVerify.map(arr => {
      //   return new TextDecoder().decode(arr);
      // }));

      // const filteredMessages = statementsToVerify
      //   .map(arr => new TextDecoder().decode(arr))
      //   .filter(str => !str.includes('domain'))

      // console.warn("messages decoded: ", filteredMessages);

      // const modifiedMessages = statementsToVerify.map(arr => {
      //   // 创建一个新的 Uint8Array，长度比原数组多1
      //   const newArr = new Uint8Array(arr.length + 1);
      //   // 第一位设为0
      //   newArr[0] = 0;
      //   // 将原数组的内容复制到新数组的后面
      //   newArr.set(arr, 1);
      //   return newArr;
      // });
      // 首先过滤掉包含 domain 的消息

      let domainBase64 = '';
      statementsToVerify.forEach(arr => {
      const str = new TextDecoder().decode(arr);
      if (str.includes('domain')) {
        // 使用正则表达式提取引号中的 base64 字符串
        const match = str.match(/"([A-Za-z0-9+/=]+)"/);
        if (match) {
        domainBase64 = match[1]; // "AAECAw=="
        }
      }
      });

      const decodedBuffer = Buffer.from(domainBase64, 'base64');
      const decodedArray = new Uint32Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.length / 4);

      // 获取元信息
      const revealIndiciesLength = decodedArray[0];
      const rangeRowCount = decodedArray[1];

      // 提取 revealIndicies
      const decodedRevealIndicies = decodedArray.slice(2, 2 + revealIndiciesLength);

      // 提取和重构 range
      const rangeData = decodedArray.slice(2 + revealIndiciesLength);
      const decodedRange = [];
      for (let i = 0; i < rangeRowCount; i++) {
          const start = i * 3;
          decodedRange.push([
              rangeData[start],     // newIndex
              rangeData[start + 1], // min
              rangeData[start + 2]  // max
          ]);
      }

      console.log("Decoded revealIndicies:", decodedRevealIndicies);
      console.log("Decoded range:", decodedRange);

      // console.warn("domain base64:", domainBase64);
      // console.warn("domain Uint8Array:", domainUint8Array);

      const filteredMessages = statementsToVerify
      .filter(arr => !new TextDecoder().decode(arr).includes('domain'));

      console.warn("messages decoded: ", filteredMessages.map(arr => new TextDecoder().decode(arr)));

      // 然后对过滤后的消息进行修改（添加前导0）
      const modifiedMessages = filteredMessages.map(arr => {
      // 创建一个新的 Uint8Array，长度比原数组多1
      const newArr = new Uint8Array(arr.length + 1);
      // 第一位设为0
      newArr[0] = 0;
      // 将原数组的内容复制到新数组的后面
      newArr.set(arr, 1);
      return newArr;
      });

      // let range = [[16, 18, 60]];

      const verified = await blsVerifyProofMulti({
        proof: [new Uint8Array(Buffer.from(proof.proofValue, "base64"))], 
        publicKey: [new Uint8Array(key.publicKeyBuffer)], 
        messages: [modifiedMessages], 
        nonce: new Uint8Array(Buffer.from(proof.nonce, "base64")),
        revealed: [decodedRevealIndicies], 
        equivs: [[]], 
        range: [decodedRange] 
    });
      // console.warn("proof", [new Uint8Array(Buffer.from(proof.proofValue, "base64"))]);
      // console.warn("publicKey", [new Uint8Array(key.publicKeyBuffer)]);
      // console.warn("messages", [modifiedMessages]);
      // console.warn("nonce", new Uint8Array(Buffer.from(proof.nonce, "base64")));
      // console.warn("revealed", [decodedRevealIndicies]);
      // console.warn("equivs", []);
      // console.warn("range", [decodedRange]);
  
      // Ensure proof was performed for a valid purpose
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

      return verified;
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

    delete proof.nonce;
    delete proof.proofValue;

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
  async getVerificationMethod({
    proof,
    documentLoader,
  }) {
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
        // adding jws-2020 context to allow publicKeyJwk
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

  static proofType = [
    "BbsBlsSignatureProof2020",
    "sec:BbsBlsSignatureProof2020",
    "https://w3id.org/security#BbsBlsSignatureProof2020",
  ];

  static supportedDerivedProofType = [
    "BbsBlsSignature2020",
    "sec:BbsBlsSignature2020",
    "https://w3id.org/security#BbsBlsSignature2020",
  ];
}

module.exports = {
  BbsBlsSignatureProof2020,
};