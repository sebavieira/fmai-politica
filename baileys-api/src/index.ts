import app from "@/app";
import baileys from "@/baileys";
import config from "@/config";
import { errorToString } from "@/helpers/errorToString";
import logger, { deepSanitizeObject } from "@/lib/logger";
import redis, { initializeRedis } from "@/lib/redis";
import { MediaCleanupService } from "@/services/mediaCleanup";
import { REDIS_KEY_PREFIX } from "@/middlewares/auth";

process.on("uncaughtException", (error) => {
  logger.error(
    "[UNCAUGHT EXCEPTION] An uncaught exception occurred: %s",
    errorToString(error),
  );
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    "[UNHANDLED_REJECTION] An unhandled promise rejection occurred at: %o, reason: %s",
    promise,
    errorToString(reason as Error),
  );
});

const mediaCleanup = new MediaCleanupService({
  maxAgeHours: config.media.maxAgeHours,
  intervalMs: config.media.cleanupIntervalMs,
});

async function ensureApiKey(role: "user" | "admin", apiKey: string | null) {
  if (!apiKey) {
    return;
  }

  const redisKey = `${REDIS_KEY_PREFIX}:${apiKey}`;
  const exists = await redis.exists(redisKey);

  if (exists) {
    return;
  }

  await redis.set(redisKey, JSON.stringify({ role }));
  logger.info(
    "Created default %s API key from environment variable",
    role,
  );
}

async function ensureDefaultApiKeys() {
  await ensureApiKey("user", config.auth.defaultUserApiKey);
  await ensureApiKey("admin", config.auth.defaultAdminApiKey);
}

async function start() {
  await initializeRedis();
  await ensureDefaultApiKeys();

  app.listen(config.port, () => {
    logger.info(
      `${config.packageInfo.name}@${config.packageInfo.version} running on ${app.server?.hostname}:${app.server?.port}`,
    );
    logger.info(
      "Loaded config %s",
      JSON.stringify(
        deepSanitizeObject(config, { omitKeys: ["password"] }),
        null,
        2,
      ),
    );

    if (config.media.cleanupEnabled) {
      mediaCleanup.start();
    }
  });

  void baileys.reconnectFromAuthStore().catch((error) => {
    logger.error(
      "Failed to reconnect from auth store: %s",
      errorToString(error),
    );
  });
}

start().catch((error) => {
  logger.error("Failed to start application: %s", errorToString(error));
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  mediaCleanup.stop();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
