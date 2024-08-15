"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-end lg:justify-between gap-x-4 p-5">
      <div className="hidden lg:flex lg:flex-1">search</div>
      <UserButton />
    </div>
  );
};
