// ==========================================
// WEBFINDER AI - REDIS & BULLMQ CONFIGURATION
// ==========================================

import { Queue, Job, QueueEvents } from 'bullmq';
import type { ConnectionOptions } from 'bullmq';

// ==========================================
// REDIS CONFIGURATION
// ==========================================

// Redis connection options
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Connection options object (compatible with BullMQ)
export const redisConnection: ConnectionOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// ==========================================
// QUEUE DEFINITIONS
// ==========================================

// Queue names
export const QUEUE_NAMES = {
  EMAIL: 'email',
  DISCOVER: 'discover',
  DEPLOYMENT: 'deployment',
  NOTIFICATION: 'notification',
  REPORT: 'report',
  WEBHOOK: 'webhook',
  CLEANUP: 'cleanup',
} as const;

// Create queues
export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const discoverQueue = new Queue(QUEUE_NAMES.DISCOVER, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 50,
    removeOnFail: 20,
  },
});

export const deploymentQueue = new Queue(QUEUE_NAMES.DEPLOYMENT, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 30,
    removeOnFail: 10,
  },
});

export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 500,
    },
    removeOnComplete: 200,
    removeOnFail: 50,
  },
});

export const reportQueue = new Queue(QUEUE_NAMES.REPORT, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: 50,
    removeOnFail: 20,
  },
});

export const webhookQueue = new Queue(QUEUE_NAMES.WEBHOOK, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const cleanupQueue = new Queue(QUEUE_NAMES.CLEANUP, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: 10,
    removeOnFail: 5,
  },
});

// ==========================================
// QUEUE EVENTS
// ==========================================

export const emailQueueEvents = new QueueEvents(QUEUE_NAMES.EMAIL, { connection: redisConnection });
export const discoverQueueEvents = new QueueEvents(QUEUE_NAMES.DISCOVER, { connection: redisConnection });
export const deploymentQueueEvents = new QueueEvents(QUEUE_NAMES.DEPLOYMENT, { connection: redisConnection });
export const notificationQueueEvents = new QueueEvents(QUEUE_NAMES.NOTIFICATION, { connection: redisConnection });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Add job to email queue
 */
export async function queueEmail(data: {
  to: string;
  subject: string;
  template?: string;
  body?: string;
  variables?: Record<string, unknown>;
}): Promise<Job> {
  return emailQueue.add('send-email', data);
}

/**
 * Add bulk emails to queue
 */
export async function queueBulkEmails(
  emails: Array<{
    to: string;
    subject: string;
    template?: string;
    body?: string;
    variables?: Record<string, unknown>;
  }>
): Promise<Job[]> {
  const jobs = emails.map((email, index) => ({
    name: 'send-email',
    data: email,
    opts: {
      delay: index * 100,
    },
  }));

  return emailQueue.addBulk(jobs);
}

/**
 * Add discover search job
 */
export async function queueDiscoverSearch(data: {
  location: string;
  radius: number;
  category?: string;
  userId: string;
}): Promise<Job> {
  return discoverQueue.add('search-businesses', data);
}

/**
 * Add deployment job
 */
export async function queueDeployment(data: {
  workspaceId: string;
  projectId: string;
  domain: string;
  framework: string;
}): Promise<Job> {
  return deploymentQueue.add('deploy', data, {
    priority: 1,
  });
}

/**
 * Add notification job
 */
export async function queueNotification(data: {
  userId: string;
  type: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}): Promise<Job> {
  return notificationQueue.add('send-notification', data);
}

/**
 * Add report generation job
 */
export async function queueReportGeneration(data: {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  userId: string;
  dateRange?: { start: Date; end: Date };
}): Promise<Job> {
  return reportQueue.add('generate-report', data);
}

/**
 * Add webhook processing job
 */
export async function queueWebhook(data: {
  source: string;
  event: string;
  payload: Record<string, unknown>;
}): Promise<Job> {
  return webhookQueue.add('process-webhook', data);
}

/**
 * Schedule cleanup job
 */
export async function scheduleCleanup(data: {
  type: 'sessions' | 'tokens' | 'logs' | 'temp_files';
  olderThan: Date;
}): Promise<Job> {
  return cleanupQueue.add('cleanup', data);
}

// ==========================================
// QUEUE STATISTICS
// ==========================================

export async function getQueueStats(queueName: string): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const queue = new Queue(queueName, { connection: redisConnection });

  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return { waiting, active, completed, failed, delayed };
}

export async function getAllQueuesStats(): Promise<Record<string, Awaited<ReturnType<typeof getQueueStats>>>> {
  const stats: Record<string, Awaited<ReturnType<typeof getQueueStats>>> = {};

  for (const name of Object.values(QUEUE_NAMES)) {
    stats[name] = await getQueueStats(name);
  }

  return stats;
}
