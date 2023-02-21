<script setup lang="ts">
import { toRaw } from 'vue';
import { DetailedMark } from '../types';

const mark = defineProps<{ mark: string | DetailedMark }>();
const mark_inner = toRaw(mark).mark;

const extractUrlInString = (str: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return str.match(urlRegex);
}

const markTagType = (mark: any) => {
  if (typeof mark === 'string') {
    if (mark.startsWith('triage-')) {
      return 'warning';
    } else {
      return 'success';
    }
  } else if (typeof mark === 'object') {
    switch (mark.name) {
      case 'upstreamed':
        return 'success';
      case 'outdated_dep':
        return 'warning';
      case 'flaky':
        return 'warning';
      default:
        return 'danger';
    }
  } else {
    return 'info';
  }
}
</script>

<template>
  <span>
    <el-popover v-if="typeof mark_inner === 'object'" width="400">
      <template #default>
        {{ mark_inner.comment }}
        <el-divider />
        {{ mark_inner.by }}
      </template>
      <template #reference>
        <span class="tag-text">
          <el-link
            v-if="extractUrlInString(mark_inner.comment)"
            :href="(extractUrlInString(mark_inner.comment) || ['/'])[0]"
            target="_blank"
          >
            <el-tag
              :type="markTagType(mark_inner)"
              :closable="false"
            >
              {{ mark_inner.name }}
            </el-tag>
          </el-link>
          <el-tag
            v-else
            :type="markTagType(mark_inner)"
            :closable="false"
          >
            {{ mark_inner.name }}
          </el-tag>
        </span>
      </template>
    </el-popover>
    <span v-else class="tag-text">
      <el-tag
        :key="mark_inner"
        :type="markTagType(mark_inner)"
        :closable="false"
      >
        {{ mark_inner }}
      </el-tag>
    </span>
  </span>
</template>

<style scoped>
.tag-text {
  user-select: none;
}
</style>