/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'antd', 
    '@ant-design/icons', 
    'rc-util', 
    'rc-pagination', 
    'rc-picker', 
    '@ant-design/icons-svg',
    'rc-input',
    'rc-field-form',
    'rc-motion',
    'rc-upload',
    'rc-select',
    'rc-tree',
    'rc-table',
    'rc-menu',
    'rc-dropdown',
    'rc-tooltip',
    'rc-notification',
    'rc-message',
    'rc-progress',
    'rc-slider',
    'rc-switch',
    'rc-checkbox',
    'rc-radio',
    'rc-calendar',
    'rc-date-picker',
    'rc-time-picker',
    'rc-cascader',
    'rc-mentions',
    'rc-rate',
    'rc-steps',
    'rc-tabs',
    'rc-collapse',
    'rc-drawer',
    'rc-modal',
    'rc-popover',
    'rc-popconfirm',
    'rc-trigger',
    'rc-align',
    'rc-resize-observer',
    'rc-util',
    'rc-virtual-list',
    'rc-window-scroll',
    'rc-motion',
    'rc-animate',
    'rc-trigger',
    'rc-align',
    'rc-resize-observer',
    'rc-util',
    'rc-virtual-list',
    'rc-window-scroll',
    'rc-motion',
    'rc-animate'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx']
    };
    
    // Fix for ES modules in node_modules
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    });
    
    return config;
  },
};

export default nextConfig;
