<template>
    <div class="app-container">
      <!-- Header -->
      <div class="headerContainer">
        <div class="title">
          <div class="desc">Template Generator</div>
        </div>
        <div class="content">
          You can use this LLM-powered generator to build your credential template according to your description.
        </div>
        <div class="content">
    <strong>Note:</strong> The basic LLM model here is the DeepSeek-R1-Distill-Qwen-7B.
</div>
      </div>
  
      <!-- Input Form Section -->
      <div class="form-container">
        <div class="prompt-text">
          Please describe the purpose of the credential and your requirements.
        </div>
        
        <el-form :model="form" label-position="top">
          <el-form-item label="Description:">
            <el-input 
              type="textarea" 
              v-model="form.description" 
              :rows="4"
              placeholder="Enter your credential description here, e.g. 'Degree Certificate' or 'Best paper award of top conference'."
            ></el-input>
          </el-form-item>
          
          <el-form-item label="Number of attributes (k)">
            <el-input-number 
              v-model="form.attribute_count" 
              :min="1" 
              :max="20"
            ></el-input-number>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="generateTemplate" 
              :loading="loading"
              class="btnStyle"
            >
              Generate
            </el-button>
            
            <!-- <el-button 
              icon="el-icon-time" 
              @click="drawerVisible = true" 
              style="margin-left: 10px;"
            >
              History
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
  
      <!-- Output Section (conditionally shown) -->
      <div v-if="output" class="output-container">
        <div class="output-header">
          <h3>Generated Template</h3>
          <div>
            <el-button 
              type="primary" 
              size="small"
              icon="el-icon-star-off"
              @click="showSaveDialog"
            >
              Save as Template
            </el-button>
            <el-button 
              type="success" 
              size="small" 
              icon="el-icon-download" 
              @click="downloadTemplate"
            >
              Download
            </el-button>
          </div>
        </div>
        
        <el-input
          type="textarea"
          v-model="output"
          :rows="10"
          readonly
          class="output-textarea"
        ></el-input>
      </div>
  
      <!-- Save Template Dialog -->
      <el-dialog 
        title="Save as Template" 
        :visible.sync="saveDialogVisible"
        width="500px"
      >
        <el-form :model="saveForm" label-width="140px" :rules="rules" ref="saveForm">
          <el-form-item label="Template Name" prop="name">
            <el-input v-model="saveForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Select DID" prop="issuer_id">
            <el-select v-model="saveForm.issuer_id" placeholder="Select a DID">
              <el-option v-for="did in didList" :key="did" :label="did" :value="did"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveTemplate" :loading="saving">Save</el-button>
        </span>
      </el-dialog>
  
      <!-- Previous Templates Drawer
      <el-drawer
        title="Generated Templates"
        :visible.sync="drawerVisible"
        direction="rtl"
        size="50%"
      >
        <el-table :data="generatedTemplates" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="description" label="Description">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.description" placement="top" effect="light">
                <span>{{ scope.row.description.substring(0, 50) }}{{ scope.row.description.length > 50 ? '...' : '' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="attribute_count" label="Attributes" width="100"></el-table-column>
          <el-table-column prop="created_at" label="Date" width="180">
            <template slot-scope="scope">
              {{ new Date(scope.row.created_at).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Actions" width="120">
            <template slot-scope="scope">
              <el-button @click="loadTemplate(scope.row.id)" type="text" size="small">View</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer> -->
      
      <!-- Progress Dialog -->
      <el-dialog 
        :visible.sync="progressVisible" 
        width="30%" 
        center 
        :close-on-click-modal="false" 
        :show-close="false"
        :title="progressStatus === 'exception' ? 'Error' : 'Generating Template'"
      >
        <div class="progress-dialog">
          <el-progress 
            type="circle" 
            :percentage="progressPercentage" 
            :status="progressStatus"
            :stroke-width="8"
          ></el-progress>
          <p>{{ progressMessage }}</p>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { generateTemplate, getGeneratedTemplatesList, getGeneratedTemplateById, saveAsTemplate } from '@/api/templateGenerator';
  import { saveTemplate, getAllDIDIds } from "@/utils/indexedDB"; // IndexedDB 工具
  import { createTemplate} from "@/utils/bbs-utils"; //bbs工具
  export default {
    name: 'TemplateGenerator',
    data() {
      return {
        form: {
          description: '',
          attribute_count: 3
        },
        output: '',
        loading: false,
        currentTemplateData: null,
        
        // Progress tracking
        progressVisible: false,
        progressPercentage: 0,
        progressStatus: '',
        progressMessage: 'Generating template...',
        progressInterval: null,
        
        saveDialogVisible: false,
        saveForm: {
          name: '',
          issuer_id: ''
        },
        saving: false,
        
        drawerVisible: false,
        generatedTemplates: [],
        
        didList: [], // 存储 DID 列表
        
        rules: {
          name: [
            { required: true, message: 'Please enter a template name', trigger: 'blur' },
            { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
          ],
          issuer_id: [
            { required: true, message: 'Please select a DID', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      // Pre-fetch the list of generated templates
      this.fetchGeneratedTemplates();
    },  
    methods: {
      async generateTemplate() {
        // Validate inputs
        if (!this.form.description.trim()) {
          this.$message.error('Please provide a description');
          return;
        }
        
        if (this.form.attribute_count < 1) {
          this.$message.error('Number of attributes must be at least 1');
          return;
        }
        
        this.loading = true;
        
        // Show progress dialog
        this.startProgressIndicator();
        
        try {
          // Call backend API
          const response = await generateTemplate({
            description: this.form.description,
            attribute_count: this.form.attribute_count
          });
          
          // Stop progress indicator
          this.stopProgressIndicator(true);
          
          // Debug the response structure
          console.log('API Response:', response.template.template_json);
          
          let templateJson = response.template.template_json;
  
          console.log('templateJson:', templateJson);
          
          // Store current template data for saving later
          this.currentTemplateData = response.template;
          
          // Format the output as nicely formatted JSON
          this.output = JSON.stringify(templateJson, null, 2);
          
          // Update the template name with a suggestion based on description
          const words = this.form.description.split(/\s+/).filter(w => w.length > 3).slice(0, 3);
          if (words.length > 0) {
            this.saveForm.name = words.join('_').toLowerCase() + '_template';
          } else {
            this.saveForm.name = 'credential_template_' + new Date().toISOString().split('T')[0];
          }
          
          this.$message.success('Template generated successfully');
          
          // Refresh the list of generated templates
          this.fetchGeneratedTemplates();
        } catch (error) {
          // Stop progress indicator with error
          this.stopProgressIndicator(false);
          
          console.error('Error generating template:', error);
          
          let errorMsg = 'Unknown error occurred';
          
          if (error.message && error.message.includes('timeout')) {
            errorMsg = 'Request timed out. The server might still be processing your request. Please check the history after a few moments.';
            
            // Even though we got a timeout, the server might still complete the job
            // Let's check after a delay
            setTimeout(() => {
              this.fetchGeneratedTemplates();
            }, 5000); // Wait 5 seconds then check
          } else if (error.response) {
            errorMsg = error.response.data?.message || `Server error: ${error.response.status}`;
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          this.$message.error('Failed to generate template: ' + errorMsg);
        } finally {
          this.loading = false;
        }
      },
      
      downloadTemplate() {
        if (!this.output) return;
        
        const blob = new Blob([this.output], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `credential-template-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      
      async showSaveDialog() {
        if (!this.currentTemplateData) {
          this.$message.warning('No template data available to save');
          return;
        }
        
        // 加载 DID 列表
        await this.loadDIDList();
        
        this.saveDialogVisible = true;
      },
      
      async loadDIDList() {
        try {
          // 假设 getAllDIDIds 函数需要当前用户名作为参数
          this.didList = await getAllDIDIds(this.$store.getters.name); 
          
          // 如果用户已登录且有 DID，自动选择第一个
          if (this.didList && this.didList.length > 0) {
            this.saveForm.issuer_id = this.didList[0];
          }
        } catch (error) {
          console.error('Error loading DID list:', error);
          this.$message.error("Failed to load DID list");
        }
      },
      
      async saveTemplate() {
        this.$refs.saveForm.validate(async valid => {
          if (!valid) {
            return false;
          }
          
          this.saving = true;
          
          try {
            // Get the template JSON to save
            let templateJson;
            if (this.currentTemplateData.template_json) {
              templateJson = this.currentTemplateData.template_json;
            } else {
              // If currentTemplateData is already the template_json
              templateJson = this.currentTemplateData;
            }
            //const templateData = JSON.parse(templateJson);
            var template = await createTemplate(templateJson, this.saveForm.issuer_id, '666', this.saveForm.name);
            await saveAsTemplate({
              name: this.saveForm.name,
              issuer_id: this.saveForm.issuer_id,
              template_json: template
            });
            const templateToSave = {
                name: this.saveForm.name,
                template_json:  template,
                issuer_id: this.saveForm.issuer_id // Include selected DID
            };
            saveTemplate(this.$store.getters.name, templateToSave); // Save to IndexedDB
            this.$message.success('Template saved successfully');
            this.saveDialogVisible = false;
          } catch (error) {
            console.error('Error saving template:', error);
            const errorMsg = error.response?.data?.message || 'Unknown error occurred';
            this.$message.error('Failed to save template: ' + errorMsg);
          } finally {
            this.saving = false;
          }
        });
      },
      
      async fetchGeneratedTemplates() {
        try {
          const response = await getGeneratedTemplatesList();
          
          // Handle different response structures
          if (response.data.value && response.data.value.templates) {
            this.generatedTemplates = response.data.value.templates;
          } else if (response.data.templates) {
            this.generatedTemplates = response.data.templates;
          } else {
            this.generatedTemplates = response.data || [];
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      },
      
      async loadTemplate(id) {
        try {
          const response = await getGeneratedTemplateById(id);
          
          // Handle different response structures
          let templateData;
          if (response.data.value && response.data.value.template) {
            templateData = response.data.value.template;
          } else if (response.data.template) {
            templateData = response.data.template;
          } else {
            templateData = response.data;
          }
          
          this.currentTemplateData = templateData;
          
          // Get the template JSON
          let templateJson;
          if (templateData.template_json) {
            templateJson = templateData.template_json;
          } else {
            templateJson = templateData;
          }
          
          this.output = JSON.stringify(templateJson, null, 2);
          
          // Update form if applicable
          if (templateData.description) {
            this.form.description = templateData.description;
          }
          if (templateData.attribute_count) {
            this.form.attribute_count = templateData.attribute_count;
          }
          
          this.drawerVisible = false;
        } catch (error) {
          console.error('Error loading template:', error);
          this.$message.error('Failed to load template');
        }
      },
      
      // Progress indicator methods
      startProgressIndicator() {
        this.progressVisible = true;
        this.progressPercentage = 0;
        this.progressStatus = '';
        this.progressMessage = 'Generating template...';
        
        // Simulate progress with an interval
        this.progressInterval = setInterval(() => {
          // Slow down progress as it gets higher
          if (this.progressPercentage < 70) {
            this.progressPercentage += Math.floor(Math.random() * 5) + 1;
          } else if (this.progressPercentage < 90) {
            this.progressPercentage += Math.floor(Math.random() * 2) + 1;
          } else if (this.progressPercentage < 99) {
            this.progressPercentage += 1;
          }
          
          // Update message based on progress
          if (this.progressPercentage > 80) {
            this.progressMessage = 'Almost there...';
          } else if (this.progressPercentage > 50) {
            this.progressMessage = 'Processing your requirements...';
          }
          
          if (this.progressPercentage >= 99) {
            this.progressPercentage = 99;
            clearInterval(this.progressInterval);
            this.progressMessage = 'Waiting for server response...';
          }
        }, 300);
      },
      
      stopProgressIndicator(success) {
        clearInterval(this.progressInterval);
        
        if (success) {
          this.progressPercentage = 100;
          this.progressStatus = 'success';
          this.progressMessage = 'Template generated successfully!';
          
          // Close the dialog after 1 second
          setTimeout(() => {
            this.progressVisible = false;
          }, 1000);
        } else {
          this.progressStatus = 'exception';
          this.progressMessage = 'Error generating template.';
          
          // Close the dialog after 2 seconds
          setTimeout(() => {
            this.progressVisible = false;
          }, 2000);
        }
      }
    },
    beforeDestroy() {
      // Clean up interval if component is destroyed
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    }
  };
  </script>
  
  <style lang="css" scoped>
  .app-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .headerContainer {
    padding: 12px 0;
    margin-bottom: 24px;
  }
  
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .desc {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
  
  .content {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 400;
    color: #666666;
    margin-bottom: 20px;
  }
  
  .form-container {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
  }
  
  .prompt-text {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #333;
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
  }
  
  .btnStyle:hover {
    background-color: #2955d9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 112, 244, 0.2);
  }
  
  .btnStyle:active {
    transform: translateY(0);
  }
  
  .output-container {
    background-color: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
  
  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .output-header h3 {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
  }
  
  .output-textarea {
    font-family: monospace;
    background-color: #f8f9fa;
  }
  
  .progress-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 10px;
  }
  
  .progress-dialog p {
    margin-top: 20px;
    font-size: 16px;
    color: #606266;
  }
  </style>
  