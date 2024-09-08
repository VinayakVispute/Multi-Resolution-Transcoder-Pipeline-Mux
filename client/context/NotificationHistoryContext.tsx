"use client";
import { NotificationState } from "@/interface";
import { fetchNotifications } from "@/lib/action/notification.action";
import { fetchUploadedVideos } from "@/lib/action/video.action";
import { Status } from "@prisma/client";
import { UploadedVideo } from "@/interface"
import Pusher from 'pusher-js'
import {
    createContext,
    ReactNode,
    useContext,
    useReducer,
    useEffect,
    useState,
} from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";


const NotificationHistoryContext = createContext<any | null>(null);

export const NotificationHistoryProvider = ({ children }: { children: ReactNode }) => {
    const [videoData, setVideoData] = useState<{ uploadedVideos: UploadedVideo[] } | null>(null)
    const [notifications, setNotifications] = useState<NotificationState[] | []>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const pusher_Key = process.env.NEXT_PUBLIC_PUSHER_PUSHER_KEY || ""
    const pusher_Cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ""
    const { userId, isSignedIn } = useAuth();

    if (!isSignedIn) {
        console.error("User not signed in")
        return null;
    }


    const fetchVideos = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetchUploadedVideos()
            if (!response.success) {
                console.error(response.message)
                setError(response.message)
                return
            }
            setVideoData({ uploadedVideos: response.data })
        } catch (error: any) {
            console.error(error.message)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {

        fetchVideos();

        return () => {
            setVideoData(null);
        };
    }, [])

    useEffect(() => {
        const pusher = new Pusher(pusher_Key, {
            cluster: pusher_Cluster
        });


        const commonChannel = pusher.subscribe(userId);
        commonChannel.bind('statusUpdate', async (update: any) => {
            console.log('Received update:', update)
            const notificationResponse = await fetchNotifications();
            setVideoData((prevData) => {
                if (!prevData) return prevData

                const updatedVideos = prevData.uploadedVideos.map((video) => {
                    if (video.id === update.data.uniqueId) {
                        return { ...video, status: update.success ? Status.FINISHED : Status.FAILED }
                    }
                    return video
                })
                return { uploadedVideos: updatedVideos }
            })
            if (!notificationResponse.success) {
                console.error(notificationResponse.message);
                setNotifications([]);
                return;
            }
            setNotifications(notificationResponse.data);
            toast('New Notification', {
                icon: '🔔',
            });
        });
        return () => {
            pusher.unsubscribe('my-channel');
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const notificationResponse = await fetchNotifications();
            if (!notificationResponse.success) {
                console.error(notificationResponse.message);
                setNotifications([]);
            }
            console.log(notificationResponse.data)
            setNotifications(notificationResponse.data);
        };

        fetchData();

        return () => {
            setNotifications([]);
        };
    }, [])

    return (
        <NotificationHistoryContext.Provider value={{ videoData, notifications, error, isLoading, fetchVideos }}>
            {children}
        </NotificationHistoryContext.Provider>
    );
}

export const useNotificationHistory = () => {
    const context = useContext(NotificationHistoryContext);
    if (!context)
        throw new Error("useSocket must be used within a SocketProvider");
    return context;
}
