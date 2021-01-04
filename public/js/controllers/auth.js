import Axios from 'axios';
import ClientError from '../utils/ClientError';
import { tryCatch } from '../utils/tryCatch';

export const loginFunc = tryCatch(async (email, password) => {
  const response = await new Axios({
    method: 'POST',
    url: `http://127.0.0.1:3000/api/v0/users/login`,
    data: {
      email,
      password,
    },
  });

  console.log(response);

  if (response.data.status === 'fail')
    throw new ClientError(response.data.status);

  return response.data.status;
});

export const signinFunc = tryCatch(
  async (name, email, password, confirmPassword) => {
    const response = await new Axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v0/users/signup`,
      withCredentials: true,
      data: {
        email,
        password,
        confirmPassword,
        name,
      },
    });

    console.log(response);

    if (response.data.status === 'fail')
      throw new ClientError(response.data.error.message);

    return response.data.status;
  }
);
