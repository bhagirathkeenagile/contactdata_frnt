"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { BASE_URL } from "../../../../../utils";
import axios from "axios";
import { useRouter } from "next/navigation";

const importAction = [
  { label: "Insert And Update", value: "insert_update" },
  { label: "Insert Only", value: "insert" },
  { label: "Update", value: "update" },
  
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
    updatedAt: "parent",
  },
];

const sampleData = [
  {
    firstname: "jhon",
    lastname: "batista",
    email: "jhon@gmail.com",
  },
  {
    firstname: "jhon1",
    lastname: "batista1",
    email: "jhon@gmail.com1",
  },
  {
    firstname: "jhon2",
    lastname: "batista2",
    email: "jhon@gmail.com2",
  },
  {
    firstname: "jhon3",
    lastname: "batista3",
    email: "jhon@gmail.com3",
  }
  ,
  {
    firstname: "jhon4",
    lastname: "batista4",
    email: "jhon@gmail.com4",
  },
  {
    firstname: "jhon5",
    lastname: "batista5",
    email: "jhon@gmail.com5",
  }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}


const CreateNewMap = () => {
  const [step, setStep] = useState(1);
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const nextStepImport = () => {
    setStep((prevStep) => prevStep + 2);
  }
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };


  const [mapName, setMapName] = useState("");
  const [relationOptions, setRelationOptions] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState({ label: "Accounts" });
  const [selectedRelation, setSelectedRelation] = useState<any[]>([]);
  const [excelRows, setSelectedexcelRows] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [selectedTableRows, setselectedTableRows] = useState([
    { table: "", name: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [tableName, setTableName] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState(Array(excelRows));
  //const [editMappingData, setEditMappingData] = useState([]);
  const [editMappingData, setEditMappingData] = useState<{ value: any; label: string }[]>([]);
  const [targetFieldName, setTargetFieldName] = useState<string | any>([
    { table: "", name: "", excelHeader: "", mapped: "" },
  ]);
  const [optionData, setOptionData] = useState<any[]>([]);
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
  const [readOnlyForImport, setReadOnlyForImport] = useState<boolean>(false);
  const [importTable, setImportTable] = useState([]);
  let url = null;
  // get INformation from Url
  if (typeof window !== 'undefined') {
    url = new URL(window.location.href);
  }
  const searchParams = new URLSearchParams(url ? url.search : '');
  const actionParam = searchParams.get("action"); // provide about action 
  const idValue = searchParams.get("id");
  const mapUpdateid = idValue?.split(' ')[0]; // provide id from param 



  // useefect for ruleset data 
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

  
  // useefect for action autofill
  //const editMappingData: any[] = [];
  useEffect(() => {

    const fetchMapDataById = async () => {
      // console.log("isnside from mafetchDataById")
      try {
        const dataResponse = await axios.get(`${BASE_URL}/map/findMapDataById/${mapUpdateid}`); // provied selected data by id 
        // console.log("dataresponse =={ line 149 }",dataResponse);
        setReadOnlyForImport(true)
        setMapName((dataResponse.data.mapFiledData).name) // set Map Name 
        const foundItem = importAction.find(item => item.label === (dataResponse.data.mapFiledData).action);
        const actionValue = foundItem?.value ? foundItem.value : '';
        setAction({ label: (dataResponse.data.mapFiledData).action, value: actionValue, }) //set action value
        setSelectedValue({ label: (dataResponse.data.mapFiledData).mainTable }) //set selected table value

        // set data in Main Table Name 
        ruleSet.map((item: any) => {
          if (item.name === selectedValue.label) {
            setRelationOptions(item.relationShips);
          }
        });

        // set data in relatioonships table 
        const releationShipTable = relationOptions.map((item) => ({
          value: item.name,
          label: `${item.name}_(${item.type})_${item.sourceTable}`,
        }))
        setSelectedRelation(releationShipTable)

        // here we show data on next step
        const mapedData = dataResponse.data.tableMappedData
        // console.log("line [ 173 ] mapdedata==>", mapedData)
        setImportTable(mapedData)
        const mapedDataArray: any = mapedData.map((item: any) => {
          //editMappingData[item.excelHeader] = `${item.table}-${item.columnName}`;
          editMappingData.push({
            value: item.excelHeader,
            label: `${item.table}-${item.columnName}`
          });
          return `${item.table}-${item.columnName}`
        })
        console.log('editMappingData--',editMappingData);
        const concatenatedString = mapedDataArray.join(',');
        // console.log("mapedDataArray==[ line 137 ] =>", concatenatedString)
        // console.log("mapedData == [ line 138 ] =>", mapedData)
        setSelectedValues(mapedDataArray);


      } catch (error) {
        console.error(error);
      }
    };
    fetchMapDataById()
  }, [ruleSet, relationOptions])


  function removeUndefinedValues(arr: any) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        result[i] = arr[i];
      }
    }
    return result;
  }

  const handleSelectChangee = (index: any, selectedOption: any) => {
    const updatedValues = [...selectedValues];
    updatedValues[index] = selectedOption.label;
    const cleanedArray = removeUndefinedValues(updatedValues)
    setSelectedValues(cleanedArray);
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
    console.log("page 2")
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
			setLoading(true);
          const response = await fetch(`${BASE_URL}/excel/upload`, {
            method: "POST",
            body: formData,
          });
			 setLoading(false);
          if (!response.ok) {
            throw new Error("Request failed with status: " + response.status);
          }

          const data = await response.json();
          setSelectedexcelRows(data.keyFromExcel);
          setselectedTableRows(data.tableData);
          setFilePath(data.filePath);
        } catch (error: any) { }
      }
      const optionData: any[] = [];
      ruleSet.map((table: any) =>
        table.fields.map((columns: any) => {
          if (table.displayPublic) {
            if (columns.displayPublic) {
              optionData.push({
                value: `${table.name}-${columns.name}`,
                label: `${table.name}-${columns.name} ${columns.required ? "(required)" : ""
                  }`,
              });
            }
          }
        })
      );
      setOptionData(optionData);
      actionParam === "Import" ? nextStepImport() : nextStep();

    }
	 setLoading(false);
  };

  ////////////////////////////////////////////////////////////////////////////////////


  const handleClickfor2ndpage = async () => {
    

    // Check for undefined values in selectedValues
    if (selectedValues.some((item) => item === undefined)) {
      console.log("Warning: selectedValues contains undefined values.");
    }

    const selectedTableRows = selectedValues.map((item: any, index: any) => {
      // Handle undefined values by skipping them

      if (item === undefined) {
        return null;
      }
      console.log("selectedValues = line 306 ==>", {
        item: item,
        index: index
      })
      const [table, name] = item?.split("-");
      return {
        table: table,
        name: name,
        excelHeader: excelRows[index],
        mapped: "Mapped",
        columnName: name,
      };
    });

    const selectedTableRowsForEdit = [...selectedTableRows].map((item: any, index: any) => {

      console.log("selectedTableRowsForEdit ==[ 324 ]==>", {
        item: item,
        index: index
      })
      if (item === undefined) {
        return {
          table: 'Contacts',
          name: '',
          excelHeader: excelRows[index],
          mapped: "Unmapped",
          columnName: '',
        };
      } else {
        return item
      }
    })
    console.log("selectedTableRowsForedit ==[line 321]==>", selectedTableRowsForEdit)


    // Filter out null values (undefined elements)
    const filteredSelectedTableRows = selectedTableRows.filter((item) => item !== null);

    const getUnmappedRows = optionData.filter((item: any) => {
      const isLargeNumber = (element: any) => {
        return (
          item.value.toLowerCase() ===
          `${element?.table.toLowerCase()}-${element?.name.toLowerCase()}`.trim()
        );
      };
      if (filteredSelectedTableRows.find(isLargeNumber) === undefined) {
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
    console.log("targetfieldName ==[ line 311 ]==>", {
      selectedTableRows: [...selectedTableRowsForEdit],
      unmappedRows: [...unmappedRows]
    })

    setTargetFieldName([...selectedTableRowsForEdit, ...unmappedRows]);
    nextStep();
  };


  // const handleClickfor2ndpage = async () => {
  //   const selectedTableRows = selectedValues.map((item: any, index: any) => {
  //     const [table, name] = item?.split("-");
  //     return {
  //       //table: table.toLowerCase(),
  //       //name: name.toLowerCase(),
  //       table: table,
  //       name: name,
  //       excelHeader: excelRows[index],
  //       mapped: "Mapped",
  //       columnName: name,
  //     };
  //   });
  //   const getUnmappedRows = optionData.filter((item: any) => {
  //     const isLargeNumber = (element: any) => {
  //       return (
  //         item.value.toLowerCase() ===
  //         `${element.table.toLowerCase()}-${element.name.toLowerCase()}`.trim()
  //       );
  //     };
  //     if (selectedTableRows.find(isLargeNumber) === undefined) {
  //       return true;
  //     }
  //     return false;
  //   });
  //   const unmappedRows = getUnmappedRows.map((item: any) => {
  //     return {
  //       table: item.value.split("-")[0].toLowerCase(),
  //       name: item.value.split("-")[1].toLowerCase(),
  //       excelHeader: "",
  //       mapped: "Unmapped",
  //       columnName: "",
  //     };
  //   });
  //   console.log("targetfieldName ==[ line 311 ]==>", {
  //     selectedTableRows: [...selectedTableRows],
  //     unmappedRows: [...unmappedRows]
  //   })
  //   // setTargetFieldName([...selectedTableRows, ...unmappedRows]);
  //   nextStep();
  // };





  /////////////////////////////////////////////////////////////////////////////////////////////

  const router = useRouter();
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
      // if action is Import or edit then update api hit
      if (actionParam === "Import" || actionParam === "Edit") {
        const response = await fetch(`${BASE_URL}/map/updatemapFiledById/${mapUpdateid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(importData), // Update data that you want to send
        });
        if (response) {
          // console.log("response", response);
          router.push("/dashboard/map")
        } else {
          console.error("Error creating post");
        }
      }
      // else create api hit asusal 
      else {
        const response = await fetch(`${BASE_URL}/map/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(importData),
        });

        if (response.ok) {
          console.log("Post created successfully");
          router.push("/dashboard/map")

        } else {
          console.error("Error creating post");
        }
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
            {actionParam ? `${actionParam} Map` : `Create Map`}
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
                    className={`${readOnlyForImport && actionParam === 'Import' ? "bg-neutral-200 " : ""} block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    placeholder=""
                    value={mapName}
                    onChange={handleMapNameChange}
                    readOnly={readOnlyForImport && actionParam === 'Import'}
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
                    accept=".xlsx, .xls"
                    id="assets"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="0"
                    onChange={handleFileInputChange}
                  />
                  {errorMsgFileSelected && (
                    <div className="text-red-500">{errorMsgFileSelected}</div>
                  )}
                </div>
				   {loading && (
                <div className="loader-container_1">
          <div className="loader"></div>File Uploading..
        </div>)}
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
                    isDisabled={readOnlyForImport && actionParam === 'Import'}
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
                            isDisabled: true,
                          },
                        ]
                    }
                    onChange={(selectedOption: any) => {
                      setSelectedRelation(selectedOption);
                    }}
                    isMulti
                    value={selectedRelation}
                    isDisabled={readOnlyForImport && actionParam === 'Import'}
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
                    value={action}
                    onChange={(selectedOption: any) => {
                      setAction(selectedOption ? selectedOption : action);
                    }}
                    isDisabled={readOnlyForImport && actionParam === 'Import'}
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
              <div className="grid grid-cols-2 gap-4 border p-3" key={index}>
                <div>
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
                    value={optionData.find(option => option.label === editMappingData.find(item => item.value === value)?.label)}
                    isDisabled={readOnlyForImport && actionParam === 'Import'}
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
            {actionParam === 'Import' ?
              <div className="grid grid-cols-2 gap-4 ">
                <table className="min-w-full shadow-sm  border-separate border-spacing-0">
                  <thead className="bg-gray-300">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        <span className="group inline-flex w-28">Excel Header</span>
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        <span className="group inline-flex">
                          Table Name & Column
                        </span>
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        <span className="group inline-flex">Is Mapped</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* apply condition here  */}
                    {importTable.map((person: any, personIdx: any) => (
                      <tr key={person.name} className="divide-x divide-gray-200">
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.excelHeader}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.table} - {person.name}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.mapped}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* sample data table */}
                <table className="min-w-full shadow-sm max-h-[200px] border-separate border-spacing-0">
                  <thead className="bg-gray-300">
                    <tr className="divide-x divide-gray-200">
                      <th
                        scope="col"
                        className="sticky top-0 z-2 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        colSpan={3}
                      >
                        <span className="group inline-flex w-28">Sample Data</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((person: any, personIdx: any) => (
                      <tr key={person.name} className="divide-x divide-gray-200 align-top">
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.firstname}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.lastname}
                        </td>
                        <td
                          className={classNames(
                            personIdx !== people.length - 1
                              ? "border-b border-gray-200"
                              : "",
                            "whitespace-nowrap px-3 py-2 text-xs text-gray-500"
                          )}
                        >
                          {person.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              :
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
                  {console.log('targetFieldName--->>>',targetFieldName)}
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
              </table>}

            <div className="mt-5 sm:mt-4 sm:flex justify-end col-span-2">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 mr-4 px-4 py-2 text-xs text-white shadow-sm"
                onClick={() => {
                  importData();
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