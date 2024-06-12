import useConversation from "../../zustand/useConversation";
import { useEffect, useState} from "react";
import useGroupWebSocket from "../../hooks/useGroupWebSocket";
import useMarkConversationAsRead from "../../hooks/useMarkConversationAsRead";


const Conversation = ({ conversation, lastIdx }) => {  
	const { conversations, selectedConversation, setSelectedConversation } = useConversation();
    const isSelected  = selectedConversation?.conversationId === conversation.conversationId;
    useGroupWebSocket(conversation);
    const {markMessagesRead} = useMarkConversationAsRead();
    useEffect(()=>{
        if(selectedConversation && selectedConversation.conversationId === conversation.conversationId){
            const conversationIndex = conversations.findIndex(con => con.conversationId === conversation.conversationId);
            setSelectedConversation(conversations[conversationIndex]);
        }
    }, [conversations])
    console.log(conversations);
    const handleConversationClick = () => {
        const conversationIndex = conversations.findIndex(con => con.conversationId === conversation.conversationId);
        setSelectedConversation(conversations[conversationIndex]);
        markMessagesRead(conversation);
    };

	return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                ${isSelected ? "bg-sky-500" : ""}
            `}
            onClick={handleConversationClick}
            >
            {conversation.name ? (
                <div className="flex items-center">
                    <div className='avatar w-12 h-12 rounded-full overflow-hidden mr-3'>
                        {conversation.groupProfile ? (
                            <img src={`data:image/jpeg;base64,${conversation.groupProfile}`} alt='user avatar' />
                        ) : (
                            <span className="text-3xl flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">D</span>
                        )}
                    </div>
                    <div className='flex flex-col flex-1 ml-3'>
                        <p className='font-bold text-gray-200'>{conversation.name}</p>
                    </div>
                </div>
                ) : (
                    <div className={`flex items-center`}>
                        <div className={`avatar w-12 h-12 rounded-full overflow-hidden mr-3 ${ conversation.contacts[0].status === "ONLINE" ? "ring-4 ring-green-500" : ""}`}>
                            {conversation.contacts && conversation.contacts[0] && conversation.contacts[0].base64Image ? (
                                <img src={`data:image/jpeg;base64,${conversation.contacts[0].base64Image}`} alt='user avatar' />
                            ) : (
                                <span className="text-2xl flex items-center justify-center w-full h-full rounded-full bg-gray-300 text-gray-600">{conversation.contacts[0].username.substring(0, 2)}</span>
                            )}
                        </div>
                        <div className='flex flex-col flex-1 ml-3'>
                            <p className='font-bold text-gray-200'>{conversation.contacts[0].username}</p>
                        </div>
                    </div>

                
                )}
            </div>

            {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    );
};
export default Conversation;

