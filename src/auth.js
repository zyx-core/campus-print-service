import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { renderStudentDashboard } from './student';
import { renderAdminDashboard } from './admin';
import { renderProfileSetup } from './profile';
import { renderLogin } from './ui';

export const initAuth = () => {
    console.log("initAuth called");

    // Force render if auth takes too long
    const timeout = setTimeout(() => {
        console.log("Auth check timed out, forcing login render");
        renderLogin();
    }, 2000);

    onAuthStateChanged(auth, async (user) => {
        clearTimeout(timeout);
        console.log("onAuthStateChanged triggered", user);
        if (user) {
            // User is signed in, check role
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role === 'admin') {
                        renderAdminDashboard(user);
                    } else {
                        renderStudentDashboard(user);
                    }
                } else {
                    // Profile not set up
                    renderProfileSetup(user);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // If Firestore is offline or there's an error, sign out and show login
                console.log("Firestore appears to be offline or unavailable. Signing out...");
                await auth.signOut();
                renderLogin();
            }
        } else {
            // User is signed out
            renderLogin();
        }
    });
};
