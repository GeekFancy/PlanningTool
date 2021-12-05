<template>
  <a-table bordered :data-source="tableData" :columns="columns" :pagination="false">
    <template #include="{ record}">
      <a-checkbox :checked="record.include" @click="handleIncludeChange(record.key)"/>
    </template>
    <template #leave="{ text, record }">
      <div class="editable-cell">
        <div
          v-if="editableData[record.key]"
          class="editable-cell-input-wrapper"
        >
          <a-input-number
            v-model:value="editableData[record.key].leave"
            :min="0"
            :max="totalWorkingDays"
            :step="0.5"
            @pressEnter="save(record.key)"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ text }}
        </div>
      </div>
    </template>
    <template #coefficient="{ text, record }">
      <div class="editable-cell">
        <div
          v-if="editableData[record.key]"
          class="editable-cell-input-wrapper"
        >
          <a-input-number
            v-model:value="editableData[record.key].coefficient"
            :min="0"
            :max="1"
            :step="0.1"
            @pressEnter="save(record.key)"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ text }}
        </div>
      </div>
    </template>
    <template #action="{ record }">
      <check-outlined
        class="editable-cell-icon-check"
        @click="save(record.key)"
        v-if="editableData[record.key]"
      />
      <edit-outlined
        class="editable-cell-icon"
        @click="edit(record.key)"
        v-else
      />
    </template>
  </a-table>
</template>

<script>
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { convertLegacyProps } from 'ant-design-vue/lib/button/buttonTypes';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    totalWorkingDays: {
      type:Number,
      default: 0
    }
  },
  components: {
    CheckOutlined,
    EditOutlined,
  },
  data() {
    const columns = [
      {
        title: 'Include',
        dataIndex: 'include',
        key:'include',
        slots: { customRender: "include" },
      },
      {
        title: "Name",
        dataIndex: "displayName",
        key: "displayName",
      },
      {
        title: "Leave",
        dataIndex: "leave",
        key: "leave",
        slots: {
          customRender: "leave",
        },
      },
      {
        title: "Coefficient",
        dataIndex: "coefficient",
        key: "coefficient",
        slots: {
          customRender: "coefficient",
        },
      },
      {
        title: "Capacity",
        dataIndex: "capacity",
        key: "capacity",
      },
      {
        title: "Planned Time",
        dataIndex: "plannedTime",
        key: "plannedTime",
        customRender: (text) => {
          return parseInt(text.text) / 3600;
        },
      },
      {
        title: "Remaining",
        dataIndex: "remaining",
        key: "remaining",
      },
      {
        title: "Action",
        key: "operation",
        fixed: "right",
        slots: { customRender: "action" },
      },
    ];
    const colors = {
      Done: "green",
      Blocked: "red",
      "In Progress": "#e9e973",
      Open: "lightblue",
    };
    return {
      columns,
      colors,
      editableData: {},
    };
  },
  methods: {
    save(key) {
      Object.assign(
        this.tableData.filter((item) => key === item.key)[0],
        this.editableData[key]
      );
      this.handleEmit();
      delete this.editableData[key];
    },
    edit(key) {
      this.editableData[key] = cloneDeep(
        this.tableData.filter((item) => key === item.key)[0]
      );
      console.log('1111',this.editableData)
    },
    handleEmit(){
      this.$emit("calculateUsercapacity", this.tableData);
    },
    handleIncludeChange(key){
      this.tableData.map(el =>{
        if(el.key === key){
          el.include = !el.include;
        }
        return el;
      })
      this.handleEmit();
    }
  },
};
</script>

<style lang="less" scoped>
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>