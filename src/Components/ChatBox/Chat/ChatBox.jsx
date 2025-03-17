import { BsX, BsSend } from "react-icons/bs";
import useAuth from "../../../Hooks/useAuth";
import useSecure from "../../../Hooks/useSequre";
import { GetMassages } from "../../../Hooks/getMassages";
import { useEffect, useState } from "react";

export default function ChatBox({ toggleChat }) {
    const { user } = useAuth();
    const axiosPublic = useSecure();
    const [userMassages, isLoading, refreshMassages] = GetMassages();
    const [isSending, setIsSending] = useState(false); // Loading state for sending messages



    // Get userId (either logged-in user ID or guest ID from local storage)
    const getStoredUserId = () => {
        let storedUserId = localStorage.getItem("guest_userId");
        if (!storedUserId) {
            storedUserId = crypto.randomUUID();
            localStorage.setItem("guest_userId", storedUserId);
        }
        return storedUserId;
    };

  

    const userId = user ? user.uid : getStoredUserId();
    const userName = user ? user.displayName : "Guest";
    const photoURL = user ? user.photoURL : 'https://res.cloudinary.com/dx8o5d32h/image/upload/v1740649951/25415-34512-guestusericon1-l_i3tvbg.jpg';

    // Generate or retrieve chatId for the current user/guest
    const getStoredChatId = () => {
        let storedChatId = localStorage.getItem("chatId");
        if (!storedChatId) {
            storedChatId = crypto.randomUUID();
            localStorage.setItem("chatId", storedChatId);
        }
        return storedChatId;
    };

    const chatId = getStoredChatId();

    // Find the chat for the current user/guest
    const userChat = userMassages.find(chat => chat.chatId === chatId);
    const messages = userChat ? userChat.messages : [];



    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(() => {
            refreshMassages(); // Fetch new messages every 2 seconds
        }, 2000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [refreshMassages]);

    // Send a new message
    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        const messageText = e.target.message.value.trim();
        if (!messageText) return;

        setIsSending(true); // Set loading state

        const newMessage = {
            chatId, // Include chatId in the message object
            sender: userName,
            photoURL,
            userId,
            text: messageText,
            date: new Date().toLocaleString(),
        };

        try {
            await axiosPublic.patch("/api/chat-data", newMessage);
            refreshMassages(); // Refresh messages after sending
            e.target.reset();

            // Simulate bot reply after 10 seconds
            setTimeout(async () => {
                const botMessage = {
                    chatId,
                    sender: "Bot",
                    photoURL: "https://th.bing.com/th/id/OIP.7qmefhVNpMs7J1c_TG29jAHaHa?w=176&h=180&c=7&r=0&o=5&pid=1.7",
                    userId: "bot",
                    text: "Thank you for your message! Wait for admin replay?",
                    date: new Date().toLocaleString(),
                };

                await axiosPublic.patch("/api/chat-data", botMessage);
                refreshMassages(); // Refresh messages after bot reply
            }, 10000); // 10 seconds delay
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false); // Reset loading state
        }
    };

    return (
        <div className="fixed bottom-4 dark:text-black right-0 lg:right-4 w-full max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-black ">Chat Support</h2>
                <button onClick={toggleChat} className="text-gray-500 dark:text-black hover:text-red-500 transition">
                    <BsX size={24} />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="h-60 overflow-y-auto p-2 bg-gray-50 rounded-md">
                {isLoading ? (
                    <p className="text-gray-500 text-sm text-center dark:text-black">Loading messages...</p>
                ) : messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"} mb-3`}>
                            <div className={`flex items-end gap-2 ${msg.sender === userName ? "flex-row-reverse" : "flex-row"}`}>
                                <img
                                    src={msg.photoURL || "https://res.cloudinary.com/dx8o5d32h/image/upload/v1740649951/25415-34512-guestusericon1-l_i3tvbg.jpg"}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === userName ? "bg-blue-500 text-white" : msg.sender === "Bot" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800 dark:text-black"}`}>
                                    <p className="text-sm dark:text-black ">{msg.text}</p>
                                    <p className="text-xs dark:text-black text-gray-400 mt-1">{msg.date}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-black text-sm text-center">No messages yet. Start the conversation!</p>
                )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmitMessage} className="flex items-center mt-3 border rounded-md overflow-hidden">
                <input
                    type="text"
                    name="message"
                    className="w-full p-3 dark:bg-[#efefef]  text-gray-700 focus:outline-none"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    disabled={isSending}
                    className="bg-blue-700 dark:text-white dark:bg-black text-white px-4 py-2 flex items-center hover:bg-blue-600 transition disabled:bg-blue-300"
                >
                    {isSending ? <span className="flex items-center gap-2"><BsSend size={20} /> Sending...</span> : <BsSend size={20} />}
                </button>
            </form>
        </div>
    );
}