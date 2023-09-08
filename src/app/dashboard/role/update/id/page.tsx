"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UpdateNewRole = () => {
  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm leading-7 sm:truncate sm:text-lg sm:tracking-tight">
            Update Role
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
                // value={mapName}
                // onChange={handleMapNameChange}
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
                // options={importAction}
                // onChange={(selectedOption: any) => {
                //   setAction(selectedOption);
                // }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 mb-10 grid grid-cols-3 gap-4">
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Jhh Module (0)</h2>
          </div>
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Maps Module (5)</h2>
            <div className="space-y-5 mt-4">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="comments"
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-500"
                  >
                    maps | actions | clone
                  </label>{" "}
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="candidates"
                    aria-describedby="candidates-description"
                    name="candidates"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="candidates"
                    className="font-medium text-gray-500"
                  >
                    maps | actions | create
                  </label>{" "}
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="offers"
                    aria-describedby="offers-description"
                    name="offers"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="offers" className="font-medium text-gray-500">
                    maps | actions | destroy
                  </label>{" "}
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="offers"
                    aria-describedby="offers-description"
                    name="offers"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="offers" className="font-medium text-gray-500">
                    maps | actions | edit
                  </label>{" "}
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="offers"
                    aria-describedby="offers-description"
                    name="offers"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="offers" className="font-medium text-gray-500">
                    maps | actions | import
                  </label>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded shadow-md border-2 p-4">
            <h2 className="text-base font-bold">Nnd Module (1)</h2>
            <div className="space-y-5 mt-4">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="comments"
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-500"
                  >
                    nnd | kkd | kkd
                  </label>{" "}
                </div>
              </div>
            </div>
          </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex justify-end col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
                // onClick={() => {
                //   handleClickfor2ndpage();
                //   nextStep();
                // }}
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

export default UpdateNewRole;
