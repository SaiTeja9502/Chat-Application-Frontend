import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='border-r border-slate-500 p-4 flex flex-col w-80'>
			<Profile />
			<div className='divider px-3'></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;
