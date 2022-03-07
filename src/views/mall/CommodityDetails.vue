<template>
  <div>
    <div>
      <van-icon
        name="arrow-left"
        size="30px"
        style="padding: 10px; z-index: 1"
        @click="back"
      />
      <div
        style="position: absolute; top: 15px; width: 100%; text-align: center"
      >
        {{ name }}
      </div>
    </div>
    <van-swipe height="300">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img
          v-lazy="image"
          style="height: 100%; width: 100%; object-fit: fill"
        />
      </van-swipe-item>
    </van-swipe>
    <div>{{ describe }}</div>
  </div>
</template>
<script>
export default {
  props: ["id"],
  data() {
    return {
      images: [],
      primaryClassification: "",
      secondClassification: "",
      describe: "",
      name: "",
    };
  },

  created() {
    this.getCommodityById(this.id);
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    getCommodityById(id) {
      let params = new URLSearchParams();
      params.append("id", id);
      this.axios
        .post("/commodity/GetById", params)
        .then((res) => {
          let result = res.data;
          if (result.status) {
            this.primaryClassification = result.data.primaryClassification;
            this.secondClassification = result.data.secondClassification;
            this.describe = result.data.description;
            this.name = result.data.name;
            let imgs = result.data.imgs.split(",");
            for (const iterator of imgs) {
              if (iterator == "null") {
                return;
              }

              this.images.push(
                "http://localhost:8088/online_store/img/" + iterator
              );
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
  },
};
</script>