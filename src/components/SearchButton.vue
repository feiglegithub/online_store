<template>
  <div>
    <div
      style="
        line-height: 40px;
        text-align: center;
        border-bottom: 1px #ededed solid;
        padding: 5px;
      "
      @click="click"
    >
      <div style="background-color: #ededed; border-radius: 5px">
        <van-icon name="search" />搜索
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["to"],
  methods: {
    click() {
      this.$router.push(this.to);
    },
  },
};
</script>