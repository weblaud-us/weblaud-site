const fs = require("fs");
const path = require("path");

/**
 * Reads .env and hands it to PM2 as the app's environment.
 *
 * This exists because NOTHING loads .env at runtime: there is no dotenv
 * dependency and react-router-serve does not read .env files. Before this,
 * the only thing that delivered SESSION_SECRET to the server was deploy.sh
 * exporting it into its own shell before `pm2 startOrReload`.
 *
 * That made every path other than a full deploy silently broken. `pm2 restart
 * --update-env` copies the CURRENT SHELL's environment, not this file, so
 * editing .env and restarting by hand looks like it should work and does
 * nothing — the app crash-loops on "SESSION_SECRET environment variable must
 * be set" with a correct .env sitting right there. Same for a bare
 * `pm2 start ecosystem.config.js`, or PM2 resurrecting after a reboot.
 *
 * Reading the file here means the config itself is the delivery mechanism, so
 * every one of those paths works and .env is the single source of truth.
 *
 * Resolved against __dirname, not cwd, so it works no matter where pm2 is
 * invoked from.
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");

  let contents;
  try {
    contents = fs.readFileSync(envPath, "utf8");
  } catch (err) {
    // A missing .env is left to deploy.sh, which fails loudly with a usable
    // message. Throwing here would break `pm2 list` for every other app on
    // the box, since PM2 evaluates this file on unrelated commands too.
    if (err.code === "ENOENT" || err.code === "EACCES") return {};
    throw err;
  }

  const env = {};

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Split on the FIRST "=" only: base64 secrets and URLs contain more.
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;

    let value = trimmed.slice(eq + 1).trim();
    // Strip one matched pair of surrounding quotes, mirroring `set -a; . .env`.
    if (value.length >= 2 && /^(".*"|'.*')$/s.test(value)) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

module.exports = {
  apps: [
    {
      name: "weblaud-site",
      script: "npm",
      args: "start",
      cwd: "/var/www/weblaud-site",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Restart storm guard. Without this a boot-time throw (a missing
      // SESSION_SECRET being exactly that) retries forever and buries the
      // original error under thousands of identical stack traces.
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 2000,
      env: {
        // Defaults, so a partial .env still boots. Anything in .env wins.
        NODE_ENV: "production",
        PORT: 3000,
        ...loadEnvFile(),
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
