import crypto from 'crypto';

export class Cryptograph {
  algorithm: string;
  key: Buffer;
  iv: Buffer;

  constructor() {
    this.algorithm = 'aes-192-cbc';
    this.key = crypto.scryptSync(process.env.JWT_SECRET, 'PROGY', 24);
    this.iv = Buffer.alloc(16, 0);
  }

  encrypt(data: string | object): string | undefined {
    if (!data) {
      return;
    }

    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    if (data.length === 0) {
      return;
    }

    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

      return encrypted.toString('hex');
    } catch (e) {
      return;
    }
  }

  decrypted(data: string): string | undefined {
    if (typeof data !== 'string') {
      return;
    }

    try {
      const dataBuffer = Buffer.from(data, 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        this.iv,
      );
      const decrypted = Buffer.concat([
        decipher.update(dataBuffer),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (e) {
      return;
    }
  }
}
