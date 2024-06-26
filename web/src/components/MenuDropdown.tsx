'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import LogoutButton from './LogoutButton'
import BurgerCloseIcon from '@/icons/BurgerCloseIcon'
import { useAppContext } from '@/contexts/AppContext'

const MenuDropdown = () => {
  const { appInfo } = useAppContext()

  return (
    <div className="fixed top-4 right-4 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <Fragment>
            <div className="cursor-pointer">
              <Menu.Button className="justify-center">
                <BurgerCloseIcon className="p-1" isClosed={open} />
              </Menu.Button>
            </div>
            {open && (
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-6 origin-top-right" static>
                  <div className="w-[160px] rounded border border-gray-700 bg-black">
                    {appInfo && (
                      <Menu.Item>
                        <div className="p-2 text-gray-400 text-sm">version {appInfo.version}</div>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <div className=" hover:bg-gray-600">
                        <LogoutButton />
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            )}
          </Fragment>
        )}
      </Menu>
    </div>
  )
}

export default MenuDropdown
