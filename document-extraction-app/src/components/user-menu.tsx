"use client";

import { useUser } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserMenu() {
  const { data: user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 justify-between mb-6">
      <Link
        href="/history"
        className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
      >
        📚 Document History
      </Link>

      <div className="flex items-center gap-3">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-blue-100"
          />
        )}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {user.name || user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
