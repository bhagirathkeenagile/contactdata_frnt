"use client"
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import {
  BanknotesIcon,
  BookmarkSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, SwatchIcon, UsersIcon, } from '@heroicons/react/20/solid'

import Lot from '../icons/lot'
import Role from '../icons/role'
import Permission from '../icons/permission'
import Global from '../icons/Global'
import Link from 'next/link'
import Header from './Header';

const dashboard = [
  { name: 'Dashboard', href: '/dashboard', icon: SwatchIcon, current: false },
]

const nav = [
  { name: 'Maps', href: '/dashboard/map', icon: Lot, current: false },
  { name: 'Contacts', href: '/dashboard/contacts', icon: UsersIcon, current: false },
  { name: 'Accounts', href: '/dashboard/accounts', icon: BanknotesIcon, current: false },
]


const ar = [
  { name: 'Roles', href: '/dashboard/role', icon: Role, current: false },
  { name: 'Permissions', href: '/dashboard/permission', icon: Permission, current: false },
  { name: 'Internal Brand', href: '/dashboard/internalBrands', icon: BookmarkSquareIcon, current: false },
  { name: 'Global Settings', href: '#', icon: Global, current: false },
]



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  console.log("data", session);
  console.log("status", status);
  const name = session?.user?.name;
  const email = session?.user?.email;

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const signOuts = () => {
    setDropdownOpen(false);
    signOut();
    console.log("sign-out")
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    {/* <img
                  src={new URL("../../../../public/logo.png", import.meta.url).toString()}
                  alt="Precedent Logo"
                  className="h-6 opacity-95"
                /> */}
                    <h1 className='text-white text-lg'>Logo</h1>

                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {dashboard.map((dashboard) => (
                            <li key={dashboard.name}>

                              <a
                                href={dashboard.href}
                                className={classNames(
                                  dashboard.current ? 'bg-gray-50' : 'hover:bg-gray-700',
                                  'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-200'
                                )}
                              >
                                <dashboard.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                {dashboard.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {nav.map((nav) => (
                            <li key={nav.name}>

                              <a
                                href={nav.href}
                                className={classNames(
                                  nav.current ? 'bg-gray-50' : 'hover:bg-gray-700',
                                  'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-200'
                                )}
                              >
                                <nav.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                {nav.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>

                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {ar.map((ar) => (
                            <li key={ar.name}>

                              <a
                                href={ar.href}
                                className={classNames(
                                  ar.current ? 'bg-gray-50' : 'hover:bg-gray-700',
                                  'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-200'
                                )}
                              >
                                <ar.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                                {ar.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>

                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black  ring-1 ring-white/5">
          <div className="flex h-16 shrink-0 items-center border-logo  px-6">
            {/* <img
                  src={new URL("../../../../public/logo.png", import.meta.url).toString()}
                  alt="Precedent Logo"
                  className="h-6 opacity-95"
                /> */}
            <h1 className='text-white text-lg'>Logo</h1>
          </div>
          <nav className="flex flex-1 flex-col  px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-4">
              <li>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {dashboard.map((dashboard) => (
                    <li key={dashboard.name}>
                      <Link
                        href={dashboard.href}
                        className={classNames(
                          dashboard.current ? 'bg-gray-50' : 'hover:text-gray-200',
                          'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-400'
                        )}
                      >
                        <dashboard.icon className={classNames(
                          dashboard.current ? 'bg-gray-50' : 'hover:text-gray-200',
                          'h-5 shrink-0 text-gray-400'
                        )} aria-hidden="true" />
                        {dashboard.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-normal leading-6 text-gray-400">USER VIEW</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1 pb-4">
                  {nav.map((nav) => (
                    <li key={nav.name}>
                      <a
                        href={nav.href}
                        className={classNames(
                          nav.current ? 'bg-gray-50' : 'hover:text-gray-200',
                          'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-400'
                        )}
                      >
                        <nav.icon
                          className={classNames(
                            nav.current ? 'bg-gray-50' : 'hover:text-gray-200',
                            'h-5 shrink-0 text-gray-400'
                          )}
                          aria-hidden="true" />
                        {nav.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-normal leading-6 text-gray-400">AR ADMIN VIEW</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1 pb-4">
                  {ar.map((ar) => (
                    <li key={ar.name}>
                      <a
                        href={ar.href}
                        className={classNames(
                          ar.current ? 'bg-gray-50' : 'hover:text-gray-200',
                          'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-normal text-gray-400'
                        )}
                      >
                        <ar.icon
                          className={classNames(
                            ar.current ? 'bg-gray-50' : 'hover:text-gray-200',
                            'h-5 shrink-0 text-gray-400'
                          )}
                          aria-hidden="true" />
                        {ar.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

            </ul>
          </nav>
        </div>
      </div>
      <div className="xl:pl-72">
        <div className="sticky bg-white top-0 z-40 pt-4 h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8 flex xl:block justify-between">
          <button type="button" className="-m-2.5 p-2.5 text-black xl:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <a href='#' className="header-links px-4 p-2 text-sm rounded mr-1 hidden xl:block">
                Dashboard
              </a>

            </div>
            <div>
              <div className="relative">
                <a href="#" className="group block flex-shrink-0" onClick={toggleDropdown}>
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{name?name:"USER"}</p>
                    </div>
                  </div>
                </a>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      View Profile
                    </a>
                    <button
                      onClick={() => signOuts()}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* 
              <a href="#" className="group block flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Team Upstream</p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                    <button onClick={() => { signOut(); }} className="text-xs font-medium text-gray-500 group-hover:text-gray-700">LogOut</button>
                  </div>
                </div>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar;