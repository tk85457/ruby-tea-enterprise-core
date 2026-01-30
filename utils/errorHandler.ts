import { NextApiResponse } from 'next';

export const errorHandler = (res: NextApiResponse, error: Error | unknown) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
};
