"use client";
import GetContact from "./model/getContacts";
import { use, useEffect, useMemo, useState } from "react";
import HeaderDropdown from "./filters/headerDropdown";
import { DataType, Table } from "ka-table";
import { SortingMode, PagingPosition, EditingMode } from "ka-table/enums";
import FilterControl from "react-filter-control";
import { IFilterControlFilterValue } from "react-filter-control/interfaces";
import { filterData } from "./filterData";
import CustomPagination from "./custompageination";
import axios from "axios";
import { BASE_URL } from "../../../../utils";


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
 const filter: IFilterControlFilterValue = {
  groupName: "and",
  items: [],
};
const ContactList = () => {
  const [searchText, setSearchText] = useState("");
  const [showMyModal, setShowMyModel] = useState(false);
  const handleOnClose = () => setShowMyModel(false);
  const [filterValue, changeFilter] = useState<any>(filter);
  const [headerData, setheaderData] = useState([])
  const onFilterChanged = (newFilterValue: IFilterControlFilterValue) => {
    changeFilter(newFilterValue);
  };
  const [contacts, setContacts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showTableHeader, setShowTableHeader] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(1); // 1-based index
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchData(pageIndex: any, pageSize: any) {
    try {
      const response = await axios.get(`${BASE_URL}/map/get-contacts?page=${pageIndex}&pageSize=${pageSize}`);
      if (response.status === 200) {
        const data = response.data;
        allContactData()
        setContacts(data.contacts);
        setTotalPages(Math.ceil(data.totalContacts / pageSize));
        setLoading(false);
      } else {
        console.error("Failed to fetch data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  async function allContactData() {
    try {
      const response = await axios.get(`${BASE_URL}/map/list-contactData`);
      if (response.status === 200) {
        const data = response.data;
        if ((filterValue.items[0])?.value.length > 0) {
          console.log("from if setContacts(data.contacts);")
          setContacts(data.contacts);
        }
        setLoading(false);
      } else {
        console.error("Failed to fetch data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);


  // Function to handle page change
  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };


  // Function to handle page size change
  const handlePageSizeChange = (newSize: any) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page when changing page size
  };




  const updateRingLeadScore = async () => {
    try {
      const response = await fetch(`/api/ringLoadScore`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response) {
        console.log("ringLeadScore Updated successfully")
      }
    } catch (error) {
      console.error(error);
    }
  }
  const dynamicColumnss = headerData.map((item: any) => ({
    key: item.value,
    title: item.label,
    dataType: DataType.String // You may need to define DataType according to your needs
  }));


  const dynamicColumns =
    [
      { key: "Account", title: "Account", dataType: DataType.String },
      { key: "FirstName", title: "First Name", dataType: DataType.String },
      { key: "LastName", title: "Last Name", dataType: DataType.String },
      { key: "RingLeadScore", title: "RingLead Score", dataType: DataType.String },
    ];
  useEffect(() => {

    if (typeof window !== 'undefined') {
      // Your code that depends on the window object
      const url = new URL(window.location.href);
    const encodedData = url.searchParams.get("data");
    if (encodedData) {
      const decodedData = decodeURIComponent(encodedData);
      const dataObject = JSON.parse(decodedData);
      setheaderData(JSON.parse(dataObject.content));
    }
  } else {
    console.log('window is undefined');
  } }, [])
  const mapContactsToTableFormat = (contacts: any, header: any) => {
    if (header.length > 0) {
      return contacts.map((contact: any) => {
        const mappedData: any = {};
        header.forEach((column: any) => {
          const { value } = column;
          mappedData[value] = contact[value];
        });
        return mappedData;
      });
    }
    else {
      return false
    }
  };


  useEffect(() => {
    async function fetchData(data: any) {
      if (data.length > 0) {
        setShowTableHeader(dynamicColumnss)
      } else if (data.length === 0) {
        setShowTableHeader(dynamicColumns)
      }
    }
    fetchData(headerData);
    const tableDataa = mapContactsToTableFormat(contacts, headerData);
    setTableData(tableDataa)


  }, [headerData, contacts])


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
          <button
            onClick={() => updateRingLeadScore()}
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Update RingLead Score
          </button>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => setShowMyModel(true)}
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Get Included Contacts
          </button>
        </div>
      </div>


      <div className="bg-white my-2 px-6 py-3 shadow-sm">
        <FilterControl
          {...{
            fields,
            groups,
            filterValue,
            onFilterValueChanged: onFilterChanged,
          }}
        />
        <div>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center justify-between">
              <label className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search"
                  value={searchText}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {loading ? <div className="loader-container">
          <div className="loader"></div>
        </div> :
          <div className="relative shadow-md sm:rounded-lg">
            <Table
              columns={showTableHeader}
              data={tableData ? tableData : contacts &&
                contacts.map((contact: any) => {
                  return {
                    id: contact.id,
                    Account: contact.Account?.Name,
                    FirstName: contact.FirstName,
                    LastName: contact.LastName,
                    RingLeadScore: contact.RingLead_Score__c,
                  };
                })}
              // editingMode={EditingMode.Cell}
              rowKeyField={"id"}
              extendedFilter={((data) => filterData(data, filterValue))}
              search={({ searchText: searchTextValue, rowData, column }) => {
                if (column.key === "passed") {
                  return (
                    (searchTextValue === "false" && !rowData.passed) ||
                    (searchTextValue === "true" && rowData.passed)
                  );
                }
              }}
              searchText={searchText}
              sortingMode={SortingMode.Single}
            // paging={pagingOptions}
            />
            <div className="pagination-controls flex justify-between p-2">
              <div className="page-size-options">
                <button
                  className={`page-size-option ${pageSize === 5 ? "selected" : ""}`}
                  onClick={() => handlePageSizeChange(5)}
                >
                  5
                </button>
                <button
                  className={`page-size-option ${pageSize === 10 ? "selected" : ""}`}
                  onClick={() => handlePageSizeChange(10)}
                >
                  10
                </button>
                <button
                  className={`page-size-option ${pageSize === 15 ? "selected" : ""}`}
                  onClick={() => handlePageSizeChange(15)}
                >
                  15
                </button>
              </div>
              <CustomPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>}
      </div>
      <div>
        <GetContact onClose={handleOnClose} visible={showMyModal} filterVal={filterValue} />
      </div>
    </>
  );
};


export default ContactList;



