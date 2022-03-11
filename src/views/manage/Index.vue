<template>
  <el-container>
    <el-header style="line-height: 5; text-align: center">管理后台</el-header>
    <el-container>
      <el-aside>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          style="height: calc(100vh - 60px)"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <!-- <i class="el-icon-location"></i> -->
              <span>商品管理</span>
            </template>
            <el-menu-item index="/classifitionManagement"
              >分类管理</el-menu-item
            >
            <el-menu-item index="/commodityAdd">商品添加</el-menu-item>
            <el-menu-item index="/commodityList">商品列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  mounted() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    // console.log(user);
    if (user == null) {
      this.$router.push("/manage");
    }
  },
};
</script>

<style scoped>
</style>