<template lang="pug">
  .container.p-4
    h2.mb-2
      i.fas.fa-tags.fa-fw.mr-2
      | カテゴリー一覧
    table.table-fixed.w-full.border-t.border-b.border-grey
      thead
        tr
          th(class="w-2/6") カテゴリー名
          th(class="w-2/5") スラッグ
          th(class="w-1/5") 記事数
      tbody
        template(v-if="loading")
          tr
            td(colspan="3")
              .text-center
                | 読み込み中...
        template(v-else)
          tr(v-for="category in categories" :key="category.name")
            td(class="w-2/6")
              a(:href="`/archive/categories/${encodeURIComponent(category.name)}`" target="_blank")
                | {{category.name}}
            td(class="w-2/5") {{category.name}}
            td(class="w-1/5") {{category.count}}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";

@Component
export default class Categories extends Vue {
  @Action("categories/fetch")
  public fetch!: () => Promise<void>;

  @State((state, getters) => state.categories.loading)
  public loading!: boolean;

  @State((state, getters) => state.categories.rows)
  public categories!: any[];

  public async mounted(): Promise<void> {
    await this.fetch();
  }
}
</script>

<style lang="postcss" scoped>
table > thead > tr > th {
  @apply truncate;
  @apply pl-2 py-2;
  @apply text-left;
  @apply text-grey-darker bg-grey-lightest;
}

table > tbody > tr > td {
  @apply truncate;
  @apply px-2 py-4;
  @apply text-xs;
  @apply border-t border-grey-light;
}
</style>
