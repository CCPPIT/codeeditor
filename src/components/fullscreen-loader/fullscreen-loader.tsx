"use client"
import { LoaderIcon } from 'lucide-react'
import React from 'react'

type Props = {
    label?:string
}

const FullScreenLoader = ({label}: Props) => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
    <LoaderIcon className='size-6 text-muted-foreground animate-spin'/>
    {label&&<p className='text-sm text-muted-foreground'>{label}</p>}
</div>
  )
}

export default FullScreenLoader