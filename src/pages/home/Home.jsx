import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useUserWebSocket from "../../hooks/useUserWebSocket";


const Home = () => {
    const {loading} = useUserWebSocket();
    console.log('rendered in home');
	return (
		<div className='flex sm:h-[450px] md:h-[580px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            {loading ? ( // Render loading indicator or nothing while loading
                <span>Loading...</span>
            ) : (
                <>
                    <Sidebar />
                    <MessageContainer />
                </>
            )}
        </div>
	);
};
export default Home;

