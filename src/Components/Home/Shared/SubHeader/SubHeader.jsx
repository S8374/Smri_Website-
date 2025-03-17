import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function SubHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Function to conditionally apply styles for active NavLink
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-green-500 hover:text-green-500 transition-colors' // Active style
      : 'hover:text-blue-500 transition-colors'; // Inactive style

  const navItemsLeft = (
    <>
      <li>
        <NavLink className={getNavLinkClass} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={getNavLinkClass} to="/allProduct">
          All Product
        </NavLink>
      </li>
    </>
  );

  const navItemsRight = (
    <>
      <li>
        <NavLink className={getNavLinkClass} to="/contact">
          Contact
        </NavLink>
      </li>
      <li>
        <NavLink className={getNavLinkClass} to="/aboutUs">
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div
      className={`px-4 navbar text-black sticky top-16 left-0 max-w-6xl mx-auto right-0 z-20 bg-white py-3 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl py-2.5 mx-auto flex items-center justify-between">
        {/* Left-side navigation items */}
        <ul className="flex space-x-6 text-black flex-wrap justify-start barlow text-lg">{navItemsLeft}</ul>

        {/* Website Logo */}
        <div className="items-center text-center flex flex-col justify-center">
          <img
            src="https://res.cloudinary.com/dx8o5d32h/image/upload/v1742022038/Blue_and_Orange_Illustrative_Online_Shop_Logo_-_Copy-removebg-preview_lptzej.png"
            className="max-h-16 mx-auto"
            alt=""
          />
        </div>

        {/* Right-side navigation items */}
        <ul className="flex space-x-6 flex-wrap text-black   barlow text-lg justify-end">{navItemsRight}</ul>
      </div>
    </div>
  );
}