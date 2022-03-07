<template>
  <div>
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
    >
      搜索
    </div>

    <!-- <x-header
      title="slot:overwrite-title"
      :left-options="{ backText: '' }"
      style="background-color: white"
    >
      <div class="overwrite-title-demo" slot="overwrite-title">
        <van-field v-model="value" placeholder="请输入用户名" />
      </div>
      <a slot="right">搜索</a>
    </x-header> -->
  </div>
</template>
<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>