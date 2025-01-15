import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import {UserResource}from "@clerk/types"
import { Zap } from 'lucide-react'

type Props = {
    userStats:{
        totalExcutions:number,
        languageCount:number,
        languages:string[],
        last24Hours:number,
        favoriteLanguage:string,
        languageStats:Record<string,number>,
        mostStarredLanguage:string
    },
    userData:{
        _id:Id<"users">,
        _creationTime:number,
        proSince?:number|undefined,
        lemonSqueezyCustomerId?:string|undefined,
        lemonSqueezyOrderId?:string|undefined,
        name:string,
        userId:string,
        email:string,
        isPro:boolean

    },
    user:UserResource
}

const ProfileHeader = ({userStats,userData,user}: Props) => {
  return (
    <div className='relative mb-8 bg-gradient-to-br from-[#12121a] to-[#1a1a2e]  rounded-2xl p-8 border border-gray-800/50 overflow-hidden'>
        <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size-32px]'/>
            <div className='relative flex items-center gap-8'>
                <div className='relative group'>
                <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
          blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
          />
          <img
          src={user.imageUrl}
          alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-800/50 relative z-10 group-hover:scale-105 transition-transform"
          />
          {userData.isPro&&(
            <div className='absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-full z-20 shadow-lg animate-pulse'>
                <Zap className='w-4 h-4 text-white'/>
                </div>
          )}

                </div>

            </div>
    </div>
  )
}

export default ProfileHeader