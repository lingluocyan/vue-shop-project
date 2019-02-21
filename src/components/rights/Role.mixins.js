export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 权限信息
      rightsInfo: [],
      // 默认选中的树节点
      deFaultCheckedKeys: [],
      // 树状图的数据属性
      rightsInfoProps: {
        // 树节点的名称
        label: 'authName',
        // 树节点真正起作用的值value
        // value: 'id',
        // children上下级关系衔接
        children: 'children'
      },
      // 表单数据对象
      distributeForm: {
        // 被分配权限的角色id
        id: 0,
        // 被分配权限的角色名称
        roleName: ''
      },
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
      // 分配权限对话框是否显示
      distributeDialog: false,
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
    // 删除权限
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
    },
    // 给角色分配权限
    async distributeRights() {
      // 获取权限和半选的叶子节点的id信息
      const k1 = this.$refs.rightsTree.getCheckedKeys()
      const k2 = this.$refs.rightsTree.getHalfCheckedKeys()
      const allIds = [...k1, ...k2].join(',')
      if (!allIds) {
        this.$message({
          type: 'error',
          duration: 1000,
          message: '请选取权限'
        })
      }
      const { data: res } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: allIds }
      )
      if (res.meta.status !== 200) {
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
      this.getRolesList()
      this.distributeDialog = false
    },
    // 展示分配权限对话框(参数role是当前被分配权限的角色记录(包括id,roleName,roleDesc))
    async showDistributeDialog(role) {
      this.distributeDialog = true
      // 填充表单对象
      this.distributeForm = role
      // 获取用户分配的权限数据
      const { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: res.meta.msg
        })
      }
      // 填充rightsInfo
      this.rightsInfo = res.data
      // 通过递归遍历把拥有的三级权限id获取出来
      let idArr = [] // 临时接收拥有的权限id
      // idArr就是当前角色拥有的权限集合的数组
      // 递归获取选中的id
      this.getHaveRights(role, idArr)
      // 设置默认选中的节点
      this.deFaultCheckedKeys = idArr
    },
    // 从一个角色中把拥有的全部权限的id汇总起来,给到keys也就是idArr
    getHaveRights(node, keys) {
      // node.children不为空
      if (!node.children) {
        return keys.push(node.id)
      }
      // 获取到的都是第三级别的id信息
      node.children.forEach(item => {
        return this.getHaveRights(item, keys)
      })
    }
  }
}
