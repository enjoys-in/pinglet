module.exports = {
  apps: [
    {
      name: "pinglet-api",
      script: "npm run start",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
    },
    {
      name: "pinglet-worker",
      script: "npm run worker",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: "pinglet-consumer",
      script: "npm run consumer",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}