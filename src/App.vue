<script setup lang="ts">
import { Position } from '@element-plus/icons-vue';
import { TableColumnCtx } from 'element-plus';
import ArchLinuxLogo from './assets/arch.svg';
import { Package } from './types';
import MarkTag from './components/MarkTag.vue';
import { fetchData } from './subscribe';

const workFormatter = (row: Package, column: TableColumnCtx<Package>) => {
  switch (row.work.kind) {
    case "pr":
      return "PullRequest";
    case "prdel":
      return "RemoveRequest";
    case "add":
      return "Working";
    default:
      return "";
  }
}

const tableData: Package[] = await fetchData('');

const tableRowClassName = ({ row, rowIndex }: { row: Package, rowIndex: number }) => {
  
  return '';
};
</script>

<template>
  <div>
    <el-container>
      <el-header>
        <h1>Arch Linux RISC-V Package Status</h1>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="name" label="Name" width="300">
            <template #default="{ row }">
              <el-link 
                :href="`https://archlinux.org/packages/?q=${row.name}`" 
                class="mr-4"
                target="_blank"
              >
                <el-icon size="6">
                  <img :src="ArchLinuxLogo" alt="" style="width: 4em">
                </el-icon>
              </el-link>
              <span class="mr-2">|</span>
              <el-link
                :href="`https://archriscv.felixc.at/.status/logs/${row.name}/`"
                target="_blank"
              >
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="User" width="120" />
          <el-table-column :formatter="workFormatter" label="Work" width="120" />
          <el-table-column label="Marks" >
            <template #default="{ row }">
              <span v-for="mark in row.mark">
                <MarkTag :mark="mark" class="mr-2"/>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      
    </el-container>
  </div>
</template>

<style scoped>
.mr-2 {
  margin-right: 0.5rem;
}
.mr-4 {
  margin-right: 1rem;
}
</style>
