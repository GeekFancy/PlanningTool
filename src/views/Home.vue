<template>
  <div class="home">
    <Information />
  </div>
</template>

<script>
// @ is an alias to /src
import Information from '@/components/information.vue'

export default {
  name: 'Home',
  components: {
    Information
  }
}
</script>
