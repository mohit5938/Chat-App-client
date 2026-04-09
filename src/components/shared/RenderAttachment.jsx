import React from 'react'
import {transformImage} from '../../lib/feature.js'
const RenderAttachment = ({file,url}) => {
  
  switch (file) {
    case "video" : 
    return <video src={url}
     preload='none' 
     width={"200px"}
      controls 
        className="rounded-md"
      />
 case "image" :
    return <img src={transformImage(url,200)}
     alt="attachement"
     width={"200px"}
     height={"200px"}
        className="object-contain rounded-md"
        />

        case "audio":
            return <audio
            src={url}
            preload='none'
            controls
            />

      default:
          return (
              <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 underline"
              >
                  Download File
              </a>
          );
}
  
}

export default RenderAttachment
