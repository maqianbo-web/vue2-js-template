<template>
    <div class="home">
        <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <div class="aaa">11111</div>
        <el-button type="primary">测试elementUI引入</el-button>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: 'Home',
    components: {
        // HelloWorld,
    },
};
</script>
<style lang="less" scoped>
@import url('../style/index.less');
</style>
