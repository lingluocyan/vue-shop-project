export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 添加角色表单数据对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色表单数据对象
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加对话框是否显示
      addDialogVisible: false,
      // 编辑对话框是否显示
      editDialogVisible: false,
      // 添加角色验证规则
      addFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述信息',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述信息',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取全部角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'error'
        })
      }
      // 把数据填充到页面
      this.roleList = res.data
    },
    // 添加角色相关
    // 添加角色
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.post(`roles`, this.addForm)
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'error',
            duration: 1000,
            message: '添加角色失败'
          })
        }
        // 添加成功刷新页面并提示并关闭对话框
        this.$message({
          type: 'success',
          duration: 1000,
          message: '添加角色成功'
        })
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    addDialogbeforeClose(done) {
      this.$refs.addFormRef.resetFields()
      done()
    },
    // 对话框关闭的回调
    addDialogClose() {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    // 删除角色相关
    async delUser(id) {
      const cfm = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 确认删除
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            duration: 1000,
            message: res.meta.msg
          })
        }
        // 删除成功,刷新页面
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.meta.msg
        })
        this.getRolesList()
      }
    },
    // 编辑角色相关
    // 编辑角色
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            duration: 1000,
            message: res.meta.msg
          })
        }
        // 编辑成功关闭对话框刷新页面
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.meta.msg
        })
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑表单数据填充
    async showEditDialog(id) {
      // 对话框显示
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: res.meta.msg
        })
      }
      this.editForm = res.data
    },
    editDialogbeforeClose(done) {
      this.$refs.editFormRef.resetFields()
      done()
    },
    // 对话框关闭的回调
    editDialogClose() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    // table表格展开行相关
    async delRight(role, rightId) {
      const cfm = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 确认删除
      if (cfm === 'confirm') {
        // roles/:roleId/rights/:rightId  角色id和权限id
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            duration: 1000,
            message: res.meta.msg
          })
        }
        // 删除指定权限成功
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.meta.msg
        })
        this.getRolesList()
        this.roleList.children = res.data
      }
    }
  }
}
