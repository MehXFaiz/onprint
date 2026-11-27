export async function createQuote(quoteData) {
  const quoteNumber =
    quoteData.quoteNumber ||
    quoteData.orderNumber ||
    `ONP-Q-${Math.floor(100000 + Math.random() * 900000)}`

  return {
    ...quoteData,
    id: Date.now(),
    quoteNumber,
    orderNumber: quoteNumber,
    createdAt: new Date().toISOString(),
    status: quoteData.status || 'Prepared for WhatsApp',
  }
}
