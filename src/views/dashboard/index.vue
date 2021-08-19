<template>
  <div class="dashboard-container">
    <panel-group />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from '@/views/dashboard/components/PanelGroup'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    PanelGroup
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
