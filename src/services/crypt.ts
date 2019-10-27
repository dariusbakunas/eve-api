import crypto from 'crypto';

const IV_LENGTH = 16;

class Crypt {
  private readonly secret: string;
  private readonly algorithm: string;

  constructor(secret: string, algorithm = 'aes-256-ctr') {
    this.secret = crypto
      .createHash('sha256')
      .update(secret)
      .digest('base64')
      .substr(0, 32);
    this.algorithm = algorithm;
  }

  encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secret), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(text: string) {
    const textParts: string[] = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secret), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export default Crypt;
