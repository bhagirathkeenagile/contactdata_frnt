"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  getKeyValue,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { SearchIcon } from "../contacts/icons";
import { useEffect, useState } from "react";
import FilterControl from "react-filter-control";
import { IFilterControlFilterValue } from "react-filter-control/interfaces";
import { filterData } from "./filterData";
import HeaderDropdown from "./filters/headerDropdown";
import GetContact from "./model/getContacts";
import axios from "axios";
import { BASE_URL } from "../../../../utils";
const headerColumns = [
  { name: "Name", uid: "Name" },
  { name: "Number Of Employees", uid: "NumberOfEmployees" },
  { name: "Type", uid: "Type" },  
  { name: "Marketing Suppression", uid: "Marketing_Suppression" },
  { name: "Revenue($)", uid: "Revenue" },
];
const fields = [
  {
    caption: "Name",
    name: "Name",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Does not Contain",
        name: "doesNotContain",
      },
      {
        caption: "Equals",
        name: "=",
      },
    ],
  },
  {
    caption: "BillingAddress",
    name: "BillingAddress",
    operators: [
      {
        caption: "Contains",
        name: "contains",
      },
      {
        caption: "Equals",
        name: "=",
      },
      {
        caption: "Does not Contain",
        name: "doesNotContain",
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
const AccountList = () => {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterValue1, setFilterValue] = React.useState("");
  const [searchText, setSearchText] = useState("");
  const [showMyModal, setShowMyModel] = useState(false);
  const handleOnClose = () => setShowMyModel(false);
  const [filterValue, changeFilter] = useState(filter);
  const onFilterChanged = (newFilterValue: IFilterControlFilterValue) => {
    changeFilter(newFilterValue);
  };
  const [accounts, setAccounts] = useState<any>([]);
  const [accountintable, setaccountintable] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasfilter,sethasfilter] = useState<boolean>(false)
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    if(!hasfilter){
    fetchData();
    }
  }, [page]);
  const fetchData = async () => {
    console.log("response", isLoading, "loadingState", loadingState);
    const response = await axios.post(
      `${BASE_URL}/map/get-account?page=${page}&pageSize=${rowsPerPage}`
    );
    if (response.status === 201) {
      const totalPages = Math.ceil(response.data.totalContacts/rowsPerPage);
      const roundedTotalPages = Math.max(Math.ceil(totalPages), 1);
      setPages(roundedTotalPages);
      console.log("response 1", response);
      setAccounts(response.data.accounts);
      setaccountintable(
        response.data.accounts.map((account: any) => {
          return {
            Name: account.Name,
            NumberOfEmployees: account.NumberOfEmployees,
            Marketing_Suppression:account.Marketing_Suppression__c,
            Revenue:account.Revenue__c,
            id: account.id,
          };
        })
      );
      setIsLoading(false);
    }
  };
  const [newConvertedData,setnewConvertedData] = useState("");
  useEffect(() => {
    if(searchText.length>4){

    console.log("searchText", searchText);
    const filter=('{"Name":{"contains":"'+searchText+'"}}');
    sethasfilter(true);
    setIsLoading(true);
    fetchfilterData(filter)
    }
    if(searchText.length===0){
      fetchData();
    }
  }, [searchText,page]);
  const fetchfilterData = async (filter:any) => {
    console.log("response", isLoading, "loadingState", loadingState);
    const response = await axios.post(
      `${BASE_URL}/map/get-account-filter?page=${page}&pageSize=${rowsPerPage}`,
      {filterval: filter,filterseconf: "1",}
    );
    if (response.status === 201) {
      setIsLoading(false)
      const totalPages = Math.ceil(response.data.totalContacts/rowsPerPage);
      const roundedTotalPages = Math.max(Math.ceil(totalPages), 1);
      setPages(roundedTotalPages);
      console.log("response 1", response);
      setAccounts(response.data.accounts);
      setaccountintable(
        response.data.accounts.map((account: any) => {
          return {
            Name: account.Name,
            NumberOfEmployees: account.NumberOfEmployees,
            Marketing_Suppression:account.Marketing_Suppression__c,
            Revenue:account.Revenue__c,
            id: account.id,
          };
        })
      );
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: any) => {
    setPage(newPage);
    //  fetchData();
    console.log("test 2222", newPage);
  };
  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );
  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const finalpaginatedaccount = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    console.log("start end ", start, end, accountintable);
    return accountintable.slice(start, end);
  }, [page, accountintable, rowsPerPage]);
  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue1}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1 items-center flex">
          <h2 className="text-sm font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight inline-block">
            Account List
          </h2>
          <HeaderDropdown />
        </div>
      </div>

      <div className="bg-white my-2 px-6 py-3 shadow-sm">
        {/* <FilterControl
          {...{
            fields,
            groups,
            filterValue,
            onFilterValueChanged: onFilterChanged,
          }}
        /> */}
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
        <div className="relative shadow-md sm:rounded-lg">
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            isStriped
            bottomContent={
              <>
                {/* <div className="flex justify-between items-center">
                  <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                      className="bg-transparent outline-none text-default-400 text-small"
                      onChange={onRowsPerPageChange}
                      defaultValue="10"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>
                  </label>
                </div> */}
                <div className="flex w-full justify-center">
                  <Pagination
                    siblings={3}
                    loop
                    isCompact
                    showControls
                    showShadow
                    color="default"
                    page={page}
                    total={pages}
                    onChange={(page) => handlePageChange(page)}
                  />
                </div>
              </>
            }
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            topContentPlacement="outside"
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={accountintable ?? []}
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
          {/* <Table
            columns={[
              { key: "Name", title: "Name", dataType: DataType.String },
              {
                key: "BillingAddress",
                title: "Billing Addess",
                dataType: DataType.String,
              },
            ]}
            data={
              accounts &&
              accounts.map((account: any) => {
                return {
                  Name: account.Name,
                  BillingAddress: `${account.BillingCity}, ${account.BillingState}`,
                  id: account.id,
                };
              })
            }
            // editingMode={EditingMode.Cell}
            rowKeyField={"id"}
            extendedFilter={(data) => filterData(data, filterValue)}
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
            paging={{
              enabled: true,
              pageIndex: 0,
              pageSize: 10,
              pageSizes: [5, 10, 15],
              position: PagingPosition.Bottom,
            }}
          /> */} 
        </div>
      </div>
      {/* <div>
        <GetContact onClose={handleOnClose} visible={showMyModal} />
      </div> */}
    </>
  );
};

export default AccountList;
