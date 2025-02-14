<template>
    <div class="headerContainer">
        <div class="title">
            <div class="desc">Validation</div>
            <el-button class="btnStyle" type="success" icon="el-icon-plus" size="mini" @click="verifyFile">Verify</el-button>
        </div>
        <div class="content">Please upload the credential presentation:</div>
        <div class="head-drag-drop">
            <div
                class="drag-drop-area"
                @dragover.prevent="handleDragOver"
                @drop.prevent="handleFileDrop"
                :class="{ 'is-dragging': isDragging }"
            >
                <img v-if="!uploadedFileName" :src="imagePath" alt="Drag and drop" class="drag-drop-image"/>
                <p v-if="!uploadedFileName" class="drag-drop-words">Drag and drop a file here or click to select</p>
                <p v-else>File: {{ uploadedFileName }}</p>
                <div class="upload-button-container">
                    <label for="file-upload" class="upload-button mb8">Select File</label>
                    <input id="file-upload" type="file" @change="handleFileUpload" accept=".json" style="display: none" />
                </div>
            </div>
        </div>
        
       

        <div class="result-container mb8">
            <p v-if="uploadedFileName">File: {{ uploadedFileName }}</p>
            <p v-if="fileContent">
                Content:
            <pre>{{ fileContent }}</pre>
            </p>
        </div>

        <!-- <button @click="verifyFile" class="verify-button">Verify</button> -->

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
            imagePath: require('@/assets/image/certificated.png'),
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
            // Handle file drop
        handleFileDrop(event) {
                const file = event.dataTransfer.files[0];
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

    // Handle drag over event to allow dropping
        handleDragOver(event) {
            this.isDragging = true; // Set dragging state to true
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
.headerContainer {
    .title {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .desc {
        font-size: 24px;
        font-weight: bold;
      }
      .btnStyle {
        background-color: #abf370;
        border: none;
        color: #000;
        margin-right: 60px;
      }
    }
    .content {
      font-size: 12px;
      font-weight: 350;
      margin-bottom: 20px;
    }
  }
.head-drag-drop {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

/* Drag and drop area styles */
.drag-drop-area {
    border: 2px dashed #bbb;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px auto;
  width: 80%;
  min-height: 500px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.drag-drop-image {
    max-width: 30%; /* Limit image width */
    max-height: 30%; /* Limit image height */
    object-fit: contain; /* Ensure the image fits proportionally */
    margin-top: 25%;
}
.drag-drop-area.is-dragging {
  border-color: #3b82f6;
  background-color: #f0f8ff;
}

.drag-drop-area p {
  margin: 0;
  margin-top: 20px;
  font-size: 16px;
  color: #666;
}
.upload-prompt {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
    line-height: 1.5;
}
.upload-button-container {
    margin-top: 10px;
    text-align: center; /* This will ensure the button is centered */
}
.upload-button {
    display: inline-block;
    padding: 6px 12px;
    background-color: #f6851b;
    border: none;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    
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