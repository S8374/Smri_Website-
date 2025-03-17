import { CiDeliveryTruck } from "react-icons/ci";
import { SiAudiobookshelf } from "react-icons/si";
import { CiCircleCheck } from "react-icons/ci";
import Baner from "../../Design/Baner/Baner";
import Features from "../../Design/Features/Features";
import ImageGrid from "../../Design/ImageGrid/ImageGrid";
import FlashSale from "../../Products/FlashSale/FlashSale";
import Products from "../../Products/Products/Products";
import ItemsCategory from "../Shared/Category/ItemsCategory/ItemsCategory";
import SideBarCategory from "../Shared/Category/SideBarCategory/SideBarCategory";
import SliderHero from "../Shared/SliderHero/SliderHero";
import { useState } from "react";

export default function Main() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  

  return (
    <div className="space-y-8">
        
      <div className="flex ">
        <div>
          <SideBarCategory setSelectedCategory={setSelectedCategory} />
        </div>
        <SliderHero />
      </div>
      <FlashSale selectedCategory={selectedCategory} />
      <ItemsCategory selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <Baner />
      <Products  selectedCategory={selectedCategory} />
      <ImageGrid />
      <Features icon1={<CiDeliveryTruck />} title1={'FREE AND FAST DELIVERY'} details1={'Free delivery for all orders over $140'} icon2={<SiAudiobookshelf />} title2={'24/7 CUSTOMER SERVICE'} details2={'Friendly 24/7 customer support'} icon3={<CiCircleCheck />} title3={'MONEY BACK GUARANTEE'} details3={'We reurn money within 30 days'} />
    </div>
  )
}
