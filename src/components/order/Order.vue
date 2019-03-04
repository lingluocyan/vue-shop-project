<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getOrderList"
            @keyup.enter.native="getOrderList"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button @click="getOrderList" type="primary" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据列表区域 -->
      <el-table :data="orderList" border script>
        <el-table-column type="index" width="70px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="*"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==0">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.create_time|moment('YYYY-MM-DD HH-mm-ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template>
            <el-button icon="el-icon-edit" size="mini" type="primary" title="修改订单"></el-button>
            <el-button
              icon="el-icon-location"
              size="mini"
              type="success"
              @click="showWuliuDialog"
              title="查看物流信息"
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
      <!-- 物流弹层区域 -->
      <el-dialog title="物流信息" :visible.sync="wuliuDialogVisible" width="50%">
        <!-- direction方向垂直 -->
        <el-steps direction="vertical" :active="0">
          <el-step
            v-for="(item,index) in wuliuList"
            :key="index"
            :title="item.time"
            :description="item.context"
          ></el-step>
        </el-steps>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './Order.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
