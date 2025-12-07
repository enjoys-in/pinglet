module.exports = {
  apps: [
    {
      name: "Pinglet API",
      script: "npm run start",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "512M",
      env_filepath: ".env",
      exec_mode: "cluster",
    },
    {
      name: "Pinglet Worker",
      script: "npm run worker",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "512M",
      env_filepath: ".env",
    },
    {
      name: "Pinglet Consumer",
      script: "npm run consumer",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "512M",
      env_filepath: ".env",
    },
  ],
};
