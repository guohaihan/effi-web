<template>
  <el-dialog :visible.sync="dialogVisible" :title="curId ? '编辑数据库' : '新增数据库'" width="720px" :before-close="close">
    <el-form ref="dbForm" inline label-position="left" :model="dbForm" status-icon :rules="rules" label-width="100px" class="demo-dbForm">
      <el-card shadow="never">
        <el-form-item label="连接名称" prop="db_name">
          <el-input v-model="dbForm.db_name" clearable />
        </el-form-item>
        <!-- <el-form-item label="环境" prop="environment">
          <el-input v-model="dbForm.environment" clearable />
        </el-form-item> -->
        <el-form-item label="环境" prop="db_env">
          <el-select v-model="dbForm.db_env" clearable placeholder="选择环境">
            <el-option
              v-for="item in envs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="IP" prop="db_ip">
          <el-input v-model="dbForm.db_ip" clearable />
        </el-form-item>
        <el-form-item label="数据库类型" prop="db_type">
          <el-select v-model="dbForm.db_type" clearable placeholder="选择数据库类型">
            <el-option
              v-for="item in dbTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库版本">
          <el-input v-model="dbForm.db_version" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="db_mark">
          <el-input v-model="dbForm.db_mark" clearable />
        </el-form-item>
      </el-card>
      <!-- <el-card shadow="never" /> -->
      <el-card shadow="never">
        <!-- <div v-for="(account, index) in dbForm.accounts" :key="index"> -->
        <div>
          <el-form-item
            label="用户名"
            prop="db_username"
          >
            <el-input v-model="dbForm.db_username" clearable />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="db_password"
          >
            <el-input v-model="dbForm.db_password" clearable type="password" />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="db_port"
          >
            <el-input v-model="dbForm.db_port" clearable />
          </el-form-item>
        <!-- <el-button @click.prevent="removeAccount(account)">删除</el-button> -->
        </div>
        <!-- <el-button @click="addAccount">新增账户</el-button> -->
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
        db_name: '',
        db_ip: '',
        db_env: '',
        db_version: '',
        db_mark: '',
        db_username: '',
        db_password: '',
        db_port: '',
        db_type: ''
      },
      loading: false,
      adminOptions: [],
      dbTypeOptions: [],
      envs: [
        {
          value: '0',
          label: '生产'
        },
        {
          value: '1',
          label: '测试'
        },
        {
          value: '2',
          label: '开发'
        },
        {
          value: '3',
          label: '演示'
        },
        {
          value: '4',
          label: '验收'
        }

      ],
      serverSystemOptions: [],
      rules: {
        db_name: [{ required: true, trigger: 'blur', message: '数据库名称不能为空' }],
        db_username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        db_password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        db_port: [{ required: true, trigger: 'blur', message: '端口不能为空' }],
        db_ip: [
          { required: true, trigger: 'blur', message: 'Ip不能为空' },
          { validator: validateIP, trigger: 'blur' }
        ],
        db_env: [{ required: true, trigger: 'blur', message: '环境不能为空' }],
        db_type: [{ required: true, trigger: 'blur', message: '类型不能为空' }]
      }
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          getDatabase(this.curId).then(res => {
            this.dbForm = res.data
            console.log(this.dbForm)
            // if (res.data.admin) {
            //   this.adminOptions = [{ id: res.data.admin, username: res.data.admin_display }]
            // }
          })
        }
        this.getDatabaseType()
      }
    }
  },
  methods: {
    close() {
      this.$refs.dbForm.resetFields()
      // this.dbForm.database.accounts = []
      this.$emit('close')
    },
    search() {
      this.close()
      this.$emit('search')
    },
    // 获取数据库类型列表
    getDatabaseType() {
      getDatabaseType().then(res => {
        this.dbTypeOptions = res.data.results
      })
    },
    // removeAccount(item) {
    //   var index = this.dbForm.database.accounts.indexOf(item)
    //   if (index !== -1) {
    //     this.dbForm.database.accounts.splice(index, 1)
    //   }
    // },
    // addAccount() {
    //   this.dbForm.database.accounts.push({
    //     username: '',
    //     password: '',
    //     port: ''
    //   })
    // },
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
