<template>
  <div class="sql-excute">
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
        <el-input
          v-model="text"
          placeholder="请输入内容"
          type="textarea"
        />
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >选取文件</el-button>
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <el-button
            size="small"
            type="primary"
            @click="excuteSql"
          >执行</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传.sql文件
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { sqlExcute, getDBNames } from '@/api/dbms/sqlExcute'
import { getDatabases } from '@/api/dbms/databases'
// import { methods } from 'vue-echarts'

const CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
import sqlFormatter from 'sql-formatter'

export default {

  data() {
    return {
      sql: '',
      tableData: [],
      text: '',
      dbNames: [],
      options: [],
      selectValue: null,
      multipleSelection: []
    }
  },
  created() {
    this.getDBConnNames()
  },
  // mounted() {
  //   const mime = 'text/x-mariadb'
  //   // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
  //   this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
  //     mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
  //     indentWithTabs: true,
  //     smartIndent: true,
  //     lineNumbers: true,
  //     matchBrackets: true,
  //     // theme: 'base16-light',
  //     // autofocus: true,
  //     extraKeys: { 'Ctrl': 'autocomplete' }, // 自定义快捷键
  //     hintOptions: { // 自定义提示选项
  //       tables: {
  //         users: ['1112', '123123', '124124'],
  //         countries: ['124', '124124', '1']
  //       }
  //     }
  //   })
  //   this.editor.on('cursorActivity', () => {
  //     this.editor.showHint()
  //   })
  // },
  methods: {
    getDBConnNames() {
      getDatabases().then(res => {
        this.options = res.data.results
        this.selectValue = this.options[0]?.id
        if (this.selectValue) this.getDbs()
      })
    },
    selectionChange() {
      this.getDbs()
    },
    getDbs() {
      getDBNames(this.selectValue).then(res => {
        if (res.data) {
          this.tableData = res.data
        }
      })
      console.log(this.databases)
    },
    excuteSql() {
      const list = []
      // console.log(this.multipleSelection.length)
      var i
      for (i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].Database)
      }
      var dataSql = { 'db_name': list, 'operate_sql': this.text }
      sqlExcute(this.selectValue, dataSql).then(res => {
        console.log(this.text)
        console.log(res.data)
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
    }
  }

}
</script>

<style>
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
</style>

