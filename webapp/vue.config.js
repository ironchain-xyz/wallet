const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#7a04eb',
            'link-color': '#7a04eb',
            'success-color': '#1afe49',
            'warning-color': '#ff00a0',
            'error-color': '#ff124f',
            'heading-color': '#7a04eb',
            'text-color': '#120458',
            'text-color-secondary': '#222035',
            'disabled-color': '#575267',
            'border-color-base': '#fe75fe',
            'font-size-base': '14px',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  }
})
