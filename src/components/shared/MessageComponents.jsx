import React from 'react'
import moment from 'moment'
import {fileFormat} from '../../lib/feature.js'
import RenderAttachment from './RenderAttachment';

const MessageComponents = ({message,user}) => {
const {sender , content , attachments = [] , createdAt } = message;

  const senderId =
    typeof sender === "object" ? sender._id : sender;

  const sameSender =
    senderId?.toString() === user?._id?.toString();

const timeAgo = moment(createdAt).fromNow();
  return (
    <div className={`px-3 py-2   ${sameSender ? "flex justify-end" : "flex justify-start"}`} >
      <div
        className={`px-3 py-2 rounded-lg max-w-xs ${sameSender
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
          }`}
      >
        {!sameSender && (
          <div className="text-xs font-semibold text-green-600 mb-1">
            {sender?.name}
          </div>
        )}

{
  attachments.length > 0 && (
   attachments.map((attachment,index)=>{
    const url = attachment.url
    const file = fileFormat(url);
    return (
      <div key={attachment.public_id} >
     <a href={url} target='_blank' download className=''>
      <RenderAttachment file={file} url={url} />
     </a>
      </div>

    )
   })
  )
}
        {content && <div className="text-sm ">{content}</div>}

        <div className="text-[10px] text-gray-400 text-right mt-1">
          {timeAgo}
        </div>
        
      </div>
    </div>

  )
}

export default MessageComponents
