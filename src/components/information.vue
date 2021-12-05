<template>
  <a-typography style="margin-top: 15px">
    <a-typography-title :level="2"
      >Thank you for using the SAP internal JIRA tool</a-typography-title
    >
    <a-typography-paragraph>
      This tool corrently only provided the planning and worklog statistics
      function.
    </a-typography-paragraph>
    <a-typography-paragraph>
      The front-end and back-end of this tool are separated. The front-end uses
      the Vue framework and Ant Design Vue UI. Back-end uses the Sprint Boot
      framework.
    </a-typography-paragraph>
    <a-typography-paragraph>
      <a-typography-text strong>
        Please note: All the information you enter in this tool will only be
        stored in the browser's local session storage. If you close this page,
        all the information you entered will be lost.
      </a-typography-text>
    </a-typography-paragraph>
    <a-divider />
    <a-typography-title :level="3">Planning</a-typography-title>
    <a-typography-paragraph>
      In the planning page, this tool will load all JIRA Issues according to the
      selected JIRA Project, Board and Spring. You can manually enter the Takt
      duration, public holidays, daily working hours and default working
      coefficient information. This information will be applied to each team
      member and will be used to calculate the planned and remaining time for
      team member in the selected takt.
    </a-typography-paragraph>
    <a-typography-paragraph>
      You can also adjust the leave and coefficient of specific team member
      accordingly.
    </a-typography-paragraph>

    <a-divider />
    <a-typography-title :level="3">Worklog</a-typography-title>
    <a-typography-paragraph>
      In the worklog page, this tool will load all JIRA worklog according to the
      selected time range and current user.
    </a-typography-paragraph>
    <a-typography-paragraph>
      The worklog results will be aggregated with the JIRA issues Invest Case
      ID. If the Invest Case ID cannot be determined for the issue of the
      worklog, this tool will aggregate the worklog with the corresponding issue
      EPIC.
    </a-typography-paragraph>

    <a-divider />
    <a-typography-title :level="5">Contact</a-typography-title>

    <a-typography-paragraph>
      If you find any problems or need new features, please contact Troy
      (troy.jiang@sap.com).
    </a-typography-paragraph>
  </a-typography>
</template>

<script>
export default {
  name: "Information",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
