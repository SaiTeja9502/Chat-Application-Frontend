import { useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";
import useCreateGroup from "../../hooks/useCreateGroup";

const AddGroupInput = () => {
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { conversations, setConversations } = useConversation();
    const {loading, createGroup} = useCreateGroup();
    
    const friends = conversations.map(conversation => {
        if (conversation.name === null) {
            return conversation.contacts[0];
        }
        return null;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName) return toast.error("Please enter a group name.");
        if (!selectedMembers.length) return toast.error("Please select at least one member.");

        try {
            createGroup(groupName, selectedMembers);
            setGroupName("");
            setSelectedMembers([]);
        } catch (error) {
            toast.error("Error creating group conversation.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-6'>
            <label htmlFor="groupNameInput" className="font-bold text-3xl text-gray-700">Add Group</label>
            <input
                id="groupNameInput"
                type='text'
                placeholder='Enter group name…'
                className='input input-bordered rounded-full'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
            {/* Display list of available friends */}
            <div className="flex flex-col items-start gap-2">
                {friends.map(friend => {
                    if (friend) {
                        return (
                            <div key={friend.contactId} className="flex justify-between w-full">
                                <label className="font-bold text-xl text-gray-700">{friend.username}</label>
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(friend.contactId)}
                                    onChange={(e) => {
                                        const memberId = friend.contactId;
                                        if (e.target.checked) {
                                            setSelectedMembers([...selectedMembers, memberId]);
                                        } else {
                                            setSelectedMembers(selectedMembers.filter(id => id !== memberId));
                                        }
                                    }}
                                    className="ml-2"
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
            {loading ? <span className='loading loading-spinner '></span> : <MdGroupAdd className='w-6 h-6 outline-none' />}
            </button>
        </form>
    );
};

export default AddGroupInput;
