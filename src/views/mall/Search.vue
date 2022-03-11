<template>
  <div>
    <div
      class="header"
      style="position: fixed; top: 0px; width: 100%; z-index: 999;background:white"
    >
      <van-icon
        name="arrow-left"
        size="30px"
        style="padding: 10px"
        @click="back"
      />
      <input
        type="text"
        style="
          border: none;
          position: absolute;
          top: 5px;
          background-color: #ededed;
          height: 30px;
          width: 65%;
          border-radius: 5px;
          padding: 5px;
          text-align: center;
        "
        placeholder="请输入商品名称"
        v-model="name"
      />
      <div
        style="
          position: absolute;
          right: 10px;
          top: 5px;
          padding: 10px;
          background-color: red;
          color: white;
        "
        @click="handleSearch"
      >
        搜索
      </div>
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="margin-top: 40px"
    >
      <van-grid :column-num="2" :border="false">
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
  data() {
    return {
      name: "",
      list: [],
      loading: false,
      finished: false,
      commodityList: [],
    };
  },
  methods: {
    getCommodity(name) {
      let params = new URLSearchParams();
      params.append("name", name);
      this.axios
        .post("/commodity/GetByName", params)
        .then((res) => {
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

          this.loading = false;
        })
        .catch((err) => {
          Toast.fail(err);
          this.finished = true;
        });
    },

    handleSearch() {
      this.getCommodity(this.name);
    },

    back() {
      this.$router.go(-1);
    },
    onLoad() {
      this.finished = true;
    },
  },
};
</script>