<template>
  <div class="app-container">
    <!-- 选择器 -->
    <div class="headerContainer">
        <div class="title">
            <div class="desc">Application</div>
            <el-button class="btnStyle" type="success"  size="mini" @click="registerRevocationList">Register Revocation List</el-button>
        </div>
        <div class="content">Manages the credential application, including application approvals, rejections, and revocation of issued credentials.</div>
        <div class="content">
            <strong>Note:</strong> Before revoke the issued credential, please register the revocation list first.
        </div>
    </div>
    <div class="countNum"> 
      <el-select v-model="selectedDID" placeholder="Select a DID" @change="loadApplications">
          <el-option v-for="did in didList" :key="did" :label="did" :value="did"></el-option>
        </el-select>  
    </div>
    <!-- Application 列表 -->
    <el-table :data="applicationList" border style="width: 100%">
      <el-table-column prop="id" label="Application ID" width="150"></el-table-column>
      <el-table-column label="Template Name" :formatter="formatTemplateName">
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100">
      </el-table-column>
      <el-table-column label="Operation" width="350" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="confirmApplication(scope.row)"
            :disabled="scope.row.status === 'completed' || scope.row.status === 'rejected' || scope.row.status === 'revoked'">Confirm</el-button>
          <el-button size="mini" type="danger" @click="rejectApplication(scope.row)"
            :disabled="scope.row.status === 'completed' || scope.row.status === 'rejected' || scope.row.status === 'revoked'">Reject</el-button>
          <el-button size="mini" type="warning" @click="revokeApplication(scope.row)"
            :disabled="scope.row.status !== 'completed'">Revoke</el-button>
          <el-button size="mini" type="primary" @click="viewApplication(scope.row)">View</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllDIDIds } from "@/utils/indexedDB"; // 获取 DID 列表工具
import { getApplicationsList, updateApplicationStatusToCompleted, updateApplicationStatusToRejected, updateApplicationStatusToRevoked } from "@/api/application"; // Application 操作接口
import { registerCredential, revokeCredential, registerRevocationList } from "@/api/credentials"; // Revocation 操作接口
import { getTemplateDetailById } from "@/api/template";
//import { Bls12381G2KeyPair, BbsBlsSignature2020 } from "@mattrglobal/jsonld-signatures-bbs";
//import { Bls12381G2KeyPair, BbsBlsSignature2020 } from "@mattrglobal/jsonld-signatures-bbs";
import { Bls12381G2KeyPair, BbsBlsSignature2020 } from "@/utils/signature/index";
import { extendContextLoader, sign, purposes } from "jsonld-signatures";
import { VDRContract } from "@/utils/interactVDR";
import detectEthereumProvider from "@metamask/detect-provider";
export default {
  data() {
    return {
      didList: [], // DID 列表
      selectedDID: null, // 当前选中的 DID
      applicationList: [], // Application 列表
      contract: null, // 合约实例
    };
  },
  methods: {
    // 加载 DID 列表
    async loadDIDList() {
      try {
        this.didList = await getAllDIDIds(this.$store.getters.name);
      } catch (error) {
        this.$message.error("Failed to load DID list");
      }
    },

    // 加载 Application 列表
    async loadApplications() {
      if (!this.selectedDID) {
        this.applicationList = [];
        return;
      }
      try {
        const applications = await getApplicationsList(this.selectedDID);
        this.applicationList = applications.applications.map((app) => {
          return {
            ...app,
            status: app.status || "Unknown", // 确保直接映射后端返回的 status 字段
          };
        });
      } catch (error) {
        this.$message.error("Failed to load application list");
      }
    },

    // 格式化 Template Name
    formatTemplateName(row) {
      const types = row.application_json?.credentialSubject?.type || [];
      return types.join(", ");
    },

    // 查看 Application
    viewApplication(application) {
      this.$alert(JSON.stringify(application, null, 2), "Application Details", {
        confirmButtonText: "OK",
        dangerouslyUseHTMLString: true,
        customClass: "app-details-dialog",
      });
    },

    // 确认 Application
    async confirmApplication(application) {
      const template_id = application.template_id;
      try {
        const response = await getTemplateDetailById(template_id);
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
          console.log(
            `Attempted to remote load context : '${url}', please cache instead`
          );
          throw new Error(
            `Attempted to remote load context : '${url}', please cache instead`
          );
        };
        const documentLoader = extendContextLoader(customDocLoader);
        const keyPair = await new Bls12381G2KeyPair(template.documents[template.publicKeyId]);
        const signedDocument = await sign(application.application_json, {
          suite: new BbsBlsSignature2020({ key: keyPair }),
          purpose: new purposes.AssertionProofPurpose(),
          documentLoader,
        });
        const credentialToSave = {
          holder_id: application.holder_id,
          template_id: application.template_id,
          credential_json: signedDocument,
          issuer_id: this.selectedDID, // Include selected DID
        };
        console.log("credentialToSave", credentialToSave);
        // 发送签名后的credential到后端
        registerCredential(credentialToSave)
          .then((res) => {
            if (res.code === "success") {
              this.$message.success("Credential Creation successfully");
              this.loadApplications(); // 重新加载列表
            } else {
              this.$message.error("Credential Creation Fail");
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.err("服务端异常，请联系管理员解决。");
          });
        await updateApplicationStatusToCompleted(application.id);
        this.loadApplications(); // 重新加载列表
      } catch (error) {
        console.log(error);
        this.$message.error("Failed to confirm application");
      }
    },

    // 拒绝 Application
    async rejectApplication(application) {
      try {
        await updateApplicationStatusToRejected(application.id);
        this.$message.success("Application rejected successfully");
        this.loadApplications(); // 重新加载列表
      } catch (error) {
        this.$message.error("Failed to reject application");
        console.log(error);
      }
    },

    // 撤销 Application
    async revokeApplication(application) {
      try {
        const receipt = await this.contract.revoke(
          this.$store.state.web3.web3account,
          this.selectedDID,
          application.application_json.id
        );
        console.log("receipt!!!!!!", receipt);
        await updateApplicationStatusToRevoked(application.id);
        this.$message.success("Credential revoked successfully");
        this.loadApplications(); // 重新加载列表
      } catch (error) {
        this.$message.error("Failed to revoke credential");
        console.log(error);
      }
    },

    // 注册撤销列表
    async registerRevocationList() {
      try {
        // 确保钱包已连接
        if (!this.$store.state.web3.web3account) {
          this.$message.error("Please connect your wallet.");
          return; // 如果未连接账号，则直接退出
        }

        let issuerInfo = null; // 用于接收返回的发行者信息

        try {
          // 尝试获取发行者信息
          issuerInfo = await this.contract.getIssuer(this.selectedDID);
          console.log("issuerInfo", issuerInfo);
        } catch (error) {
          // 如果抛出错误（假定发行者不存在），直接继续执行注册
          console.warn("Issuer fetch error, treating as non-existent");
        }

        // 当发行者不存在或者抛出错误时，执行注册操作
        if (!issuerInfo || issuerInfo.exist === 'true') {
          await this.contract.registerIssuer(
            this.$store.state.web3.web3account,
            this.selectedDID,
            "JSON-LD-BBSPLUS",
            "null"
          );

          this.$message.success("Revocation list registered successfully");
        } else {
          // 如果返回数据表明Issuer已存在，提示用户
          this.$message.error("This DID has  registered in  RevocationList");
        }
      } catch (error) {
        // 捕获注册过程中的其他未知错误
        this.$message.error("Failed to register revocation list");
        console.error(error);
      }
    }

  },

  async mounted() {
    // 初始化 DID 列表
    await this.loadDIDList();
    // 初始化智能合约
    const provider = await detectEthereumProvider();
    if (provider) {
      // 动态从环境变量中读取合约地址
      const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;
      if (!contractAddress) {
        this.$message.error("Contract address is not configured!");
        return;
      }
      this.contract = new VDRContract(
        provider,
        contractAddress
      );
    } else {
      this.$message.error("Unable to Connect to Ethernet Provider, Please Check Wallet Settings");
    }
  },
};
</script>

<style lang="scss" scoped>
.mb8 {
  margin-bottom: 8px;
}

.app-details-dialog pre {
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.headerContainer {
  padding: 12px 0;

  .title {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .desc {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.5px;
    }

    .btnStyle {
      background-color: #4070f4;
      border: none;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 20px;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #2955d9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(64, 112, 244, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .content {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 400;
    color: #666666;
    margin-bottom: 20px;
    max-width: 800px;
  }
}
  .countNum {
    padding-left: 10px;
    height: 60px;
    text-align: end;
    line-height: 60px;
    background-color: #fff;
    border: 1px solid #f5f5f6;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>
