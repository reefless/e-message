import React from 'react'

export default function FormInput({name, placeholder,label,...rest}) {
  return (
    <div>
        <label htmlFor="{name}" className='text-[#70707B]'>{label}</label>
        <input id="{name}" name={name} {...rest} class="focus:outline-none focus:border-b border-sky-600 w-full pb-2  placeholder-gray-500 mb-5"  placeholder={placeholder}/>
        
    </div>
  )
}
