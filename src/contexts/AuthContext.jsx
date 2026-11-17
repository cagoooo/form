import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user role from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                } else {
                    // Default role for new users (e.g., Google login)
                    // If it's the shared admin account, force admin role
                    const role = user.email === 'admin@form.system' ? 'admin' : 'editor';
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: role,
                        createdAt: new Date()
                    });
                    setUserRole(role);
                }
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = () => {
        // App 內建瀏覽器（LINE／FB 等）：Google 禁止在此登入（403 disallowed_useragent）。
        // 頁首防護會自動跳轉／引導；使用者按「先不登入，繼續瀏覽」後又按登入時，在這裡再提醒一次，不開登入視窗。
        if (/FBAN|FBAV|FB_IAB|Instagram|Messenger|MicroMessenger|KAKAOTALK|\bLine\//i.test(navigator.userAgent || '')) {
            try { window.alert('您目前在 App 內建瀏覽器（LINE／FB 等）中，Google 基於安全政策禁止在此登入。\n\n請點右上／右下角「⋯」→ 選「用預設瀏覽器開啟」後再登入。'); } catch (e) { }
            return null;
        }
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const loginWithSharedAccount = (password) => {
        return signInWithEmailAndPassword(
            auth,
            import.meta.env.VITE_ADMIN_EMAIL,
            password || import.meta.env.VITE_ADMIN_PASSWORD
        );
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userRole,
        loginWithGoogle,
        loginWithSharedAccount,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
