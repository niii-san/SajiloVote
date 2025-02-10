import { useAuthStore } from "../stores";

// AuthStore type
export type AuthStoreType = ReturnType<(typeof useAuthStore)["getState"]>; 
