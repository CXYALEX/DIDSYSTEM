<template>
    <div class="app-container">
        <p class="upload-prompt mb8">Please upload the credential presentation:</p>

        <label for="file-upload" class="upload-button mb8">Select File</label>
        <input id="file-upload" type="file" @change="handleFileUpload" accept=".json" style="display: none" />

        <div class="result-container mb8">
            <p v-if="uploadedFileName">File: {{ uploadedFileName }}</p>
            <p v-if="fileContent">
                Content:
            <pre>{{ fileContent }}</pre>
            </p>
        </div>

        <button @click="verifyFile" class="verify-button">Verify</button>

        <!-- Verification result display -->
        <div v-if="verificationResult" class="verification-result mb8">
            <h3>Verification Result</h3>
            <pre>{{ verificationResult }}</pre>
        </div>
    </div>
</template>

<script>
import { getTemplateDetailByName } from "@/api/template";
import { extendContextLoader, verify, purposes } from "jsonld-signatures";
//import { BbsBlsSignatureProof2020 } from "@mattrglobal/jsonld-signatures-bbs";
import { Bls12381G2KeyPair, BbsBlsSignature2020, deriveProof, BbsBlsSignatureProof2020 } from "@/utils/signature/index";
import { VDRContract } from "@/utils/interactVDR";
import detectEthereumProvider from "@metamask/detect-provider";
export default {
    data() {
        return {
            uploadedFileName: null,
            fileContent: null,
            verificationResult: null, // Store verification result
            contract: null, // 合约实例
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                alert("The file format is incorrect, please upload a valid JSON file!");
                return;
            }

            this.uploadedFileName = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.fileContent = JSON.parse(e.target.result);
                } catch (error) {
                    alert("Failed to parse the file content, please make sure the file content is valid JSON!");
                }
            };
            reader.readAsText(file);
        },

        async verifyFile() {
            try {
                //在检查credential的proof以前，先检查该credential的id是否已经被撤销
                // 确保钱包已连接
                if (!this.$store.state.web3.web3account) {
                    this.$message.error("Please connect your wallet.");
                    return; // 如果未连接账号，则直接退出
                }

                try {
                    // 尝试获取发行者信息
                    const isRevoked = await this.contract.checkRevocation(this.fileContent.issuer, this.fileContent.id);
                    console.log("isRevoked!!!!!!!!: ", isRevoked);
                    if (isRevoked === true) {
                        this.verificationResult = "The credential has been revoked";
                        return;
                    }
                } catch (error) {
                    // 继续执行注册
                    console.warn("the credential id is not exist in the revocation list");
                }
                const response = await getTemplateDetailByName(this.fileContent.credentialSubject.type);
                const template = response.template.template_json;

                const customDocLoader = (url) => {
                    const context = template.documents[url];
                    if (context) {
                        return {
                            contextUrl: null,
                            document: context,
                            documentUrl: url,
                        };
                    }

                    throw new Error(`Attempted to remote load context : '${url}', please cache instead`);
                };

                const documentLoader = extendContextLoader(customDocLoader);

                // Verify Derived Proof
                const verified = await verify(this.fileContent, {
                    suite: new BbsBlsSignatureProof2020(),
                    purpose: new purposes.AssertionProofPurpose(),
                    documentLoader,
                });

                // Store verification result
                this.verificationResult = JSON.stringify(verified, null, 2);
            } catch (error) {
                console.error(error);
                this.verificationResult = "Failed to confirm application";
            }
        },
    },
    async mounted() {
        // 初始化智能合约
        const provider = await detectEthereumProvider();
        if (provider) {
            // 动态从环境变量中读取合约地址
            const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;
            console.log("contractAddress: ", contractAddress);
            if (!contractAddress) {
                this.$message.error("Contract address is not configured!");
                return;
            }
            this.contract = new VDRContract(
                provider,
                contractAddress
            );
        } else {
            this.$message.error("Unable to Connect to Ethernet Provider, aPlease Check Wallet Settings");
        }
    },
};
</script>

<style>
.upload-prompt {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
    line-height: 1.5;
}

.upload-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #f6851b;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.upload-button:hover {
    background-color: #e76e05;
}

.result-container {
    margin-bottom: 10px;
}

.result-container p {
    margin: 5px 0;
    font-size: 16px;
    color: #333;
}

pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.verify-button {
    padding: 10px 20px;
    background-color: #28a745;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.verify-button:hover {
    background-color: #218838;
}

.verification-result {
    margin-top: 20px;
}

.mb8 {
    margin-bottom: 8px;
}
</style>