// import _ from 'lodash'
export default {
  data() {
    return {
      // 添加弹层参数
      addForm: {
        // 参数名称
        attr_name: ''
      },
      // 编辑弹层参数
      editForm: {
        attr_name: ''
      },
      // 标签切换相关,设置让name为activeName的标签显示
      activeName: 'many',
      // 添加按钮是否可用
      showButton: true,
      // 按钮和输入框的显示
      inputVisible: false,
      // 添加弹层是否显示
      addDialogVisible: false,
      // 编辑弹层是否显示
      editDialogVisible: false,
      // 输入框的可选值信息
      inputValue: '',
      // 商品分类,级联选择器相关
      // 商品分类信息，选择器显示的信息
      cateInfos: [],
      // 存储选取到的第三级别分类信息
      catThreeId: 0,
      // 动态参数
      manyParamInfos: [],
      // 静态参数
      onlyParamInfos: [],
      // 级联选择器配置设置
      cateInfosProps: {
        // 真正起作用的值
        value: 'cat_id',
        // 选项的名称
        label: 'cat_name',
        // 对应子级关系
        children: 'children'
      },
      // 级联选择器选中信息
      selectedCat: [],
      // 添加弹层表单验证
      addFormRules: {
        // 提交数据用户名和密码不能为空
        attr_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ]
      },
      // 编辑弹层表单验证
      editFormRules: {
        // 提交数据用户名和密码不能为空
        attr_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatInfos()
  },
  methods: {
    // 获得第三级别商品分类信息
    async getCatInfos() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'error'
        })
      }
      // 成功,把获取到的信息传给catInfos
      this.cateInfos = res.data
    },
    // 通过第三级别id和tab标签(only,many)来获取对应的分类参数列表信息
    async getParamInfos() {
      // 这里的activeName会随着tab栏切换发生变化
      const { data: res } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'error'
        })
      }
      // 因为res.data返回的是数组,所以使用forEach遍历每一项，将attr_vals的内容用空格分割
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      // 成功,通过具体的data成员接受信息(动态参数和静态参数)
      if (this.activeName === 'many') {
        this.manyParamInfos = res.data
      } else {
        this.onlyParamInfos = res.data
      }
    },
    // 商品分类级联选择器内容变化触发的回调
    handleChange() {
      // 级联选择器选取了非第三级别分类
      if (this.selectedCat.length !== 3) {
        // 重置级联选择器
        this.selectedCat = []
        // 禁用添加参数的按钮
        this.showButton = true
        // 清空选取的第三级别id
        this.catThreeId = 0
        // 清空已经获取的分类信息
        this.onlyParamInfos = []
        this.manyParamInfos = []
      } else {
        // 解禁添加参数的按钮(此时选取了第三级别分类)
        this.showButton = false
        // 把当前选取的第三级别分类的id存储到catThreeId,2代表数组的第三项
        this.catThreeId = this.selectedCat[2]
        // 调用方法获取选取对应id的第三级别分类信息
        this.getParamInfos()
      }
    },
    // 切换标签被点击后的回调处理
    handleClick() {
      // 如果没选取了第三级别分类(catThreeId的值为0)
      if (this.catThreeId === 0) {
        return null
      }
      // 切换标签获取相关分类信息
      this.getParamInfos()
    },
    // 输入框失去焦点或者按下回车触发的回调(添加新tag标签)
    async handleInputConfirm(nowParam) {
      // 如果什么都没写则不添加
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return null
      }
      // 把新数据追加到attr_vals中也就是many/onlyParamInfos
      nowParam.attr_vals.push(this.inputValue.trim())
      // 清空输入框
      this.inputValue = ''
      // 隐藏输入框显示按钮
      this.inputVisible = false
      // 提交到服务器持久化存储,重新以空格拼接为字符串
      const attrVals = nowParam.attr_vals.join(' ')
      // 发送请求,参数的两个id分别是分类id和属性id
      const { data: res } = await this.$http.put(
        `categories/${nowParam.cat_id}/attributes/${nowParam.attr_id}`,
        {
          attr_name: nowParam.attr_name,
          attr_sel: nowParam.attr_sel,
          attr_vals: attrVals
        }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 成功
      this.$message({
        type: 'success',
        message: res.meta.msg,
        duration: 1000
      })
    },
    // 删除tag标签
    async tagClose(nowParam, index) {
      // 把用于显示tag标签的attr_vals数组在目标位置切去一个
      nowParam.attr_vals.splice(index, 1)
      // 通过空格拼接可选项为一个字符串用作提交参数
      const attrVals = nowParam.attr_vals.join(' ')
      const { data: res } = await this.$http.put(
        // 编辑操作,需要分类id:cat_id和属性id:attr_id和修改后的attr_vals
        `categories/${nowParam.cat_id}/attributes/${nowParam.attr_id}`,
        {
          attr_name: nowParam.attr_name,
          attr_sel: nowParam.attr_sel,
          attr_vals: attrVals
        }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 成功
      this.$message({
        type: 'success',
        message: res.meta.msg,
        duration: 1000
      })
    },
    // 点击添加可选项按钮的回调
    showInput() {
      // 显示输入框,隐藏按钮
      this.inputVisible = true
    },
    // 添加参数相关
    // 添加属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.post(
          `categories/${this.catThreeId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'error',
            message: res.meta.msg,
            duration: 1000
          })
        }
        // 成功,提示并刷新页面关闭弹层
        this.$message({
          type: 'success',
          message: res.meta.msg,
          duration: 1000
        })
        this.addDialogVisible = false
        this.getParamInfos()
      })
    },
    // 弹层关闭前的回调
    addDialogbeforeClose(done) {
      this.$refs.addFormRef.resetFields()
      done()
    },
    // 点击取消也就是关闭的回调
    addDialogClose() {
      // 对话框关闭
      this.addDialogVisible = false
      // 清空对话框
      this.$refs.addFormRef.resetFields()
    },
    // 编辑属性相关
    // 获取编辑弹层需要的数据
    async showEditDialog(info) {
      // 复制一份被修改参数给编辑表单对象
      // this.editForm = _.cloneDeep(info)
      // 不用深拷贝的方法
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${info.cat_id}/attributes/${info.attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      this.editForm = res.data
    },
    // 提交编辑参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}/attributes/${
            this.editForm.attr_id
          }`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.meta.msg,
            duration: 1000
          })
        }
        // 成功,提示并关闭弹层,刷新页面
        this.$message({
          type: 'success',
          message: res.meta.msg,
          duration: 1000
        })
        this.editDialogVisible = false
        this.getParamInfos()
      })
    },
    // 弹层关闭前的回调
    editDialogbeforeClose(done) {
      this.$refs.editFormRef.resetFields()
      done()
    },
    // 点击取消也就是关闭的回调
    editDialogClose() {
      // 对话框关闭
      this.editDialogVisible = false
      // 清空对话框
      this.$refs.editFormRef.resetFields()
    },
    // 删除参数相关
    // 删除参数
    async delParams(id) {
      // 确认是否删除
      const cfm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 确认删除
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.catThreeId}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.meta.msg,
            duration: 1000
          })
        }
        // 成功,提示并刷新页面
        this.$message({
          type: 'success',
          message: res.meta.msg,
          duration: 1000
        })
        this.getParamInfos()
      }
    }
  },
  computed: {}
}
