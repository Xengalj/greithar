const config = {
  devServer: {
    port: 8081
  },
  configureWebpack: {
   resolve: {
     extensions: ['*', '.mjs', '.js', '.vue', '.json', '.gql', '.graphql']
   },
   module: {
     rules: [ 
       {
         test: /\.mjs$/,
         include: /node_modules/,
         type: 'javascript/auto'
       }
     ]
   }
 }
}

module.exports = config