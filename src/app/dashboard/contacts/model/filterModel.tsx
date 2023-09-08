import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../../../../utils";
import { useRouter } from "next/navigation";

const FilterModel = ({ visible, onClose, fieldToShow, dataForUpdate }: any) => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedName, setSelectedName] = useState("")
  const [errorMsgMapName, setErrorMsgMapName] = useState("");
  const router = useRouter();
  const handleOnClose = (e: any) => {
    if (e.target.id === "container") onClose();
  };

  if (!visible) return null;


  const content = JSON.stringify(selectedFields).toString()
  console.log("content: ", !selectedName)
  const handleSaveChanges = async () => {
    if (!selectedName) {
      setErrorMsgMapName("List Name is required.");
      return 
    }
    else if (content.length === 2) {
      setErrorMsgMapName("Choose atlest one field.");
      return
    }
    try {
      const response = await axios.post(`${BASE_URL}/search/save`, {
        name: selectedName,
        content,
        page: '1'
      });
      console.log("Data saved:", response.data);
      router.push("/dashboard/contacts");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  return (
    <>
      <div id="container" onClick={handleOnClose}>
        <div className="relative z-50">
          <div>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </div>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
              <div>
                <div className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="text-left px-6 py-4">
                      <div className="text-base font-semibold leading-6 text-gray-900">
                        Add New List Filter
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="text-left px-6 py-4 grid grid-cols-1">
                    <div className="w-96">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        List Name <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="count"
                          id="count"
                          value={selectedName}
                          onChange={(e) => {
                            setSelectedName(e.target.value)
                            setErrorMsgMapName("")
                          }}
                          className="block w-full h-10 rounded-md px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Enter List Name"
                        />
                        {errorMsgMapName && (
                          <div className="text-red-500">{errorMsgMapName === "List Name is required." ? errorMsgMapName : ""}</div>
                        )}
                      </div>
                    </div>

                    <div className="w-96 mt-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Fields To Display <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          name="color"
                          options={fieldToShow.map((item: any) => ({
                            value: item.name,
                            label: item.name,
                          }))}
                          onChange={(selectedOptions: any) => {
                            setSelectedFields(selectedOptions)
                            setErrorMsgMapName("")
                          }}
                          isMulti
                          value={selectedFields} // Set the selected fields in the Select component
                        />
                        {errorMsgMapName && (
                          <div className="text-red-500">{errorMsgMapName === "Choose atlest one field." ? errorMsgMapName : ""}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse pb-6 pr-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-001 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={handleSaveChanges}
                    >
                      Save Change
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterModel;