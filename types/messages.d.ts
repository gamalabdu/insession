type StorageFile = {
  id: string;
  type: string;
  url: string;
  file_name: string;
  message_id: string;
};

interface Message {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  seen: boolean;
  sent_at: string;
}

interface MessageWithFiles extends Message {
  files: StorageFile[];
}

interface Conversation {
  conversation_id: string;
  created_at: string;
  users: Profile[];
}

interface ConversationWithMessage extends Conversation {
  latest_message: MessageWithFiles;
}

type ConversationParticipant = {
  user_id: string;
  conversation_id: string;
};
