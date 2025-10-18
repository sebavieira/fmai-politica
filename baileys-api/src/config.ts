import type { LevelWithSilentOrString } from "pino";
import packageInfo from "@/../package.json";

const {
  NODE_ENV,
  PORT,
  LOG_LEVEL,
  BAILEYS_LOG_LEVEL,
  BAILEYS_CLIENT_VERSION,
  BAILEYS_OVERRIDE_CLIENT_VERSION,
  BAILEYS_PROVIDER_DEFAULT_API_KEY,
  BAILEYS_PROVIDER_DEFAULT_ADMIN_API_KEY,
  REDIS_URL,
  REDIS_PASSWORD,
  WEBHOOK_RETRY_POLICY_MAX_RETRIES,
  WEBHOOK_RETRY_POLICY_RETRY_INTERVAL,
  WEBHOOK_RETRY_POLICY_BACKOFF_FACTOR,
  CORS_ORIGIN,
  KEY_STORE_LRU_CACHE_MAX,
  KEY_STORE_LRU_CACHE_TTL,
  IGNORE_GROUP_MESSAGES,
  IGNORE_STATUS_MESSAGES,
  IGNORE_BROADCAST_MESSAGES,
  IGNORE_NEWSLETTER_MESSAGES,
  IGNORE_BOT_MESSAGES,
  IGNORE_META_AI_MESSAGES,
  MEDIA_CLEANUP_ENABLED,
  MEDIA_CLEANUP_INTERVAL_MS,
  MEDIA_MAX_AGE_HOURS,
} = process.env;

const config = {
  packageInfo: {
    name: packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    repository: packageInfo.repository,
  },
  port: PORT ? Number(PORT) : 3025,
  env: (NODE_ENV || "development") as "development" | "production",
  logLevel: (LOG_LEVEL || "info") as LevelWithSilentOrString,
  baileys: {
    logLevel: (BAILEYS_LOG_LEVEL || "warn") as LevelWithSilentOrString,
    clientVersion: BAILEYS_CLIENT_VERSION || "default",
    overrideClientVersion: BAILEYS_OVERRIDE_CLIENT_VERSION === "true",
    // FIXME: We ignore any non-user messages for now. As we implement more features,
    // we can enable them as needed.
    ignoreGroupMessages: IGNORE_GROUP_MESSAGES
      ? IGNORE_GROUP_MESSAGES === "true"
      : true,
    ignoreStatusMessages: IGNORE_STATUS_MESSAGES
      ? IGNORE_STATUS_MESSAGES === "true"
      : true,
    ignoreBroadcastMessages: IGNORE_BROADCAST_MESSAGES
      ? IGNORE_BROADCAST_MESSAGES === "true"
      : true,
    ignoreNewsletterMessages: IGNORE_NEWSLETTER_MESSAGES
      ? IGNORE_NEWSLETTER_MESSAGES === "true"
      : true,
    ignoreBotMessages: IGNORE_BOT_MESSAGES
      ? IGNORE_BOT_MESSAGES === "true"
      : true,
    ignoreMetaAiMessages: IGNORE_META_AI_MESSAGES
      ? IGNORE_META_AI_MESSAGES === "true"
      : true,
  },
  redis: {
    url: REDIS_URL || "redis://localhost:6379",
    password: REDIS_PASSWORD || "",
  },
  auth: {
    defaultUserApiKey: BAILEYS_PROVIDER_DEFAULT_API_KEY || null,
    defaultAdminApiKey: BAILEYS_PROVIDER_DEFAULT_ADMIN_API_KEY || null,
  },
  webhook: {
    retryPolicy: {
      maxRetries: WEBHOOK_RETRY_POLICY_MAX_RETRIES
        ? Number(WEBHOOK_RETRY_POLICY_MAX_RETRIES)
        : 3,
      retryInterval: WEBHOOK_RETRY_POLICY_RETRY_INTERVAL
        ? Number(WEBHOOK_RETRY_POLICY_RETRY_INTERVAL)
        : 5000,
      backoffFactor: WEBHOOK_RETRY_POLICY_BACKOFF_FACTOR
        ? Number(WEBHOOK_RETRY_POLICY_BACKOFF_FACTOR)
        : 3,
    },
  },
  corsOrigin: CORS_ORIGIN || "localhost",
  keyStore: {
    lruCacheMax: KEY_STORE_LRU_CACHE_MAX
      ? Number(KEY_STORE_LRU_CACHE_MAX) || 100
      : 100,
    lruCacheTtl: KEY_STORE_LRU_CACHE_TTL
      ? Number(KEY_STORE_LRU_CACHE_TTL) || 1000 * 60 * 10
      : 1000 * 60 * 10, // 10 minutes
  },
  media: {
    cleanupEnabled: MEDIA_CLEANUP_ENABLED === "true",
    cleanupIntervalMs: Number(MEDIA_CLEANUP_INTERVAL_MS) || 60 * 60 * 1000, // 1 hour
    maxAgeHours: Number(MEDIA_MAX_AGE_HOURS) || 24, // 24 hours
  },
};

export default config;
