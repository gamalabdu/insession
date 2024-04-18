"use client";
import { deleteConversation } from "@/actions/messages";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { ConversationsContext } from "@/providers/conversations";
import { useContext, useTransition } from "react";
import toast from "react-hot-toast";

interface DeleteConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation_id: string;
}

const DeleteConversationModal = ({
  isOpen,
  onClose,
  conversation_id,
}: DeleteConversationModalProps) => {
  const [isPending, startTransition] = useTransition();
  const { setConversations } = useContext(ConversationsContext);

  const action = (formData: FormData) =>
    startTransition(async () => {
      const { error } = await deleteConversation(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Conversation deleted successfully");
        setConversations((prev) =>
          prev.filter((item) => item.conversation_id !== conversation_id)
        );
        onClose();
      }
    });

  return (
    <Modal
      title="Are you sure?"
      description="Deleting this conversation is permanent"
      isOpen={isOpen}
      onChange={onClose}
    >
      <form action={action}>
        <input type="hidden" name="conversation_id" value={conversation_id} />
        <Button disabled={isPending} type="submit">
          Delete Conversation
        </Button>
      </form>
    </Modal>
  );
};

export default DeleteConversationModal;
