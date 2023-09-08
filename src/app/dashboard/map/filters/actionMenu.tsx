"use client";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  DocumentArrowUpIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "../../../../../utils";
import Swal from "sweetalert2";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ActionMenu = ({ onItemSelected, selectedId }: any) => {
  const [mapList, setMapList] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/map/list-mapData`); // Use axios.get instead of fetch
      const data = response.data;
      onItemSelected(data.mapListData);
      setMapList(data.mapListData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);



  const showRemoveConfirmation = (selectedId: any) => {
    const delteName: any = mapList?.find((item: any) => item.id === selectedId)

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove this list ( "${delteName ? delteName.name : "no"}" )`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleItemClick('Remove', selectedId);
      }
    });
  };
const router = useRouter();
  const handleItemClick = async (item: string, itemId: any) => {

    switch (item) {
      // if data want to remove 
      case "Remove":
        try {
          await axios.delete(`${BASE_URL}/map/delMapById/${itemId}`);
          fetchData();
          // Display a success SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Removed Successfully',
            text: 'The item has been removed successfully.',
          }).then(() => {
          });
        } catch (error) {
          console.log("error: ", error);
          // Display an error SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while removing the item.',
          });
        }
        break;

      // if data want to Import 
      case "Import":
        try {
          router.push(`/dashboard/map/create?id=${itemId}&action=${item}`)

        } catch (error) {
          console.log("error: ", error);
        }
        break;
      case "Clone":
        try {
          await axios.get(`${BASE_URL}/map/cloneMapFieldById/${itemId}`);
          router.push("/dashboard/map")

        } catch (error) {
          console.log("error: ", error);
        }
        break;
      case "Edit":
        try {
          router.push(`/dashboard/map/create?id=${itemId}&action=${item}`)

        } catch (error) {
          console.log("error: ", error);
        }
        break;
      default:
        break;
    }
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
        <Menu.Items className="absolute left-0 z-50  w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                  <DocumentArrowUpIcon
                    className="mr-3 h-5 w-5 text-purple-400 group-hover:text-purple-500"
                    aria-hidden="true"
                  />
                  Import
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={() => handleItemClick("Edit", selectedId)}
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
                  onClick={() => handleItemClick("Clone", selectedId)}
                  className={classNames(
                    active ? "bg-blue-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <DocumentDuplicateIcon
                    className="mr-3 h-5 w-5 text-blue-400 group-hover:text-blue-500"
                    aria-hidden="true"
                  />
                  Clone
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default link behavior
                    showRemoveConfirmation(selectedId);
                  }}
                  className={classNames(
                    active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
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
