import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { FaEllipsisV } from 'react-icons/fa';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import AddGroup from './AddGroup';

const Profile = () => {
    const { authUser } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAddFriendBox, setShowAddFriendBox] = useState(false); // State for showing "Add Friend" box
    const [showNewGroupBox, setShowNewGroupBox] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
        setShowAddFriendBox(false); // Close "Add Friend" box when toggling menu
        setShowNewGroupBox(false); // Close "New Group" box when toggling menu
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = () => {
        setMenuOpen(false); // Close the menu when an option is clicked
        setShowNewGroupBox(true); // Show the "New Group" box
    };

    const handleAddFriendClick = () => {
        setMenuOpen(false); // Close the menu
        setShowAddFriendBox(true); // Show the "Add Friend" box
    };

    const handleCloseAddFriendBox = () => {
        setShowAddFriendBox(false); // Hide the "Add Friend" box
    };

    const handleCloseNewGroupBox = () => {
        setShowNewGroupBox(false); // Hide the "New Group" box
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="avatar w-12 h-12 rounded-full overflow-hidden">
                        {authUser.base64Image ? (
                            <img src={`data:image/jpeg;base64,${authUser.base64Image}`} alt="user avatar" />
                        ) : (
                            <span className="text-2xl flex items-center justify-center w-full h-full rounded-full bg-gray-300 text-gray-600">
                                {authUser.username.substring(0, 2)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-3xl text-gray-200">{authUser.username}</p>
                    </div>
                </div>
                <div>
                    <button onClick={toggleMenu} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white bg-opacity-80 rounded-md shadow-lg z-10 border border-gray-300">
                    <div className="py-1">
                        <button onClick={handleAddFriendClick} className="block px-4 py-2 text-gray-800 hover:bg-gray-50 w-full text-left">
                            Add Friend
                        </button>
                        <button onClick={handleOptionClick} className="block px-4 py-2 text-gray-800 hover:bg-gray-50 w-full text-left">
                            New Group
                        </button>
                    </div>
                </div>
            )}
            {showAddFriendBox && (
                <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-4 rounded-md shadow-lg z-20">
                    <SearchInput/>
                    <button className="absolute top-0 right-0 p-2 text-gray-800" onClick={handleCloseAddFriendBox}>X</button>
                </div>
            )}
            {showNewGroupBox && (
                <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 bg-opacity-80 rounded-md shadow-lg z-20">
                    <AddGroup />
                    <button className="absolute top-0 right-0 p-2 text-gray-800" onClick={handleCloseNewGroupBox}>X</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
