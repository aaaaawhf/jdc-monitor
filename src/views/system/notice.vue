<template>
  <div class="app-container">

    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="80px"
      style="margin-left:50px;"
    >
      <el-form-item label="通知类型" prop="noticeType">
        <el-select v-model="temp.noticeType" placeholder="请选择通知类型" style="width: 30%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Key" prop="key">
        <el-input v-model="temp.key" style="width: 30%" type="textarea" :rows="2" placeholder="请输入Key" />
      </el-form-item>
      <el-form-item label="是否开启" prop="isEnabled">
        <el-switch
          v-model="temp.isEnabled"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left: 30%">
      <el-button type="primary" @click="saveData()">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { searchNotice, saveNotice } from '@/api/notice'

export default {
  name: 'Notice',
  data() {
    return {
      options: [{
        value: '1',
        label: 'Server酱'
      }, {
        value: '2',
        label: 'Bark'
      }],
      value: '',
      input: '',
      temp: {
        noticeType: undefined,
        key: undefined,
        isEnabled: undefined
      },
      rules: {
        noticeType: [{ required: true, message: '通知类型必选', trigger: 'change' }],
        key: [{ required: true, message: 'key必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      searchNotice({}).then(response => {
        if (response.data.noticeType !== null) {
          this.temp.noticeType = response.data.noticeType + ''
          this.temp.key = JSON.parse(response.data.configJson).key
          this.temp.isEnabled = response.data.isEnabled
        }
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在校验信息，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const configJsonObj = {
            key: this.temp.key
          }
          this.temp.configJson = JSON.stringify(configJsonObj)
          saveNotice(this.temp).then(() => {
            loading.close()
            this.$notify({
              title: 'Success',
              message: '保存成功',
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
