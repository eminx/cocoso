import React from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Helmet } from 'react-helmet';
import AddIcon from 'lucide-react/dist/esm/icons/plus';

import Boxling from '../Boxling';

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of your traffic',
    href: '#',
    icon: AddIcon,
  },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: AddIcon },
  {
    name: 'Security',
    description: "Your customers' data will be safe and secure",
    href: '#',
    icon: AddIcon,
  },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: AddIcon },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: AddIcon,
  },
];
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: AddIcon },
  { name: 'Contact sales', href: '#', icon: AddIcon },
];

export default function ActivitiesAdmin() {
  return (
    <>
      <Helmet>
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      </Helmet>

      <Popover className="relative">
        <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
          <span>Solutions</span>
          <AddIcon aria-hidden="true" className="size-5" />
        </PopoverButton>

        <PopoverPanel
          transition
          className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
        >
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
            <div className="p-4">
              {solutions.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon
                      aria-hidden="true"
                      className="size-6 text-gray-600 group-hover:text-indigo-600"
                    />
                  </div>
                  <div>
                    <a href={item.href} className="font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
              {callsToAction.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  );
}

{
  /* return <Boxling>Currently no settings enabled</Boxling>; */
}
