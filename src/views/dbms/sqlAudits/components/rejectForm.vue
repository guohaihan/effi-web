<template>
  <!-- <el-dialog :visible.sync="dialogVisible" :title="curId ? '驳回原因' : '驳回原因'" width="700px" :before-close="close"> -->
  <el-dialog :visible.sync="dialogVisible" title="驳回原因" width="700px" :before-close="close">
    <el-form ref="rejectForm" label-position="left  " :model="rejectForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原因" prop="reason">
        <el-input v-model="rejectForm.reason" type="textarea" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('rejectForm')">确定</el-button>
        <el-button @click="resetForm('rejectForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { sqlAudits } from '@/api/dbms/sqlAudits'
export default {
  name: 'RejectForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    curId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      rejectForm: {
        reason: '',
        status: '2'
      },
      rules: {
        reason: [{ required: true, trigger: 'blur', message: '不能为空' }]
      }
    }
  },
  // watch: {
  //   dialogVisible(v) {
  //     if (v) {
  //       if (this.curId) {
  //         getIp(this.curId).then(res => {
  //           this.ruleForm = res.data
  //         })
  //       }
  //     }
  //   }
  // },
  methods: {
    close() {
      this.$refs.rejectForm.resetFields()
      this.$emit('close')
    },
    refresh() {
      this.close()
      this.$emit('refreshList')
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.curId) {
            sqlAudits(this.curId, this.rejectForm).then(res => {
              this.$message({
                message: '驳回成功',
                type: 'success'
              })
              this.refresh()
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
