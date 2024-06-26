import mailtranslations from './mailtranslations';

const getGroupRegistrationEmailBody = (Group, currentHost, currentUser, isLeave = false) => {
  const GroupId = Group._id,
    GroupTitle = Group.title,
    GroupBody = Group.description,
    GroupReadingMaterial = Group.readingMaterial,
    imageUrl = Group.imageUrl,
    firstName = currentUser.firstName || currentUser.username,
    hostName = currentHost.settings.name,
    host = currentHost.host,
    hostLogo = currentHost.logo,
    hostAddress = currentHost.settings.address;

  const lang = currentUser?.lang || currentHost?.settings?.lang || 'en';
  const tr = mailtranslations[lang];
  const { dear, visitPage } = tr.general;
  const {
    confirmedApprovalText,
    confirmedApprovalTextLong,
    confirmedApprovalTextLeave,
    confirmedApprovalTextLongLeave,
  } = tr.joinGroup;

  const confirmedApprovalBrief = isLeave ? confirmedApprovalTextLeave : confirmedApprovalText;
  const confirmedApprovalLong = isLeave
    ? confirmedApprovalTextLongLeave
    : confirmedApprovalTextLong;

  return `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <title>
        
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }
      </style>
      <!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]-->
      <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width:100% !important; }
      </style>
      <![endif]-->
      
        <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
  @import url(https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700);
          </style>
        <!--<![endif]-->
  
      
      
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .mj-column-per-50 { width:50% !important; max-width: 50%; }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .moz-text-html .mj-column-per-50 { width:50% !important; max-width: 50%; }
      </style>
      
    
      <style type="text/css">
      
      
  
      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    
      </style>
      <style type="text/css">
      
      </style>
      
    </head>
    <body style="word-spacing:normal;">
      
      
        <div
           style=""
        >
          
        
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:180px;">
                
        <img
           height="auto" src="${hostLogo}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="180"
        />
      
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:22px;font-weight:bold;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostName}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${dear} ${firstName}, <br /></b></div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${confirmedApprovalBrief}: <b>${GroupTitle}</b><br /></div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1.4;text-align:left;color:rgb(50, 50, 50);"
        >${confirmedApprovalLong}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
        >
          <tbody>
            <tr>
              <td
                 align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle"
              >
                <a
                   href="https://${host}/Groups/${GroupId}" style="display:inline-block;background:#414141;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
                >
                  ${visitPage}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
              
        <div
           class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:250px;">
                
        <img
           height="auto" src="${imageUrl}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250"
        />
      
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
              
        <div
           class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:20px;line-height:1;text-align:left;color:rgb(50, 50, 50);"
        ><b>${GroupTitle}</b></div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:18px;line-height:1;text-align:left;color:rgb(50, 50, 50);"
        >${GroupReadingMaterial}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1.4;text-align:left;color:rgb(50, 50, 50);"
        >${GroupBody}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
        >
          <tbody>
            <tr>
              <td
                 align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle"
              >
                <a
                   href="https://${host}/Groups/${GroupId}" style="display:inline-block;background:#414141;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
                >
                  ${visitPage}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:18px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostName}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:14px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostAddress}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><![endif]-->
      
      
        </div>
      
    </body>
  </html>
    `;
};

const getInviteToPrivateGroupEmailBody = (Group, currentHost, currentUser, person) => {
  const GroupId = Group._id,
    GroupTitle = Group.title,
    GroupBody = Group.description,
    GroupReadingMaterial = Group.readingMaterial,
    imageUrl = Group.imageUrl,
    firstName = person?.firstName,
    hostName = currentHost.settings.name,
    host = currentHost.host,
    hostLogo = currentHost.logo,
    hostAddress = currentHost.settings.address;

  const lang = currentUser?.lang || currentHost?.settings?.lang || 'en';
  const tr = mailtranslations[lang];

  const { dear, visitPage } = tr.general;
  const { confirmedApprovalText, confirmedApprovalTextLong } = tr.invitePrivateGroup;

  const confirmedApprovalBrief = confirmedApprovalText;
  const confirmedApprovalLong = confirmedApprovalTextLong;

  return `<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <title>
        
      </title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        #outlook a { padding:0; }
        body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
        table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
        img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
        p { display:block;margin:13px 0; }
      </style>
      <!--[if mso]>
      <noscript>
      <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
      </xml>
      </noscript>
      <![endif]-->
      <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width:100% !important; }
      </style>
      <![endif]-->
      
        <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700" rel="stylesheet" type="text/css">
          <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
  @import url(https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700);
          </style>
        <!--<![endif]-->
  
      
      
      <style type="text/css">
        @media only screen and (min-width:480px) {
          .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .mj-column-per-50 { width:50% !important; max-width: 50%; }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
  .moz-text-html .mj-column-per-50 { width:50% !important; max-width: 50%; }
      </style>
      
    
      <style type="text/css">
      
      
  
      @media only screen and (max-width:480px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    
      </style>
      <style type="text/css">
      
      </style>
      
    </head>
    <body style="word-spacing:normal;">
      
      
        <div
           style=""
        >
          
        
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:180px;">
                
        <img
           height="auto" src="${hostLogo}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="180"
        />
      
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:22px;font-weight:bold;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostName}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${dear} ${firstName}, <br /></b></div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${confirmedApprovalBrief}: <b>${GroupTitle}</b><br /></div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1.4;text-align:left;color:rgb(50, 50, 50);"
        >${confirmedApprovalLong}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
        >
          <tbody>
            <tr>
              <td
                 align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle"
              >
                <a
                   href="https://${host}/Groups/${GroupId}" style="display:inline-block;background:#414141;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
                >
                  ${visitPage}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
              
        <div
           class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
        >
          <tbody>
            <tr>
              <td  style="width:250px;">
                
        <img
           height="auto" src="${imageUrl}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="250"
        />
      
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td><td class="" style="vertical-align:top;width:300px;" ><![endif]-->
              
        <div
           class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:20px;line-height:1;text-align:left;color:rgb(50, 50, 50);"
        ><b>${GroupTitle}</b></div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:18px;line-height:1;text-align:left;color:rgb(50, 50, 50);"
        >${GroupReadingMaterial}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:16px;line-height:1.4;text-align:left;color:rgb(50, 50, 50);"
        >${GroupBody}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
        >
          <tbody>
            <tr>
              <td
                 align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle"
              >
                <a
                   href="https://${host}/Groups/${GroupId}" style="display:inline-block;background:#414141;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
                >
                  ${visitPage}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="white" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      
        
        <div  style="background:white;background-color:white;margin:0px auto;max-width:600px;">
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:white;background-color:white;width:100%;"
          >
            <tbody>
              <tr>
                <td
                   style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                >
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              
        <div
           class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
        >
          
        <table
           border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
        >
          <tbody>
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:18px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostName}</div>
      
                  </td>
                </tr>
              
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
        <div
           style="font-family:Sarabun, Arial;font-size:14px;line-height:1;text-align:center;color:rgb(50, 50, 50);"
        >${hostAddress}</div>
      
                  </td>
                </tr>
              
          </tbody>
        </table>
      
        </div>
      
            <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      
        
        <!--[if mso | IE]></td></tr></table><![endif]-->
      
      
        </div>
      
    </body>
  </html>
    `;
};

export { getGroupRegistrationEmailBody, getInviteToPrivateGroupEmailBody };
