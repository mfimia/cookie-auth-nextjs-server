import bcrypt from "bcrypt";

export const hashPassword = (password: string) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });

export const comparePassword = (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);
