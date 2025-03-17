import { useParams } from "react-router-dom";
import { GetMassages } from "../../../Hooks/getMassages";
import useSecure from "../../../Hooks/useSequre";
import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";

export default function Replay() {
    const { chatId } = useParams();
    const [userMassages, isLoading, refreshMassages] = GetMassages();
    const axiosSecure = useSecure();
    const { user } = useAuth();
    const selectedUser = userMassages.find(msg => msg.chatId === chatId);
    const userName = user?.displayName;
    const [isSending, setIsSending] = useState(false); // Loading state for sending messages

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(() => {
            refreshMassages(); // Fetch new messages every 2 seconds
        }, 2000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [refreshMassages]);

    const photoURL = user ? user.photoURL : 'https://res.cloudinary.com/dx8o5d32h/image/upload/v1740649951/25415-34512-guestusericon1-l_i3tvbg.jpg';

    const handleGiveAnswers = async (e) => {
        e.preventDefault();
        const answersText = e.target.answers.value.trim();

        if (!answersText) return;

        setIsSending(true); // Set loading state

        const answersMessage = {
            chatId, // Include chatId in the message object
            sender: userName,
            text: answersText,
            photoURL,
            date: new Date().toLocaleString(),
        };

        try {
            await axiosSecure.patch('/api/chat-data', answersMessage);
            refreshMassages(); // Refresh messages after sending
            e.target.reset();
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false); // Reset loading state
        }
    };

    return (
        <div className="h-full w-full sm:w-[700px]  bg-white p-0 lg:p-4 rounded-lg ">
            {selectedUser ? (
                <>
                    <h2 className="text-xl font-bold mb-4">{selectedUser.userName}'s Messages</h2>

                    {/* Scrollable Messages Container */}
                    <div className="max-h-[250px] overflow-y-auto space-y-4 mb-4 border-b pb-4">
                        {isLoading ? (
                            <p className="text-gray-500 text-sm text-center">Loading messages...</p>
                        ) : selectedUser.messages.length > 0 ? (
                            selectedUser.messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 mb-4 ${msg.sender === userName ? "flex-row-reverse" : ""}`}>
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <img
                                            alt="User Avatar"
                                            src={msg.photoURL || "https://res.cloudinary.com/dx8o5d32h/image/upload/v1740649951/25415-34512-guestusericon1-l_i3tvbg.jpg"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className={`flex flex-col max-w-[75%] ${msg.sender === userName ? "items-end" : ""}`}>
                                        <div className="text-sm text-gray-500">{msg.sender}</div>
                                        <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === userName ? "bg-gray-300 text-black" : "bg-blue-500 text-white"}`}>
                                            {msg.text}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">{msg.date}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center">No messages yet. Start the conversation!</p>
                        )}
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleGiveAnswers} className="flex items-center gap-2">
                        <input
                            type="text"
                            name="answers"
                            required
                            placeholder="Type your reply..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isSending}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>
                    </form>
                </>
            ) : (
                <p className="text-gray-500">No messages found for this user.</p>
            )}
        </div>
    );
}
