"use client"
import NavigationHeader from '@/components/NavigationHeader'
import React from 'react'
// import ProfileHeader from './_components/ProfileHeader'
// import { useUser } from '@clerk/nextjs'
// import { useQuery } from 'convex/react'
// import { api } from '../../../convex/_generated/api'
// import { useRouter } from 'next/navigation'



const ProfilePage = () => {
    // const {user,isLoaded}=useUser()
    // const router=useRouter()
    
    // const userData=useQuery(api.users.getUser,{
    //     userId:user?.id??""
    // })
    // if(!user&&isLoaded)return router.push("/")

  return (
    <div className='min-h-screen bg-[#0a0a0f]'>
        <NavigationHeader/>
        <div className='max-w-7xl mx-auto px-4 py-12'>
            {/* <ProfileHeader user={user!} userData={userData} userStats={}/> */}

        </div>
    </div>
  )
}

export default ProfilePage