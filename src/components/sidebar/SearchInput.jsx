import { useState } from "react";
import { MdPersonAddAlt1 } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import useSearchInput from "../../hooks/useSearchInput";
import toast from "react-hot-toast";

const SearchInput = () => { 
    const [search, setSearch] = useState("");
    const { selectedConversation, setSelectedConversation, conversations, setConversations } = useConversation();
    const { loading, getUserByPhoneNumber } = useSearchInput();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length !== 10) {
            return toast.error("Phone Number should be 10 digits");
        }

        try {
            const { data } = await getUserByPhoneNumber(search);
            if (data) {
                setConversations([...conversations, data]);
                setSelectedConversation(data);
                setSearch("");
            } else {
                toast.error("No data found for the phone number:", search);
            }
        } catch (error) {
            toast.error("Error searching for user.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-6'>
            <label htmlFor="searchInput" className="font-bold text-3xl text-gray-700">Add Friend</label>
            <input
                id="searchInput"
                type='tel'
                placeholder='Search…'
                className='input input-bordered rounded-full'
                value={search}
                pattern="[0-9]{10}"
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='btn btn-circle bg-sky-500 text-white' disabled={loading}>
                <MdPersonAddAlt1 className='w-6 h-6 outline-none' />
            </button>
        </form>

    );
};
export default SearchInput;
