module.exports = {
  // presets: ["@vue/cli-plugin-babel/preset"],

  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    ["import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }] // `style: true` 会加载 less 文件
  ]
};