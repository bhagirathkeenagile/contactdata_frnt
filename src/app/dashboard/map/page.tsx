"use client";
import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
// import MapTable from "./table";
import { useState, useEffect, useMemo } from "react";
import {VerticalDotsIcon} from "../contacts/icons";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, 
  DropdownTrigger,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,getKeyValue} from "@nextui-org/react";

import { utils, write } from "xlsx";
const dataArray = Array(10)
  .fill(undefined)
  .map((_, index) => ({
    column1: `column:1 row:${index}`,
    column2: `column:2 row:${index}`,
    column3: `column:3 row:${index}`,
    column4: `column:4 row:${index}`,
    id: index,
  }));
import { saveAs } from "file-saver";
import ActionMenu from "./filters/actionMenu";
import axios from "axios";
import { BASE_URL } from "../../../../utils";
const columns = [
  {name: "", uid: "actions"},
  { name: "Name", uid: "column1", sortable: true },
  { name: "Main Table", uid: "column2", sortable: true },
  { name: "Created At", uid: "column3", sortable: true },
  { name: "Updated At", uid: "column4" },
];
const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
const INITIAL_VISIBLE_COLUMNS = ["column1", "column2", "column3", "column4"];
export default function MapList() {
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [mapList, setMapList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pagescount, setPages] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const rowsPerPage: number = 10;
  const pages: number = useMemo(() => {
    return Math.ceil(pagescount / rowsPerPage);
  }, [pagescount, rowsPerPage]);
  // create data and update function
  const dateConverter = (date: any) => {
    const inputDate = date;
    const parsedDate = new Date(inputDate);
    const formattedDate = parsedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/api/mapList`, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       const data = await response.json();
  //       setMapList(data.body.mapListData);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/map/list-mapData`); // Use axios.get instead of fetch
      const data = response.data;
      setPages(response!.data.length);
      setMapList(
        data.mapListData.map((item: any) => {
          return {
            column1: item.name,
            column2: item.mainTable,
            column3: `${new Date(
              item.created_at
            ).toLocaleDateString()} ${new Date(
              item.created_at
            ).toTimeString()}`,
            column4: `${new Date(
              item.updated_at
            ).toLocaleDateString()} ${new Date(
              item.updated_at
            ).toLocaleTimeString()}`,
            id: item.id,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // export data in excel format
  const handleExportExcel = (bookType: "excel" | "csv") => {
    const data = [
      ["Name", "Main Table", "Import Action", "Created At", "Updated At"],
      ...mapList.map((person: any) => [
        person.name,
        person.mainTable,
        person.action,
        dateConverter(person.created_at),
        dateConverter(person.updated_at),
      ]),
    ];
    
    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    const blob = new Blob(
      [
        write(wb, {
          bookType: bookType === "excel" ? "xlsx" : "csv",
          type: "array",
        }),
      ],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "data.xlsx");
  };
    type User = typeof mapList[0];
    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];
  
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "status":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <ActionMenu/>
              {/* <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon/>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Clone</DropdownItem>
                  <DropdownItem>Remove</DropdownItem>
                </DropdownMenu>
              </Dropdown> */}
            </div>
          );
        default:
          return cellValue;
      }
    }, []);

  //Action menu function for selection
  const handleItemSelected = (item: any, itemId: any) => {
    fetchData();
  };
  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const handlePageChange = (newPage: any) => {
    setPage(newPage);
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight">
            Map List
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {/* <Filter /> */}
          <a
            href="/dashboard/map/create"
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <PlusCircleIcon
              className="-ml-0.5 h-5 w-5 text-blue-100"
              aria-hidden="true"
            />
            Create New
          </a>
        </div>
      </div>

      <div className="bg-white my-2 px-6 py-3 shadow-sm">
        <div className="relative shadow-md sm:rounded-lg">
          <div>
            <div className="flex justify-between items-center px-4 py-3">
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
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 mr-3 rounded-md bg-green-400 px-3.5 py-2.5 text-white text-xs font-semibold  shadow-sm  focus-visible:outline"
                  onClick={() => handleExportExcel("excel")}
                >
                  <img
                    src={new URL("public/csv.png", import.meta.url).toString()}
                    alt="Precedent Logo"
                    className="h-4 opacity-95"
                  />
                  Export As Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleExportExcel("csv")}
                  className="inline-flex items-center gap-x-2 rounded-md bg-green-100 px-3.5 py-2.5 text-xs font-semibold shadow-sm"
                >
                  <img
                    src={new URL(
                      "public/excel.png",
                      import.meta.url
                    ).toString()}
                    className="-ml-0.5 h-4"
                    aria-hidden="true"
                  />
                  Export As CSV
                </button>
              </div>
            </div>
          </div>
          <>
            <Table aria-label="Example table with custom cells" isStriped>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={mapList}>
                {(item) => (
                  <TableRow key={item}> 
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* <Table
              columns={[
                {
                  key: "command1",
                  style: { textAlign: "center" },
                  width: 70,
                },
                { key: "column1", title: "Name", dataType: DataType.String },
                {
                  key: "column2",
                  title: "Main Table",
                  dataType: DataType.String,
                },
                {
                  key: "column3",
                  title: "Created At",
                  dataType: DataType.Date,
                },
                {
                  key: "column4",
                  title: "Updated At",
                  dataType: DataType.Date,
                },
              ]}
              // data={dataArray}
              data={mapList.map((item: any, index) => {
                return {
                  column1: item.name,
                  column2: item.mainTable,
                  column3: `${new Date(
                    item.created_at
                  ).toLocaleDateString()} ${new Date(
                    item.created_at
                  ).toTimeString()}`,
                  column4: `${new Date(
                    item.updated_at
                  ).toLocaleDateString()} ${new Date(
                    item.updated_at
                  ).toLocaleTimeString()}`,
                  id: item.id,
                };
              })}
              search={({ searchText: searchTextValue, rowData, column }) => {
                if (column.key === "passed") {
                  return (
                    (searchTextValue === "false" && !rowData.passed) ||
                    (searchTextValue === "true" && rowData.passed)
                  );
                }
              }}
              searchText={searchText}
              // editingMode={EditingMode.Cell}
              rowKeyField={"id"}
              sortingMode={SortingMode.Single}
              paging={{
                enabled: true,
                pageIndex: 0,
                pageSize: 10,
                pageSizes: [10, 20, 50],
                position: PagingPosition.Bottom,
              }}
              childComponents={{
                cellText: {
                  content: (props) => {
                    switch (props.column.key) {
                      case "command1":
                        return (
                          <ActionMenu
                            onItemSelected={handleItemSelected}
                            selectedId={props.rowData.id}
                            {...props}
                          />
                        );
                    }
                  },
                },
              }}
            /> */}
          </>
        </div>
      </div>
    </>
  );
};


