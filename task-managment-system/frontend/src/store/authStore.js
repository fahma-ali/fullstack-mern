import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
 
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            //set user data and token after successfull login
            login: (user, token) => {
                console.log("STORE LOGIN RUNS:", user);

                set({
                    user: user,
                    token: token,
                    isAuthenticated: true,
                });

                console.log("STATE IMMEDIATELY AFTER SET:", get());
            },
            // clear user data and token after logout
            logOut: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
            }),
            //get token for outside of react component
            getToken: () => get().token
        }),
        {
            name: "auth-store",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated:state.isAuthenticated
            })
        }
    )
)
export default useAuthStore;