import { BasicCache } from "./BasicCache";
import { compress, decompress } from "./utils/compress";

/**
 * In-memory cache, basically for testing
 */
export class MemoryCache extends BasicCache {
  private data: Record<string, [number, Buffer]> = {};

  public async exists(key: string) {
    return (await this.get(key)) !== undefined;
  }

  public async get(key: string) {
    const d = this.data[key];
    if (d) {
      if (d[0] >= Date.now()) {
        return JSON.parse(await decompress(d[1]));
      }
      delete this.data[key];
    }
    return undefined;
  }

  public async set(key: string, value: any, ttl: number) {
    this.data[key] = [
      ttl === Infinity ? Infinity : Date.now() + ttl,
      await compress(JSON.stringify(value)),
    ];
  }

  public async delete(key: string) {
    delete this.data[key];
  }

  public async deleteAll() {
    this.data = {};
  }
}
