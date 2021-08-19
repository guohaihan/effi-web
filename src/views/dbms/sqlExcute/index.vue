<template>
  <div class="sql-excute">
    <!-- 左侧 -->
    <div class="sql-excute-left">
      <span class="s-e-l-title">搜索：</span>
      <el-select
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="sql-excute-margin" />
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            prop="address"
            label="数据库列表"
            show-overflow-tooltip
          />
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="toggleSelection()">取消选择</el-button>
          <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
      </el-aside>
    </div>
    <!-- 右侧 -->
    <div class="sql-excute-rigth">
      <div class="s-e-r-input">
        <span class="s-e-r-input-title">sql执行</span>
        <el-input
          v-model="textarea"
          placeholder="请输入内容"
          show-word-limit
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
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<style>
/*   <!-- 左侧 --> */
.sql-excute-left {
  margin: 20px;
  float: left;
}
.sql-excute-margin {
  margin-top: 20px;
}
.s-e-l-title {
  font-size: 16px;
  display: inline-block;
}
 /* <!-- 右侧 --> */
.sql-excute-rigth {
  float: left;
  margin-top: 20px;
}
.s-e-r-input-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}
.s-e-r-input {
  margin-left: 30px;
}
.s-e-r-input .el-textarea__inner {
  min-height: 300px !important;
  width: 68vw;
  margin-bottom: 20px;
}
</style>

<script>
export default {
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(10).fill(item)
    }
  }
}
</script>
