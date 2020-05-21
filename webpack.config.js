const path = require('path');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

config = {
    mode: "development",
    target: "node",
    entry: {
      serverScript: path.resolve('./server.js'),
    },
    plugins: [
      new Dotenv()
    ],
    output: {
        path: __dirname+'/dist/',
        filename: "[name].js"
    },
    externals: [nodeExternals()],
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader',
            options: { inline: true, fallback: true }
          } 
        }
      ]
    }
}
if(process && process.env){
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      JWKSURI: JSON.stringify(process.env.JWKSURI),
      PORT: JSON.stringify(process.env.PORT),
      AUDIENCE: JSON.stringify(process.env.AUDIENCE),
      ISSUER: JSON.stringify(process.env.ISSUER),
      CONNECTIONSTRING: JSON.stringify(process.env.CONNECTIONSTRING),
      STATION_API_URL: JSON.stringify(process.env.STATION_API_URL),
      CLIENT_SECRET: JSON.stringify(process.env.CLIENT_SECRET),
      CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
      STATION_API_AUDIENCE: JSON.stringify(process.env.STATION_API_AUDIENCE)
    }
  }))
}
else {
  config.plugins.push(new Dotenv({
    path: path.resolve(__dirname, './.env')
  }))
}
module.exports = config;