<template>
  <div style="margin-top: 200px" v-loading="loading">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      style="
        width: 500px;
        margin: auto;
        padding: 50px;
        border-radius: 10px;
        background-color: #ededed;
      "
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          clearable
          placeholder="请输入密码"
          show-password
        ></el-input>
        <el-alert :title="error" type="error" center show-icon v-if="showError">
        </el-alert>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          style="width: 100%"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
      error: "",
      showError: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;

          let params = new URLSearchParams();
          params.append("name", this.ruleForm.name);
          params.append("psw", this.ruleForm.password);
          this.axios
            .post("/login", params)
            .then((res) => {
              let user = res.data;

              if (user.name != null) {
                // this.$store.commit("updateUser", res.data);
                sessionStorage.setItem("user", JSON.stringify(user));
                this.$router.push("/index");
              } else {
                this.error = "用户名密码不正确";
                this.showError = true;
              }

              this.loading = false;
            })
            .catch((err) => {
              this.error = err;
              this.showError = true;
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>