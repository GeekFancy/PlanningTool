<template>
  <a-select
    mode="tags"
    style="width: 100%"
    placeholder="Please Choose a Assignee to filter the JIRA Activity List"
    @change="filter"
  >
    <a-select-option
      v-for="users in tableData"
      :key="users.key"
      v-bind:id="users.displayName"
    >
      {{ users.displayName }}
    </a-select-option>
  </a-select>
  <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
    <PlanningCard
      v-for="planning in planningData"
      :key="planning.id"
      :item="planning"
      v-bind:currentUser="currentUser"
    />
  </div>
</template>


<script>
import { getPlanningResult } from "../../../api";
import PlanningCard from "./planning-card.vue";
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
    planningData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    PlanningCard,
  },
  data() {
    const colors = {
      Done: "green",
      Blocked: "red",
      "In Progress": "#e9e973",
      Open: "lightblue",
    };
    const JIRAIssueBasedURL = "https://sapjira.wdf.sap.corp/browse/";
    return {
      currentUser: [],
      colors,
      JIRAIssueBasedURL,
    };
  },

  methods: {

    filter(value){
      this.currentUser = value;
    },
  },
};
</script>

<style>
#components-button-demo-button-group .ant-btn-group {
  margin-right: 8px;
}
</style>