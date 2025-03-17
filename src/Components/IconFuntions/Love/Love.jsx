import { CiHeart } from "react-icons/ci";
import useSecure from "../../../Hooks/useSequre";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import { UseWishList } from "../../../Hooks/wishList/useWishList";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Love({ product }) {
    const axiosSecure = useSecure();
    const { user } = useAuth();
    const [wishItems, isLoading, refetch] = UseWishList();
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Generate or retrieve guest ID from local storage
    const guestId = localStorage.getItem('guestId') || uuidv4();
    if (!localStorage.getItem('guestId')) {
        localStorage.setItem('guestId', guestId);
    }

    // Ensure wishItems is always an array
    const safeWishItems = Array.isArray(wishItems) ? wishItems : [];

    // Check if the product is in the wishlist
    useEffect(() => {
        if (product) {
            const isProductInWishlist = safeWishItems.some(
                (item) => item.Product_id === product._id && (item.user_Email === user?.email || item.user_Uid === guestId)
            );
            setIsInWishlist(isProductInWishlist);
        }
    }, [safeWishItems, product, user, guestId]);

    const toggleWishlist = () => {
        const cartItems = {
            title: product.title,
            Discount_price: product.discount_price,
            image: product.images[0],
            price: product.price,
            discount_price:product.discount_percent,
            Product_id: product._id,
            user_Email: user?.email ,
            user_Uid: user?.uid || guestId,
            wishlist: true,
        };

        if (isInWishlist) {
            // Remove from wishlist
            axiosSecure
                .delete(`/api/wishItems`, { data: { Product_id: product._id, user_Email: user?.email , user_Uid: user?.uid || guestId } })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success('Item removed from wishlist');
                        setIsInWishlist(false);
                        refetch();
                    }
                })
                .catch((error) => {
                    console.error('Error removing item:', error);
                    if (error.response && error.response.status === 404) {
                        toast.error('Item not found in wishlist');
                    } else {
                        toast.error('Failed to remove item from wishlist');
                    }
                });
        } else {
            // Add to wishlist
            axiosSecure
                .post(`/api/wishItems`, cartItems)
                .then((res) => {
                    if (res.status === 201) {
                        toast.success('Item added to wishlist successfully');
                        setIsInWishlist(true);
                        refetch();
                    }
                })
                .catch((error) => {
                    console.error('Error adding item:', error);
                    if (error.response && error.response.status === 400) {
                        toast.error('Item already added to wishlist');
                    } else {
                        toast.error('Failed to add item to wishlist');
                    }
                });
        }
    };

    return (
        <CiHeart
            onClick={toggleWishlist}
            className={`text-2xl p-1 cursor-pointer bg-white  dark:text-black rounded-full ${isInWishlist ? 'text-red-600 ' : 'text-black'}`}
        />
    );
}