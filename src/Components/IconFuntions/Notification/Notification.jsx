export default function Notification({ newItems }) {
    return (
        <div className="absolute items-center  -ml-32   mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <h3 className="text-lg font-semibold text-black">Notifications</h3>
            <ul className="mt-2">
                {newItems.length > 0 ? (
                    newItems.map((item, index) => (
                        <li key={index} className="border-b py-2 text-sm text-black">
                            🛍️ New item added: {item.title}
                        </li>
                    ))
                ) : (
                    <li className="py-2 text-sm text-black">No new notifications.</li>
                )}
            </ul>
        </div>
    );
}