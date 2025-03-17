import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "../StripePayment/StripePayment";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentModal({ totalPrice,product  , quantity,userDetail}) {
    return (
        <div>
            {/* Bank Payment Modal */}
            <dialog id="bank_payment_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Bank Payment Details</h3>
                    <div>
                        <Elements stripe={stripePromise}>
                            <StripePayment product={product} userDetail={userDetail} totalPrice={totalPrice} quantity={quantity} />
                        </Elements>
                    </div>
                </div>
            </dialog>
        </div>
    );
}