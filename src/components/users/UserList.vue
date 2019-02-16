<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- clearable代表可以清空数据框,也就是输入框有数据时右侧会有一个小x -->
          <!-- @clear就是点击小x后触发的回调,在element-ui中使用keyup需要native -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="用户名" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <!-- 用户状态开关部分,需要使用插槽来获取数据 -->
          <template slot slot-scope="scope">
            <!-- 点击开关切换状态,需要id和当前状态 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row.id,scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
            <!-- 文字提示部分 -->
            <!-- :enterable代表鼠标是否能进入提示框 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="权限设置"
              :enterable="false"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" circle></el-button>
            </el-tooltip>
          </el-row>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <!-- 从上往下功能为页面变化触发的回调,页码变化触发的回调
      当前页面,每页记录条数,默认每页条数,功能模块,总页码-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import mix from './UserList-mixins.js'
export default {
  mixins: [mix],
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
</style>
