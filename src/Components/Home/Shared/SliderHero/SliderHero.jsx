import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Import required modules
import { Pagination, History, Autoplay, EffectFade } from 'swiper/modules';
import { FaArrowRight } from "react-icons/fa6";

// Slider data
const slides = [
    {
        img: "https://media.istockphoto.com/id/1265991940/photo/3d-rendering-of-shopping-cart-and-smartphone.jpg?s=612x612&w=0&k=20&c=3hEFx0jgdSQwZ2GMV3r6eay3i9eG6oCIb8G4nQEIJkU=",
        text: "Stay ahead with the latest ",
        text1: "fashion trends.",
        button: "Shop Now"
    },
    {
        img: "https://media.istockphoto.com/id/1459761454/photo/couple-wearing-white-tee-shirts-curly-woman-and-bearded-man-together-using-mobile-phone-and.jpg?s=612x612&w=0&k=20&c=XMUXxcbPjUymiLmvtdxLYZuygkJuc1DBrbzuEvvN7vo=",
        text: "Enhance experience ",
        text1: "cutting-edge electronics.",
        button: "Explore"
    },
    {
        img: "https://media.istockphoto.com/id/1264231769/photo/young-beautiful-girl-in-denim-dress-carrying-shopping-bags-on-pink-background-concept-of.jpg?s=612x612&w=0&k=20&c=dxUFyH9ilEP07CbDQLUQk02aoS1d_gqEezRkmT8RsXg=",
        text: "Transform  with elegant, ",
        text1: " modern furniture.",
        button: "See More"
    },
    {
        img: "https://media.istockphoto.com/id/1441444291/photo/black-friday-sale-concept.jpg?s=612x612&w=0&k=20&c=dtdpbvacS5j-ETYJVVVFkMcPHbvBTIcnPja49umTJYw=",
        text: "Achieve peak performance  ",
        text1: "premium sports gear.",
        button: "Buy Now"
    },
    {
        img: "https://media.istockphoto.com/id/1289975388/photo/holiday-online-shopping-during-coronavirus-pandemic-laptop-surgical-face-mask-against-covid.jpg?s=612x612&w=0&k=20&c=uR5zXG86k-4_7LV26V8c4Rx4KGhTW3OAmeCYIOfdtE0=",
        text: "Discover top-tier essentials",
        text1: " tailored for you.",
        button: "Check Out"
    }
];

export default function SliderHero() {
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            effect="fade" // Fade effect for smooth transitions
            autoplay={{
                delay: 3000, // Auto change every 3 seconds
                disableOnInteraction: false, // Keeps autoplay active even after user interaction
            }}
            history={{ key: 'slide' }}
            modules={[Pagination, History, Autoplay, EffectFade]}
            className="mySwiper w-full h-full"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className="relative">
                    <img
                        src={slide.img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[300px] sm:h-[500px] object-cover"
                    />
                    <div className="absolute left-2 sm:left-10 top-1/2 transform -translate-y-1/2 text-white bg-opacity-50 p-3 sm:p-5 rounded-lg w-max sm:w-auto">
                        <h2 className="barlow text-2xl sm:text-6xl font-semibold capitalize">{slide.text}</h2>
                        <h2 className="barlow text-2xl sm:text-6xl font-semibold capitalize">{slide.text1}</h2>
                        <button onClick={() =>
                            document.getElementById("product-section")?.scrollIntoView({ behavior: "smooth" })
                        } className="mt-6 sm:mt-10 cursor-pointer barlow flex items-center text-lg sm:text-2xl font-semibold ml-2 sm:ml-0 border-b-2 text-white capitalize">
                            {slide.button} <FaArrowRight className='ml-3 sm:ml-6' />
                        </button>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
