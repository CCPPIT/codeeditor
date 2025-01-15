"usel client"
import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    code:string
}

const CopyButton = ({code}: Props) => {
    const [copied,setCopied]=useState(false);
    const copyToClipboard=async()=>{
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(()=>setCopied(false),2000)
    }
  return (
    <button
    onClick={copyToClipboard}
    type='button'
    className='p-4 hover:bg-white/10 rounded-lg transition-all duration-200 group relative'
    >
        {copied?(
            <Check className='size-4 text-green-400'/>
        ):(
            <Copy className='size-4 text-gray-400 group-hover:text-gray-300'/>

        )}
    </button>
  )
}

export default CopyButton