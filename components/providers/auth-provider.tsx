"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GithubAuthProvider,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signInWithEmailAndPassword,
    User as FirebaseUser
} from "firebase/auth";
import { auth, githubProvider } from "@/lib/firebase";
import { useWalletStore } from "@/lib/store/wallet-store";

interface User {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    authMethod: "firebase" | "github" | "metamask";
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (method: User["authMethod"], credentials?: { email: string, pass: string }) => Promise<void>;
    sendEmailLink: (email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { setAddress } = useWalletStore();

    // Sync Firebase user to our local state
    useEffect(() => {
        // Handle Email Link Sign-in
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if (email) {
                signInWithEmailLink(auth, email, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem('emailForSignIn');
                        router.push('/');
                    })
                    .catch((error) => {
                        console.error('Email Link Error:', error);
                    });
            }
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Determine method (this is a simplified check)
                const method = firebaseUser.providerData[0]?.providerId === "github.com" ? "github" : "firebase";

                const mappedUser: User = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || "User",
                    email: firebaseUser.email || undefined,
                    photoURL: firebaseUser.photoURL || undefined,
                    authMethod: method as any
                };
                setUser(mappedUser);
                setAddress(firebaseUser.uid);
                localStorage.setItem("steller-user", JSON.stringify(mappedUser));
            } else {
                // Check if we have a MetaMask session (only if no firebase user)
                const savedUser = localStorage.getItem("steller-user");
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    if (parsed.authMethod === "metamask") {
                        setUser(parsed);
                        setAddress(parsed.uid);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (method: User["authMethod"], credentials?: { email: string, pass: string }) => {
        setLoading(true);
        try {
            if (method === "github") {
                await signInWithPopup(auth, githubProvider);
                router.push("/");
            } else if (method === "firebase") {
                if (credentials) {
                    await signInWithEmailAndPassword(auth, credentials.email, credentials.pass);
                    router.push("/");
                } else {
                    // Fallback to simulation if no creds provided for demo
                    // In real app, this would show a modal or redirect to email login
                    throw new Error("Email credentials required for Firebase auth");
                }
            } else if (method === "metamask") {
                if (typeof window !== "undefined" && (window as any).ethereum) {
                    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                    const address = accounts[0];
                    const metamaskUser: User = {
                        uid: address,
                        displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
                        authMethod: "metamask"
                    };
                    setUser(metamaskUser);
                    setAddress(address);
                    localStorage.setItem("steller-user", JSON.stringify(metamaskUser));
                    router.push("/");
                } else {
                    throw new Error("MetaMask not found");
                }
            }
        } catch (error: any) {
            console.error("Auth Error:", error.message);
            alert(`Authentication Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const sendEmailLink = async (email: string) => {
        setLoading(true);
        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true,
        };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            alert("Security link sent! Check your inbox to authorize vault access.");
        } catch (error: any) {
            console.error("Email Link Send Error:", error.message);
            alert(`Failed to send link: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("steller-user");
            router.push("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, sendEmailLink, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
