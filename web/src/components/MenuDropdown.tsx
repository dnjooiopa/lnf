'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import LogoutButton from './LogoutButton'

const MenuDropdown = () => {
  return (
    <div className="fixed top-4 right-4 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="justify-center">Menus</Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 origin-top-right">
            <div className="p-1 rounded border border-gray-700">
              <Menu.Item>{({ active }) => <LogoutButton />}</Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default MenuDropdown
