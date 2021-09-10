<template>
  <el-dialog :visible.sync="dialogVisible" title="提交详情" width="700px" :before-close="close">
    <ul class="m-p-ul">
      <li>
        <span class="bold">连接名称:</span>
        <p>{{ recordList.db_name }}</p>
      </li>
      <li>
        <span class="bold">数据库列表:</span>
        <p>{{ recordList.excute_db_name }}</p>
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
        <span class="bold">审核状态:</span>
        <p v-if="recordList.status===0">待审核</p>
        <p v-else-if="recordList.status===1">审核通过</p>
        <p v-else>审核驳回</p>
      </li>
      <li v-show="recordList.status===2">
        <span class="bold">驳回原因:</span>
        <p>{{ recordList.reason }}</p>
      </li>
    </ul>
  </el-dialog></template>
<script>
import CodeMirrorEditor from './codemirror.vue'
import { auditsInfo } from '@/api/dbms/sqlAudits'
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
      auditsInfo(this.curId).then(res => {
        this.recordList = res.data
        this.sql = this.recordList.operate_sql
        this.setValue()
      })
    },
    changeDisabled(data, disabled) {
      for (let index = 0; index < data.length; index++) {
        const children = data[index].children
        if (children !== undefined) {
          this.changeDisabled(children, disabled)
        }
        data[index].disabled = disabled
      }
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
