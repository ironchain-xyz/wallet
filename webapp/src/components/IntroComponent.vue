<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <h2>
      Bridge between Web2 and Web3.
    </h2>
  </div>
</template>

<script>
export default {
  name: 'IntroComponent',
  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1 {
  color: @heading-color;
}
h2 {
  color: @text-color;
}
</style>
