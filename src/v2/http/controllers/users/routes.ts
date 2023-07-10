import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/users', (_, res) => {
  res.sendStatus(201);
});
