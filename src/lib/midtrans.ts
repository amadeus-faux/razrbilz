// Midtrans Snap client setup
// Using midtrans-client package

import midtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
export const MIDTRANS_IS_PRODUCTION = isProduction;

export interface MidtransTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export async function createSnapTransaction(params: MidtransTransactionParams) {
  const transactionDetails = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    item_details: params.items,
  };

  const transaction = await snap.createTransaction(transactionDetails);
  return {
    token: transaction.token as string,
    redirectUrl: transaction.redirect_url as string,
  };
}

import crypto from "crypto";

export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string
): string {
  const input = orderId + statusCode + grossAmount + serverKey;
  return crypto.createHash("sha512").update(input).digest("hex");
}
