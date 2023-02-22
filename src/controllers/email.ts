import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { Cryptograph } from '../utils/cryptograph';

interface RequestToken {
  user_id: number;
  expiration?: number;
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
}
