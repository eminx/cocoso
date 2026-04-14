export default {
  en: {
    general: {
      address: 'Address',
      attendee: 'Attendee',
      attendees: 'Attendees',
      dateAndTime: 'Date & Time',
      dear: 'Dear',
      person: 'person',
      people: 'people',
      title: 'Title',
    },
    activityRegister: {
      activityPage: 'Visit the page',
      confirmedApprovalText: 'Your registration is confirmed',
      confirmedApprovalTextUpdate:
        'The update to your registration is confirmed',
      confirmedApprovalTextLong:
        'May you prefer to make changes to your registration or cancel it; please go to the activity page, open the date you signed up for, and then click the "Change/cancel existing registration" link. Then follow the instructions there to update your details or entirely cancel your registration for this event.',
      visitPage: 'Visit the page',
    },
    activityUnregister: {
      activityPage: 'Visit the page',
      confirmedApprovalText: 'Your registration is removed',
      confirmedApprovalTextLong:
        'If you want to register again, you can do so at the activity page',
      visitPage: 'Visit the page',
    },
    newGroupMessage: {
      subject: (groupTitle) => `New message in ${groupTitle}`,
      text: (groupTitle, host, groupId) =>
        `You have a new message in the ${groupTitle} group discussion. <br />
        Go to the group page <a href="https://${host}/groups/${groupId}">${groupTitle}</a> to see the message and join the conversation.
        <br /><br />
        <a href="https://${host}/groups/${groupId}">https://${host}/groups/${groupId}</a>`,
    },
  },
  sv: {
    general: {
      address: 'Adress',
      attendee: 'Deltagare',
      attendees: 'Deltagare',
      dateAndTime: 'Datum & tid',
      dear: 'Hej',
      person: 'person',
      people: 'personer',
      title: 'Titel',
    },
    activityRegister: {
      activityPage: 'Besök sidan',
      confirmedApprovalText: 'Din registrering är bekräftad',
      confirmedApprovalTextUpdate:
        'Uppdateringen av din registrering är bekräftad',
      confirmedApprovalTextLong:
        'Om du vill göra ändringar i din registrering eller avbryta den; vänligen gå till arrangemangets sida, öppna datumet du registrerade dig till och klicka sedan på länken "Ändra/avbryt befintlig registrering". Följ sedan instruktionerna för att uppdatera dina uppgifter eller radera din registrering för detta arrangemang.',
      visitPage: 'Besök sidan',
    },
    activityUnregister: {
      activityPage: 'Besök sidan',
      confirmedApprovalText: 'Din registrering tas bort',
      confirmedApprovalTextLong:
        'Om du vill OSA igen kan du göra det på arrangemangets sida',
      visitPage: 'Besök sidan',
    },
    newGroupMessage: {
      subject: (groupTitle) => `Ny meddelande i ${groupTitle}`,
      text: (groupTitle, host, groupId) =>
        `Du har ett nytt meddelande i ${groupTitle} gruppdiskussionen. <br />
        Gå till gruppsidan <a href="https://${host}/groups/${groupId}">${groupTitle}</a> för att se meddelandet och gå med i diskussionen.
        <br /><br />
        <a href="https://${host}/groups/${groupId}">https://${host}/groups/${groupId}</a>`,
    },
  },
  tr: {
    general: {
      address: 'Adres',
      attendee: 'Katılımcı',
      attendees: 'Katılımcı',
      dateAndTime: 'Tarih',
      dear: 'Merhaba',
      person: 'insan',
      people: 'insan',
      title: 'Başlık',
    },
    activityRegister: {
      activityPage: 'Sayfayı ziyaret et',
      confirmedApprovalText: 'Kaydın onaylandı',
      confirmedApprovalTextUpdate: 'Kaydına yaptığın güncelleme onaylandı',
      confirmedApprovalTextLong:
        'Kaydında değişiklik yapmak veya iptal etmek istersen; etkinlik sayfasına gidip, kaydolduğun tarihi seç ve ardından "Varolan kaydı güncelle ya da iptal et" bağlantısına tıkla. Ardından, bilgilerini güncellemek veya bu etkinliğe olan kaydını tamamen iptal etmek için oradaki talimatları izle.',
      visitPage: 'Sayfayı ziyaret et',
    },
    activityUnregister: {
      activityPage: 'Sayfayı ziyaret et',
      confirmedApprovalText: 'Kaydın silindi',
      confirmedApprovalTextLong:
        'Tekrar kayıt yapmak istersen, etkinlik sayfasından yapabilirsin',
      visitPage: 'Sayfayı ziyaret et',
    },
    newGroupMessage: {
      subject: (groupTitle) => `${groupTitle} grubunda yeni mesaj`,
      text: (groupTitle, host, groupId) =>
        `${groupTitle} grubunda yeni bir mesaj var. <br />
        Mesajı görmek ve tartışmaya katılmak için <a href="https://${host}/groups/${groupId}">${groupTitle}</a> sayfasına git.
        <br /><br />
        <a href="https://${host}/groups/${groupId}">https://${host}/groups/${groupId}</a>`,
    },
  },
};
