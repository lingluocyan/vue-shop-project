<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 轮播图 -->
    <el-carousel arrow="always" height="700px" :interval="3000" trigger="click">
      <el-carousel-item v-for="item in imgList" :key="item.id">
        <el-row>
          <el-col :span="24">
            <img class="banner-image" ref="imgHeight" :src="item.src" alt>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  created() {
  },
  data() {
    return {
      imgHeight: this.$refs.imgHeight,
      imgList: [
        {
          id: 0,
          src: require('../assets/img/wallhaven-729362.jpg')
        },
        {
          id: 1,
          src: require('../assets/img/wallhaven-697888.jpg')
        },
        {
          id: 2,
          src: require('../assets/img/wallhaven-727431.jpg')
        },
        {
          id: 3,
          src: require('../assets/img/wallhaven-747189.jpg')
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-carousel {
  margin-top: 20px;
}
.banner-image {
  height: 100%;
  width: 100%;
}
</style>
