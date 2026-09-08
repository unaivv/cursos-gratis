module.exports = {
  apps: [
    {
      name: "cursos-unaividal",
      script: "./start-prod.sh",
      interpreter: "bash",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      autorestart: true,
      max_memory_restart: "300M",
    },
  ],
};
