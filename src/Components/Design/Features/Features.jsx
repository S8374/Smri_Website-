
export default function Features({icon1 ,icon2 , icon3 ,title1 ,title2,title3, details1,details2,details3} ) {
    return (
        <div>
            <section className="bg-white  ">
                <div className="container px-6  mx-auto">
                 

                    <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
                        <div className="flex flex-col items-center p-6 space-y-3 text-center  rounded-xl ">
                            <span className="inline-block text-5xl p-3 text-white bg-black  rounded-full dark:text-white ">
                                {icon1}
                            </span>

                            <h1 className="text-xl font-semibold text-black capitalize ">{title1}</h1>

                            <p className="text-black ">
                                {details1}
                            </p>

                        </div>

                        <div className="flex flex-col items-center p-6 space-y-3 text-center  rounded-xl ">
                            <span className="inline-block text-5xl p-3 text-white bg-black  rounded-full dark:text-white ">
                                {icon2}
                            </span>

                            <h1 className="text-xl font-semibold text-black capitalize ">{title2}</h1>

                            <p className="text-black ">
                               {details2}
                            </p>

                        </div>

                        <div className="flex flex-col items-center p-6 space-y-3 text-center  rounded-xl ">
                            <span className="inline-block p-3 text-5xl text-white bg-black rounded-full dark:text-white ">
                                {icon3}
                            </span>

                            <h1 className="text-xl font-semibold text-black capitalize ">{title3}</h1>

                            <p className="text-black">
                               {details3}
                            </p>

                       
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
