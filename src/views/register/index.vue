<template>
    <div class="register">
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
            <h3 class="title">Registration</h3>
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="Account">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input ref="password" v-model="registerForm.password" type="password" auto-complete="off"
                    placeholder="Password">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input ref="confirmPassword" v-model="registerForm.confirmPassword" type="password" auto-complete="off"
                    placeholder="Confirmed Password">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>

            <p>Role:</p>
            <select v-model="registerForm.role" name="role" required>
                <option value="issuer">Issuer</option>
                <option value="holder">Holder</option>
                <option value="verifier">Verifier</option>
            </select>

            <el-form-item style="width: 100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width: 100%;" @click="handleRegister">
                    <span v-if="!loading">Register</span>
                    <span v-else>Registering...</span>
                </el-button>
            </el-form-item>
            <el-form-item style="width: 100%;">
                <el-button size="medium" type="info" style="width: 100%;" @click="goToLogin">
                    Back to Login
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        const validatePasswordMatch = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error("Passwords do not match"));
            } else {
                callback();
            }
        };
        return {
            registerForm: {
                username: "",
                password: "",
                confirmPassword: "",
                role: "issuer", // 默认角色
            },
            registerRules: {
                username: [{ required: true, message: "Please enter your account number", trigger: "blur" }],
                password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
                confirmPassword: [
                    { required: true, message: "Please confirm your password", trigger: "blur" },
                    { validator: validatePasswordMatch, trigger: "blur" },
                ],
            },
            loading: false,
        };
    },
    methods: {
        handleRegister() {
            console.log("跳转到注册页面");
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.loading = true;

                    // 将角色映射为对应的数值
                    const roleMap = {
                        issuer: 1,
                        holder: 2,
                        verifier: 3,
                    };
                    const roleValue = roleMap[this.registerForm.role];

                    // Prepare the user info to be sent to the Vuex action
                    const userInfo = {
                        username: this.registerForm.username,
                        password: this.registerForm.password,
                        role_id: roleValue, // Send the role value
                    };
                    console.log("123");
                    // Dispatch the register action from Vuex
                    this.$store
                        .dispatch("user/register", userInfo) // Trigger Vuex action: user/register
                        .then(() => {
                            this.loading = false;
                            this.$router.push("/login"); // Registration successful, navigate to the login page
                        })
                        .catch((error) => {
                            console.error("Registration failed:", error);
                            this.loading = false;
                        });
                } else {
                    console.log("表单校验失败");
                    return false;
                }
            });
        },
        goToLogin() {
            this.$router.push("/login"); // 跳转到登录页面
        },
    },
};
</script>

<style lang="scss" scoped>
.register {
    min-height: 100%;
    width: 100%;
    background-color: #2d3a4b;
    overflow: hidden;

    .register-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .title {
        font-size: 26px;
        color: #eee;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
}
</style>
