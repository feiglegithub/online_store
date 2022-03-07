<template>
  <div>
    <router-view />

    <van-tabbar route>
      <van-tabbar-item replace to="/classify" icon="bars">分类</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  mounted() {
    // this.$router.push("/classify");
  },
};
</script>