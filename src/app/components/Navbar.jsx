"use client";

import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import logo from "../../../public/asset/logo.png";

import { FaHeart, FaSearch, FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchQuery } from "@/lib/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUserDetails } from "@/lib/features/userSlice";
import { getCart } from "@/lib/features/cartSlice";

const Navbar = () => {
  const [openHamburger, setOpenHamburger] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { wishlist } = useAppSelector((state) => state.products);
  const { userData } = useAppSelector((state) => state.users);
  const { cartData } = useAppSelector((state) => state.carts);

  const { userName } = userData;

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setQuery(value);

    const delayedDispatch = () => {
      dispatch(searchQuery(value));
    };

    const debouncedDispatch = debounce(delayedDispatch, 2000);

    debouncedDispatch();
  };

  const handleHamburger = () => {
    setOpenHamburger((prev) => !prev);
  };

  // load previous data if page reloaded
  const loadSessionStore = () => {
    if (typeof window !== "undefined") {
      const res = sessionStorage.getItem("userData");
      return res
        ? JSON.parse(res)
        : { userData: { userName: "", userId: "", token: "" } };
    }

    return { userData: { userName: "", userId: "", token: "" } };
  };

  useEffect(() => {
    dispatch(setUserDetails(loadSessionStore().userData));
  }, [dispatch]);

  useEffect(() => {
    if (userData.userId) {
      dispatch(getCart(userData));
    }
  }, [dispatch, userData]);

  return (
    <div
      className={`navbar-container${
        openHamburger ? ` navbar-hamburger-open` : ""
      }`}
    >
      <div className="navbar">
        <Image src={logo} alt="logo" priority className="logo" />
        <div className="navbar-linksBox">
          <span onClick={() => router.push("/home")} className="nav-links">
            Home
          </span>
          <span onClick={() => router.push("/products")} className="nav-links">
            Products
          </span>

          <div className="nav-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search in E-Market"
              className="nav-search"
              value={query}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="navbar-buttons">
          <span className="navbar-activeUser"> {userName} </span>

          <span onClick={() => router.push("/login")} className="nav-links">
            <FaUserAlt />
          </span>
          <span onClick={() => router.push("/wishlist")} className="nav-links">
            <div className="navbar-cartBox">
              <FaHeart />

              <div className="navbar-cartBedge">
                {wishlist?.length !== 0 ? wishlist?.length : 0}
              </div>
            </div>
          </span>
          <span onClick={() => router.push("/cart")} className="nav-links">
            <div className="navbar-cartBox">
              <FaShoppingCart />
              <div className="navbar-cartBedge">
                {cartData?.length !== 0 ? cartData?.length : 0}
              </div>
            </div>
          </span>

          <div className="navbar-hamburger" onClick={handleHamburger}>
            {openHamburger ? <IoClose /> : <GiHamburgerMenu />}
          </div>
        </div>
      </div>

      <div className="navbar-Hamburger-linksBox">
        <span onClick={() => router.push("/")} className="nav-links">
          Home
        </span>
        <span onClick={() => router.push("/products")} className="nav-links">
          Products
        </span>
        <div className="nav-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search in E-Market"
            className="nav-search"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
