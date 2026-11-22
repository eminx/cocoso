export default {
  en: {
    verifyEmail: {
      subject: (platformName) => `Verify your email at ${platformName}`,
      html: (url, username) =>
        `<p>Hello ${username},</p><br/><p>To verify your account email, simply click the link below.</p><br /><p><a href="${url}">${url}</a></p><br /><p>Thank you.</p>`,
    },
    resetPassword: {
      subject: (platformName) =>
        `How to reset your password on ${platformName}`,
      html: (url, username) =>
        `<p>Hello ${username},</p><br/><p>To reset your password, simply click the link below.</p><br /><p><a href="${url}">${url}</a></p>`,
    },
  },
  sv: {
    verifyEmail: {
      subject: (platformName) => `Verifiera din e-post på ${platformName}`,
      html: (url, username) =>
        `<p>Hej ${username},</p><br/><p>För att verifiera din kontos e-postadress, klicka på länken nedan.</p><br /><p><a href="${url}">${url}</a></p><br /><p>Tack.</p>`,
    },
    resetPassword: {
      subject: (platformName) =>
        `Så här återställer du ditt lösenord på ${platformName}`,
      html: (url, username) =>
        `<p>Hej ${username},</p><br/><p>För att återställa ditt lösenord, klicka på länken nedan.</p><br /><p><a href="${url}">${url}</a></p>`,
    },
  },
  tr: {
    verifyEmail: {
      subject: (platformName) => `${platformName} E-postanı Doğrula`,
      html: (url, username) =>
        `<p>Merhaba ${username},</p><br/><p>Hesabının e-postasını doğrulamak için aşağıdaki bağlantıya tıklaman yeterli:</p><br /><p><a href="${url}">${url}</a></p><br /><p>Teşekkürler.</p>`,
    },
    resetPassword: {
      subject: (platformName) => `${platformName} Şifreni Yenile`,
      html: (url, username) =>
        `<p>Merhaba ${username},</p><br/><p>Şifreni yenilemek için aşağıdaki bağlantıya tıklayabilirsin:</p><br /><p><a href="${url}">${url}</a></p>`,
    },
  },
};
