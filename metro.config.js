// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')

module.exports = (() => {
  const config = getDefaultConfig(__dirname)

  // Adicione configurações personalizadas aqui se necessário

  return config
})()
