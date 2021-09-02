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
          ref="mycode"
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
    <div class="code-mirror-div">
      <div class="tool-bar">
        <span>请选择主题</span>
        <el-select v-model="cmTheme" placeholder="请选择" size="small" style="width:150px">
          <el-option v-for="item in cmThemeOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <span style="margin-left: 10px">请选择编辑模式</span>
        <el-select
          v-model="cmEditorMode"
          placeholder="请选择"
          size="small"
          style="width:150px"
          @change="onEditorModeChange"
        >
          <el-option
            v-for="item in cmEditorModeOptions"
            :key="item"
            :label="item"
            :value="item"
          />

        </el-select>
        <el-button type="primary" size="small" style="margin-left:10x" @click="setStyle">修改样式</el-button>
        <el-button type="primary" size="small" style="margin-left:10x" @click="getValue">获取内容</el-button>
        <el-button type="primary" size="small" style="margin-left:10x" @click="setValue">修改内容</el-button>
      </div>
      <code-mirror-editor
        ref="cmEditor"
        :cm-theme="cmTheme"
        :cm-mode="cmMode"
        :auto-format-json="autoFormatJson"
        :json-indentation="jsonIndentation"
      />

    </div>

  </div>
</template>

<script>
import { sqlExcute, getDBNames } from '@/api/dbms/sqlExcute'
import { getDatabases } from '@/api/dbms/databases'
import CodeMirrorEditor from './components/codemirror.vue'
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
      cmEditorMode: 'default',
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
      cmMode: 'application/json',
      jsonIndentation: 2,
      autoFormatJson: true,
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
    },
    setValue() {
      const jsonValue = {
        name: 'laiyu',
        addr: '广东省深圳市',
        other: 'nothing',
        tel: '168888888',
        intro: [{ item1: 'item1' }]
      }
      this.$refs.cmEditor.setValue(JSON.stringify(jsonValue))
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

    position: absolute;
    top: 0px;
    left: 2px;
    right: 5px;
    bottom: 0px;
    padding: 2px;
    .tool-bar {
        top: 20px;
        margin: 30px 2px 0px 20px;
    }

}

</style>

