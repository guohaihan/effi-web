<template>
  <div class="app-container">
    <el-form ref="form" :model="form" inline>
      <el-form-item prop="search">
        <el-input v-model="form.search" clearable style="width:320px" prefix-icon="el-icon-search" placeholder="输入连接名称、IP搜索" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" size="medium" @click="search(form)">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh-left" size="medium" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button v-permission="['admin','dbms-databases-add']" type="primary" style="margin-bottom:20px" icon="el-icon-plus" size="medium" @click="createDatabase()">新增</el-button>
    <el-button v-permission="['admin','dbms-databases-mdel']" type="danger" icon="el-icon-delete" :disabled="multipleSelection.length ? false : true" size="medium" @click="deleteDatabases(form)">删除</el-button>
    <el-table
      ref="table"
      :data="tableData"

      style="width: 100%; margin-bottom: 20px;"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="连接名称">
              <span>{{ props.row.db_name }}</span>
            </el-form-item>
            <el-form-item label="环境">
              <span>{{ props.row.env }}</span>
              <!-- <span v-else-if="props.row.db_env==='1'">测试</span>
              <span v-else-if="props.row.db_env==='2'">开发</span>
              <span v-else-if="props.row.db_env==='3'">演示</span> -->
              <!-- <span v-else>验收</span> -->
            </el-form-item>
            <el-form-item label="IP">
              <span>{{ props.row.db_ip }}</span>
            </el-form-item>
            <el-form-item label="数据库类型">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="数据库版本">
              <span>{{ props.row.db_version }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.db_mark }}</span>
            </el-form-item>
            <el-form-item label="用户">
              <span>{{ props.row.db_username }}</span>
            </el-form-item>
            <el-form-item label="端口">
              <span>{{ props.row.db_port }}   </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="连接名称"
        prop="db_name"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        label="环境"
        prop="env"
      />

      <el-table-column
        label="IP"
        prop="db_ip"
        show-overflow-tooltip
      />

      <el-table-column
        label="用户名"
        prop="db_username"
        show-overflow-tooltip
      />
      <el-table-column
        label="端口"
        prop="db_port"
        show-overflow-tooltip
      />
      <!-- <template slot-scope="{row}">
          <el-tag v-if="row.server.server_type==='pm'" effect="plain">{{ row.server.server_type_display }}</el-tag>
          <el-tag v-else type="success" effect="plain">{{ row.server.server_type_display }}</el-tag>
        </template> -->

      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="200"
      >
        <template slot-scope="{row}">
          <el-button v-permission="['admin','cmdb-servers-update']" type="primary" icon="el-icon-edit" size="mini" @click="updateDatabase(row)">编辑</el-button>
          <el-button v-permission="['admin','cmdb-servers-del']" type="danger" icon="el-icon-delete" size="mini" @click="deleteDatabase(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <DbForm :dialog-visible="cuDialogVisible" :cur-id="curId" :status-options="statusOptions" @close="close" @search="search" />
  </div>
</template>
<script>
import DbForm from './components/dbForm'
import { getDatabases, deleteDatabase, deleteDatabases } from '@/api/dbms/databases'
// import { getAssetsStatus } from '@/api/cmdb/assets'
export default {
  name: 'Permissions',
  components: { DbForm },
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        search: '',
        ordering: ''
      },
      tableData: [],

      total: 0,
      statusOptions: [],
      multipleSelection: [],
      cuDialogVisible: false,
      curId: null
    }
  },
  created() {
    this.search()
    // this.getAssetsStatus()
  },
  methods: {
    // 获取服务器列表/搜索功能
    search() {
      getDatabases(this.form).then(res => {
        const envList = {
          0: '生产',
          1: '测试',
          2: '开发',
          3: '演示'
        }
        const dbTypeList = {
          0: 'mysql',
          1: 'sqlserver'
        }

        this.tableData = res.data.results && res.data.results.map(t => {
          t.env = envList[t.db_env]
          t.type = dbTypeList[t.db_type]
          return t
        })
        this.total = res.data.count
      })
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
      this.search()
    },
    // 删除数据库配置
    deleteDatabase(row) {
      this.$confirm('此操作将删除该数据库, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDatabase(row.id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 批量删除服务器
    deleteDatabases() {
      this.$confirm('此操作将删除选中数据库, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDatabases(this.multipleSelection).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // 刷新table
          this.search()
        })
      })
    },
    // 选项改变时触发
    handleSelectionChange(val) {
      const deleteIds = []
      this.$refs.table.selection.forEach(data => deleteIds.push(data.id))
      this.multipleSelection = deleteIds
    },
    // DbForm子组件
    createDatabase() {
      this.cuDialogVisible = true
    },
    updateDatabase(row) {
      this.curId = row.id
      this.cuDialogVisible = true
    },
    close() {
      this.cuDialogVisible = false
      this.curId = null
    },
    // 分页
    handleSizeChange(val) {
      this.form.size = val
      this.search()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.search()
    }

  }
}
</script>
<style lang="scss" scoped>
.demo-table-expand {
font-size: 0;
}
.app-container ::v-deep .demo-table-expand label {
width: 90px;
color: #99a9bf;
}
.demo-table-expand .el-form-item {
margin-right: 0;
margin-bottom: 0;
width: 50%;
}
</style>
