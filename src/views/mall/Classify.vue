<template>
  <div>
    <search-button to="/search"></search-button>

    <van-sidebar v-model="activeKey" ref="sidebar">
      <van-sidebar-item
        v-for="(item, index) in primaryClassification"
        :title="item.name"
        :key="index"
        @click="primaryClick(item.name)"
      />
    </van-sidebar>

    <van-grid column-num="3" ref="grid">
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
  activated() {
    this.$refs.sidebar.$el.scrollTop = this.sidebarScroll;
    this.$refs.grid.$el.scrollTop = this.gridScroll;
  },

  data() {
    return {
      activeKey: 0,
      primaryClassification: [],
      secondClassification: [],
      selectPrimary: "",
      sidebarScroll: 0,
      gridScroll: 0,
    };
  },
  methods: {
    scroll() {
      console.log("scroll");
    },

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
  mounted() {
    this.$refs.grid.$el.addEventListener("scroll", () => {
      this.gridScroll = this.$refs.grid.$el.scrollTop;
    });

    this.$refs.sidebar.$el.addEventListener("scroll", () => {
      this.sidebarScroll = this.$refs.sidebar.$el.scrollTop;
    });
  },
};
</script>
<style scoped>
.van-sidebar {
  height: calc(100vh - 95px);
  float: left;
}
.van-grid {
  max-height: calc(100vh - 95px);
  overflow: auto;
}
</style>