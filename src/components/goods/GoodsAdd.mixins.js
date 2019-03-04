import _ from 'lodash'
// 导入富文本编辑器相关
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  data() {
    return {
      // 侧边栏和steps进度条的激活设定
      activeName: '0',
      // 获取当前选取的第三级分类id
      threeCatId: 0,
      // 商品参数
      manyParams: [],
      // 商品属性
      onlyParams: [],
      // 预览弹层是否显示
      previewVisible: false,
      // 预览图片路径
      uploadPreviewUrl: '',
      // 预览图片
      previewImg: '',
      // 添加商品部分
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_introduce: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 可选择的三级商品信息
      catList: [],
      // 三级分类项目参数
      catProps: {
        // value指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // label指定选项标签为选项对象的某个属性值
        label: 'cat_name'
      },
      // 图片上传相关
      // 图片上传服务器api地址
      uploadUrl: 'http://127.0.0.1:8765/api/private/v1/upload',
      // 图片上传,请求头Token信息设定
      uploadParams: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    // 获取三级分类信息
    async getCatList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 成功
      this.catList = res.data
    },
    // 侧边栏的点击事件
    async tabsClicked(tab, event) {
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            duration: 1000,
            type: 'error'
          })
        }
        // 成功
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyParams = res.data
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.meta.msg,
            duration: 1000
          })
        }
        // 成功
        this.onlyParams = res.data
      }
    },
    // 侧边栏切换触发的回调
    tabBeforeLeave(newTab, oldTab) {
      // 代表是从第0个tab开始切换并且未选中第三分类产品
      if (oldTab === '0' && this.threeCatId === 0) {
        this.$message({
          type: 'error',
          message: '请选取第三级分类产品',
          duration: 1000
        })
        return false
      }
    },
    // 鼠标选取第三级分类触发的回调
    catChange() {
      if (this.addForm.goods_cat.length === 3) {
        this.threeCatId = this.addForm.goods_cat[2]
      } else {
        // 不选取任何项目
        this.threeCatId = 0
        // 清空分类
        this.addForm.goods_cat = []
      }
    },
    // 图片上传成功的回调
    uploadSuccess(result) {
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      let o = { pic: result.data.tmp_path }
      // 给addForm增加pics成员,用于接受上传图片路径名信息
      this.addForm.pics.push(o)
    },
    // 删除上传图片
    uploadRemove(result) {
      if (result.response.meta.status !== 200) {
        return this.$message({
          message: '图片删除失败',
          type: 'error',
          duration: 1500
        })
      }

      // 从pics中获取被删除所在的下标
      var i = this.addForm.pics.findIndex(item => {
        return item.pic === result.response.data.tmp_path
      })
      // 把图片路径名从pics中删除
      this.addForm.pics.splice(i, 1)
    },
    // 预览上传图片
    uploadPreview(result) {
      // 被预览图片路径名
      this.previewImg = result.response.data.url
      // dialog弹层开关
      this.previewVisible = true
    },
    // 添加商品处理
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        // const { data: res } = await this.$http.post(`goods`, this.addForm)
        // if (res.meta.status !== 201) {
        //   return this.$message.error(res.meta.msg)
        // }
        // this.$message.success(res.meta.msg)
        // this.$router.push('goods')
        // 把addForm复制一份并对复制品操作
        let form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数信息
        this.manyParams.forEach(item => {
          if (item.attr_vals.length > 0) {
            let newObj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            form.attrs.push(newObj)
          }
        })
        // 处理静态属性信息
        this.onlyParams.forEach(item => {
          if (item.attr_vals.trim()) {
            let newObj = { attr_id: item.attr_id, attr_value: item.attr_vals }
            form.attrs.push(newObj)
          }
        })
        const { data: res } = await this.$http.post(`goods`, form)
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'error',
            duration: 1000,
            message: res.meta.msg
          })
        }
        // 成功
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.meta.msg
        })
        this.$router.push('goods')
        // console.log(form.goods_cat)
      })
    }
  },
  components: {
    // 注册为私有组件
    quillEditor
  }
}
