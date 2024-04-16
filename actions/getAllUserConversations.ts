// import { createClient } from "@/utils/supabase/server";
// import { ConversationReturnItem } from "@/types";

// const getAllConversations = async (): Promise < ConversationReturnItem [] > => {

//   const supabase = createClient();

//   const {
//     data: { user },
//     error: sessionError,
//   } = await supabase.auth.getUser()

//   // const { data, error: convoError } = await supabase
//   // .from('conversation_participants')
//   // .select(`
//   //     conversation_id,
//   //     profile:user_id (id, username, avatar_url)
//   // `)
//   // .order("created_at", { ascending: false })

//   // return data as any

//   const { data, error } = await supabase
//   .from('conversations')
//   .select(`
//     conversation_id,
//     conversation_participants (
//       profiles (
//         id,
//         username,
//         avatar_url
//       )
//     )
//   `)
//   // .filter('conversation_participants.user_id', 'neq', user?.id);

// if (error) {
//   console.error('Error fetching data', error);
// }

//   return data as any

// };

// export default getAllConversations;

// import { ConversationReturnItem, Profile } from "@/types"
// import { createClient } from "@/utils/supabase/server"

// const getAllConversations = async (): Promise<ConversationReturnItem[]> => {

//   const supabase = createClient();

//   const { data: {user}, error: sessionError } = await supabase.auth.getUser();

//   // const { data, error } = await supabase
//   //   .from('conversation_participants')
//   //   .select(`
//   //     conversation_id,
//   //     profiles(*)
//   //   `)

//   // get all chats where the current user is a member
//   const { data: conversationIds } = await supabase
//   .from('conversations')
//   .select('conversation_id, users:conversation_participants!inner(conversation_id)')
//   .eq('users.user_id', user?.id)

// // get all chats with the user profiles
//    const { data: conversationData, error: conversationError} = await supabase
//   .from('conversations')
//   .select('conversation_id, conversation_participants!inner( profiles(*) )')
//   .neq("conversation_participants.conversation_id", user?.id)
//   .in('conversation_id', [conversationIds?.map(conversation => conversation.conversation_id)])
//   // .returns<ConversationReturnItem[]>()

//   return conversationData as any;

// }

// export default getAllConversations;
