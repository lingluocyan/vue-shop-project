<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 数据图表的显示区域 -->/
      <div ref="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import mix from './Report.mixins.js'

export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
