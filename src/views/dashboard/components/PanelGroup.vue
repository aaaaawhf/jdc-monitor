<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="online-device" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            在线设备
          </div>
          <count-to :start-val="0" :end-val="panelDate.onlineDevices" :duration="1" class="card-panel-num" />台
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="up-to-cloud" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计上传
          </div>
          <count-to :start-val="0" :end-val="parseInt((panelDate.totalUpload/8/1024/1024).toFixed(0))" :duration="1" class="card-panel-num" />G
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="upload" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            上传速度
          </div>
          <count-to :start-val="0" :end-val="parseInt((panelDate.totalLastUpload/8/1024).toFixed(0))" :duration="1" class="card-panel-num" />M/s
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="point" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日积分
          </div>
          <count-to :start-val="0" :end-val="panelDate.todayPointIncome" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="device" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            设备总数
          </div>
          <count-to :start-val="0" :end-val="panelDate.totalDevices" :duration="1" class="card-panel-num" />台
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="download-from-cloud" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计下载
          </div>
          <count-to :start-val="0" :end-val="parseInt((panelDate.totalDownload/8/1024/1024).toFixed(0))" :duration="1" class="card-panel-num" />G
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="download" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            下载速度
          </div>
          <count-to :start-val="0" :end-val="parseInt((panelDate.totalLastDownload/8/1024).toFixed(0))" :duration="1" class="card-panel-num" />M/s
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="total-point" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            累计积分
          </div>
          <count-to :start-val="0" :end-val="panelDate.allPointIncome" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { index } from '@/api/dashboard'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      panelDate: {
        totalDevices: 0,
        onlineDevices: 0,
        totalUpload: 0,
        totalDownload: 0,
        totalLastUpload: 0,
        totalLastDownload: 0,
        todayPointIncome: 0,
        allPointIncome: 0
      }
    }
  },
  created() {
    this.index()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    index() {
      index().then(response => {
        console.log(response)
        if (response.success) {
          this.panelDate.totalDevices = response.data.totalDevices
          this.panelDate.onlineDevices = response.data.onlineDevices
          this.panelDate.totalUpload = response.data.totalUpload
          this.panelDate.totalDownload = response.data.totalDownload
          this.panelDate.totalLastUpload = response.data.totalLastUpload
          this.panelDate.totalLastDownload = response.data.totalLastDownload
          this.panelDate.todayPointIncome = response.data.todayPointIncome
          this.panelDate.allPointIncome = response.data.allPointIncome
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
