import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import loadable from '@loadable/component';
import { useAtomValue } from 'jotai';

import Loader from '/imports/ui/core/Loader';
const Terms = loadable(() => import('/imports/ui/entry/Terms'));
import LayoutContainer, { currentHostAtom } from '../LayoutContainer';
const ComposablePageView = loadable(() =>
  import('./composablepages/ComposablePageView')
);

import SetupHome from '/imports/ui/pages/setup';

const Communities = loadable(() => import('../pages/hosts/Communities'));

// Activities
const Activities = loadable(() => import('./activities/Activities'));
const Activity = loadable(() => import('./activities/Activity'));

// Groups
const Groups = loadable(() => import('./groups/Groups'));
const Group = loadable(() => import('./groups/Group'));

// Resources
const Resources = loadable(() => import('./resources/Resources'));
const Resource = loadable(() => import('./resources/Resource'));

// Calendar
const Calendar = loadable(() => import('./calendar/Calendar'));

// Works
const Works = loadable(() => import('./works/Works'));
const Work = loadable(() => import('./works/Work'));

// Users
const Users = loadable(() => import('./profile/Users'));
const UserProfile = loadable(() => import('./profile/UserProfile'));

// Pages
const Page = loadable(() => import('./pages/Page'));

// Auth
const SignupPage = loadable(() => import('./auth/SignupPage'));
const LoginPage = loadable(() => import('./auth/LoginPage'));
const ForgotPasswordPage = loadable(() => import('./auth/ForgotPasswordPage'));
const ResetPasswordPage = loadable(() => import('./auth/ResetPasswordPage'));
const RegistrationIntro = loadable(() => import('./auth/RegistrationIntro'));

// Admin
const AdminContainer = loadable(() => import('./admin/AdminContainer'));
const PreviousNewsletters = loadable(() =>
  import('./admin/EmailNewsletter/PreviousNewsletters')
);

// Super admin
const PlatformSettings = loadable(() => import('./admin/PlatformSettings'));
const PlatformRegistrationIntro = loadable(() =>
  import('./admin/PlatformRegistrationIntro')
);
// SuperAdmin
const NewHost = loadable(() => import('./hosts/NewHost'));

// NotFound
const NotFoundPage = loadable(() => import('./NotFoundPage'));
const MyActivities = loadable(() => import('./activities/MyActivities'));

function getComponentBasedOnFirstRoute(menuItems) {
  const visibleMenu = menuItems.filter((item) => item.isVisible);
  const firstRoute = visibleMenu && visibleMenu[0].name;

  switch (firstRoute) {
    case 'activities':
      return <Activities />;
    case 'groups':
      return <Groups />;
    case 'works':
      return <Works />;
    case 'resources':
      return <Resources />;
    case 'calendar':
      return <Calendar />;
    case 'info':
      return <Page />;
    case 'people':
      return <Users />;
    default:
      return <ComposablePageView />;
  }
}

function HomePage() {
  const currentHost = useAtomValue(currentHostAtom);
  const menu = currentHost?.settings?.menu;

  if (!menu || !menu[0]) {
    return null;
  }

  const Component = getComponentBasedOnFirstRoute(menu);
  return Component;
}

export default function AppRoutes() {
  return (
    // <LayoutContainer>
    //   <Suspense fallback={<Loader />}>
    //     <Routes>
    <>
      <Route exact path="/" element={<HomePage />} />

      {/* Members list public */}
      <Route path="/people" element={<Users />} />

      {/* Calendar */}
      <Route path="/calendar" element={<Calendar />} />

      {/* Activities */}
      <Route
        path="/activities"
        element={<Activities currentHost={currentHost} />}
      >
        <Route path=":activityId">
          <Route path="*" element={<Activity />} />
        </Route>
      </Route>

      <Route path="/calendar">
        <Route path=":activityId">
          <Route path="*" element={<Activity />} />
        </Route>
      </Route>

      <Route exact path="/my-activities" element={<MyActivities />} />

      {/* Groups */}
      <Route exact path="/groups" element={<Groups />}>
        <Route path="groupId">
          <Route path="*" element={<Group />} />
        </Route>
      </Route>

      {/* Resources */}
      <Route exact path="/resources" element={<Resources />}>
        <Route path=":resourceId">
          <Route path="*" element={<Resource />} />
        </Route>
      </Route>

      {/* Pages */}
      <Route exact path="/info" element={<Page />}>
        <Route path=":pageTitle">
          <Route path="*" element={<Page />} />
        </Route>
      </Route>

      <Route path="/cp">
        <Route path=":composablePageId" element={<ComposablePageView />} />
      </Route>

      {/* Works */}
      <Route exact path="/works" element={<Works />} />

      {/* Communities: Only on Portal App */}
      <Route exact path="/communities" element={<Communities />} />

      {/* Newsletter Emails */}
      <Route path="/newsletters" element={<PreviousNewsletters />}>
        <Route path="*" element={<PreviousNewsletters />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/*" element={<AdminContainer />} />

      {/* Super Admin */}
      <Route
        path="/superadmin/platform/settings/*"
        element={<PlatformSettings />}
      />
      <Route
        path="/superadmin/platform/registration-intro"
        element={<PlatformRegistrationIntro />}
      />

      {/* Profile & Profile Related Pages */}
      <Route path="/:usernameSlug" element={<UserProfile />}>
        <Route path="works">
          <Route path=":workId">
            <Route path="*" element={<Work />} />
          </Route>
        </Route>
      </Route>

      {/* Auth */}
      <Route exact path="/register" element={<SignupPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/reset-password">
        <Route path="*" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/intro" element={<RegistrationIntro />} />

      {/* SuperAdmin */}
      <Route exact path="/new-host" element={<NewHost />} />
      <Route exact path="/terms-&-privacy-policy" element={<Terms />} />
      <Route exact path="/setup" element={<SetupHome />} />

      {/* NotFoundPage */}
      <Route exact path="/not-found" element={<NotFoundPage />} />
      <Route exact path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
    //     </Routes>
    //   </Suspense>
    // </LayoutContainer>
  );
}
