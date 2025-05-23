import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import usePublic from "../../../Hooks/usePublic";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function UserComments({ product, refetch, handleNewComment }) {
  const { user } = useAuth();
  const axiosPublic = usePublic();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate or retrieve unique user ID
  useEffect(() => {
    let storedId = localStorage.getItem("guestUserId");
    if (!storedId) {
      storedId = crypto.randomUUID(); // Generate new ID
      localStorage.setItem("guestUserId", storedId);
    }
    setUserId(storedId);
  }, []);

  const handleComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newReview = {
      action: "addComment",
      user: user?.displayName || "Guest",
      review: e.target.comment.value,
      productID: product._id,
      userId,
    };

    try {
      const response = await axiosPublic.patch("/api/products", newReview);
      e.target.reset();
      if (response.data.success) {
        refetch()
        toast.success("Your Comment Added Successfully");

      }
    } catch (error) {
      // console.error("Error adding comment:", error.response ? error.response.data : error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewIndex) => {
    if (!replyText.trim()) return;
    setLoading(true);

    const newReply = {
      action: "addReply",
      productID: product._id,
      reviewIndex,
      user: user?.displayName || "Guest",
      reply: replyText,
      userId,
    };

    try {
      const response = await axiosPublic.patch("/api/products", newReply);
      if (response.data.success) {
        refetch()
        toast.success("Reply added successfully");
        setReplyingTo(null);
        setReplyText("");

      }
    } catch (error) {
      // console.error("Error adding reply:", error.response ? error.response.data : error);
      toast.error("Failed to add reply");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDislike = async (reviewIndex, likeDislike) => {
    setLoading(true);
    try {
      const response = await axiosPublic.patch("/api/products", {
        action: "likeDislike",
        productID: product._id,
        reviewIndex,
        likeDislike,
      });
      if (response.data.success) {
        refetch()
        toast.success(`Comment ${likeDislike}d successfully`);

      }
    } catch (error) {
      // console.error("Error updating like/dislike:", error.response ? error.response.data : error);
      toast.error(`Failed to ${likeDislike} comment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black">
      <Toaster position="top-center" reverseOrder={false} />
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Customer Comments</h2>

          <div className="space-y-4">
            {product?.review?.length > 0 ? (
              product.review.map((review, index) => (
                (review.comment === "Sample comment" && review.user === "Sample user") ? null : (
                  <div key={index} className="bg-white dark:text-black p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <img src="https://via.placeholder.com/40" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <h3 className="font-semibold">{review.user || "Anonymous"}</h3>
                        <p className="text-sm dark:text-black text-gray-500">Posted on {review.date || "Unknown Date"}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-black">{review.review || "No comment provided."}</p>

                    {/* Like & Dislike Buttons */}
                    <div className="flex items-center mt-2">
                      <button onClick={() => handleLikeDislike(index, "like")} className="text-blue-500 dark:text-black flex items-center mr-3">
                        <FaThumbsUp className="mr-1" /> {review.likes}
                      </button>
                      <button onClick={() => handleLikeDislike(index, "dislike")} className="text-red-500 dark:text-black flex items-center">
                        <FaThumbsDown className="mr-1" /> {review.dislikes}
                      </button>
                    </div>

                    {/* Reply Section */}
                    <button onClick={() => setReplyingTo(index)} className="text-blue-500 dark:text-black mt-2">Reply</button>
                    {replyingTo === index && (
                      <div className="mt-2">
                        <textarea
                          className="w-full px-3 py-2 border dark:bg-[#efefef]  dark:text-black border-gray-300 rounded-md mt-2"
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <button
                          onClick={() => handleReply(index)}
                          className="bg-blue-500 text-white dark:text-black px-4 py-2 rounded-md mt-2"
                          disabled={loading}
                        >
                          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Submit Reply"}
                        </button>
                      </div>
                    )}

                    {/* Display Replies */}
                    {review.replies?.length > 0 && (
                      <div className="mt-4 pl-6 border-l-2 dark:text-black border-gray-200">
                        {review.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} className="mt-2">
                            <div className="flex items-center">
                              <img src="https://via.placeholder.com/30" alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
                              <div>
                                <h4 className="font-semibold">{reply.user}</h4>
                                <p className="text-sm dark:text-black text-gray-500">{reply.date}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-black">{reply.reply}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))
            ) : (
              <p className="text-gray-500 dark:text-black">No comments yet. Be the first to comment!</p>
            )}

          </div>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="mt-8 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold dark:text-black mb-2">Add a Comment</h3>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-black font-medium mb-2">Name</label>
              <input type="text" id="name"  defaultValue={user?.displayName || "Guest"} name="name" className="w-full px-3 py-2 dark:bg-yellow-50 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4 ">
              <label htmlFor="comment" className="block dark:text-black text-gray-700 font-medium mb-2">Comment</label>
              <textarea id="comment" name="comment" rows="4" className="w-full px-3 py-2 border border-gray-300 dark:bg-[#efefef] rounded-md" required></textarea>
            </div>
            <button type="submit" className="bg-blue-500 dark:text-white dark:bg-black text-white px-4 py-2 rounded-md" disabled={loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Post Comment"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}