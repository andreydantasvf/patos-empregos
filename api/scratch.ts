import MercadoPagoConfig, { Payment } from 'mercadopago';

try {
  const client = new MercadoPagoConfig({ accessToken: 'TEST-34636112' });
  const payment = new Payment(client);
  payment.create({ body: { transaction_amount: 10, payment_method_id: 'pix', description: 'desc', payer: { email: 'a@a.com' } } }).catch(e => console.error(e));
} catch(e) {
  console.log('Sync Error:', e);
}
