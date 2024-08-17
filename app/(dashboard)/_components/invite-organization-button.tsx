import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function InviteOrganizationButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <Plus className="h-4 w-5 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <OrganizationProfile routing="hash" />
      </DialogContent>
    </Dialog>
  );
}
