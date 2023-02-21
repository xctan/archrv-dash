<script setup lang="ts">
import PackageList from './components/PackageList.vue';
</script>

<template>
  <div>
    <el-container>
      <el-header>
        <h1>Arch Linux RISC-V Package Status</h1>
      </el-header>
      <el-main>
        <Suspense>
          <PackageList />
          <template #fallback>
            <el-skeleton :rows="10" animated />
          </template>
        </Suspense>
      </el-main>
      
    </el-container>
  </div>
</template>

<style scoped>

</style>
