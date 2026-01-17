import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { order_id, amount, customer_email, customer_name } = req.body;
    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;

    if (!order_id || !amount || !customer_email || !customer_name) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Generate DOKU Signature (Joker Standard)
    // Format: ClientID + RequestTimestamp + RequestTarget + Digest
    // Digest = Base64(SHA256(Body))

    const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z";
    const requestTarget = "/checkout/v1/payment"; // Endpoint path

    const bodyData = {
        order: {
            amount: amount,
            invoice_number: order_id,
            currency: "IDR",
            callback_url: "https://razrbilz.id/#archive", // Redirect back to site
            auto_redirect: true
        },
        payment: {
            payment_due_date: 60 // 60 minutes
        },
        customer: {
            name: customer_name,
            email: customer_email
        }
    };

    const bodyString = JSON.stringify(bodyData);

    // Calculate Digest
    const digest = crypto.createHash('sha256').update(bodyString).digest('base64');

    // Calculate Signature string
    const signatureString = `Client-Id:${clientId}\nRequest-Id:${order_id}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;

    // HMAC-SHA256 Signature
    const signature = crypto.createHmac('sha256', secretKey).update(signatureString).digest('base64');
    const finalSignature = `HMACSHA256=${signature}`;

    try {
        const response = await fetch('https://api-sandbox.doku.com/checkout/v1/payment', { // TODO: Check if PROD URL is needed based on "biteship_live" key, likely PROD.
            // DOKU Prod URL: https://api.doku.com/checkout/v1/payment
            // User provided live Biteship key, likely assumes Live DOKU too.
            // Changing to PROD URL: https://api.doku.com/checkout/v1/payment
            // WAIT: User provided DOKU_CLIENT_ID starting with BRN. BRN usually implies Business Registration Number?
            // User snippet shows: DOKU_CLIENT_ID= BRN-0263-1768651760090
            // Let's use the Production URL.
            method: 'POST',
            headers: {
                'Client-Id': clientId,
                'Request-Id': order_id,
                'Request-Timestamp': requestTimestamp,
                'Signature': finalSignature,
                'Content-Type': 'application/json'
            },
            body: bodyString
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('DOKU Error Response:', data);
            throw new Error(data.error?.message || 'Failed to create payment link');
        }

        // DOKU Checkout API returns response.payment.url
        const paymentUrl = data.response?.payment?.url;

        if (!paymentUrl) {
            throw new Error('Payment URL not found in DOKU response');
        }

        res.status(200).json({ payment_url: paymentUrl });

    } catch (error) {
        console.error('DOKU Payment Create Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
