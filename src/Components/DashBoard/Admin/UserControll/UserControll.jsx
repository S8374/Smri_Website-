import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useSecure from "../../../../Hooks/useSequre";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuthHeaders from "../../../../Hooks/useAuthHeaders";
import useAuth from "../../../../Hooks/useAuth";
import useAdmin from "../../../../Hooks/userRole/useAdmin";

export default function UserControl() {
  const axiosSecure = useSecure();
  const headers = useAuthHeaders();
  const { user, logOut } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin()

  const { data: Users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosSecure.get("/api/users", { headers });
      return response.data.users;
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/api/users/${id}`)
          .then(() => {
            toast.success("User deleted successfully");
            refetch();
          })
          .catch(() => {
            toast.error("Failed to delete user");
          });
      }
    });
  };

  const handleUpdateRole = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to make this user a seller?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/api/users/${email}`, { role: "seller" })
          .then(() => {
            Swal.fire({
              title: "Successfully Updated!",
              text: "User role has been updated to seller.",
              icon: "success",
            });
            refetch();
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Failed to update user role.",
              icon: "error",
            });
          });
      }
    });
  };

  if (isLoading || isAdminLoading) {
    return <p>Loading ...</p>;
  }
  if (isAdmin === !true) {
    return logOut()
  }
  return (
    <div className="p-4 dark:text-black">
      <h2 className="text-xl font-semibold mb-4">Manage Users Page</h2>
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:text-black text-gray-700">
              <th>#</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="dark:text-black">
            {Users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-100 dark:text-black">
                <td>{index + 1}</td>
                <td className="flex items-center gap-3">
                  <img src={user.profileImage || "https://img.daisyui.com/images/profile/demo/2@94.webp"} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-bold dark:text-black">{user.username}</div>
                    <div className="text-sm opacity-50 dark:text-black">{user.email || "Unknown Location"}</div>
                  </div>
                </td>
                <td>{user.phone || "Not Provided"}</td>
                <td>{user.statusRequest || "No"}</td>
                <td>{user.role || "No Role Assigned"}</td>
                <td className="flex gap-2 dark:text-black">
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                  {user.statusRequest === "want seller" && (
                    <Button variant="contained" color="primary" size="small" onClick={() => handleUpdateRole(user.email)}>
                      Make Seller
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {Users.map((user, index) => (
          <div key={user._id} className="bg-white dark:text-black shadow-lg p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <img src={user.profileImage || "https://img.daisyui.com/images/profile/demo/2@94.webp"} alt="Avatar" className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-bold text-lg">{user.username}</h3>
                <p className="text-sm text-gray-500 dark:text-black">{user.email || "Unknown Location"}</p>
                <p className="text-sm text-gray-500 dark:text-black">{user.phone || "Not Provided"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 dark:text-black font-semibold">Status: <span className="text-gray-500 dark:text-black">{user.statusRequest || "No"}</span></p>
              <p className="text-gray-700 font-semibold dark:text-black">Role: <span className="text-gray-500 dark:text-black">{user.role || "No Role Assigned"}</span></p>
            </div>
            <div className="flex gap-2 mt-4 dark:text-black">
              <Button variant="contained" color="error" size="small" fullWidth onClick={() => handleDelete(user._id)}>
                Delete
              </Button>
              {user.statusRequest === "want seller" && (
                <Button variant="contained" color="primary" size="small" fullWidth onClick={() => handleUpdateRole(user.email)}>
                  Make Seller
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
