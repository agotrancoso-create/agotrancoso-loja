export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('InfinitePay webhook:', {
      invoice_slug: data?.invoice_slug,
      amount: data?.amount,
      paid_amount: data?.paid_amount,
      installments: data?.installments,
      transaction_nsu: data?.transaction_nsu,
      order_nsu: data?.order_nsu,
      capture_method: data?.capture_method,
      receipt_url: data?.receipt_url,
    });
  } catch (error) {
    console.error('Invalid InfinitePay webhook:', error);
  }
  return new Response('OK', { status: 200 });
}
