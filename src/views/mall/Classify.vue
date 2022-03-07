<template>
  <div>
    <search-button to="/search"></search-button>

    <van-sidebar v-model="activeKey">
      <van-sidebar-item
        v-for="(item, index) in primaryClassification"
        :title="item.name"
        :key="index"
        @click="primaryClick(item.name)"
      />
    </van-sidebar>

    <van-grid column-num="3">
      <van-grid-item
        v-for="(item, index) in secondClassification"
        :text="item.name"
        :key="index"
        :to="`/commodityList/${selectPrimary}/${item.name}`"
      />
    </van-grid>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeKey: 0,
      primaryClassification: [],
      secondClassification: [],
      selectPrimary: "",
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

    primaryClick(val) {
      this.selectPrimary = val;
      this.getSecondClassification(val);
    },
  },
  created() {
    this.getAllPrimaryClassification();
  },
};
</script>
<style>
.van-sidebar {
  height: calc(100vh - 95px);
  float: left;
}
.van-grid {
  max-height: calc(100vh - 95px);
  overflow: auto;
}
</style>