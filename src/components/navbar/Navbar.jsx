import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const items = [
        { label: 'Police', value: 'police' },
        { label: 'Hospital', value: 'hospital' },
        { label: 'Fire Station', value: 'fire_station' },
        { label: 'Experts', value: 'exp' },
    ];
    const [_, setSearchParams] = useSearchParams();

    const handleLogout = async () => {
        const toastId = toast.loading('Logging out...');
        try {
            await logOut();
            toast.success('Logout successful', { id: toastId });
            navigate('/');
        } catch (error) {
            toast.error(error?.message, { id: toastId });
        }
    };



    return (
        <nav className="relative bg-white shadow dark:bg-gray-800">
            <div className="container px-6 md:py-1 py-5 mx-auto">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between">
                        <Link to={'/'}>
                            <img
                                className="w-auto h-18 md:h-15"
                                src={logo}
                                alt="safeping logo"
                            />
                        </Link>

                        {/* Mobile menu button */}
                        <div className="flex lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                                aria-label="toggle menu"
                            >
                                {isOpen ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 8h16M4 16h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"
                            }`}
                    >
                        <div className="flex flex-col items-start -mx-6 lg:flex-row lg:items-center lg:mx-8">
                            {items.map((item, i) => {
                                const isLast = i === items.length - 1;

                                if (isLast) {
                                    return user ? (
                                        <button
                                            key={i}
                                            onClick={handleLogout}
                                            className="px-3 py-2 mx-3 mt-2 bg-gray-700 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            key={i}
                                            to={'/login'}
                                            className="px-3 py-2 mx-3 mt-2 text-white bg-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-teal-900"
                                        >
                                            Login
                                        </Link>
                                    );
                                }

                                return (
                                    <a
                                        key={i}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSearchParams({ type: item.value });
                                        }}
                                        className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>

                        <div className="flex items-center mt-4 lg:mt-0">
                            <button
                                className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                                aria-label="show notifications"
                            >
                                <svg
                                    className="w-6 h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className="flex items-center focus:outline-none"
                                aria-label="toggle profile dropdown"
                            >
                                <div className={`w-8 h-8 overflow-hidden border-2 ${user ? 'border-green-400' : 'border-gray-400'} rounded-full`}>
                                    <Link to={user ? '/user-dashboard' : '/login'}>
                                        <img
                                            src={user ? user.photoURL : `https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80`}
                                            className="object-cover w-full h-full"
                                            alt="avatar"
                                        /></Link>
                                </div>

                                <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">
                                    {user ? user.displayName : "Guest"}
                                </h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
