<template>
  <router-view :key="$route.name" />
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @primary-color;
  height: 100%;
  display: flex;
  justify-content: center;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: @text-color;
}

nav a.router-link-exact-active {
  color: @link-color;
}

.login {
  display: flex;
  justify-content: center;
  margin-top: 200px;
}

.home {
  height: 100%;
  width: 100%;
}

.border {
    border-style: solid;
    border-radius: 10px;
    border-color: #edebeb;
    padding: 15px;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>
