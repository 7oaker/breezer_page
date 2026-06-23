const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

// Load environment variables from a .env file
dotenv.config();

const INCLUDE_PATTERN = /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi;
const processNestedHtml = (content, loaderContext, dir = null) =>
  !INCLUDE_PATTERN.test(content)
    ? content
    : content.replace(INCLUDE_PATTERN, (m, src) => {
        const filePath = path.resolve(dir || loaderContext.context, src);
        loaderContext.dependency(filePath);
        return processNestedHtml(
          loaderContext.fs.readFileSync(filePath, 'utf8'),
          loaderContext,
          path.dirname(filePath)
        );
      });

// HTML generation (root pages + nested SEO pages under src/de/)
const paths = [];
const generateHTMLPlugins = () => {
  const htmlFiles = glob.sync('./src/**/*.html').filter((filePath) => {
    if (filePath.includes('/partials/') || filePath.includes('/invite/')) return false;
    const base = path.basename(filePath);
    // Template demo pages: keep out of production build (noindex is not enough alone).
    if (['blog-grid.html', 'blog-details.html', 'signin.html', 'signup.html'].includes(base)) {
      return false;
    }
    return true;
  });

  return htmlFiles.map((filePath) => {
    const relativePath = path.relative(path.join(__dirname, 'src'), filePath);
    const is404 = path.basename(filePath) === '404.html';

    if (!is404) {
      paths.push(relativePath);
    }

    return new HtmlWebpackPlugin({
      filename: relativePath,
      template: filePath,
      favicon: `./src/images/favicon.ico`,
      inject: 'body',
    });
  });
};

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/js/index.js',
  devServer: {
    static: {
      directory: path.join(__dirname, './build'),
    },
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          preprocessor: processNestedHtml,
        },
      },
      
    {
      test: /\.xml$/i, // Add this rule for .xml files
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]', // Keep the original filename
      },
    },
    {
      test: /\.txt$/i, // Add this rule for .txt files
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]', // Keep the original filename
      },
    },
    ],
  },
  plugins: [
    ...generateHTMLPlugins(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: 'style.css',
    }),
    // Use DefinePlugin to inject environment variables
    new webpack.DefinePlugin({
      'process.env.REACT_APP_WEBHOOK_URL': JSON.stringify(process.env.REACT_APP_WEBHOOK_URL),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/.well-known', to: '.well-known' },
        { from: 'src/invite', to: 'invite' },
        { from: 'src/.nojekyll', to: '.', noErrorOnMissing: true },
        { from: 'CNAME', to: '.', noErrorOnMissing: true },
      ],
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: 'auto',
    assetModuleFilename: 'images/[name][ext]',
  },
};
