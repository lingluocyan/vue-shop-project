export default {
  data() {
    let checkMobile = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('手机号码不能为空'))
      }
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error('手机号码有误,请重新填写!'))
      } else {
        callback()
      }
    }
    return {
      // 用户列表信息
      userList: [],
      // 用于分配的角色列表信息
      roleList: [],
      // 添加弹层信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑弹层信息
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 权限分配弹层信息
      setForm: {
        username: '',
        rid: ''
      },
      // 是否显示添加弹层
      addDialogVisible: false,
      // 是否显示编辑弹层
      editDialogVisible: false,
      // 是否显示角色分配弹层
      setDialogVisible: false,
      // 分页参数信息
      queryInfo: {
        // 查询信息
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3,
        // 总条数
        total: 0
      },
      // 新增用户表单验证
      addFormRules: {
        // 提交数据用户名和密码不能为空
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        // validator对应一个验证函数
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
      },
      // 编辑用户表单验证
      editFormRules: {
        // 提交数据用户名和密码不能为空
        username: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        // validator对应一个验证函数
        mobile: [{ required: true, validator: checkMobile, trigger: 'blur' }]
      },
      // 权限分配校验规则
      setFormRules: {
        username: [
          {
            required: true,
            message: '请选择角色!',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '请求用户列表失败!',
          type: 'error',
          duration: 1000
        })
      }
      // 请求成功
      this.userList = res.data.users
      // 获取数据总数
      this.queryInfo.total = res.data.total
    },
    // 分页相关逻辑
    // 每页数据大小变化触发的回调
    handleSizeChange(newSize) {
      // 改变默认的pagesize
      this.queryInfo.pagesize = newSize
      // 重新请求数据
      this.getUserList()
    },
    //  页码发生变化触发的回调
    handleCurrentChange(newPage) {
      // 改变默认的pagenum
      this.queryInfo.pagenum = newPage
      // 重新请求数据
      this.getUserList()
    },
    // 用户状态发生改变触发的回调,需要传入用户ID和用户状态
    async changeState(uid, type) {
      const { data: res } = await this.$http.put(`users/${uid}/state/${type}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改用户状态失败!',
          duration: 1000,
          type: 'error'
        })
      }
      // 请求成功
      this.$message({
        message: res.meta.msg,
        duration: 1000,
        type: 'success'
      })
      // 刷新页面
      this.getUserList()
    },
    // 添加功能相关
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 表单验证
        if (!valid) {
          return null
        }
        // 验证成功
        const { data: res } = await this.$http.post(`users`, this.addForm)
        if (res.meta.status !== 201) {
          return this.$message({
            duration: 1000,
            type: 'error',
            message: res.meta.msg
          })
        }
        // 添加成功,关闭表单,提示成功,刷新页面
        this.addDialogVisible = false
        this.$message({
          duration: 1000,
          type: 'success',
          message: res.meta.msg
        })
        this.getUserList()
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
    // 删除用户相关
    async delUser(id) {
      // 确认是否删除防止误触
      const cfm = await this.$confirm('此操作将永久用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认删除
      if (cfm === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            duration: 1000,
            type: 'error',
            message: res.meta.msg
          })
        }
        // 删除成功
        this.$message({
          duration: 1000,
          type: 'success',
          message: res.meta.msg
        })
        // 判断当前页码的数据是否只有一条
        if (this.userList.length === 1 && this.queryInfo.pagenum > 1) {
          // 当前页码减一
          this.queryInfo.pagenum--
        }
        this.getUserList()
      }
    },
    // 编辑用户相关
    // 编辑用户
    editUser() {
      // 先进行表单验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        // 这里的id是showEditDialog拿回来的editForm里的id
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: res.meta.msg,
            duration: 1000,
            type: 'error'
          })
        }
        // 成功则关闭编辑弹层刷新页面
        this.editDialogVisible = false
        this.$message({
          message: res.meta.msg,
          duration: 1000,
          type: 'success'
        })
        this.getUserList()
      })
    },
    // 展示编辑弹层并填充数据的回调
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          duration: 1000,
          message: res.meta.msg,
          type: 'error'
        })
      }
      // 成功则渲染数据,打开编辑弹层
      this.editForm = res.data
      this.editDialogVisible = true
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
    // 权限分配相关
    setDialogbeforeClose(done) {
      this.$refs.setFormRef.resetFields()
      // 关闭弹层
      done()
    },
    setDialogClose() {
      // 对话框关闭
      this.setDialogVisible = false
      // 清空对话框
      this.$refs.setFormRef.resetFields()
    },
    // 展示角色分配弹层时触发的回调
    async showSetDialog(id) {
      this.setDialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 成功
      //   "data": {
      //     "id": 503,
      //     "username": "admin3",
      //     "role_id": 0,
      //     "mobile": "00000",
      //     "email": "new@new.com"
      //  },
      this.setForm = res.data
      // 获取用于分配的角色信息也就是下拉框显示的信息
      const { data: res2 } = await this.$http.get(`roles`)
      if (res2.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 填充用于分配角色的列表,这是全部角色列表包括了下拉框需要的所有数据
      this.roleList = res2.data
    },
    // 分配权限
    async setUser() {
      const { data: res } = await this.$http.put(
        `users/${this.setForm.id}/role`,
        this.setForm
      )
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg,
          duration: 1000
        })
      }
      // 成功,关闭对话框刷新数据
      this.setDialogVisible = false
      this.$message({
        type: 'success',
        message: res.meta.msg,
        duration: 1000
      })
      this.getUserList()
    }
  }
}
