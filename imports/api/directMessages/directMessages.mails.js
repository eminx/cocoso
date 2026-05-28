import mailtranslations from '../groups/mailtranslations';

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const getDirectMessageEmailBody = (senderUsername, currentHost, recipient, linkHost) => {
  const resolvedLinkHost = linkHost ?? currentHost;
  const linkHostDomain = resolvedLinkHost?.host ?? currentHost?.host;
  const linkHostName = escapeHtml(resolvedLinkHost?.settings?.name ?? linkHostDomain);
  const firstName = escapeHtml(recipient?.firstName || recipient?.username || '');
  const safeSenderUsername = escapeHtml(senderUsername);

  const lang = recipient?.lang || currentHost?.settings?.lang || 'en';
  const tr = mailtranslations[lang] ?? mailtranslations.en;
  const { visitPage: generalVisitPage } = tr.general;
  const dm = tr.directMessage ?? mailtranslations.en.directMessage;
  const { dear } = tr.general;

  const { body, bodyLong, bodyLongFederation, visitPage } = dm;

  const bodyLongHtml = currentHost?.isPortalHost && bodyLongFederation
    ? `${bodyLongFederation} <strong>${linkHostName}</strong>`
    : bodyLong;

  return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
    </style>
  </head>
  <body style="background:#f4f4f4;">
    <div style="max-width:520px; margin:40px auto; background:white; padding:32px 28px; font-family:Arial, sans-serif; border-radius:6px; margin-top:48px;">

      <div style="font-size:16px; color:#323232; margin-bottom:8px;">${dear} ${firstName},</div>

      <div style="font-size:16px; color:#323232; margin-bottom:8px;">${body} <strong>${safeSenderUsername}</strong>.</div>

      <div style="font-size:15px; color:#555555; margin-bottom:28px;">${bodyLongHtml}</div>

      <a href="https://${linkHostDomain}/admin/messages"
         style="display:inline-block; background:#414141; color:#ffffff; font-family:Arial, sans-serif;
                font-size:14px; line-height:120%; text-decoration:none;
                padding:11px 24px; border-radius:4px;" target="_blank">
        ${visitPage ?? generalVisitPage}
      </a>

    </div>
  </body>
</html>`;
};
