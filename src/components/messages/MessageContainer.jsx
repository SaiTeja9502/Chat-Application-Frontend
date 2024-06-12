import React, { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import ProfileDetails from "./ProfileDetails";

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [showCustomComponent, setShowCustomComponent] = useState(false); // State to manage whether to show the custom component

    useEffect(() => {
        // cleanup function (unmounts)
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    // Function to toggle showing the custom component
    const toggleCustomComponent = () => {
        if (selectedConversation) {
            setShowCustomComponent(prev => !prev);
        }
    };

    return (
        <div className='md:min-w-[450px] flex flex-col'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : showCustomComponent ? (
                // Render the custom component if showCustomComponent is true
                <ProfileDetails toggleCustomComponent={toggleCustomComponent} />
            ) : (
                // Render the conversation header
                <>
                    <div className='bg-slate-500 px-4 py-2 mb-2 cursor-pointer' onClick={toggleCustomComponent}> {/* Add onClick handler to toggle showing the custom component */}
                        <span className='label-text'>To:</span>{" "}
                        <span className='text-gray-900 font-bold'>{selectedConversation.name ? selectedConversation.name : selectedConversation.contacts[0].username}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};
export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser.fullName} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};
