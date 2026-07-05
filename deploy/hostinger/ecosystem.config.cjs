module.exports = {
  apps: [
    {
      name: 'saarwood-teleprompter',
      cwd: '/srv/saarwood_telepromter',
      script: 'packages/backend/dist/server.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_file: '/srv/saarwood_telepromter/.env.production',
      env: {
        NODE_ENV: 'production',
      },
      out_file: '/var/log/saarwood-teleprompter/out.log',
      error_file: '/var/log/saarwood-teleprompter/error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
