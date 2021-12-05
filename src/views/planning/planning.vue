<template>
  <div class="planning">
    <a-spin :spinning="loading">
      <template #indicator>
        <LoadingOutlined style="font-size: 24px" />
      </template>
      <div class="planning-top">
        <div class="planning-top-left">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Planning Result</a-breadcrumb-item>
            <a-breadcrumb-item>{{ sprintName }}</a-breadcrumb-item>
          </a-breadcrumb>
          <div>
            <span>Takt Duration: </span>
            <a-space direction="horizontal" class="space-class">
              <a-range-picker
                v-model:value="setectDateRange"
                @change="changeDuration"
                format="YYYY-MM-DD"
              />
            </a-space>
          </div>
          <div style="margin-top: 10px">
            <a-space direction="horizontal">
              <span> Public Holiday: </span>
              <a-input-number
                v-model:value="holidays"
                :min="0"
                :max="totalWorkingDays"
                @change="changHolidays"
              />
              <a-slider
                v-model:value="holidays"
                :min="0"
                :max="totalWorkingDays"
                @change="changHolidays"
                width="100px"
              />
            </a-space>
          </div>
          <div style="margin-top: 10px">
            <a-space direction="horizontal">
              <span>Total Working Days: {{ getWorkingDays }}</span>
              <span>
                Working Hours:
                <a-input-number
                  v-model:value="workingHours"
                  :min="0"
                  :max="24"
                  @change="changWorkingHours"
                />
              </span>
              <span>
                Working Coefficient:
                <a-input-number
                  v-model:value="workCoefficient"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  @change="changWorkCoefficient"
                />
              </span>
            </a-space>
          </div>
        </div>
        <div class="planning-top-right">
          <a-card title="Planning Overview">
            <p>
              Total Capacity: {{ totalCapacity }} / Total Estimate:
              {{ totalEstimate }}
            </p>
            <p>
              Remaining for Maintenance or Incident Handling:
              {{ totalRemaining }}
            </p>
            <a-button
              type="primary"
              size="small"
              style="flex: 1"
              @click="download"
            >
              <template #icon>
                <DownloadOutlined />
              </template>
              Download
            </a-button>
          </a-card>
        </div>
      </div>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <PlanningUserTable
          :tableData="planningUserData"
          @calculateUsercapacity="calculateUsercapacity"
          :totalWorkingDays="totalWorkingDays"
        />
        <UserFilter
          v-bind:tableData="planningUserData"
          :planningData ="planningData"
        />
        <!-- <PlanningCard
          v-for="planning in planningData"
          :key="planning.id"
          :item="planning"
        /> -->
      </div>
    </a-spin>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { getPlanningResult } from "../../api";
import UserFilter from "./components/planning-user-filter.vue";
import PlanningCard from "./components/planning-card.vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import PlanningUserTable from "./components/planning-user-table.vue";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons-vue";
import XLSX, { WorkSheet } from "xlsx";
export default {
  components: {
    UserFilter,
    PlanningCard,
    LoadingOutlined,
    DownloadOutlined,
    PlanningUserTable,
  },
  data() {
    return {
      planningData: [],
      planningUserData: [],
      loading: false,
      setectDateRange: [],
      totalWorkingDays: 0,
      workingDays: 0,
      holidays: 0,
      workingHours: 8,
      workCoefficient: 0.8,
      totalCapacity: 0,
      totalEstimate: 0,
      totalRemaining: 0,
    };
  },
  computed: {
    sprintName() {
      return JSON.parse(window.sessionStorage.getItem("sprint"))
        ? JSON.parse(window.sessionStorage.getItem("sprint")).name
        : "";
    },
    getWorkingDays() {
      if (this.setectDateRange && this.setectDateRange.length === 2) {
        return this.workingDays;
      }
      return "Please Select the Takt Duration";
    },
  },
  created() {
    this.getPlanningData();
    let savedDateRange = JSON.parse(
      window.sessionStorage.getItem("setectDateRange")
    );
    if (savedDateRange && savedDateRange.length === 2) {
      this.setectDateRange = [savedDateRange[0], savedDateRange[1]];
      this.calculateWorkingDays(savedDateRange[0], savedDateRange[1]);
    }

    this.workingHours = window.sessionStorage.getItem("workingHours")
      ? parseInt(window.sessionStorage.getItem("workingHours"))
      : 8;
    this.workCoefficient = window.sessionStorage.getItem("workCoefficient")
      ? parseFloat(window.sessionStorage.getItem("workCoefficient"))
      : 0.8;
    this.holidays = window.sessionStorage.getItem("holidays")
      ? parseInt(window.sessionStorage.getItem("holidays"))
      : 0;
  },
  methods: {
    async getPlanningData() {
      this.loading = true;
      const boardId = JSON.parse(window.sessionStorage.getItem("board")).id;
      const sprintId = JSON.parse(window.sessionStorage.getItem("sprint")).id;
      const res = await getPlanningResult({ boardId, sprintId });
      if (res.responseCode == 200) {
        this.planningData = res.data.issues;
        this.planningUserData = res.data.users;

        let localPlanningUserData = JSON.parse(
          window.sessionStorage.getItem("planningUserData")
        );

        this.totalCapacity = 0;
        this.totalEstimate = 0;
        this.totalRemaining = 0;

        res.data.users.map((user) => {
          user.leave = 0;
          user.coefficient = 1;
          user.include = true;
          let localPlanningUserDatas = [];
          if (localPlanningUserData) {
            localPlanningUserDatas = localPlanningUserData.filter(
              (localUserData) => localUserData.key === user.key
            );
          }

          if (localPlanningUserDatas.length > 0) {
            user.coefficient = localPlanningUserDatas[0].coefficient;
            user.leave = localPlanningUserDatas[0].leave;
            user.include = localPlanningUserDatas[0].include;
          }
          user.capacity = (
            (this.workingDays - user.leave) *
            this.workingHours *
            this.workCoefficient *
            user.coefficient
          ).toFixed(2);
          user.remaining = (user.capacity - user.plannedTime / 3600).toFixed(2);

          if (user.include) {
            this.totalEstimate += user.plannedTime / 3600;
            this.totalCapacity += Number(user.capacity);
          }
          return user;
        });
        this.totalCapacity = this.totalCapacity.toFixed(2);
        this.totalRemaining = (this.totalCapacity - this.totalEstimate).toFixed(
          2
        );
      } else {
        message.error(res.message);
        this.planningData = [];
        this.planningUserData = [];
      }
      this.loading = false;
    },
    changeDuration(date, dateString) {
      if (dateString.length === 2) {
        this.calculateWorkingDays(dateString[0], dateString[1]);
      }
    },
    calculateWorkingDays(startDate, endDate) {
      this.workingDays = 0;
      let fromDate = moment(startDate, "YYYY-MM-DD");
      let toDate = moment(endDate, "YYYY-MM-DD");
      while (toDate.diff(fromDate) >= 0) {
        if (fromDate.isoWeekday() < 6) {
          this.workingDays++;
        }
        fromDate.add(1, "days");
      }
      this.totalWorkingDays = this.workingDays;
      this.workingDays = this.workingDays - this.holidays;
      window.sessionStorage.setItem(
        "setectDateRange",
        JSON.stringify(this.setectDateRange)
      );
      this.calculateUsercapacity();
    },
    calculateUsercapacity(tableData) {
      if (tableData) {
        this.planningUserData = tableData;
      }

      this.totalEstimate = 0;
      this.totalCapacity = 0;
      this.planningUserData.forEach((user) => {
        user.capacity = (
          (this.workingDays - user.leave) *
          this.workingHours *
          this.workCoefficient *
          user.coefficient
        ).toFixed(2);
        user.remaining = (user.capacity - user.plannedTime / 3600).toFixed(2);
        if (user.include) {
          this.totalEstimate += user.plannedTime / 3600;
          this.totalCapacity += Number(user.capacity);
        }
      });
      this.totalCapacity = this.totalCapacity.toFixed(2);
      this.totalRemaining = (this.totalCapacity - this.totalEstimate).toFixed(
        2
      );
      if (this.planningUserData.length > 0) {
        window.sessionStorage.setItem(
          "planningUserData",
          JSON.stringify(this.planningUserData)
        );
      }
    },
    changWorkingHours() {
      window.sessionStorage.setItem("workingHours", this.workingHours);
      this.calculateUsercapacity();
    },
    changWorkCoefficient() {
      window.sessionStorage.setItem("workCoefficient", this.workCoefficient);
      this.calculateUsercapacity();
    },
    changHolidays() {
      window.sessionStorage.setItem("holidays", this.holidays);
      let savedDateRange = JSON.parse(
        window.sessionStorage.getItem("setectDateRange")
      );
      if (savedDateRange && savedDateRange.length === 2) {
        this.calculateWorkingDays(savedDateRange[0], savedDateRange[1]);
      }
      this.calculateUsercapacity();
    },
    download() {
      let planningOverviewData = [
        ["Takt Duration", this.setectDateRange[0], this.setectDateRange[1]],
        ["Public Holiday", this.holidays],
        ["Total Working Days", this.workingDays],
        ["Working Hours", this.workingHours],
        ["Working Coefficient", this.workCoefficient],
        ["Team Total Capacity", this.totalCapacity],
        ["Team Total Estimate", this.totalEstimate],
        [
          "Team Remaining for Maintenance or Incident Handling",
          this.totalRemaining,
        ],
      ];
      let planningOverviewDataWorksheet =
        XLSX.utils.aoa_to_sheet(planningOverviewData);

      let exportUserData = [
        [
          "JIRA User Key",
          "Name",
          "Leave",
          "Coefficient",
          "Capacity",
          "Planned Time",
          "Remaining",
        ],
      ];

      for (let index = 0; index < this.planningUserData.length; index++) {
        const element = this.planningUserData[index];
        exportUserData.push([
          element.key,
          element.displayName,
          element.leave,
          element.coefficient,
          element.capacity,
          element.plannedTime / 3600,
          element.remaining,
        ]);
      }
      let exportUserDataWorksheet = XLSX.utils.aoa_to_sheet(exportUserData);

      let jiraIssuesData = [
        [
          "Issue Type",
          "Issue Key",
          "Name",
          "Epic Key",
          "Epic Name",
          "Assignee",
          "Status",
          "Time Estimate",
          "Time Spent",
          "Aggregate Time Estimate",
          "Aggregate Time Spent",
        ],
      ];
      for (let index = 0; index < this.planningData.length; index++) {
        const element = this.planningData[index];
        jiraIssuesData.push([
          element.issuetype,
          element.key,
          element.summary,
          element.epic.key,
          element.epic.name,
          element.assignee.displayName,
          element.status,
          element.timeestimate / 3600,
          element.timespent / 3600,
          element.aggregatetimeestimate / 3600,
          element.aggregatetimespent / 3600,
        ]);
        if (this.planningData[index].subtasks && this.planningData[index].subtasks.length > 0) {
          for (let subtaskindex = 0; subtaskindex < this.planningData[index].subtasks.length; subtaskindex++) {
            const subtask = this.planningData[index].subtasks[subtaskindex];
            jiraIssuesData.push([
              subtask.issuetype,
              subtask.key,
              subtask.summary,
              subtask.epic.key,
              subtask.epic.name,
              subtask.assignee.displayName,
              subtask.status,
              subtask.timeestimate / 3600,
              subtask.timespent / 3600,
              subtask.aggregatetimeestimate / 3600,
              subtask.aggregatetimespent / 3600,
            ]);
          }
        }
      }
      let jiraIssuesDataWorksheet = XLSX.utils.aoa_to_sheet(jiraIssuesData);

      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        planningOverviewDataWorksheet,
        "Planning Overview"
      );
      XLSX.utils.book_append_sheet(
        workbook,
        exportUserDataWorksheet,
        "Planning Result"
      );
      XLSX.utils.book_append_sheet(
        workbook,
        jiraIssuesDataWorksheet,
        "JIRA Issues"
      );

      XLSX.writeFile(workbook, "Planning Result.xlsx");
    },
  },
};
</script>
<style scoped>
::v-deep .ant-slider {
  width: 100px;
}
.planning-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.planning-top-right {
  flex: 1;
  margin-left: 10px;
}
.planning {
  background: white;
  width: 98%;
  margin: auto;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
