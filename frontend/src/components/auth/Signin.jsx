import React from 'react'
import FormInput from '../form/FormInput'
import Submit from '../form/Submit'
import Title from '../form/Title'

export default function Signin() {
  return (
    <div class="w-full h-screen overflow-scroll block h-screen flex items-center justify-center" >
        <div class="bg-white py-6 px-10 sm:max-w-md w-full ">
            <Title>Log into your dashboard</Title>
            <form>
                <FormInput name="email" placeholder="enter your email" label="Email"/>
                <FormInput name="password" placeholder="enter your password" label="Password"/>
                <div class="flex justify-center my-6">
                    <Submit value="Sign in" />
                </div>
                <div className="flex justify-center">
                    <a href="#" class="text-gray-500 hover:text-sky-600 my-2"> Forgot a password?</a>
                </div>
                <div class="flex justify-center ">
                    <a href="#" class="text-gray-500 hover:text-sky-600 my-2"> Sign Up</a>
                </div>
            </form>
        </div>
    </div>
  )
}


