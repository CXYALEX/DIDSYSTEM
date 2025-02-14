<template>
    <div class="app-container">
        <!-- 添加凭证按钮和模板选择器 -->
        <div class="headerContainer">
            <div class="title">
                <div class="desc">RegisterIssuer</div>
                <el-button class="btnStyle" type="success"  @click="handleAdd">Apply Credential</el-button>
            </div>
            <div class="content">wen an</div>
        </div>
        <!-- <div class="select"> 
            <el-select v-model="selectedTemplate" placeholder="Select Template" @change="handleTemplateChange">
                <el-option v-for="template in templates" :key="template.id" :label="template.name"
                        :value="template.id"></el-option>
            </el-select>
        </div> -->
        <div class="countNum"> Credentials <span>{{ tableData.length }}</span> </div>
        <!-- 凭证列表 -->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="Number" width="100">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="issuerId" label="Issuer ID"></el-table-column>
            <el-table-column prop="holderId" label="Holder ID"></el-table-column>
            <el-table-column label="Operation" width="380" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleViewCredential(scope.row)">View</el-button>
                    <el-button size="mini" type="success" @click="handleVerify(scope.row)">Verify</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    <el-button size="mini" type="warning" @click="handlePresentation(scope.row)">Presentation</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="presentationTitle" :visible.sync="presentationDialogVisible" width="80%" center>
            <el-form ref="presentationForm" label-width="0px">
                <!-- 表头 -->
                <el-row :gutter="10" type="flex" justify="start" align="middle" class="form-row header">
                    <el-col :span="2" class="text-center">isReveal</el-col>
                    <el-col :span="4" class="text-right">Key</el-col>
                    <el-col :span="8" class="text-left">Value</el-col>
                    <el-col :span="2" class="text-center">isRangeproof</el-col>
                    <el-col :span="4" class="text-center">Range</el-col>
                </el-row>

                <!-- 动态表单项 -->
                <el-row v-for="(value, key) in presentationFormData" :key="key" :gutter="10" type="flex" justify="start"
                    align="middle" class="form-row">
                    <!-- isReveal 复选框 -->
                    <el-col :span="2" class="text-center">
                        <el-checkbox v-model="selectedKeys[key]" @change="handleIsRevealChange(key)"></el-checkbox>
                    </el-col>

                    <!-- 标签部分 -->
                    <el-col :span="4" class="text-right">
                        <span>{{ key }}:</span>
                    </el-col>

                    <!-- 值部分 -->
                    <el-col :span="8">
                        <el-input v-model="presentationFormData[key]" disabled />
                    </el-col>

                    <!-- isRangeproof 复选框 -->
                    <el-col :span="2" class="text-center">
                        <el-checkbox v-model="isRangeproofValues[key]" :disabled="selectedKeys[key]"
                            @change="handleRangeproofChange(key)">
                        </el-checkbox>
                    </el-col>

                    <!-- Range 输入框 -->
                    <el-col :span="4" class="text-center"> <!-- 修改为 span="4" -->
                        <template v-if="isRangeproofValues[key]">
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <el-input v-model="rangeproofMin[key]" placeholder="Min"
                                    style="width: 80px; margin-right: 5px;"></el-input>
                                <el-input v-model="rangeproofMax[key]" placeholder="Max" style="width: 80px;"></el-input>
                            </div>
                        </template>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPresentation">Cancel</el-button>
                <el-button type="primary" @click="confirmPresentation">Confirm</el-button>
            </span>
        </el-dialog>





        <!-- 添加/编辑凭证表单 -->
        <el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" center>
            <el-form ref="form" :model="form" label-width="150px" class="form-container">
                <el-form-item v-for="(value, key) in credentialSubjectFields" :key="key" :label="key" class="custom-label">
                    <el-select
                            v-if="key === 'id'"
                            v-model="form.credentialSubject[key]"
                            placeholder="Select a DID"
                            style="width: 80%;"
                            >
                        <el-option v-for="did in didList" :key="did" :label="did" :value="did" />
                    </el-select>
                    <el-input 
                             v-if="key !== 'id'"
                            v-model="form.credentialSubject[key]" style="width: 80%;"/>
                </el-form-item>
                <el-form-item label="" class="custom-label">
                    <div class="select-container">
                        <el-select v-model="selectedTemplate" placeholder="Select Template" @change="handleTemplateChange" >
                            <el-option v-for="template in templates" :key="template.id" :label="template.name" :value="template.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
    </el-form>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">Confirm</el-button>
                <el-button @click="cancel">Cancel</el-button>
            </span>
        </el-dialog>

        <!-- 查看凭证文档对话框 -->
        <el-dialog title="Credential Document" :visible.sync="credentialDocumentDialogVisible" width="50%" center>
            <el-scrollbar style="max-height: 400px; overflow-y: auto">
                <pre>{{ credentialDocument }}</pre>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeCredentialDocumentDialog">Close</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { saveTemplate, getTemplates, deleteTemplate, getAllDIDIds } from "@/utils/indexedDB"; // IndexedDB 工具
import { saveCredential, deleteCredential } from "@/utils/indexedDB";
import { getTemplateList, getTemplateDetailById } from "@/api/template";
import { getVocabFromTemplate, createInputDocument, createRevealDoc } from "@/utils/bbs-utils";
import { createApplications } from "@/api/application";
import { getCredentialsList, getCredentialDetailById } from "@/api/credentials"; // Updated import
import { saveDID, getDIDs, deleteDID } from "@/utils/indexedDB"; // IndexedDB 工具
import { extendContextLoader, sign, verify, purposes } from "jsonld-signatures";
import { Bls12381G2KeyPair, BbsBlsSignature2020, deriveProof, BbsBlsSignatureProof2020 } from "@/utils/signature/index";
export default {
    data() {
        return {
            tableData: [],
            centerDialogVisible: false,
            credentialDocumentDialogVisible: false,
            form: {
                name: "",
                credentialSubject: {}
            },
            credentialDocument: null,
            title: "Apply Credential",
            credentialSubjectFields: {},
            templates: [],
            selectedTemplate: null,
            template_json: null,
            presentationDialogVisible: false, // 新的 Presentation 表单弹窗控制,
            presentationFields: {}, // 动态生成表单字段信息
            presentationFormData: {}, // 动态表单数据绑定
            selectedKeys: {}, // 记录用户选择的字段
            presentationTitle: "", // Presentation 表单的标题
            presentationTemplateID: null, //当前动态表单对应的templateID
            presentationCredentialID: null, //当前动态表单对应的credentialID
            isRangeproofValues: {}, // 新增的数据属性，用于存储 "isRangeproof" 列的复选框状态
            rangeproofMin: {}, // 存储最小值
            rangeproofMax: {}, // 存储最大值
            didList: [], // List to store DIDs
        };
    },
    methods: {
        async handleAdd() {
            this.centerDialogVisible = true;
            this.title = "Apply Credential";
            this.resetForm();
            if (this.selectedTemplate) {
                await this.fetchTemplate();
            }
        },

        async fetchTemplate() {
            try {
                const response = await getTemplateDetailById(this.selectedTemplate);
                this.template_json = response.template.template_json;
                const extractResult = getVocabFromTemplate(response.template.template_json);
                this.credentialSubjectFields = extractResult;
                this.form.credentialSubject = Object.keys(extractResult).reduce((acc, key) => {
                    acc[key] = "";
                    return acc;
                }, {});
            } catch (error) {
                this.$message.error("Failed to fetch template details.");
            }
        },

        async loadTemplates() {
            try {
                const response = await getTemplateList();
                this.templates = response.templates;
            } catch (error) {
                this.$message.error("Failed to load templates.");
            }
        },
        async loadDIDList() {
            try {
                this.didList = await getAllDIDIds(this.$store.getters.name); // Fetch all DID IDs
            } catch (error) {
                this.$message.error("Failed to load DID list");
            }
        },
        async confirm() {
            try {
                const inputDocument = await createInputDocument(this.template_json.vocabUrl, this.template_json.templateName, this.template_json.issuerId, this.form.credentialSubject);
                const applicationToSend = {
                    holder_id: inputDocument.credentialSubject.id,
                    application_json: inputDocument,
                    issuer_id: this.template_json.issuerId,
                    template_id: this.selectedTemplate
                };

                await createApplications(applicationToSend);
                this.save();
                this.$message.success("Template saved successfully");
            } catch (error) {
                this.$message.error("Failed to create input document.");
            }
        },

        async save() {
            try {
                const credentialToSave = {
                    name: this.form.name,
                    credentialSubject: this.form.credentialSubject
                };
                await saveCredential(this.$store.getters.name, credentialToSave);
                this.$message.success("Credential saved successfully.");
                await this.getCredentialList(); // Ensure the list is updated
                this.centerDialogVisible = false;
            } catch (error) {
                this.$message.error("Failed to save credential.");
            }
        },

        async handleViewCredential(credential) {
            try {
                const response = await getCredentialDetailById(credential.id);
                this.credentialDocument = JSON.stringify(response, null, 2);
                this.credentialDocumentDialogVisible = true;
            } catch (error) {
                this.$message.error("Failed to retrieve credential details.");
            }
        },

        async handleVerify(credential) {

            const response = await getCredentialDetailById(credential.id);  //根绝credential ID去后端获取完整的credential
            console.log("response", response);
            const template_id = response.credential.template_id;

            const signedDocument = response.credential.credential_json;     //被签发的凭证
            console.log("template_id", template_id);
            console.log("signedDocument", signedDocument);
            // console.log("credential",credential);

            // const template_id = application.template_id;

            try {
                const response = await getTemplateDetailById(template_id);
                const template = response.template.template_json;
                console.log(template);
                const customDocLoader = (url) => {
                    const context = template.documents[url];
                    if (context) {
                        return {
                            contextUrl: null,
                            document: context,
                            documentUrl: url,
                        };
                    }

                    console.log(
                        `Attempted to remote load context : '${url}', please cache instead`
                    );
                    throw new Error(
                        `Attempted to remote load context : '${url}', please cache instead`
                    );
                }
                const documentLoader = extendContextLoader(customDocLoader)

                let verified = await verify(signedDocument, {
                    suite: new BbsBlsSignature2020(),
                    purpose: new purposes.AssertionProofPurpose(),
                    documentLoader,
                });
                console.log("Verification result");
                console.log(JSON.stringify(verified, null, 2));
                this.$message.info(`Verifying credential: ${verified.verified}`);

            } catch (error) {
                this.$message.error("Failed to confirm application");
            }
            //this.$message.info(`Verifying credential: ${credential.name}`);
        },

        handleDelete(index, row) {
            deleteCredential(this.$store.getters.name, row.id)
                .then(() => {
                    this.$message.success("Credential deleted successfully.");
                    this.getCredentialList();
                })
                .catch(() => {
                    this.$message.error("Failed to delete credential.");
                });
        },

        async getCredentialList() {
            try {
                const dids = await getDIDs(this.$store.getters.name); // Fetch DIDs first
                const credentials = [];

                for (const did of dids) {
                    const didCredentials = await getCredentialsList(did.id); // Fetch credentials for each DID
                    credentials.push(...didCredentials.credentials); // Combine results
                }
                console.log(credentials)
                // Map credentials to include only issuerId and holderId for display
                this.tableData = credentials.map(credential => ({
                    issuerId: credential.issuer_id,
                    holderId: credential.holder_id,
                    id: credential.id // Keep id for further operations
                }));
            } catch (error) {
                this.$message.error("Failed to retrieve credential list.");
            }
        },

        async handleTemplateChange() {
            if (this.selectedTemplate) {
                await this.fetchTemplate();
            }
        },
        async handlePresentation(credential) {
            try {
                // 根据凭证 ID 获取凭证详细信息
                this.presentationCredentialID = credential.id;
                const response = await getCredentialDetailById(credential.id);
                const credentialDetails = response.credential.credential_json;

                this.presentationTemplateID = response.credential.template_id;

                // 从 credentialDetails.credentialSubject 中提取数据
                const credentialSubject = { ...credentialDetails.credentialSubject };

                // 设置表单标题为 `type` 的内容（type 不渲染具体字段，只作为标题）
                this.presentationTitle = credentialSubject.type
                    ? credentialSubject.type.join(", ") // 解析类型数组
                    : "Presentation Form";

                // 删除 type 字段，因为不需要显示在表单中
                delete credentialSubject.type;

                // 解析 `credentialSubject` 的键值对
                this.presentationFormData = credentialSubject;

                // 初始化选择状态：`id` 默认勾选为 true，其他字段为 false
                this.selectedKeys = Object.keys(this.presentationFormData).reduce((acc, key) => {
                    acc[key] = key === "id"; // 如果是 "id"，设置为 true；否则为 false
                    return acc;
                }, {});

                this.isRangeproofValues = {};
                this.rangeproofMin = {};
                this.rangeproofMax = {};

                Object.keys(this.presentationFormData).forEach((key) => {
                    this.$set(this.isRangeproofValues, key, false); // 初始化为 false
                    this.$set(this.rangeproofMin, key, ''); // 初始化为空字符串
                    this.$set(this.rangeproofMax, key, ''); // 初始化为空字符串
                });
                // 打开弹窗
                this.presentationDialogVisible = true;
            } catch (error) {
                this.$message.error("Failed to fetch credential details.");
            }
        },

        cancelPresentation() {
            this.presentationDialogVisible = false;
        },

        async confirmPresentation() {
            // 筛选出用户选中的字段
            const selectedFields = Object.keys(this.presentationFormData).reduce((acc, key) => {
                if (this.selectedKeys[key]) {
                    acc[key] = this.presentationFormData[key];
                } else if (this.isRangeproofValues[key]) {
                    const min = this.rangeproofMin[key];
                    const max = this.rangeproofMax[key];
                    // 验证min/max是否存在
                    if (min !== '' && max !== '') {
                        acc[key] = `range-${min}-${max}`;
                    } else {
                        this.$message.warning(`Please fill "min" and "max" range for ${key}.`);
                        return acc;
                    }
                }
                return acc;
            }, {});

            console.log("Selected Fields:", selectedFields);
            this.$message.success("Presentation confirmed!");

            // 关闭弹窗
            this.presentationDialogVisible = false;

            try {
                const response = await getTemplateDetailById(this.presentationTemplateID);
                const template = response.template.template_json;
                const resp = await getCredentialDetailById(this.presentationCredentialID);  // 根据credential ID去后端获取完整的credential

                const signedDocument = resp.credential.credential_json; // 被签发的凭证
                console.log("signedDocument", signedDocument);
                console.log("template", template);

                const customDocLoader = (url) => {
                    const context = template.documents[url];
                    if (context) {
                        return {
                            contextUrl: null,
                            document: context,
                            documentUrl: url,
                        };
                    }

                    console.log(
                        `Attempted to remote load context : '${url}', please cache instead`
                    );
                    throw new Error(
                        `Attempted to remote load context : '${url}', please cache instead`
                    );
                };

                const documentLoader = extendContextLoader(customDocLoader);

                console.log("11111111");
                console.log("RevealDoc", createRevealDoc(template, selectedFields));

                // 创建 Derived Proof
                const derivedProof = await deriveProof(signedDocument, createRevealDoc(template, selectedFields), {
                    suite: new BbsBlsSignatureProof2020(),
                    documentLoader,
                });

                console.log(JSON.stringify(derivedProof, null, 2));

                // // 验证 Derived Proof
                // const verified = await verify(derivedProof, {
                //     suite: new BbsBlsSignatureProof2020(),
                //     purpose: new purposes.AssertionProofPurpose(),
                //     documentLoader,
                // });

                // console.log("Verification result");
                // console.log(JSON.stringify(verified, null, 2));

                // 下载 Derived Proof 文件
                this.downloadJsonFile(derivedProof, "derivedProof.json");
            } catch (error) {
                console.log(error);
                this.$message.error("Failed to confirm application");
            }
        },

        /**
         * 下载 JSON 文件的辅助函数
         * @param {Object} data JSON 数据
         * @param {String} fileName 文件名
         */
        downloadJsonFile(data, fileName) {
            try {
                const jsonString = JSON.stringify(data, null, 2); // 将 JSON 数据格式化为字符串
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);

                // 创建一个临时的 <a> 元素用于下载
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName; // 文件名
                link.click();

                // 释放 URL 对象
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error generating download file:", error);
            }
        },

        handleIsRevealChange(key) {
            if (this.selectedKeys[key]) {
                // 如果勾选了 isReveal，则禁用 isRangeproof 并清空范围值
                this.$set(this.isRangeproofValues, key, false);
                this.$set(this.rangeproofMin, key, '');
                this.$set(this.rangeproofMax, key, '');
            }
        },

        handleRangeproofChange(key) {
            if (!this.isRangeproofValues[key]) {
                // 如果取消勾选 isRangeproof，则清空范围值
                this.$set(this.rangeproofMin, key, '');
                this.$set(this.rangeproofMax, key, '');
            } else {
                // 如果勾选 isRangeproof，则初始化范围值（可选）
                if (!this.rangeproofMin[key]) {
                    this.$set(this.rangeproofMin, key, '');
                }
                if (!this.rangeproofMax[key]) {
                    this.$set(this.rangeproofMax, key, '');
                }
            }
        },

        cancel() {
            this.centerDialogVisible = false;
            this.resetForm();
        },

        resetForm() {
            this.form = {
                name: "",
                credentialSubject: {}
            };
        },

        closeCredentialDocumentDialog() {
            this.credentialDocumentDialogVisible = false;
            this.credentialDocument = null;
        }
    },

    async mounted() {
        await this.loadTemplates();
        await this.getCredentialList(); // Ensure this is awaited
        await this.loadDIDList();
    }
};
</script>

<style lang="css" scoped>
.mb8 {
    margin-bottom: 8px;
}

.custom-label .el-form-item__label {
    width: 150px;
    flex: 0 0 150px;
    
}

.form-row {
    margin-bottom: 15px;
}

.form-row.header {
    font-weight: bold;
    margin-bottom: 20px;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
    padding-right: 10px;
}

.text-left {
    text-align: left;
}

.el-checkbox,
.el-input {
    display: flex;
    align-items: center;
    height: 100%;
}

.el-checkbox__inner {
    margin-top: 2px;
}

.el-dialog {
    width: 80% !important;
}

.el-col-2 .el-checkbox,
.el-col-8 .el-checkbox {
    justify-content: center;
}
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
      }
    }
    .content {
      font-size: 12px;
      font-weight: 350;
      margin-bottom: 20px;
    }
  }
  .select-container {
    display: flex;
    margin-left: 15%;         
}
.select {
    padding-left: 10px;
    height: 60px;
    text-align: end;
    line-height: 60px;
    background-color: #fff;
    border: 1px solid #f5f5f6;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .countNum {
    padding-left: 10px;
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    border: 1px solid #f5f5f6;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    span {
        padding: 3px 5px;
        background-color: #f3f4f7;
        border-radius: 4px;
        margin-left: 10px;
    }
  }
</style>