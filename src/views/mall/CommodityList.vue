<template>
  <div>
    <!-- <van-nav-bar
      :title="commodity"
      left-arrow
      @click-left="onClickLeft"
    /> -->
    <div
      class="header"
      style="
        position: fixed;
        top: 0px;
        left: 0px;
        height:50px;
        width: 100%;
        z-index: 999;
        background-color:white
      "
    >
      <van-icon
        name="arrow-left"
        size="30px"
        style="padding: 10px;z-index: 999;"
        @click="back"
      />
      <div style="position:absolute;top:12px;width: 100%; text-align: center">
        {{ second }}
      </div>
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="margin-top:50px"
    >
      <!-- <div v-for="(item, index) in commodityList" :key="index">
        <van-image
          :src="`http://localhost:8088/online_store/img/${
            item.imgs.split(',')[0]
          }`"
          fit="fill"
          width="100%"
          height="150px"
        />{{ item.name }}
      </div> -->
      <van-grid :column-num="2" :border="true">
        <van-grid-item
          v-for="(item, index) in commodityList"
          :key="index"
          :to="`/commodityDetails/${item.id}`"
        >
          <van-image
            :src="`http://localhost:8088/online_store/img/${
              item.imgs.split(',')[0]
            }`"
            fit="fill"
            width="100%"
            height="150px"
          />{{ item.name }}
        </van-grid-item>
      </van-grid>
    </van-list>
  </div>
</template>
<script>
export default {
  activated() {
    // window.addEventListener("scroll", this.handleScroll);
    // console.log(document);
  },

  deactivated() {
    // console.log(document);
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "classify") {
        console.log("classify");
        vm.commodityList = [];
        vm.loading = true;
        vm.finished = false;
        vm.page = 0;
        vm.pages = 0;

        vm.GetPagesByClassification2();
        vm.onLoad();
      }
    });

    // return true;
  },

  beforeRouteLeave(to, from, next) {
    this.firstEnter = false;

    next();
  },

  props: ["primary", "second"],

  data() {
    return {
      commodityList: [],
      loading: false,
      finished: false,
      page: 0,
      pages: 0,
      firstEnter: true,
      scroll: 0,
    };
  },

  methods: {
    handleClick() {
      console.log(document);
    },

    handleScroll() {
      // console.log(document);
      this.scroll = document.documentElement.scrollTop;
      console.log(this.scroll);
    },

    GetPagesByClassification2() {
      let params = new URLSearchParams();
      params.append("primaryClassification", this.primary);
      params.append("secondClassification", this.second);

      this.axios
        .post("/commodity/GetPagesByClassification2", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.pages = result.pages;
            if (this.pages > 0) {
            } else {
              this.finished = true;
            }
          } else {
            this.fullscreenLoading = false;
            this.$notify.error({
              title: "GetPagesByClassification2错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          this.fullscreenLoading = false;
          this.$notify.error({
            title: "GetPagesByClassification2异常",
            message: err,
            duration: 0,
          });
        });
    },

    getCommodityByPrimaryAndSecond() {
      let params = new URLSearchParams();
      params.append("primaryClassification", this.primary);
      params.append("secondClassification", this.second);
      params.append("page", this.page);
      this.axios
        .post("/commodity/GetByPrimaryAndSecond", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            if (result.data.length != 0) {
              this.commodityList = this.commodityList.concat(result.data);

              this.loading = false;
            } else {
              this.finished = true;
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: result.message,
              duration: 0,
            });
          }
        })
        .catch((err) => {
          Toast.fail(err);
          this.finished = true;
        });
    },

    onClickLeft() {
      this.$router.go(-1);
    },

    onLoad() {
      this.page += 1;
      console.log("page:" + this.page);
      this.getCommodityByPrimaryAndSecond();
    },

    back() {
      this.$router.go(-1);
    },
  },

  created() {
    console.log("created");
    this.GetPagesByClassification2();
  },

  mounted() {},
};
</script>
<style scoped>
</style>