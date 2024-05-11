import React from 'react'
import ConversationItem from './ConversationItem'


interface ConversationsContentProps {
    conversations: ConversationWithMessage[]
}

const ConversationsContent = (props : ConversationsContentProps) => {

    const { conversations } = props 


  return (
    <div className=''>
        {conversations.map((conversation, idx) => {
          return (
            <div key={idx} className="flex items-center gap-x-4 w-full">
              <div className="flex-1 overflow-y-auto">
                <ConversationItem {...conversation} />
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ConversationsContent