<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
          <el-button @click="addDialogVisible=true" type="primary">添加用户</el-button>
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
          <template slot-scope="scope">
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                size="mini"
                circle
              ></el-button>
              <el-button
                @click="delUser(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
              ></el-button>
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
          </template>
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
      <!-- 添加用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="60%"
        :before-close="addDialogbeforeClose"
        @close="addDialogClose"
      >
        <!-- 添加用户表单 -->
        <el-form
          :model="addForm"
          status-icon
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- label是表头,prop是对应的数据 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="60%"
        :before-close="editDialogbeforeClose"
        @close="editDialogClose"
      >
        <!-- 添加用户表单 -->
        <el-form
          :model="editForm"
          status-icon
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- label是表头,prop是对应的数据 -->
          <el-form-item label="用户名" prop="username">
            <el-input :disabled="true" v-model="editForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
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
