<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%"
      empty-text="暂无数据，请点击左上角添加"
    >
      <el-table-column
        fixed="left"
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        fixed="left"
        prop="pin"
        label="pin"
        width="200"
      />
      <el-table-column
        prop="tgt"
        label="tgt"
        width="200"
      />
      <el-table-column
        prop="deviceCount"
        label="设备数量"
        width="120"
      />
      <el-table-column
        prop="remark"
        label="备注"
      />
      <el-table-column
        label="创建时间"
        width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left:50px;"
      >
        <el-form-item label="pin" prop="pin">
          <el-input v-model="temp.pin" placeholder="请输入pin" />
        </el-form-item>
        <el-form-item label="tgt" prop="tgt">
          <el-input v-model="temp.tgt" type="textarea" :rows="5" placeholder="请输入tgt" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchAccount, createAccount, updateAccount, deleteAccount } from '@/api/account'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Account',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(date, format) {
      return parseTime(date, format)
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 20
      },
      textMap: {
        update: '更新',
        create: '添加'
      },
      dialogStatus: '',
      temp: {
        id: undefined,
        pin: undefined,
        tgt: undefined,
        remark: undefined
      },
      dialogFormVisible: false,
      rules: {
        pin: [{ required: true, message: 'pin is required', trigger: 'blur' }],
        tgt: [{ required: true, message: 'tgt is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      searchAccount(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        // parseTime()

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pin: undefined,
        tgt: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      deleteAccount({ id: row.id }).then(() => {
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在校验信息，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          createAccount(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            loading.close()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在校验信息，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const tempData = Object.assign({}, this.temp)
          updateAccount(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            loading.close()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
