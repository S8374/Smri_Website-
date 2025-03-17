export default function Error({ title, details, img, width, height }) {
    return (
        <div className=" dark:text-black flex items-center justify-center">
            <section className="w-full max-w-4xl p-6 mx-auto bg-white  overflow-hidden">
                <div className="lg:flex lg:gap-12">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                  
                        <h1 className="mt-4 text-4xl font-semibold text-gray-800 dark:text-black md:text-5xl">{title}</h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-black">{details}</p>

                    </div>

                    <div className="relative w-full mt-12 lg:mt-0 lg:w-1/2">
                        <img
                            className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
                            src={img}
                            alt="Error illustration"
                            style={{ width: width || '100%', height: height || 'auto' }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
