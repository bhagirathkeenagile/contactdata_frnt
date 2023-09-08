"use client"
import { HeartIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { data } from "autoprefixer";
// import Filter from "./components/lots/filters/filter";
import Link from "next/link";

const Page = () => {
    console.log('data', data);
    return (
        <>
            <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight">
                        Dashboard
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                </div>
            </div>

            <div className='bg-white my-2 px-6 py-3 shadow-sm'>
                <div className="alert bg-white d-flex flex-column align-items-center justify-content-center p-2 w-100 mb-0 text-center">
                    <span className="text-black-50">
                        We <HeartIcon className="text-red-600 h-3 inline-block" />  and want your experience to be just right.<br />
                    </span>
                    <span className="text-black-50"> Email us at <a href="mailto:support@keenagile.com">support@keenagile.com</a> to request help, report issues or submit new feature requests.
                    </span>
                </div>
            </div>
        </>
    )
}

export default Page;