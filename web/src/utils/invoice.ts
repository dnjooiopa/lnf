export const validInvoice = (invoice: string): boolean => {
  const invoiceRegex = /^lnbc[a-zA-Z0-9]{200,}$/
  return invoiceRegex.test(invoice)
}
