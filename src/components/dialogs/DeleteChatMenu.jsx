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

const DeleteChatMenu = ({ open, handelClose, deleteHandler }) => {
    return (
        <Dialog open={open} onOpenChange={handelClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this Chat? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>



                <DialogFooter>
                    <Button variant="outline" onClick={() => handelClose(false)}>
                        No
                    </Button>

                    <Button variant="destructive" onClick={deleteHandler}>
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChatMenu;
