import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig.js";

function populateUserInfo() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const { name = "", school = "", city = "" } = userData;

          document.getElementById("nameInput").value = name;
          document.getElementById("schoolInput").value = school;
          document.getElementById("cityInput").value = city;

          document.getElementById("personalInfoFields").disabled = true;
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    } else {
      console.log("No user is signed in");
    }
  });
}

document.querySelector("#editButton").addEventListener("click", () => {
  document.getElementById("personalInfoFields").disabled = false;
});

document.querySelector("#saveButton").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user is signed in");
    return;
  }

  const name = document.getElementById("nameInput").value;
  const school = document.getElementById("schoolInput").value;
  const city = document.getElementById("cityInput").value;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name,
      school,
      city,
    });
    console.log("User info updated successfully!");

    document.getElementById("personalInfoFields").disabled = true;
  } catch (error) {
    console.error("Error updating user info:", error);
  }
});

populateUserInfo();
