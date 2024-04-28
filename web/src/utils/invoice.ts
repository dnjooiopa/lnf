import b11 from 'bolt11'

export const validInvoice = (invoice: string): boolean => {
  try {
    const decoded = decodeInvoice(invoice)
    return !!decoded?.complete
  } catch (e) {
    return false
  }
}

export const decodeInvoice = (invoice: string) => {
  try {
    return b11.decode(invoice)
  } catch (e) {}
}
