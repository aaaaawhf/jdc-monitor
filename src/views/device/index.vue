<template>
  <div class="app-container">

    <el-table
      :data="list"
      style="width: 100%"
      show-summary
      :summary-method="getSummaries"
      empty-text="暂无数据，请检查系统设置—>账号管理是否添加账号"
    >
      <el-table-column
        fixed="left"
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        fixed="left"
        prop="deviceName"
        label="设备名称"
        align="center"
        width="120"
      />
      <el-table-column
        align="center"
        prop="deviceId"
        label="MAC"
        width="130"
      />
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="{row}">
          <el-avatar shape="square" fit="fill" :src="row.pimgUrl" />
        </template>
      </el-table-column>
      <el-table-column
        prop="todayPointIncome"
        label="今日积分"
        width="80"
      >
        <template slot-scope="{row}">
          <el-tag style="width: 40px" :type="row.todayPointIncome > 100 ? (row.todayPointIncome > 200 ? (row.todayPointIncome > 300 ? 'success' : '') : 'warning') : 'danger'">{{ row.todayPointIncome }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="allPointIncome"
        label="积分总量"
        width="80"
      />
      <el-table-column
        prop="allPointIncome"
        label="插件信息"
        width="200"
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.pluginOneNickname != null" :type="row.pluginOneStatus === '正常' ? 'success' : 'danger'">{{ (row.pluginOneRunPos!=null ? (row.pluginOneRunPos === '分区' ? '内置-' : row.pluginOneRunPos + '-') : '') + row.pluginOneNickname + '-' + row.pluginOneStatus + (row.pluginOneCacheSize > 0 ? '：' + (row.pluginOneCacheSize / 1024 / 1024).toFixed(2) + 'G' : '') }}</el-tag>
          <el-tag v-if="row.pluginTwoNickname != null" :type="row.pluginTwoStatus === '正常' ? 'success' : 'danger'">{{ (row.pluginTwoRunPos!=null ? (row.pluginTwoRunPos === '分区' ? '内置-' : row.pluginTwoRunPos + '-') : '') + row.pluginTwoNickname + '-' + row.pluginTwoStatus + (row.pluginTwoCacheSize > 0 ? '：' + (row.pluginTwoCacheSize / 1024 / 1024).toFixed(2) + 'G' : '') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="nowUpload"
        label="5分钟上传(M/s)"
        width="100"
      >
        <template slot-scope="{row}">
          <span>{{ parseFloat((row.nowUpload / 8 / 1024).toFixed(2)) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nowDownload"
        label="5分钟下载(M/s)"
        width="100"
      >
        <template slot-scope="{row}">
          <span>{{ parseFloat((row.nowDownload / 8 / 1024).toFixed(2)) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalUpload"
        label="今日上传估量(G)"
        width="120"
      >
        <template slot-scope="{row}">
          <span>{{ parseFloat((row.totalUpload / 8 / 1024 / 1024).toFixed(2)) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalDownload"
        label="今日下载估量(G)"
        width="120"
      >
        <template slot-scope="{row}">
          <span>{{ parseFloat((row.totalDownload / 8 / 1024 / 1024).toFixed(2)) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        label="成本(元)"
        width="80"
      />
      <el-table-column
        label="回本比例"
        width="80"
      >
        <template slot-scope="{row}">
          <el-progress :width="60" type="circle" :percentage="parseFloat((row.cost > 0 ? row.allPointIncome / row.cost : 0.0).toFixed(2))" />
        </template>
      </el-table-column>
      <el-table-column
        prop="onlineTimeStr"
        label="运行时间"
        align="center"
        width="140"
      />
      <el-table-column
        label="创建时间"
        align="center"
        width="140"
      >
        <template slot-scope="{row}">
          <span>{{ row.deviceAddTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            5分钟统计
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdateCost(row)">
            设置成本
          </el-button>
          <el-button type="primary" size="mini" @click="handleReboot(row)">
            重启设备
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

    <el-dialog title="5分钟网速监控" :visible.sync="dialogFormVisible">
      <div id="statisticsChart" :style="{height: '300px',marginTop:'30px',width:'100%'}" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置成本" :visible.sync="dialogCostVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left:50px;"
      >
        <el-form-item label="成本" prop="cost">
          <el-input-number v-model="temp.cost" :precision="2" :step="1" :min="1" placeholder="请输入成本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCostVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateCostData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchDeviceList, updateCost, updateReboot } from '@/api/device-list'
import { searchStatistics } from '@/api/account-device-list-speed-monitor'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
import waves from '@/directive/waves'

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
      dialogCostVisible: false,
      rules: {
        cost: [{ required: true, message: '成本必填', trigger: 'blur' }]
      },
      statisticsChart: null,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      updateData: [],
      downloadData: []
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  mounted() {
    window.onresize = () => {
      try {
        this.statisticsChart.setOption({
          dataZoom: {
            show: true,
            realtime: true,
            y: 36,
            height: 20,
            start: 0,
            end: document.body.clientWidth / 2 * 0.93 / 20 / this.xAxisData.length * 100
          }
        })
        this.statisticsChart.resize()
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      searchDeviceList(this.listQuery).then(response => {
        console.log(response)
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
        id: undefined
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
      this.dialogFormVisible = true

      this.$nextTick(() => {
        if (this.statisticsChart == null) {
          this.statisticsChart = this.$echarts.init(document.getElementById('statisticsChart'))
        } else {
          try {
            this.statisticsChart.setOption({
              dataZoom: {
                show: true,
                realtime: true,
                y: 36,
                height: 20,
                start: 0,
                end: document.body.clientWidth / 2 * 0.93 / 20 / this.xAxisData.length * 100
              }
            })
            this.statisticsChart.resize()
          } catch (e) {
          }
          this.statisticsChart.clear()
        }
        this.drawLine(row)
      })
    },
    handleUpdateCost(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogCostVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    drawLine(row) {
      searchStatistics({ accountDeviceListId: row.id }).then(response => {
        this.legendData = ['上传速率', '下载速率']
        this.xAxisData = []
        this.seriesData = []
        this.updateData = []
        this.downloadData = []
        if (response.success) {
          response.data.forEach(item => {
            this.xAxisData.push(parseTime(item.createTime, '{h}:{i}'))
            this.updateData.push(item.upload / 8000)
            this.downloadData.push(item.download / 8000)
          })
          if (this.legendData.length > 0) {
            // 绘制图表
            this.statisticsChart.setOption({
              color: [
                // '#0090FF',
                // '#36CE9E',
                // '#FFC005',
                // '#FF515A',
                '#8B5CFF',
                '#00CA69'
              ],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                data: this.legendData
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  magicType: {
                    type: ['line', 'bar', 'stack', 'tiled']
                  },
                  saveAsImage: {}
                }
              },
              xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: this.xAxisData
              }],
              yAxis: [{
                type: 'value'
              }],
              dataZoom: {
                show: true,
                realtime: true,
                y: 36,
                height: 20,
                start: 0,
                end: document.body.clientWidth / 2 * 0.93 / 20 / this.xAxisData.length * 100
              },
              series: [{
                name: '上传速率',
                type: 'line',
                stack: '总量',
                smooth: true,
                lineStyle: {
                  width: 0
                },
                showSymbol: false,
                areaStyle: {
                  opacity: 0.8,
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(128, 255, 165)'
                  }, {
                    offset: 1,
                    color: 'rgba(1, 191, 236)'
                  }])
                },
                emphasis: {
                  focus: 'series'
                },
                data: this.updateData
              },
              {
                name: '下载速率',
                type: 'line',
                stack: '总量',
                smooth: true,
                lineStyle: {
                  width: 0
                },
                showSymbol: false,
                areaStyle: {
                  opacity: 0.8,
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 221, 255)'
                  }, {
                    offset: 1,
                    color: 'rgba(77, 119, 255)'
                  }])
                },
                emphasis: {
                  focus: 'series'
                },
                data: this.downloadData
              }]
            })
          } else {
            this.statisticsChart.setOption({
              title: {
                text: '暂无数据',
                x: 'center',
                y: 'center',
                textStyle: {
                  color: '#65ABE7',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              }
            })
          }
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    updateCostData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在设置成本，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const tempData = Object.assign({}, this.temp)
          updateCost(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogCostVisible = false
            loading.close()
            this.$notify({
              title: 'Success',
              message: '成本设置成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleReboot(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$confirm('此操作将重启设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateReboot(this.temp).then(response => {
          this.$message({
            type: 'success',
            message: '重启成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重启'
        })
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return parseFloat((prev + ((index === 6 || index === 7) ? parseFloat((curr / 8 / 1024).toFixed(2)) : ((index === 8 || index === 9) ? parseFloat((curr / 8 / 1024 / 1024).toFixed(2)) : curr))).toFixed(2))
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' '
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>

<style scoped>

</style>
