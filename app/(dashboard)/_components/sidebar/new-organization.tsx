"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewOrganization = () => {
  return (
    <Dialog>
      <Hint
        label="Create organization"
        side="right"
        align="start"
        sideOffset={18}
      >
        <DialogTrigger asChild>
          <div className="aspect-square">
            <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
              <Plus className="text-white" />
            </button>
          </div>
        </DialogTrigger>
      </Hint>
      <DialogContent className="p-0 bg-white border-none max-w-[432px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
