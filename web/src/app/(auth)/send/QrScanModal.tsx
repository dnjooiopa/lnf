import { FC, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QrReader } from 'react-qr-reader'

import { validInvoice } from '@/utils/invoice'

interface IQrScanProps {
  closeModal: () => void
  setInvoice: (invoice: string) => void
}

const QrScan: FC<IQrScanProps> = ({ closeModal, setInvoice }) => {
  let [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="h-auto max-h-[500px] w-full max-w-md transform overflow-hidden bg-gray-300 rounded p-2 text-left align-middle shadow-xl transition-all">
                  <QrReader
                    constraints={{
                      facingMode: 'environment',
                      width: { max: 2000, min: 480 },
                    }}
                    className="w-full mb-2"
                    scanDelay={250}
                    onResult={(result, error) => {
                      if (!!result) {
                        let inv = result?.getText()
                        if (!inv) return

                        inv = inv.trim()
                        inv = inv.toLowerCase().trim()
                        console.log('invoice:', inv)
                        if (!validInvoice(inv)) return

                        setInvoice(inv)
                        setIsOpen(false)
                        closeModal()
                      }

                      if (!!error) {
                        console.log(error)
                      }
                    }}
                  />

                  <div className="mt-auto w-full">
                    <button
                      type="button"
                      className="flex items-center justify-center py-2 w-full rounded bg-gray-700"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default QrScan
