<template>
  <a-layout style="min-height: 100vh">
    <SiderModal />
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header style="background: #fff; padding: 0">
        <div style="margin-top:15px; margin-left:5px;">
          <a-breadcrumb>
            <a-breadcrumb-item v-if="userName">
              <a-button type="text" >{{ userName }}</a-button>
            </a-breadcrumb-item>

            <a-breadcrumb-item v-if="projectName">
              <a-button type="text" >{{ projectName }}</a-button>
            </a-breadcrumb-item>

            <a-breadcrumb-item v-if="boardName">
              <a-button type="text" >{{ boardName }}</a-button>
            </a-breadcrumb-item>

            <a-breadcrumb-item v-if="sprintName">
              <a-button type="text">{{ sprintName }}</a-button>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <router-view />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        JIRA Tool ©2021 Created by Troy Jiang
      </a-layout-footer>
    </a-layout>
    <UserInfoModal
      :visible="userInfoVisiable"
      @handleUserInfoModal="handleUserInfoModal"
      @handleSaveUser="handleSaveUser"
      @handleSaveProject="handleSaveProject"
      @handleSaveBoard="handleSaveBoard"
      @handleSaveSprint="handleSaveSprint"
    />
  </a-layout>
</template>

<script>
import SiderModal from "./components/sider.vue";
import UserInfoModal from "./components/userInfo-modal.vue";

export default {
  name: "App",
  components: {
    SiderModal,
    UserInfoModal,
  },

  data() {
    return {
      collapsed: false,
      selectedKeys: ["1"],
      userInfoVisiable:
        JSON.parse(window.sessionStorage.getItem("current")) !== 5,
      user: null,
      project: null,
      board: null,
      sprint: null,
    };
  },
  computed: {
    userName() {
      return this.user
        ? this.user.displayName
        : JSON.parse(window.sessionStorage.getItem("user"))
        ? JSON.parse(window.sessionStorage.getItem("user")).displayName
        : "";
    },
    projectName() {
      return this.project
        ? this.project.name
        : JSON.parse(window.sessionStorage.getItem("project"))
        ? JSON.parse(window.sessionStorage.getItem("project")).name
        : "";
    },
    boardName() {
      return this.board
        ? this.board.name
        : JSON.parse(window.sessionStorage.getItem("board"))
        ? JSON.parse(window.sessionStorage.getItem("board")).name
        : "";
    },
    sprintName() {
      return this.sprint
        ? this.sprint.name
        : JSON.parse(window.sessionStorage.getItem("sprint"))
        ? JSON.parse(window.sessionStorage.getItem("sprint")).name
        : "";
    },
  },
  methods: {
    handleUserInfoModal() {
      this.userInfoVisiable = false;
    },
    handleSaveUser(val) {
      this.user = val;
    },
    handleSaveProject(val) {
      this.project = val;
    },
    handleSaveBoard(val) {
      this.board = val;
    },
    handleSaveSprint(val) {
      this.sprint = val;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
