"use client";
import { signIn } from "next-auth/react";
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
        <div className="loginBack relative col-span-5 lg:col-span-2 p-10">
          <div>
            <a href="http://availrecovery.keenagile.in" className="py-2">
              {/* <img
                src={"/logo.png"}
                alt="Precedent Logo"
                className="h-10 opacity-95"
              /> */}
              <h1 className="text-lg font-bold">Logo</h1>
            </a>
            <h1 className="pb-5 text-white">
              IT Asset Disposition (KeenAgile) Customer Portal
            </h1>
          </div>
          <div className="lg:absolute bottom-16">
            <p className="mb-4 pr-10 text-white text-sm sm:text-md">
            A platform for quoting and booking KeenAgile lots/shipments, tracking project statuses in real time, running detailed asset reports, and collaborating across multiple users in your organization.


            </p>
            <p className=" text-white text-sm sm:text-md">
              2022 | KeenAgile © Copyright
            </p>
          </div>
        </div>
        <div className="col-span-5 lg:col-span-3 bg-white  py-8">
          <div className="flex justify-between">
            <div className="px-3 text-xs sm:text-base">
             
            </div>
            <div className="flex items-center px-4">
              {/* <img
                src={"/icon2.png"}
                alt="Precedent Logo"
                className="h-3 md:h-6 opacity-95"
              />
              <img
                src={"/icon1.png"}
                alt="Precedent Logo"
                className="h-6 md:h-12 opacity-95"
              /> */}
            </div>
          </div>
          <div className="">
            <div className="mx-auto px-10 lg:px-28 xl:px-44 pt-10">
              <form className="w-100">
                <div className="mb-5 text-center">
                  <h1 className="text-dark mb-3 text-3xl font-semibold">
                    Sign In
                  </h1>
                  <h2 className="text-gray-600 text-sm sm:text-md lg:text-lg">
                    Welcome{" "}
                    <strong className="text-gray-800">Keenagile</strong>
                    customers to the experience.
                  </h2>
                </div>
              

                
              
                <div className="text-center">
                 
                  <div className="flex justify-center">
                    <a
                       onClick={() => {
                        signIn("salesforce", { callbackUrl:"/dashboard"} );
                      }}
                      className="flex justify-around px-4 py-3 mediaBtn items-center rounded mb-5"
                    >
                      <img
                        alt="Logo"
                        src={"/logosales.png"}
                        className="h-6"
                      />
                      Continue with Salesforce
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
