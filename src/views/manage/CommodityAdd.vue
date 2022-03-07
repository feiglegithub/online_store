<template>
  <div v-loading="loading">
    <el-upload
      class="upload-demo"
      ref="upload"
      action="/online_store/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :on-success="handleSuccess"
      multiple
      accept="image/*"
      list-type="picture"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        v-if="false"
        >上传到服务器</el-button
      >
      <!--
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div> -->
    </el-upload>
    <el-row>
      <el-col :span="3">商品名称：</el-col>
      <el-col :span="21">
        <el-input v-model="inputCommodity" placeholder="请输入内容"> </el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3">一级分类：</el-col>
      <el-col :span="5">
        <el-select
          v-model="primaryValue"
          placeholder="请选择"
          @change="primarySelectChange"
        >
          <el-option
            v-for="item in primaryClassification"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">二级分类：</el-col>
      <el-col :span="5">
        <el-select v-model="secondValue" placeholder="请选择">
          <el-option
            v-for="item in secondClassification"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3">商品描述：</el-col>
      <el-col :span="21">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="inputDescribe"
        >
        </el-input>
      </el-col>
    </el-row>
    <el-button
      type="primary"
      style="width: 100%; margin-top: 5px"
      @click="handleCommit"
      >提交</el-button
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      inputCommodity: "",
      inputDescribe: "",
      primaryValue: "",
      secondValue: "",
      primaryClassification: [],
      secondClassification: [],
      loading: false,
      price: 0,
      commit: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // let params = new URLSearchParams();
      // params.append("name", file.name);
      // this.axios
      //   .post("/file/Delete", params)
      //   .then((res) => {
      //     let result = res.data;
      //     if (!result.status) {
      //       this.$notify.error({
      //         title: "错误",
      //         message: result.message,
      //         duration: 0,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     this.$notify.error({
      //       title: "错误",
      //       message: err,
      //       duration: 0,
      //     });
      //   });
    },

    handlePreview(file) {
      console.log(file);
    },

    handleSuccess(response, file, fileList) {
      if (this.commit) {
        if (response.status) {
          this.commit = false;

          // this.fileList = fileList;
          let fileNams = [];
          for (const iterator of fileList) {
            fileNams.push(iterator.name);
          }
          let params = new URLSearchParams();
          params.append("fileNams", fileNams);
          params.append("name", this.inputCommodity);
          params.append("primary", this.primaryValue);
          params.append("second", this.secondValue);
          params.append("describe", this.inputDescribe);
          params.append("price", this.price);

          this.axios
            .post("/commodity/Add", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.inputCommodity = "";
                this.inputDescribe = "";
                this.fileList = [];
                this.$message({
                  message: result.message,
                  type: "success",
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: result.message,
                  duration: 0,
                });
              }
              this.loading = false;
            })
            .catch((err) => {
              this.$notify.error({
                title: "错误",
                message: err,
                duration: 0,
              });
              this.loading = false;
            });
        } else {
          this.$notify.error({
            title: "错误",
            message: response.message,
            duration: 0,
          });
        }
      }
    },

    primarySelectChange() {
      let params = new URLSearchParams();
      params.append("primaryClassification", this.primaryValue);
      this.axios
        .post("/getSecondClassificationByPrimaryClassification", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.secondClassification = result.list;
          } else {
            this.$notify.error({
              title: "错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err,
            duration: 0,
          });
        });
    },

    handleCommit() {
      this.loading = true;

      this.commit = true;

      this.$refs.upload.submit();
    },

    submitUpload() {},
  },
  created() {
    this.axios
      .get("/primaryClassification/getAll")
      .then((res) => {
        this.primaryClassification = res.data;
      })
      .catch((err) => {
        this.$notify.error({
          title: "错误",
          message: err,
          duration: 0,
        });
      });
  },
};
</script>
</script>
<style>
div.el-row {
  margin-top: 5px;
}
</style>