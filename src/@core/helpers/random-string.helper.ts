export const randomString = (length = 10) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const result = [];
  const charactersLength = chars.length;
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');
};
