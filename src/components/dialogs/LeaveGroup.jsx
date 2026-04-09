import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const LeaveGroupMenu = ({ open, handelClose, leaveHandler }) => {
    return (
        <Dialog open={open} onOpenChange={handelClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Leave</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave this Group? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>



                <DialogFooter>
                    <Button variant="outline" onClick={() => handelClose(false)}>
                        No
                    </Button>

                    <Button variant="destructive" onClick={leaveHandler}>
                        Yes, Leave
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveGroupMenu;
