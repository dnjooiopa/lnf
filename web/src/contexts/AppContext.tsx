'use client'

import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { PriceService } from '@/services/price'
import useIsMounted from '@/hooks/useIsMounted'
import { BalanceUnit } from '@/enums'
import { AppInfo } from '@/types/app'
import { AppService } from '@/services/app'

interface IAppContext {
  displayAmount?: (amountSat: number, unit: BalanceUnit) => string
  changeAmountUnit: () => void
  amountUnit: BalanceUnit
  appInfo?: AppInfo
}

export const AppContext = createContext<IAppContext>({
  changeAmountUnit: () => {},
  amountUnit: BalanceUnit.SATS,
})

interface IAppContextProviderProps extends PropsWithChildren {}

const unitList = [BalanceUnit.SATS, BalanceUnit.THB]

export const AppContextProvider: FC<IAppContextProviderProps> = ({ children }) => {
  const isMounted = useIsMounted()
  const [priceTHB, setPriceTHB] = useState(0)
  const [priceUSD, setPriceUSD] = useState(0)
  const [balanceUnitIdx, setBalanceUnitIdx] = useState(0)
  const [appInfo, setAppInfo] = useState<AppInfo>()

  const fetchAppInfo = async () => {
    try {
      const res = await AppService.getInfo()
      setAppInfo(res)
    } catch (e) {
      console.error('error:', e)
    }
  }

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

    fetchAppInfo()
    fetchPrice()
  }, [isMounted])

  const displayAmount = useCallback(
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

  const amountUnit = useMemo(() => unitList[balanceUnitIdx], [balanceUnitIdx])

  const changeAmountUnit = useCallback(() => {
    setBalanceUnitIdx((prev) => {
      return prev + 1 >= unitList.length ? 0 : prev + 1
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        displayAmount,
        changeAmountUnit,
        amountUnit,
        appInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
