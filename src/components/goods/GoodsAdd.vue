<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert type="info" center show-icon :closable="false" title="消息提示的文案"></el-alert>
      <!-- 步骤进度条 -->
      <!-- active当前激活步骤,-0隐式转换为数字 -->
      <el-steps :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧边栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs
          :before-leave="tabBeforeLeave"
          v-model="activeName"
          @tab-click="tabsClicked"
          tab-position="left"
        >
          <!-- name与选项卡 activeName 对应的标识符，表示选项卡别名 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器,props定义参数 -->
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :props="catProps"
                :options="catList"
                @change="catChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyParams" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2,index2) in item.attr_vals"
                  :key="index2"
                  border
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParams"
              :key="item.attr_id"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action必选参数，上传的地址 -->
            <!-- headers设置上传的请求头部 -->
            <!-- list-type文件列表的类型 -->
            <!-- :on-success成功的回调 -->
            <!-- on-preview点击文件列表中已上传的文件时的钩子 -->
            <el-upload
              :action="uploadUrl"
              :headers="uploadParams"
              :on-success="uploadSuccess"
              :on-remove="uploadRemove"
              :on-preview="uploadPreview"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 预览图片弹层 -->
      <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
        <img :src="previewImg" alt class="img-preview">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import mix from './GoodsAdd.mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-steps,
.el-tabs {
  margin-top: 20px;
}
.upload_preview {
  width: 100%;
}
// 预览图片img标签样式
.img-preview {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
