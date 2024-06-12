import { useEffect, useState, useRef} from 'react';
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from '../zustand/useConversation';
import notificationSound from "../assets/sounds/notification.mp3";
import { fetchWithTokenRefresh } from './useFetchWithRefreshToken';
import useMarkConversationAsRead from './useMarkConversationAsRead';
import { useStore } from 'zustand';

const useUserWebSocket = () => {
    const [loading, setLoading] = useState(true);
    const {userSubscription, setUserSubscription, stompClient} = useSocketContext();
    const {conversations, setConversations, selectedConversation} = useStore(useConversation);
    const { authUser, setAuthUser } = useAuthContext();
    const {markMessagesRead} = useMarkConversationAsRead();
    const conversationsRef = useRef(conversations);
    const selectedConversationRef = useRef(selectedConversation);
    useEffect(() => {
        let usersubscription;
        if (authUser && stompClient && !userSubscription) {
            usersubscription = stompClient.subscribe(
                `/private/${authUser.userId}/notifications`,
                (message) => {
                    const notification = JSON.parse(message.body);
                    processNotification(
                        notification,
                        authUser, 
                        setAuthUser,
                        conversationsRef.current,
                        setConversations,
                        selectedConversationRef.current,
                        markMessagesRead
                    );
                }
            );
            setUserSubscription(usersubscription);
            setLoading(false);
        }
    }, [stompClient]); 

    useEffect(() => {
        conversationsRef.current = conversations; // Update conversations ref when conversations change
        selectedConversationRef.current = selectedConversation;
    }, [conversations, selectedConversation]);

    return {loading}
}

export default useUserWebSocket

const processNotification = async (notification, authUser, setAuthUser, conversations, setConversations, selectedConversation, markMessagesRead) => {
    console.log('processing notifications....');
    console.log(conversations);
    if (notification.type === 'SENT' || notification.type === 'DELETED') {
        const conversationIndex = conversations.findIndex(conversation =>  conversation.conversationId === notification.conversationId);
        if (conversationIndex !== -1) {
            const updatedConversations = [...conversations];
            const conversation = updatedConversations[conversationIndex];
            const { messages } = conversation;
            const messageIndex = messages.findIndex(message => message.messageId === notification.messageDTO.messageId);
            if (notification.type === 'SENT') {
                if (messageIndex === -1) {
                    const sound = new Audio(notificationSound);
			        sound.play();
                    messages.push(notification.messageDTO);
                }
            } else if (notification.type === 'DELETED') {
                if (messageIndex !== -1) {
                    messages.splice(messageIndex, 1);
                }
            }
            updatedConversations[conversationIndex] = { ...conversation, messages };
            setConversations(updatedConversations);
            console.log(notification, selectedConversation);
            if(selectedConversation && selectedConversation.conversationId === conversation.conversationId){
                markMessagesRead(conversation);
            }
        }
    }
    else if( notification.type === 'READ'){
        console.log('read');
        try{
            const res = await fetchWithTokenRefresh(`http://localhost:8080/messages/conversation/${notification.conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authUser.accessToken}`
                }
            }, authUser, setAuthUser);
            const data = await res.json();
            if (data.error){ 
                throw new Error(data.error);
            }
            else{
                console.log(data);
                const conversationIndex = conversations.findIndex(conversation => conversation.conversationId === notification.conversationId);
                const updatedConversations = [...conversations];
                updatedConversations[conversationIndex] = data;
                setConversations([...updatedConversations]);
            }

        }
        catch(error){
        }
    }

    else if(notification.type === 'ADDED'){
        console.log('hello1');
        try{
            const res = await fetchWithTokenRefresh(`http://localhost:8080/messages/conversation/${notification.conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authUser.accessToken}`
                }
            }, authUser, setAuthUser);
            const data = await res.json();
            if (data.error){ 
                throw new Error(data.error);
            }
            else{
                setConversations([...conversations, data]);
            }

        }
        catch(error){
        }
    }
    else if(notification.type === 'REMOVED'){ // Right now removing the conversation directly.
        const conversationIndex = conversations.findIndex(conversation => conversation.conversationId === notification.conversationId);
        const updatedConversations = [...conversations];
        updatedConversations.splice(conversationIndex, 1);
        setConversations([...updatedConversations]);
    }
    else if(notification.type === 'ONLINE' || notification.type === 'OFFLINE'){
        try{
            const res = await fetchWithTokenRefresh(`http://localhost:8080/messages/conversation/${notification.conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authUser.accessToken}`
                }
            }, authUser, setAuthUser);
            const data = await res.json();
            if (data.error){ 
                throw new Error(data.error);
            }
            else{
                const conversationIndex = conversations.findIndex(conversation => conversation.conversationId === notification.conversationId);
                const updatedConversations = [...conversations];
                updatedConversations[conversationIndex] = data;
                setConversations([...updatedConversations]);
                console.log(conversations);
            }
        }
        catch(error){
        }
    }
}



