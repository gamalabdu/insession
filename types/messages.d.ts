interface Message {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  seen: boolean;
  sent_at: string;
  messages_files: StorageFile[];
}

interface Conversation {
  conversation_id: string;
  created_at: string;
  users: Profile[];
}

interface ConversationWithMessage extends Conversation {
  latest_message: Message | null;
}

type ConversationParticipant = {
  user_id: string;
  conversation_id: string;
};
