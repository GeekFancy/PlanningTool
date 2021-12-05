<template>
  <a-modal
    :visible="visible"
    title="JIRA Tool"
    :maskClosable="false"
    width="40%"
    :closable="false"
  >
    <section class="step-section">
      <div class="steps-div">
        <a-steps :current="current" direction="vertical">
          <a-step v-for="item in steps" :key="item.title" :title="item.title">
            <template #description>
              <!-- <span>{{ item.description }}</span> -->
            </template>
          </a-step>
        </a-steps>
      </div>
      <div class="contents-div">
        <StartInfoModal
          :current="current"
          :boardData="boardData"
          :sprintData="sprintData"
          @valChange="onChange"
          :id="paramsId"
        />
      </div>
    </section>

    <template #footer>
      <div class="steps-action">
        <a-button v-if="current > 0" style="margin-left: 8px" @click="prev"
          >Previous</a-button
        >
        <a-button
          v-if="current < steps.length - 1"
          type="primary"
          @click="next"
          :loading="loading"
        >
          Next
        </a-button>
        <a-button
          v-if="current == steps.length - 1"
          type="primary"
          @click="handleClose"
        >
          Done
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import StartInfoModal from "./StartInfor-Modal";
import { getUser, getProject, getAllBoard, getAllFutureSprint } from "../api";
import { message } from "ant-design-vue";
export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    StartInfoModal,
  },
  data() {
    return {
      title: "JIRA User ID (SAP D/C/I-Number)",
      current: parseInt(window.sessionStorage.getItem("current")) || 0,
      steps: [
        {
          title: "Start",
          display: true,
        },
        {
          title: "User ID",
        },
        {
          title: "Project ID",
        },
        {
          title: "Board ID",
        },
        {
          title: "Sprint ID",
        },
        {
          title: "Last",
        },
      ],
      id: null,
      boardId: null,
      projectId: null,
      sprintId: null,
      userData: null,
      sprintData: null,
      boardData: null,
      loading: false,
    };
  },
  computed: {
    paramsId() {
      return this.current === 1
        ? this.id
        : this.current === 2
        ? this.projectId
        : this.current === 3
        ? this.boardId
        : this.sprintId;
    },
  },
  mounted() {},
  methods: {
    async next() {
      this.loading = true;
      if (this.current === 1) {
        if (!this.id) {
          message.error("User ID is Mandatory");
          this.loading = false;
          return;
        }
        const res = await getUser(this.id);
        if (res.responseCode == 200) {
          this.steps[this.current].title = res.data.displayName;
          window.sessionStorage.setItem("user", JSON.stringify(res.data));
          this.$emit("handleSaveUser", res.data);
        } else {
          message.error(res.message);
          this.loading = false;
          return;
        }
      } else if (this.current === 2) {
        if (!this.projectId) {
          message.error("Project ID is Mandatory");
          this.loading = false;
          return;
        }
        const res = await getProject(this.projectId);
        if (res.responseCode == 200) {
          const resp = await getAllBoard(this.projectId);
          if (resp.responseCode == 200) {
            this.boardData = resp.data;
          }
          this.steps[this.current].title = res.data.name;
          window.sessionStorage.setItem("project", JSON.stringify(res.data));
          this.$emit("handleSaveProject", res.data);
        } else {
          message.error(res.message);
          this.loading = false;
          return;
        }
      } else if (this.current === 3) {
        if (!this.boardId) {
          message.error("Please Setect the Board First");
          this.loading = false;
          return;
        }
        const selectedBoardData = this.boardData.filter(
          (el) => el.id == this.boardId
        )[0];
        window.sessionStorage.setItem(
          "board",
          JSON.stringify(selectedBoardData)
        );
        this.$emit("handleSaveBoard", selectedBoardData);
        const res = await getAllFutureSprint(this.boardId);
        if (res.responseCode == 200) {
          this.steps[this.current].title = selectedBoardData.name;

          this.sprintData = res.data;
        } else {
          message.error(res.message);
          this.loading = false;
          return;
        }
      } else if (this.current === 4) {
        const selectedSprintData = this.sprintData.filter(
          (el) => el.id == this.sprintId
        )[0];
        if (!selectedSprintData) {
          message.error("Please Setect the Sprint First");
          this.loading = false;
          return;
        }
        window.sessionStorage.setItem(
          "sprint",
          JSON.stringify(selectedSprintData)
        );
        this.$emit("handleSaveSprint", selectedSprintData);
        this.steps[this.current].title = selectedSprintData.name;
      }
      this.current++;
      window.sessionStorage.setItem("current", this.current);
      this.loading = false;
    },

    prev() {
      this.current--;
    },
    onChange(val) {
      switch (this.current) {
        case 1:
          this.id = val;
          break;
        case 2:
          this.projectId = val;
          break;
        case 3:
          this.boardId = val;
          break;
        case 4:
          this.sprintId = val;
          break;
      }
    },
    handleClose() {
      this.$emit("handleUserInfoModal");
    },
  },
};
</script>

<style  scoped>
.step-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.steps-div {
  width: 45%;
}
.contents-div {
  flex: 1;
}
::v-deep .ant-steps-item {
  height: 4rem;
}
</style>