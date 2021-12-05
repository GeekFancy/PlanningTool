<template>
  <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
    <div class="logo">
      <img src="../assets/sap.png" height="31" />
    </div>
    <a-menu theme="dark" mode="inline"  :selectedKeys="[$route.path]">
      <a-menu-item key="/">
        <router-link to="/">
          <HomeOutlined />
          <span>Home</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="/planning">
        <router-link to="/planning">
          <ScheduleOutlined />
           <span>Planning</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="/worklog">
        <router-link to="/worklog">
          <HistoryOutlined />
           <span>Worklog</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="/EPICEstimate">
        <router-link to="/EPICEstimate">
          <HistoryOutlined />
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { ScheduleOutlined, HomeOutlined, HistoryOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    ScheduleOutlined,
    HomeOutlined,
    HistoryOutlined,
  },
  data() {
    return {
      menukey:["1"]
    };
  },
};
</script>
<style>
.logo {
  height: 32px;
  margin: 16px;
}
</style>
