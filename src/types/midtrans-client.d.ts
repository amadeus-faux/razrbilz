declare module "midtrans-client" {
  export class Snap {
    constructor(options: {
      isProduction?: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: Record<string, unknown>): Promise<{
      token: string;
      redirect_url: string;
    }>;

    createTransactionToken(
      parameter: Record<string, unknown>
    ): Promise<string>;

    createTransactionRedirectUrl(
      parameter: Record<string, unknown>
    ): Promise<string>;

    transaction: {
      status(orderId: string): Promise<Record<string, unknown>>;
      approve(orderId: string): Promise<Record<string, unknown>>;
      cancel(orderId: string): Promise<Record<string, unknown>>;
      expire(orderId: string): Promise<Record<string, unknown>>;
      refund(orderId: string, parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
  }

  export class CoreApi {
    constructor(options: {
      isProduction?: boolean;
      serverKey: string;
      clientKey: string;
    });
  }

  const midtransClient: {
    Snap: typeof Snap;
    CoreApi: typeof CoreApi;
  };

  export default midtransClient;
}
