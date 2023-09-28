import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ActionMenu from "./filters/actionMenu";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

const people = [
  {
    Account: "30",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email:""
  },
  {
    Account: "30",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email:""
  },
  {
    Account: "30",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email:""
  },
  {
    Account: "30",
    FirstName: "Walter",
    LastName: "	Mikitowicz",
    RingLeadScore: " 95.00",
    Email:""
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ContactTable = () => {
  return (
    <>
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
                        Account
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      <a href="#" className="group inline-flex">
                        First Name
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
                        Last Name
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
                        Email
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
                        Ring Lead Score
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
                  {people.map((person, personIdx) => (
                    <tr
                      key={person.Account}
                      className="divide-x divide-gray-200"
                    >
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.Account}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.FirstName}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.LastName}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.Email}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== people.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-2 text-sm text-gray-500"
                        )}
                      >
                        {person.RingLeadScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactTable;
