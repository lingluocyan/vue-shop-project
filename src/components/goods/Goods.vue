<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            @keyup.enter.native="getGoodsList"
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="search"
          >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="*"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.add_time|moment('YYYY-MM-DD HH-mm-ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="showEditDialog(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delGoods(scope.row.goods_id)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[ 3,5,10,15 ]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes,prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 编辑用户弹层 -->
      <!-- :before-close是关闭对话框前的回调 -->
      <el-dialog
        title="编辑商品"
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
          label-width="80px"
          class="demo-ruleForm"
        >
          <!-- label是表头,prop是对应的数据 -->
          <!-- 用户名无法修改,所以直接禁用 -->
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary" @click="editGoods">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './Goods.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
