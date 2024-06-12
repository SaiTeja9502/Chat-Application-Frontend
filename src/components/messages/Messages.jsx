import { useEffect, useRef } from "react";
import Message from "./Message";
import useConversation from "../../zustand/useConversation";

const Messages = () => {
    const { selectedConversation } = useConversation();
    const lastMessageRef = useRef();
	console.log(selectedConversation.messages);
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [selectedConversation]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {selectedConversation.messages && selectedConversation.messages.length > 0 &&
                selectedConversation.messages.map((message, index) => (
                    <div key={message.messageId} ref={index === selectedConversation.messages.length - 1 ? lastMessageRef : null}>
                        <Message message={message} />
                    </div>
                ))}
            {selectedConversation.messages && selectedConversation.messages.length === 0 && (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
            {/* {!(selectedConversation.messages && selectedConversation.messages.length) && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)} */}
        </div>
    );
};

export default Messages;

