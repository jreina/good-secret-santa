import { EmailClient } from '@azure/communication-email';
import { ParticipantWithReceiver } from '../../client/src/lib/interfaces/recipient';

export class EmailRA {
  emailClient: EmailClient;
  constructor() {
    const connectionString =
      process.env.COMMUNICATION_SERVICES_CONNECTION_STRING || '';
    this.emailClient = new EmailClient(connectionString);
  }
  public async sendEmail(
    participant: ParticipantWithReceiver
  ): Promise<boolean> {
    const message = {
      senderAddress: process.env.FROMADDRESS || '',
      content: {
        subject: 'Secret Santa',
        plainText: `Hey ${participant.name}, you are the secret santa for ${participant.receiver.name}. Their email is ${participant.receiver.email} if you need to look em up.
        Give em something good, or don't, I'm a robot not a cop.`,
      },
      recipients: {
        to: [
          {
            address: participant.email,
            displayName: participant.name,
          },
        ],
      },
    };

    const poller = await this.emailClient.beginSend(message);
    const response = await poller.pollUntilDone();
    return response.error ? false : true;
  }
}
