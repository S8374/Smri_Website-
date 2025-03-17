import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ImageGrid() {
    const images = [
        { src: "https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739553066/Untitled_design_3_ltwj96.jpg", alt: "Big Image", details: "Black and White version of the PS5 coming out on sale.", button: "Shop Now", title: 'PlayStation 5' },
        { src: "https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739553125/Untitled_design_1_mrpfee.png", alt: "Top Right Image", button: "See Details", details: "Featured woman collections that give you another vibe.", title: 'Women’s Collections' },
        { src: "https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739553072/Untitled_design_2_mm9ypv.png", alt: "Bottom Left", button: "Learn More", details: "Amazon wireless speakers", title: 'Speakers' },
        { src: "https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739553067/Untitled_design_3_sq2ezi.png", alt: "Bottom Right", button: "Discover", details: "GUCCI INTENSE OUD EDP .", title: 'Perfume' },
    ];

    return (
        <div className="grid barlow grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* First Column - Large Image */}
            <div className="relative">
                <img src={images[0].src} alt={images[0].alt} className="w-full h-auto object-cover rounded-lg md:h-full" />
                <div className="absolute bottom-4 left-4 flex flex-col items-start">
                    <h2 className="text-white text-lg sm:text-xl md:text-3xl lg:text-5xl font-bold">{images[0].title}</h2>
                    <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-1">{images[0].details}</p>
                    <Link to={'/allProduct'}>    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            px: { xs: 1, sm: 2, md: 3 },
                            py: { xs: 1, sm: 1, md: 1 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        }}
                    >
                        {images[0].button}
                    </Button></Link>
                
                </div>
            </div>

            {/* Second Column */}
            <div className="grid grid-rows-2 gap-4">
                {/* Top Image */}
                <div className="relative">
                    <img src={images[1].src} alt={images[1].alt} className="w-full h-auto md:h-full object-cover rounded-lg" />
                    <div className="absolute bottom-4 left-4 flex flex-col items-start">
                        <h2 className="text-white text-lg sm:text-xl md:text-3xl lg:text-5xl font-bold">{images[1].title}</h2>
                        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-1">{images[1].details}</p>
                       <Link to={'/allProduct'}>
                       <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                px: { xs: 1, sm: 2, md: 3 },
                                py: { xs: 1, sm: 1, md: 1 },
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                                bgcolor: "primary.main",
                                color: "white",
                                "&:hover": {
                                    bgcolor: "primary.dark",
                                },
                            }}
                        >
                            {images[1].button}
                        </Button>
                       </Link>
                    </div>
                </div>

                {/* Bottom Two Images */}
                <div className="grid grid-cols-2 gap-4">
                    {images.slice(2).map((img, index) => (
                        <div key={index} className="relative">
                            <img src={img.src} alt={img.alt} className="w-full h-auto md:h-full object-cover rounded-lg" />
                            <div className="absolute bottom-4 left-4 flex flex-col items-start">
                                <h2 className="text-white text-lg sm:text-xl md:text-3xl lg:text-5xl font-bold">{img.title}</h2>
                                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-1">{img.details}</p>
                               <Link to={'/allProduct'}>
                               <Button
                                   
                                   variant="contained"
                                   sx={{
                                       mt: 2,
                                       px: { xs: 1, sm: 2, md: 3 },
                                       py: { xs: 1, sm: 1, md: 1 },
                                       fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                                       bgcolor: "primary.main",
                                       color: "white",
                                       "&:hover": {
                                           bgcolor: "primary.dark",
                                       },
                                   }}
                               >
                                   {img.button}
                               </Button>
                               </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
