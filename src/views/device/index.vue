<template>
  <div class="app-container">

    <el-table
      :data="list"
      style="width: 100%"
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
        width="200"
      />
      <el-table-column
        prop="deviceId"
        label="MAC"
        width="200"
      />
      <el-table-column
        prop="todayPointIncome"
        label="今日积分"
        width="120"
      />
      <el-table-column
        prop="allPointIncome"
        label="积分总量"
        width="120"
      />
      <el-table-column
        label="创建时间"
        width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.deviceAddTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            5分钟统计
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
  </div>
</template>

<script>
import { searchDeviceList } from '@/api/device-list'
import { searchStatistics } from '@/api/account-device-list-speed-monitor'
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
        pin: [{ required: true, message: 'pin必填', trigger: 'blur' }],
        tgt: [{ required: true, message: 'tgt必填', trigger: 'blur' }]
      },
      statisticsChart: null,
      legendData: [],
      xAxisData: [],
      seriesData: [],
      updateData: [],
      downloadData: []
    }
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
    drawLine(row) {
      searchStatistics({ accountDeviceListId: row.id }).then(response => {
        console.log(response)

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
    }
  }
}
</script>

<style scoped>

</style>
