import { useEffect } from "react";

import { pingAppwrite } from "./appwrite";

/**
 * Hook to verify Appwrite connection on app initialization
 */
export function useAppwriteInit() {
  useEffect(() => {
    const verifyConnection = async () => {
      await pingAppwrite();
    };

    verifyConnection();
  }, []);
}
