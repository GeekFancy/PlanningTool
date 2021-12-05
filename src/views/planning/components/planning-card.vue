<template>
  <a-card v-if="currentUser == '' | checkUsers(item) | currentUser.indexOf(item.assignee.key) != -1"
    style="width: 100%; margin-top: 15px; box-shadow: 0 2px 8px rgb(0 0 0 / 9%)"
  >
    <template #title>
      <section>
        <div>
          <a-button :href="this.JIRAIssueBasedURL + item.key" target="_blank"
            >{{ item.issuetype }}: {{ item.key }}</a-button
          >
          <a :href="this.JIRAIssueBasedURL + item.key" target="_blank"
            ><h2>{{ item.summary }}</h2></a
          >
        </div>
        <div>
          <a-button
            :href="this.JIRAIssueBasedURL + item.key"
            target="_blank"
            :style="{ background: `${colors[item.status]}` }"
            style="margin-right: 5px"
            >{{ item.status }}</a-button
          >
          <a-button
            v-if="item.epic.key"
            :href="this.JIRAIssueBasedURL + item.epic.key"
            target="_blank"
            >Epic: {{ item.epic.name + "/" + item.epic.key }}</a-button
          >
          <a-button v-else>Epic: Missing</a-button>
        </div>
        <div>
          {{ item.assignee ? item.assignee.displayName : "" }}
        </div>
        <div>
          <span style="margin-right: 10px; border-right: 1px solid black"
            >Time Spent: {{ item.timespent / 3600 }}&nbsp;&nbsp;</span
          >
          <span style="margin-right: 10px; border-right: 1px solid black"
            >Aggregate Time Spent:
            {{ item.aggregatetimespent / 3600 }}&nbsp;&nbsp;</span
          >
          <span style="margin-right: 10px; border-right: 1px solid black"
            >Time Estimate: {{ item.timeestimate / 3600 }}&nbsp;&nbsp;</span
          >
          <span
            >Aggregate Time Estimate:
            {{ item.aggregatetimeestimate / 3600 }}</span
          >
        </div>
        <div v-if="item.subtasks.length > 0">
          <PlanningTable :tableData="item.subtasks" />
        </div>
      </section>
      
    </template>
  </a-card>
</template>


<script>
import PlanningTable from "./planning-table.vue";
export default {
  props: {
    currentUser: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    PlanningTable,
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
      colors,
      JIRAIssueBasedURL,
    };
  },
  methods: {

    checkUsers(item){
      var result = false;
      const taskList = item.subtasks;
      const assigneeList = [];
      taskList.forEach((task) => {
        assigneeList.push(task.assignee.key);
      });
      this.currentUser.forEach((user) => {
        console.log(assigneeList);
        console.log(assigneeList.indexOf(user));
        if(assigneeList.indexOf(user) != -1) {
          result = true;
        }
      });
      console.log(item.key);
      return result;
    },
  },
  
};
</script>

<style scoped>
</style>