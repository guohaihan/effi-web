<template>
  <div v-loading="loading" class="sql-excute">
    <!-- 左侧 -->
    <div class="sql-excute-left">
      <span class="s-e-l-title">数据库 </span>
      <el-select
        v-model="selectValue"
        placeholder="请选择连接"
        @change="selectionChange"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.db_name"
          :value="item.id"
        />
      </el-select>
      <el-checkbox v-model="checked" style="margin-left:10px;" @change="getTenant">全租户库</el-checkbox>
      <div class="sql-excute-margin" />
      <el-aside width="400px" style="background-color: rgb(238, 241, 246)">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column
            prop="Database"
            label="数据库列表"
            show-overflow-tooltip
          />
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="getDbs">刷新列表</el-button>
          <!-- <el-button @click="toggleSelection()">取消选择</el-button> -->
        </div>
      </el-aside>
    </div>
    <!-- 右侧 -->
    <div class="sql-excute-rigth">
      <div class="s-e-r-input">
        <span class="s-e-r-input-title">sql执行</span>
        <el-input v-model="title" clearable style="width:300px;margin-bottom:10px;" placeholder="请输入sql执行主题" />
        <div class="code-mirror-div">
          <code-mirror-editor
            ref="cmEditor"
            :cm-theme="cmTheme"
            :cm-mode="cmMode"
            :auto-format-json="autoFormatJson"
            :json-indentation="jsonIndentation"
          />
        </div>

        <el-button
          size="small"
          type="primary"
          @click="commitSqlAudits"
        >提交审核</el-button>
        <el-button
          v-permission="['admin','dbms-excute-sql']"
          size="small"
          type="primary"
          @click="excuteSql"
        >执行</el-button>

        <!-- <div slot="tip" class="el-upload__tip">
            只能上传.sql文件
          </div> -->
        <!-- </el-upload> -->
      </div>
    </div>

  </div>
</template>

<script>
import { sqlExcute, getSchemaNames, auditsSql, getTenantNames } from '@/api/dbms/sqlExcute'
import { getDatabases } from '@/api/dbms/databases'
import CodeMirrorEditor from './components/codemirror.vue'
import { getInfo } from '@/api/user'
export default {
  components: {
    CodeMirrorEditor
  },

  data() {
    return {
      cmTheme: 'default',
      cmThemeOpthions: [
        'default',
        '3024-day',
        '3024-night',
        'abcdef',
        'ambiance',
        'ayu-dark',
        'ayu-mirage',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'darcula',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'gruvbox-dark',
        'hopscotch',
        'icecoder',
        'idea',
        'isotope',
        'lesser-dark',
        'liquibyte',
        'lucario',
        'material',
        'material-darker',
        'material-palenight',
        'material-ocean',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'moxer',
        'neat',
        'neo',
        'night',
        'nord',
        'oceanic-next',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'shadowfox',
        'solarized dark',
        'solarized light',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'yonce',
        'zenburn'

      ],
      cmEditorMode: 'sql',
      cmEditorModeOptions: [
        'default',
        'json',
        'sql',
        'javascript',
        'css',
        'xml',
        'html',
        'yaml',
        'markdown',
        'python'
      ],
      cmMode: 'sql',
      checked: false,
      jsonIndentation: 2,
      autoFormatJson: true,
      sql: '',
      tableData: [],
      text: '',
      title: '',
      dbNames: [],
      options: [],
      selectValue: null,
      multipleSelection: [],
      production_id: null,
      contain_admin: null,
      loading: false,
      rules: {
        title: [{ required: true, trigger: 'blur', message: '主题不能为空' }]
      }
    }
  },
  created() {
    this.getDBConnNames()
    getInfo().then(res => {
      this.contain_admin = res.data.permissions.indexOf('admin')
      console.log(this.contain_admin)
    })
  },
  methods: {
    getDBConnNames() {
      getDatabases().then(res => {
        this.options = res.data.results
        for (let i = 0; i < this.options.length; i++) {
          // console.log(this.options[i].db_env)
          if (this.options[i].db_env === '0') this.production_id = this.options[i].id
        }
        this.selectValue = this.options[0]?.id
        if (this.selectValue) this.getDbs()
      })
    },
    selectionChange() {
      this.getDbs()
    },
    getDbs() {
      getSchemaNames(this.selectValue).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      })
      this.checked = false
    },
    getTenant() {
      if (this.checked) {
        getTenantNames(this.selectValue).then(res => {
          if (res.data) {
            this.tableData = res.data
          }
        })
      } else {
        this.getDbs()
      }
    },
    excuteSql() {
      // 获取用户信息

      console.log(this.contain_admin + '------')
      if (this.selectValue === this.production_id && this.contain_admin === -1) {
        this.$message.error('您无权限执行生产')
        return
      }
      // editorValue
      const value = this.$refs.cmEditor.editorValue
      // this.getDbNames()
      const list = []
      console.log(this.multipleSelection.length)

      for (let i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].Database)
      }
      if (list.length === 0) {
        this.$message.warning('请选择数据库')
        return
      }
      if (value === '' || value === null || value === undefined) { // "",null,undefined
        this.$message.warning('请输入sql')
        return
      }
      this.loading = true
      var dataSql = { 'db': this.selectValue, 'excute_db_name': list, 'operate_sql': value }
      sqlExcute(dataSql).then(res => {
        this.loading = false
        this.$message.success(res.data)
      }).catch(e => {
        this.$message.error(e)
        this.loading = false
      })
    },
    getDbNames() {
      const names = []
      this.$refs.table.selection.forEach(data => names.push(data.Database))
      this.dbNames = names
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection[0])
    },
    commitSqlAudits() {
      // editorValue
      const value = this.$refs.cmEditor.editorValue
      // this.getDbNames()
      const list = []
      console.log(this.multipleSelection.length)
      for (var i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].Database)
      }
      if (list.length === 0) {
        this.$message.error('请选择数据库')
        return
      }
      if (this.title === '' || this.title === null || this.title === undefined) { // "",null,undefined
        this.$message.error('请填写提交主题')
        return
      }
      if (value === '' || value === null || value === undefined) { // "",null,undefined
        this.$message.error('请输入sql')
        return
      }

      var data_commit = { 'db': this.selectValue, 'excute_db_name': list, 'operate_sql': value, 'user': '', 'auditor': '', 'status': 0, 'reason': '', 'sprint': this.title }
      auditsSql(data_commit).then(res => {
        if (res.code === 201) {
          this.$message.success('提交成功')
          this.title = ''
          this.$refs.cmEditor.editorValue = ''
          this.$refs.multipleTable.clearSelection()
          this.$router.push('/dbms/sqlAudits')
        } else {
          this.$message.error('提交失败')
        }
      })
    },
    onEditorModeChange(value) {
      switch (value) {
        case 'json':
          this.cmMode = 'application/json'
          break
        case 'sql':
          this.cmMode = 'sql'
          break
        case 'javascript':
          this.cmMode = 'javascript'
          break
        case 'xml':
          this.cmMode = 'xml'
          break
        case 'css':
          this.cmMode = 'css'
          break
        case 'html':
          this.cmMode = 'htmlmixed'
          break
        case 'yaml':
          this.cmMode = 'yaml'
          break
        case 'markdown':
          this.cmMode = 'markdown'
          break
        case 'python':
          this.cmMode = 'python'
          break
        default:
          this.cmMode = 'application/json'
      }
    },
    setStyle() {
      const styleStr = 'position: absolute; top: 80px; left: 50px; right: 200px; bottom: 20px; padding: 2px; height: auto;'
      this.$refs.cmEditor.setStyle(styleStr)
    },
    getValue() {
      const content = this.$refs.cmEditor.getValue()

      console.log(content)
    }
  }

}
</script>

<style lang="scss" scoped>
/* @import url('codemirror/theme/ambiance.css');
@import url('codemirror/lib/codemirror.css');
@import url('codemirror/addon/hint/show-hint.css'); */

/*   <!-- 左侧 --> */
.sql-excute-left {
  margin: 20px;
  /* float: left; */
}
.sql-excute-margin {
  margin-top: 20px;
}
.s-e-l-title {
  font-size: 16px;
  display: inline-block;
  margin-right: 20px;
}
 /* <!-- 右侧 --> */
.sql-excute-rigth {
  /* float: left; */
  margin-top: 20px;
}
.s-e-r-input-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}
.sql-excute{
  display: flex;
}
.s-e-r-input {
  margin-left: 30px;
}
.s-e-r-input .el-textarea__inner {
  min-height: 300px !important;

  width: 56vw;
  margin-bottom: 20px;
}
.CodeMirror {
    position: absolute;
    top: 80px;
    left: 2px;
    right: 5px;
    bottom: 0px;
    padding: 2px;
    height: auto;
    overflow-y: auto;
}
.code-mirror-div {
width: 60vw;
margin-bottom: 40px;
// height: 1000px;
}

</style>

