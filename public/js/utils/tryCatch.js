// import ClientError from './ClientError';

import { dispMessage } from './dispMessage';

export const tryCatch = (fn) => {
  return async (arr) => {
    console.log(arr);
    try {
      const msg = await fn(...arr);

      dispMessage(msg);
    } catch (err) {
      err.addErrorMessage();
    }
  };
};
