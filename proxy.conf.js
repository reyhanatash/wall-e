module.exports = {
  '/walle/**': {
    target: 'http://localhost:5678',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',  
    rewrite: (path) => path.replace(/^\/walle/, '/webhook-test/walle')
  }
};