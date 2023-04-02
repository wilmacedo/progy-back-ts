import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ErrorType } from 'types';
import { prisma } from '../database/client';
import { Cryptograph } from '../utils/cryptograph';

interface RequestToken {
  user_id: number;
  expiration?: number;
}

interface InviteToken {
  email: string;
  institution_id: number;
  role_id: number;
  expiration: number;
  token: string;
}

export class EmailController {
  async verifyMail(request: Request, response: Response) {
    const { token } = request.query;
    if (!token) {
      response.status(400).json({ error: 'Invalid URL' });
      return;
    }

    const decryptedData = new Cryptograph().decrypted(token as string);
    if (!decryptedData) {
      response.status(400).json({ error: 'Invalid token' });
      return;
    }

    const { user_id }: RequestToken = JSON.parse(decryptedData);
    if (!user_id) {
      response.status(400).json({ error: 'Invalid token' });
      return;
    }

    const confirmedEmails = await prisma.confirmedEmail.findMany({
      where: { user_id },
    });
    if (confirmedEmails.length !== 1) {
      response.status(500).json({ error: 'More fields in database' });
      return;
    }

    const confirmedEmail = confirmedEmails[0];
    if (confirmedEmail.confirmed) {
      response.redirect('http://localhost:3000/login');
      return;
    }

    await prisma.confirmedEmail.update({
      where: { id: confirmedEmail.id },
      data: { confirmed: true },
    });

    response.redirect('http://localhost:3000/login');
  }

  async inviteRedirect(request: Request, response: Response) {
    const { token } = request.query;
    if (!token) {
      response.status(400).json({ error: 'Invalid URL' });
      return;
    }

    const decryptedData = new Cryptograph().decrypted(token as string);
    if (!decryptedData) {
      response.status(400).json({ error: 'Invalid token' });
      return;
    }

    const data: InviteToken = JSON.parse(decryptedData);
    if (!data) {
      response.status(400).json({ error: 'Invalid token' });
      return;
    }
    data.token = token as string;

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      response.redirect('http://localhost:3000/auth/login');
      return;
    }

    const clientToken = btoa(JSON.stringify(data));
    if (!clientToken || clientToken.length === 0) {
      response.status(500).json({ error: 'Failed to generate client token' });
      return;
    }

    response.redirect('http://localhost:3000/auth/invite?token=' + clientToken);
  }

  async createByInvite(request: Request, response: Response) {
    const fields = [
      'name',
      'password',
      'email',
      'institution_id',
      'role_id',
      'token',
    ];
    if (fields.filter(field => request.body[field] === undefined).length > 0) {
      response.user.error({ type: ErrorType.MISSING_FIELD });
      return;
    }

    const params = request.body;
    try {
      const cryptograph = new Cryptograph();
      if (!cryptograph.verify(params.token)) {
        response.user.error({ type: ErrorType.CORRUPTED_TOKEN });
        return;
      }
      delete params.token;

      const role = await prisma.role.findUnique({
        where: { id: params.role_id },
      });
      if (!role) {
        response.role.error({ type: ErrorType.NOT_FOUND });
        return;
      }

      const hasExist = await prisma.user.findUnique({
        where: { email: params.email },
      });
      if (hasExist) {
        response.user.error({ type: ErrorType.EMAIL_ALREADY_USED });
        return;
      }

      const encryptPassword = await bcrypt.hash(
        params.password,
        bcrypt.genSaltSync(10),
      );
      params.password = encryptPassword;

      const user = await prisma.user.create({
        data: params,
      });

      response.user.created(user);
    } catch (e) {
      response.user.error(e);
    }
  }
}
