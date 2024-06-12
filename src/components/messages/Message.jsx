import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { FaCheck, FaCheckDouble } from 'react-icons/fa';

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	 const fromMe = message.senderId === authUser.userId;
	 const formattedTime = extractTime(message.sentDateTime);
	 const chatClassName = fromMe ? "chat-end" : "chat-start";
	 let profilePic, profileName;
	 
	if (!fromMe && selectedConversation.contacts.length > 1) {
        const senderContact = selectedConversation.contacts.find(contact => contact.contactId === message.senderId);
		profilePic = senderContact.base64Image ? senderContact.base64Image : null;
		
    } else if(fromMe){
        profilePic = authUser.base64Image ? authUser.base64Image :null;
	} else {
		profilePic = selectedConversation.contacts[0].base64Image ? selectedConversation.contacts[0].base64Image : null;
	}
	if (!fromMe && selectedConversation.contacts.length > 1) {
         const senderContact = selectedConversation.contacts.find(contact => contact.contactId === message.senderId);
         profileName = senderContact.username.substring(0,2); 
    } else {
         profileName = fromMe ? authUser.username.substring(0,2) : selectedConversation?.contacts[0]?.username.substring(0,2);
    }
	 const bubbleBgColor = fromMe ? "bg-green-500" : "";

	 const getIcon = (message) => {
		if (message.read) {
			return <FaCheckDouble className="text-blue-600 mr-1 w-5 h-3" />;
		} else if (message.delivered) {
			return <FaCheckDouble className="mr-1 w-5 h-3" />;
		} else {
			return <FaCheck className="mr-1" />;
		}
	};

	//const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					{profilePic ? <img src={`data:image/jpeg;base64,${profilePic}`}  alt='Tailwind CSS chat bubble component' />:
						<span className="text-2xl flex items-center justify-center w-full h-full rounded-full bg-gray-300 text-gray-600">{profileName}</span>
					}
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
				{message.message}
				<div className="chat-footer opacity-40 text-xs flex items-center">
					{fromMe && getIcon(message)}
					<span className="ml-2">{formattedTime}</span> {/* Display time */}
				</div>

			</div>	
		</div>
	);
};
export default Message;
//${shakeClass} ${chatClassName}