import { useUser } from '@clerk/nextjs'
import { MessageSquare } from 'lucide-react'
import React from 'react'
import CommentForm from './CommentForm'

type Props = {}

const Comments = (props: Props) => {
    const {user}=useUser();
  return (
    <div className='bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden'>
        <div className='px-6 sm:px-8 py-6 border-b border-[#ffffff0a]'>
            <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
                <MessageSquare
                className='h-5 w-5'
                />
                Discussion
            </h2>
        </div>
        <div>
            {user?(
                <CommentForm/>
            ):(
                <div>
                    
                </div>

            )}
        </div>
        
    </div>
  )
}

export default Comments