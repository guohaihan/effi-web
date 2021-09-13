<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px">
      <el-col :span="17">
        <span class="s-title">执行状态</span>
        <el-select
          v-model="form.status"
          placeholder="请选择"
          @change="getLogs"
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
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>执行列表</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="db_name"
              label="数据库名字"
            />
            <el-table-column
              prop="env"
              label="环境"
            />
            <el-table-column
              prop="create_time"
              label="创建时间"
            />
            <el-table-column
              prop="sprint"
              label="主题"
            />
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="220"
            >
              <template slot-scope="{row}">
                <el-button type="primary" icon="el-icon-tickets" size="middle" @click="getInfo(row)">执行详情</el-button>
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
    <infoForm :dialog-visible="infoDialogVisible" :cur-id="infoId" @closeDialog="closeInfoDialog" />
  </div>
</template>
<script>
import infoForm from './components/infoForm'
import { getOperationLogs } from '@/api/dbms/dbOperationLog'
export default {
  name: 'Roles',
  components: { infoForm },
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
          label: '失败'
        },
        {
          value: '1',
          label: '成功'
        }
      ],
      tableData: [],
      total: 0,
      infoDialogVisible: false,
      infoId: null,
      detailData: null
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    getLogs() {
      getOperationLogs(this.form).then(res => {
        this.tableData = res.data.results
        this.total = res.data.count
      })
    },
    getInfo(row) {
      this.infoId = row.id
      this.infoDialogVisible = true
    },
    // 分页
    handleSizeChange(val) {
      this.form.size = val
      this.statusChange()
    },
    handleCurrentChange(val) {
      this.form.page = val
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
