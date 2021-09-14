<template>
  <el-dialog :visible.sync="dialogVisible" title="提交详情" width="700px" :before-close="close">
    <ul class="m-p-ul">
      <li>
        <span class="bold">数据库名称:</span>
        <p>{{ recordList.db_name }}</p>
      </li>
      <li>
        <span class="bold">执行用户:</span>
        <p>{{ recordList.performer }}</p>
      </li>
      <li>
        <span class="bold">执行结果:</span>
        <p v-if="recordList.status===0">失败</p>
        <p v-else>成功</p>
      </li>
      <li>
        <span class="bold">提交的sql:</span>
        <code-mirror-editor
          ref="cmEditor"
          style="margin-top:10px"
          :cm-theme="cmTheme"
          :cm-mode="cmMode"
        />
      </li>
      <li>
        <span class="bold">执行信息:</span>
        <p>{{ recordList.error_info }}</p>
      </li>
    </ul>
  </el-dialog></template>
<script>
import CodeMirrorEditor from './codemirror.vue'
import { getOperationLog } from '@/api/dbms/dbOperationLog'
export default {
  name: 'InfoDialog',
  components: {
    CodeMirrorEditor
  },
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
      recordList: {},
      sql: '',
      cmTheme: 'default',
      cmEditorMode: 'sql',
      cmMode: 'sql'
    }
  },
  watch: {
    dialogVisible(v) {
      if (v) {
        if (this.curId) {
          this.getInfo()
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('closeDialog')
    },
    getInfo() {
      getOperationLog(this.curId).then(res => {
        this.recordList = res.data
        this.sql = this.recordList.operate_sql
        this.setValue()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    setValue() {
      this.$refs.cmEditor.setValue(this.sql)
    }
  }
}
</script>
<style lang="scss">

.m-p-ul {
      margin-bottom: 24px;
      li {
        p {
          margin-top: 14px;
        }
        .bold {
          font-weight: bold;
        }
      }
      li + li {
        margin-top: 24px;
      }
    }
</style>
