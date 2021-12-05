<template>
  <a-table
    class="ant-table-striped"
    :columns="columns"
    :data-source="tableData"
    :pagination="false"
  >
    <template #summary="{ text, record }">
      <span>
        <a :href="this.JIRAIssueBasedURL + record.key" target="_blank">{{
          text
        }}</a>
      </span>
    </template>
    <template #status="{ text }">
      <span>
        <a-tag :key="text" :color="colors[text]">
          {{ text }}
        </a-tag>
      </span>
    </template>
  </a-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const columns = [
      {
        title: "Name",
        dataIndex: "summary",
        key: "summary",
        slots: {
          customRender: "summary",
        },
      },
      {
        title: "Assignee",
        dataIndex: "assignee",
        key: "assignee",
        customRender: (record) => {
          if (record) {
            return record.text.displayName;
          } else {
            return "";
          }
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Estimate",
        dataIndex: "timeestimate",
        key: "timeestimate",
        customRender: (text) => {
          return parseInt(text.text) / 3600;
        },
      },
      {
        title: "Timespent",
        dataIndex: "timespent",
        key: "timespent",
        customRender: (text) => {
          return parseInt(text.text) / 3600;
        },
      },
    ];
    const colors = {
      Done: "green",
      Blocked: "red",
      "In Progress": "#e9e973",
      Open: "lightblue",
    };
    const JIRAIssueBasedURL = "https://sapjira.wdf.sap.corp/browse/";
    return {
      columns,
      colors,
      JIRAIssueBasedURL,
    };
  },
};
</script>

<style>
</style>