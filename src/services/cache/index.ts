import Redis from 'ioredis';
import logger from '../../utils/logger';
import * as IORedis from 'ioredis';

class Cache {
  private client: IORedis.Redis;
  constructor(url, password) {
    logger.info(`Connecting to redis: ${url}`);
    this.client = new Redis({
      host: '127.0.0.1',
      family: 4,
      password,
    });

    this.client.on('error', err => {
      logger.error(`Redis error: ${err.message}`);

      if (err.code === 'ECONNREFUSED') {
        process.exit(1);
      }
    });

    this.client.on('connect', () => {
      logger.info('Connected to redis');
    });
  }

  async set(key: string, value: string) {
    return this.client.set(key, value);
  }

  async setMulti(values: { [key: string]: string }) {
    const pipeline = this.client.multi();

    Object.keys(values).forEach((key) => {
      pipeline.set(key, values[key]);
    });

    return pipeline.exec();
  }
  async get(key: string): Promise<string> {
    return this.client.get(key);
  }
}

export default Cache;
