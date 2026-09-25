
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model SizeGuide
 * 
 */
export type SizeGuide = $Result.DefaultSelection<Prisma.$SizeGuidePayload>
/**
 * Model ProductSize
 * 
 */
export type ProductSize = $Result.DefaultSelection<Prisma.$ProductSizePayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model ExchangeRate
 * 
 */
export type ExchangeRate = $Result.DefaultSelection<Prisma.$ExchangeRatePayload>
/**
 * Model ShippingLog
 * 
 */
export type ShippingLog = $Result.DefaultSelection<Prisma.$ShippingLogPayload>
/**
 * Model OrderItem
 * 
 */
export type OrderItem = $Result.DefaultSelection<Prisma.$OrderItemPayload>
/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Products
 * const products = await prisma.product.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Products
   * const products = await prisma.product.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sizeGuide`: Exposes CRUD operations for the **SizeGuide** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SizeGuides
    * const sizeGuides = await prisma.sizeGuide.findMany()
    * ```
    */
  get sizeGuide(): Prisma.SizeGuideDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productSize`: Exposes CRUD operations for the **ProductSize** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductSizes
    * const productSizes = await prisma.productSize.findMany()
    * ```
    */
  get productSize(): Prisma.ProductSizeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exchangeRate`: Exposes CRUD operations for the **ExchangeRate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExchangeRates
    * const exchangeRates = await prisma.exchangeRate.findMany()
    * ```
    */
  get exchangeRate(): Prisma.ExchangeRateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shippingLog`: Exposes CRUD operations for the **ShippingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShippingLogs
    * const shippingLogs = await prisma.shippingLog.findMany()
    * ```
    */
  get shippingLog(): Prisma.ShippingLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderItem`: Exposes CRUD operations for the **OrderItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderItems
    * const orderItems = await prisma.orderItem.findMany()
    * ```
    */
  get orderItem(): Prisma.OrderItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Product: 'Product',
    SizeGuide: 'SizeGuide',
    ProductSize: 'ProductSize',
    Order: 'Order',
    ExchangeRate: 'ExchangeRate',
    ShippingLog: 'ShippingLog',
    OrderItem: 'OrderItem',
    Admin: 'Admin'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "product" | "sizeGuide" | "productSize" | "order" | "exchangeRate" | "shippingLog" | "orderItem" | "admin"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      SizeGuide: {
        payload: Prisma.$SizeGuidePayload<ExtArgs>
        fields: Prisma.SizeGuideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SizeGuideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SizeGuideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          findFirst: {
            args: Prisma.SizeGuideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SizeGuideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          findMany: {
            args: Prisma.SizeGuideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>[]
          }
          create: {
            args: Prisma.SizeGuideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          createMany: {
            args: Prisma.SizeGuideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SizeGuideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>[]
          }
          delete: {
            args: Prisma.SizeGuideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          update: {
            args: Prisma.SizeGuideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          deleteMany: {
            args: Prisma.SizeGuideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SizeGuideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SizeGuideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>[]
          }
          upsert: {
            args: Prisma.SizeGuideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SizeGuidePayload>
          }
          aggregate: {
            args: Prisma.SizeGuideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSizeGuide>
          }
          groupBy: {
            args: Prisma.SizeGuideGroupByArgs<ExtArgs>
            result: $Utils.Optional<SizeGuideGroupByOutputType>[]
          }
          count: {
            args: Prisma.SizeGuideCountArgs<ExtArgs>
            result: $Utils.Optional<SizeGuideCountAggregateOutputType> | number
          }
        }
      }
      ProductSize: {
        payload: Prisma.$ProductSizePayload<ExtArgs>
        fields: Prisma.ProductSizeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductSizeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductSizeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          findFirst: {
            args: Prisma.ProductSizeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductSizeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          findMany: {
            args: Prisma.ProductSizeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>[]
          }
          create: {
            args: Prisma.ProductSizeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          createMany: {
            args: Prisma.ProductSizeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductSizeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>[]
          }
          delete: {
            args: Prisma.ProductSizeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          update: {
            args: Prisma.ProductSizeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          deleteMany: {
            args: Prisma.ProductSizeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductSizeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductSizeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>[]
          }
          upsert: {
            args: Prisma.ProductSizeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductSizePayload>
          }
          aggregate: {
            args: Prisma.ProductSizeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductSize>
          }
          groupBy: {
            args: Prisma.ProductSizeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductSizeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductSizeCountArgs<ExtArgs>
            result: $Utils.Optional<ProductSizeCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      ExchangeRate: {
        payload: Prisma.$ExchangeRatePayload<ExtArgs>
        fields: Prisma.ExchangeRateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExchangeRateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExchangeRateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          findFirst: {
            args: Prisma.ExchangeRateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExchangeRateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          findMany: {
            args: Prisma.ExchangeRateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>[]
          }
          create: {
            args: Prisma.ExchangeRateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          createMany: {
            args: Prisma.ExchangeRateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExchangeRateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>[]
          }
          delete: {
            args: Prisma.ExchangeRateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          update: {
            args: Prisma.ExchangeRateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          deleteMany: {
            args: Prisma.ExchangeRateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExchangeRateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExchangeRateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>[]
          }
          upsert: {
            args: Prisma.ExchangeRateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExchangeRatePayload>
          }
          aggregate: {
            args: Prisma.ExchangeRateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExchangeRate>
          }
          groupBy: {
            args: Prisma.ExchangeRateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExchangeRateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExchangeRateCountArgs<ExtArgs>
            result: $Utils.Optional<ExchangeRateCountAggregateOutputType> | number
          }
        }
      }
      ShippingLog: {
        payload: Prisma.$ShippingLogPayload<ExtArgs>
        fields: Prisma.ShippingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShippingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShippingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          findFirst: {
            args: Prisma.ShippingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShippingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          findMany: {
            args: Prisma.ShippingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>[]
          }
          create: {
            args: Prisma.ShippingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          createMany: {
            args: Prisma.ShippingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShippingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>[]
          }
          delete: {
            args: Prisma.ShippingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          update: {
            args: Prisma.ShippingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          deleteMany: {
            args: Prisma.ShippingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShippingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShippingLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>[]
          }
          upsert: {
            args: Prisma.ShippingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingLogPayload>
          }
          aggregate: {
            args: Prisma.ShippingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShippingLog>
          }
          groupBy: {
            args: Prisma.ShippingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShippingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShippingLogCountArgs<ExtArgs>
            result: $Utils.Optional<ShippingLogCountAggregateOutputType> | number
          }
        }
      }
      OrderItem: {
        payload: Prisma.$OrderItemPayload<ExtArgs>
        fields: Prisma.OrderItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findFirst: {
            args: Prisma.OrderItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          findMany: {
            args: Prisma.OrderItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          create: {
            args: Prisma.OrderItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          createMany: {
            args: Prisma.OrderItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          delete: {
            args: Prisma.OrderItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          update: {
            args: Prisma.OrderItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          deleteMany: {
            args: Prisma.OrderItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[]
          }
          upsert: {
            args: Prisma.OrderItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>
          }
          aggregate: {
            args: Prisma.OrderItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderItem>
          }
          groupBy: {
            args: Prisma.OrderItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderItemCountArgs<ExtArgs>
            result: $Utils.Optional<OrderItemCountAggregateOutputType> | number
          }
        }
      }
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    product?: ProductOmit
    sizeGuide?: SizeGuideOmit
    productSize?: ProductSizeOmit
    order?: OrderOmit
    exchangeRate?: ExchangeRateOmit
    shippingLog?: ShippingLogOmit
    orderItem?: OrderItemOmit
    admin?: AdminOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    orderItems: number
    sizes: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orderItems?: boolean | ProductCountOutputTypeCountOrderItemsArgs
    sizes?: boolean | ProductCountOutputTypeCountSizesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountOrderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountSizesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductSizeWhereInput
  }


  /**
   * Count Type SizeGuideCountOutputType
   */

  export type SizeGuideCountOutputType = {
    products: number
  }

  export type SizeGuideCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | SizeGuideCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * SizeGuideCountOutputType without action
   */
  export type SizeGuideCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuideCountOutputType
     */
    select?: SizeGuideCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SizeGuideCountOutputType without action
   */
  export type SizeGuideCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    items: number
    shippingLogs: number
  }

  export type OrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | OrderCountOutputTypeCountItemsArgs
    shippingLogs?: boolean | OrderCountOutputTypeCountShippingLogsArgs
  }

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
  }

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountShippingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type ProductSumAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    price: number | null
    category: string | null
    isActive: boolean | null
    isPreOrder: boolean | null
    stock: number | null
    createdAt: Date | null
    sizeGuideId: string | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    description: string | null
    price: number | null
    category: string | null
    isActive: boolean | null
    isPreOrder: boolean | null
    stock: number | null
    createdAt: Date | null
    sizeGuideId: string | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    price: number
    category: number
    images: number
    isActive: number
    isPreOrder: number
    stock: number
    createdAt: number
    sizeGuideId: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
    stock?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
    stock?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    price?: true
    category?: true
    isActive?: true
    isPreOrder?: true
    stock?: true
    createdAt?: true
    sizeGuideId?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    price?: true
    category?: true
    isActive?: true
    isPreOrder?: true
    stock?: true
    createdAt?: true
    sizeGuideId?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    price?: true
    category?: true
    images?: true
    isActive?: true
    isPreOrder?: true
    stock?: true
    createdAt?: true
    sizeGuideId?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images: string[]
    isActive: boolean
    isPreOrder: boolean
    stock: number
    createdAt: Date
    sizeGuideId: string | null
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    price?: boolean
    category?: boolean
    images?: boolean
    isActive?: boolean
    isPreOrder?: boolean
    stock?: boolean
    createdAt?: boolean
    sizeGuideId?: boolean
    orderItems?: boolean | Product$orderItemsArgs<ExtArgs>
    sizes?: boolean | Product$sizesArgs<ExtArgs>
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    price?: boolean
    category?: boolean
    images?: boolean
    isActive?: boolean
    isPreOrder?: boolean
    stock?: boolean
    createdAt?: boolean
    sizeGuideId?: boolean
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    price?: boolean
    category?: boolean
    images?: boolean
    isActive?: boolean
    isPreOrder?: boolean
    stock?: boolean
    createdAt?: boolean
    sizeGuideId?: boolean
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    price?: boolean
    category?: boolean
    images?: boolean
    isActive?: boolean
    isPreOrder?: boolean
    stock?: boolean
    createdAt?: boolean
    sizeGuideId?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "price" | "category" | "images" | "isActive" | "isPreOrder" | "stock" | "createdAt" | "sizeGuideId", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orderItems?: boolean | Product$orderItemsArgs<ExtArgs>
    sizes?: boolean | Product$sizesArgs<ExtArgs>
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sizeGuide?: boolean | Product$sizeGuideArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      orderItems: Prisma.$OrderItemPayload<ExtArgs>[]
      sizes: Prisma.$ProductSizePayload<ExtArgs>[]
      sizeGuide: Prisma.$SizeGuidePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      description: string
      price: number
      category: string
      images: string[]
      isActive: boolean
      isPreOrder: boolean
      stock: number
      createdAt: Date
      sizeGuideId: string | null
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orderItems<T extends Product$orderItemsArgs<ExtArgs> = {}>(args?: Subset<T, Product$orderItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sizes<T extends Product$sizesArgs<ExtArgs> = {}>(args?: Subset<T, Product$sizesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sizeGuide<T extends Product$sizeGuideArgs<ExtArgs> = {}>(args?: Subset<T, Product$sizeGuideArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly slug: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Int'>
    readonly category: FieldRef<"Product", 'String'>
    readonly images: FieldRef<"Product", 'String[]'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly isPreOrder: FieldRef<"Product", 'Boolean'>
    readonly stock: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly sizeGuideId: FieldRef<"Product", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.orderItems
   */
  export type Product$orderItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * Product.sizes
   */
  export type Product$sizesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    where?: ProductSizeWhereInput
    orderBy?: ProductSizeOrderByWithRelationInput | ProductSizeOrderByWithRelationInput[]
    cursor?: ProductSizeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductSizeScalarFieldEnum | ProductSizeScalarFieldEnum[]
  }

  /**
   * Product.sizeGuide
   */
  export type Product$sizeGuideArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    where?: SizeGuideWhereInput
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model SizeGuide
   */

  export type AggregateSizeGuide = {
    _count: SizeGuideCountAggregateOutputType | null
    _min: SizeGuideMinAggregateOutputType | null
    _max: SizeGuideMaxAggregateOutputType | null
  }

  export type SizeGuideMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SizeGuideMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SizeGuideCountAggregateOutputType = {
    id: number
    name: number
    description: number
    measurements: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SizeGuideMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SizeGuideMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SizeGuideCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    measurements?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SizeGuideAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SizeGuide to aggregate.
     */
    where?: SizeGuideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SizeGuides to fetch.
     */
    orderBy?: SizeGuideOrderByWithRelationInput | SizeGuideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SizeGuideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SizeGuides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SizeGuides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SizeGuides
    **/
    _count?: true | SizeGuideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SizeGuideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SizeGuideMaxAggregateInputType
  }

  export type GetSizeGuideAggregateType<T extends SizeGuideAggregateArgs> = {
        [P in keyof T & keyof AggregateSizeGuide]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSizeGuide[P]>
      : GetScalarType<T[P], AggregateSizeGuide[P]>
  }




  export type SizeGuideGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SizeGuideWhereInput
    orderBy?: SizeGuideOrderByWithAggregationInput | SizeGuideOrderByWithAggregationInput[]
    by: SizeGuideScalarFieldEnum[] | SizeGuideScalarFieldEnum
    having?: SizeGuideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SizeGuideCountAggregateInputType | true
    _min?: SizeGuideMinAggregateInputType
    _max?: SizeGuideMaxAggregateInputType
  }

  export type SizeGuideGroupByOutputType = {
    id: string
    name: string
    description: string | null
    measurements: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SizeGuideCountAggregateOutputType | null
    _min: SizeGuideMinAggregateOutputType | null
    _max: SizeGuideMaxAggregateOutputType | null
  }

  type GetSizeGuideGroupByPayload<T extends SizeGuideGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SizeGuideGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SizeGuideGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SizeGuideGroupByOutputType[P]>
            : GetScalarType<T[P], SizeGuideGroupByOutputType[P]>
        }
      >
    >


  export type SizeGuideSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    measurements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    products?: boolean | SizeGuide$productsArgs<ExtArgs>
    _count?: boolean | SizeGuideCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sizeGuide"]>

  export type SizeGuideSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    measurements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sizeGuide"]>

  export type SizeGuideSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    measurements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sizeGuide"]>

  export type SizeGuideSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    measurements?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SizeGuideOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "measurements" | "createdAt" | "updatedAt", ExtArgs["result"]["sizeGuide"]>
  export type SizeGuideInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | SizeGuide$productsArgs<ExtArgs>
    _count?: boolean | SizeGuideCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SizeGuideIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SizeGuideIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SizeGuidePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SizeGuide"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      measurements: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sizeGuide"]>
    composites: {}
  }

  type SizeGuideGetPayload<S extends boolean | null | undefined | SizeGuideDefaultArgs> = $Result.GetResult<Prisma.$SizeGuidePayload, S>

  type SizeGuideCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SizeGuideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SizeGuideCountAggregateInputType | true
    }

  export interface SizeGuideDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SizeGuide'], meta: { name: 'SizeGuide' } }
    /**
     * Find zero or one SizeGuide that matches the filter.
     * @param {SizeGuideFindUniqueArgs} args - Arguments to find a SizeGuide
     * @example
     * // Get one SizeGuide
     * const sizeGuide = await prisma.sizeGuide.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SizeGuideFindUniqueArgs>(args: SelectSubset<T, SizeGuideFindUniqueArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SizeGuide that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SizeGuideFindUniqueOrThrowArgs} args - Arguments to find a SizeGuide
     * @example
     * // Get one SizeGuide
     * const sizeGuide = await prisma.sizeGuide.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SizeGuideFindUniqueOrThrowArgs>(args: SelectSubset<T, SizeGuideFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SizeGuide that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideFindFirstArgs} args - Arguments to find a SizeGuide
     * @example
     * // Get one SizeGuide
     * const sizeGuide = await prisma.sizeGuide.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SizeGuideFindFirstArgs>(args?: SelectSubset<T, SizeGuideFindFirstArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SizeGuide that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideFindFirstOrThrowArgs} args - Arguments to find a SizeGuide
     * @example
     * // Get one SizeGuide
     * const sizeGuide = await prisma.sizeGuide.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SizeGuideFindFirstOrThrowArgs>(args?: SelectSubset<T, SizeGuideFindFirstOrThrowArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SizeGuides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SizeGuides
     * const sizeGuides = await prisma.sizeGuide.findMany()
     * 
     * // Get first 10 SizeGuides
     * const sizeGuides = await prisma.sizeGuide.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sizeGuideWithIdOnly = await prisma.sizeGuide.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SizeGuideFindManyArgs>(args?: SelectSubset<T, SizeGuideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SizeGuide.
     * @param {SizeGuideCreateArgs} args - Arguments to create a SizeGuide.
     * @example
     * // Create one SizeGuide
     * const SizeGuide = await prisma.sizeGuide.create({
     *   data: {
     *     // ... data to create a SizeGuide
     *   }
     * })
     * 
     */
    create<T extends SizeGuideCreateArgs>(args: SelectSubset<T, SizeGuideCreateArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SizeGuides.
     * @param {SizeGuideCreateManyArgs} args - Arguments to create many SizeGuides.
     * @example
     * // Create many SizeGuides
     * const sizeGuide = await prisma.sizeGuide.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SizeGuideCreateManyArgs>(args?: SelectSubset<T, SizeGuideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SizeGuides and returns the data saved in the database.
     * @param {SizeGuideCreateManyAndReturnArgs} args - Arguments to create many SizeGuides.
     * @example
     * // Create many SizeGuides
     * const sizeGuide = await prisma.sizeGuide.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SizeGuides and only return the `id`
     * const sizeGuideWithIdOnly = await prisma.sizeGuide.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SizeGuideCreateManyAndReturnArgs>(args?: SelectSubset<T, SizeGuideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SizeGuide.
     * @param {SizeGuideDeleteArgs} args - Arguments to delete one SizeGuide.
     * @example
     * // Delete one SizeGuide
     * const SizeGuide = await prisma.sizeGuide.delete({
     *   where: {
     *     // ... filter to delete one SizeGuide
     *   }
     * })
     * 
     */
    delete<T extends SizeGuideDeleteArgs>(args: SelectSubset<T, SizeGuideDeleteArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SizeGuide.
     * @param {SizeGuideUpdateArgs} args - Arguments to update one SizeGuide.
     * @example
     * // Update one SizeGuide
     * const sizeGuide = await prisma.sizeGuide.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SizeGuideUpdateArgs>(args: SelectSubset<T, SizeGuideUpdateArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SizeGuides.
     * @param {SizeGuideDeleteManyArgs} args - Arguments to filter SizeGuides to delete.
     * @example
     * // Delete a few SizeGuides
     * const { count } = await prisma.sizeGuide.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SizeGuideDeleteManyArgs>(args?: SelectSubset<T, SizeGuideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SizeGuides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SizeGuides
     * const sizeGuide = await prisma.sizeGuide.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SizeGuideUpdateManyArgs>(args: SelectSubset<T, SizeGuideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SizeGuides and returns the data updated in the database.
     * @param {SizeGuideUpdateManyAndReturnArgs} args - Arguments to update many SizeGuides.
     * @example
     * // Update many SizeGuides
     * const sizeGuide = await prisma.sizeGuide.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SizeGuides and only return the `id`
     * const sizeGuideWithIdOnly = await prisma.sizeGuide.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SizeGuideUpdateManyAndReturnArgs>(args: SelectSubset<T, SizeGuideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SizeGuide.
     * @param {SizeGuideUpsertArgs} args - Arguments to update or create a SizeGuide.
     * @example
     * // Update or create a SizeGuide
     * const sizeGuide = await prisma.sizeGuide.upsert({
     *   create: {
     *     // ... data to create a SizeGuide
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SizeGuide we want to update
     *   }
     * })
     */
    upsert<T extends SizeGuideUpsertArgs>(args: SelectSubset<T, SizeGuideUpsertArgs<ExtArgs>>): Prisma__SizeGuideClient<$Result.GetResult<Prisma.$SizeGuidePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SizeGuides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideCountArgs} args - Arguments to filter SizeGuides to count.
     * @example
     * // Count the number of SizeGuides
     * const count = await prisma.sizeGuide.count({
     *   where: {
     *     // ... the filter for the SizeGuides we want to count
     *   }
     * })
    **/
    count<T extends SizeGuideCountArgs>(
      args?: Subset<T, SizeGuideCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SizeGuideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SizeGuide.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SizeGuideAggregateArgs>(args: Subset<T, SizeGuideAggregateArgs>): Prisma.PrismaPromise<GetSizeGuideAggregateType<T>>

    /**
     * Group by SizeGuide.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SizeGuideGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SizeGuideGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SizeGuideGroupByArgs['orderBy'] }
        : { orderBy?: SizeGuideGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SizeGuideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSizeGuideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SizeGuide model
   */
  readonly fields: SizeGuideFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SizeGuide.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SizeGuideClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends SizeGuide$productsArgs<ExtArgs> = {}>(args?: Subset<T, SizeGuide$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SizeGuide model
   */
  interface SizeGuideFieldRefs {
    readonly id: FieldRef<"SizeGuide", 'String'>
    readonly name: FieldRef<"SizeGuide", 'String'>
    readonly description: FieldRef<"SizeGuide", 'String'>
    readonly measurements: FieldRef<"SizeGuide", 'Json'>
    readonly createdAt: FieldRef<"SizeGuide", 'DateTime'>
    readonly updatedAt: FieldRef<"SizeGuide", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SizeGuide findUnique
   */
  export type SizeGuideFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter, which SizeGuide to fetch.
     */
    where: SizeGuideWhereUniqueInput
  }

  /**
   * SizeGuide findUniqueOrThrow
   */
  export type SizeGuideFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter, which SizeGuide to fetch.
     */
    where: SizeGuideWhereUniqueInput
  }

  /**
   * SizeGuide findFirst
   */
  export type SizeGuideFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter, which SizeGuide to fetch.
     */
    where?: SizeGuideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SizeGuides to fetch.
     */
    orderBy?: SizeGuideOrderByWithRelationInput | SizeGuideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SizeGuides.
     */
    cursor?: SizeGuideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SizeGuides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SizeGuides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SizeGuides.
     */
    distinct?: SizeGuideScalarFieldEnum | SizeGuideScalarFieldEnum[]
  }

  /**
   * SizeGuide findFirstOrThrow
   */
  export type SizeGuideFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter, which SizeGuide to fetch.
     */
    where?: SizeGuideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SizeGuides to fetch.
     */
    orderBy?: SizeGuideOrderByWithRelationInput | SizeGuideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SizeGuides.
     */
    cursor?: SizeGuideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SizeGuides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SizeGuides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SizeGuides.
     */
    distinct?: SizeGuideScalarFieldEnum | SizeGuideScalarFieldEnum[]
  }

  /**
   * SizeGuide findMany
   */
  export type SizeGuideFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter, which SizeGuides to fetch.
     */
    where?: SizeGuideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SizeGuides to fetch.
     */
    orderBy?: SizeGuideOrderByWithRelationInput | SizeGuideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SizeGuides.
     */
    cursor?: SizeGuideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SizeGuides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SizeGuides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SizeGuides.
     */
    distinct?: SizeGuideScalarFieldEnum | SizeGuideScalarFieldEnum[]
  }

  /**
   * SizeGuide create
   */
  export type SizeGuideCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * The data needed to create a SizeGuide.
     */
    data: XOR<SizeGuideCreateInput, SizeGuideUncheckedCreateInput>
  }

  /**
   * SizeGuide createMany
   */
  export type SizeGuideCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SizeGuides.
     */
    data: SizeGuideCreateManyInput | SizeGuideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SizeGuide createManyAndReturn
   */
  export type SizeGuideCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * The data used to create many SizeGuides.
     */
    data: SizeGuideCreateManyInput | SizeGuideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SizeGuide update
   */
  export type SizeGuideUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * The data needed to update a SizeGuide.
     */
    data: XOR<SizeGuideUpdateInput, SizeGuideUncheckedUpdateInput>
    /**
     * Choose, which SizeGuide to update.
     */
    where: SizeGuideWhereUniqueInput
  }

  /**
   * SizeGuide updateMany
   */
  export type SizeGuideUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SizeGuides.
     */
    data: XOR<SizeGuideUpdateManyMutationInput, SizeGuideUncheckedUpdateManyInput>
    /**
     * Filter which SizeGuides to update
     */
    where?: SizeGuideWhereInput
    /**
     * Limit how many SizeGuides to update.
     */
    limit?: number
  }

  /**
   * SizeGuide updateManyAndReturn
   */
  export type SizeGuideUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * The data used to update SizeGuides.
     */
    data: XOR<SizeGuideUpdateManyMutationInput, SizeGuideUncheckedUpdateManyInput>
    /**
     * Filter which SizeGuides to update
     */
    where?: SizeGuideWhereInput
    /**
     * Limit how many SizeGuides to update.
     */
    limit?: number
  }

  /**
   * SizeGuide upsert
   */
  export type SizeGuideUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * The filter to search for the SizeGuide to update in case it exists.
     */
    where: SizeGuideWhereUniqueInput
    /**
     * In case the SizeGuide found by the `where` argument doesn't exist, create a new SizeGuide with this data.
     */
    create: XOR<SizeGuideCreateInput, SizeGuideUncheckedCreateInput>
    /**
     * In case the SizeGuide was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SizeGuideUpdateInput, SizeGuideUncheckedUpdateInput>
  }

  /**
   * SizeGuide delete
   */
  export type SizeGuideDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
    /**
     * Filter which SizeGuide to delete.
     */
    where: SizeGuideWhereUniqueInput
  }

  /**
   * SizeGuide deleteMany
   */
  export type SizeGuideDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SizeGuides to delete
     */
    where?: SizeGuideWhereInput
    /**
     * Limit how many SizeGuides to delete.
     */
    limit?: number
  }

  /**
   * SizeGuide.products
   */
  export type SizeGuide$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * SizeGuide without action
   */
  export type SizeGuideDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SizeGuide
     */
    select?: SizeGuideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SizeGuide
     */
    omit?: SizeGuideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SizeGuideInclude<ExtArgs> | null
  }


  /**
   * Model ProductSize
   */

  export type AggregateProductSize = {
    _count: ProductSizeCountAggregateOutputType | null
    _min: ProductSizeMinAggregateOutputType | null
    _max: ProductSizeMaxAggregateOutputType | null
  }

  export type ProductSizeMinAggregateOutputType = {
    id: string | null
    productId: string | null
    size: string | null
  }

  export type ProductSizeMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    size: string | null
  }

  export type ProductSizeCountAggregateOutputType = {
    id: number
    productId: number
    size: number
    _all: number
  }


  export type ProductSizeMinAggregateInputType = {
    id?: true
    productId?: true
    size?: true
  }

  export type ProductSizeMaxAggregateInputType = {
    id?: true
    productId?: true
    size?: true
  }

  export type ProductSizeCountAggregateInputType = {
    id?: true
    productId?: true
    size?: true
    _all?: true
  }

  export type ProductSizeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductSize to aggregate.
     */
    where?: ProductSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSizes to fetch.
     */
    orderBy?: ProductSizeOrderByWithRelationInput | ProductSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductSizes
    **/
    _count?: true | ProductSizeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductSizeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductSizeMaxAggregateInputType
  }

  export type GetProductSizeAggregateType<T extends ProductSizeAggregateArgs> = {
        [P in keyof T & keyof AggregateProductSize]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductSize[P]>
      : GetScalarType<T[P], AggregateProductSize[P]>
  }




  export type ProductSizeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductSizeWhereInput
    orderBy?: ProductSizeOrderByWithAggregationInput | ProductSizeOrderByWithAggregationInput[]
    by: ProductSizeScalarFieldEnum[] | ProductSizeScalarFieldEnum
    having?: ProductSizeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductSizeCountAggregateInputType | true
    _min?: ProductSizeMinAggregateInputType
    _max?: ProductSizeMaxAggregateInputType
  }

  export type ProductSizeGroupByOutputType = {
    id: string
    productId: string
    size: string
    _count: ProductSizeCountAggregateOutputType | null
    _min: ProductSizeMinAggregateOutputType | null
    _max: ProductSizeMaxAggregateOutputType | null
  }

  type GetProductSizeGroupByPayload<T extends ProductSizeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductSizeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductSizeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductSizeGroupByOutputType[P]>
            : GetScalarType<T[P], ProductSizeGroupByOutputType[P]>
        }
      >
    >


  export type ProductSizeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    size?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productSize"]>

  export type ProductSizeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    size?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productSize"]>

  export type ProductSizeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    size?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productSize"]>

  export type ProductSizeSelectScalar = {
    id?: boolean
    productId?: boolean
    size?: boolean
  }

  export type ProductSizeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "size", ExtArgs["result"]["productSize"]>
  export type ProductSizeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductSizeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductSizeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductSizePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductSize"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      size: string
    }, ExtArgs["result"]["productSize"]>
    composites: {}
  }

  type ProductSizeGetPayload<S extends boolean | null | undefined | ProductSizeDefaultArgs> = $Result.GetResult<Prisma.$ProductSizePayload, S>

  type ProductSizeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductSizeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductSizeCountAggregateInputType | true
    }

  export interface ProductSizeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductSize'], meta: { name: 'ProductSize' } }
    /**
     * Find zero or one ProductSize that matches the filter.
     * @param {ProductSizeFindUniqueArgs} args - Arguments to find a ProductSize
     * @example
     * // Get one ProductSize
     * const productSize = await prisma.productSize.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductSizeFindUniqueArgs>(args: SelectSubset<T, ProductSizeFindUniqueArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductSize that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductSizeFindUniqueOrThrowArgs} args - Arguments to find a ProductSize
     * @example
     * // Get one ProductSize
     * const productSize = await prisma.productSize.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductSizeFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductSizeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductSize that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeFindFirstArgs} args - Arguments to find a ProductSize
     * @example
     * // Get one ProductSize
     * const productSize = await prisma.productSize.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductSizeFindFirstArgs>(args?: SelectSubset<T, ProductSizeFindFirstArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductSize that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeFindFirstOrThrowArgs} args - Arguments to find a ProductSize
     * @example
     * // Get one ProductSize
     * const productSize = await prisma.productSize.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductSizeFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductSizeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductSizes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductSizes
     * const productSizes = await prisma.productSize.findMany()
     * 
     * // Get first 10 ProductSizes
     * const productSizes = await prisma.productSize.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productSizeWithIdOnly = await prisma.productSize.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductSizeFindManyArgs>(args?: SelectSubset<T, ProductSizeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductSize.
     * @param {ProductSizeCreateArgs} args - Arguments to create a ProductSize.
     * @example
     * // Create one ProductSize
     * const ProductSize = await prisma.productSize.create({
     *   data: {
     *     // ... data to create a ProductSize
     *   }
     * })
     * 
     */
    create<T extends ProductSizeCreateArgs>(args: SelectSubset<T, ProductSizeCreateArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductSizes.
     * @param {ProductSizeCreateManyArgs} args - Arguments to create many ProductSizes.
     * @example
     * // Create many ProductSizes
     * const productSize = await prisma.productSize.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductSizeCreateManyArgs>(args?: SelectSubset<T, ProductSizeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductSizes and returns the data saved in the database.
     * @param {ProductSizeCreateManyAndReturnArgs} args - Arguments to create many ProductSizes.
     * @example
     * // Create many ProductSizes
     * const productSize = await prisma.productSize.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductSizes and only return the `id`
     * const productSizeWithIdOnly = await prisma.productSize.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductSizeCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductSizeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductSize.
     * @param {ProductSizeDeleteArgs} args - Arguments to delete one ProductSize.
     * @example
     * // Delete one ProductSize
     * const ProductSize = await prisma.productSize.delete({
     *   where: {
     *     // ... filter to delete one ProductSize
     *   }
     * })
     * 
     */
    delete<T extends ProductSizeDeleteArgs>(args: SelectSubset<T, ProductSizeDeleteArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductSize.
     * @param {ProductSizeUpdateArgs} args - Arguments to update one ProductSize.
     * @example
     * // Update one ProductSize
     * const productSize = await prisma.productSize.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductSizeUpdateArgs>(args: SelectSubset<T, ProductSizeUpdateArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductSizes.
     * @param {ProductSizeDeleteManyArgs} args - Arguments to filter ProductSizes to delete.
     * @example
     * // Delete a few ProductSizes
     * const { count } = await prisma.productSize.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductSizeDeleteManyArgs>(args?: SelectSubset<T, ProductSizeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductSizes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductSizes
     * const productSize = await prisma.productSize.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductSizeUpdateManyArgs>(args: SelectSubset<T, ProductSizeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductSizes and returns the data updated in the database.
     * @param {ProductSizeUpdateManyAndReturnArgs} args - Arguments to update many ProductSizes.
     * @example
     * // Update many ProductSizes
     * const productSize = await prisma.productSize.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductSizes and only return the `id`
     * const productSizeWithIdOnly = await prisma.productSize.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductSizeUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductSizeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductSize.
     * @param {ProductSizeUpsertArgs} args - Arguments to update or create a ProductSize.
     * @example
     * // Update or create a ProductSize
     * const productSize = await prisma.productSize.upsert({
     *   create: {
     *     // ... data to create a ProductSize
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductSize we want to update
     *   }
     * })
     */
    upsert<T extends ProductSizeUpsertArgs>(args: SelectSubset<T, ProductSizeUpsertArgs<ExtArgs>>): Prisma__ProductSizeClient<$Result.GetResult<Prisma.$ProductSizePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductSizes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeCountArgs} args - Arguments to filter ProductSizes to count.
     * @example
     * // Count the number of ProductSizes
     * const count = await prisma.productSize.count({
     *   where: {
     *     // ... the filter for the ProductSizes we want to count
     *   }
     * })
    **/
    count<T extends ProductSizeCountArgs>(
      args?: Subset<T, ProductSizeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductSizeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductSize.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductSizeAggregateArgs>(args: Subset<T, ProductSizeAggregateArgs>): Prisma.PrismaPromise<GetProductSizeAggregateType<T>>

    /**
     * Group by ProductSize.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductSizeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductSizeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductSizeGroupByArgs['orderBy'] }
        : { orderBy?: ProductSizeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductSizeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductSizeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductSize model
   */
  readonly fields: ProductSizeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductSize.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductSizeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductSize model
   */
  interface ProductSizeFieldRefs {
    readonly id: FieldRef<"ProductSize", 'String'>
    readonly productId: FieldRef<"ProductSize", 'String'>
    readonly size: FieldRef<"ProductSize", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProductSize findUnique
   */
  export type ProductSizeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter, which ProductSize to fetch.
     */
    where: ProductSizeWhereUniqueInput
  }

  /**
   * ProductSize findUniqueOrThrow
   */
  export type ProductSizeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter, which ProductSize to fetch.
     */
    where: ProductSizeWhereUniqueInput
  }

  /**
   * ProductSize findFirst
   */
  export type ProductSizeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter, which ProductSize to fetch.
     */
    where?: ProductSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSizes to fetch.
     */
    orderBy?: ProductSizeOrderByWithRelationInput | ProductSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductSizes.
     */
    cursor?: ProductSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductSizes.
     */
    distinct?: ProductSizeScalarFieldEnum | ProductSizeScalarFieldEnum[]
  }

  /**
   * ProductSize findFirstOrThrow
   */
  export type ProductSizeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter, which ProductSize to fetch.
     */
    where?: ProductSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSizes to fetch.
     */
    orderBy?: ProductSizeOrderByWithRelationInput | ProductSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductSizes.
     */
    cursor?: ProductSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductSizes.
     */
    distinct?: ProductSizeScalarFieldEnum | ProductSizeScalarFieldEnum[]
  }

  /**
   * ProductSize findMany
   */
  export type ProductSizeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter, which ProductSizes to fetch.
     */
    where?: ProductSizeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductSizes to fetch.
     */
    orderBy?: ProductSizeOrderByWithRelationInput | ProductSizeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductSizes.
     */
    cursor?: ProductSizeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductSizes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductSizes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductSizes.
     */
    distinct?: ProductSizeScalarFieldEnum | ProductSizeScalarFieldEnum[]
  }

  /**
   * ProductSize create
   */
  export type ProductSizeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductSize.
     */
    data: XOR<ProductSizeCreateInput, ProductSizeUncheckedCreateInput>
  }

  /**
   * ProductSize createMany
   */
  export type ProductSizeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductSizes.
     */
    data: ProductSizeCreateManyInput | ProductSizeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductSize createManyAndReturn
   */
  export type ProductSizeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * The data used to create many ProductSizes.
     */
    data: ProductSizeCreateManyInput | ProductSizeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductSize update
   */
  export type ProductSizeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductSize.
     */
    data: XOR<ProductSizeUpdateInput, ProductSizeUncheckedUpdateInput>
    /**
     * Choose, which ProductSize to update.
     */
    where: ProductSizeWhereUniqueInput
  }

  /**
   * ProductSize updateMany
   */
  export type ProductSizeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductSizes.
     */
    data: XOR<ProductSizeUpdateManyMutationInput, ProductSizeUncheckedUpdateManyInput>
    /**
     * Filter which ProductSizes to update
     */
    where?: ProductSizeWhereInput
    /**
     * Limit how many ProductSizes to update.
     */
    limit?: number
  }

  /**
   * ProductSize updateManyAndReturn
   */
  export type ProductSizeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * The data used to update ProductSizes.
     */
    data: XOR<ProductSizeUpdateManyMutationInput, ProductSizeUncheckedUpdateManyInput>
    /**
     * Filter which ProductSizes to update
     */
    where?: ProductSizeWhereInput
    /**
     * Limit how many ProductSizes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductSize upsert
   */
  export type ProductSizeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductSize to update in case it exists.
     */
    where: ProductSizeWhereUniqueInput
    /**
     * In case the ProductSize found by the `where` argument doesn't exist, create a new ProductSize with this data.
     */
    create: XOR<ProductSizeCreateInput, ProductSizeUncheckedCreateInput>
    /**
     * In case the ProductSize was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductSizeUpdateInput, ProductSizeUncheckedUpdateInput>
  }

  /**
   * ProductSize delete
   */
  export type ProductSizeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
    /**
     * Filter which ProductSize to delete.
     */
    where: ProductSizeWhereUniqueInput
  }

  /**
   * ProductSize deleteMany
   */
  export type ProductSizeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductSizes to delete
     */
    where?: ProductSizeWhereInput
    /**
     * Limit how many ProductSizes to delete.
     */
    limit?: number
  }

  /**
   * ProductSize without action
   */
  export type ProductSizeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductSize
     */
    select?: ProductSizeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductSize
     */
    omit?: ProductSizeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductSizeInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderAvgAggregateOutputType = {
    shippingCost: number | null
    subtotal: number | null
    total: number | null
    shippingRetryCount: number | null
    exchangeRate: number | null
  }

  export type OrderSumAggregateOutputType = {
    shippingCost: number | null
    subtotal: number | null
    total: number | null
    shippingRetryCount: number | null
    exchangeRate: number | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    customerName: string | null
    email: string | null
    phone: string | null
    country: string | null
    province: string | null
    stateProvince: string | null
    shippingAddress: string | null
    apartment: string | null
    district: string | null
    city: string | null
    postalCode: string | null
    courier: string | null
    shippingCost: number | null
    subtotal: number | null
    total: number | null
    paymentStatus: string | null
    orderStatus: string | null
    paidAt: Date | null
    expiredAt: Date | null
    isPreOrder: boolean | null
    trackingNumber: string | null
    manualCourier: string | null
    manualService: string | null
    manualShippedAt: Date | null
    manualTrackingNote: string | null
    duitkuReference: string | null
    duitkuPaymentMethod: string | null
    duitkuPaymentUrl: string | null
    duitkuVaNumber: string | null
    duitkuQrString: string | null
    duitkuFee: string | null
    duitkuStatusMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    biteshipOrderId: string | null
    biteshipTrackingId: string | null
    biteshipStatus: string | null
    shippingOrderError: string | null
    shippingOrderStatus: string | null
    shippingRetryCount: number | null
    priceRegion: string | null
    exchangeRate: number | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    orderNumber: string | null
    customerName: string | null
    email: string | null
    phone: string | null
    country: string | null
    province: string | null
    stateProvince: string | null
    shippingAddress: string | null
    apartment: string | null
    district: string | null
    city: string | null
    postalCode: string | null
    courier: string | null
    shippingCost: number | null
    subtotal: number | null
    total: number | null
    paymentStatus: string | null
    orderStatus: string | null
    paidAt: Date | null
    expiredAt: Date | null
    isPreOrder: boolean | null
    trackingNumber: string | null
    manualCourier: string | null
    manualService: string | null
    manualShippedAt: Date | null
    manualTrackingNote: string | null
    duitkuReference: string | null
    duitkuPaymentMethod: string | null
    duitkuPaymentUrl: string | null
    duitkuVaNumber: string | null
    duitkuQrString: string | null
    duitkuFee: string | null
    duitkuStatusMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    biteshipOrderId: string | null
    biteshipTrackingId: string | null
    biteshipStatus: string | null
    shippingOrderError: string | null
    shippingOrderStatus: string | null
    shippingRetryCount: number | null
    priceRegion: string | null
    exchangeRate: number | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    orderNumber: number
    customerName: number
    email: number
    phone: number
    country: number
    province: number
    stateProvince: number
    shippingAddress: number
    apartment: number
    district: number
    city: number
    postalCode: number
    courier: number
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus: number
    orderStatus: number
    paidAt: number
    expiredAt: number
    isPreOrder: number
    trackingNumber: number
    manualCourier: number
    manualService: number
    manualShippedAt: number
    manualTrackingNote: number
    duitkuReference: number
    duitkuPaymentMethod: number
    duitkuPaymentUrl: number
    duitkuVaNumber: number
    duitkuQrString: number
    duitkuFee: number
    duitkuStatusMessage: number
    createdAt: number
    updatedAt: number
    biteshipOrderId: number
    biteshipTrackingId: number
    biteshipStatus: number
    shippingOrderError: number
    shippingOrderStatus: number
    shippingRetryCount: number
    priceRegion: number
    exchangeRate: number
    _all: number
  }


  export type OrderAvgAggregateInputType = {
    shippingCost?: true
    subtotal?: true
    total?: true
    shippingRetryCount?: true
    exchangeRate?: true
  }

  export type OrderSumAggregateInputType = {
    shippingCost?: true
    subtotal?: true
    total?: true
    shippingRetryCount?: true
    exchangeRate?: true
  }

  export type OrderMinAggregateInputType = {
    id?: true
    orderNumber?: true
    customerName?: true
    email?: true
    phone?: true
    country?: true
    province?: true
    stateProvince?: true
    shippingAddress?: true
    apartment?: true
    district?: true
    city?: true
    postalCode?: true
    courier?: true
    shippingCost?: true
    subtotal?: true
    total?: true
    paymentStatus?: true
    orderStatus?: true
    paidAt?: true
    expiredAt?: true
    isPreOrder?: true
    trackingNumber?: true
    manualCourier?: true
    manualService?: true
    manualShippedAt?: true
    manualTrackingNote?: true
    duitkuReference?: true
    duitkuPaymentMethod?: true
    duitkuPaymentUrl?: true
    duitkuVaNumber?: true
    duitkuQrString?: true
    duitkuFee?: true
    duitkuStatusMessage?: true
    createdAt?: true
    updatedAt?: true
    biteshipOrderId?: true
    biteshipTrackingId?: true
    biteshipStatus?: true
    shippingOrderError?: true
    shippingOrderStatus?: true
    shippingRetryCount?: true
    priceRegion?: true
    exchangeRate?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    orderNumber?: true
    customerName?: true
    email?: true
    phone?: true
    country?: true
    province?: true
    stateProvince?: true
    shippingAddress?: true
    apartment?: true
    district?: true
    city?: true
    postalCode?: true
    courier?: true
    shippingCost?: true
    subtotal?: true
    total?: true
    paymentStatus?: true
    orderStatus?: true
    paidAt?: true
    expiredAt?: true
    isPreOrder?: true
    trackingNumber?: true
    manualCourier?: true
    manualService?: true
    manualShippedAt?: true
    manualTrackingNote?: true
    duitkuReference?: true
    duitkuPaymentMethod?: true
    duitkuPaymentUrl?: true
    duitkuVaNumber?: true
    duitkuQrString?: true
    duitkuFee?: true
    duitkuStatusMessage?: true
    createdAt?: true
    updatedAt?: true
    biteshipOrderId?: true
    biteshipTrackingId?: true
    biteshipStatus?: true
    shippingOrderError?: true
    shippingOrderStatus?: true
    shippingRetryCount?: true
    priceRegion?: true
    exchangeRate?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    orderNumber?: true
    customerName?: true
    email?: true
    phone?: true
    country?: true
    province?: true
    stateProvince?: true
    shippingAddress?: true
    apartment?: true
    district?: true
    city?: true
    postalCode?: true
    courier?: true
    shippingCost?: true
    subtotal?: true
    total?: true
    paymentStatus?: true
    orderStatus?: true
    paidAt?: true
    expiredAt?: true
    isPreOrder?: true
    trackingNumber?: true
    manualCourier?: true
    manualService?: true
    manualShippedAt?: true
    manualTrackingNote?: true
    duitkuReference?: true
    duitkuPaymentMethod?: true
    duitkuPaymentUrl?: true
    duitkuVaNumber?: true
    duitkuQrString?: true
    duitkuFee?: true
    duitkuStatusMessage?: true
    createdAt?: true
    updatedAt?: true
    biteshipOrderId?: true
    biteshipTrackingId?: true
    biteshipStatus?: true
    shippingOrderError?: true
    shippingOrderStatus?: true
    shippingRetryCount?: true
    priceRegion?: true
    exchangeRate?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _avg?: OrderAvgAggregateInputType
    _sum?: OrderSumAggregateInputType
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country: string
    province: string | null
    stateProvince: string | null
    shippingAddress: string
    apartment: string | null
    district: string | null
    city: string
    postalCode: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus: string
    orderStatus: string
    paidAt: Date | null
    expiredAt: Date | null
    isPreOrder: boolean
    trackingNumber: string | null
    manualCourier: string | null
    manualService: string | null
    manualShippedAt: Date | null
    manualTrackingNote: string | null
    duitkuReference: string | null
    duitkuPaymentMethod: string | null
    duitkuPaymentUrl: string | null
    duitkuVaNumber: string | null
    duitkuQrString: string | null
    duitkuFee: string | null
    duitkuStatusMessage: string | null
    createdAt: Date
    updatedAt: Date
    biteshipOrderId: string | null
    biteshipTrackingId: string | null
    biteshipStatus: string | null
    shippingOrderError: string | null
    shippingOrderStatus: string
    shippingRetryCount: number
    priceRegion: string
    exchangeRate: number | null
    _count: OrderCountAggregateOutputType | null
    _avg: OrderAvgAggregateOutputType | null
    _sum: OrderSumAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    customerName?: boolean
    email?: boolean
    phone?: boolean
    country?: boolean
    province?: boolean
    stateProvince?: boolean
    shippingAddress?: boolean
    apartment?: boolean
    district?: boolean
    city?: boolean
    postalCode?: boolean
    courier?: boolean
    shippingCost?: boolean
    subtotal?: boolean
    total?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    paidAt?: boolean
    expiredAt?: boolean
    isPreOrder?: boolean
    trackingNumber?: boolean
    manualCourier?: boolean
    manualService?: boolean
    manualShippedAt?: boolean
    manualTrackingNote?: boolean
    duitkuReference?: boolean
    duitkuPaymentMethod?: boolean
    duitkuPaymentUrl?: boolean
    duitkuVaNumber?: boolean
    duitkuQrString?: boolean
    duitkuFee?: boolean
    duitkuStatusMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    biteshipOrderId?: boolean
    biteshipTrackingId?: boolean
    biteshipStatus?: boolean
    shippingOrderError?: boolean
    shippingOrderStatus?: boolean
    shippingRetryCount?: boolean
    priceRegion?: boolean
    exchangeRate?: boolean
    items?: boolean | Order$itemsArgs<ExtArgs>
    shippingLogs?: boolean | Order$shippingLogsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    customerName?: boolean
    email?: boolean
    phone?: boolean
    country?: boolean
    province?: boolean
    stateProvince?: boolean
    shippingAddress?: boolean
    apartment?: boolean
    district?: boolean
    city?: boolean
    postalCode?: boolean
    courier?: boolean
    shippingCost?: boolean
    subtotal?: boolean
    total?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    paidAt?: boolean
    expiredAt?: boolean
    isPreOrder?: boolean
    trackingNumber?: boolean
    manualCourier?: boolean
    manualService?: boolean
    manualShippedAt?: boolean
    manualTrackingNote?: boolean
    duitkuReference?: boolean
    duitkuPaymentMethod?: boolean
    duitkuPaymentUrl?: boolean
    duitkuVaNumber?: boolean
    duitkuQrString?: boolean
    duitkuFee?: boolean
    duitkuStatusMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    biteshipOrderId?: boolean
    biteshipTrackingId?: boolean
    biteshipStatus?: boolean
    shippingOrderError?: boolean
    shippingOrderStatus?: boolean
    shippingRetryCount?: boolean
    priceRegion?: boolean
    exchangeRate?: boolean
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderNumber?: boolean
    customerName?: boolean
    email?: boolean
    phone?: boolean
    country?: boolean
    province?: boolean
    stateProvince?: boolean
    shippingAddress?: boolean
    apartment?: boolean
    district?: boolean
    city?: boolean
    postalCode?: boolean
    courier?: boolean
    shippingCost?: boolean
    subtotal?: boolean
    total?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    paidAt?: boolean
    expiredAt?: boolean
    isPreOrder?: boolean
    trackingNumber?: boolean
    manualCourier?: boolean
    manualService?: boolean
    manualShippedAt?: boolean
    manualTrackingNote?: boolean
    duitkuReference?: boolean
    duitkuPaymentMethod?: boolean
    duitkuPaymentUrl?: boolean
    duitkuVaNumber?: boolean
    duitkuQrString?: boolean
    duitkuFee?: boolean
    duitkuStatusMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    biteshipOrderId?: boolean
    biteshipTrackingId?: boolean
    biteshipStatus?: boolean
    shippingOrderError?: boolean
    shippingOrderStatus?: boolean
    shippingRetryCount?: boolean
    priceRegion?: boolean
    exchangeRate?: boolean
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    orderNumber?: boolean
    customerName?: boolean
    email?: boolean
    phone?: boolean
    country?: boolean
    province?: boolean
    stateProvince?: boolean
    shippingAddress?: boolean
    apartment?: boolean
    district?: boolean
    city?: boolean
    postalCode?: boolean
    courier?: boolean
    shippingCost?: boolean
    subtotal?: boolean
    total?: boolean
    paymentStatus?: boolean
    orderStatus?: boolean
    paidAt?: boolean
    expiredAt?: boolean
    isPreOrder?: boolean
    trackingNumber?: boolean
    manualCourier?: boolean
    manualService?: boolean
    manualShippedAt?: boolean
    manualTrackingNote?: boolean
    duitkuReference?: boolean
    duitkuPaymentMethod?: boolean
    duitkuPaymentUrl?: boolean
    duitkuVaNumber?: boolean
    duitkuQrString?: boolean
    duitkuFee?: boolean
    duitkuStatusMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    biteshipOrderId?: boolean
    biteshipTrackingId?: boolean
    biteshipStatus?: boolean
    shippingOrderError?: boolean
    shippingOrderStatus?: boolean
    shippingRetryCount?: boolean
    priceRegion?: boolean
    exchangeRate?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderNumber" | "customerName" | "email" | "phone" | "country" | "province" | "stateProvince" | "shippingAddress" | "apartment" | "district" | "city" | "postalCode" | "courier" | "shippingCost" | "subtotal" | "total" | "paymentStatus" | "orderStatus" | "paidAt" | "expiredAt" | "isPreOrder" | "trackingNumber" | "manualCourier" | "manualService" | "manualShippedAt" | "manualTrackingNote" | "duitkuReference" | "duitkuPaymentMethod" | "duitkuPaymentUrl" | "duitkuVaNumber" | "duitkuQrString" | "duitkuFee" | "duitkuStatusMessage" | "createdAt" | "updatedAt" | "biteshipOrderId" | "biteshipTrackingId" | "biteshipStatus" | "shippingOrderError" | "shippingOrderStatus" | "shippingRetryCount" | "priceRegion" | "exchangeRate", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Order$itemsArgs<ExtArgs>
    shippingLogs?: boolean | Order$shippingLogsArgs<ExtArgs>
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      items: Prisma.$OrderItemPayload<ExtArgs>[]
      shippingLogs: Prisma.$ShippingLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderNumber: string
      customerName: string
      email: string
      phone: string
      country: string
      province: string | null
      stateProvince: string | null
      shippingAddress: string
      apartment: string | null
      district: string | null
      city: string
      postalCode: string
      courier: string
      shippingCost: number
      subtotal: number
      total: number
      paymentStatus: string
      orderStatus: string
      paidAt: Date | null
      expiredAt: Date | null
      isPreOrder: boolean
      trackingNumber: string | null
      manualCourier: string | null
      manualService: string | null
      manualShippedAt: Date | null
      manualTrackingNote: string | null
      duitkuReference: string | null
      duitkuPaymentMethod: string | null
      duitkuPaymentUrl: string | null
      duitkuVaNumber: string | null
      duitkuQrString: string | null
      duitkuFee: string | null
      duitkuStatusMessage: string | null
      createdAt: Date
      updatedAt: Date
      biteshipOrderId: string | null
      biteshipTrackingId: string | null
      biteshipStatus: string | null
      shippingOrderError: string | null
      shippingOrderStatus: string
      shippingRetryCount: number
      priceRegion: string
      exchangeRate: number | null
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Order$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Order$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    shippingLogs<T extends Order$shippingLogsArgs<ExtArgs> = {}>(args?: Subset<T, Order$shippingLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly orderNumber: FieldRef<"Order", 'String'>
    readonly customerName: FieldRef<"Order", 'String'>
    readonly email: FieldRef<"Order", 'String'>
    readonly phone: FieldRef<"Order", 'String'>
    readonly country: FieldRef<"Order", 'String'>
    readonly province: FieldRef<"Order", 'String'>
    readonly stateProvince: FieldRef<"Order", 'String'>
    readonly shippingAddress: FieldRef<"Order", 'String'>
    readonly apartment: FieldRef<"Order", 'String'>
    readonly district: FieldRef<"Order", 'String'>
    readonly city: FieldRef<"Order", 'String'>
    readonly postalCode: FieldRef<"Order", 'String'>
    readonly courier: FieldRef<"Order", 'String'>
    readonly shippingCost: FieldRef<"Order", 'Int'>
    readonly subtotal: FieldRef<"Order", 'Int'>
    readonly total: FieldRef<"Order", 'Int'>
    readonly paymentStatus: FieldRef<"Order", 'String'>
    readonly orderStatus: FieldRef<"Order", 'String'>
    readonly paidAt: FieldRef<"Order", 'DateTime'>
    readonly expiredAt: FieldRef<"Order", 'DateTime'>
    readonly isPreOrder: FieldRef<"Order", 'Boolean'>
    readonly trackingNumber: FieldRef<"Order", 'String'>
    readonly manualCourier: FieldRef<"Order", 'String'>
    readonly manualService: FieldRef<"Order", 'String'>
    readonly manualShippedAt: FieldRef<"Order", 'DateTime'>
    readonly manualTrackingNote: FieldRef<"Order", 'String'>
    readonly duitkuReference: FieldRef<"Order", 'String'>
    readonly duitkuPaymentMethod: FieldRef<"Order", 'String'>
    readonly duitkuPaymentUrl: FieldRef<"Order", 'String'>
    readonly duitkuVaNumber: FieldRef<"Order", 'String'>
    readonly duitkuQrString: FieldRef<"Order", 'String'>
    readonly duitkuFee: FieldRef<"Order", 'String'>
    readonly duitkuStatusMessage: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly updatedAt: FieldRef<"Order", 'DateTime'>
    readonly biteshipOrderId: FieldRef<"Order", 'String'>
    readonly biteshipTrackingId: FieldRef<"Order", 'String'>
    readonly biteshipStatus: FieldRef<"Order", 'String'>
    readonly shippingOrderError: FieldRef<"Order", 'String'>
    readonly shippingOrderStatus: FieldRef<"Order", 'String'>
    readonly shippingRetryCount: FieldRef<"Order", 'Int'>
    readonly priceRegion: FieldRef<"Order", 'String'>
    readonly exchangeRate: FieldRef<"Order", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order.items
   */
  export type Order$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    cursor?: OrderItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * Order.shippingLogs
   */
  export type Order$shippingLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    where?: ShippingLogWhereInput
    orderBy?: ShippingLogOrderByWithRelationInput | ShippingLogOrderByWithRelationInput[]
    cursor?: ShippingLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShippingLogScalarFieldEnum | ShippingLogScalarFieldEnum[]
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model ExchangeRate
   */

  export type AggregateExchangeRate = {
    _count: ExchangeRateCountAggregateOutputType | null
    _avg: ExchangeRateAvgAggregateOutputType | null
    _sum: ExchangeRateSumAggregateOutputType | null
    _min: ExchangeRateMinAggregateOutputType | null
    _max: ExchangeRateMaxAggregateOutputType | null
  }

  export type ExchangeRateAvgAggregateOutputType = {
    usdToIdr: number | null
  }

  export type ExchangeRateSumAggregateOutputType = {
    usdToIdr: number | null
  }

  export type ExchangeRateMinAggregateOutputType = {
    id: string | null
    usdToIdr: number | null
    source: string | null
    isOverride: boolean | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type ExchangeRateMaxAggregateOutputType = {
    id: string | null
    usdToIdr: number | null
    source: string | null
    isOverride: boolean | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type ExchangeRateCountAggregateOutputType = {
    id: number
    usdToIdr: number
    source: number
    isOverride: number
    updatedAt: number
    expiresAt: number
    _all: number
  }


  export type ExchangeRateAvgAggregateInputType = {
    usdToIdr?: true
  }

  export type ExchangeRateSumAggregateInputType = {
    usdToIdr?: true
  }

  export type ExchangeRateMinAggregateInputType = {
    id?: true
    usdToIdr?: true
    source?: true
    isOverride?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type ExchangeRateMaxAggregateInputType = {
    id?: true
    usdToIdr?: true
    source?: true
    isOverride?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type ExchangeRateCountAggregateInputType = {
    id?: true
    usdToIdr?: true
    source?: true
    isOverride?: true
    updatedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type ExchangeRateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExchangeRate to aggregate.
     */
    where?: ExchangeRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExchangeRates to fetch.
     */
    orderBy?: ExchangeRateOrderByWithRelationInput | ExchangeRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExchangeRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExchangeRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExchangeRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExchangeRates
    **/
    _count?: true | ExchangeRateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExchangeRateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExchangeRateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExchangeRateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExchangeRateMaxAggregateInputType
  }

  export type GetExchangeRateAggregateType<T extends ExchangeRateAggregateArgs> = {
        [P in keyof T & keyof AggregateExchangeRate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExchangeRate[P]>
      : GetScalarType<T[P], AggregateExchangeRate[P]>
  }




  export type ExchangeRateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExchangeRateWhereInput
    orderBy?: ExchangeRateOrderByWithAggregationInput | ExchangeRateOrderByWithAggregationInput[]
    by: ExchangeRateScalarFieldEnum[] | ExchangeRateScalarFieldEnum
    having?: ExchangeRateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExchangeRateCountAggregateInputType | true
    _avg?: ExchangeRateAvgAggregateInputType
    _sum?: ExchangeRateSumAggregateInputType
    _min?: ExchangeRateMinAggregateInputType
    _max?: ExchangeRateMaxAggregateInputType
  }

  export type ExchangeRateGroupByOutputType = {
    id: string
    usdToIdr: number
    source: string
    isOverride: boolean
    updatedAt: Date
    expiresAt: Date | null
    _count: ExchangeRateCountAggregateOutputType | null
    _avg: ExchangeRateAvgAggregateOutputType | null
    _sum: ExchangeRateSumAggregateOutputType | null
    _min: ExchangeRateMinAggregateOutputType | null
    _max: ExchangeRateMaxAggregateOutputType | null
  }

  type GetExchangeRateGroupByPayload<T extends ExchangeRateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExchangeRateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExchangeRateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExchangeRateGroupByOutputType[P]>
            : GetScalarType<T[P], ExchangeRateGroupByOutputType[P]>
        }
      >
    >


  export type ExchangeRateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usdToIdr?: boolean
    source?: boolean
    isOverride?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["exchangeRate"]>

  export type ExchangeRateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usdToIdr?: boolean
    source?: boolean
    isOverride?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["exchangeRate"]>

  export type ExchangeRateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    usdToIdr?: boolean
    source?: boolean
    isOverride?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["exchangeRate"]>

  export type ExchangeRateSelectScalar = {
    id?: boolean
    usdToIdr?: boolean
    source?: boolean
    isOverride?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }

  export type ExchangeRateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "usdToIdr" | "source" | "isOverride" | "updatedAt" | "expiresAt", ExtArgs["result"]["exchangeRate"]>

  export type $ExchangeRatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExchangeRate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      usdToIdr: number
      source: string
      isOverride: boolean
      updatedAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["exchangeRate"]>
    composites: {}
  }

  type ExchangeRateGetPayload<S extends boolean | null | undefined | ExchangeRateDefaultArgs> = $Result.GetResult<Prisma.$ExchangeRatePayload, S>

  type ExchangeRateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExchangeRateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExchangeRateCountAggregateInputType | true
    }

  export interface ExchangeRateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExchangeRate'], meta: { name: 'ExchangeRate' } }
    /**
     * Find zero or one ExchangeRate that matches the filter.
     * @param {ExchangeRateFindUniqueArgs} args - Arguments to find a ExchangeRate
     * @example
     * // Get one ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExchangeRateFindUniqueArgs>(args: SelectSubset<T, ExchangeRateFindUniqueArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExchangeRate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExchangeRateFindUniqueOrThrowArgs} args - Arguments to find a ExchangeRate
     * @example
     * // Get one ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExchangeRateFindUniqueOrThrowArgs>(args: SelectSubset<T, ExchangeRateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExchangeRate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateFindFirstArgs} args - Arguments to find a ExchangeRate
     * @example
     * // Get one ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExchangeRateFindFirstArgs>(args?: SelectSubset<T, ExchangeRateFindFirstArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExchangeRate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateFindFirstOrThrowArgs} args - Arguments to find a ExchangeRate
     * @example
     * // Get one ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExchangeRateFindFirstOrThrowArgs>(args?: SelectSubset<T, ExchangeRateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExchangeRates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExchangeRates
     * const exchangeRates = await prisma.exchangeRate.findMany()
     * 
     * // Get first 10 ExchangeRates
     * const exchangeRates = await prisma.exchangeRate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exchangeRateWithIdOnly = await prisma.exchangeRate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExchangeRateFindManyArgs>(args?: SelectSubset<T, ExchangeRateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExchangeRate.
     * @param {ExchangeRateCreateArgs} args - Arguments to create a ExchangeRate.
     * @example
     * // Create one ExchangeRate
     * const ExchangeRate = await prisma.exchangeRate.create({
     *   data: {
     *     // ... data to create a ExchangeRate
     *   }
     * })
     * 
     */
    create<T extends ExchangeRateCreateArgs>(args: SelectSubset<T, ExchangeRateCreateArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExchangeRates.
     * @param {ExchangeRateCreateManyArgs} args - Arguments to create many ExchangeRates.
     * @example
     * // Create many ExchangeRates
     * const exchangeRate = await prisma.exchangeRate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExchangeRateCreateManyArgs>(args?: SelectSubset<T, ExchangeRateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExchangeRates and returns the data saved in the database.
     * @param {ExchangeRateCreateManyAndReturnArgs} args - Arguments to create many ExchangeRates.
     * @example
     * // Create many ExchangeRates
     * const exchangeRate = await prisma.exchangeRate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExchangeRates and only return the `id`
     * const exchangeRateWithIdOnly = await prisma.exchangeRate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExchangeRateCreateManyAndReturnArgs>(args?: SelectSubset<T, ExchangeRateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExchangeRate.
     * @param {ExchangeRateDeleteArgs} args - Arguments to delete one ExchangeRate.
     * @example
     * // Delete one ExchangeRate
     * const ExchangeRate = await prisma.exchangeRate.delete({
     *   where: {
     *     // ... filter to delete one ExchangeRate
     *   }
     * })
     * 
     */
    delete<T extends ExchangeRateDeleteArgs>(args: SelectSubset<T, ExchangeRateDeleteArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExchangeRate.
     * @param {ExchangeRateUpdateArgs} args - Arguments to update one ExchangeRate.
     * @example
     * // Update one ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExchangeRateUpdateArgs>(args: SelectSubset<T, ExchangeRateUpdateArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExchangeRates.
     * @param {ExchangeRateDeleteManyArgs} args - Arguments to filter ExchangeRates to delete.
     * @example
     * // Delete a few ExchangeRates
     * const { count } = await prisma.exchangeRate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExchangeRateDeleteManyArgs>(args?: SelectSubset<T, ExchangeRateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExchangeRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExchangeRates
     * const exchangeRate = await prisma.exchangeRate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExchangeRateUpdateManyArgs>(args: SelectSubset<T, ExchangeRateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExchangeRates and returns the data updated in the database.
     * @param {ExchangeRateUpdateManyAndReturnArgs} args - Arguments to update many ExchangeRates.
     * @example
     * // Update many ExchangeRates
     * const exchangeRate = await prisma.exchangeRate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExchangeRates and only return the `id`
     * const exchangeRateWithIdOnly = await prisma.exchangeRate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExchangeRateUpdateManyAndReturnArgs>(args: SelectSubset<T, ExchangeRateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExchangeRate.
     * @param {ExchangeRateUpsertArgs} args - Arguments to update or create a ExchangeRate.
     * @example
     * // Update or create a ExchangeRate
     * const exchangeRate = await prisma.exchangeRate.upsert({
     *   create: {
     *     // ... data to create a ExchangeRate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExchangeRate we want to update
     *   }
     * })
     */
    upsert<T extends ExchangeRateUpsertArgs>(args: SelectSubset<T, ExchangeRateUpsertArgs<ExtArgs>>): Prisma__ExchangeRateClient<$Result.GetResult<Prisma.$ExchangeRatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExchangeRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateCountArgs} args - Arguments to filter ExchangeRates to count.
     * @example
     * // Count the number of ExchangeRates
     * const count = await prisma.exchangeRate.count({
     *   where: {
     *     // ... the filter for the ExchangeRates we want to count
     *   }
     * })
    **/
    count<T extends ExchangeRateCountArgs>(
      args?: Subset<T, ExchangeRateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExchangeRateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExchangeRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExchangeRateAggregateArgs>(args: Subset<T, ExchangeRateAggregateArgs>): Prisma.PrismaPromise<GetExchangeRateAggregateType<T>>

    /**
     * Group by ExchangeRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExchangeRateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExchangeRateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExchangeRateGroupByArgs['orderBy'] }
        : { orderBy?: ExchangeRateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExchangeRateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExchangeRateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExchangeRate model
   */
  readonly fields: ExchangeRateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExchangeRate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExchangeRateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExchangeRate model
   */
  interface ExchangeRateFieldRefs {
    readonly id: FieldRef<"ExchangeRate", 'String'>
    readonly usdToIdr: FieldRef<"ExchangeRate", 'Float'>
    readonly source: FieldRef<"ExchangeRate", 'String'>
    readonly isOverride: FieldRef<"ExchangeRate", 'Boolean'>
    readonly updatedAt: FieldRef<"ExchangeRate", 'DateTime'>
    readonly expiresAt: FieldRef<"ExchangeRate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExchangeRate findUnique
   */
  export type ExchangeRateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter, which ExchangeRate to fetch.
     */
    where: ExchangeRateWhereUniqueInput
  }

  /**
   * ExchangeRate findUniqueOrThrow
   */
  export type ExchangeRateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter, which ExchangeRate to fetch.
     */
    where: ExchangeRateWhereUniqueInput
  }

  /**
   * ExchangeRate findFirst
   */
  export type ExchangeRateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter, which ExchangeRate to fetch.
     */
    where?: ExchangeRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExchangeRates to fetch.
     */
    orderBy?: ExchangeRateOrderByWithRelationInput | ExchangeRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExchangeRates.
     */
    cursor?: ExchangeRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExchangeRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExchangeRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExchangeRates.
     */
    distinct?: ExchangeRateScalarFieldEnum | ExchangeRateScalarFieldEnum[]
  }

  /**
   * ExchangeRate findFirstOrThrow
   */
  export type ExchangeRateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter, which ExchangeRate to fetch.
     */
    where?: ExchangeRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExchangeRates to fetch.
     */
    orderBy?: ExchangeRateOrderByWithRelationInput | ExchangeRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExchangeRates.
     */
    cursor?: ExchangeRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExchangeRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExchangeRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExchangeRates.
     */
    distinct?: ExchangeRateScalarFieldEnum | ExchangeRateScalarFieldEnum[]
  }

  /**
   * ExchangeRate findMany
   */
  export type ExchangeRateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter, which ExchangeRates to fetch.
     */
    where?: ExchangeRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExchangeRates to fetch.
     */
    orderBy?: ExchangeRateOrderByWithRelationInput | ExchangeRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExchangeRates.
     */
    cursor?: ExchangeRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExchangeRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExchangeRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExchangeRates.
     */
    distinct?: ExchangeRateScalarFieldEnum | ExchangeRateScalarFieldEnum[]
  }

  /**
   * ExchangeRate create
   */
  export type ExchangeRateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * The data needed to create a ExchangeRate.
     */
    data: XOR<ExchangeRateCreateInput, ExchangeRateUncheckedCreateInput>
  }

  /**
   * ExchangeRate createMany
   */
  export type ExchangeRateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExchangeRates.
     */
    data: ExchangeRateCreateManyInput | ExchangeRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExchangeRate createManyAndReturn
   */
  export type ExchangeRateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * The data used to create many ExchangeRates.
     */
    data: ExchangeRateCreateManyInput | ExchangeRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExchangeRate update
   */
  export type ExchangeRateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * The data needed to update a ExchangeRate.
     */
    data: XOR<ExchangeRateUpdateInput, ExchangeRateUncheckedUpdateInput>
    /**
     * Choose, which ExchangeRate to update.
     */
    where: ExchangeRateWhereUniqueInput
  }

  /**
   * ExchangeRate updateMany
   */
  export type ExchangeRateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExchangeRates.
     */
    data: XOR<ExchangeRateUpdateManyMutationInput, ExchangeRateUncheckedUpdateManyInput>
    /**
     * Filter which ExchangeRates to update
     */
    where?: ExchangeRateWhereInput
    /**
     * Limit how many ExchangeRates to update.
     */
    limit?: number
  }

  /**
   * ExchangeRate updateManyAndReturn
   */
  export type ExchangeRateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * The data used to update ExchangeRates.
     */
    data: XOR<ExchangeRateUpdateManyMutationInput, ExchangeRateUncheckedUpdateManyInput>
    /**
     * Filter which ExchangeRates to update
     */
    where?: ExchangeRateWhereInput
    /**
     * Limit how many ExchangeRates to update.
     */
    limit?: number
  }

  /**
   * ExchangeRate upsert
   */
  export type ExchangeRateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * The filter to search for the ExchangeRate to update in case it exists.
     */
    where: ExchangeRateWhereUniqueInput
    /**
     * In case the ExchangeRate found by the `where` argument doesn't exist, create a new ExchangeRate with this data.
     */
    create: XOR<ExchangeRateCreateInput, ExchangeRateUncheckedCreateInput>
    /**
     * In case the ExchangeRate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExchangeRateUpdateInput, ExchangeRateUncheckedUpdateInput>
  }

  /**
   * ExchangeRate delete
   */
  export type ExchangeRateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
    /**
     * Filter which ExchangeRate to delete.
     */
    where: ExchangeRateWhereUniqueInput
  }

  /**
   * ExchangeRate deleteMany
   */
  export type ExchangeRateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExchangeRates to delete
     */
    where?: ExchangeRateWhereInput
    /**
     * Limit how many ExchangeRates to delete.
     */
    limit?: number
  }

  /**
   * ExchangeRate without action
   */
  export type ExchangeRateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExchangeRate
     */
    select?: ExchangeRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExchangeRate
     */
    omit?: ExchangeRateOmit<ExtArgs> | null
  }


  /**
   * Model ShippingLog
   */

  export type AggregateShippingLog = {
    _count: ShippingLogCountAggregateOutputType | null
    _min: ShippingLogMinAggregateOutputType | null
    _max: ShippingLogMaxAggregateOutputType | null
  }

  export type ShippingLogMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    event: string | null
    previousValue: string | null
    newValue: string | null
    note: string | null
    rawPayload: string | null
    createdAt: Date | null
  }

  export type ShippingLogMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    event: string | null
    previousValue: string | null
    newValue: string | null
    note: string | null
    rawPayload: string | null
    createdAt: Date | null
  }

  export type ShippingLogCountAggregateOutputType = {
    id: number
    orderId: number
    event: number
    previousValue: number
    newValue: number
    note: number
    rawPayload: number
    createdAt: number
    _all: number
  }


  export type ShippingLogMinAggregateInputType = {
    id?: true
    orderId?: true
    event?: true
    previousValue?: true
    newValue?: true
    note?: true
    rawPayload?: true
    createdAt?: true
  }

  export type ShippingLogMaxAggregateInputType = {
    id?: true
    orderId?: true
    event?: true
    previousValue?: true
    newValue?: true
    note?: true
    rawPayload?: true
    createdAt?: true
  }

  export type ShippingLogCountAggregateInputType = {
    id?: true
    orderId?: true
    event?: true
    previousValue?: true
    newValue?: true
    note?: true
    rawPayload?: true
    createdAt?: true
    _all?: true
  }

  export type ShippingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingLog to aggregate.
     */
    where?: ShippingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingLogs to fetch.
     */
    orderBy?: ShippingLogOrderByWithRelationInput | ShippingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShippingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShippingLogs
    **/
    _count?: true | ShippingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShippingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShippingLogMaxAggregateInputType
  }

  export type GetShippingLogAggregateType<T extends ShippingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateShippingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShippingLog[P]>
      : GetScalarType<T[P], AggregateShippingLog[P]>
  }




  export type ShippingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingLogWhereInput
    orderBy?: ShippingLogOrderByWithAggregationInput | ShippingLogOrderByWithAggregationInput[]
    by: ShippingLogScalarFieldEnum[] | ShippingLogScalarFieldEnum
    having?: ShippingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShippingLogCountAggregateInputType | true
    _min?: ShippingLogMinAggregateInputType
    _max?: ShippingLogMaxAggregateInputType
  }

  export type ShippingLogGroupByOutputType = {
    id: string
    orderId: string
    event: string
    previousValue: string | null
    newValue: string | null
    note: string | null
    rawPayload: string | null
    createdAt: Date
    _count: ShippingLogCountAggregateOutputType | null
    _min: ShippingLogMinAggregateOutputType | null
    _max: ShippingLogMaxAggregateOutputType | null
  }

  type GetShippingLogGroupByPayload<T extends ShippingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShippingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShippingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShippingLogGroupByOutputType[P]>
            : GetScalarType<T[P], ShippingLogGroupByOutputType[P]>
        }
      >
    >


  export type ShippingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    event?: boolean
    previousValue?: boolean
    newValue?: boolean
    note?: boolean
    rawPayload?: boolean
    createdAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shippingLog"]>

  export type ShippingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    event?: boolean
    previousValue?: boolean
    newValue?: boolean
    note?: boolean
    rawPayload?: boolean
    createdAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shippingLog"]>

  export type ShippingLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    event?: boolean
    previousValue?: boolean
    newValue?: boolean
    note?: boolean
    rawPayload?: boolean
    createdAt?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shippingLog"]>

  export type ShippingLogSelectScalar = {
    id?: boolean
    orderId?: boolean
    event?: boolean
    previousValue?: boolean
    newValue?: boolean
    note?: boolean
    rawPayload?: boolean
    createdAt?: boolean
  }

  export type ShippingLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "event" | "previousValue" | "newValue" | "note" | "rawPayload" | "createdAt", ExtArgs["result"]["shippingLog"]>
  export type ShippingLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }
  export type ShippingLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }
  export type ShippingLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
  }

  export type $ShippingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShippingLog"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      event: string
      previousValue: string | null
      newValue: string | null
      note: string | null
      rawPayload: string | null
      createdAt: Date
    }, ExtArgs["result"]["shippingLog"]>
    composites: {}
  }

  type ShippingLogGetPayload<S extends boolean | null | undefined | ShippingLogDefaultArgs> = $Result.GetResult<Prisma.$ShippingLogPayload, S>

  type ShippingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShippingLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShippingLogCountAggregateInputType | true
    }

  export interface ShippingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShippingLog'], meta: { name: 'ShippingLog' } }
    /**
     * Find zero or one ShippingLog that matches the filter.
     * @param {ShippingLogFindUniqueArgs} args - Arguments to find a ShippingLog
     * @example
     * // Get one ShippingLog
     * const shippingLog = await prisma.shippingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShippingLogFindUniqueArgs>(args: SelectSubset<T, ShippingLogFindUniqueArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShippingLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShippingLogFindUniqueOrThrowArgs} args - Arguments to find a ShippingLog
     * @example
     * // Get one ShippingLog
     * const shippingLog = await prisma.shippingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShippingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ShippingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogFindFirstArgs} args - Arguments to find a ShippingLog
     * @example
     * // Get one ShippingLog
     * const shippingLog = await prisma.shippingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShippingLogFindFirstArgs>(args?: SelectSubset<T, ShippingLogFindFirstArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogFindFirstOrThrowArgs} args - Arguments to find a ShippingLog
     * @example
     * // Get one ShippingLog
     * const shippingLog = await prisma.shippingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShippingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ShippingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShippingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShippingLogs
     * const shippingLogs = await prisma.shippingLog.findMany()
     * 
     * // Get first 10 ShippingLogs
     * const shippingLogs = await prisma.shippingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shippingLogWithIdOnly = await prisma.shippingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShippingLogFindManyArgs>(args?: SelectSubset<T, ShippingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShippingLog.
     * @param {ShippingLogCreateArgs} args - Arguments to create a ShippingLog.
     * @example
     * // Create one ShippingLog
     * const ShippingLog = await prisma.shippingLog.create({
     *   data: {
     *     // ... data to create a ShippingLog
     *   }
     * })
     * 
     */
    create<T extends ShippingLogCreateArgs>(args: SelectSubset<T, ShippingLogCreateArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShippingLogs.
     * @param {ShippingLogCreateManyArgs} args - Arguments to create many ShippingLogs.
     * @example
     * // Create many ShippingLogs
     * const shippingLog = await prisma.shippingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShippingLogCreateManyArgs>(args?: SelectSubset<T, ShippingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShippingLogs and returns the data saved in the database.
     * @param {ShippingLogCreateManyAndReturnArgs} args - Arguments to create many ShippingLogs.
     * @example
     * // Create many ShippingLogs
     * const shippingLog = await prisma.shippingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShippingLogs and only return the `id`
     * const shippingLogWithIdOnly = await prisma.shippingLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShippingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ShippingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShippingLog.
     * @param {ShippingLogDeleteArgs} args - Arguments to delete one ShippingLog.
     * @example
     * // Delete one ShippingLog
     * const ShippingLog = await prisma.shippingLog.delete({
     *   where: {
     *     // ... filter to delete one ShippingLog
     *   }
     * })
     * 
     */
    delete<T extends ShippingLogDeleteArgs>(args: SelectSubset<T, ShippingLogDeleteArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShippingLog.
     * @param {ShippingLogUpdateArgs} args - Arguments to update one ShippingLog.
     * @example
     * // Update one ShippingLog
     * const shippingLog = await prisma.shippingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShippingLogUpdateArgs>(args: SelectSubset<T, ShippingLogUpdateArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShippingLogs.
     * @param {ShippingLogDeleteManyArgs} args - Arguments to filter ShippingLogs to delete.
     * @example
     * // Delete a few ShippingLogs
     * const { count } = await prisma.shippingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShippingLogDeleteManyArgs>(args?: SelectSubset<T, ShippingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShippingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShippingLogs
     * const shippingLog = await prisma.shippingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShippingLogUpdateManyArgs>(args: SelectSubset<T, ShippingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShippingLogs and returns the data updated in the database.
     * @param {ShippingLogUpdateManyAndReturnArgs} args - Arguments to update many ShippingLogs.
     * @example
     * // Update many ShippingLogs
     * const shippingLog = await prisma.shippingLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShippingLogs and only return the `id`
     * const shippingLogWithIdOnly = await prisma.shippingLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShippingLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ShippingLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShippingLog.
     * @param {ShippingLogUpsertArgs} args - Arguments to update or create a ShippingLog.
     * @example
     * // Update or create a ShippingLog
     * const shippingLog = await prisma.shippingLog.upsert({
     *   create: {
     *     // ... data to create a ShippingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShippingLog we want to update
     *   }
     * })
     */
    upsert<T extends ShippingLogUpsertArgs>(args: SelectSubset<T, ShippingLogUpsertArgs<ExtArgs>>): Prisma__ShippingLogClient<$Result.GetResult<Prisma.$ShippingLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShippingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogCountArgs} args - Arguments to filter ShippingLogs to count.
     * @example
     * // Count the number of ShippingLogs
     * const count = await prisma.shippingLog.count({
     *   where: {
     *     // ... the filter for the ShippingLogs we want to count
     *   }
     * })
    **/
    count<T extends ShippingLogCountArgs>(
      args?: Subset<T, ShippingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShippingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShippingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShippingLogAggregateArgs>(args: Subset<T, ShippingLogAggregateArgs>): Prisma.PrismaPromise<GetShippingLogAggregateType<T>>

    /**
     * Group by ShippingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShippingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShippingLogGroupByArgs['orderBy'] }
        : { orderBy?: ShippingLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShippingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShippingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShippingLog model
   */
  readonly fields: ShippingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShippingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShippingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShippingLog model
   */
  interface ShippingLogFieldRefs {
    readonly id: FieldRef<"ShippingLog", 'String'>
    readonly orderId: FieldRef<"ShippingLog", 'String'>
    readonly event: FieldRef<"ShippingLog", 'String'>
    readonly previousValue: FieldRef<"ShippingLog", 'String'>
    readonly newValue: FieldRef<"ShippingLog", 'String'>
    readonly note: FieldRef<"ShippingLog", 'String'>
    readonly rawPayload: FieldRef<"ShippingLog", 'String'>
    readonly createdAt: FieldRef<"ShippingLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShippingLog findUnique
   */
  export type ShippingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter, which ShippingLog to fetch.
     */
    where: ShippingLogWhereUniqueInput
  }

  /**
   * ShippingLog findUniqueOrThrow
   */
  export type ShippingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter, which ShippingLog to fetch.
     */
    where: ShippingLogWhereUniqueInput
  }

  /**
   * ShippingLog findFirst
   */
  export type ShippingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter, which ShippingLog to fetch.
     */
    where?: ShippingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingLogs to fetch.
     */
    orderBy?: ShippingLogOrderByWithRelationInput | ShippingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingLogs.
     */
    cursor?: ShippingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingLogs.
     */
    distinct?: ShippingLogScalarFieldEnum | ShippingLogScalarFieldEnum[]
  }

  /**
   * ShippingLog findFirstOrThrow
   */
  export type ShippingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter, which ShippingLog to fetch.
     */
    where?: ShippingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingLogs to fetch.
     */
    orderBy?: ShippingLogOrderByWithRelationInput | ShippingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingLogs.
     */
    cursor?: ShippingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingLogs.
     */
    distinct?: ShippingLogScalarFieldEnum | ShippingLogScalarFieldEnum[]
  }

  /**
   * ShippingLog findMany
   */
  export type ShippingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter, which ShippingLogs to fetch.
     */
    where?: ShippingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingLogs to fetch.
     */
    orderBy?: ShippingLogOrderByWithRelationInput | ShippingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShippingLogs.
     */
    cursor?: ShippingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingLogs.
     */
    distinct?: ShippingLogScalarFieldEnum | ShippingLogScalarFieldEnum[]
  }

  /**
   * ShippingLog create
   */
  export type ShippingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ShippingLog.
     */
    data: XOR<ShippingLogCreateInput, ShippingLogUncheckedCreateInput>
  }

  /**
   * ShippingLog createMany
   */
  export type ShippingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShippingLogs.
     */
    data: ShippingLogCreateManyInput | ShippingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShippingLog createManyAndReturn
   */
  export type ShippingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * The data used to create many ShippingLogs.
     */
    data: ShippingLogCreateManyInput | ShippingLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShippingLog update
   */
  export type ShippingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ShippingLog.
     */
    data: XOR<ShippingLogUpdateInput, ShippingLogUncheckedUpdateInput>
    /**
     * Choose, which ShippingLog to update.
     */
    where: ShippingLogWhereUniqueInput
  }

  /**
   * ShippingLog updateMany
   */
  export type ShippingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShippingLogs.
     */
    data: XOR<ShippingLogUpdateManyMutationInput, ShippingLogUncheckedUpdateManyInput>
    /**
     * Filter which ShippingLogs to update
     */
    where?: ShippingLogWhereInput
    /**
     * Limit how many ShippingLogs to update.
     */
    limit?: number
  }

  /**
   * ShippingLog updateManyAndReturn
   */
  export type ShippingLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * The data used to update ShippingLogs.
     */
    data: XOR<ShippingLogUpdateManyMutationInput, ShippingLogUncheckedUpdateManyInput>
    /**
     * Filter which ShippingLogs to update
     */
    where?: ShippingLogWhereInput
    /**
     * Limit how many ShippingLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShippingLog upsert
   */
  export type ShippingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ShippingLog to update in case it exists.
     */
    where: ShippingLogWhereUniqueInput
    /**
     * In case the ShippingLog found by the `where` argument doesn't exist, create a new ShippingLog with this data.
     */
    create: XOR<ShippingLogCreateInput, ShippingLogUncheckedCreateInput>
    /**
     * In case the ShippingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShippingLogUpdateInput, ShippingLogUncheckedUpdateInput>
  }

  /**
   * ShippingLog delete
   */
  export type ShippingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
    /**
     * Filter which ShippingLog to delete.
     */
    where: ShippingLogWhereUniqueInput
  }

  /**
   * ShippingLog deleteMany
   */
  export type ShippingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingLogs to delete
     */
    where?: ShippingLogWhereInput
    /**
     * Limit how many ShippingLogs to delete.
     */
    limit?: number
  }

  /**
   * ShippingLog without action
   */
  export type ShippingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingLog
     */
    select?: ShippingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingLog
     */
    omit?: ShippingLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingLogInclude<ExtArgs> | null
  }


  /**
   * Model OrderItem
   */

  export type AggregateOrderItem = {
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  export type OrderItemAvgAggregateOutputType = {
    quantity: number | null
    priceAtBuy: number | null
  }

  export type OrderItemSumAggregateOutputType = {
    quantity: number | null
    priceAtBuy: number | null
  }

  export type OrderItemMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    productId: string | null
    size: string | null
    quantity: number | null
    priceAtBuy: number | null
  }

  export type OrderItemMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    productId: string | null
    size: string | null
    quantity: number | null
    priceAtBuy: number | null
  }

  export type OrderItemCountAggregateOutputType = {
    id: number
    orderId: number
    productId: number
    size: number
    quantity: number
    priceAtBuy: number
    _all: number
  }


  export type OrderItemAvgAggregateInputType = {
    quantity?: true
    priceAtBuy?: true
  }

  export type OrderItemSumAggregateInputType = {
    quantity?: true
    priceAtBuy?: true
  }

  export type OrderItemMinAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    size?: true
    quantity?: true
    priceAtBuy?: true
  }

  export type OrderItemMaxAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    size?: true
    quantity?: true
    priceAtBuy?: true
  }

  export type OrderItemCountAggregateInputType = {
    id?: true
    orderId?: true
    productId?: true
    size?: true
    quantity?: true
    priceAtBuy?: true
    _all?: true
  }

  export type OrderItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItem to aggregate.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderItems
    **/
    _count?: true | OrderItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderItemMaxAggregateInputType
  }

  export type GetOrderItemAggregateType<T extends OrderItemAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderItem[P]>
      : GetScalarType<T[P], AggregateOrderItem[P]>
  }




  export type OrderItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderItemWhereInput
    orderBy?: OrderItemOrderByWithAggregationInput | OrderItemOrderByWithAggregationInput[]
    by: OrderItemScalarFieldEnum[] | OrderItemScalarFieldEnum
    having?: OrderItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderItemCountAggregateInputType | true
    _avg?: OrderItemAvgAggregateInputType
    _sum?: OrderItemSumAggregateInputType
    _min?: OrderItemMinAggregateInputType
    _max?: OrderItemMaxAggregateInputType
  }

  export type OrderItemGroupByOutputType = {
    id: string
    orderId: string
    productId: string
    size: string
    quantity: number
    priceAtBuy: number
    _count: OrderItemCountAggregateOutputType | null
    _avg: OrderItemAvgAggregateOutputType | null
    _sum: OrderItemSumAggregateOutputType | null
    _min: OrderItemMinAggregateOutputType | null
    _max: OrderItemMaxAggregateOutputType | null
  }

  type GetOrderItemGroupByPayload<T extends OrderItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
        }
      >
    >


  export type OrderItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productId?: boolean
    size?: boolean
    quantity?: boolean
    priceAtBuy?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productId?: boolean
    size?: boolean
    quantity?: boolean
    priceAtBuy?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    productId?: boolean
    size?: boolean
    quantity?: boolean
    priceAtBuy?: boolean
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderItem"]>

  export type OrderItemSelectScalar = {
    id?: boolean
    orderId?: boolean
    productId?: boolean
    size?: boolean
    quantity?: boolean
    priceAtBuy?: boolean
  }

  export type OrderItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "productId" | "size" | "quantity" | "priceAtBuy", ExtArgs["result"]["orderItem"]>
  export type OrderItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type OrderItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type OrderItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | OrderDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $OrderItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderItem"
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      productId: string
      size: string
      quantity: number
      priceAtBuy: number
    }, ExtArgs["result"]["orderItem"]>
    composites: {}
  }

  type OrderItemGetPayload<S extends boolean | null | undefined | OrderItemDefaultArgs> = $Result.GetResult<Prisma.$OrderItemPayload, S>

  type OrderItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderItemCountAggregateInputType | true
    }

  export interface OrderItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderItem'], meta: { name: 'OrderItem' } }
    /**
     * Find zero or one OrderItem that matches the filter.
     * @param {OrderItemFindUniqueArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderItemFindUniqueArgs>(args: SelectSubset<T, OrderItemFindUniqueArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderItemFindUniqueOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderItemFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderItemFindFirstArgs>(args?: SelectSubset<T, OrderItemFindFirstArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderItemFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderItems
     * const orderItems = await prisma.orderItem.findMany()
     * 
     * // Get first 10 OrderItems
     * const orderItems = await prisma.orderItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderItemFindManyArgs>(args?: SelectSubset<T, OrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderItem.
     * @param {OrderItemCreateArgs} args - Arguments to create a OrderItem.
     * @example
     * // Create one OrderItem
     * const OrderItem = await prisma.orderItem.create({
     *   data: {
     *     // ... data to create a OrderItem
     *   }
     * })
     * 
     */
    create<T extends OrderItemCreateArgs>(args: SelectSubset<T, OrderItemCreateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderItems.
     * @param {OrderItemCreateManyArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderItemCreateManyArgs>(args?: SelectSubset<T, OrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderItems and returns the data saved in the database.
     * @param {OrderItemCreateManyAndReturnArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderItems and only return the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderItemCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderItem.
     * @param {OrderItemDeleteArgs} args - Arguments to delete one OrderItem.
     * @example
     * // Delete one OrderItem
     * const OrderItem = await prisma.orderItem.delete({
     *   where: {
     *     // ... filter to delete one OrderItem
     *   }
     * })
     * 
     */
    delete<T extends OrderItemDeleteArgs>(args: SelectSubset<T, OrderItemDeleteArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderItem.
     * @param {OrderItemUpdateArgs} args - Arguments to update one OrderItem.
     * @example
     * // Update one OrderItem
     * const orderItem = await prisma.orderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderItemUpdateArgs>(args: SelectSubset<T, OrderItemUpdateArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderItems.
     * @param {OrderItemDeleteManyArgs} args - Arguments to filter OrderItems to delete.
     * @example
     * // Delete a few OrderItems
     * const { count } = await prisma.orderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderItemDeleteManyArgs>(args?: SelectSubset<T, OrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderItemUpdateManyArgs>(args: SelectSubset<T, OrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderItems and returns the data updated in the database.
     * @param {OrderItemUpdateManyAndReturnArgs} args - Arguments to update many OrderItems.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderItems and only return the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderItemUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderItem.
     * @param {OrderItemUpsertArgs} args - Arguments to update or create a OrderItem.
     * @example
     * // Update or create a OrderItem
     * const orderItem = await prisma.orderItem.upsert({
     *   create: {
     *     // ... data to create a OrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderItem we want to update
     *   }
     * })
     */
    upsert<T extends OrderItemUpsertArgs>(args: SelectSubset<T, OrderItemUpsertArgs<ExtArgs>>): Prisma__OrderItemClient<$Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemCountArgs} args - Arguments to filter OrderItems to count.
     * @example
     * // Count the number of OrderItems
     * const count = await prisma.orderItem.count({
     *   where: {
     *     // ... the filter for the OrderItems we want to count
     *   }
     * })
    **/
    count<T extends OrderItemCountArgs>(
      args?: Subset<T, OrderItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderItemAggregateArgs>(args: Subset<T, OrderItemAggregateArgs>): Prisma.PrismaPromise<GetOrderItemAggregateType<T>>

    /**
     * Group by OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderItemGroupByArgs['orderBy'] }
        : { orderBy?: OrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderItem model
   */
  readonly fields: OrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrderDefaultArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderItem model
   */
  interface OrderItemFieldRefs {
    readonly id: FieldRef<"OrderItem", 'String'>
    readonly orderId: FieldRef<"OrderItem", 'String'>
    readonly productId: FieldRef<"OrderItem", 'String'>
    readonly size: FieldRef<"OrderItem", 'String'>
    readonly quantity: FieldRef<"OrderItem", 'Int'>
    readonly priceAtBuy: FieldRef<"OrderItem", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * OrderItem findUnique
   */
  export type OrderItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findUniqueOrThrow
   */
  export type OrderItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem findFirst
   */
  export type OrderItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findFirstOrThrow
   */
  export type OrderItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem findMany
   */
  export type OrderItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter, which OrderItems to fetch.
     */
    where?: OrderItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderItems to fetch.
     */
    orderBy?: OrderItemOrderByWithRelationInput | OrderItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[]
  }

  /**
   * OrderItem create
   */
  export type OrderItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderItem.
     */
    data: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
  }

  /**
   * OrderItem createMany
   */
  export type OrderItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderItem createManyAndReturn
   */
  export type OrderItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderItem update
   */
  export type OrderItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderItem.
     */
    data: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
    /**
     * Choose, which OrderItem to update.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem updateMany
   */
  export type OrderItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderItems.
     */
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to update.
     */
    limit?: number
  }

  /**
   * OrderItem updateManyAndReturn
   */
  export type OrderItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * The data used to update OrderItems.
     */
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyInput>
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderItem upsert
   */
  export type OrderItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderItem to update in case it exists.
     */
    where: OrderItemWhereUniqueInput
    /**
     * In case the OrderItem found by the `where` argument doesn't exist, create a new OrderItem with this data.
     */
    create: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>
    /**
     * In case the OrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>
  }

  /**
   * OrderItem delete
   */
  export type OrderItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
    /**
     * Filter which OrderItem to delete.
     */
    where: OrderItemWhereUniqueInput
  }

  /**
   * OrderItem deleteMany
   */
  export type OrderItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderItems to delete
     */
    where?: OrderItemWhereInput
    /**
     * Limit how many OrderItems to delete.
     */
    limit?: number
  }

  /**
   * OrderItem without action
   */
  export type OrderItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderItem
     */
    omit?: OrderItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null
  }


  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    email: string | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    email: string | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    _all: number
  }


  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    email: string
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email", ExtArgs["result"]["admin"]>

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    price: 'price',
    category: 'category',
    images: 'images',
    isActive: 'isActive',
    isPreOrder: 'isPreOrder',
    stock: 'stock',
    createdAt: 'createdAt',
    sizeGuideId: 'sizeGuideId'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const SizeGuideScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    measurements: 'measurements',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SizeGuideScalarFieldEnum = (typeof SizeGuideScalarFieldEnum)[keyof typeof SizeGuideScalarFieldEnum]


  export const ProductSizeScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    size: 'size'
  };

  export type ProductSizeScalarFieldEnum = (typeof ProductSizeScalarFieldEnum)[keyof typeof ProductSizeScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    orderNumber: 'orderNumber',
    customerName: 'customerName',
    email: 'email',
    phone: 'phone',
    country: 'country',
    province: 'province',
    stateProvince: 'stateProvince',
    shippingAddress: 'shippingAddress',
    apartment: 'apartment',
    district: 'district',
    city: 'city',
    postalCode: 'postalCode',
    courier: 'courier',
    shippingCost: 'shippingCost',
    subtotal: 'subtotal',
    total: 'total',
    paymentStatus: 'paymentStatus',
    orderStatus: 'orderStatus',
    paidAt: 'paidAt',
    expiredAt: 'expiredAt',
    isPreOrder: 'isPreOrder',
    trackingNumber: 'trackingNumber',
    manualCourier: 'manualCourier',
    manualService: 'manualService',
    manualShippedAt: 'manualShippedAt',
    manualTrackingNote: 'manualTrackingNote',
    duitkuReference: 'duitkuReference',
    duitkuPaymentMethod: 'duitkuPaymentMethod',
    duitkuPaymentUrl: 'duitkuPaymentUrl',
    duitkuVaNumber: 'duitkuVaNumber',
    duitkuQrString: 'duitkuQrString',
    duitkuFee: 'duitkuFee',
    duitkuStatusMessage: 'duitkuStatusMessage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    biteshipOrderId: 'biteshipOrderId',
    biteshipTrackingId: 'biteshipTrackingId',
    biteshipStatus: 'biteshipStatus',
    shippingOrderError: 'shippingOrderError',
    shippingOrderStatus: 'shippingOrderStatus',
    shippingRetryCount: 'shippingRetryCount',
    priceRegion: 'priceRegion',
    exchangeRate: 'exchangeRate'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const ExchangeRateScalarFieldEnum: {
    id: 'id',
    usdToIdr: 'usdToIdr',
    source: 'source',
    isOverride: 'isOverride',
    updatedAt: 'updatedAt',
    expiresAt: 'expiresAt'
  };

  export type ExchangeRateScalarFieldEnum = (typeof ExchangeRateScalarFieldEnum)[keyof typeof ExchangeRateScalarFieldEnum]


  export const ShippingLogScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    event: 'event',
    previousValue: 'previousValue',
    newValue: 'newValue',
    note: 'note',
    rawPayload: 'rawPayload',
    createdAt: 'createdAt'
  };

  export type ShippingLogScalarFieldEnum = (typeof ShippingLogScalarFieldEnum)[keyof typeof ShippingLogScalarFieldEnum]


  export const OrderItemScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    productId: 'productId',
    size: 'size',
    quantity: 'quantity',
    priceAtBuy: 'priceAtBuy'
  };

  export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum]


  export const AdminScalarFieldEnum: {
    id: 'id',
    email: 'email'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    category?: StringFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    isActive?: BoolFilter<"Product"> | boolean
    isPreOrder?: BoolFilter<"Product"> | boolean
    stock?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    sizeGuideId?: StringNullableFilter<"Product"> | string | null
    orderItems?: OrderItemListRelationFilter
    sizes?: ProductSizeListRelationFilter
    sizeGuide?: XOR<SizeGuideNullableScalarRelationFilter, SizeGuideWhereInput> | null
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    price?: SortOrder
    category?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    isPreOrder?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    sizeGuideId?: SortOrderInput | SortOrder
    orderItems?: OrderItemOrderByRelationAggregateInput
    sizes?: ProductSizeOrderByRelationAggregateInput
    sizeGuide?: SizeGuideOrderByWithRelationInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    category?: StringFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    isActive?: BoolFilter<"Product"> | boolean
    isPreOrder?: BoolFilter<"Product"> | boolean
    stock?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    sizeGuideId?: StringNullableFilter<"Product"> | string | null
    orderItems?: OrderItemListRelationFilter
    sizes?: ProductSizeListRelationFilter
    sizeGuide?: XOR<SizeGuideNullableScalarRelationFilter, SizeGuideWhereInput> | null
  }, "id" | "slug">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    price?: SortOrder
    category?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    isPreOrder?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    sizeGuideId?: SortOrderInput | SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    slug?: StringWithAggregatesFilter<"Product"> | string
    description?: StringWithAggregatesFilter<"Product"> | string
    price?: IntWithAggregatesFilter<"Product"> | number
    category?: StringWithAggregatesFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    isPreOrder?: BoolWithAggregatesFilter<"Product"> | boolean
    stock?: IntWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    sizeGuideId?: StringNullableWithAggregatesFilter<"Product"> | string | null
  }

  export type SizeGuideWhereInput = {
    AND?: SizeGuideWhereInput | SizeGuideWhereInput[]
    OR?: SizeGuideWhereInput[]
    NOT?: SizeGuideWhereInput | SizeGuideWhereInput[]
    id?: StringFilter<"SizeGuide"> | string
    name?: StringFilter<"SizeGuide"> | string
    description?: StringNullableFilter<"SizeGuide"> | string | null
    measurements?: JsonFilter<"SizeGuide">
    createdAt?: DateTimeFilter<"SizeGuide"> | Date | string
    updatedAt?: DateTimeFilter<"SizeGuide"> | Date | string
    products?: ProductListRelationFilter
  }

  export type SizeGuideOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    measurements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type SizeGuideWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SizeGuideWhereInput | SizeGuideWhereInput[]
    OR?: SizeGuideWhereInput[]
    NOT?: SizeGuideWhereInput | SizeGuideWhereInput[]
    name?: StringFilter<"SizeGuide"> | string
    description?: StringNullableFilter<"SizeGuide"> | string | null
    measurements?: JsonFilter<"SizeGuide">
    createdAt?: DateTimeFilter<"SizeGuide"> | Date | string
    updatedAt?: DateTimeFilter<"SizeGuide"> | Date | string
    products?: ProductListRelationFilter
  }, "id">

  export type SizeGuideOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    measurements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SizeGuideCountOrderByAggregateInput
    _max?: SizeGuideMaxOrderByAggregateInput
    _min?: SizeGuideMinOrderByAggregateInput
  }

  export type SizeGuideScalarWhereWithAggregatesInput = {
    AND?: SizeGuideScalarWhereWithAggregatesInput | SizeGuideScalarWhereWithAggregatesInput[]
    OR?: SizeGuideScalarWhereWithAggregatesInput[]
    NOT?: SizeGuideScalarWhereWithAggregatesInput | SizeGuideScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SizeGuide"> | string
    name?: StringWithAggregatesFilter<"SizeGuide"> | string
    description?: StringNullableWithAggregatesFilter<"SizeGuide"> | string | null
    measurements?: JsonWithAggregatesFilter<"SizeGuide">
    createdAt?: DateTimeWithAggregatesFilter<"SizeGuide"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SizeGuide"> | Date | string
  }

  export type ProductSizeWhereInput = {
    AND?: ProductSizeWhereInput | ProductSizeWhereInput[]
    OR?: ProductSizeWhereInput[]
    NOT?: ProductSizeWhereInput | ProductSizeWhereInput[]
    id?: StringFilter<"ProductSize"> | string
    productId?: StringFilter<"ProductSize"> | string
    size?: StringFilter<"ProductSize"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductSizeOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductSizeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId_size?: ProductSizeProductIdSizeCompoundUniqueInput
    AND?: ProductSizeWhereInput | ProductSizeWhereInput[]
    OR?: ProductSizeWhereInput[]
    NOT?: ProductSizeWhereInput | ProductSizeWhereInput[]
    productId?: StringFilter<"ProductSize"> | string
    size?: StringFilter<"ProductSize"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id" | "productId_size">

  export type ProductSizeOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    _count?: ProductSizeCountOrderByAggregateInput
    _max?: ProductSizeMaxOrderByAggregateInput
    _min?: ProductSizeMinOrderByAggregateInput
  }

  export type ProductSizeScalarWhereWithAggregatesInput = {
    AND?: ProductSizeScalarWhereWithAggregatesInput | ProductSizeScalarWhereWithAggregatesInput[]
    OR?: ProductSizeScalarWhereWithAggregatesInput[]
    NOT?: ProductSizeScalarWhereWithAggregatesInput | ProductSizeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductSize"> | string
    productId?: StringWithAggregatesFilter<"ProductSize"> | string
    size?: StringWithAggregatesFilter<"ProductSize"> | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    orderNumber?: StringFilter<"Order"> | string
    customerName?: StringFilter<"Order"> | string
    email?: StringFilter<"Order"> | string
    phone?: StringFilter<"Order"> | string
    country?: StringFilter<"Order"> | string
    province?: StringNullableFilter<"Order"> | string | null
    stateProvince?: StringNullableFilter<"Order"> | string | null
    shippingAddress?: StringFilter<"Order"> | string
    apartment?: StringNullableFilter<"Order"> | string | null
    district?: StringNullableFilter<"Order"> | string | null
    city?: StringFilter<"Order"> | string
    postalCode?: StringFilter<"Order"> | string
    courier?: StringFilter<"Order"> | string
    shippingCost?: IntFilter<"Order"> | number
    subtotal?: IntFilter<"Order"> | number
    total?: IntFilter<"Order"> | number
    paymentStatus?: StringFilter<"Order"> | string
    orderStatus?: StringFilter<"Order"> | string
    paidAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    expiredAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    isPreOrder?: BoolFilter<"Order"> | boolean
    trackingNumber?: StringNullableFilter<"Order"> | string | null
    manualCourier?: StringNullableFilter<"Order"> | string | null
    manualService?: StringNullableFilter<"Order"> | string | null
    manualShippedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    manualTrackingNote?: StringNullableFilter<"Order"> | string | null
    duitkuReference?: StringNullableFilter<"Order"> | string | null
    duitkuPaymentMethod?: StringNullableFilter<"Order"> | string | null
    duitkuPaymentUrl?: StringNullableFilter<"Order"> | string | null
    duitkuVaNumber?: StringNullableFilter<"Order"> | string | null
    duitkuQrString?: StringNullableFilter<"Order"> | string | null
    duitkuFee?: StringNullableFilter<"Order"> | string | null
    duitkuStatusMessage?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    biteshipOrderId?: StringNullableFilter<"Order"> | string | null
    biteshipTrackingId?: StringNullableFilter<"Order"> | string | null
    biteshipStatus?: StringNullableFilter<"Order"> | string | null
    shippingOrderError?: StringNullableFilter<"Order"> | string | null
    shippingOrderStatus?: StringFilter<"Order"> | string
    shippingRetryCount?: IntFilter<"Order"> | number
    priceRegion?: StringFilter<"Order"> | string
    exchangeRate?: FloatNullableFilter<"Order"> | number | null
    items?: OrderItemListRelationFilter
    shippingLogs?: ShippingLogListRelationFilter
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    customerName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    province?: SortOrderInput | SortOrder
    stateProvince?: SortOrderInput | SortOrder
    shippingAddress?: SortOrder
    apartment?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    courier?: SortOrder
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    expiredAt?: SortOrderInput | SortOrder
    isPreOrder?: SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    manualCourier?: SortOrderInput | SortOrder
    manualService?: SortOrderInput | SortOrder
    manualShippedAt?: SortOrderInput | SortOrder
    manualTrackingNote?: SortOrderInput | SortOrder
    duitkuReference?: SortOrderInput | SortOrder
    duitkuPaymentMethod?: SortOrderInput | SortOrder
    duitkuPaymentUrl?: SortOrderInput | SortOrder
    duitkuVaNumber?: SortOrderInput | SortOrder
    duitkuQrString?: SortOrderInput | SortOrder
    duitkuFee?: SortOrderInput | SortOrder
    duitkuStatusMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    biteshipOrderId?: SortOrderInput | SortOrder
    biteshipTrackingId?: SortOrderInput | SortOrder
    biteshipStatus?: SortOrderInput | SortOrder
    shippingOrderError?: SortOrderInput | SortOrder
    shippingOrderStatus?: SortOrder
    shippingRetryCount?: SortOrder
    priceRegion?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    items?: OrderItemOrderByRelationAggregateInput
    shippingLogs?: ShippingLogOrderByRelationAggregateInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderNumber?: string
    duitkuReference?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    customerName?: StringFilter<"Order"> | string
    email?: StringFilter<"Order"> | string
    phone?: StringFilter<"Order"> | string
    country?: StringFilter<"Order"> | string
    province?: StringNullableFilter<"Order"> | string | null
    stateProvince?: StringNullableFilter<"Order"> | string | null
    shippingAddress?: StringFilter<"Order"> | string
    apartment?: StringNullableFilter<"Order"> | string | null
    district?: StringNullableFilter<"Order"> | string | null
    city?: StringFilter<"Order"> | string
    postalCode?: StringFilter<"Order"> | string
    courier?: StringFilter<"Order"> | string
    shippingCost?: IntFilter<"Order"> | number
    subtotal?: IntFilter<"Order"> | number
    total?: IntFilter<"Order"> | number
    paymentStatus?: StringFilter<"Order"> | string
    orderStatus?: StringFilter<"Order"> | string
    paidAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    expiredAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    isPreOrder?: BoolFilter<"Order"> | boolean
    trackingNumber?: StringNullableFilter<"Order"> | string | null
    manualCourier?: StringNullableFilter<"Order"> | string | null
    manualService?: StringNullableFilter<"Order"> | string | null
    manualShippedAt?: DateTimeNullableFilter<"Order"> | Date | string | null
    manualTrackingNote?: StringNullableFilter<"Order"> | string | null
    duitkuPaymentMethod?: StringNullableFilter<"Order"> | string | null
    duitkuPaymentUrl?: StringNullableFilter<"Order"> | string | null
    duitkuVaNumber?: StringNullableFilter<"Order"> | string | null
    duitkuQrString?: StringNullableFilter<"Order"> | string | null
    duitkuFee?: StringNullableFilter<"Order"> | string | null
    duitkuStatusMessage?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    updatedAt?: DateTimeFilter<"Order"> | Date | string
    biteshipOrderId?: StringNullableFilter<"Order"> | string | null
    biteshipTrackingId?: StringNullableFilter<"Order"> | string | null
    biteshipStatus?: StringNullableFilter<"Order"> | string | null
    shippingOrderError?: StringNullableFilter<"Order"> | string | null
    shippingOrderStatus?: StringFilter<"Order"> | string
    shippingRetryCount?: IntFilter<"Order"> | number
    priceRegion?: StringFilter<"Order"> | string
    exchangeRate?: FloatNullableFilter<"Order"> | number | null
    items?: OrderItemListRelationFilter
    shippingLogs?: ShippingLogListRelationFilter
  }, "id" | "orderNumber" | "duitkuReference">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    customerName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    province?: SortOrderInput | SortOrder
    stateProvince?: SortOrderInput | SortOrder
    shippingAddress?: SortOrder
    apartment?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    courier?: SortOrder
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    expiredAt?: SortOrderInput | SortOrder
    isPreOrder?: SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    manualCourier?: SortOrderInput | SortOrder
    manualService?: SortOrderInput | SortOrder
    manualShippedAt?: SortOrderInput | SortOrder
    manualTrackingNote?: SortOrderInput | SortOrder
    duitkuReference?: SortOrderInput | SortOrder
    duitkuPaymentMethod?: SortOrderInput | SortOrder
    duitkuPaymentUrl?: SortOrderInput | SortOrder
    duitkuVaNumber?: SortOrderInput | SortOrder
    duitkuQrString?: SortOrderInput | SortOrder
    duitkuFee?: SortOrderInput | SortOrder
    duitkuStatusMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    biteshipOrderId?: SortOrderInput | SortOrder
    biteshipTrackingId?: SortOrderInput | SortOrder
    biteshipStatus?: SortOrderInput | SortOrder
    shippingOrderError?: SortOrderInput | SortOrder
    shippingOrderStatus?: SortOrder
    shippingRetryCount?: SortOrder
    priceRegion?: SortOrder
    exchangeRate?: SortOrderInput | SortOrder
    _count?: OrderCountOrderByAggregateInput
    _avg?: OrderAvgOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
    _sum?: OrderSumOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    orderNumber?: StringWithAggregatesFilter<"Order"> | string
    customerName?: StringWithAggregatesFilter<"Order"> | string
    email?: StringWithAggregatesFilter<"Order"> | string
    phone?: StringWithAggregatesFilter<"Order"> | string
    country?: StringWithAggregatesFilter<"Order"> | string
    province?: StringNullableWithAggregatesFilter<"Order"> | string | null
    stateProvince?: StringNullableWithAggregatesFilter<"Order"> | string | null
    shippingAddress?: StringWithAggregatesFilter<"Order"> | string
    apartment?: StringNullableWithAggregatesFilter<"Order"> | string | null
    district?: StringNullableWithAggregatesFilter<"Order"> | string | null
    city?: StringWithAggregatesFilter<"Order"> | string
    postalCode?: StringWithAggregatesFilter<"Order"> | string
    courier?: StringWithAggregatesFilter<"Order"> | string
    shippingCost?: IntWithAggregatesFilter<"Order"> | number
    subtotal?: IntWithAggregatesFilter<"Order"> | number
    total?: IntWithAggregatesFilter<"Order"> | number
    paymentStatus?: StringWithAggregatesFilter<"Order"> | string
    orderStatus?: StringWithAggregatesFilter<"Order"> | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    expiredAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    isPreOrder?: BoolWithAggregatesFilter<"Order"> | boolean
    trackingNumber?: StringNullableWithAggregatesFilter<"Order"> | string | null
    manualCourier?: StringNullableWithAggregatesFilter<"Order"> | string | null
    manualService?: StringNullableWithAggregatesFilter<"Order"> | string | null
    manualShippedAt?: DateTimeNullableWithAggregatesFilter<"Order"> | Date | string | null
    manualTrackingNote?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuReference?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuPaymentMethod?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuPaymentUrl?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuVaNumber?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuQrString?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuFee?: StringNullableWithAggregatesFilter<"Order"> | string | null
    duitkuStatusMessage?: StringNullableWithAggregatesFilter<"Order"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    biteshipOrderId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    biteshipTrackingId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    biteshipStatus?: StringNullableWithAggregatesFilter<"Order"> | string | null
    shippingOrderError?: StringNullableWithAggregatesFilter<"Order"> | string | null
    shippingOrderStatus?: StringWithAggregatesFilter<"Order"> | string
    shippingRetryCount?: IntWithAggregatesFilter<"Order"> | number
    priceRegion?: StringWithAggregatesFilter<"Order"> | string
    exchangeRate?: FloatNullableWithAggregatesFilter<"Order"> | number | null
  }

  export type ExchangeRateWhereInput = {
    AND?: ExchangeRateWhereInput | ExchangeRateWhereInput[]
    OR?: ExchangeRateWhereInput[]
    NOT?: ExchangeRateWhereInput | ExchangeRateWhereInput[]
    id?: StringFilter<"ExchangeRate"> | string
    usdToIdr?: FloatFilter<"ExchangeRate"> | number
    source?: StringFilter<"ExchangeRate"> | string
    isOverride?: BoolFilter<"ExchangeRate"> | boolean
    updatedAt?: DateTimeFilter<"ExchangeRate"> | Date | string
    expiresAt?: DateTimeNullableFilter<"ExchangeRate"> | Date | string | null
  }

  export type ExchangeRateOrderByWithRelationInput = {
    id?: SortOrder
    usdToIdr?: SortOrder
    source?: SortOrder
    isOverride?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
  }

  export type ExchangeRateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExchangeRateWhereInput | ExchangeRateWhereInput[]
    OR?: ExchangeRateWhereInput[]
    NOT?: ExchangeRateWhereInput | ExchangeRateWhereInput[]
    usdToIdr?: FloatFilter<"ExchangeRate"> | number
    source?: StringFilter<"ExchangeRate"> | string
    isOverride?: BoolFilter<"ExchangeRate"> | boolean
    updatedAt?: DateTimeFilter<"ExchangeRate"> | Date | string
    expiresAt?: DateTimeNullableFilter<"ExchangeRate"> | Date | string | null
  }, "id">

  export type ExchangeRateOrderByWithAggregationInput = {
    id?: SortOrder
    usdToIdr?: SortOrder
    source?: SortOrder
    isOverride?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: ExchangeRateCountOrderByAggregateInput
    _avg?: ExchangeRateAvgOrderByAggregateInput
    _max?: ExchangeRateMaxOrderByAggregateInput
    _min?: ExchangeRateMinOrderByAggregateInput
    _sum?: ExchangeRateSumOrderByAggregateInput
  }

  export type ExchangeRateScalarWhereWithAggregatesInput = {
    AND?: ExchangeRateScalarWhereWithAggregatesInput | ExchangeRateScalarWhereWithAggregatesInput[]
    OR?: ExchangeRateScalarWhereWithAggregatesInput[]
    NOT?: ExchangeRateScalarWhereWithAggregatesInput | ExchangeRateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExchangeRate"> | string
    usdToIdr?: FloatWithAggregatesFilter<"ExchangeRate"> | number
    source?: StringWithAggregatesFilter<"ExchangeRate"> | string
    isOverride?: BoolWithAggregatesFilter<"ExchangeRate"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"ExchangeRate"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"ExchangeRate"> | Date | string | null
  }

  export type ShippingLogWhereInput = {
    AND?: ShippingLogWhereInput | ShippingLogWhereInput[]
    OR?: ShippingLogWhereInput[]
    NOT?: ShippingLogWhereInput | ShippingLogWhereInput[]
    id?: StringFilter<"ShippingLog"> | string
    orderId?: StringFilter<"ShippingLog"> | string
    event?: StringFilter<"ShippingLog"> | string
    previousValue?: StringNullableFilter<"ShippingLog"> | string | null
    newValue?: StringNullableFilter<"ShippingLog"> | string | null
    note?: StringNullableFilter<"ShippingLog"> | string | null
    rawPayload?: StringNullableFilter<"ShippingLog"> | string | null
    createdAt?: DateTimeFilter<"ShippingLog"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
  }

  export type ShippingLogOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    event?: SortOrder
    previousValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    order?: OrderOrderByWithRelationInput
  }

  export type ShippingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShippingLogWhereInput | ShippingLogWhereInput[]
    OR?: ShippingLogWhereInput[]
    NOT?: ShippingLogWhereInput | ShippingLogWhereInput[]
    orderId?: StringFilter<"ShippingLog"> | string
    event?: StringFilter<"ShippingLog"> | string
    previousValue?: StringNullableFilter<"ShippingLog"> | string | null
    newValue?: StringNullableFilter<"ShippingLog"> | string | null
    note?: StringNullableFilter<"ShippingLog"> | string | null
    rawPayload?: StringNullableFilter<"ShippingLog"> | string | null
    createdAt?: DateTimeFilter<"ShippingLog"> | Date | string
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
  }, "id">

  export type ShippingLogOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    event?: SortOrder
    previousValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ShippingLogCountOrderByAggregateInput
    _max?: ShippingLogMaxOrderByAggregateInput
    _min?: ShippingLogMinOrderByAggregateInput
  }

  export type ShippingLogScalarWhereWithAggregatesInput = {
    AND?: ShippingLogScalarWhereWithAggregatesInput | ShippingLogScalarWhereWithAggregatesInput[]
    OR?: ShippingLogScalarWhereWithAggregatesInput[]
    NOT?: ShippingLogScalarWhereWithAggregatesInput | ShippingLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShippingLog"> | string
    orderId?: StringWithAggregatesFilter<"ShippingLog"> | string
    event?: StringWithAggregatesFilter<"ShippingLog"> | string
    previousValue?: StringNullableWithAggregatesFilter<"ShippingLog"> | string | null
    newValue?: StringNullableWithAggregatesFilter<"ShippingLog"> | string | null
    note?: StringNullableWithAggregatesFilter<"ShippingLog"> | string | null
    rawPayload?: StringNullableWithAggregatesFilter<"ShippingLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ShippingLog"> | Date | string
  }

  export type OrderItemWhereInput = {
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    id?: StringFilter<"OrderItem"> | string
    orderId?: StringFilter<"OrderItem"> | string
    productId?: StringFilter<"OrderItem"> | string
    size?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    priceAtBuy?: IntFilter<"OrderItem"> | number
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type OrderItemOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    quantity?: SortOrder
    priceAtBuy?: SortOrder
    order?: OrderOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type OrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderItemWhereInput | OrderItemWhereInput[]
    OR?: OrderItemWhereInput[]
    NOT?: OrderItemWhereInput | OrderItemWhereInput[]
    orderId?: StringFilter<"OrderItem"> | string
    productId?: StringFilter<"OrderItem"> | string
    size?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    priceAtBuy?: IntFilter<"OrderItem"> | number
    order?: XOR<OrderScalarRelationFilter, OrderWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type OrderItemOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    quantity?: SortOrder
    priceAtBuy?: SortOrder
    _count?: OrderItemCountOrderByAggregateInput
    _avg?: OrderItemAvgOrderByAggregateInput
    _max?: OrderItemMaxOrderByAggregateInput
    _min?: OrderItemMinOrderByAggregateInput
    _sum?: OrderItemSumOrderByAggregateInput
  }

  export type OrderItemScalarWhereWithAggregatesInput = {
    AND?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    OR?: OrderItemScalarWhereWithAggregatesInput[]
    NOT?: OrderItemScalarWhereWithAggregatesInput | OrderItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderItem"> | string
    orderId?: StringWithAggregatesFilter<"OrderItem"> | string
    productId?: StringWithAggregatesFilter<"OrderItem"> | string
    size?: StringWithAggregatesFilter<"OrderItem"> | string
    quantity?: IntWithAggregatesFilter<"OrderItem"> | number
    priceAtBuy?: IntWithAggregatesFilter<"OrderItem"> | number
  }

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
    sizes?: ProductSizeCreateNestedManyWithoutProductInput
    sizeGuide?: SizeGuideCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    sizeGuideId?: string | null
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
    sizes?: ProductSizeUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
    sizes?: ProductSizeUpdateManyWithoutProductNestedInput
    sizeGuide?: SizeGuideUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sizeGuideId?: NullableStringFieldUpdateOperationsInput | string | null
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
    sizes?: ProductSizeUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    sizeGuideId?: string | null
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sizeGuideId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SizeGuideCreateInput = {
    id?: string
    name: string
    description?: string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutSizeGuideInput
  }

  export type SizeGuideUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutSizeGuideInput
  }

  export type SizeGuideUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutSizeGuideNestedInput
  }

  export type SizeGuideUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutSizeGuideNestedInput
  }

  export type SizeGuideCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SizeGuideUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SizeGuideUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductSizeCreateInput = {
    id?: string
    size: string
    product: ProductCreateNestedOneWithoutSizesInput
  }

  export type ProductSizeUncheckedCreateInput = {
    id?: string
    productId: string
    size: string
  }

  export type ProductSizeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutSizesNestedInput
  }

  export type ProductSizeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type ProductSizeCreateManyInput = {
    id?: string
    productId: string
    size: string
  }

  export type ProductSizeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type ProductSizeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type OrderCreateInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    items?: OrderItemCreateNestedManyWithoutOrderInput
    shippingLogs?: ShippingLogCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
    shippingLogs?: ShippingLogUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    items?: OrderItemUpdateManyWithoutOrderNestedInput
    shippingLogs?: ShippingLogUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
    shippingLogs?: ShippingLogUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateManyInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ExchangeRateCreateInput = {
    id?: string
    usdToIdr: number
    source?: string
    isOverride?: boolean
    updatedAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ExchangeRateUncheckedCreateInput = {
    id?: string
    usdToIdr: number
    source?: string
    isOverride?: boolean
    updatedAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ExchangeRateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    usdToIdr?: FloatFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    isOverride?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExchangeRateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    usdToIdr?: FloatFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    isOverride?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExchangeRateCreateManyInput = {
    id?: string
    usdToIdr: number
    source?: string
    isOverride?: boolean
    updatedAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ExchangeRateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    usdToIdr?: FloatFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    isOverride?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExchangeRateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    usdToIdr?: FloatFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    isOverride?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ShippingLogCreateInput = {
    id?: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
    order: OrderCreateNestedOneWithoutShippingLogsInput
  }

  export type ShippingLogUncheckedCreateInput = {
    id?: string
    orderId: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
  }

  export type ShippingLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: OrderUpdateOneRequiredWithoutShippingLogsNestedInput
  }

  export type ShippingLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingLogCreateManyInput = {
    id?: string
    orderId: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
  }

  export type ShippingLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderItemCreateInput = {
    id?: string
    size: string
    quantity: number
    priceAtBuy: number
    order: OrderCreateNestedOneWithoutItemsInput
    product: ProductCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateInput = {
    id?: string
    orderId: string
    productId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type OrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type OrderItemCreateManyInput = {
    id?: string
    orderId: string
    productId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type OrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type OrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type AdminCreateInput = {
    id?: string
    email: string
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    email: string
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type AdminCreateManyInput = {
    id?: string
    email: string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type OrderItemListRelationFilter = {
    every?: OrderItemWhereInput
    some?: OrderItemWhereInput
    none?: OrderItemWhereInput
  }

  export type ProductSizeListRelationFilter = {
    every?: ProductSizeWhereInput
    some?: ProductSizeWhereInput
    none?: ProductSizeWhereInput
  }

  export type SizeGuideNullableScalarRelationFilter = {
    is?: SizeGuideWhereInput | null
    isNot?: SizeGuideWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductSizeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    price?: SortOrder
    category?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    isPreOrder?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    sizeGuideId?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    price?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    isPreOrder?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    sizeGuideId?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    price?: SortOrder
    category?: SortOrder
    isActive?: SortOrder
    isPreOrder?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    sizeGuideId?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SizeGuideCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    measurements?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SizeGuideMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SizeGuideMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductSizeProductIdSizeCompoundUniqueInput = {
    productId: string
    size: string
  }

  export type ProductSizeCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    size?: SortOrder
  }

  export type ProductSizeMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    size?: SortOrder
  }

  export type ProductSizeMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    size?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ShippingLogListRelationFilter = {
    every?: ShippingLogWhereInput
    some?: ShippingLogWhereInput
    none?: ShippingLogWhereInput
  }

  export type ShippingLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    customerName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    province?: SortOrder
    stateProvince?: SortOrder
    shippingAddress?: SortOrder
    apartment?: SortOrder
    district?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    courier?: SortOrder
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    paidAt?: SortOrder
    expiredAt?: SortOrder
    isPreOrder?: SortOrder
    trackingNumber?: SortOrder
    manualCourier?: SortOrder
    manualService?: SortOrder
    manualShippedAt?: SortOrder
    manualTrackingNote?: SortOrder
    duitkuReference?: SortOrder
    duitkuPaymentMethod?: SortOrder
    duitkuPaymentUrl?: SortOrder
    duitkuVaNumber?: SortOrder
    duitkuQrString?: SortOrder
    duitkuFee?: SortOrder
    duitkuStatusMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    biteshipOrderId?: SortOrder
    biteshipTrackingId?: SortOrder
    biteshipStatus?: SortOrder
    shippingOrderError?: SortOrder
    shippingOrderStatus?: SortOrder
    shippingRetryCount?: SortOrder
    priceRegion?: SortOrder
    exchangeRate?: SortOrder
  }

  export type OrderAvgOrderByAggregateInput = {
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    shippingRetryCount?: SortOrder
    exchangeRate?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    customerName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    province?: SortOrder
    stateProvince?: SortOrder
    shippingAddress?: SortOrder
    apartment?: SortOrder
    district?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    courier?: SortOrder
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    paidAt?: SortOrder
    expiredAt?: SortOrder
    isPreOrder?: SortOrder
    trackingNumber?: SortOrder
    manualCourier?: SortOrder
    manualService?: SortOrder
    manualShippedAt?: SortOrder
    manualTrackingNote?: SortOrder
    duitkuReference?: SortOrder
    duitkuPaymentMethod?: SortOrder
    duitkuPaymentUrl?: SortOrder
    duitkuVaNumber?: SortOrder
    duitkuQrString?: SortOrder
    duitkuFee?: SortOrder
    duitkuStatusMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    biteshipOrderId?: SortOrder
    biteshipTrackingId?: SortOrder
    biteshipStatus?: SortOrder
    shippingOrderError?: SortOrder
    shippingOrderStatus?: SortOrder
    shippingRetryCount?: SortOrder
    priceRegion?: SortOrder
    exchangeRate?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    orderNumber?: SortOrder
    customerName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    country?: SortOrder
    province?: SortOrder
    stateProvince?: SortOrder
    shippingAddress?: SortOrder
    apartment?: SortOrder
    district?: SortOrder
    city?: SortOrder
    postalCode?: SortOrder
    courier?: SortOrder
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    paymentStatus?: SortOrder
    orderStatus?: SortOrder
    paidAt?: SortOrder
    expiredAt?: SortOrder
    isPreOrder?: SortOrder
    trackingNumber?: SortOrder
    manualCourier?: SortOrder
    manualService?: SortOrder
    manualShippedAt?: SortOrder
    manualTrackingNote?: SortOrder
    duitkuReference?: SortOrder
    duitkuPaymentMethod?: SortOrder
    duitkuPaymentUrl?: SortOrder
    duitkuVaNumber?: SortOrder
    duitkuQrString?: SortOrder
    duitkuFee?: SortOrder
    duitkuStatusMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    biteshipOrderId?: SortOrder
    biteshipTrackingId?: SortOrder
    biteshipStatus?: SortOrder
    shippingOrderError?: SortOrder
    shippingOrderStatus?: SortOrder
    shippingRetryCount?: SortOrder
    priceRegion?: SortOrder
    exchangeRate?: SortOrder
  }

  export type OrderSumOrderByAggregateInput = {
    shippingCost?: SortOrder
    subtotal?: SortOrder
    total?: SortOrder
    shippingRetryCount?: SortOrder
    exchangeRate?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ExchangeRateCountOrderByAggregateInput = {
    id?: SortOrder
    usdToIdr?: SortOrder
    source?: SortOrder
    isOverride?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ExchangeRateAvgOrderByAggregateInput = {
    usdToIdr?: SortOrder
  }

  export type ExchangeRateMaxOrderByAggregateInput = {
    id?: SortOrder
    usdToIdr?: SortOrder
    source?: SortOrder
    isOverride?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ExchangeRateMinOrderByAggregateInput = {
    id?: SortOrder
    usdToIdr?: SortOrder
    source?: SortOrder
    isOverride?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ExchangeRateSumOrderByAggregateInput = {
    usdToIdr?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type OrderScalarRelationFilter = {
    is?: OrderWhereInput
    isNot?: OrderWhereInput
  }

  export type ShippingLogCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    event?: SortOrder
    previousValue?: SortOrder
    newValue?: SortOrder
    note?: SortOrder
    rawPayload?: SortOrder
    createdAt?: SortOrder
  }

  export type ShippingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    event?: SortOrder
    previousValue?: SortOrder
    newValue?: SortOrder
    note?: SortOrder
    rawPayload?: SortOrder
    createdAt?: SortOrder
  }

  export type ShippingLogMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    event?: SortOrder
    previousValue?: SortOrder
    newValue?: SortOrder
    note?: SortOrder
    rawPayload?: SortOrder
    createdAt?: SortOrder
  }

  export type OrderItemCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    quantity?: SortOrder
    priceAtBuy?: SortOrder
  }

  export type OrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    priceAtBuy?: SortOrder
  }

  export type OrderItemMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    quantity?: SortOrder
    priceAtBuy?: SortOrder
  }

  export type OrderItemMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    productId?: SortOrder
    size?: SortOrder
    quantity?: SortOrder
    priceAtBuy?: SortOrder
  }

  export type OrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    priceAtBuy?: SortOrder
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
  }

  export type ProductCreateimagesInput = {
    set: string[]
  }

  export type OrderItemCreateNestedManyWithoutProductInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ProductSizeCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput> | ProductSizeCreateWithoutProductInput[] | ProductSizeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSizeCreateOrConnectWithoutProductInput | ProductSizeCreateOrConnectWithoutProductInput[]
    createMany?: ProductSizeCreateManyProductInputEnvelope
    connect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
  }

  export type SizeGuideCreateNestedOneWithoutProductsInput = {
    create?: XOR<SizeGuideCreateWithoutProductsInput, SizeGuideUncheckedCreateWithoutProductsInput>
    connectOrCreate?: SizeGuideCreateOrConnectWithoutProductsInput
    connect?: SizeGuideWhereUniqueInput
  }

  export type OrderItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ProductSizeUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput> | ProductSizeCreateWithoutProductInput[] | ProductSizeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSizeCreateOrConnectWithoutProductInput | ProductSizeCreateOrConnectWithoutProductInput[]
    createMany?: ProductSizeCreateManyProductInputEnvelope
    connect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrderItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutProductInput | OrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutProductInput | OrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutProductInput | OrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ProductSizeUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput> | ProductSizeCreateWithoutProductInput[] | ProductSizeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSizeCreateOrConnectWithoutProductInput | ProductSizeCreateOrConnectWithoutProductInput[]
    upsert?: ProductSizeUpsertWithWhereUniqueWithoutProductInput | ProductSizeUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductSizeCreateManyProductInputEnvelope
    set?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    disconnect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    delete?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    connect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    update?: ProductSizeUpdateWithWhereUniqueWithoutProductInput | ProductSizeUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductSizeUpdateManyWithWhereWithoutProductInput | ProductSizeUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductSizeScalarWhereInput | ProductSizeScalarWhereInput[]
  }

  export type SizeGuideUpdateOneWithoutProductsNestedInput = {
    create?: XOR<SizeGuideCreateWithoutProductsInput, SizeGuideUncheckedCreateWithoutProductsInput>
    connectOrCreate?: SizeGuideCreateOrConnectWithoutProductsInput
    upsert?: SizeGuideUpsertWithoutProductsInput
    disconnect?: SizeGuideWhereInput | boolean
    delete?: SizeGuideWhereInput | boolean
    connect?: SizeGuideWhereUniqueInput
    update?: XOR<XOR<SizeGuideUpdateToOneWithWhereWithoutProductsInput, SizeGuideUpdateWithoutProductsInput>, SizeGuideUncheckedUpdateWithoutProductsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type OrderItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput> | OrderItemCreateWithoutProductInput[] | OrderItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutProductInput | OrderItemCreateOrConnectWithoutProductInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutProductInput | OrderItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: OrderItemCreateManyProductInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutProductInput | OrderItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutProductInput | OrderItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ProductSizeUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput> | ProductSizeCreateWithoutProductInput[] | ProductSizeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductSizeCreateOrConnectWithoutProductInput | ProductSizeCreateOrConnectWithoutProductInput[]
    upsert?: ProductSizeUpsertWithWhereUniqueWithoutProductInput | ProductSizeUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductSizeCreateManyProductInputEnvelope
    set?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    disconnect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    delete?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    connect?: ProductSizeWhereUniqueInput | ProductSizeWhereUniqueInput[]
    update?: ProductSizeUpdateWithWhereUniqueWithoutProductInput | ProductSizeUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductSizeUpdateManyWithWhereWithoutProductInput | ProductSizeUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductSizeScalarWhereInput | ProductSizeScalarWhereInput[]
  }

  export type ProductCreateNestedManyWithoutSizeGuideInput = {
    create?: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput> | ProductCreateWithoutSizeGuideInput[] | ProductUncheckedCreateWithoutSizeGuideInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSizeGuideInput | ProductCreateOrConnectWithoutSizeGuideInput[]
    createMany?: ProductCreateManySizeGuideInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutSizeGuideInput = {
    create?: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput> | ProductCreateWithoutSizeGuideInput[] | ProductUncheckedCreateWithoutSizeGuideInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSizeGuideInput | ProductCreateOrConnectWithoutSizeGuideInput[]
    createMany?: ProductCreateManySizeGuideInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutSizeGuideNestedInput = {
    create?: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput> | ProductCreateWithoutSizeGuideInput[] | ProductUncheckedCreateWithoutSizeGuideInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSizeGuideInput | ProductCreateOrConnectWithoutSizeGuideInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutSizeGuideInput | ProductUpsertWithWhereUniqueWithoutSizeGuideInput[]
    createMany?: ProductCreateManySizeGuideInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutSizeGuideInput | ProductUpdateWithWhereUniqueWithoutSizeGuideInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutSizeGuideInput | ProductUpdateManyWithWhereWithoutSizeGuideInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutSizeGuideNestedInput = {
    create?: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput> | ProductCreateWithoutSizeGuideInput[] | ProductUncheckedCreateWithoutSizeGuideInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutSizeGuideInput | ProductCreateOrConnectWithoutSizeGuideInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutSizeGuideInput | ProductUpsertWithWhereUniqueWithoutSizeGuideInput[]
    createMany?: ProductCreateManySizeGuideInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutSizeGuideInput | ProductUpdateWithWhereUniqueWithoutSizeGuideInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutSizeGuideInput | ProductUpdateManyWithWhereWithoutSizeGuideInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutSizesInput = {
    create?: XOR<ProductCreateWithoutSizesInput, ProductUncheckedCreateWithoutSizesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSizesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutSizesNestedInput = {
    create?: XOR<ProductCreateWithoutSizesInput, ProductUncheckedCreateWithoutSizesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutSizesInput
    upsert?: ProductUpsertWithoutSizesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutSizesInput, ProductUpdateWithoutSizesInput>, ProductUncheckedUpdateWithoutSizesInput>
  }

  export type OrderItemCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ShippingLogCreateNestedManyWithoutOrderInput = {
    create?: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput> | ShippingLogCreateWithoutOrderInput[] | ShippingLogUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ShippingLogCreateOrConnectWithoutOrderInput | ShippingLogCreateOrConnectWithoutOrderInput[]
    createMany?: ShippingLogCreateManyOrderInputEnvelope
    connect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
  }

  export type OrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
  }

  export type ShippingLogUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput> | ShippingLogCreateWithoutOrderInput[] | ShippingLogUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ShippingLogCreateOrConnectWithoutOrderInput | ShippingLogCreateOrConnectWithoutOrderInput[]
    createMany?: ShippingLogCreateManyOrderInputEnvelope
    connect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OrderItemUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ShippingLogUpdateManyWithoutOrderNestedInput = {
    create?: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput> | ShippingLogCreateWithoutOrderInput[] | ShippingLogUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ShippingLogCreateOrConnectWithoutOrderInput | ShippingLogCreateOrConnectWithoutOrderInput[]
    upsert?: ShippingLogUpsertWithWhereUniqueWithoutOrderInput | ShippingLogUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: ShippingLogCreateManyOrderInputEnvelope
    set?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    disconnect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    delete?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    connect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    update?: ShippingLogUpdateWithWhereUniqueWithoutOrderInput | ShippingLogUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: ShippingLogUpdateManyWithWhereWithoutOrderInput | ShippingLogUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: ShippingLogScalarWhereInput | ShippingLogScalarWhereInput[]
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput> | OrderItemCreateWithoutOrderInput[] | OrderItemUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderItemCreateOrConnectWithoutOrderInput | OrderItemCreateOrConnectWithoutOrderInput[]
    upsert?: OrderItemUpsertWithWhereUniqueWithoutOrderInput | OrderItemUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderItemCreateManyOrderInputEnvelope
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[]
    update?: OrderItemUpdateWithWhereUniqueWithoutOrderInput | OrderItemUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderItemUpdateManyWithWhereWithoutOrderInput | OrderItemUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
  }

  export type ShippingLogUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput> | ShippingLogCreateWithoutOrderInput[] | ShippingLogUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: ShippingLogCreateOrConnectWithoutOrderInput | ShippingLogCreateOrConnectWithoutOrderInput[]
    upsert?: ShippingLogUpsertWithWhereUniqueWithoutOrderInput | ShippingLogUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: ShippingLogCreateManyOrderInputEnvelope
    set?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    disconnect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    delete?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    connect?: ShippingLogWhereUniqueInput | ShippingLogWhereUniqueInput[]
    update?: ShippingLogUpdateWithWhereUniqueWithoutOrderInput | ShippingLogUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: ShippingLogUpdateManyWithWhereWithoutOrderInput | ShippingLogUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: ShippingLogScalarWhereInput | ShippingLogScalarWhereInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OrderCreateNestedOneWithoutShippingLogsInput = {
    create?: XOR<OrderCreateWithoutShippingLogsInput, OrderUncheckedCreateWithoutShippingLogsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutShippingLogsInput
    connect?: OrderWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutShippingLogsNestedInput = {
    create?: XOR<OrderCreateWithoutShippingLogsInput, OrderUncheckedCreateWithoutShippingLogsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutShippingLogsInput
    upsert?: OrderUpsertWithoutShippingLogsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutShippingLogsInput, OrderUpdateWithoutShippingLogsInput>, OrderUncheckedUpdateWithoutShippingLogsInput>
  }

  export type OrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    connect?: OrderWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutOrderItemsInput = {
    create?: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput
    connect?: ProductWhereUniqueInput
  }

  export type OrderUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput
    upsert?: OrderUpsertWithoutItemsInput
    connect?: OrderWhereUniqueInput
    update?: XOR<XOR<OrderUpdateToOneWithWhereWithoutItemsInput, OrderUpdateWithoutItemsInput>, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type ProductUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput
    upsert?: ProductUpsertWithoutOrderItemsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutOrderItemsInput, ProductUpdateWithoutOrderItemsInput>, ProductUncheckedUpdateWithoutOrderItemsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type OrderItemCreateWithoutProductInput = {
    id?: string
    size: string
    quantity: number
    priceAtBuy: number
    order: OrderCreateNestedOneWithoutItemsInput
  }

  export type OrderItemUncheckedCreateWithoutProductInput = {
    id?: string
    orderId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type OrderItemCreateOrConnectWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput>
  }

  export type OrderItemCreateManyProductInputEnvelope = {
    data: OrderItemCreateManyProductInput | OrderItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type ProductSizeCreateWithoutProductInput = {
    id?: string
    size: string
  }

  export type ProductSizeUncheckedCreateWithoutProductInput = {
    id?: string
    size: string
  }

  export type ProductSizeCreateOrConnectWithoutProductInput = {
    where: ProductSizeWhereUniqueInput
    create: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput>
  }

  export type ProductSizeCreateManyProductInputEnvelope = {
    data: ProductSizeCreateManyProductInput | ProductSizeCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type SizeGuideCreateWithoutProductsInput = {
    id?: string
    name: string
    description?: string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SizeGuideUncheckedCreateWithoutProductsInput = {
    id?: string
    name: string
    description?: string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SizeGuideCreateOrConnectWithoutProductsInput = {
    where: SizeGuideWhereUniqueInput
    create: XOR<SizeGuideCreateWithoutProductsInput, SizeGuideUncheckedCreateWithoutProductsInput>
  }

  export type OrderItemUpsertWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutProductInput, OrderItemUncheckedUpdateWithoutProductInput>
    create: XOR<OrderItemCreateWithoutProductInput, OrderItemUncheckedCreateWithoutProductInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutProductInput, OrderItemUncheckedUpdateWithoutProductInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutProductInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutProductInput>
  }

  export type OrderItemScalarWhereInput = {
    AND?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    OR?: OrderItemScalarWhereInput[]
    NOT?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[]
    id?: StringFilter<"OrderItem"> | string
    orderId?: StringFilter<"OrderItem"> | string
    productId?: StringFilter<"OrderItem"> | string
    size?: StringFilter<"OrderItem"> | string
    quantity?: IntFilter<"OrderItem"> | number
    priceAtBuy?: IntFilter<"OrderItem"> | number
  }

  export type ProductSizeUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductSizeWhereUniqueInput
    update: XOR<ProductSizeUpdateWithoutProductInput, ProductSizeUncheckedUpdateWithoutProductInput>
    create: XOR<ProductSizeCreateWithoutProductInput, ProductSizeUncheckedCreateWithoutProductInput>
  }

  export type ProductSizeUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductSizeWhereUniqueInput
    data: XOR<ProductSizeUpdateWithoutProductInput, ProductSizeUncheckedUpdateWithoutProductInput>
  }

  export type ProductSizeUpdateManyWithWhereWithoutProductInput = {
    where: ProductSizeScalarWhereInput
    data: XOR<ProductSizeUpdateManyMutationInput, ProductSizeUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductSizeScalarWhereInput = {
    AND?: ProductSizeScalarWhereInput | ProductSizeScalarWhereInput[]
    OR?: ProductSizeScalarWhereInput[]
    NOT?: ProductSizeScalarWhereInput | ProductSizeScalarWhereInput[]
    id?: StringFilter<"ProductSize"> | string
    productId?: StringFilter<"ProductSize"> | string
    size?: StringFilter<"ProductSize"> | string
  }

  export type SizeGuideUpsertWithoutProductsInput = {
    update: XOR<SizeGuideUpdateWithoutProductsInput, SizeGuideUncheckedUpdateWithoutProductsInput>
    create: XOR<SizeGuideCreateWithoutProductsInput, SizeGuideUncheckedCreateWithoutProductsInput>
    where?: SizeGuideWhereInput
  }

  export type SizeGuideUpdateToOneWithWhereWithoutProductsInput = {
    where?: SizeGuideWhereInput
    data: XOR<SizeGuideUpdateWithoutProductsInput, SizeGuideUncheckedUpdateWithoutProductsInput>
  }

  export type SizeGuideUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SizeGuideUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    measurements?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateWithoutSizeGuideInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
    sizes?: ProductSizeCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutSizeGuideInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
    sizes?: ProductSizeUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSizeGuideInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput>
  }

  export type ProductCreateManySizeGuideInputEnvelope = {
    data: ProductCreateManySizeGuideInput | ProductCreateManySizeGuideInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutSizeGuideInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutSizeGuideInput, ProductUncheckedUpdateWithoutSizeGuideInput>
    create: XOR<ProductCreateWithoutSizeGuideInput, ProductUncheckedCreateWithoutSizeGuideInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutSizeGuideInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutSizeGuideInput, ProductUncheckedUpdateWithoutSizeGuideInput>
  }

  export type ProductUpdateManyWithWhereWithoutSizeGuideInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutSizeGuideInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: IntFilter<"Product"> | number
    category?: StringFilter<"Product"> | string
    images?: StringNullableListFilter<"Product">
    isActive?: BoolFilter<"Product"> | boolean
    isPreOrder?: BoolFilter<"Product"> | boolean
    stock?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    sizeGuideId?: StringNullableFilter<"Product"> | string | null
  }

  export type ProductCreateWithoutSizesInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    orderItems?: OrderItemCreateNestedManyWithoutProductInput
    sizeGuide?: SizeGuideCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutSizesInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    sizeGuideId?: string | null
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutSizesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutSizesInput, ProductUncheckedCreateWithoutSizesInput>
  }

  export type ProductUpsertWithoutSizesInput = {
    update: XOR<ProductUpdateWithoutSizesInput, ProductUncheckedUpdateWithoutSizesInput>
    create: XOR<ProductCreateWithoutSizesInput, ProductUncheckedCreateWithoutSizesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutSizesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutSizesInput, ProductUncheckedUpdateWithoutSizesInput>
  }

  export type ProductUpdateWithoutSizesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
    sizeGuide?: SizeGuideUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutSizesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sizeGuideId?: NullableStringFieldUpdateOperationsInput | string | null
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type OrderItemCreateWithoutOrderInput = {
    id?: string
    size: string
    quantity: number
    priceAtBuy: number
    product: ProductCreateNestedOneWithoutOrderItemsInput
  }

  export type OrderItemUncheckedCreateWithoutOrderInput = {
    id?: string
    productId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type OrderItemCreateOrConnectWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemCreateManyOrderInputEnvelope = {
    data: OrderItemCreateManyOrderInput | OrderItemCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type ShippingLogCreateWithoutOrderInput = {
    id?: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
  }

  export type ShippingLogUncheckedCreateWithoutOrderInput = {
    id?: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
  }

  export type ShippingLogCreateOrConnectWithoutOrderInput = {
    where: ShippingLogWhereUniqueInput
    create: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput>
  }

  export type ShippingLogCreateManyOrderInputEnvelope = {
    data: ShippingLogCreateManyOrderInput | ShippingLogCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type OrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    update: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderItemCreateWithoutOrderInput, OrderItemUncheckedCreateWithoutOrderInput>
  }

  export type OrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput
    data: XOR<OrderItemUpdateWithoutOrderInput, OrderItemUncheckedUpdateWithoutOrderInput>
  }

  export type OrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: OrderItemScalarWhereInput
    data: XOR<OrderItemUpdateManyMutationInput, OrderItemUncheckedUpdateManyWithoutOrderInput>
  }

  export type ShippingLogUpsertWithWhereUniqueWithoutOrderInput = {
    where: ShippingLogWhereUniqueInput
    update: XOR<ShippingLogUpdateWithoutOrderInput, ShippingLogUncheckedUpdateWithoutOrderInput>
    create: XOR<ShippingLogCreateWithoutOrderInput, ShippingLogUncheckedCreateWithoutOrderInput>
  }

  export type ShippingLogUpdateWithWhereUniqueWithoutOrderInput = {
    where: ShippingLogWhereUniqueInput
    data: XOR<ShippingLogUpdateWithoutOrderInput, ShippingLogUncheckedUpdateWithoutOrderInput>
  }

  export type ShippingLogUpdateManyWithWhereWithoutOrderInput = {
    where: ShippingLogScalarWhereInput
    data: XOR<ShippingLogUpdateManyMutationInput, ShippingLogUncheckedUpdateManyWithoutOrderInput>
  }

  export type ShippingLogScalarWhereInput = {
    AND?: ShippingLogScalarWhereInput | ShippingLogScalarWhereInput[]
    OR?: ShippingLogScalarWhereInput[]
    NOT?: ShippingLogScalarWhereInput | ShippingLogScalarWhereInput[]
    id?: StringFilter<"ShippingLog"> | string
    orderId?: StringFilter<"ShippingLog"> | string
    event?: StringFilter<"ShippingLog"> | string
    previousValue?: StringNullableFilter<"ShippingLog"> | string | null
    newValue?: StringNullableFilter<"ShippingLog"> | string | null
    note?: StringNullableFilter<"ShippingLog"> | string | null
    rawPayload?: StringNullableFilter<"ShippingLog"> | string | null
    createdAt?: DateTimeFilter<"ShippingLog"> | Date | string
  }

  export type OrderCreateWithoutShippingLogsInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    items?: OrderItemCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutShippingLogsInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutShippingLogsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutShippingLogsInput, OrderUncheckedCreateWithoutShippingLogsInput>
  }

  export type OrderUpsertWithoutShippingLogsInput = {
    update: XOR<OrderUpdateWithoutShippingLogsInput, OrderUncheckedUpdateWithoutShippingLogsInput>
    create: XOR<OrderCreateWithoutShippingLogsInput, OrderUncheckedCreateWithoutShippingLogsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutShippingLogsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutShippingLogsInput, OrderUncheckedUpdateWithoutShippingLogsInput>
  }

  export type OrderUpdateWithoutShippingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    items?: OrderItemUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutShippingLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type OrderCreateWithoutItemsInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    shippingLogs?: ShippingLogCreateNestedManyWithoutOrderInput
  }

  export type OrderUncheckedCreateWithoutItemsInput = {
    id?: string
    orderNumber: string
    customerName: string
    email: string
    phone: string
    country?: string
    province?: string | null
    stateProvince?: string | null
    shippingAddress: string
    apartment?: string | null
    district?: string | null
    city?: string
    postalCode?: string
    courier: string
    shippingCost: number
    subtotal: number
    total: number
    paymentStatus?: string
    orderStatus?: string
    paidAt?: Date | string | null
    expiredAt?: Date | string | null
    isPreOrder?: boolean
    trackingNumber?: string | null
    manualCourier?: string | null
    manualService?: string | null
    manualShippedAt?: Date | string | null
    manualTrackingNote?: string | null
    duitkuReference?: string | null
    duitkuPaymentMethod?: string | null
    duitkuPaymentUrl?: string | null
    duitkuVaNumber?: string | null
    duitkuQrString?: string | null
    duitkuFee?: string | null
    duitkuStatusMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    biteshipOrderId?: string | null
    biteshipTrackingId?: string | null
    biteshipStatus?: string | null
    shippingOrderError?: string | null
    shippingOrderStatus?: string
    shippingRetryCount?: number
    priceRegion?: string
    exchangeRate?: number | null
    shippingLogs?: ShippingLogUncheckedCreateNestedManyWithoutOrderInput
  }

  export type OrderCreateOrConnectWithoutItemsInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
  }

  export type ProductCreateWithoutOrderItemsInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    sizes?: ProductSizeCreateNestedManyWithoutProductInput
    sizeGuide?: SizeGuideCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutOrderItemsInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
    sizeGuideId?: string | null
    sizes?: ProductSizeUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutOrderItemsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
  }

  export type OrderUpsertWithoutItemsInput = {
    update: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
    create: XOR<OrderCreateWithoutItemsInput, OrderUncheckedCreateWithoutItemsInput>
    where?: OrderWhereInput
  }

  export type OrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: OrderWhereInput
    data: XOR<OrderUpdateWithoutItemsInput, OrderUncheckedUpdateWithoutItemsInput>
  }

  export type OrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    shippingLogs?: ShippingLogUpdateManyWithoutOrderNestedInput
  }

  export type OrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderNumber?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    province?: NullableStringFieldUpdateOperationsInput | string | null
    stateProvince?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: StringFieldUpdateOperationsInput | string
    apartment?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    courier?: StringFieldUpdateOperationsInput | string
    shippingCost?: IntFieldUpdateOperationsInput | number
    subtotal?: IntFieldUpdateOperationsInput | number
    total?: IntFieldUpdateOperationsInput | number
    paymentStatus?: StringFieldUpdateOperationsInput | string
    orderStatus?: StringFieldUpdateOperationsInput | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    manualCourier?: NullableStringFieldUpdateOperationsInput | string | null
    manualService?: NullableStringFieldUpdateOperationsInput | string | null
    manualShippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    manualTrackingNote?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuReference?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuPaymentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuVaNumber?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuQrString?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuFee?: NullableStringFieldUpdateOperationsInput | string | null
    duitkuStatusMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    biteshipOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipTrackingId?: NullableStringFieldUpdateOperationsInput | string | null
    biteshipStatus?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderError?: NullableStringFieldUpdateOperationsInput | string | null
    shippingOrderStatus?: StringFieldUpdateOperationsInput | string
    shippingRetryCount?: IntFieldUpdateOperationsInput | number
    priceRegion?: StringFieldUpdateOperationsInput | string
    exchangeRate?: NullableFloatFieldUpdateOperationsInput | number | null
    shippingLogs?: ShippingLogUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type ProductUpsertWithoutOrderItemsInput = {
    update: XOR<ProductUpdateWithoutOrderItemsInput, ProductUncheckedUpdateWithoutOrderItemsInput>
    create: XOR<ProductCreateWithoutOrderItemsInput, ProductUncheckedCreateWithoutOrderItemsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutOrderItemsInput, ProductUncheckedUpdateWithoutOrderItemsInput>
  }

  export type ProductUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sizes?: ProductSizeUpdateManyWithoutProductNestedInput
    sizeGuide?: SizeGuideUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sizeGuideId?: NullableStringFieldUpdateOperationsInput | string | null
    sizes?: ProductSizeUncheckedUpdateManyWithoutProductNestedInput
  }

  export type OrderItemCreateManyProductInput = {
    id?: string
    orderId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type ProductSizeCreateManyProductInput = {
    id?: string
    size: string
  }

  export type OrderItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
    order?: OrderUpdateOneRequiredWithoutItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type OrderItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type ProductSizeUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type ProductSizeUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type ProductSizeUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
  }

  export type ProductCreateManySizeGuideInput = {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    category: string
    images?: ProductCreateimagesInput | string[]
    isActive?: boolean
    isPreOrder?: boolean
    stock?: number
    createdAt?: Date | string
  }

  export type ProductUpdateWithoutSizeGuideInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput
    sizes?: ProductSizeUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutSizeGuideInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput
    sizes?: ProductSizeUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutSizeGuideInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    images?: ProductUpdateimagesInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPreOrder?: BoolFieldUpdateOperationsInput | boolean
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderItemCreateManyOrderInput = {
    id?: string
    productId: string
    size: string
    quantity: number
    priceAtBuy: number
  }

  export type ShippingLogCreateManyOrderInput = {
    id?: string
    event: string
    previousValue?: string | null
    newValue?: string | null
    note?: string | null
    rawPayload?: string | null
    createdAt?: Date | string
  }

  export type OrderItemUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput
  }

  export type OrderItemUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type OrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    size?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    priceAtBuy?: IntFieldUpdateOperationsInput | number
  }

  export type ShippingLogUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingLogUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingLogUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    previousValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    rawPayload?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}