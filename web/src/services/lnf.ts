import { AxiosRequestConfig } from 'axios'

import {
  CreateInvoiceParams,
  CreateInvoiceResult,
  GetBalanceResult,
  ListTransactionsParams,
  ListTransactionsResult,
  PayInvoiceParams,
} from '@/types/lnf'

import BaseService from './base'

export class LnFService extends BaseService {
  static getBalance(config: AxiosRequestConfig = {}): Promise<GetBalanceResult> {
    return this._post('/lnf.getbalance', {}, config)
  }

  static createInvoice(params: CreateInvoiceParams, config: AxiosRequestConfig = {}): Promise<CreateInvoiceResult> {
    return this._post('/lnf.createinvoice', params, config)
  }

  static payInvoice(params: PayInvoiceParams, config: AxiosRequestConfig = {}): Promise<{}> {
    return this._post('/lnf.payinvoice', params, config)
  }

  static listTransactions(
    params: ListTransactionsParams,
    config: AxiosRequestConfig = {}
  ): Promise<ListTransactionsResult> {
    return this._post('/lnf.listtransactions', params, config)
  }
}
