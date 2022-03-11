<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">所有</el-menu-item>

        <el-submenu index="2">
          <template slot="title">一级分类</template>
          <el-menu-item
            :index="item.name"
            v-for="(item, index) in primaryClassificationList"
            :key="index"
            >{{ item.name }}</el-menu-item
          >
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">二级分类</template>
          <el-menu-item
            :index="item.name"
            v-for="(item, index) in secondClassificationList"
            :key="index"
            >{{ item.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>

      <div
        class="block"
        style="
          width: 300px;
          border: 1px #ededed solid;
          border-radius: 5px;
          float: left;
          margin: 5px;
        "
        v-for="(item, index) in commodityList"
        :key="index"
      >
        <el-carousel height="150px">
          <el-carousel-item
            v-for="(img, index) in item.imgs.split(',')"
            :key="index"
          >
            <el-image
              :src="`http://localhost:8088/online_store/img/${img}`"
              fit="contain"
            ></el-image>
          </el-carousel-item>
        </el-carousel>

        <div class="content" style="height: 150px">
          <div class="demonstration">
            一级分类：{{ item.primaryClassification }}
          </div>
          <div class="demonstration">
            二级分类：{{ item.secondClassification }}
          </div>
          <div class="demonstration">商品描述：{{ item.description }}</div>
          <div class="demonstration">商品名称：{{ item.name }}</div>
        </div>

        <el-button-group style="width: 100%">
          <el-button
            type="primary"
            icon="el-icon-edit"
            style="width: 50%"
            @click="handleEdit(item.id)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            style="width: 50%"
            @click="handleDelete(item.id)"
          ></el-button>
        </el-button-group>
      </div>
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      style="clear: both"
      @current-change="currentChange"
    >
    </el-pagination>

    <el-dialog
      title="修改"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
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
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
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
          <el-input v-model="editName" placeholder="请输入内容"> </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">类别：</el-col>
        <el-col :span="21">
          <el-select
            v-model="editPrimary"
            placeholder="请选择"
            @change="handleChange"
          >
            <el-option
              v-for="(item, index) in primaryClassificationList"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-select v-model="editSecond" placeholder="请选择">
            <el-option
              v-for="(item, index) in editSecondClassificationList"
              :key="index"
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
            v-model="editDescribe"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-button
        type="primary"
        style="width: 100%; margin-top: 5px"
        @click="handleSubmit"
        >提交</el-button
      >
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editPrimary: "",
      editSecond: "",
      editDescribe: "",
      editName: "",
      editPrice: 0,
      fullscreenLoading: false,
      activeIndex: "1",
      activeIndex2: "1",
      dialogTableVisible: false,
      fileList: [],
      value: "",
      textarea: "",
      input: "",
      primaryClassificationList: [],
      secondClassificationList: [],
      editSecondClassificationList: [],
      primary: "",
      second: "",
      commodityList: [],
      index: 1,
      key: "",
      keyPath: [],
      fileNams: [],
      editId: 0,
      page: 0,
      pages: 0,
      total: 0,
    };
  },
  methods: {
    currentChange(current) {
      this.page = current;
      this.getCommodity();
    },

    handleSubmit() {
      this.fullscreenLoading = true;

      let params = new URLSearchParams();
      params.append("fileNams", this.fileNams);
      params.append("name", this.editName);
      params.append("primary", this.editPrimary);
      params.append("second", this.editSecond);
      params.append("describe", this.editDescribe);
      params.append("price", this.editPrice);
      params.append("id", this.editId);

      this.axios
        .post("/commodity/Update", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
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
          this.fullscreenLoading = false;
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err,
            duration: 0,
          });
          this.fullscreenLoading = false;
        });
    },

    submitUpload() {
      this.$refs.upload.submit();
    },

    handleChange(value) {
      this.getEditSecondClassification(value);
    },

    handleEdit(id) {
      this.editId = id;
      this.getCommodityById(id);
      this.dialogTableVisible = true;
    },

    getSecondClassification(primaryClassification) {
      let params = new URLSearchParams();
      params.append("primaryClassification", primaryClassification);
      this.axios
        .post("/getSecondClassificationByPrimaryClassification", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.secondClassificationList = result.list;
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
            title: "getSecondClassification异常",
            message: err,
            duration: 0,
          });
        });
    },

    getEditSecondClassification(primaryClassification) {
      let params = new URLSearchParams();
      params.append("primaryClassification", primaryClassification);
      this.axios
        .post("/getSecondClassificationByPrimaryClassification", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.editSecondClassificationList = result.list;
            this.editSecond = "";
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
            title: "getSecondClassification异常",
            message: err,
            duration: 0,
          });
        });
    },

    getAllCommodity() {
      let params = new URLSearchParams();
      params.append("page", this.page);

      this.axios
        .post("/commodity/GetAll", params)
        .then((res) => {
          this.fullscreenLoading = false;

          let result = res.data;
          if (result.status) {
            this.commodityList = result.data;
          } else {
            this.$notify.error({
              title: "错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.fullscreenLoading = false;

          this.$notify.error({
            title: "异常",
            message: err,
            duration: 0,
          });
        });
    },

    getCommodityByPrimary(primary) {
      let params = new URLSearchParams();
      params.append("primaryClassification", primary);
      params.append("page", this.page);
      this.axios
        .post("/commodity/GetByPrimaryClassification", params)
        .then((res) => {
          this.fullscreenLoading = false;

          let result = res.data;
          if (result.status) {
            this.commodityList = result.data;
          } else {
            this.$notify.error({
              title: "错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.fullscreenLoading = false;

          this.$notify.error({
            title: "getCommodityByPrimary异常",
            message: err,
            duration: 0,
          });
        });
    },

    getCommodityByPrimaryAndSecond(primary, second) {
      let params = new URLSearchParams();
      params.append("primaryClassification", primary);
      params.append("secondClassification", second);
      params.append("page", this.page);

      this.axios
        .post("/commodity/GetByPrimaryAndSecond", params)
        .then((res) => {
          this.fullscreenLoading = false;

          let result = res.data;
          if (result.status) {
            this.commodityList = result.data;
          } else {
            this.$notify.error({
              title: "错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.fullscreenLoading = false;

          this.$notify.error({
            title: "异常",
            message: err,
            duration: 0,
          });
        });
    },

    getCommodityById(id) {
      let params = new URLSearchParams();
      params.append("id", id);
      this.axios
        .post("/commodity/GetById", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.fileList = [];
            this.fileNams = [];
            this.editPrimary = result.data.primaryClassification;
            this.editSecond = result.data.secondClassification;
            this.editDescribe = result.data.description;
            this.editName = result.data.name;
            let imgs = result.data.imgs.split(",");
            for (const iterator of imgs) {
              if (iterator == "null") {
                return;
              }
              let img = {
                name: iterator,
                url: "http://localhost:8088/online_store/img/" + iterator,
              };

              this.fileList.push(img);
              this.fileNams.push(iterator);
            }

            // this.getEditSecondClassification(this.editPrimary)
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

    getCommodity() {
      switch (this.keyPath[0]) {
        case "1":
          this.getAllCommodity();
          break;
        case "2":
          this.primary = this.keyPath[1];
          this.getSecondClassification(this.primary);

          this.getCommodityByPrimary(this.primary);
          break;
        case "3":
          this.second = this.keyPath[1];
          this.getCommodityByPrimaryAndSecond(this.primary, this.second);
          break;
        default:
          break;
      }
    },

    handleSelect(key, keyPath) {
      // console.log(keyPath[0]);
      this.fullscreenLoading = true;
      this.key = key;
      this.keyPath = keyPath;
      // this.getCommodity();

      switch (keyPath[0]) {
        case "1":
          this.axios
            .post("/commodity/GetRows")
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.page = 1;
                this.total = result.rows;
                if (this.total > 0) {
                  this.getAllCommodity();
                } else {
                  this.fullscreenLoading = false;
                  this.$message("没有更多数据");
                }
              } else {
                this.fullscreenLoading = false;
                this.$notify.error({
                  title: "GetPages错误",
                  message: result.message,
                  duration: 0,
                });
              }
            })
            .catch((err) => {
              this.fullscreenLoading = false;
              this.$notify.error({
                title: "GetPages异常",
                message: err,
                duration: 0,
              });
            });
          break;
        case "2":
          this.primary = this.keyPath[1];

          this.getSecondClassification(this.primary);

          params = new URLSearchParams();
          params.append("primaryClassification", this.primary);

          this.axios
            .post("/commodity/GetRowsByClassification1", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.page = 1;
                this.total = result.rows;
                if (this.total > 0) {
                  this.getCommodityByPrimary(this.primary);
                } else {
                  this.fullscreenLoading = false;
                  this.$message("没有更多数据");
                }
              } else {
                this.fullscreenLoading = false;
                this.$notify.error({
                  title: "GetRowsByClassification1错误",
                  message: result.message,
                  duration: 0,
                });
              }
            })
            .catch((err) => {
              this.fullscreenLoading = false;
              this.$notify.error({
                title: "GetRowsByClassification1异常",
                message: err,
                duration: 0,
              });
            });
          break;
        case "3":
          this.second = this.keyPath[1];

          let params = new URLSearchParams();
          params.append("primaryClassification", this.primary);
          params.append("secondClassification", this.second);

          this.axios
            .post("/commodity/GetRowsByClassification2", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.page = 1;
                this.total = result.rows;
                if (this.total > 0) {
                  this.getCommodityByPrimaryAndSecond(
                    this.primary,
                    this.second
                  );
                } else {
                  this.fullscreenLoading = false;
                  this.$message("没有更多数据");
                }
              } else {
                this.fullscreenLoading = false;
                this.$notify.error({
                  title: "GetRowsByClassification2错误",
                  message: result.message,
                  duration: 0,
                });
              }
            })
            .catch((err) => {
              this.fullscreenLoading = false;
              this.$notify.error({
                title: "GetRowsByClassification2异常",
                message: err,
                duration: 0,
              });
            });
          break;
        default:
          break;
      }
    },

    handleRemove(file, fileList) {
      this.fileNams = [];

      let params = new URLSearchParams();
      params.append("name", file.name);
      params.append("id", this.editId);

      for (const iterator of fileList) {
        this.fileNams.push(iterator.name);
      }
      params.append("fileNames", this.fileNams);

      this.axios
        .post("/file/Delete", params)
        .then((res) => {
          let result = res.data;
          if (!result.status) {
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

    handlePreview(file) {
      console.log(file);
    },

    handleSuccess(response, file, fileList) {
      if (response.status) {
        this.fileNams = [];
        for (const iterator of fileList) {
          this.fileNams.push(iterator.name);
        }
      } else {
        this.$notify.error({
          title: "错误",
          message: response.message,
          duration: 0,
        });
      }
    },

    handleDelete(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("id", id);

          this.axios
            .post("/commodity/Delete", params)
            .then((res) => {
              let result = res.data;
              if (result.status) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getCommodity();
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
                title: "handleDelete异常",
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

    getPrimaryClassification() {
      this.axios
        .get("/primaryClassification/getAll")
        .then((res) => {
          this.primaryClassificationList = res.data;
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err,
            duration: 0,
          });
        });
    },
  },
  created() {
    this.getPrimaryClassification();
  },
};
</script>
<style>
div.el-row {
  margin-top: 5px;
}
</style>