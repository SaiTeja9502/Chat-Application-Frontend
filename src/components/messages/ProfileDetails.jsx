import React, { useState } from 'react';
import useConversation from '../../zustand/useConversation';
import { IoEllipsisVertical, IoClose } from 'react-icons/io5'; // Import the vertical ellipsis and close icons

const ProfileDetails = ({ toggleCustomComponent }) => {
    const { selectedConversation, removeConversation } = useConversation();
    const [showMenu, setShowMenu] = useState(false);
    const [activeMember, setActiveMember] = useState(null);

    const handleClose = () => {
        toggleCustomComponent();
    };

    const handleDelete = () => {
        removeConversation(selectedConversation.id); // Assuming the conversation object has an "id" property
        toggleCustomComponent();
    };

    const handleOptionClick = () => {
        // Write your functionality for mute or block here
        setShowMenu(false); // Close the menu after clicking an option
    };

    return (
        <div className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md relative h-full bg-transparent">
            {/* Close Button */}
            <div className="absolute top-0 left-0 p-2 cursor-pointer">
                <IoClose className="text-gray-500 text-3xl" onClick={handleClose} />
            </div>

            {/* Profile Picture or Name */}
            {selectedConversation.profilePic ? (
                <img src={selectedConversation.profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
            ) : (
                <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-4xl text-gray-800">{selectedConversation.name ? selectedConversation.name.substring(0, 2) : selectedConversation.contacts[0].username.substring(0, 2)}</span>
                </div>
            )}

            {/* Name or Group Name */}
            <span className="text-3xl font-semibold mb-12">{selectedConversation.name ? selectedConversation.name : selectedConversation.contacts[0].username}</span>

            

            {/* Delete Conversation Button */}
            <button className="bg-red-500 text-white px-4 py-2 rounded-md mb-2 absolute bottom-4 left-1/2 transform -translate-x-1/2">
                Delete Conversation
            </button>


            {/* Three Dot Menu */}
            <div className="absolute top-0 right-0 p-2 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                <IoEllipsisVertical className="text-gray-600" />
            </div>

            {selectedConversation.name && selectedConversation.contacts.map(member => (
                <div key={member.contactId} className="flex items-center justify-between mb-2 w-64">
                    <div>
                        {member.base64Image ? (
                            <img src={member.base64Image} alt="Profile" className="w-10 h-10 rounded-full mb-2 mr-2" />
                        ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2 mr-2">
                                <span className="text-xl text-gray-800">{member.username.substring(0, 2)}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <span className="text-xl font-semibold mb-8">{member.username}</span>
                    </div>
                    <div className="relative">
                            <IoEllipsisVertical
                                className="text-gray-200 cursor-pointer"
                                onClick={() => setActiveMember(member.contactId === activeMember ? null : member.contactId)} // Toggle active member
                            />
                            {activeMember === member.contactId && (
                                <div className="absolute top-0 left-5 bg-white shadow-md rounded-md p-2 mt-2 bg-opacity-20">
                                    <div className="cursor-pointer bg-opacity-50" onClick={() => handleOptionClick(activeMember, "makeAdmin")}>
                                        Make Admin
                                    </div>
                                    <div className="cursor-pointer bg-opacity-50" onClick={() => handleOptionClick(activeMember, "remove")}>
                                        Remove
                                    </div>
                                </div>
                                )}
                            </div>
                </div>
            ))}

            {/* Menu */}
            {showMenu && (
                <div className="absolute top-10 right-0 bg-white shadow-md rounded-md p-2 mt-2 w-24 bg-opacity-20">
                    <div className="cursor-pointer bg-opacity-50" onClick={handleOptionClick}>
                        Mute
                    </div>
                    <div className="cursor-pointer bg-opacity-50" onClick={handleOptionClick}>
                        Block
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDetails;