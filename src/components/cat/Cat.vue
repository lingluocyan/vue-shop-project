<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button @click="showAddDialog()" type="primary">添加分类</el-button>
      <!-- tree型table表格展示区 -->
      <!-- :columns给表格设置数据属性 -->
      <!-- 去除复选框selection-type -->
      <!-- 去除展开行expand-type -->
      <!-- 添加序号列show-index -->
      <!-- tree的外边距 margin-top -->
      <zk-table
        :expand-type="false"
        :selection-type="false"
        :columns="catInfosColumns"
        :data="catInfos"
        show-index
      >
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row.cat_id)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            @click="delCate(scope.row.cat_id)"
            type="danger"
            size="mini"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页功能 -->
      <!-- 从上往下功能为页面变化触发的回调,页码变化触发的回调
      当前页面,每页记录条数,默认每页条数,功能模块,总页码-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="添加分类"
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
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <!-- label是表头,prop是对应的数据 -->
          <el-form-item label="分级上类">
            <!-- :options="cateTwoList"可选项数据源 -->
            <!-- v-model设定或接收当前选中的数据 -->
            <!-- change-on-select是否允许选择任意一级的选项 -->
            <!-- :prop是配置选项 -->
            <!-- 级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              :options="cateTwoList"
              v-model="selectedCateTwo"
              change-on-select
              clearable
              :props="cateTwoListProps"
              style="width:100%"
              @change="cateTwoChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editDialogVisible"
        width="60%"
        :before-close="editDialogbeforeClose"
        @close="editDialogClose"
      >
        <!-- 编辑用户表单 -->
        <el-form
          :model="editForm"
          status-icon
          ref="editFormRef"
          :rules="editFormRules"
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- label是表头,prop是对应的数据 -->
          <el-form-item label="活动名称" prop="cat_name">
            <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './Cat.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
