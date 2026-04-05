import React from "react";
import { auth, signIn, logout } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogIn, LogOut, User } from "lucide-react";
import { cn } from "../lib/utils";

export const Auth: React.FC<{ className?: string }> = ({ className }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-lg" />;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
            <button
              onClick={() => logout()}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ""} className="w-10 h-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In with Google</span>
          <span className="sm:hidden">Sign In</span>
        </button>
      )}
    </div>
  );
};
