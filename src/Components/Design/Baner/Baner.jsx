export default function Banner() {
  return (
    <section className="bg-gray-100  lg:py-12 lg:flex lg:justify-center">
      <div className="overflow-hidden bg-white text-black  lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        <div className="lg:w-1/2">
          <div
            className="h-64 bg-cover lg:h-full"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG10by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')" }}>
          </div>
        </div>

        <div className="max-w-xl px-6 py-12 lg:max-w-5xl lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800  md:text-3xl">
            Elevate Your Shopping <span className="text-blue-500">Experience</span>
          </h2>

          <p className="mt-4 text-gray-500 ">
            Discover premium-quality products at unbeatable prices. Shop the latest trends, enjoy exclusive deals,  
            and experience seamless online shopping with fast and reliable delivery.
          </p>

          <div className="inline-flex w-full mt-6 sm:w-auto">
            <button 
          onClick={() =>
                document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" })
            }
              href="#" className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 dark:bg-black dark:text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
