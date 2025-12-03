const { Resend } = require('resend')

const resend = new Resend('re_HsQgJnix_Q72JcrCFPaBEG64uHZewjcof')

resend.emails
  .send({
    from: 'onboarding@resend.dev',
    to: 'ismaelsilva@icloud.com', // ← Changed to your verified email
    subject: 'Test Email from Resend',
    html: '<h1>It works!</h1><p>If you receive this, Resend is configured correctly.</p>',
  })
  .then((result) => console.log('✅ Email sent:', result))
  .catch((error) => console.error('❌ Error:', error))
