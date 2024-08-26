// import { useSession } from "next-auth/react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  /*const { data: session, status } = useSession();
  // Redirect away if NOT auth
  if (status === "unauthenticated") {
    window.location.href = "/auth";
  }

  if (status === "loading") {
    return <p className={classes.profile}>Loading...</p>;
  }*/

  const updateUser = async (passwordData) => {
    // console.log(passwordData);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PATCH",
        body: JSON.stringify(passwordData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);

      // if (!data.status) throw new Error(data.message || "Something went wrong!");
      return data;
    } catch (error) {
      console.log(error.message);
    }

  };

  // "$2a$12$UnITHeumk1joV8UI9C26jOcclTBXqBiwrgbKOOCoFane75FsnRxXS"
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm updateUser={updateUser} />
    </section>
  );
}

export default UserProfile;
