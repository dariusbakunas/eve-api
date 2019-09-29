import Crypt from './crypt';

let crypt;
const SECRET = 'xJV^M&ivGDfpGOZ@Jdt3*s#Hk!$8h%H';

describe('Crypt tests', () => {
  beforeEach(() => {
    crypt = new Crypt(SECRET);
  });

  it('encrypts and decrypts without errors', () => {
    const testString = 'Hello World';
    const encrypted = crypt.encrypt(testString);
    const decrypted = crypt.decrypt(encrypted);

    expect(decrypted).toEqual(testString);
  });
});
