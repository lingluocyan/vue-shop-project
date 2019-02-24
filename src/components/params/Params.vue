<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告提示区 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" :closable="false" show-icon type="warning"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类</span>
          <!-- :options="cateTwoList"可选项数据源 -->
          <!-- v-model设定或接收当前选中的数据 -->
          <!-- change-on-select是否允许选择任意一级的选项 -->
          <!-- :prop是配置选项 -->
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateInfos"
            v-model="selectedCat"
            change-on-select
            clearable
            :props="cateInfosProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签切换区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible=true"
            :disabled="showButton"
            type="primary"
            size="mini"
          >添加动态参数</el-button>
          <!-- 用户列表展示区域 -->
          <el-table :data="manyParamInfos" border stripe style="width: 100%">
            <el-table-column type="expand" width="80">
              <template slot-scope="scope">
                <!-- disable-transitions是否禁用渐变动画 -->
                <el-tag
                  :key="tag+Math.random()"
                  v-for="(tag,index) in scope.row.attr_vals"
                  disable-transitions
                  closable
                  @close="tagClose(scope.row,index)"
                >{{tag}}</el-tag>
                <!-- 添加参数可选值按钮和输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="mini" @click="showInput">+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="220"></el-table-column>
            <el-table-column label="操作" width="*">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button @click="delParams(scope.row.attr_id)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            @click="addDialogVisible=true"
            :disabled="showButton"
            type="primary"
            size="mini"
          >添加静态参数</el-button>
          <!-- 用户列表展示区域 -->
          <el-table :data="onlyParamInfos" border stripe style="width: 100%">
            <el-table-column type="expand" width="80">
              <template slot-scope="scope">
                <!-- disable-transitions是否禁用渐变动画 -->
                <el-tag
                  :key="tag+Math.random()"
                  v-for="(tag,index) in scope.row.attr_vals"
                  disable-transitions
                  @close="tagClose(scope.row,index)"
                  closable
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="mini" @click="showInput">+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="220"></el-table-column>
            <el-table-column label="操作" width="*">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button @click="delParams(scope.row.attr_id)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        :title="'添加'+(activeName==='many'?'动态参数':'静态属性')"
        :visible.sync="addDialogVisible"
        width="50%"
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
          <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
            <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        :title="'修改'+(activeName==='many'?'动态参数':'静态属性')"
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
          <!-- 用户名无法修改,所以直接禁用 -->
          <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
            <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './Params.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
// 给添加参数可选值的输入框设置样式
.input-new-tag {
  width: 100px;
}
</style>
