type Conversation = {
  conversation_id: string;
  created_at: string;
  users: Profile[];
};

type ConversationParticipant = {
  user_id: string;
  conversation_id: string;
};
