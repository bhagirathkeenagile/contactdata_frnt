"use client";
import { signIn } from "next-auth/react";
import Image from 'next/image'
export default async function Home() {
  // const { stargazers_count: stars } = await fetch(
  //   "https://api.github.com/repos/steven-tey/precedent",
  //   {
  //     ...(process.env.GITHUB_OAUTH_TOKEN && {
  //       headers: {
  //         Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
  //         "Content-Type": "application/json",
  //       },
  //     }),
  //     // data will revalidate every 60 seconds
  //     next: { revalidate: 60 },
  //   }
  // )
  //   .then((res) => res.json())
  //   .catch((e) => console.log(e));

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-5">
        <div className="loginBack  relative col-span-5 lg:col-span-2 p-10 bg-[url('/bg_logo.png')] bg-cover  bg-no-repeat" >
       


          <div>
            <a href="#" className="py-2">
               <img
                src={"/logo.png"}
                alt="Precedent Logo"
                className="h-16 opacity-95"
              /> 
              
            </a>
            <h1 className="pb-5 text-white text-2xl">
              IT Asset Disposition (ITAD USA) Customer Portal
            </h1>
          </div>
          <div className="lg:absolute bottom-16">
            <p className="mb-4 pr-10 text-white text-lg sm:text-md hidden">
            A platform for quoting and booking KeenAgile lots/shipments, tracking project statuses in real time, running detailed asset reports, and collaborating across multiple users in your organization.


            </p>
            <p className=" text-white text-sm sm:text-md">
              2023 | ITAD USA © Copyright
            </p>
          </div>
        </div>
        <div className="col-span-5 lg:col-span-3  py-4 place-self-center mb-percent-10">
          
          <div className="">
            <div className="mx-auto px-10 lg:px-28 xl:px-44 pt-10">
              <form className="w-100">
                <div className="mb-5 text-center self-start">
                  <h1 className="text-dark mb-3 text-3xl font-semibold">
                    Sign In
                  </h1>
                  <h2 className="text-gray-600 text-sm sm:text-md lg:text-lg">
                    Sign In {" "}
                    <strong className="text-gray-800">ITAD USA </strong>
                    Marketing Contact Data.
                  </h2>
                </div>
              

                
              
                <div className="text-center flex justify-center">
                 
                
                  <div className="mt-6 gap-4">
                            <a  onClick={() => {
                        signIn("salesforce", { callbackUrl:"/dashboard"} );
                      }}
                                href="#"
                                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#f0f0f0] px-3 py-1.5 text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0f0f0]"
                            >
                                <Image width={50} height={40} src={'/salesforce.svg'} alt='Salesforce Svg'/>
                                <span className="text-sm font-semibold leading-6">Salesforce Authentication</span>
                            </a>

                            
                        </div>
                 
                </div>
                <div></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
