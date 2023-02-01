import React from 'react'
import { RiAccountCircleFill } from 'react-icons/ri'
export default function Navbar() {
  return (
    <div className="container mx-auto">
        <div className="text-black p-5">
            <div className="flex justify-between items-center">
                <img src="./logo-no-background.png" alt="Logo" className='h-10'/>
                <ul className='flex items-center space-x-3'>
                    <li>
                        <button className='p-1'>
                            <RiAccountCircleFill className='text-[#b4b4b4] hover:text-primary' size={28}/>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}
