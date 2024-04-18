"use client"
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { createClient } from '@/utils/supabase/client';
import React from 'react'
import toast from 'react-hot-toast';

interface DeleteConversationModalProps {
  isOpen: boolean
  onClose : () => void
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const DeleteConversationModal = (props: DeleteConversationModalProps) => {

    const { isOpen, onClose, onDelete } = props

    return (
        <Modal 
        title="Are you sure?"
        description="Deleting this conversation is permanent"
        isOpen={isOpen}
        onChange={onClose}
    >
        <Button onClick={(e) => onDelete(e)}>Delete Conversation</Button>
    </Modal>
    );
  };

  export default DeleteConversationModal
  