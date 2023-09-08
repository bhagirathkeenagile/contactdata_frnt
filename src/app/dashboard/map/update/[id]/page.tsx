"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { BASE_URL } from "../../../../../../utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useHistory } from 'react-router-dom';

const importAction = [
  { label: "Insert Only", value: "insert" },
  { label: "Update", value: "update" },
  { label: "Insert And Update", value: "insert_update" },
];

const steps = [
  { id: "01", name: "Step 1", href: "#", status: "complete" },
  { id: "02", name: "Step 2", href: "#", status: "current" },
  { id: "03", name: "step 3", href: "#", status: "upcoming" },
];

const people = [
  {
    name: "contacts",
    mainTable: "AccountId",
    importAction: "accounts",
    createdAt: "id",
    updatedAt: "  parent",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const router = useRouter();
const CreateNewMap = ({ params }: { params: { id: string } }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const getMapDetails = async () => {
      const res = await fetch(`/api/mapList/data?id=${params.id}`);
      const data = await res.json();
      console.log("logger-->", data.body.mapData);
      setMapName(data.body.mapData.name);
      setSelectedValue({ label: data.body.mapData.mainTable });
      // @bhagirath pleae complete this
    };
    getMapDetails();
  }, []);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const [mapName, setMapName] = useState("");
  const [relationOptions, setRelationOptions] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState({ label: "Contacts" });
  const [selectedRelation, setSelectedRelation] = useState<any[]>([]);
  const [excelRows, setSelectedexcelRows] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [selectedTableRows, setselectedTableRows] = useState([
    { table: "", name: "" },
  ]);
  const [tableName, setTableName] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState(Array(excelRows));
  const [targetFieldName, setTargetFieldName] = useState<string | any>([
    { table: "", name: "", excelHeader: "", mapped: "" },
  ]);
  const [optionData, setOptionData] = useState<any[]>([]);
  const [viewSelectedRelations, setViewSelectedRelations] = useState<any[]>([]);
  const [fileSelected, setFileSelected] = useState("");
  const [errorMsgSelectedRelation, setErrorMsgSelectedRelation] = useState("");
  const [action, setAction] = useState({
    label: "Insert Only",
    value: "insert",
  });

  // Validation states
  const [errorMsgMapName, setErrorMsgMapName] = useState("");
  const [errorMsgFileSelected, setErrorMsgFileSelected] = useState("");
  const [ruleSet, setRuleSet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/mapdata`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setRuleSet(data.body.tables);

        data.body.tables.map((item: any) => {
          if (item.displayPublic) {
            if (tableName.includes(item.name)) return;
            setTableName((prev: any) => [...prev, item.name]);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const handleSelectChangee = (index: any, selectedOption: any) => {
    const updatedValues = [...selectedValues];
    updatedValues[index] = selectedOption.label;
    setSelectedValues(updatedValues);
  };

  const handleMapNameChange = (event: any) => {
    setMapName(event.target.value);
    setErrorMsgMapName("");
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];

    if (!file) {
      setFileSelected("");
      setErrorMsgFileSelected("Please select a file.");
    } else {
      setFileSelected(file);
      setErrorMsgFileSelected("");
    }
  };

  const handleNextButtonClick = async () => {
    let isValid = true;
    if (mapName.trim() === "") {
      setErrorMsgMapName("Map Name is required.");
      isValid = false;
    }
    if (!fileSelected) {
      setErrorMsgFileSelected("Please select a file.");
      isValid = false;
    }
    if (selectedRelation.length === 0) {
      setErrorMsgSelectedRelation(
        "Please select at least one table relationship."
      );
    }
    if (isValid) {
      if (fileSelected) {
        try {
          const formData = new FormData();
          formData.append("file", fileSelected);
          formData.append("targetTable", selectedValue.label);

          const response = await fetch(`${BASE_URL}/excel/upload`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Request failed with status: " + response.status);
          }

          const data = await response.json();
          console.log("Data-data->" + data);
          setSelectedexcelRows(data.keyFromExcel);
          setselectedTableRows(data.tableData);
          setFilePath(data.filePath);
        } catch (error: any) {}
      }
      const optionData: any[] = [];
      ruleSet.map((table: any) =>
        table.fields.map((columns: any) => {
          if (table.displayPublic) {
            if (columns.displayPublic) {
              optionData.push({
                value: `${table.name}-${columns.name}`,
                label: `${table.name}-${columns.name} ${
                  columns.required ? "(required)" : ""
                }`,
              });
            }
          }
        })
      );
      setOptionData(optionData);
      nextStep();
    }
  };

  const handleClickfor2ndpage = async () => {
    const selectedTableRows = selectedValues.map((item: any, index: any) => {
      const [table, name] = item?.split("-");
      return {
        //table: table.toLowerCase(),
        //name: name.toLowerCase(),
        table: table,
        name: name,
        excelHeader: excelRows[index],
        mapped: "Mapped",
        columnName: name,
      };
    });
    const getUnmappedRows = optionData.filter((item: any) => {
      const isLargeNumber = (element: any) => {
        return (
          item.value.toLowerCase() ===
          `${element.table.toLowerCase()}-${element.name.toLowerCase()}`.trim()
        );
      };
      if (selectedTableRows.find(isLargeNumber) === undefined) {
        return true;
      }
      return false;
    });
    const unmappedRows = getUnmappedRows.map((item: any) => {
      return {
        table: item.value.split("-")[0].toLowerCase(),
        name: item.value.split("-")[1].toLowerCase(),
        excelHeader: "",
        mapped: "Unmapped",
        columnName: "",
      };
    });
    setTargetFieldName([...selectedTableRows, ...unmappedRows]);
  };

  const importData = async () => {
    const importData = {
      name: mapName,
      mainTable: selectedValue.label,
      filePath: filePath,
      mapping: JSON.stringify(targetFieldName).toString(),
      status: "uploaded",
      action: action.label,
      isDeleted: false,
    };
    try {
      const response = await fetch(`${BASE_URL}/map/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(importData),
      });

      if (response.ok) {
        console.log("Post created successfully");
        router.push("/map");
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm leading-7 sm:truncate sm:text-lg sm:tracking-tight">
            Create Map
          </h2>
        </div>
      </div>

      <div className="bg-white my-2 px-4 py-3 shadow-sm m-3">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
          >
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                {step.status === "complete" ? (
                  <a
                    href={step.href}
                    className="group flex w-full items-center"
                  >
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      {/* <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 group-hover:bg-blue-600"> */}
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                        {/* <CheckIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        /> */}
                        <span className="text-gray-500">{step.id}</span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </a>
                ) : step.status === "current" ? (
                  <a
                    href={step.href}
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <span className="text-gray-500">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </a>
                ) : (
                  <a href={step.href} className="group flex items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                        <span className="text-gray-500 group-hover:text-gray-900">
                          {step.id}
                        </span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </a>
                )}

                {stepIdx !== steps.length - 1 ? (
                  <>
                    {/* Arrow separator for lg screens and up */}
                    <div
                      className="absolute right-0 top-0 hidden h-full w-5 md:block"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-full w-full text-gray-300"
                        viewBox="0 0 22 80"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 -2L20 40L0 82"
                          vectorEffect="non-scaling-stroke"
                          stroke="currentcolor"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>

        {step === 1 && (
          <div>
            <div className="mt-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Map Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="assets"
                    id="mapName"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder=""
                    value={mapName}
                    onChange={handleMapNameChange}
                  />
                  {errorMsgMapName && (
                    <div className="text-red-500">{errorMsgMapName}</div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    name="assets"
                    id="assets"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="0"
                    onChange={handleFileInputChange}
                  />
                  {errorMsgFileSelected && (
                    <div className="text-red-500">{errorMsgFileSelected}</div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <label
                  htmlFor="targetMainTable"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Target Main Table <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <Select
                    id="targetMainTable"
                    className="basic-single"
                    classNamePrefix="select"
                    name="color"
                    options={tableName.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(selectedOption: any) => {
                      setSelectedValue(selectedOption);
                      ruleSet.map((item: any) => {
                        if (item.name === selectedOption.label) {
                          setRelationOptions(item.relationShips);
                        }
                      });
                    }}
                    value={selectedValue}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Table Relationships <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-multi-select"
                    classNamePrefix="select"
                    name="color"
                    options={
                      relationOptions && relationOptions.length
                        ? relationOptions.map((item) => ({
                            value: item.name,
                            label: `${item.name}_(${item.type})_${item.sourceTable}`,
                          }))
                        : [
                            {
                              label: "No Relation",
                              value: "No Relation",
                            //  isDisabled: true,
                            },
                          ]
                    }
                    onChange={(selectedOption: any) => {
                      setSelectedRelation(selectedOption);
                    }}
                    isMulti
                  />
                </div>

                {selectedRelation.length > 0 ? (
                  <div className="mt-2">
                    <table className="min-w-full shadow-sm  border-separate border-spacing-0">
                      <thead className="bg-gray-300">
                        <tr className="divide-x divide-gray-200">
                          <th
                            scope="col"
                            className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                          >
                            <span className="group inline-flex">
                              Source Table
                            </span>
                          </th>

                          <th
                            scope="col"
                            className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                          >
                            <span className="group inline-flex w-32">
                              Source Table Field
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                          >
                            <span className="group inline-flex w-28">
                              Target Table
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                          >
                            <span className="group inline-flex w-32">
                              Target Table Field
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                          >
                            <span className="group inline-flex w-32">
                              Relationship Type
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {relationOptions &&
                          relationOptions.map((table: any, tableIdx: number) =>
                            selectedRelation.find(
                              (element: any) => element.value === table.name
                            ) ? (
                              <tr
                                key={table.name}
                                className="divide-x divide-gray-200"
                              >
                                <td
                                  className={classNames(
                                    tableIdx !== relationOptions.length - 1
                                      ? "border-b border-gray-200"
                                      : "",
                                    "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                                  )}
                                >
                                  {table.name}
                                </td>
                                <td
                                  className={classNames(
                                    tableIdx !== relationOptions.length - 1
                                      ? "border-b border-gray-200"
                                      : "",
                                    "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                                  )}
                                >
                                  {table.sourceTableField}
                                </td>
                                <td
                                  className={classNames(
                                    tableIdx !== relationOptions.length - 1
                                      ? "border-b border-gray-200"
                                      : "",
                                    "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                                  )}
                                >
                                  {table.targetTable}
                                </td>
                                <td
                                  className={classNames(
                                    tableIdx !== relationOptions.length - 1
                                      ? "border-b border-gray-200"
                                      : "",
                                    "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                                  )}
                                >
                                  {table.targetTableField}
                                </td>
                                <td
                                  className={classNames(
                                    tableIdx !== relationOptions.length - 1
                                      ? "border-b border-gray-200"
                                      : "",
                                    "whitespace-nowrap px-3 py-2 pt-3 text-sm text-gray-500"
                                  )}
                                >
                                  {table.relationType}
                                </td>
                              </tr>
                            ) : (
                              <>No Relationships Found</>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {errorMsgSelectedRelation && (
                  <div className="text-red-500">{errorMsgSelectedRelation}</div>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Import action on <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  {/* make this satatic for a time  */}
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="color"
                    options={importAction}
                    onChange={(selectedOption: any) => {
                      setAction(selectedOption);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
                onClick={() => {
                  handleNextButtonClick();
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* 2nd page start here  */}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-base font-bold"> Header Columns</p>
              <p className="text-base font-bold"> Field Name</p>
            </div>

            {/* here i have to map  */}
            {excelRows.map((value, index) => (
              <div className="grid grid-cols-2 gap-4 border p-3">
                <div key={index}>
                  <input
                    type="text"
                    name={`field_${index}`} // You can set a unique name for each input field if needed
                    id={`field_${index}`} // You can set a unique id for each input field if needed
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm leading-input"
                    value={value}
                    readOnly
                  />
                </div>

                <div>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name={`color_${index}`}
                    options={optionData}
                    onChange={(selectedOption) =>
                      handleSelectChangee(index, selectedOption)
                    }
                  />
                </div>
              </div>
            ))}

            <div className="mt-5 sm:mt-4 sm:flex justify-end col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
                onClick={() => {
                  handleClickfor2ndpage();
                  nextStep();
                }}
              >
                Next
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-gray-100 px-4 py-2 text-xs text-gray-700 shadow-sm"
                onClick={() => {
                  prevStep();
                }}
              >
                back
              </button>
            </div>
          </div>
        )}
        {/* 3rd page start here  */}
        {step === 3 && (
          <div className="mt-2">
            <table className="min-w-full shadow-sm  border-separate border-spacing-0">
              <thead className="bg-gray-300">
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    <span className="group inline-flex">Excel Header</span>
                  </th>

                  <th
                    scope="col"
                    className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    <span className="group inline-flex w-32">
                      Target Table Name
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    <span className="group inline-flex w-32">
                      Target Field Name
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    <span className="group inline-flex w-32">Is Mapped</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {targetFieldName.map((person: any, personIdx: any) => (
                  <tr key={person.name} className="divide-x divide-gray-200">
                    <td
                      className={classNames(
                        personIdx !== people.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                      )}
                    >
                      {person.excelHeader}
                    </td>
                    <td
                      className={classNames(
                        personIdx !== people.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                      )}
                    >
                      {person.table}
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
                      {person.mapped}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 sm:mt-4 sm:flex justify-end col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
                onClick={() => {
                  console.log("import clicked");
                  importData();
                  <Link href="/map"></Link>;
                }}
              >
                Import
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateNewMap;
