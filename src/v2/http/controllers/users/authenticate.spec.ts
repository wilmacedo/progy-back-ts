import { beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import request from 'supertest';

describe('Authenticate user case (e2e)', () => {
  beforeAll(async () => {
    await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      email: 'wil.macedo.sa@gmail.com',
      password: '123456',
    });
  });

  it('should be able to authenticate a user', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      email: 'wil.macedo.sa@gmail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should be not able to authenticate with wrong email', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      email: 'wil@gmail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should be not able to authenticate with wrong password', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      email: 'wil.macedo.sa@gmail.com',
      password: '1234567',
    });

    expect(response.statusCode).toBe(401);
  });

  it('should be not able to authenticate without email', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should be not able to authenticate without password', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      email: 'wil.macedo.sa@gmail.com',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should be not able to authenticate with password less then 6 characters', async () => {
    const response = await request(app).post('/v2/users/sessions').send({
      email: 'wil.macedo.sa@gmail.com',
      password: '12345',
    });

    expect(response.statusCode).toBe(400);
  });
});
