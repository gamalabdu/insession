"use client";
import { useContext, useTransition } from "react";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { ConversationsContext } from "@/providers/conversations";
import deleteSessionBySessionId from "@/actions/deleteSessionBySessionId";

interface DeleteSessionModalProps {
  deleteModalOpen: boolean;
  jobId: string;
  userId: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteSessionModal = ({
  deleteModalOpen,
  jobId,
  userId,
  onClose,
}: DeleteSessionModalProps) => {
  const [isPending, startTransition] = useTransition();
  const { setConversations } = useContext(ConversationsContext);

  const action = () => {
    startTransition(async () => {
      try {
        await deleteSessionBySessionId(jobId, userId); // Call deleteSessionBySessionId

        toast.success("Session deleted successfully");

        onClose(true);

      } catch (error) {

        toast.error("Failed to delete session");
        console.error("Error deleting session:", error);
        
      }
    });
  };

  return (
    <Modal
      title="Are you sure?"
      description="Deleting this session is permanent"
      isOpen={deleteModalOpen}
      onChange={onClose}
    >
      <form onSubmit={(e) => { e.preventDefault(); action(); }}>
        <Button disabled={isPending} type="submit">
          Delete Session
        </Button>
      </form>
    </Modal>
  );
};

export default DeleteSessionModal;
