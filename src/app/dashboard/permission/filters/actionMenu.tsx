"use client";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ActionMenu = ({ onItemSelected, selectedId }: any) => {
  const router = useRouter();
  const handleItemClick = (item: string, itemId: any) => {
    onItemSelected(item, itemId);
    router.push(`/map/update/${itemId}?action=${item}`);
    // redirect to update page
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center text-sm font-semibold text-gray-900">
          <EllipsisVerticalIcon className="h-5" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={() => handleItemClick("Import", selectedId)}
                  className={classNames(
                    active ? "bg-blue-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-yellow-400 group-hover:text-yellow-500"
                    aria-hidden="true"
                  />
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={() => handleItemClick("Import", selectedId)}
                  className={classNames(
                    active ? "bg-blue-100 text-red-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-500"
                    aria-hidden="true"
                  />
                  Remove
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ActionMenu;
