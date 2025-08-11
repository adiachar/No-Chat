import { useEffect, useRef } from "react";
import ChatCard from "../cards/ChatCard.jsx";
import { useDispatch, useSelector} from "react-redux";
import { setConversations } from "../../features/NoChatApp/noChatAppSlice.js";
import axios from "axios";

export default function MyConnections() {

    const user = useSelector(state => state.user);
    const connections = useSelector((state) => state.connections);
    const conversations = useSelector(state => state.conversations);
    const headers = useSelector(state => state.headers);
    const dispatch = useDispatch();


    useEffect(() => {
        async function getConversation(con_id) {
            try {
                let response = await axios.get(`https://nochat.onrender.com/data/conversation/${con_id}`, {headers});
                if(response.status == 200) {
                    dispatch(setConversations({con_id, messages: response.data.messages}));                   
                }
            } catch(err) {
                console.log(err);
            }
        }

        //getting all messages for every conversation id's
        (connections && Object.keys(conversations).length == 0) && Object.entries(connections).map(async ([key, val]) => {
            let con_id = [user._id, key].sort().join("_");
            await getConversation(con_id);
        });
    }, [connections]);

    return(
        <div className="h-12/12 pt-50 px-6 w-full overflow-y-auto flex flex-col gap-6">
            {
                Object.entries(connections).length != 0 ? 
                    Object.entries(connections).map(([key, value]) => (
                        <ChatCard user = {value} key={key}/>
                    )) : 
                !user._id ? 
                Array(5).fill(null).map((_, key) => <ChatCard user={""} key={key}/>) :
                <>
                    <h1 className="w-full mt-20 text-3xl text-gray-500 text-center font-bold">You have no Connections</h1>
                    <p className="w-full text-gray-500 text-center">Try Making new Connections in the Connect section</p>
                </>
            }
        </div>
    );
}