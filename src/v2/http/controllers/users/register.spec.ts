import { app } from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('Register user case (e2e)', () => {
  it('should be able to register a new user', async () => {
    const response = await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      email: 'wil.macedo.sa@gmail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
  });

  it('should be not able to register a same email', async () => {
    const email = 'wil.macedo.sa@gmail.com';

    await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      email,
      password: '123456',
    });

    const response = await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      email,
      password: '123456',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('E-mail already exists');
  });

  it('should be not able to register without name', async () => {
    const response = await request(app).post('/v2/users').send({
      email: 'wil.macedo.sa@gmail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should be not able to register without email', async () => {
    const response = await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });

  it('should be not able to register without password', async () => {
    const response = await request(app).post('/v2/users').send({
      name: 'Wil Macedo',
      email: 'wil.macedo.sa@gmail.com',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });
});
