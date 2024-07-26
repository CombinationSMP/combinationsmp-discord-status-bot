interface Status {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: [];
  };
  description: string;
  /**
   * `data:image/png;base64,...`
   */
  favicon?: string;
}

interface Status1516 {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
  };
  description: string;
}

interface Status13 {
  players: {
    max: number;
    online: number;
  };
  description: string;
}

declare module "minecraft-status" {
  export class MinecraftServerListPing {
    static ping: (protocol: number | undefined, host: string, port?: number, timeout?: number) => Promise<Status>;

    static ping16: (protocol: number | undefined, host: string, port?: number, timeout?: number) => Promise<Status1516>;

    static ping15: (host: string, port?: number, timeout?: number) => Promise<Status1516>;

    static ping13: (host: string, port?: number, timeout?: number) => Promise<Status13>;
  }
}
