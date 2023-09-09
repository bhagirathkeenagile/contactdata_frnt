"use client"
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="sticky bg-white top-0 z-40 pt-4 h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
        <button type="button" className="-m-2.5 p-2.5 text-black xl:hidden" onClick={() => setSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex justify-between items-center">
          <div className='flex items-center'>
            <a href='#' className="header-links px-4 p-2 text-sm rounded mr-1">
              Dashboard
            </a>

          </div>
          <div>
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
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;