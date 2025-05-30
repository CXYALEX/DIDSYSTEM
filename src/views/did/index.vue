<template>
    <div class="app-container">
        <!-- 添加身份信息按钮 -->
        <div class="headerContainer">
            <div class="title">
                <div class="desc">DID</div>
                <el-button class="btnStyle" type="success" icon="el-icon-plus" size="mini" @click="handleAdd">Create DID</el-button>
            </div>
            <div class="content">Create and manage decentralized identifiers (DIDs) in your identity wallet. Upon successfully creating a new DID, the corresponding DID document will be registered on the VDR. </div>
            <div class="content">
            <strong>Note:</strong> Before applying for a DID, please ensure that your MetaMask wallet is connected and swith the network to the Sepolia TestNet.
            </div>
        </div>
        <!-- 身份信息列表 -->
        <div class="countNum"> DIDs <span>{{ tableData.length }}</span> </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="Number" width="100">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column prop="id" label="DID"></el-table-column>
            <el-table-column label="Operation" width="180" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleViewDocument(scope.row.id)">View</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加/编辑身份信息表单 -->
        <el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="DID Name">
                    <el-input v-model="form.identity"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">Cancel</el-button>
                <el-button type="primary" @click="save">Confirm</el-button>
            </span>
        </el-dialog>

        <!-- 查看DID文档对话框 -->
        <el-dialog title="DID Document" :visible.sync="didDocumentDialogVisible" width="50%" center>
            <el-scrollbar style="max-height: 400px; overflow-y: auto">
                <pre>{{ didDocument }}</pre>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDidDocumentDialog">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { saveDID, getAllDIDIds, deleteDID } from "@/utils/indexedDB"; // IndexedDB 工具
import detectEthereumProvider from "@metamask/detect-provider";
import { VDRContract } from "@/utils/interactVDR";


export default {
    data() {
        return {
            tableData: [],
            centerDialogVisible: false,
            didDocumentDialogVisible: false,
            form: {
                identity: ""
            },
            didDocument: null, // 存储 DID 文档
            title: "New Decentralized Identity",
            contract: null, // 合约实例
        };
    },
    methods: {
        async handleAdd() {
            // 判断是否为测试账号（test-开头）
            if (this.$store.getters.name && this.$store.getters.name.startsWith('test-')) {
                this.$message({
                    type: 'warning',
                    message: 'The current account is a test account and does not support this function.'
                });
                return; // 直接返回，不执行后续操作
            }
            
            // 非测试账号，执行正常的添加操作
            this.centerDialogVisible = true;
            this.title = "New Decentralized Identity";
            this.resetForm();
        },


        async save() {
            try {
                if (!this.$store.state.web3.web3account) {
                    this.$message.error("Please connect your wallet.");
                    return; // Exit early if the account is not connected
                }
                await this.contract.registerDID(this.$store.state.web3.web3account, this.form.identity);
                this.$message.success("DID Creation Success");
                await saveDID(this.$store.getters.name, this.form.identity);
                this.getDIDList();
                this.centerDialogVisible = false;
            } catch (error) {
                console.error("Transaction failed:", error);
                this.$message.error("DID Creation Failure");
            }
        },

        async handleViewDocument(identity) {
            try {
                const didDocument = await this.contract.getDID(identity); // 获取 DID 文档
                this.didDocument = JSON.stringify(didDocument, null, 2); // 格式化为字符串并缩进
                this.didDocumentDialogVisible = true;
            } catch (error) {
                console.error("Failed to fetch DID document:",   error);
                this.$message.error("Get DID Document Failure");
            }
        },

        handleDelete(index, row) {
            // 判断是否为测试账号（test-开头）
            if (this.$store.getters.name && this.$store.getters.name.startsWith('test-')) {
                this.$message({
                    type: 'warning',
                    message: 'The current account is a test account and does not support this function.'
                });
                return; // 直接返回，不执行后续操作
            }
            deleteDID(this.$store.getters.name, row.id)
                .then(() => {
                    this.$message.success("Delete Success");
                    this.getDIDList();
                })
                .catch(() => {
                    this.$message.error("Delete Failed");
                });
        },

        // getDIDList() {
        //     getDIDs(this.$store.getters.name)
        //         .then((dids) => {
        //             this.tableData = dids;
        //         })
        //         .catch(() => {
        //             this.$message.error("Get DID List Failed");
        //         });
        // },
        getDIDList() {
            getAllDIDIds(this.$store.getters.name)  // 改为 getAllDIDIds
                .then((didIds) => {
                    // 将字符串数组转换为对象数组
                    this.tableData = didIds.map(id => ({ id }));
                })
                .catch(() => {
                    this.$message.error("Get DID List Failed");
                });
        },



        cancel() {
            this.centerDialogVisible = false;
            this.resetForm();
        },

        resetForm() {
            this.form = { identity: "" };
        },

        closeDidDocumentDialog() {
            this.didDocumentDialogVisible = false;
            this.didDocument = null;
        }
    },

    async mounted() {
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

        // 获取 DID 列表
        this.getDIDList();
    }
};
</script>


<style lang="css" scoped>
.mb8 {
    margin-bottom: 8px;
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
