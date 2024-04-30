'use client'

import { FC, PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'

import { PriceService } from '@/services/price'
import useIsMounted from '@/hooks/useIsMounted'

interface IAppContext {
  priceTHB: number
  priceUSD: number
}

export const AppContext = createContext<IAppContext>({
  priceTHB: 0,
  priceUSD: 0,
})

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

  const value: IAppContext = useMemo(() => ({ priceTHB, priceUSD }), [priceTHB, priceUSD])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
