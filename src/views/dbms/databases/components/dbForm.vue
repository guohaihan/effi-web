<template>
  <el-dialog :visible.sync="dialogVisible" :title="curId ? '编辑数据库' : '新增数据库'" width="720px" :before-close="close">
    <el-form ref="dbForm" inline label-position="left" :model="dbForm" status-icon :rules="rules" label-width="100px" class="demo-dbForm">
      <el-card shadow="never">
        <el-form-item label="数据库名称" prop="name">
          <el-input v-model="dbForm.name" clearable />
        </el-form-item>
        <el-form-item label="环境" prop="env">
          <el-input v-model="dbForm.env" clearable />
        </el-form-item>
        <el-form-item label="IP" prop="manage_ip">
          <el-input v-model="dbForm.manage_ip" clearable />
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="dbForm.database.database_type" clearable placeholder="选择数据库类型">
            <el-option
              v-for="item in database_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库版本">
          <el-input v-model="dbForm.name" clearable />
        </el-form-item>
        <el-form-item label="管理员" prop="admin">
          <el-select
            v-model="dbForm.admin"
            clearable
            filterable
            remote
            placeholder="请输入用户名"
            :remote-method="getAssetsAdmin"
            :loading="loading"
          >
            <el-option
              v-for="item in adminOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="到期时间" prop="expire_day">
          <el-date-picker
            v-model="dbForm.expire_day"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item> -->
        <!-- <el-form-item label="所在机柜" prop="cabinet">
          <el-cascader
            v-model="dbForm.cabinet"
            :options="cabinetOptions"
            :props="{ expandTrigger: 'hover' }"
            clearable
            @change="cabinetHandleChange"
          />
        </el-form-item> -->
        <el-form-item label="用途" prop="memo">
          <el-input v-model="dbForm.memo" clearable />
        </el-form-item>
      </el-card>
      <el-card shadow="never">
        <!-- <el-form-item label="类型" prop="server.server_type">
          <el-select v-model="dbForm.server.server_type" clearable placeholder="选择数据库类型">
            <el-option
              v-for="item in serverTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="系统类型" prop="server.server_system_type">
          <el-select v-model="dbForm.server.server_system_type" clearable placeholder="选择服务器系统类型">
            <el-option
              v-for="item in serverSystemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="数据库版本" prop="database.model">
          <el-input v-model="dbForm.database.model" clearable />
        </el-form-item>
        <el-form-item label="用途" prop="database.use">
          <el-input v-model="dbForm.database.use" clearable />
        </el-form-item>
      </el-card>
      <el-card shadow="never">
        <div v-for="(account, index) in dbForm.database.accounts" :key="index">
          <el-form-item
            label="用户名"
            :prop="'database.' + 'accounts.' + index + '.username'"
            :rules="{
              required: true, message: '用户名不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.username" clearable />
          </el-form-item>
          <el-form-item
            label="密码"
            :prop="'database.' + 'accounts.' + index + '.password'"
            :rules="{
              required: true, message: '密码不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.password" clearable />
          </el-form-item>
          <el-form-item
            label="端口"
            :prop="'database.' + 'accounts.' + index + '.port'"
            :rules="{
              required: true, message: '端口不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="account.port" clearable />
          </el-form-item>
          <el-button @click.prevent="removeAccount(account)">删除</el-button>
        </div>
        <el-button @click="addAccount">新增账户</el-button>
      </el-card>
      <el-form-item class="el-sub-button">
        <el-button type="primary" @click="submitForm('dbForm')">提交</el-button>
        <el-button @click="resetForm('dbForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { createDatabase, updateDatabase, getDatabase, getDatabaseType } from '@/api/dbms/databases'
import { getAssetsAdmin, getIDCCabinetsTree } from '@/api/dbms/assets'
import { validateIP } from '@/utils/rulesValidate'
export default {
  name: 'DbForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    },
    statusOptions: {
      type: Array,
      default: () => {
        return
      }
    }
  },

  data() {
    return {
      dbForm: {
        name: '',
        manage_ip: '',
        env: '',
        version: '',
        admin: null,
        function: '',
        cabinet: null,
        expire_day: null,
        memo: '',
        database: {
          database_type: '',
          model: '',
          use: '',
          accounts: [
            {
              username: '',
              password: '',
              port: ''
            }
          ]
        }
      },
      loading: false,
      adminOptions: [],
      serverTypeOptions: [],
      serverSystemOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      cabinetOptions: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '数据库名称不能为空' }],
        manage_ip: [
          { required: true, trigger: 'blur', message: 'Ip不能为空' },
          { validator: validateIP, trigger: 'blur' }
        ],
        env: [{ required: true, trigger: 'blur', message: '环境不能为空' }],
        'database.database_type': [{ required: true, trigger: 'blur', message: '类型不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getDatabase(this.curId).then(res => {
            this.dbForm = res.data
            if (res.data.admin) {
              this.adminOptions = [{ id: res.data.admin, username: res.data.admin_display }]
            }
          })
        }
        this.getDatabaseType()
        // this.getIDCCabinetsTree()
      }
    }
  },
  methods: {
    close() {
      this.$refs.dbForm.resetFields()
      this.dbForm.database.accounts = []
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    // 获取数据库类型列表
    getDatabaseType() {
      getDatabaseType().then(res => {
        this.serverTypeOptions = res.data.results
      })
    },
    // 获取机房机柜Tree结构数据
    getIDCCabinetsTree() {
      getIDCCabinetsTree().then(res => {
        this.cabinetOptions = res.data.results
      })
    },
    // 机房机柜级联选择器的change
    cabinetHandleChange(value) {
      if (value.length > 0) {
        this.dbForm.cabinet = value[value.length - 1]
      } else {
        this.dbForm.cabinet = null
      }
    },
    // 查找服务器管理员
    getAssetsAdmin(query) {
      if (query !== '') {
        this.loading = true
        getAssetsAdmin(query).then(res => {
          this.adminOptions = res.data.results
          this.loading = false
        })
      } else {
        this.adminOptions = []
      }
    },
    removeAccount(item) {
      var index = this.dbForm.database.accounts.indexOf(item)
      if (index !== -1) {
        this.dbForm.database.accounts.splice(index, 1)
      }
    },
    addAccount() {
      this.dbForm.database.accounts.push({
        username: '',
        password: '',
        port: ''
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            if (!this.dbForm.pid) {
              this.dbForm.pid = null
            }
            updateDatabase(this.curId, this.dbForm).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.search()
            })
          } else {
            createDatabase(this.dbForm).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.search()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.curId) {
        getDatabase(this.curId).then(res => {
          this.dbForm = res.data
        })
      } else {
        this.$refs[formName].resetFields()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-dbForm ::v-deep .el-card__body {
    padding: 10px 10px 0 10px;
  }
.demo-dbForm ::v-deep .el-card {
    margin-bottom: 10px;
  }
.el-sub-button{
 margin-left: 112px;
}
</style>
