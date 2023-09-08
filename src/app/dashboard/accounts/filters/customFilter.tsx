"use client";

import { useState } from "react";

const CustomFilter = () => {
    const [show, setShow] = useState(false);
    const [addFilter, setAddFilter] = useState([{ filter: "" }]);

    const handleFilterAdd = () => {
        setAddFilter([...addFilter, { filter: "" }]);
    };

    const handleFilterRemove = (index: number) => {
        const list = [...addFilter];
        list.splice(index, 1);
        setAddFilter(list);
    };

  return (
    <>
      <div className="px-4 py-4 relative">
              <p className="text-sm font-medium">Custom Search Builder</p>
              <div className="relative w-full flex justify-between">
              <button
                  onClick={() => setShow(true)}
                  className="mt-3 btn-1 hover:bg-gray-50">Add Condition</button>
                    <button onClick={() => setShow(false)} className="mt-2 btn-1 absolute  right-0 hover:bg-gray-50">Clear all</button>
              
                
                </div>
              {
                  show ?
                      <div> 
                
                {addFilter.map((singleService,index) =>
                
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <div className="flex">
                      <select
                        id="location"
                        name="location"
                        className="mt-2 block w-full rounded mr-4 border-0 py-1.5 pl-3 pr-10 bg-gray-100 text-gray-900 ring-1 ring-inset ring-red-500 focus:ring-1 focus:ring-red-600 sm:text-sm sm:leading-6"
                                      defaultValue="Data"
                                      
                      >
                        <option selected>Data</option>
                        <option>Id</option>
                        <option>update_map_history_id</option>
                        <option>insert_map_history_id</option>
                        <option>IsDeleted</option>
                        <option>AccountId</option>
                        <option>LastName</option>
                        <option>FirstName</option>
                        <option>Email</option>
                                  </select>
                                  <select
                        id="location"
                        name="location"
                        className="mt-2 block w-full rounded mr-4 border-0 py-1.5 pl-3 pr-10 bg-gray-100 text-gray-900 ring-1 ring-inset ring-green-500 focus:ring-1 focus:ring-green-600 sm:text-sm sm:leading-6"
                        defaultValue="Condition"
                      >
                        <option selected>Condition</option>
                        <option>Equals</option>
                        <option>Not</option>
                        <option>Less Than</option>
                        <option>Less Than Equal To</option>
                        <option>Greater Than Equal To</option>
                        <option>Greater Than</option>
                        <option>Between</option>
                        <option>Not Between</option>
                        <option>Empty</option>
                        <option>Not Empty</option>
                                  </select>
                                  
                                  <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-2 block w-full h-8 rounded mr-4 border-0 py-1.5 pl-3 pr-4 bg-gray-100 text-gray-900 shadow-sm ring-1 ring-inset ring-indigo-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="value"
                />
                            </div>
                            {addFilter.length - 1 === index && addFilter.length < 4 &&
                                (
                                    <button onClick={handleFilterAdd} className="mt-2 btn-1 hover:bg-gray-50">Add Condition</button>         
                 )
                 }           
                             
                        </div>
                        
                  <div className="relative">
                            {addFilter.length > 1 && (
                    <button onClick={() => handleFilterRemove(index)} className="mt-3 btn-1 hover:bg-gray-50">X</button>         
                    )}
                  </div>
                          </div>
                )
                      }            
                
                          </div>: null
        }
        
      </div>
    </>
  );
};

export default CustomFilter;
