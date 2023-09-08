"use client"
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline'
import FilterModel from '../model/filterModel'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const filter = [
  {
    id: 1,
    name: "new user1",
  },
  {
    id: 2,
    name: "new user 2",
  },
];
const HeaderDropdown = () => {
    const [showMyModal, setShowMyModel] = useState(false);
    const handleOnClose = () => setShowMyModel(false)
    return (
      <>
        <Menu as="div" className="relative inline-block text-left ml-2">
          <div>
            <Menu.Button className="inline-flex w-full justify-center  text-sm font-semibold rounded-md text-gray-900 p-1 bg-slate-200">
              <ChevronDownIcon className="h-5" />
            </Menu.Button>
          </div>

          <Transition>
            <div className=" absolute left-0 z-50 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="relative w-3/5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full border-0 py-1.5 h-12 pl-10 shadow-none text-gray-900 focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                      placeholder="Search"
                    />
                  </div>
                  <button
                    onClick={() => setShowMyModel(true)}
                    type="button"
                    className="inline-flex mr-2 items-center h-8 rounded-md bg-blue-001 opacity-70 px-3 py-0.5 text-xs font-semibold text-white shadow-sm"
                  >
                    Add More
                  </button>
                </div>
              </div>

              <hr />
              <div className="p-4">
                <p className="text-sm pb-3">Recently Searched:</p>
                {filter.map((Name, index) => (
                 
                    <div className="flex justify-between items-center mt-3">
                    <a href="#">
                      {
                        '' ? <CheckCircleIcon className="h-5 inline-block text-blue-500" /> : <CheckCircleIcon className="h-5 inline-block text-gray-200" />
                      }
                       
                        <span className="text-sm font-normal ml-4">
                          {Name.name}
                        </span>
                      </a>
                      <div>
                        <button>
                          <PencilSquareIcon className="h-5 inline-block text-blue-300 mr-3" />
                        </button>
                        <button>
                          <TrashIcon className="h-5 inline-block text-red-400" />
                        </button>
                      </div>
                    </div>
                 ))}
              </div>
            </div>
          </Transition>
        </Menu>
        <FilterModel onClose={handleOnClose} visible={showMyModal} />
      </>
    );
}


export default HeaderDropdown;