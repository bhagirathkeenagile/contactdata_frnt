"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { BASE_URL } from "../../../../../utils";
import { useRouter } from "next/navigation";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const acces = [
  { value: 1, label: "All Records" },
  { value: 2, label: "Owend Account" },
]

const CreateNewRole = () => {
  const router = useRouter();
  const [roleName, setroleName] = useState("")
  const [roleAcces, setroleAcces] = useState("")
  const [selectedMapValues, setSelectedMapValues] = useState<string[]>([]);
  const [mapList, setMapList] = useState<[]>([]);
  const [mapListData, setMapListData] = useState<[] | any>([]);
  const [mapData, setMapdata] = useState<[] | any>([])
  const [accountData, setAccountData] = useState<[] | any>([])
  const [contactData, setContactData] = useState<[] | any>([])





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/permissiondata`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setMapList(data.body);
        dataView(data.body)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

  }, []);

  // set rolenam
  const handleRoleNameChange = (event: any) => {
    setroleName(event.target.value);
  };

  // module selecttion 
  const handleCheckboxChange = (event: any) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedMapValues((prevValues) => [...prevValues, value]);
    } else {
      setSelectedMapValues((prevValues) =>
        prevValues.filter((v) => v !== value)
      );
    }
  };


  // handel submmint 
  const handleSubmit = async (event: any) => {
    const importData = {
      name: roleName,
      access: roleAcces,
      maps_module: selectedMapValues.toString(),
      account: "userLogdIn",
      content_module: "null",
      account_module: "null",
    }
    try {
      const response = await fetch(`${BASE_URL}/roles/insertRoleData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(importData),
      });

      if (response.ok) {
        console.log("Post created successfully");
        router.push("/dashboard/role");
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
    event.preventDefault();
  };
  const dataView = async (Data: any) => {
    const groupedArrays: { [key: string]: string[] } = {};
    Data.forEach((item: any) => {
      const module = item.module;
      if (!groupedArrays[module]) {
        groupedArrays[module] = [];
      }
      groupedArrays[module].push(item);
    });
    setMapListData(groupedArrays)
    setMapdata(groupedArrays.map);
    setAccountData(groupedArrays.account);
    setContactData(groupedArrays.contact);
    console.log("groupedArrays list ===>", groupedArrays.map)
  }

  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm leading-7 sm:truncate sm:text-lg sm:tracking-tight">
            Create Role
          </h2>
        </div>
      </div>

      <div className="bg-white my-2 px-4 py-3 shadow-sm m-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-700"
            >
              Role Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="assets"
                id="mapName"
                className="block w-full custom-height rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="Enter role number"
                value={roleName }
                onChange={handleRoleNameChange}
              />
            </div>
          </div>

          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-700"
            >
              Record Access <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              {/* make this satatic for a time  */}
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={acces}
                onChange={(selectedOption: any) => {
                  setroleAcces(selectedOption.label);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 mb-10 grid grid-cols-3 gap-4">
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Account Module ({accountData.length})</h2>
            <div className="space-y-5 mt-4">
              {accountData && accountData.map((Name: any, index: any) => (

                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="mapModuel"
                      aria-describedby="comments-description"
                      name="mapModuel"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={handleCheckboxChange}
                      value={`${Name.module} | ${Name.action} | ${Name.type}`} // Replace with the actual value you want to associate
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-500"
                    >
                      {Name.module} | {Name.action} | {Name.type}
                    </label>{" "}
                  </div>
                </div>))}
            </div>
          </div>
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Maps Module ({mapData.length})</h2>
            <div className="space-y-5 mt-4">
              {mapData && mapData.map((Name: any, index: any) => (

                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="mapModuel"
                      aria-describedby="comments-description"
                      name="mapModuel"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={handleCheckboxChange}
                      value={`${Name.module} | ${Name.action} | ${Name.type}`} // Replace with the actual value you want to associate
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-500"
                    >
                      {Name.module} | {Name.action} | {Name.type}
                    </label>{" "}
                  </div>
                </div>))}
            </div>
          </div>
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Contacts Module ({contactData.length})</h2>
            <div className="space-y-5 mt-4">
              {contactData && contactData.map((Name: any, index: any) => (

                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="mapModuel"
                      aria-describedby="comments-description"
                      name="mapModuel"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={handleCheckboxChange}
                      value={`${Name.module} | ${Name.action} | ${Name.type}`} // Replace with the actual value you want to associate
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-500"
                    >
                      {Name.module} | {Name.action} | {Name.type}
                    </label>{" "}
                  </div>
                </div>))}
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex justify-end col-span-2">
          <button
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-gray-100 px-4 py-2 text-xs text-gray-700 shadow-sm"
          // onClick={() => {
          //   prevStep();
          // }}
          >
            back
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateNewRole;
