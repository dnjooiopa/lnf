'use client'

import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { PriceService } from '@/services/price'
import useIsMounted from '@/hooks/useIsMounted'
import { BalanceUnit } from '@/enums'

interface IAppContext {
  displayBalance?: (amountSat: number, unit: BalanceUnit) => string
}

export const AppContext = createContext<IAppContext>({})

interface IAppContextProviderProps extends PropsWithChildren {}

export const AppContextProvider: FC<IAppContextProviderProps> = ({ children }) => {
  const isMounted = useIsMounted()
  const [priceTHB, setPriceTHB] = useState(0)
  const [priceUSD, setPriceUSD] = useState(0)

  const fetchPrice = async () => {
    try {
      const res = await PriceService.getPrice()
      setPriceTHB(res?.bitcoin['thb'] ?? 0)
      setPriceUSD(res?.bitcoin['usd'] ?? 0)
    } catch (e) {
      console.error('error:', e)
    }
  }

  useEffect(() => {
    if (!isMounted) return

    fetchPrice()
  }, [isMounted])

  const displayBalance = useCallback(
    (amountSat: number, unit: BalanceUnit) => {
      switch (unit) {
        case BalanceUnit.SATS:
          return amountSat.toString()
        case BalanceUnit.THB:
          const blTHB = (amountSat * priceTHB) / 100000000
          return amountSat > 0 && blTHB <= 0 ? '...' : blTHB.toFixed(2)
        case BalanceUnit.USD:
          const blUSD = (amountSat * priceUSD) / 100000000
          return amountSat > 0 && blUSD <= 0 ? '...' : blUSD.toFixed(2)
        default:
          return amountSat.toString()
      }
    },
    [priceTHB, priceUSD]
  )

  return (
    <AppContext.Provider
      value={{
        displayBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
