<template>
  <div>
    <el-card>
      <div slot="header">
        <span>一级分类</span>
      </div>

      <el-tag
        :key="index"
        v-for="(item, index) in primaryClassification"
        closable
        :disable-transitions="false"
        @close="handlePrimaryClose(item.name)"
        style="cursor: pointer; margin-bottom: 15px"
      >
        {{ item.name }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputPrimaryVisible"
        v-model="inputPrimaryClassification"
        ref="savePrimaryInput"
        size="small"
        @keyup.enter.native="handleInputPrimaryConfirm"
        @blur="handleInputBlur('primary')"
      >
      </el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showPrimaryInput"
        >+ New Tag</el-button
      >
    </el-card>

    <el-card>
      <div slot="header">
        <span>二级分类</span>
      </div>
      <el-tabs tab-position="left" v-model="checkTab" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in primaryClassification"
          :label="item.name"
          :name="item.name"
          :key="index"
        >
          <el-tag
            :key="index"
            v-for="(item, index) in secondClassification"
            closable
            :disable-transitions="false"
            @close="handleSecondClose(item.id)"
            style="cursor: pointer; margin-bottom: 10px"
          >
            {{ item.name }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputSecondVisible"
            v-model="inputSecondClassification"
            ref="saveSecondInput"
            size="small"
            @keyup.enter.native="handleInputSecondConfirm"
            @blur="handleInputBlur('second')"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showSecondInput(index)"
            >+ New Tag</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      primaryClassification: [],
      secondClassification: [],
      inputPrimaryVisible: false,
      inputSecondVisible: false,
      inputPrimaryClassification: "",
      inputSecondClassification: "",
      checkTab: "",
    };
  },

  methods: {
    getAllPrimaryClassification() {
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

    getSecondClassification(primaryClassification) {
      let params = new URLSearchParams();
      params.append("primaryClassification", primaryClassification);
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

    tabClick() {
      this.getSecondClassification(this.checkTab);
    },

    handlePrimaryClose(classification) {
      this.$confirm("此操作将同时删除关联的二级分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("classification", classification);
          this.axios
            .post("/primaryClassification/Delete", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.getAllPrimaryClassification();
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleSecondClose(id) {
      this.$confirm("确认删除此分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("id", id);
          this.axios
            .post("/secondClassification/Delete", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.getSecondClassification(this.checkTab);
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    showPrimaryInput() {
      this.inputPrimaryVisible = true;
      this.$nextTick((_) => {
        this.$refs.savePrimaryInput.$refs.input.focus();
        console.log(this.$refs.savePrimaryInput);
      });
    },

    showSecondInput(index) {
      this.inputSecondVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveSecondInput[index].$refs.input.focus();
      });
    },

    handleInputPrimaryConfirm() {
      let inputPrimaryClassification = this.inputPrimaryClassification;
      if (inputPrimaryClassification) {
        let params = new URLSearchParams();
        params.append("name", inputPrimaryClassification);
        this.axios
          .post("/primaryClassification/add", params)
          .then((res) => {
            let result = res.data;
            console.log(result);
            if (result.status) {
              this.getAllPrimaryClassification();
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
      }
      this.inputPrimaryVisible = false;
      this.inputPrimaryClassification = "";
    },

    handleInputSecondConfirm() {
      let inputSecondClassification = this.inputSecondClassification;
      let primaryClassification = this.checkTab;
      if (inputSecondClassification) {
        let params = new URLSearchParams();
        params.append("primaryClassification", primaryClassification);
        params.append("name", inputSecondClassification);
        this.axios
          .post("/secondClassification/add", params)
          .then((res) => {
            let result = res.data;
            if (result.status) {
              this.getSecondClassification(primaryClassification);
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
      }
      this.inputSecondVisible = false;
      this.inputSecondClassification = "";
    },

    handleInputBlur(value) {
      if (value == "primary") {
        this.inputPrimaryVisible = false;
      } else {
        this.inputSecondVisible = false;
      }
    },

    handleClick(tag) {
      alert(tag);
    },
  },

  created() {
    this.getAllPrimaryClassification();
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>