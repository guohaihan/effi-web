<template>
  <div class="app-container">
    <el-row>
      <el-col :span="17">
        <span class="s-title">审核状态</span>
        <el-select
          v-model="form.status"
          placeholder="请选择"
          @change="statusChange"
        >
          <el-option
            v-for="st in statusOptions"
            :key="st.value"
            :label="st.label"
            :value="st.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-top:20px">
      <el-button v-permission="['admin','monitor-ip-add']" type="primary" style="margin-bottom:20px" size="medium" @click="createIp()">批量审核</el-button>
      <el-button v-permission="['admin','monitor-ip-mdel']" type="danger" :disabled="multipleSelection.length ? false : true" size="medium" @click="rejectAudits(form)">批量驳回</el-button>
    </el-row> -->
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>审核列表</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="db_name"
              label="连接名"
            />
            <el-table-column
              prop="sprint"
              label="主题"
            />
            <el-table-column
              prop="create_time"
              label="创建时间"
            />
            <el-table-column
              prop="update_time"
              label="更新时间"
            />
            <el-table-column
              prop="user"
              label="提交人"
            />
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="220"
            >
              <template slot-scope="{row}">
                <el-button type="primary" icon="el-icon-tickets" size="mini" @click="getInfo(row)" />
                <!-- <el-button type="success" round>成功按钮</el-button> -->
                <el-button v-show="form.status==='0'" v-permission="['admin','monitor-ip-update']" type="success" icon="el-icon-check" size="mini" @click="pass(row)" />
                <el-button v-show="form.status==='0'" v-permission="['admin','monitor-ip-del']" type="danger" icon="el-icon-close" size="mini" @click="reject(row)" />
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
        </el-card>
      </el-col>
    </el-row>
    <cuForm :dialog-visible="cuDialogVisible" :cur-id="curId" @close="close" @refreshList="statusChange" />
    <infoForm :dialog-visible="infoDialogVisible" :cur-id="infoId" @closeDialog="closeInfoDialog" />
  </div>
</template>
<script>
import cuForm from './components/rejectForm'
import infoForm from './components/infoForm'

import { getAuditsList, sqlAudits } from '@/api/dbms/sqlAudits'
export default {
  name: 'Roles',
  components: { cuForm, infoForm },
  data() {
    return {
      form: {
        page: 1,
        size: 10,
        status: '0'
      },
      statusOptions: [
        {
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '2',
          label: '已驳回'
        }
      ],
      tableData: [],
      total: 0,
      multipleSelection: [],
      // cuForm数据
      cuDialogVisible: false,
      infoDialogVisible: false,
      curId: null,
      infoId: null
    }
  },
  created() {
    this.statusChange()
  },
  methods: {
    // table选择框功能的change事件
    handleSelectionChange() {
      const ids = []
      this.$refs.multipleTable.selection.forEach(data => ids.push(data.id))
      this.multipleSelection = ids
    },
    statusChange() {
      console.log(this.form.status)
      getAuditsList(this.form).then(res => {
        if (res.data) {
          this.tableData = res.data.results
        }
      })
    },
    getInfo(row) {
      this.infoId = row.id
      this.infoDialogVisible = true
    },
    // 单个通过审核
    pass(row) {
      var data = { status: '1' }
      this.$confirm('审核通过后会自动执行,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sqlAudits(row.id, data).then(res => {
          if (res.code === 200) {
            this.$message.success('审核成功')
          } else {
            this.$message.error('审核失败')
          }
          this.statusChange()
        })
      })
    },
    // 单个驳回
    reject(row) {
      this.curId = row.id
      this.cuDialogVisible = true
    },
    // 批量驳回
    rejectAudits() {
      this.$confirm('确定全部驳回' + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    // 分页
    handleSizeChange(val) {
      this.form.size = val
      this.statusChange()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.statusChange()
    },
    close() {
      this.cuDialogVisible = false
      this.curId = null
    },
    closeInfoDialog() {
      this.infoDialogVisible = false
      this.infoId = null
    }
  }
}
</script>
<style scoped>
.s-title {
  font-size: 16px;
  display: inline-block;
  margin-right: 20px;
}
</style>
