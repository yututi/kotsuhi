module.exports = {
  pwa: {
    name: '交通費精算',
    themeColor: '#2196f3',
    msTileColor: '#2196f3',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon96: 'img/icons/favicon-96x96.png',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-icon-152x152.png',
      msTileImage: 'img/icons/ms-icon-144x144.png'
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/sw.js"
    }
  }
}