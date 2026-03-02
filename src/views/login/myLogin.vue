<template>
    <div class="login-container">
        <div class="bg">
            <p>W e b 3 p o l y u</p>
            <span>SYSTEM</span>
        </div>
        <div class="login">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" v-if="flagControl">
                <!-- <h3 class="title">DID Management System</h3> -->
                <h3 class="title">Log in</h3>
                <h3 class="title1">New to Web3Polyu? <span @click="flagControl = !flagControl">Sign up</span></h3>
                
                <!-- 测试账号说明 -->
                <div class="test-accounts">
                    <div class="test-accounts-header">
                        <i class="el-icon-info"></i>
                        <span>Test Accounts</span>
                    </div>
                    <div class="test-accounts-list">
                        <div class="account-item">
                            <span class="role-label issuer">Issuer</span>
                            <span class="account-info" @click="fillTestAccount('test-issuer', 'test-issuer')">test-issuer / test-issuer</span>
                        </div>
                        <div class="account-item">
                            <span class="role-label holder">Holder</span>
                            <span class="account-info" @click="fillTestAccount('test-holder', 'test-holder')">test-holder / test-holder</span>
                        </div>
                        <div class="account-item">
                            <span class="role-label verifier">Verifier</span>
                            <span class="account-info" @click="fillTestAccount('test-verifier', 'test-verifier')">test-verifier / test-verifier</span>
                        </div>
                    </div>
                </div>

                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="Account">
                        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                        auto-complete="off" placeholder="password" @keyup.enter.native="handleLogin">
                        <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                </el-form-item>

                <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">Remember Password</el-checkbox>
                <el-form-item style="width: 100%;">
                    <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                        @click.native.prevent="handleLogin">
                        <span v-if="!loading">Login</span>
                        <span v-else>Logging in...</span>
                    </el-button>
                </el-form-item>

                <!--  底部  -->
                <div class="el-login-footer">
                    <span>Copyright © 2024 Web3polyu.com All Rights Reserved.</span>
                </div>
            </el-form>

            <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" v-else>
                <h3 class="title">Registration</h3>
                <h3 class="title1">complete Sign up? <span @click="flagControl = !flagControl">Login</span></h3>
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

                <div class="title1">Role Select</div>
                <el-form-item style="width: 100%;" prop="Role">
                    <el-select v-model="registerForm.role" name="role" required>
                        <el-option value="issuer">Issuer</el-option>
                        <el-option value="holder">Holder</el-option>
                        <el-option value="verifier">Verifier</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;">
                    <el-button :loading="loading1" size="medium" type="primary" style="width: 100%;" @click="handleRegister">
                        <span v-if="!loading1">Register</span>
                        <span v-else>Registering...</span>
                    </el-button>
                </el-form-item>

                <!--  底部  -->
                <div class="el-login-footer">
                    <span>Copyright © 2024 polyu.edu.hk All Rights Reserved.</span>
                </div>
            </el-form>
        </div>
        
    </div>
    
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error("Please enter the correct user name"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("The password can not be less than 6 digits"));
            } else {
                callback();
            }
        };
        const validatePasswordMatch = (rule, value, callback) => {
            if (value !== this.registerForm.password) {
                callback(new Error("Passwords do not match"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "admin",
                password: "123456"
            },
            loginRules: {
                username: [
                    { required: true, trigger: "blur", validator: validateUsername }
                ],
                password: [
                    { required: true, trigger: "blur", validator: validatePassword }
                ]
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,

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
            loading1: false,
            flagControl:true,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        // 新增方法：填充测试账号
        fillTestAccount(username, password) {
            this.loginForm.username = username;
            this.loginForm.password = password;
        },
        handleLogin() {
            console.log("跳转到登录页面");
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("user/login", this.loginForm)   //触发vuex action： user/login
                        .then(() => {
                            this.$router.push({ path:  "/" }); //触发前端路由跳转
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        goToRegister() {
            console.log("跳转到注册页面");
            this.flagControl = false // 假设注册页面的路径是 /register
        },
        handleRegister() {
            console.log("跳转到注册页面");
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.loading1 = true;

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
                    // Dispatch the register action from Vuex
                    this.$store
                        .dispatch("user/register", userInfo) // Trigger Vuex action: user/register
                        .then(() => {
                            this.loading1 = false;
                            this.flagControl = true // Registration successful, navigate to the login page
                        })
                        .catch((error) => {
                            console.error("Registration failed:", error);
                            this.loading1 = false;
                        });
                } else {
                    console.log("表单校验失败");
                    return false;
                }
            });
        },
        goToLogin() {
            this.flagControl = true
        },
    }
};
</script>
<style lang="scss" scoped>
$bg: hsl(214, 25%, 24%);
$dark_gray: #889aa4;

.login-container {
  min-height: 100%;
  width: 100%;
  display: flex;
  background: radial-gradient(circle at 10% 10%, #dfe6ff 0%, #eef2ff 35%, #f6f8ff 100%);

  .bg {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    color: #fff;
    background: linear-gradient(150deg, #3f51f7 0%, #2636a8 65%, #1f2a7a 100%);

    p {
      font-size: 34px;
      margin: 0;
      letter-spacing: 0.5rem;
      font-weight: 700;
    }

    span {
      margin-top: 12px;
      font-size: 13px;
      letter-spacing: 0.4rem;
      opacity: 0.85;
    }
  }

  .login {
    flex: 2;
    display: flex;
    align-items: center;

    .el-select {
      width: 100%;
      margin-bottom: 20px;
    }
  }

  .login-form {
    width: 560px;
    max-width: 100%;
    margin: 0 auto;
    padding: 40px 38px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #e8ecff;
    box-shadow: 0 24px 40px rgba(45, 66, 180, 0.15);
  }

  .title {
    font-size: 34px;
    margin: 0 0 12px;
    font-weight: 700;
    color: #1b2240;
  }

  .title1 {
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 18px;
    color: #66708a;

    span {
      cursor: pointer;
      color: #3f51f7;
      font-weight: 600;
    }
  }

  .test-accounts {
    background: #f5f7ff;
    border: 1px solid #e1e6ff;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 20px;

    .test-accounts-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 700;
      color: #3f4a67;

      i {
        margin-right: 5px;
        color: #3f51f7;
      }
    }

    .account-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child { margin-bottom: 0; }

      .role-label {
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        min-width: 62px;
        margin-right: 10px;
        padding: 3px 10px;
        text-align: center;
      }

      .account-info {
        font-size: 12px;
        color: #707a95;
        cursor: pointer;
        font-family: 'Courier New', monospace;

        &:hover {
          color: #3247dd;
          text-decoration: underline;
        }
      }
    }
  }

  .el-login-footer {
    font-size: 12px;
    color: #889aa4;
    margin: 24px auto 0;
    text-align: center;
    font-weight: 600;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

@media (max-width: 992px) {
  .login-container {
    flex-direction: column;

    .bg {
      min-height: 220px;
      p {
        font-size: 26px;
        letter-spacing: 0.3rem;
      }
    }

    .login {
      padding: 24px 16px;
    }

    .login-form {
      padding: 28px 20px;
      border-radius: 18px;
    }
  }
}
</style>
