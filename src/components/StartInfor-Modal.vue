<template>
  <div>
    <div v-if="current === 0">
      <a-card title="Before you start" :bordered="false" style="width: 300px">
        <p>
          1. Please prepare your JIRA User ID, you can found it via:
          <a
            href="https://sapjira.wdf.sap.corp/secure/ViewProfile.jspa"
            target="_blank"
            >View Profile</a
          >
        </p>
        <p>
          2. Please prepare the JIRA Project ID which you want to check, you can
          found it via:
          <a
            href="https://sapjira.wdf.sap.corp/secure/BrowseProjects.jspa?selectedCategory=recent&selectedProjectType=all&sortColumn=name&sortOrder=ascending"
            target="_blank"
            >Recent Project</a
          >
        </p>
      </a-card>
    </div>
    <div v-if="current === 1">
      <a-card title="JIRA User ID" :bordered="false" style="width: 300px">
        <a-input
          @change="handleChange"
          :value="id"
          placeholder="Please Input Your JIRA User ID"
          style="width: 100%"
        />
      </a-card>
    </div>
    <div v-if="current === 2">
      <a-card title="JIRA Project ID" :bordered="false" style="width: 300px">
        <a-input
          @change="handleChange"
          :value="id"
          placeholder="Please Input Your JIRA Project ID"
          style="width: 100%"
        />
      </a-card>
    </div>
    <div v-if="current === 3">
      <a-card title="JIRA Board ID" :bordered="false" style="width: 300px">
        <a-select
          @change="handleChange"
          :value="id"
          placeholder="Please Select Your JIRA Board ID"
          style="width: 100%"
        >
          <a-select-option
            v-for="board in boardData"
            :key="board.id"
            :value="board.id"
            >{{ board.name }}</a-select-option
          >
        </a-select>
      </a-card>
    </div>
    <div v-if="current === 4">
      <a-card title="JIRA Sprint ID" :bordered="false" style="width: 300px">
        <a-select
          @change="handleChange"
          :value="id"
          placeholder="Please Select Your JIRA Sprint ID"
          style="width: 100%"
        >
          <a-select-option
            v-for="sprint in sprintData"
            :key="sprint.id"
            :value="sprint.id"
            >{{ sprint.name }}</a-select-option
          >
        </a-select>
      </a-card>
    </div>
    <div v-if="current === 5">
      <a-card title="All Done" :bordered="false" style="width: 300px">
        <p>
          Please note: All the information you enter in this tool will only be
          stored in the browser's local session storage. If you close this page,
          all the information you entered will be lost.
        </p>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: null,
    },
    boardData: {
      type: Array,
      default: () => [],
    },
    sprintData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    callNext() {
      this.$emit("next", this.id);
    },
    handleChange(e) {
      if (this.current === 1 || this.current === 2) {
        this.$emit("valChange", e.target.value);
      } else {
        this.$emit("valChange", e);
      }
    },
  },
};
</script>

<style>
</style>