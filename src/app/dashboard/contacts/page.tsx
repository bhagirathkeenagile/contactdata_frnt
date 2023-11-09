"use client";
import React from "react";
import GetContact from "./model/getContacts";
import { use, useEffect, useMemo, useState, useCallback } from "react";
import HeaderDropdown from "./filters/headerDropdown";
import FilterControl from "react-filter-control";
import { IFilterControlFilterValue } from "react-filter-control/interfaces";
import { filterData } from "./filterData";
import { ChevronDownIcon } from "./icons";
import axios from "axios";
import { BASE_URL } from "../../../../utils";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Spinner,
  getKeyValue,
  SortDescriptor,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { User, columns, renderCell } from "./columns";
import { convertToPrismaQuery } from "./model/queryconverter";
const fields = [
  {
    caption: "First Name",
    name: "FirstName",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Does Not Contain",
        name: "doesNotContain",
      },
      {
        caption: "Equals",
        name: "=",
      },
      {
        caption: "Does not Equal",
        name: "<>",
      },
      {
        caption: "More than",
        name: ">",
      },
      {
        caption: "Less than",
        name: "<",
      },
    ],
  },
  {
    caption: "Last Name",
    name: "LastName",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Does Not Contain",
        name: "doesNotContain",
      },
      {
        caption: "Equals",
        name: "=",
      },
      {
        caption: "Does not Equal",
        name: "<>",
      },
      {
        caption: "More than",
        name: ">",
      },
      {
        caption: "Less than",
        name: "<",
      },
    ],
  },
  {
    caption: "Account",
    name: "Account",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Does Not Contain",
        name: "doesNotContain",
      },
      {
        caption: "Equals",
        name: "=",
      },
      {
        caption: "Does not Equal",
        name: "<>",
      },
    ],
  },
  {
    caption: "RingLeadScore",
    name: "RingLeadScore",
    operators: [
      {
        caption: "Equals",
        name: "==",
      },
      {
        caption: "Does not Equal",
        name: "!=",
      },
      {
        caption: "More than",
        name: ">",
      },
      {
        caption: "Less than",
        name: "<",
      },
    ],
  },
  {
    caption: "Email",
    name: "Email",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Does Not Contain",
        name: "doesNotContain",
      },
      {
        caption: "Equals",
        name: "=",
      },
      {
        caption: "Does not Equal",
        name: "<>",
      },
      {
        caption: "More than",
        name: ">",
      },
      {
        caption: "Less than",
        name: "<",
      },
    ],
  },
];

const groups = [
  {
    caption: "And",
    name: "and",
  },
  {
    caption: "Or",
    name: "or",
  },
];
const people = [
  {
    Id: "1",
    Account: "First Account",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email: "",
  },
  {
    Id: "2",
    Account: "First Account",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email: "",
  },
  {
    Id: "3",
    Account: "Second Account",
    FirstName: "Walter 2",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email: "",
  },
  {
    Id: "4",
    Account: "Second Account",
    FirstName: "Walter 2",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email: "",
  },
];

const filter: IFilterControlFilterValue = {
  groupName: "and",
  items: [],
};
const ContactList = () => {
  const [searchText, setSearchText] = useState("");
  const [showMyModal, setShowMyModel] = useState(false);
  const handleOnClose = () => setShowMyModel(false);
  const [filterValue, changeFilter] = useState<any>(filter);
  const [filterValueforexcel, changeFilterforexcel] = useState<any>();
  const [filtercontactdata, setfiltercontactdata] = useState<any>(false);
  const [appltyfilter, setappltyfilter] = useState<any>(false);
  const [standardfiltervalue,setstandardfiltervalue]=useState('');
  const [statusFilter, setStatusFilter] = React.useState(
    new Set(["All_Contacts"])
  );
  const statusOptions = [
    { name: "Avail Contacts", uid: "Avail_Contacts" },
    { name: "TelAdvance Contacts", uid: "TelAdvance_Contacts" },
    { name: "All Contacts", uid: "All_Contacts" },
  ];
  const onFilterChanged = (newFilterValue: IFilterControlFilterValue) => {
    changeFilter(newFilterValue);
    // setfiltercontactdata(true);
    setDisablebutton(false);
    // console.log("test pass", filterValue.items[0].value);
    if (filterValue.items[0]?.value !== "") {
      // setfiltercontactdata(true);
    } else {
      setfiltercontactdata(false);
      setappltyfilter(false);
      fetchPageData(page, appltyfilter, newFilterValue,'All Contacts');
    }
  };
  const [currentPage, setCurrentPage] = useState(1); // 1-based index
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [disablebutton, setDisablebutton] = useState(true);
  const [page, setPage] = React.useState(1);
  const [pagescount, setPages] = React.useState(10);
  const [data, setData] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const rowsPerPage: number = 10;
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const pages: number = useMemo(() => {
    return Math.ceil(pagescount / rowsPerPage);
  }, [pagescount, rowsPerPage]);
  useEffect(() => {
    console.log('standardfiltervalue 266',standardfiltervalue);
    setIsLoading(true);
    setError(null);
    if(!standardfiltervalue){
    fetchPageData(page, filtercontactdata, filterValue,'All Contacts');
    }
  }, [page]);

  const loadingState: "loading" | "idle" =
    isLoading || (users && users.length === 0) ? "loading" : "idle";
  const [filterValue1, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue1);
  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];
    console.log("memo call", hasSearchFilter);
    if (hasSearchFilter) {
      console.log("inside memo");
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.FirstName.toLowerCase().includes(filterValue1.toLowerCase()) ||
          user.LastName.toLowerCase().includes(filterValue1.toLowerCase())
      );
    }
    console.log("inside memo", filteredUsers.length);
    return filteredUsers;
  }, [users, filterValue1, hasSearchFilter]);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate()-30);
  thirtyDaysAgo.toISOString().split("T")[0];
  const sixtydaysAgo = new Date();
  sixtydaysAgo.setDate(currentDate.getDate()-60);
  sixtydaysAgo.toISOString().split("T")[0];
  const twoseventydaysAgo = new Date();
  twoseventydaysAgo.setDate(currentDate.getDate()-270);
  twoseventydaysAgo.toISOString().split("T")[0];
  const dateThreshold = new Date("2020-12-31T00:00:00Z");
 
  const handleStanadardFilter = (status: any) => {
    setStatusFilter(status);
    console.log("standard filter", Array.from(status).join(", ").replaceAll("_", " "));
    setstandardfiltervalue(Array.from(status).join(", ").replaceAll("_", " "))
    fetchPageData(page, filtercontactdata, filterValue,Array.from(status).join(", ").replaceAll("_", " "));
  };
  const selectedValue = React.useMemo(
    () => Array.from(statusFilter).join(", ").replaceAll("_", " "),
    [statusFilter]
  );
  const fetchPageData = async (
    page: number,
    appltyfilter1: boolean,
    filterValue: any,
    standardfilter:string
  ) => {
    setDisablebutton(true);
    console.log("test 1111", standardfiltervalue);
    try {
      setIsLoading(true);
      const convertedData = convertToPrismaQuery(filterValue);
      const newConvertedData = JSON.stringify(convertedData).replaceAll(
        "RingLeadScore",
        "RingLead_Score__c"
      );
      console.log('test 222');
      const AvailContacts =
        '{"AND":[' +
        newConvertedData +
        ',{"AND":[{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},{"NOT":{"AND":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]}},{"Account":{"shippingcountry":{"in":["USA","United States","United States of America",""]}}},{"Account":{"Marketing_Suppression__c":{"not":{"in":["(All Brands) Suppress Cold Only","(All Brands) Suppress Cold and Warm","(Avail) Suppress Cold Only","(Avail) Suppress Cold and Warm"]}}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Last_Quickmail_Import__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Account":{"Lot_Last_Created__c":{"lt":"' +
        twoseventydaysAgo.toISOString() +
        '"}}},{"Low_Grade_Title__c":false},{"Completed_Marketing_Segment__c":{"contains":"Avail (First Contact)"}},{"Persona__c":null},{"Business_Unit__c":{"not":{"equals":"ECHG"}}},{"OR":[{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        sixtydaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"contains":"Avail"}}]},{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"not":{"contains":"Avail"}}}]}]},{"created_at":{"gte":"' +
        dateThreshold.toISOString() +
        '"}}]}]}';
      const teladvanceContacts =
        '{"AND":[' +
        newConvertedData +
        ',{"AND":[{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},{"NOT":{"AND":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]}},{"OR":[{"Account":{"shippingcountry":{"in":["USA","US","United States","United States of America"]}}},{"Account":{"shippingcountry":""}}]},{"Account":{"Marketing_Suppression__c":{"not":{"in":["(All Brands) Suppress Cold Only","(All Brands) Suppress Cold and Warm","(Teladvance) Suppress Cold Only","(Teladvance) Suppress Cold and Warm"]}}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Email":{"not":{"equals":""}}},{"Last_Quickmail_Import__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Account":{"Lot_Last_Created__c":{"lt":"' +
        twoseventydaysAgo.toISOString() +
        '"}}},{"Low_Grade_Title__c":false},{"Completed_Marketing_Segment__c":{"contains":"Teladvance (First Contact)"}},{"Persona__c":""},{"Business_Unit__c":{"not":{"equals":"ECHG"}}},{"OR":[{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        sixtydaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"contains":"Teladvance"}}]},{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"not":{"contains":"Teladvance"}}}]}]}]}]}';
       
        const test='{"AND":[{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},"NOT":{"OR":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]},{"OR":[{"Account":{"shippingcountry":{"in":["USA","US","United States","United States of America"]}}},{"Account":{"shippingcountry":""}}]},{"Account":{"Marketing_Suppression__c":{"not":{"in":["(AllBrands)Suppress Cold Only","(AllBrands) Suppress Cold and Warm","(Teladvance) Suppress Cold Only","(Teladvance) Suppress Cold and Warm"]}}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Email":{"not":{"equals":""}}},{"Last_Quickmail_Import__c":{"lt":"'+thirtyDaysAgo+'"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Account":{"Lot_Last_Created__c":{"lt":"'+twoseventydaysAgo+'"}}},{"Low_Grade_Title__c":false},{"Completed_Marketing_Segment__c":{"contains":"Teladvance (First Contact)"}},{"Persona__c":""},{"Business_Unit__c":{"not":{"equals":"ECHG"}}},{"OR":[{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"'+sixtydaysAgo+'"}},{"Last_Quickmail_Checkpoint__c":{"contains":"Teladvance"}}]},{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"'+thirtyDaysAgo+'"}},{"Last_Quickmail_Checkpoint__c":{"not":{"contains":"Teladvance"}}}]}]}]}';
        console.log("requestData");
      let response;
      if (appltyfilter1) {
        console.log("appltyfilter", appltyfilter);
        response = await axios.post(
          `${BASE_URL}/map/list-contactData-filter?page=${page}&pageSize=${rowsPerPage}`,
          {filterval: newConvertedData,filterseconf: "1",}
        );
      } else {
        console.log('selectedValue',standardfilter)
        if(standardfilter=='Avail Contacts'){
          response = await axios.post(
            `${BASE_URL}/map/list-contactData-filter?page=${page}&pageSize=${rowsPerPage}`,
            {filterval: AvailContacts,filterseconf: "1",}
          );}
        if(standardfilter=='TelAdvance Contacts'){
          response = await axios.post(
            `${BASE_URL}/map/list-contactData-filter?page=${page}&pageSize=${rowsPerPage}`,
            {filterval: teladvanceContacts,filterseconf: "1",}
          );}
         if(standardfilter=='All Contacts'){
          response = await axios.get(
            `${BASE_URL}/map/get-contacts?page=${page}&pageSize=${rowsPerPage}`
          );}
      }
      console.log("testing 223", response);
      if (response.status === 201) {
        setDisablebutton(false);
      }
      if (response.status === 201 || response.status === 200) {
        setIsLoading(false)
        setPages(response.data.totalContacts);
        console.log("response12", response.data.contacts);
        const result = await response.data.contacts;
        setData(result);

        // setPages(response.data.totalContacts)
        setUsers(
          response.data.contacts.map((contact: any) => {
            return {
              id: contact.id,
              Account: contact.Account?.Name,
              FirstName: contact.FirstName,
              LastName: contact.LastName,
              Email: contact.Email,
              RingLeadScore: contact.RingLead_Score__c,
            };
          })
        );
        console.log("users 240", users);
      } else {
        throw new Error(`HTTP error! Status: ${response}`);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getincludedcontact =()=>{
    const convertedData = convertToPrismaQuery(filterValue);
    const newConvertedData = JSON.stringify(convertedData).replaceAll(
      "RingLeadScore",
      "RingLead_Score__c"
    );
    const AvailContacts =
        '{"AND":[' +
        newConvertedData +
        ',{"AND":[{"export_status":null},{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},{"NOT":{"AND":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]}},{"Account":{"shippingcountry":{"in":["USA","United States","United States of America",""]}}},{"Account":{"Marketing_Suppression__c":{"not":{"in":["(All Brands) Suppress Cold Only","(All Brands) Suppress Cold and Warm","(Avail) Suppress Cold Only","(Avail) Suppress Cold and Warm"]}}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Last_Quickmail_Import__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Account":{"Lot_Last_Created__c":{"lt":"' +
        twoseventydaysAgo.toISOString() +
        '"}}},{"Low_Grade_Title__c":false},{"Completed_Marketing_Segment__c":{"contains":"Avail (First Contact)"}},{"Persona__c":null},{"Business_Unit__c":{"not":{"equals":"ECHG"}}},{"OR":[{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        sixtydaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"contains":"Avail"}}]},{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"not":{"contains":"Avail"}}}]}]},{"created_at":{"gte":"' +
        dateThreshold.toISOString() +
        '"}}]}]}';
      const teladvanceContacts =
        '{"AND":[' +
        newConvertedData +
        ',{"AND":[{"export_status":null},{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},{"NOT":{"AND":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]}},{"OR":[{"Account":{"shippingcountry":{"in":["USA","US","United States","United States of America"]}}},{"Account":{"shippingcountry":""}}]},{"Account":{"Marketing_Suppression__c":{"not":{"in":["(All Brands) Suppress Cold Only","(All Brands) Suppress Cold and Warm","(Teladvance) Suppress Cold Only","(Teladvance) Suppress Cold and Warm"]}}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Email":{"not":{"equals":""}}},{"Last_Quickmail_Import__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Account":{"Lot_Last_Created__c":{"lt":"' +
        twoseventydaysAgo.toISOString() +
        '"}}},{"Low_Grade_Title__c":false},{"Completed_Marketing_Segment__c":{"contains":"Teladvance (First Contact)"}},{"Persona__c":""},{"Business_Unit__c":{"not":{"equals":"ECHG"}}},{"OR":[{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        sixtydaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"contains":"Teladvance"}}]},{"AND":[{"Most_Recent_Marketing_Action__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Last_Quickmail_Checkpoint__c":{"not":{"contains":"Teladvance"}}}]}]}]}]}';

        const allContact = '{"AND":[' +
        newConvertedData +
        ',{"AND":[{"export_status":null}]}]}';
        const test='{"AND":[' +
        newConvertedData +
        ',{"AND":[{"export_status":null},{"RecordTypeId":{"not":"0122E0000008mQcQAI"}},{"IsWarm__c":false},{"NOT":{"AND":[{"Email":{"contains":"gov"}},{"Email":{"contains":"edu"}},{"Email":{"contains":"mil"}}]}},{"Account":{"shippingcountry":{"in":["USA","United States","United States of America",""]}}},{"Account":{"Type":{"not":{"in":["Competitor","Downstream","Solar","Vendor"]}}}},{"Last_Quickmail_Import__c":{"lt":"' +
        thirtyDaysAgo.toISOString() +
        '"}},{"Outreach_Stage__c":{"not":{"in":["Do Not Contact","Not Interested","Bad Contact Info","Bad Fit","Not Active","Portal User","Replied","Interested","Tasked"]}}},{"Low_Grade_Title__c":false},{"Most_Recent_Marketing_Action__c":{"lt":"' +
        sixtydaysAgo.toISOString() +
        '"}}]}]}';
        if(standardfiltervalue=='Avail Contacts'){
          changeFilterforexcel(test)
          setShowMyModel(true)
        }
        else if(standardfiltervalue=='TelAdvance Contacts'){
          changeFilterforexcel(teladvanceContacts)
          setShowMyModel(true)
        }
        else{
          changeFilterforexcel(allContact)
          setShowMyModel(true)
        }
       
  }
  const [ringleadupdate, setRingleadupdate] = useState(false);
  const updateRingLeadScore = async () => {
    try {
      setRingleadupdate(true);
      const response = await fetch(`/api/ringLoadScore`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response) {
        setRingleadupdate(false);
        console.log("ringLeadScore Updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (newPage: any) => {
    setPage(newPage);
    fetchPageData(newPage, filtercontactdata, filterValue,standardfiltervalue);
    console.log("test 2222", newPage);
  };
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setfiltercontactdata(true);
      setFilterValue(value);
      setPage(1);
    } else {
      setfiltercontactdata(false);
      setFilterValue("");
    }
  }, []);
  
 
  const handlefilter = () => {
    console.log("handle click filter");
    setappltyfilter(true);
    setPage(1);
    fetchPageData(page, true, filterValue,standardfiltervalue);
  };
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  // const topContent = useMemo(() => {
  //   return (
  //     <div className="flex flex-col gap-4">
  //     <div className="flex justify-between gap-3 items-end">
  //       <FilterControl
  //         {...{
  //           fields,
  //           groups,
  //           filterValue,
  //           onFilterValueChanged: onFilterChanged,
  //         }}
  //       />

  //         <div className="mt-4 flex md:ml-4 md:mt-0">
  //           <button

  //             onClick={() => handlefilter()}
  //             type="button"
  //             disabled={disablebutton}
  //             className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
  //           >

  //             Apply Filter
  //           </button>
  //         </div>

  //       <div className="flex gap-3">
  //           {/* <Dropdown>
  //             <DropdownTrigger className="hidden sm:flex">
  //               <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
  //                 Status
  //               </Button>
  //             </DropdownTrigger>
  //             <DropdownMenu
  //               disallowEmptySelection
  //               aria-label="Table Columns"
  //               closeOnSelect={false}
  //               selectedKeys={statusFilter}
  //               selectionMode="multiple"
  //               onSelectionChange={setStatusFilter}
  //             >
  //               {statusOptions.map((status) => (
  //                 <DropdownItem key={status.uid} className="capitalize">
  //                   {capitalize(status.name)}
  //                 </DropdownItem>
  //               ))}
  //             </DropdownMenu>
  //           </Dropdown> */}
  //           </div>
  //           </div>
  //     </div>
  //   );
  // }, [filterValue, onSearchChange, onClear]);
  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1 items-center flex">
          <h2 className="text-sm font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight inline-block">
            Contact List
          </h2>
          <HeaderDropdown />
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {ringleadupdate && (
            <div className="pl-2 flex">
              <Spinner size="sm" />
              <div className="pt-2 p-2 font-semibold">
                Updating Ring Lead Score...
              </div>
            </div>
          )}
          <button
            disabled={ringleadupdate}
            onClick={() => updateRingLeadScore()}
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Update RingLead Score
          </button>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => getincludedcontact()}
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Get Included Contacts
          </button>
        </div>
      </div>
      <div className="flex flex-col p-1 pr-3 pl-3">
        <div className="flex justify-between items-end">
          <FilterControl
            {...{
              fields,
              groups,
              filterValue,
              onFilterValueChanged: onFilterChanged,
            }}
          />

          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={() => handlefilter()}
              type="button"
              disabled={disablebutton}
              className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              Apply Filter
            </button>

            <div className="flex gap-3">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    {selectedValue}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="single"
                  onSelectionChange={(status) => handleStanadardFilter(status)}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {status.name.charAt(0).toUpperCase() +
                        status.name.slice(1)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-5">
        <Table
          aria-label="Contact table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                siblings={3}
                loop
                showControls
                showShadow
                color="default"
                //initialPage={page}
                page={page}
                total={pages}
                onChange={(page) => handlePageChange(page)}
                // onChange={page => setPage(page)}
              />
            </div>
          }
          bottomContentPlacement="outside"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          isStriped
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                {...(column.key === "FirstName" ? { allowsSorting: true } : {})}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={users}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <GetContact
          onClose={handleOnClose}
          visible={showMyModal}
          filterVal={filterValueforexcel}
        />
      </div>
    </>
  );
};

export default ContactList;
