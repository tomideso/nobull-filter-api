const DOMAIN = 'mailer.ddxlive.com';
const mailgun = require('mailgun-js');


export const sendMail = ({ subject, recipient, body }): Promise<MailGun> => {
    const API_KEY = process.env.MAILGUN_API_KEY;
    const mailClient = mailgun({ apiKey: API_KEY, domain: DOMAIN });

    const data = {
        from: `OnTheMend <noreply@${DOMAIN}>`,
        to: recipient,
        subject,
        html: body
    };

    if (!subject || !recipient || !body) {
        throw 'Subject, recipient and body expected.'
    }

    return new Promise((resolve, reject) => {
        mailClient.messages().send(data, (error, body) => {

            if (error) return reject(error);

            return resolve(body);
        })
    })
}

type MailGun = {
    id: string,
    message: string
};