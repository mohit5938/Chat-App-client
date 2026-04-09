import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from "axios";
import { toast } from "react-toastify";
import { server } from './../constants/config.js';
import { useEffect , useState} from "react";
import { useSocket } from '@/util/Socket.jsx'
import { NEW_REQUEST } from '../constants/event.js'
const Notification = () => {

  const [notification , setNotification ] = useState([]);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const getNotification = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/user/notification`,
          { withCredentials: true }
        );

        setNotification(data.notifications);
      } catch (error) {
        toast.error(error?.message || "notification error");
      }
    };

    // initial fetch
    getNotification();

    // stable handler
    const handleNewRequest = () => {
      getNotification();
    };

    socket.on(NEW_REQUEST, handleNewRequest);

    return () => {
      socket.off(NEW_REQUEST, handleNewRequest);
    };
  }, [socket]);




  const handleAccept = async ({ id, accept }) => {
    try {
      const { data } = await axios.put(
        `${server}/api/user/acceptRequest`,
        {
          reqId: id,
          accept: accept,
        },
        {
          withCredentials: true,
        }
      );
      setNotification(prev =>
        prev.filter(item => item._id !== id)
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Request accept error");
    }
  };

  return (
    <div className='mt-4 ml-2' >
      <h1 className='font-bold text-xl mb-4' >Notification</h1>
      <div  className='flex items-center justify-center '>
        <div className='space-y-3'>
          {notification && notification.length === 0 && (
            <h1>No Notification Here</h1>
          )}
          {notification.map(({ sender, _id }) => (
            <div key={_id} className='flex items-center justify-between border p-3 rounded-lg shadow-sm'>

              <div className='flex items-center gap-3'>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={sender?.avatar} alt={sender.name} />
                  <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <p className='font-semibold text-blue-600'>{sender.name}</p>
              </div>

              <div className='flex gap-3'>
                <button
                  className='text-green-600 font-semibold ml-2 '
                  onClick={() => handleAccept({ id: _id, accept: true })}
                >
                  ACCEPT
                </button>

                <button
                  className='text-red-600 font-semibold ml-2 '
                  onClick={() => handleAccept({ id: _id, accept: false })}
                >
                  REJECT
                </button>
              </div>

            </div>
          ))}
        </div>
     
     </div>
    </div>
  )
}

export default Notification
