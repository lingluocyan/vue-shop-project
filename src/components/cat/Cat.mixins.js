export default {
  data() {
    return {
      // 添加弹层所需数据
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 编辑弹层所需数据
      editForm: {
        cate_name: ''
      },
      // 共选取的分类数据(第1,2级别)
      cateTwoList: [],
      // 被选中分类的接受对象
      selectedCateTwo: [],
      // 共选取的分类数据对应的配置对象
      cateTwoListProps: {
        // 真正起作用的值
        value: 'cat_id',
        // 选项的名称
        label: 'cat_name',
        // 对应子级关系
        children: 'children'
      },
      // 接收获得回来的分类列表信息
      catInfos: [],
      // 添加弹层是否显示
      addDialogVisible: false,
      // 编辑弹层是否显示
      editDialogVisible: false,
      // 表格数据属性
      catInfosColumns: [
        // 设置各个列的属性值
        // label表格表头信息
        // prop显示内容对应字段
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 定义数据列表查询条件
      queryInfo: {
        // 搜索条件
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 总条数
      total: 1,
      // 添加弹层校验规则
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑弹层校验规则
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatInfos()
  },
  methods: {
    // 获取用于显示的分类信息
    async getCatInfos() {
      const { data: res } = await this.$http.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改用户状态失败!',
          duration: 1000,
          type: 'error'
        })
      }
      // 成功，把获取的信息传给catInfos成员
      this.catInfos = res.data.result
      this.total = res.data.total
    },
    // 添加分类相关
    // 获取添加弹层所需数据
    async showAddDialog() {
      // 因为是往分类里加,所以type为2,具体商品无法再加children了
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'error'
        })
      }
      // 成功
      this.cateTwoList = res.data
      this.addDialogVisible = true
    },
    // 添加分类
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        // 验证成功
        const { data: res } = await this.$http.post(`categories`, this.addForm)
        if (res.meta.status !== 201) {
          return this.$message({
            message: res.meta.msg,
            duration: 1000,
            type: 'error'
          })
        }
        // 请求成功,提示并刷新页面，填充数据
        this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'success'
        })
        this.getCatInfos()
        this.addDialogVisible = false
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
      // 清空选中信息
      this.selectedCateTwo = []
      // 清空对话框
      this.$refs.addFormRef.resetFields()
      // 清空之前的选中信息
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 级联选择器内容变化触发的回调
    cateTwoChange() {
      // 选取父级,需要记录给addForm.cat_pid表单域
      if (this.selectedCateTwo.length === 0) {
        // 上级id为0
        this.addForm.cat_pid = 0
        // 分类等级为0
        this.addForm.cat_level = 0
      } else {
        // 获取数据的时候做了限制，只拿到两级数据,因此len取不到3
        // 获取选取分类信息数组,如果是一级别[100],二级别[100,200]
        let len = this.selectedCateTwo.length
        // 选取1级别len-1后数组第0项就是选取的项的上级id
        this.addForm.cat_pid = this.selectedCateTwo[len - 1]
        // 选取1级别len就是数组的长度就是第几级别的权限
        this.addForm.cat_level = len
      }
    },
    // 编辑相关
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'error'
        })
      }
      // 成功
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        // 验证成功
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.cat_id}`,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: res.meta.msg,
            duration: 1000,
            type: 'error'
          })
        }
        // 请求成功,提示并关闭弹层刷新页面
        this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'success'
        })
        this.getCatInfos()
        this.editDialogVisible = false
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
    // 删除相关
    async delCate(id) {
      const cfm = await this.$confirm(
        '此操作将永久删除该分类·, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            message: res.meta.msg,
            duration: 1000,
            type: 'error'
          })
        }
        // 成功
        this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'success'
        })
        this.getCatInfos()
      }
    },
    // 分页相关
    // 当前页码改变触发的回调
    handleCurrentChange(newPage) {
      // 更改最新页码
      this.queryInfo.pagenum = newPage
      // 重新加载数据
      this.getCatInfos()
    },
    // 页码尺寸改变触发的回调
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 重新加载数据
      this.getCatInfos()
    }
  }
}
