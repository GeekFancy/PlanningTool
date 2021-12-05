<template>
  <div class="worklog">
    <div class="worklog-top">
      <div class="worklog-top-left">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Worklog</a-breadcrumb-item>
          <a-breadcrumb-item>{{ userName }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div>
          <span>Takt Duration: </span>
          <a-space direction="horizontal" class="space-class">
            <a-range-picker
              v-model:value="setectDateRange"
              format="YYYY-MM-DD"
            />
            <a-button
              type="primary"
              @click="getData"
              :disabled="setectDateRange.length !== 2"
              >Go</a-button
            >
            <a-button 
              type="primary" 
              @click="download"
              :disabled="tableData.length <= 0">
              <template #icon>
                <DownloadOutlined />
              </template>
              Download
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :loading="loading"
    />
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import moment from "moment";
import { getWorklogData } from "../../api";
import { DownloadOutlined } from "@ant-design/icons-vue";
import XLSX, { WorkSheet } from "xlsx";
export default {
  components: {
    LoadingOutlined,
    DownloadOutlined,
  },
  data() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Invest Case ID",
        dataIndex: "investCaseID",
        key: "investCaseID",
      },
      {
        title: "Spent Time",
        dataIndex: "spentTime",
        customRender: (text) => {
          return parseInt(text.text) / 3600;
        },
      },
    ];
    return {
      loading: false,
      columns,
      tableData: [],
      setectDateRange: [],
    };
  },
  computed: {
    userName() {
      return JSON.parse(window.sessionStorage.getItem("user"))
        ? JSON.parse(window.sessionStorage.getItem("user")).displayName
        : "";
    },
  },
  created() {},
  methods: {
    async getData() {
      const startDate = moment(this.setectDateRange[0]).format("YYYY-MM-DD");
      const endDate = moment(this.setectDateRange[1]).format("YYYY-MM-DD");
      const projectID = JSON.parse(window.sessionStorage.getItem("project"))
        ? JSON.parse(window.sessionStorage.getItem("project")).key
        : "";
      const userID = JSON.parse(window.sessionStorage.getItem("user"))
        ? JSON.parse(window.sessionStorage.getItem("user")).key
        : "";
      this.loading = true;
      await getWorklogData({ startDate, endDate, projectID, userID })
        .then((res) => {
          if (res.responseCode === 200 && res.data) {
            this.tableData = res.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    download() {
      let exportUserData = [
        [
          "ID",
          "Invest Case ID",
          "Spent Time",
        ],
      ];

      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        exportUserData.push([
          element.id,
          element.investCaseID,
          element.spentTime / 3600,
        ]);
      }
      let exportUserDataWorksheet = XLSX.utils.aoa_to_sheet(exportUserData);

      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        exportUserDataWorksheet,
        "Worklog Result"
      );

      XLSX.writeFile(workbook, "Worklog Result.xlsx");
    },
  },
};
</script>
<style scoped>
::v-deep .ant-slider {
  width: 100px;
}
.worklog-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.worklog-top-left {
  /* width: 70%; */
}
.worklog-top-right {
  /* width: 30%; */
  flex: 1;
}
.worklog {
  background: white;
  width: 98%;
  margin: auto;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
