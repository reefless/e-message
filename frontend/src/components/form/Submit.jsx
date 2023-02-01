import React from 'react'

export default function Submit ({value}) {
  return (
    <input type="submit" value={value} class="rounded-full  p-3 w-full sm:w-56 bg-icon transition hover:bg-gradient-to-r from-sky-600  to-teal-300 text-white duration-700 text-lg font-semibold " />
  )
}
