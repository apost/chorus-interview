module.exports = {
  apps: [
    {
      name: 'ui',
      script: 'pnpm pokemon-ui:serve',
      instance: 1,
      env: {
        NODE_ENV: 'development',
        NODE_OPTIONS: '--inspect=0.0.0.0:9229', // Use a specific port for the inspector
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--inspect=0.0.0.0:9230', // Use a different port for production
      },
    },
    {
      name: 'server',
      script: 'pnpm pokemon-user-backend:serve',
      instance: 1,
      env: {
        NODE_ENV: 'development',
        NODE_OPTIONS: '--inspect=0.0.0.0:9231', // Use a different port for the inspector
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--inspect=0.0.0.0:9232', // Use a different port for production
      },
    },
  ],
};
