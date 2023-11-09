import React from "react";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Tooltip, Button } from "@nextui-org/react";
import { convertToPrismaQuery } from "./queryconverter";
import { BASE_URL } from "../../../../../utils";
import { Spinner } from "@nextui-org/react";

const baseUrl = BASE_URL;
export default function GetContact({ visible, onClose, filterVal }: any) {
  console.log("GetContact line 9 ==>");

  const handleOnClose = (e: any) => {
    if (e.target.id === "container") onClose();
  };

  const convertToNewFormat = (data: any) => {
    if (data.groupName === "and") {
      const newAnd: { [key: string]: any } = {}; // Specify the type of newAnd object
      data.items.forEach((item: any) => {
        if (item.operator === "==") {
          newAnd[item.field] = {
            [item.operator]: item.value,
          };
        } else {
          newAnd[item.field] = {
            [item.operator]: item.value,
          };
        }
      });
      return newAnd;
    } else if (data.groupName === "or") {
      return {
        OR: data.items.map((item: any) => convertToNewFormat(item)),
      };
    } else {
      return {};
    }
  };

  if (!visible) {
    return null;
  }
  const [employee, setEmployee] = useState("0.02");
  const [noOfRecords, setnoOfRecords] = useState("50000");
  const [showspinner, setshowspinner] = useState(false);
  const [emailcheck, setemailcheck] = useState(false);
  const handleEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee(e.target.value);
  };

  const [count, setCount] = useState("200");

  const handleCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCount(e.target.value);
  };
const handleNoOfRecords =(e: React.ChangeEvent<HTMLInputElement>)=>{
  setnoOfRecords(e.target.value);
 
}
const handleemailcheck =(e: React.ChangeEvent<HTMLInputElement>)=>{
  setemailcheck(!emailcheck);
  console.log(emailcheck);
}
  const exportContact = async () => {
    try {
      console.log(noOfRecords);
      console.log(emailcheck);
      setshowspinner(true);
      console.log("filterVal", filterVal);
      if (!filterVal) {
        console.log("filterVal", filterVal);
        filterVal = null;
      } else {
        console.log("filterVal", filterVal);
        const currentDateTime = new Date().toISOString();
        //  const convertedData = convertToPrismaQuery(filterVal);
        //  const newConvertedData = JSON.stringify(convertedData)
        //     .replaceAll('RingLeadScore', 'RingLead_Score__c')
        console.log("newConvertedData line 59 ==>", filterVal);
        const SendEmail = emailcheck? 'sandeepsingh@keenagile.com' : '';
        const requestData = {
          employeePercentageRequest: employee,
          minimumCount: count,
          filterval: filterVal,
          numberOfRecords :noOfRecords,
          emailContact :SendEmail,
        };
        const response = await axios.post(
          `${baseUrl}/jobs/rankings`,
          requestData,
          {
            responseType: "arraybuffer",
          }
        );
        onClose();
      if(!emailcheck){  
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        setshowspinner(false);
        link.href = url;
        link.setAttribute("download", "Contacts_" + currentDateTime + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // No need to check parentNode
      }
      }
    } catch (error) {
      console.error("Error downloading Excel file:", error);
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
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
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
                        Export Contacts
                      </div>
                    </div>
                  </div>
                  <hr />

                  <div className="text-left px-6 py-4 grid grid-cols-2 gap-4">
                    <div className="w-60">
                      <label
                        htmlFor="employee"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Employee %
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="employee"
                          id="employee"
                          className="block w-full rounded-md px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue="0.02"
                          onChange={handleEmployee}
                        />
                      </div>
                    </div>

                    <div className="w-60">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Minimum Count
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="count"
                          id="count"
                          className="block w-full rounded-md px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue="200"
                          onChange={handleCount}
                        />
                      </div>
                    </div>
                    <div className="w-60">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Number of records
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="NoOfRecords"
                          id="NoOfRecords"
                          className="block w-full rounded-md px-4 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue="50000"
                          onChange={handleNoOfRecords}
                        />
                      </div>
                    </div>
                    <div className="w-60">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900 relative"
                      >
                        Process & Send mail <Tooltip showArrow={true} content="Receive email after processing">
                       <button className="pl-2 pr-2 bg-slate-100 rounded-lg">i</button> 
                      </Tooltip>
                      </label>
                      
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          name="email"
                          id="email"
                          onChange={handleemailcheck}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse pb-6 pr-4">
                      <button
                        disabled={showspinner}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-001 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                        onClick={exportContact}
                      >
                        Export
                      </button>

                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      {showspinner && (
                        <div className="pl-2 pr-40 flex">
                          <Spinner size="sm" />
                          <div className="pt-2 p-2 font-semibold">
                            {" "}
                            Preparing for download...{" "}
                          </div>
                        </div>
                      )}
                    </div>
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
