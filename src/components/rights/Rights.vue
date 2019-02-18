<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <el-table :data="rightsList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="170"></el-table-column>
        <el-table-column prop="authName" label="名称" width="240"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <!-- width="*"代表填满剩下的区域 -->
        <el-table-column prop="level" label="等级" width="*">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import mix from './Rights.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
