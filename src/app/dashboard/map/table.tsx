import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ActionMenu from "./filters/actionMenu";
import { useState } from "react";
import { write, utils } from "xlsx";
import { saveAs } from "file-saver";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MapTable = ({ mapList }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // starting number of rows per page
  const [searchValue, setSearchValue] = useState(""); // serching part from maplist
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemValue, setSelectedItemValue] = useState(""); //Action menu selected option

  const people = mapList;
  const totalItems = people.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // serch functions
  const filteredData = people.filter((person: any) =>
    person.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Slice the people array to get data for the current page
  const currentPageData = filteredData.slice(startIndex, endIndex);

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

  // export data in excel format
  const handleExportExcel = () => {
    const data = [
      ["Name", "Main Table", "Import Action", "Created At", "Updated At"],
      ...people.map((person: any) => [
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

    const blob = new Blob([write(wb, { bookType: "xlsx", type: "array" })], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "data.xlsx");
  };

  //Action menu function for selection
  const handleItemSelected = (item: any, itemId: any) => {
    console.log("handleItemS", item, itemId);
    setSelectedItemId(itemId);
    setSelectedItemValue(item);
  };

  return (
    <>
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
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 mr-3 rounded-md bg-green-400 px-3.5 py-2.5 text-white text-xs font-semibold  shadow-sm  focus-visible:outline"
              onClick={handleExportExcel}
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
              className="inline-flex items-center gap-x-2 rounded-md bg-green-100 px-3.5 py-2.5 text-xs font-semibold shadow-sm"
            >
              <img
                src={new URL("public/excel.png", import.meta.url).toString()}
                className="-ml-0.5 h-4"
                aria-hidden="true"
              />
              Export As CSV
            </button>
          </div>
        </div>
      </div>
      {/* maplist data table  */}
      <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto min-h-screen-full">
        <div className="flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle ">
              <table className="min-w-full shadow-sm  border-separate border-spacing-0">
                <thead className="bg-gray-300">
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-2 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter pl-4"
                    >
                      <a href="#" className="group inline-flex">
                        Actions
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      <a href="#" className="group inline-flex">
                        Name
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      <a href="#" className="group inline-flex w-32">
                        Main Table
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      <a href="#" className="group inline-flex w-36">
                        Import Action
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      <a href="#" className="group inline-flex w-32">
                        Created At
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      <a href="#" className="group inline-flex w-28">
                        Updated At
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((person: any, personIdx: any) => (
                    <tr key={person.id} className="divide-x divide-gray-200">
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        <ActionMenu
                          onItemSelected={handleItemSelected}
                          selectedId={person.id}
                        />
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.name}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.mainTable}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.action}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {dateConverter(person.created_at)}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 pt-3 text-sm text-gray-500"
                        )}
                      >
                        {dateConverter(person.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <nav
          className="flex items-center justify-between py-4 px-4"
          aria-label="Table navigation"
        >
          <select
            id="rowsPerPage"
            name="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="mt-2 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value={1}>1 rows</option>
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
          </select>
          <span className="text-sm font-normal text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {startIndex + 1}-{Math.min(endIndex, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{totalItems}</span>
          </span>

          {/* right side pagination for page change  */}
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-2 leading-tight border border-gray-300 ${
                    index + 1 === currentPage
                      ? "bg-[#009EF7] text-white"
                      : "hover:bg-gray-100 hover:text-gray-300"
                  }`}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(prevPage + 1, totalPages)
                  )
                }
                className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-300"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MapTable;
