import { app } from '@/app';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('Register role case (e2e)', () => {
  it('should be able to register a new role', async () => {
    const response = await request(app).post('/v2/roles').send({
      name: 'Admin',
    });

    expect(response.statusCode).toBe(201);
  });
});
