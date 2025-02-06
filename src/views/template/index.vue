<template>
  <div class="app-container">
    <!-- 添加模板按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">Add Template</el-button>
      </el-col>
    </el-row>
    <!-- 模板列表 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="Number" width="100">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Template Name"></el-table-column>
      <el-table-column label="Operation" width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleViewTemplate(scope.row)">View</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑模板表单 -->
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" center>
      <el-form ref="form" :model="form" label-width="80px">
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
import { saveTemplate, getTemplates, deleteTemplate, getAllDIDIds } from "@/utils/indexedDB"; // IndexedDB 工具
import { createTemplate, createInputDocument, createControllerDoc, createIssuerKey, createVocab } from "@/utils/bbs-utils"; //bbs工具
import { registerTemplate } from "@/api/template";

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
        console.log("template");
        //console.log(template);
        console.log(JSON.stringify(template, null, 2));
        const templateToSave = {
          name: this.form.name,
          template_json: template,
          issuer_id: this.form.selectedDID // Include selected DID
        };
        registerTemplate(templateToSave)
          .then(res => {
            if (res.code === "success") {
              saveTemplate(this.$store.getters.name, templateToSave); // Save to IndexedDB
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

        // await saveTemplate(this.$store.getters.name, templateToSave); // Save to IndexedDB
        // this.$message.success("Template saved successfully");
        // this.getTemplateList();
        // this.centerDialogVisible = false;
      } catch (error) {
        console.error("Failed to save template:", error);
        this.$message.error("Failed to save template. Please check your JSON format.");
      }
    },

    async handleViewTemplate(template) {
      this.templateDocument = JSON.stringify(template.template_json, null, 2);
      this.templateDocumentDialogVisible = true;
    },

    handleDelete(index, row) {
      deleteTemplate(this.$store.getters.name, row.id)
        .then(() => {
          this.$message.success("Template deleted successfully");
          this.getTemplateList();
        })
        .catch(() => {
          this.$message.error("Failed to delete template");
        });
    },

    getTemplateList() {
      getTemplates(this.$store.getters.name)
        .then((templates) => {
          this.tableData = templates;
        })
        .catch(() => {
          this.$message.error("Failed to retrieve template list");
        });
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
    this.getTemplateList();
  }
};
</script>

<style lang="css">
.mb8 {
  margin-bottom: 8px;
}
</style>