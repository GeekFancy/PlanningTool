<template>
  <a-modal
    :visible="visible"
    title="Select EPIC"
    :maskClosable="false"
    width="40%"
    :closable="false"
  >
    <section class="step-section">
      <div class="steps-div">
        <a-steps :current="current" direction="vertical">
          <a-step v-for="item in steps" :key="item.title" :title="item.title">
            <template #description> </template>
          </a-step>
        </a-steps>
      </div>

      <div class="contents-div" v-if="this.current === 0">
        <a-card title="Current Project" :bordered="false" style="width: 300px">
          <p>
            {{ projectName }}
          </p>
        </a-card>
      </div>

      <div class="contents-div" v-if="this.current === 1">
        <a-card title="Current Project" :bordered="false" style="width: 300px">
          <a-select
            @change="handleSelectVersionDelivery"
            placeholder="Please Select Your JIRA Board ID"
            style="width: 100%"
          >
            <a-select-option
              v-for="versionDelivery in JIRAVersionDelivery"
              :key="versionDelivery.id"
              :value="versionDelivery.name"
              >{{ versionDelivery.name }}</a-select-option
            >
          </a-select>
        </a-card>
      </div>
      <div class="contents-div" v-if="this.current === 2">
        <a-card title="Current Project" :bordered="false" style="width: 300px">
          <a-select
            @change="handleSelectEPIC"
            placeholder="Please Select EPIC"
            style="width: 100%"
          >
            <a-select-option
              v-for="epic in EPICs"
              :key="epic.id"
              :value="epic.key"
              :title="epic.summary"
              >{{ `${epic.key} / ${epic.summary}` }}</a-select-option
            >
          </a-select>
        </a-card>
      </div>
      <div class="contents-div" v-if="this.current === 3">
        <a-card title="Last" :bordered="false" style="width: 300px">
          <p>Selected Project: {{ projectName }}</p>
          <p>
            Selected Version / Delivery: {{ this.selectedVersionDelivery.name }}
          </p>
          <p>
            Selected Version / Delivery: {{ this.selectedEPIC.key }} /
            {{ this.selectedEPIC.summary }}
          </p>
        </a-card>
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
          :loading="loading"
        >
          Done
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import {
  getJIRAVersionDelivery,
  getEPICByProjestAndVersionDelivery,
  getEPICEstimate,
} from "../../../api";

import { message } from "ant-design-vue";
export default {
  data() {
    return {
      visible: true,
      project: null,
      current: 0,
      loading: false,
      JIRAVersionDelivery: [],
      EPICs: [],
      selectedEPIC: "",
      selectedVersionDelivery: "",
      steps: [
        {
          title: this.project,
          display: true,
        },
        {
          title: "Version / Delivery",
        },
        {
          title: "EPIC",
        },
        {
          title: "Last",
        },
      ],
    };
  },
  computed: {
    projectName() {
      this.steps[0].title = this.project
        ? this.project.name
        : JSON.parse(window.sessionStorage.getItem("project"))
        ? JSON.parse(window.sessionStorage.getItem("project")).name
        : "";
      return this.steps[0].title;
    },
  },
  methods: {
    async next() {
      this.loading = true;

      if (this.current === 0) {
        const res = await getJIRAVersionDelivery(
          JSON.parse(window.sessionStorage.getItem("project")).key
        );
        if (res.responseCode == 200) {
          this.JIRAVersionDelivery = res.data;
        } else {
          message.error(res.message);
          this.loading = false;
          return;
        }
      } else if (this.current === 1) {
        const projectIdOrKey = JSON.parse(
          window.sessionStorage.getItem("project")
        ).key;
        const versionDelivery = this.selectedVersionDelivery.name;
        const res = await getEPICByProjestAndVersionDelivery({
          projectIdOrKey,
          versionDelivery,
        });
        if (res.responseCode == 200) {
          this.EPICs = res.data;
        } else {
          message.error(res.message);
          this.loading = false;
          return;
        }
      }

      this.current++;
      window.sessionStorage.setItem("SelectEpicStep", this.current);
      this.loading = false;
    },
    prev() {
      this.current--;
    },
    handleSelectVersionDelivery(versionDelivery) {
      for (let index = 0; index < this.JIRAVersionDelivery.length; index++) {
        const element = this.JIRAVersionDelivery[index];
        if (element.name === versionDelivery) {
          this.selectedVersionDelivery = element;
        }
      }
      this.steps[this.current].title = versionDelivery;
    },
    handleSelectEPIC(EPIC) {
      for (let index = 0; index < this.EPICs.length; index++) {
        const element = this.EPICs[index];
        if (element.key === EPIC) {
          this.selectedEPIC = element;
        }
      }
      this.steps[this.current].title = EPIC;
    },
    async handleClose() {
      this.loading = true;
      const EPICKey = this.selectedEPIC.key;
      const res = await getEPICEstimate({
        EPICKey,
      });
      if (res.responseCode == 200) {
        this.result = res.data;
      } else {
        message.error(res.message);
        this.loading = false;
        return;
      }
      this.visible = false;
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