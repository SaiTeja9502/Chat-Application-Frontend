import { useEffect, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import { fetchWithTokenRefresh } from './useFetchWithRefreshToken'; 
import notificationSound from "../assets/sounds/notification.mp3";
import useMarkConversationAsRead from './useMarkConversationAsRead';

const useGroupWebSocket = (conversation) => {
    if(conversation.name != null) {
        const { authUser, setAuthUser } = useAuthContext(); 
        const { stompClient, groupSubscription, setGroupSubscription } = useSocketContext();
        const { conversations, setConversations, selectedConversation} = useConversation();
        const {markMessagesRead} = useMarkConversationAsRead();
        const conversationsRef = useRef(conversations);
        const selectedConversationRef = useRef(selectedConversation);

        useEffect(()=>{
            if(conversation.name !== null && stompClient && authUser){
                const groupsubscription = stompClient.subscribe(`/group/${conversation.conversationId}`, (message) => {
                const notification = JSON.parse(message.body);
                setTimeout(()=> {processNotification(notification, authUser, setAuthUser, conversationsRef.current, setConversations, selectedConversationRef.current, markMessagesRead)}, 1000);
                });
                setGroupSubscription([...groupSubscription, groupsubscription]);
                return () => {
                    groupsubscription.unsubscribe();
                };
            }
        },[stompClient])

        useEffect(() => {
            conversationsRef.current = conversations; // Update conversations ref when conversations change
            selectedConversationRef.current = selectedConversation;
        }, [conversations, selectedConversation]);
    }

}

export default useGroupWebSocket;

const processNotification = async (notification, authUser, setAuthUser, conversations, setConversations, selectedConversation, markMessagesRead) => {
    console.log('group notifications....')
    if (notification.type === 'SENT' || notification.type === 'DELETED') {
        if(notification.senderId !== authUser.userId){
            const conversationIndex = conversations.findIndex(conversation => conversation.conversationId === notification.conversationId);
            if (conversationIndex !== -1) {
                const updatedConversations = [...conversations]; 
                const conversation = updatedConversations[conversationIndex];
                const { messages } = conversation;
                const messageIndex = messages.findIndex(message => message.messageId === notification.messageDTO.messageId);
        
                if (notification.type === 'SENT') {
                    if (messageIndex === -1) {
                        const sound = new Audio(notificationSound);
			            sound.play();
                        console.log(notification.messageDTO);
                        messages.push(notification.messageDTO);
                    }
                } else if (notification.type === 'DELETED') {
                    if (messageIndex !== -1) {
                        messages.splice(messageIndex, 1);
                    }
                }
                updatedConversations[conversationIndex] = { ...conversation, messages };
                setConversations(updatedConversations);
                if(selectedConversation && selectedConversation.conversationId === notification.conversationId){
                    markMessagesRead(conversation);
                }
            }
        }
        
    }
    
    else if(notification.type === 'READ'){
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
            }
        }
        catch(error){
        }
    }
    else if(notification.type === 'ADDED'){
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
            }

        }
        catch(error){
        }
    }
    else if(notification.type === 'REMOVED'){ 
        if(authUser.userId === notification.contact.contactId){
            const conversationIndex = conversations.findIndex(conversation => conversation.conversationId === notification.conversationId);
            const updatedConversations = [...conversations];
            updatedConversations.splice(conversationIndex, 1);
            setConversations([...updatedConversations]);
        } else {
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
                }
    
            }
            catch(error){
            }
        }
    }
    else if(notification.senderId !== authUser.userId && notification.type === 'ONLINE' || notification.type === 'OFFLINE' ){
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
    else if( notification.type === 'LEFT'){
        setConversations(prevConversations => {
            return prevConversations.map(conversation => {
                if (conversation.conversationId === notification.conversationId) {
                    const updatedContacts = conversation.contacts.filter(contact => contact.contactId !== notification.contact.contactId);
                    return { ...conversation, contacts: updatedContacts };
                }
                return conversation;
            });
        });
    }
    else if (notification.type === 'ADMIN') {
        if (authUser.userId === notification.contact.contactId) {
            setConversations(prevConversations => {
                return prevConversations.map(conversation => {
                    if (conversation.conversationId === notification.conversationId) {
                        return { ...conversation, userRole: 'ADMIN' };
                    }
                    return conversation;
                });
            });
        } else {
            setConversations(prevConversations => {
                return prevConversations.map(conversation => {
                    if (conversation.conversationId === notification.conversationId) {
                        const updatedContacts = conversation.contacts.map(contact => {
                            if (contact.contactId === notification.contact.contactId) {
                                return { ...contact, role: 'ADMIN' };
                            }
                            return contact;
                        });
                        return { ...conversation, contacts: updatedContacts };
                    }
                    return conversation;
                });
            });
        }
    }
    

}

