const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    options: path.resolve('src/options/options.tsx'),
    background: path.resolve('src/background/background.ts'),
    Dysis: path.resolve('src/contentScript/Dysis.ts'),
    DysisAbstract: path.resolve('src/contentScript/DysisAbstract.ts'),
    DysisReddit: path.resolve('src/contentScript/DysisReddit.ts'),
    DysisRedditEnrichment: path.resolve('src/contentScript/DysisRedditEnrichment.ts'),
    DysisRequest: path.resolve('src/contentScript/DysisRequest.ts'),
    DysisUsage: path.resolve('src/contentScript/DysisUsage.ts'),
    DysisZeit: path.resolve('src/contentScript/DysisZeit.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg|css)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
        }
      ]
    }),
    ...getHtmlPlugins([
      'popup',
      'options'
    ]),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript' && chunk.name !== 'background'
      }
    },
  }
}

function getHtmlPlugins(chunks) {
  return chunks.map(chunk => new HtmlPlugin({
    title: 'Dysis',
    filename: `${chunk}.html`,
    chunks: [chunk],
  }))
}
