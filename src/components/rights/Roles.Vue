<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button @click="addDialogVisible=true" type="primary">添加角色</el-button>

      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :style="{'border-bottom':'1px solid rgb(235,238,245)','border-top':index1===0?'1px solid rgb(235,238,245)':''}"
            >
              <!-- el-col默认分为24等分 -->
              <el-col :span="5">
                <!-- el-tag是标签组件 -->
                <!-- closable是否可关闭 -->
                <!-- 这里是展开后左侧的一排标签 -->
                <!-- close关闭Tag时触发的事件 -->
                <!-- 删除指定角色权限需要角色id和权限id -->
                <el-tag closable @close="delRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :style="{'border-top':index2!==0?'1px solid rgb(235,238,245)':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="delRight(scope.row,item2.id)"
                      closable
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="delRight(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="170"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="240"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <!-- width="*"代表填满剩下的区域 -->
        <el-table-column label="操作" width="*">
          <template slot-scope="scope">
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              @click="delUser(scope.row.id)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="60%"
        :before-close="editDialogbeforeClose"
        @close="editDialogClose"
      >
        <!-- 编辑用户表单 -->
        <el-form
          :model="editForm"
          status-icon
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- label是表头,prop是对应的数据 -->
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './Role.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
