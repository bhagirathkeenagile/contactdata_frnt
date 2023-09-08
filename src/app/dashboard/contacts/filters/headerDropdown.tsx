"use client"
import { Fragment, useEffect, useRef, useState } from 'react'
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
import { ChevronUpIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline'
import FilterModel from '../model/filterModel'
import axios from 'axios'
import { BASE_URL } from '../../../../../utils'
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/navigation';
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const HeaderDropdown = () => {
  const [showMyModal, setShowMyModel] = useState(false);
  const [ruleSet, setRuleSet] = useState([]);
  const [contactField, setContactField] = useState<any[]>([]);
  const [serchForUpdate, setSerchForUpdate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredContacts = contactField.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [selectedItemId, setSelectedItemId] = useState<any>(null);

  const handleSelectItem = (itemId: any) => {
    const router = useRouter();
    setSelectedItemId(itemId);
    const dataForUpdate = contactField.find((item: any) => item.id === itemId)
    if (dataForUpdate) {
      const dataJson = JSON.stringify(dataForUpdate);
      const encodedData = encodeURIComponent(dataJson);
       router.push(`/dashboard/contacts?id=${itemId}&data=${encodedData}`);
    }
  };
  const MySwal = withReactContent(Swal)


  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const handleOnClose = () => setShowMyModel(false)

  //  get id from url for preslections
  if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const id = params.get("id");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/mapdata`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        const contactFilterData = (data.body.tables)?.find((item: any) => item.name === "Contacts").fields
        const onlyNameArray = contactFilterData.map((item: any) => ({ name: item.name }));
        setRuleSet(onlyNameArray);
      } catch (error) {
        console.error(error);
      }
    };

    setSelectedItemId(Number(id));

    fetchData();
  }, [contactField]);
  }
  const fetchSearchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/search/getSaved`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      setContactField(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {

    fetchSearchData();
  }, [selectedItemId])

  // delete save serch data 
  const deleteContactSerchField = async (Id: any) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this contact search field.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/search/delsearchById/${Id}`);
        fetchSearchData();
        MySwal.fire('Deleted!', 'The contact search field has been deleted.', 'success');
      }
    } catch (error) {
      console.log('error: ', error);
      MySwal.fire('Error!', 'An error occurred while deleting the contact search field.', 'error');
    }
  };


  const dataUpDate = async (Id: any) => {
    const dataForUpdate = contactField.find((item: any) => item.id === Id)
    if (dataForUpdate) {
      setSerchForUpdate(dataForUpdate)
      setShowMyModel(true)
    }
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Menu as="div" className="relative inline-block text-left ml-2">
        <div>

        </div>
        <div onClick={toggleDropdown}>
          {isOpen ? (<Menu.Button className="inline-flex w-full justify-center  text-sm font-semibold rounded-md text-gray-900 p-1 bg-slate-200">
            <ChevronUpIcon className="h-5" />
          </Menu.Button>) : (<Menu.Button className="inline-flex w-full justify-center  text-sm font-semibold rounded-md text-gray-900 p-1 bg-slate-200">
            <ChevronDownIcon className="h-5" />
          </Menu.Button>)}
        </div>
        {isOpen && (<div>
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
                    type="text"
                    name="text"
                    id="email"
                    className="block w-full border-0 py-1.5 h-12 pl-10 shadow-none text-gray-900 focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleInputChange}
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
              {filteredContacts && filteredContacts?.map((item, index) => (

                <div className="flex justify-between items-center mt-3">
                  <a href="#">
                    <CheckCircleIcon
                      className={`h-5 inline-block ${selectedItemId === item.id ? "text-blue-500" : "text-gray-200"
                        }`}
                    />

                    <span
                      className="text-sm font-normal ml-4"
                      onClick={() => {
                        handleSelectItem(item.id);
                      }}
                    >
                      {item.name}
                    </span>
                  </a>
                  <div>
                    <button onClick={() => {
                      dataUpDate(item.id)
                      console.log(`item.id => ${item.id} and type: ${typeof (item.id)}`)
                    }}>
                      <PencilSquareIcon className="h-5 inline-block text-blue-300 mr-3" />
                    </button>

                    <button
                      onClick={() => {
                        deleteContactSerchField(item.id);
                      }}
                    >
                      <TrashIcon className="h-5 inline-block text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>)}
      </Menu>
      <FilterModel onClose={handleOnClose} visible={showMyModal} fieldToShow={ruleSet} dataForUpdate={serchForUpdate} />
    </>
  );
}


export default HeaderDropdown;