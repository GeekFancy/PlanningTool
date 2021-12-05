<template>
<a-layout style="min-height: 100vh">
  <div class="worklog">
    <div class="worklog-top">
      <div class="worklog-top-left">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>EPIC Estimate</a-breadcrumb-item>
        </a-breadcrumb>
        <div>
          <span>Takt Duration: </span>
          <a-space direction="horizontal" class="space-class">
            
          </a-space>
        </div>
      </div>
    </div>
  </div>
  <EPICEstimate :visible="selectEPIC" :result="result"/>
</a-layout>
</template>

<script>
import EPICEstimate from "./components/select-epic.vue";
export default {
    components:{
        EPICEstimate,
    },
    data() {
        return {
            selectEPIC: true,
            result:null,
        }
    }
};
</script>

<style>
</style>