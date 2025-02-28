
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailAddress: string;
  onEmailChange: (email: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function EmailDialog({
  open,
  onOpenChange,
  emailAddress,
  onEmailChange,
  onSend,
  isSending,
}: EmailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Journal Entry</DialogTitle>
          <DialogDescription>
            Send this journal entry to your email address.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={emailAddress}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onSend}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
