<template lang="pug">
  blog-parts(title="管理コンソール")
    a(href="/admin/")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

import BlogParts from "components/presentationals/BlogParts.vue";

@Component({
  components: {
    BlogParts
  }
})
export default class extends Vue {}
</script>
