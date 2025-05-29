<template>
  <div class="app-container">
    <!-- 添加模板按钮 -->
    <div class="headerContainer">
        <div class="title">
            <div class="desc">Template</div>
            <el-button class="btnStyle" type="success" icon="el-icon-plus" size="mini" @click="handleAdd">Build Template</el-button>
        </div>
        <div class="content">Define and manage trusted, tamper-proof verifiable credential templates that specify a set of attributes and their data types, revolutionizing trust and authentication processes.</div>
        <div class="content">
    <strong>Note:</strong> <a href="https://raw.githubusercontent.com/CXYALEX/DIDSYSTEM/main/degreeTemplate.json" target="_blank" style="color: blue; text-decoration: underline;">DegreeTemplate</a> is the example template of the degree KYC Credential. You can modify the template JSON to create your own template.
</div>
    </div>
    <!-- 模板列表 -->
    <div class="countNum"> template <span>{{ tableData.length }}</span> </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="Number" width="100">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Template Name"></el-table-column>
      <el-table-column prop="issuer_id" label="Issuer ID"></el-table-column>
      <el-table-column label="Operation" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleViewTemplate(scope.row)">View</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑模板表单 -->
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" center>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Template Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Template JSON">
          <el-input type="textarea" v-model="form.template" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="Select DID">
          <el-select v-model="form.selectedDID" placeholder="Select a DID">
            <el-option v-for="did in didList" :key="did" :label="did" :value="did"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="save">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 查看模板文档对话框 -->
    <el-dialog title="Template Document" :visible.sync="templateDocumentDialogVisible" width="50%" center>
      <el-scrollbar style="max-height: 400px; overflow-y: auto">
        <pre>{{ templateDocument }}</pre>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTemplateDocumentDialog">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllDIDIds } from "@/utils/indexedDB"; // IndexedDB 工具
import { createTemplate } from "@/utils/bbs-utils"; //bbs工具
import { registerTemplate,getTemplateListByIssuerID,deleteTemplateById} from "@/api/template";

export default {
  data() {
    return {
      tableData: [],
      centerDialogVisible: false,
      templateDocumentDialogVisible: false,
      form: {
        name: "",
        template: "",
        selectedDID: null, // Add selectedDID field
      },
      templateDocument: null,
      title: "Add Template",
      didList: [], // List to store DIDs
    };
  },
  methods: {
    async handleAdd() {
      this.centerDialogVisible = true;
      this.title = "Add Template";
      this.resetForm();
      await this.loadDIDList(); // Load DID list when opening the dialog
    },

    async loadDIDList() {
      try {
        this.didList = await getAllDIDIds(this.$store.getters.name); // Fetch all DID IDs
      } catch (error) {
        this.$message.error("Failed to load DID list");
      }
    },

    async save() {
      try {
        console.log(this.form.template);
        const templateData = JSON.parse(this.form.template);
        var template = await createTemplate(templateData, this.form.selectedDID, '666', this.form.name);
        const templateToSave = {
          name: this.form.name,
          template_json: template,
          issuer_id: this.form.selectedDID // Include selected DID
        };
        registerTemplate(templateToSave)
          .then(res => {
            if (res.code === "success") {
              this.$message.success("Template saved successfully");
              this.getTemplateList();
              this.centerDialogVisible = false;
            } else {
              this.$message.error("获取信息失败");
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error("服务端异常，请联系管理员解决。");
          });

      } catch (error) {
        console.error("Failed to save template:", error);
        this.$message.error("Failed to save template. Please check your JSON format.");
      }
    },

    async handleViewTemplate(template) {
      this.templateDocument = JSON.stringify(template.template_json, null, 2);
      this.templateDocumentDialogVisible = true;
    },

    handleDelete(index,row) {
      console.log("Deleting template with ID:", row.id);
      if (!row.id) {
        this.$message.error("Template ID is missing");
        return;
      }
      deleteTemplateById(row.id)
        .then((response) => {
          if (response.code === "success") {
            this.$message.success("Template deleted successfully");
            this.getTemplateList();
          } else {
            this.$message.error("Failed to delete template");
          }
        })
        .catch((error) => {
          console.error("Delete template error:", error);
          this.$message.error("Failed to delete template");
        });
    },

    async getTemplateList() {
  try {
    // 首先确保didList已经加载
    if (this.didList.length === 0) {
      await this.loadDIDList();
    }
    
    // 如果仍然没有DID，则清空表格数据
    if (this.didList.length === 0) {
      this.tableData = [];
      return;
    }

    const allTemplates = [];
    
    // 遍历每个DID并获取其模板列表
    for (const did of this.didList) {
      try {
        console.log(`Fetching templates for DID: ${did}`);
        const response = await getTemplateListByIssuerID(did);
        console.log(`Templates for DID ${did}:`, response);
        
        // 检查响应结构并提取模板数组
        let templateList = [];
        if (response && response.code === 'success' && response.templates) {
          templateList = response.templates;
        } else if (Array.isArray(response)) {
          // 如果直接返回数组
          templateList = response;
        }
        
        // 为每个模板添加issuer_id信息，便于后续识别
        if (Array.isArray(templateList)) {
          const templatesWithIssuer = templateList.map(template => ({
            ...template,
            issuer_id: did
          }));
          allTemplates.push(...templatesWithIssuer);
        }
      } catch (error) {
        // 检查错误消息是否包含"No templates found"
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes('No templates found for issuer_id')) {
          // 没有找到模板时静默处理，继续处理下一个DID
          console.log(`No templates found for DID ${did}`);
          continue;
        }
      }
    }
    
    console.log('All templates retrieved:', allTemplates);
    this.tableData = allTemplates;
  } catch (error) {
    console.error("Failed to retrieve template list:", error);
    this.$message.error("Failed to retrieve template list");
  }
},





    cancel() {
      this.centerDialogVisible = false;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        name: "",
        template: "",
        selectedDID: null // Reset selectedDID
      };
    },

    closeTemplateDocumentDialog() {
      this.templateDocumentDialogVisible = false;
      this.templateDocument = null;
    }
  },

  async mounted() {
    // Initialize template list
    await this.loadDIDList();
    this.getTemplateList();
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