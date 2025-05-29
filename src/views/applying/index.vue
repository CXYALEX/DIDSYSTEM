<template>
    <div class="apply-credential-container">
        <!-- 页面头部 -->
        <div class="headerContainer">
            <div class="title">
                <div class="desc">Apply for Credential</div>
            </div>
            <div class="content">
                Apply for credentials from the issuer based on the credential template.
            </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-section">
            <el-input
                v-model="searchKeyword"
                placeholder="Search templates by name..."
                prefix-icon="el-icon-search"
                @input="handleSearch"
                clearable
                class="search-input">
            </el-input>
        </div>

        <!-- 模板计数 -->
        <div class="countNum">
            Templates <span>{{ filteredTemplates.length }}</span>
        </div>

        <!-- 模板卡片列表 -->
        <div class="templates-grid" v-loading="loading">
            <div class="template-card" v-for="template in filteredTemplates" :key="template.id">
                <div class="card-header">
                    <h3 class="template-name">{{ template.name }}</h3>
                </div>
                
                <div class="card-content">
                    <div class="template-info">
                        <div class="info-item" v-if="template.template_json && template.template_json.issuerId">
                            <span class="label">
                                <i class="el-icon-user"></i>
                                Issuer:
                            </span>
                            <span class="value">{{ template.template_json.issuerId }}</span>
                        </div>
                        
                        <!-- 属性展示 -->
                        <div class="info-item" v-if="getTemplateFields(template).length > 0">
                            <span class="label attributes-label">
                                <i class="el-icon-menu"></i>
                                Attributes:
                            </span>
                            <div class="attributes-container">
                                <div class="attributes-grid">
                                    <div 
                                        v-for="field in getTemplateFields(template).slice(0, 4)" 
                                        :key="field" 
                                        class="attribute-item">
                                        <i class="el-icon-price-tag"></i>
                                        <span>{{ formatFieldName(field) }}</span>
                                    </div>
                                </div>
                                <div 
                                    v-if="getTemplateFields(template).length > 4" 
                                    class="more-attributes">
                                    <i class="el-icon-more"></i>
                                    <span>+{{ getTemplateFields(template).length - 4 }} more</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 如果没有属性，显示加载状态或提示 -->
                        <div class="info-item" v-else-if="!template.fieldsLoading">
                            <span class="label">
                                <i class="el-icon-menu"></i>
                                Attributes:
                            </span>
                            <div class="no-attributes">
                                <i class="el-icon-info"></i>
                                <span>Click to view</span>
                            </div>
                        </div>
                        
                        <!-- 加载状态 -->
                        <div class="info-item" v-if="template.fieldsLoading">
                            <span class="label">
                                <i class="el-icon-menu"></i>
                                Attributes:
                            </span>
                            <div class="loading-attributes">
                                <i class="el-icon-loading"></i>
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <el-button 
                        type="primary" 
                        @click="handleApplyCredential(template)" 
                        class="apply-btn"
                        :loading="template.applying"
                        size="small">
                        <i class="el-icon-document-add"></i>
                        Apply
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTemplates.length === 0 && !loading" class="empty-state">
            <i class="el-icon-document"></i>
            <p>{{ searchKeyword ? 'No templates found matching your search.' : 'No templates available.' }}</p>
        </div>

        <!-- 申请凭证表单弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="50%" center>
            <el-form ref="form" :model="form" label-width="150px" class="form-container">
                <el-form-item v-for="(value, key) in credentialSubjectFields" :key="key" :label="formatFieldName(key)" class="custom-label">
                    <el-select
                        v-if="key === 'id'"
                        v-model="form.credentialSubject[key]"
                        placeholder="Select a DID"
                        style="width: 80%;">
                        <el-option v-for="did in didList" :key="did" :label="did" :value="did" />
                    </el-select>
                    <el-input 
                        v-else
                        v-model="form.credentialSubject[key]" 
                        style="width: 80%;"
                        :placeholder="`Enter ${formatFieldName(key)}`"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm" :loading="submitting">Confirm</el-button>
                <el-button @click="cancel">Cancel</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getAllDIDIds } from "@/utils/indexedDB";
import { getTemplateList, getTemplateDetailById } from "@/api/template";
import { getVocabFromTemplate, createInputDocument } from "@/utils/bbs-utils";
import { createApplications } from "@/api/application";

export default {
    name: 'ApplyCredential',
    data() {
        return {
            templates: [],
            filteredTemplates: [],
            searchKeyword: '',
            loading: false,
            centerDialogVisible: false,
            submitting: false,
            selectedTemplate: null,
            template_json: null,
            form: {
                credentialSubject: {}
            },
            credentialSubjectFields: {},
            didList: [],
            dialogTitle: '',
            templateFieldsCache: {} // 缓存模板字段
        };
    },
    
    methods: {
        async loadTemplates() {
            this.loading = true;
            try {
                const response = await getTemplateList();
                this.templates = response.templates || [];
                console.log("Loaded templates:", this.templates);
                
                // 为每个模板添加加载状态
                this.templates = this.templates.map(template => ({
                    ...template,
                    fieldsLoading: false,
                    applying: false,
                    fieldsLoaded: false
                }));
                
                this.filteredTemplates = [...this.templates];
                
                // 预加载前几个模板的详细信息
                await this.preloadTemplateFields();
            } catch (error) {
                this.$message.error("Failed to load templates.");
                console.error('Load templates error:', error);
            } finally {
                this.loading = false;
            }
        },

        async preloadTemplateFields() {
            // 预加载前3个模板的字段信息
            const templatesToPreload = this.templates.slice(0, 3);
            for (const template of templatesToPreload) {
                await this.loadTemplateFields(template);
            }
        },

        async loadTemplateFields(template) {
            if (template.fieldsLoaded || this.templateFieldsCache[template.id]) {
                return;
            }

            try {
                template.fieldsLoading = true;
                const response = await getTemplateDetailById(template.id);
                if (response.template && response.template.template_json) {
                    // 更新模板的template_json
                    const templateIndex = this.templates.findIndex(t => t.id === template.id);
                    if (templateIndex !== -1) {
                        this.templates[templateIndex].template_json = response.template.template_json;
                        this.templates[templateIndex].fieldsLoaded = true;
                    }
                    
                    // 缓存字段信息
                    this.templateFieldsCache[template.id] = response.template.template_json;
                }
            } catch (error) {
                console.error('Failed to load template fields:', error);
            } finally {
                template.fieldsLoading = false;
            }
        },

        async loadDIDList() {
            try {
                this.didList = await getAllDIDIds(this.$store.getters.name);
            } catch (error) {
                this.$message.error("Failed to load DID list");
                console.error('Load DID list error:', error);
            }
        },

        handleSearch() {
            if (!this.searchKeyword.trim()) {
                this.filteredTemplates = [...this.templates];
            } else {
                const keyword = this.searchKeyword.toLowerCase();
                this.filteredTemplates = this.templates.filter(template => 
                    template.name.toLowerCase().includes(keyword) ||
                    (template.template_json && 
                     template.template_json.templateName && 
                     template.template_json.templateName.toLowerCase().includes(keyword))
                );
            }
        },

        getTemplateFields(template) {
            if (!template.template_json) {
                // 如果还没有加载详细信息，尝试加载
                if (!template.fieldsLoading && !template.fieldsLoaded) {
                    this.loadTemplateFields(template);
                }
                return [];
            }
            
            try {
                const vocab = getVocabFromTemplate(template.template_json);
                return Object.keys(vocab).filter(key => key !== 'id');
            } catch (error) {
                console.error('Error extracting template fields:', error);
                return [];
            }
        },

        formatFieldName(fieldName) {
            // 格式化字段名，将camelCase转换为更友好的显示格式
            return fieldName
                .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
                .replace(/^./, str => str.toUpperCase()) // 首字母大写
                .trim();
        },

        async handleApplyCredential(template) {
            template.applying = true;
            this.selectedTemplate = template.id;
            this.dialogTitle = `Apply for ${template.name}`;
            
            try {
                let templateDetail = template.template_json;
                
                // 如果没有详细信息，先加载
                if (!templateDetail) {
                    const response = await getTemplateDetailById(template.id);
                    templateDetail = response.template.template_json;
                    
                    // 更新缓存
                    const templateIndex = this.templates.findIndex(t => t.id === template.id);
                    if (templateIndex !== -1) {
                        this.templates[templateIndex].template_json = templateDetail;
                    }
                }
                
                this.template_json = templateDetail;
                const extractResult = getVocabFromTemplate(templateDetail);
                this.credentialSubjectFields = extractResult;
                
                // Initialize form with empty values
                this.form.credentialSubject = Object.keys(extractResult).reduce((acc, key) => {
                    acc[key] = "";
                    return acc;
                }, {});
                
                this.centerDialogVisible = true;
            } catch (error) {
                this.$message.error("Failed to fetch template details.");
                console.error('Fetch template error:', error);
            } finally {
                template.applying = false;
            }
        },

        async confirm() {
            // Validate form
            const requiredFields = Object.keys(this.credentialSubjectFields);
            const emptyFields = requiredFields.filter(field => !this.form.credentialSubject[field]);
            
            if (emptyFields.length > 0) {
                this.$message.warning(`Please fill in all required fields: ${emptyFields.join(', ')}`);
                return;
            }

            this.submitting = true;
            try {
                const inputDocument = await createInputDocument(
                    this.template_json.vocabUrl, 
                    this.template_json.templateName, 
                    this.template_json.issuerId, 
                    this.form.credentialSubject
                );
                
                const applicationToSend = {
                    holder_id: inputDocument.credentialSubject.id,
                    application_json: inputDocument,
                    issuer_id: this.template_json.issuerId,
                    template_id: this.selectedTemplate
                };
                
                console.log("applicationToSend:", applicationToSend);
                await createApplications(applicationToSend);
                
                // Check if test account
                if (this.$store.getters.name && this.$store.getters.name.startsWith('test-')) {
                    this.$message({
                        type: 'warning',
                        message: 'Application submitted successfully. Please switch to the issuer account to approve this application.',
                    });
                } else {
                    this.$message.success("Application submitted successfully");
                }
                
                this.centerDialogVisible = false;
                this.resetForm();
            } catch (error) {
                this.$message.error("Failed to submit application.");
                console.error('Submit application error:', error);
            } finally {
                this.submitting = false;
            }
        },

        cancel() {
            this.centerDialogVisible = false;
            this.resetForm();
        },

        resetForm() {
            this.form = {
                credentialSubject: {}
            };
            this.credentialSubjectFields = {};
            this.selectedTemplate = null;
            this.template_json = null;
        }
    },

    async mounted() {
        await this.loadTemplates();
        await this.loadDIDList();
    }
};
</script>

<style lang="scss" scoped>
.apply-credential-container {
    padding: 20px;
    min-height: 100vh;
    background-color: #f8f9fa;
}

.headerContainer {
    padding: 12px 0 24px 0;

    .title {
        height: 60px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .desc {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            letter-spacing: -0.5px;
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

.search-section {
    margin-bottom: 24px;
    
    .search-input {
        max-width: 400px;
        
        ::v-deep .el-input__inner {
            border-radius: 8px;
            border: 1px solid #dcdfe6;
            transition: all 0.2s ease;
            
            &:focus {
                border-color: #4070f4;
                box-shadow: 0 0 0 2px rgba(64, 112, 244, 0.1);
            }
        }
    }
}

.countNum {
    padding: 16px 20px;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    
    span {
        padding: 4px 8px;
        background-color: #f3f4f7;
        border-radius: 12px;
        margin-left: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #666;
    }
}

.templates-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
}

.template-card {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #e8e8e8;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    height: fit-content;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        border-color: #4070f4;
    }
    
    .card-header {
        padding: 16px 16px 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        
        .template-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    
    .card-content {
        padding: 14px 16px;
        
        .template-info {
            .info-item {
                margin-bottom: 12px;
                
                &:last-child {
                    margin-bottom: 0;
                }
                
                .label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #666;
                    display: flex;
                    align-items: center;
                    margin-bottom: 6px;
                    
                    i {
                        margin-right: 4px;
                        color: #4070f4;
                        font-size: 12px;
                    }
                    
                    &.attributes-label {
                        margin-bottom: 8px;
                    }
                }
                
                .value {
                    font-size: 12px;
                    color: #333;
                    margin-left: 16px;
                    background: #f8f9fa;
                    padding: 3px 6px;
                    border-radius: 3px;
                    display: inline-block;
                    max-width: calc(100% - 16px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .attributes-container {
                    .attributes-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 6px;
                        margin-bottom: 6px;
                        
                        .attribute-item {
                            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                            border: 1px solid #e1f5fe;
                            border-radius: 4px;
                            padding: 4px 6px;
                            font-size: 10px;
                            color: #0d47a1;
                            display: flex;
                            align-items: center;
                            transition: all 0.2s ease;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            
                            i {
                                margin-right: 3px;
                                font-size: 9px;
                                color: #1976d2;
                                flex-shrink: 0;
                            }
                            
                            span {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            
                            &:hover {
                                background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
                                transform: translateY(-1px);
                                box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
                            }
                        }
                    }
                    
                    .more-attributes {
                        background: #f5f5f5;
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                        padding: 4px 6px;
                        font-size: 10px;
                        color: #666;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        
                        i {
                            margin-right: 3px;
                            color: #999;
                        }
                    }
                }
                
                .no-attributes,
                .loading-attributes {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 4px;
                    padding: 6px 8px;
                    font-size: 11px;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    i {
                        margin-right: 4px;
                        color: #adb5bd;
                    }
                }
                
                .loading-attributes {
                    i {
                        animation: spin 1s linear infinite;
                    }
                }
            }
        }
    }
    
    .card-footer {
        padding: 12px 16px 16px 16px;
        
        .apply-btn {
            width: 100%;
            background: linear-gradient(135deg, #4070f4 0%, #2955d9 100%);
            border: none;
            color: #ffffff;
            font-size: 13px;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            
            i {
                margin-right: 4px;
                font-size: 14px;
            }
            
            &:hover {
                background: linear-gradient(135deg, #2955d9 0%, #1e3a8a 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(64, 112, 244, 0.3);
            }
            
            &:active {
                transform: translateY(0);
            }
        }
    }
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;
    
    .el-icon-document {
        font-size: 48px;
        margin-bottom: 16px;
        color: #ddd;
    }
    
    p {
        font-size: 16px;
        margin: 0;
    }
}

.custom-label .el-form-item__label {
    width: 150px;
    flex: 0 0 150px;
}

.form-container {
    .el-form-item {
        margin-bottom: 20px;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

// 响应式设计
@media (max-width: 1200px) {
    .templates-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .templates-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .template-card {
        margin: 0;
        
        .card-content .template-info .info-item .attributes-container .attributes-grid {
            grid-template-columns: 1fr;
        }
    }
}

@media (max-width: 480px) {
    .apply-credential-container {
        padding: 15px;
    }
    
    .headerContainer .title .desc {
        font-size: 24px;
    }
}
</style>
