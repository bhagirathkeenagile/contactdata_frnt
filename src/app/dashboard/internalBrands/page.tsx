import { PlusCircleIcon } from "@heroicons/react/24/outline";

const InternalBrandList = () => {

    return (
        <>
             <div className="md:flex md:items-center md:justify-between bg-white my-2 px-6 py-3 shadow-sm">
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight">
          Internal Brand List
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
      
      {/* <Filter /> */}
                    <a
                        href="/map/update/id"
        type="button"
        className="inline-flex items-center gap-x-2 rounded-md bg-blue-001 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        <PlusCircleIcon className="-ml-0.5 h-5 w-5 text-blue-100" aria-hidden="true" />
        Create New                                                
      </a>
      </div>
            </div>
            
            <div className='bg-white my-2 px-6 py-3 shadow-sm'>
            <div className="relative shadow-md sm:rounded-lg">
       
      </div>
            </div>
     
        </>
    )
}

export default InternalBrandList;