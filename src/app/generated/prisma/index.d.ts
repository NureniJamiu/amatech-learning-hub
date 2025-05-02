
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Course
 * 
 */
export type Course = $Result.DefaultSelection<Prisma.$CoursePayload>
/**
 * Model CourseMaterial
 * 
 */
export type CourseMaterial = $Result.DefaultSelection<Prisma.$CourseMaterialPayload>
/**
 * Model PastQuestion
 * 
 */
export type PastQuestion = $Result.DefaultSelection<Prisma.$PastQuestionPayload>
/**
 * Model Bookmark
 * 
 */
export type Bookmark = $Result.DefaultSelection<Prisma.$BookmarkPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Status: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type Status = (typeof Status)[keyof typeof Status]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.course`: Exposes CRUD operations for the **Course** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courses
    * const courses = await prisma.course.findMany()
    * ```
    */
  get course(): Prisma.CourseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courseMaterial`: Exposes CRUD operations for the **CourseMaterial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CourseMaterials
    * const courseMaterials = await prisma.courseMaterial.findMany()
    * ```
    */
  get courseMaterial(): Prisma.CourseMaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pastQuestion`: Exposes CRUD operations for the **PastQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PastQuestions
    * const pastQuestions = await prisma.pastQuestion.findMany()
    * ```
    */
  get pastQuestion(): Prisma.PastQuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmark`: Exposes CRUD operations for the **Bookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookmarks
    * const bookmarks = await prisma.bookmark.findMany()
    * ```
    */
  get bookmark(): Prisma.BookmarkDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
      (Without<T, U> & U) | (Without<U, T> & T)
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
    User: 'User',
    Course: 'Course',
    CourseMaterial: 'CourseMaterial',
    PastQuestion: 'PastQuestion',
    Bookmark: 'Bookmark'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "course" | "courseMaterial" | "pastQuestion" | "bookmark"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Course: {
        payload: Prisma.$CoursePayload<ExtArgs>
        fields: Prisma.CourseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findFirst: {
            args: Prisma.CourseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          findMany: {
            args: Prisma.CourseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          create: {
            args: Prisma.CourseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          createMany: {
            args: Prisma.CourseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          delete: {
            args: Prisma.CourseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          update: {
            args: Prisma.CourseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          deleteMany: {
            args: Prisma.CourseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>[]
          }
          upsert: {
            args: Prisma.CourseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoursePayload>
          }
          aggregate: {
            args: Prisma.CourseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourse>
          }
          groupBy: {
            args: Prisma.CourseGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseCountArgs<ExtArgs>
            result: $Utils.Optional<CourseCountAggregateOutputType> | number
          }
        }
      }
      CourseMaterial: {
        payload: Prisma.$CourseMaterialPayload<ExtArgs>
        fields: Prisma.CourseMaterialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseMaterialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseMaterialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          findFirst: {
            args: Prisma.CourseMaterialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseMaterialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          findMany: {
            args: Prisma.CourseMaterialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[]
          }
          create: {
            args: Prisma.CourseMaterialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          createMany: {
            args: Prisma.CourseMaterialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseMaterialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[]
          }
          delete: {
            args: Prisma.CourseMaterialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          update: {
            args: Prisma.CourseMaterialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          deleteMany: {
            args: Prisma.CourseMaterialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseMaterialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseMaterialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>[]
          }
          upsert: {
            args: Prisma.CourseMaterialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseMaterialPayload>
          }
          aggregate: {
            args: Prisma.CourseMaterialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourseMaterial>
          }
          groupBy: {
            args: Prisma.CourseMaterialGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseMaterialGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseMaterialCountArgs<ExtArgs>
            result: $Utils.Optional<CourseMaterialCountAggregateOutputType> | number
          }
        }
      }
      PastQuestion: {
        payload: Prisma.$PastQuestionPayload<ExtArgs>
        fields: Prisma.PastQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PastQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PastQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          findFirst: {
            args: Prisma.PastQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PastQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          findMany: {
            args: Prisma.PastQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>[]
          }
          create: {
            args: Prisma.PastQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          createMany: {
            args: Prisma.PastQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PastQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>[]
          }
          delete: {
            args: Prisma.PastQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          update: {
            args: Prisma.PastQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          deleteMany: {
            args: Prisma.PastQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PastQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PastQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>[]
          }
          upsert: {
            args: Prisma.PastQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PastQuestionPayload>
          }
          aggregate: {
            args: Prisma.PastQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePastQuestion>
          }
          groupBy: {
            args: Prisma.PastQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PastQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PastQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<PastQuestionCountAggregateOutputType> | number
          }
        }
      }
      Bookmark: {
        payload: Prisma.$BookmarkPayload<ExtArgs>
        fields: Prisma.BookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findFirst: {
            args: Prisma.BookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findMany: {
            args: Prisma.BookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          create: {
            args: Prisma.BookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          createMany: {
            args: Prisma.BookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          delete: {
            args: Prisma.BookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          update: {
            args: Prisma.BookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          aggregate: {
            args: Prisma.BookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmark>
          }
          groupBy: {
            args: Prisma.BookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    course?: CourseOmit
    courseMaterial?: CourseMaterialOmit
    pastQuestion?: PastQuestionOmit
    bookmark?: BookmarkOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    CourseMaterial: number
    pastQuestion: number
    Bookmark: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CourseMaterial?: boolean | UserCountOutputTypeCountCourseMaterialArgs
    pastQuestion?: boolean | UserCountOutputTypeCountPastQuestionArgs
    Bookmark?: boolean | UserCountOutputTypeCountBookmarkArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCourseMaterialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseMaterialWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPastQuestionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PastQuestionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }


  /**
   * Count Type CourseCountOutputType
   */

  export type CourseCountOutputType = {
    CourseMaterial: number
    pastQuestion: number
    Bookmark: number
  }

  export type CourseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CourseMaterial?: boolean | CourseCountOutputTypeCountCourseMaterialArgs
    pastQuestion?: boolean | CourseCountOutputTypeCountPastQuestionArgs
    Bookmark?: boolean | CourseCountOutputTypeCountBookmarkArgs
  }

  // Custom InputTypes
  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseCountOutputType
     */
    select?: CourseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountCourseMaterialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseMaterialWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountPastQuestionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PastQuestionWhereInput
  }

  /**
   * CourseCountOutputType without action
   */
  export type CourseCountOutputTypeCountBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firstname: string | null
    lastname: string | null
    level: string | null
    email: string | null
    role: $Enums.Role | null
    password: string | null
    profileImg: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firstname: string | null
    lastname: string | null
    level: string | null
    email: string | null
    role: $Enums.Role | null
    password: string | null
    profileImg: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firstname: number
    lastname: number
    level: number
    email: number
    role: number
    password: number
    profileImg: number
    bio: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firstname?: true
    lastname?: true
    level?: true
    email?: true
    role?: true
    password?: true
    profileImg?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firstname?: true
    lastname?: true
    level?: true
    email?: true
    role?: true
    password?: true
    profileImg?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firstname?: true
    lastname?: true
    level?: true
    email?: true
    role?: true
    password?: true
    profileImg?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firstname: string
    lastname: string
    level: string
    email: string
    role: $Enums.Role
    password: string
    profileImg: string | null
    bio: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstname?: boolean
    lastname?: boolean
    level?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    profileImg?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    CourseMaterial?: boolean | User$CourseMaterialArgs<ExtArgs>
    pastQuestion?: boolean | User$pastQuestionArgs<ExtArgs>
    Bookmark?: boolean | User$BookmarkArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstname?: boolean
    lastname?: boolean
    level?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    profileImg?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstname?: boolean
    lastname?: boolean
    level?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    profileImg?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firstname?: boolean
    lastname?: boolean
    level?: boolean
    email?: boolean
    role?: boolean
    password?: boolean
    profileImg?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstname" | "lastname" | "level" | "email" | "role" | "password" | "profileImg" | "bio" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CourseMaterial?: boolean | User$CourseMaterialArgs<ExtArgs>
    pastQuestion?: boolean | User$pastQuestionArgs<ExtArgs>
    Bookmark?: boolean | User$BookmarkArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      CourseMaterial: Prisma.$CourseMaterialPayload<ExtArgs>[]
      pastQuestion: Prisma.$PastQuestionPayload<ExtArgs>[]
      Bookmark: Prisma.$BookmarkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstname: string
      lastname: string
      level: string
      email: string
      role: $Enums.Role
      password: string
      profileImg: string | null
      bio: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    CourseMaterial<T extends User$CourseMaterialArgs<ExtArgs> = {}>(args?: Subset<T, User$CourseMaterialArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pastQuestion<T extends User$pastQuestionArgs<ExtArgs> = {}>(args?: Subset<T, User$pastQuestionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Bookmark<T extends User$BookmarkArgs<ExtArgs> = {}>(args?: Subset<T, User$BookmarkArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firstname: FieldRef<"User", 'String'>
    readonly lastname: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly password: FieldRef<"User", 'String'>
    readonly profileImg: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.CourseMaterial
   */
  export type User$CourseMaterialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    where?: CourseMaterialWhereInput
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    cursor?: CourseMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CourseMaterialScalarFieldEnum | CourseMaterialScalarFieldEnum[]
  }

  /**
   * User.pastQuestion
   */
  export type User$pastQuestionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    where?: PastQuestionWhereInput
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    cursor?: PastQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PastQuestionScalarFieldEnum | PastQuestionScalarFieldEnum[]
  }

  /**
   * User.Bookmark
   */
  export type User$BookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Course
   */

  export type AggregateCourse = {
    _count: CourseCountAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  export type CourseMinAggregateOutputType = {
    id: string | null
    courseCode: string | null
    courseTitle: string | null
    level: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourseMaxAggregateOutputType = {
    id: string | null
    courseCode: string | null
    courseTitle: string | null
    level: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourseCountAggregateOutputType = {
    id: number
    courseCode: number
    courseTitle: number
    level: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CourseMinAggregateInputType = {
    id?: true
    courseCode?: true
    courseTitle?: true
    level?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourseMaxAggregateInputType = {
    id?: true
    courseCode?: true
    courseTitle?: true
    level?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourseCountAggregateInputType = {
    id?: true
    courseCode?: true
    courseTitle?: true
    level?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CourseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Course to aggregate.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Courses
    **/
    _count?: true | CourseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseMaxAggregateInputType
  }

  export type GetCourseAggregateType<T extends CourseAggregateArgs> = {
        [P in keyof T & keyof AggregateCourse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourse[P]>
      : GetScalarType<T[P], AggregateCourse[P]>
  }




  export type CourseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseWhereInput
    orderBy?: CourseOrderByWithAggregationInput | CourseOrderByWithAggregationInput[]
    by: CourseScalarFieldEnum[] | CourseScalarFieldEnum
    having?: CourseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseCountAggregateInputType | true
    _min?: CourseMinAggregateInputType
    _max?: CourseMaxAggregateInputType
  }

  export type CourseGroupByOutputType = {
    id: string
    courseCode: string
    courseTitle: string
    level: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: CourseCountAggregateOutputType | null
    _min: CourseMinAggregateOutputType | null
    _max: CourseMaxAggregateOutputType | null
  }

  type GetCourseGroupByPayload<T extends CourseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseGroupByOutputType[P]>
            : GetScalarType<T[P], CourseGroupByOutputType[P]>
        }
      >
    >


  export type CourseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseCode?: boolean
    courseTitle?: boolean
    level?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    CourseMaterial?: boolean | Course$CourseMaterialArgs<ExtArgs>
    pastQuestion?: boolean | Course$pastQuestionArgs<ExtArgs>
    Bookmark?: boolean | Course$BookmarkArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["course"]>

  export type CourseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseCode?: boolean
    courseTitle?: boolean
    level?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseCode?: boolean
    courseTitle?: boolean
    level?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course"]>

  export type CourseSelectScalar = {
    id?: boolean
    courseCode?: boolean
    courseTitle?: boolean
    level?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CourseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "courseCode" | "courseTitle" | "level" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["course"]>
  export type CourseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    CourseMaterial?: boolean | Course$CourseMaterialArgs<ExtArgs>
    pastQuestion?: boolean | Course$pastQuestionArgs<ExtArgs>
    Bookmark?: boolean | Course$BookmarkArgs<ExtArgs>
    _count?: boolean | CourseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CourseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CourseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CoursePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Course"
    objects: {
      CourseMaterial: Prisma.$CourseMaterialPayload<ExtArgs>[]
      pastQuestion: Prisma.$PastQuestionPayload<ExtArgs>[]
      Bookmark: Prisma.$BookmarkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      courseCode: string
      courseTitle: string
      level: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["course"]>
    composites: {}
  }

  type CourseGetPayload<S extends boolean | null | undefined | CourseDefaultArgs> = $Result.GetResult<Prisma.$CoursePayload, S>

  type CourseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseCountAggregateInputType | true
    }

  export interface CourseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Course'], meta: { name: 'Course' } }
    /**
     * Find zero or one Course that matches the filter.
     * @param {CourseFindUniqueArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseFindUniqueArgs>(args: SelectSubset<T, CourseFindUniqueArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Course that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseFindUniqueOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseFindFirstArgs>(args?: SelectSubset<T, CourseFindFirstArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindFirstOrThrowArgs} args - Arguments to find a Course
     * @example
     * // Get one Course
     * const course = await prisma.course.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courses
     * const courses = await prisma.course.findMany()
     * 
     * // Get first 10 Courses
     * const courses = await prisma.course.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseWithIdOnly = await prisma.course.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseFindManyArgs>(args?: SelectSubset<T, CourseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Course.
     * @param {CourseCreateArgs} args - Arguments to create a Course.
     * @example
     * // Create one Course
     * const Course = await prisma.course.create({
     *   data: {
     *     // ... data to create a Course
     *   }
     * })
     * 
     */
    create<T extends CourseCreateArgs>(args: SelectSubset<T, CourseCreateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Courses.
     * @param {CourseCreateManyArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseCreateManyArgs>(args?: SelectSubset<T, CourseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courses and returns the data saved in the database.
     * @param {CourseCreateManyAndReturnArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const course = await prisma.course.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Course.
     * @param {CourseDeleteArgs} args - Arguments to delete one Course.
     * @example
     * // Delete one Course
     * const Course = await prisma.course.delete({
     *   where: {
     *     // ... filter to delete one Course
     *   }
     * })
     * 
     */
    delete<T extends CourseDeleteArgs>(args: SelectSubset<T, CourseDeleteArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Course.
     * @param {CourseUpdateArgs} args - Arguments to update one Course.
     * @example
     * // Update one Course
     * const course = await prisma.course.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseUpdateArgs>(args: SelectSubset<T, CourseUpdateArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Courses.
     * @param {CourseDeleteManyArgs} args - Arguments to filter Courses to delete.
     * @example
     * // Delete a few Courses
     * const { count } = await prisma.course.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseDeleteManyArgs>(args?: SelectSubset<T, CourseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseUpdateManyArgs>(args: SelectSubset<T, CourseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses and returns the data updated in the database.
     * @param {CourseUpdateManyAndReturnArgs} args - Arguments to update many Courses.
     * @example
     * // Update many Courses
     * const course = await prisma.course.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Courses and only return the `id`
     * const courseWithIdOnly = await prisma.course.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Course.
     * @param {CourseUpsertArgs} args - Arguments to update or create a Course.
     * @example
     * // Update or create a Course
     * const course = await prisma.course.upsert({
     *   create: {
     *     // ... data to create a Course
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Course we want to update
     *   }
     * })
     */
    upsert<T extends CourseUpsertArgs>(args: SelectSubset<T, CourseUpsertArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseCountArgs} args - Arguments to filter Courses to count.
     * @example
     * // Count the number of Courses
     * const count = await prisma.course.count({
     *   where: {
     *     // ... the filter for the Courses we want to count
     *   }
     * })
    **/
    count<T extends CourseCountArgs>(
      args?: Subset<T, CourseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseAggregateArgs>(args: Subset<T, CourseAggregateArgs>): Prisma.PrismaPromise<GetCourseAggregateType<T>>

    /**
     * Group by Course.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseGroupByArgs} args - Group by arguments.
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
      T extends CourseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseGroupByArgs['orderBy'] }
        : { orderBy?: CourseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Course model
   */
  readonly fields: CourseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Course.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    CourseMaterial<T extends Course$CourseMaterialArgs<ExtArgs> = {}>(args?: Subset<T, Course$CourseMaterialArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pastQuestion<T extends Course$pastQuestionArgs<ExtArgs> = {}>(args?: Subset<T, Course$pastQuestionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Bookmark<T extends Course$BookmarkArgs<ExtArgs> = {}>(args?: Subset<T, Course$BookmarkArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Course model
   */
  interface CourseFieldRefs {
    readonly id: FieldRef<"Course", 'String'>
    readonly courseCode: FieldRef<"Course", 'String'>
    readonly courseTitle: FieldRef<"Course", 'String'>
    readonly level: FieldRef<"Course", 'String'>
    readonly description: FieldRef<"Course", 'String'>
    readonly createdAt: FieldRef<"Course", 'DateTime'>
    readonly updatedAt: FieldRef<"Course", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Course findUnique
   */
  export type CourseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findUniqueOrThrow
   */
  export type CourseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course findFirst
   */
  export type CourseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findFirstOrThrow
   */
  export type CourseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Course to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Courses.
     */
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course findMany
   */
  export type CourseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter, which Courses to fetch.
     */
    where?: CourseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Courses to fetch.
     */
    orderBy?: CourseOrderByWithRelationInput | CourseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Courses.
     */
    cursor?: CourseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Courses.
     */
    skip?: number
    distinct?: CourseScalarFieldEnum | CourseScalarFieldEnum[]
  }

  /**
   * Course create
   */
  export type CourseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to create a Course.
     */
    data: XOR<CourseCreateInput, CourseUncheckedCreateInput>
  }

  /**
   * Course createMany
   */
  export type CourseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Course createManyAndReturn
   */
  export type CourseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to create many Courses.
     */
    data: CourseCreateManyInput | CourseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Course update
   */
  export type CourseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The data needed to update a Course.
     */
    data: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
    /**
     * Choose, which Course to update.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course updateMany
   */
  export type CourseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course updateManyAndReturn
   */
  export type CourseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * The data used to update Courses.
     */
    data: XOR<CourseUpdateManyMutationInput, CourseUncheckedUpdateManyInput>
    /**
     * Filter which Courses to update
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to update.
     */
    limit?: number
  }

  /**
   * Course upsert
   */
  export type CourseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * The filter to search for the Course to update in case it exists.
     */
    where: CourseWhereUniqueInput
    /**
     * In case the Course found by the `where` argument doesn't exist, create a new Course with this data.
     */
    create: XOR<CourseCreateInput, CourseUncheckedCreateInput>
    /**
     * In case the Course was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseUpdateInput, CourseUncheckedUpdateInput>
  }

  /**
   * Course delete
   */
  export type CourseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
    /**
     * Filter which Course to delete.
     */
    where: CourseWhereUniqueInput
  }

  /**
   * Course deleteMany
   */
  export type CourseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Courses to delete
     */
    where?: CourseWhereInput
    /**
     * Limit how many Courses to delete.
     */
    limit?: number
  }

  /**
   * Course.CourseMaterial
   */
  export type Course$CourseMaterialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    where?: CourseMaterialWhereInput
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    cursor?: CourseMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CourseMaterialScalarFieldEnum | CourseMaterialScalarFieldEnum[]
  }

  /**
   * Course.pastQuestion
   */
  export type Course$pastQuestionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    where?: PastQuestionWhereInput
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    cursor?: PastQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PastQuestionScalarFieldEnum | PastQuestionScalarFieldEnum[]
  }

  /**
   * Course.Bookmark
   */
  export type Course$BookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Course without action
   */
  export type CourseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: CourseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Course
     */
    omit?: CourseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseInclude<ExtArgs> | null
  }


  /**
   * Model CourseMaterial
   */

  export type AggregateCourseMaterial = {
    _count: CourseMaterialCountAggregateOutputType | null
    _min: CourseMaterialMinAggregateOutputType | null
    _max: CourseMaterialMaxAggregateOutputType | null
  }

  export type CourseMaterialMinAggregateOutputType = {
    id: string | null
    fileUrl: string | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type CourseMaterialMaxAggregateOutputType = {
    id: string | null
    fileUrl: string | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type CourseMaterialCountAggregateOutputType = {
    id: number
    fileUrl: number
    status: number
    createdAt: number
    updatedAt: number
    userId: number
    courseId: number
    _all: number
  }


  export type CourseMaterialMinAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type CourseMaterialMaxAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type CourseMaterialCountAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    _all?: true
  }

  export type CourseMaterialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseMaterial to aggregate.
     */
    where?: CourseMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseMaterials to fetch.
     */
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CourseMaterials
    **/
    _count?: true | CourseMaterialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseMaterialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseMaterialMaxAggregateInputType
  }

  export type GetCourseMaterialAggregateType<T extends CourseMaterialAggregateArgs> = {
        [P in keyof T & keyof AggregateCourseMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourseMaterial[P]>
      : GetScalarType<T[P], AggregateCourseMaterial[P]>
  }




  export type CourseMaterialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseMaterialWhereInput
    orderBy?: CourseMaterialOrderByWithAggregationInput | CourseMaterialOrderByWithAggregationInput[]
    by: CourseMaterialScalarFieldEnum[] | CourseMaterialScalarFieldEnum
    having?: CourseMaterialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseMaterialCountAggregateInputType | true
    _min?: CourseMaterialMinAggregateInputType
    _max?: CourseMaterialMaxAggregateInputType
  }

  export type CourseMaterialGroupByOutputType = {
    id: string
    fileUrl: string
    status: $Enums.Status
    createdAt: Date
    updatedAt: Date
    userId: string
    courseId: string
    _count: CourseMaterialCountAggregateOutputType | null
    _min: CourseMaterialMinAggregateOutputType | null
    _max: CourseMaterialMaxAggregateOutputType | null
  }

  type GetCourseMaterialGroupByPayload<T extends CourseMaterialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseMaterialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseMaterialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseMaterialGroupByOutputType[P]>
            : GetScalarType<T[P], CourseMaterialGroupByOutputType[P]>
        }
      >
    >


  export type CourseMaterialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseMaterial"]>

  export type CourseMaterialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseMaterial"]>

  export type CourseMaterialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseMaterial"]>

  export type CourseMaterialSelectScalar = {
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
  }

  export type CourseMaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileUrl" | "status" | "createdAt" | "updatedAt" | "userId" | "courseId", ExtArgs["result"]["courseMaterial"]>
  export type CourseMaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type CourseMaterialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type CourseMaterialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploaderID?: boolean | UserDefaultArgs<ExtArgs>
    courseID?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $CourseMaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CourseMaterial"
    objects: {
      uploaderID: Prisma.$UserPayload<ExtArgs>
      courseID: Prisma.$CoursePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileUrl: string
      status: $Enums.Status
      createdAt: Date
      updatedAt: Date
      userId: string
      courseId: string
    }, ExtArgs["result"]["courseMaterial"]>
    composites: {}
  }

  type CourseMaterialGetPayload<S extends boolean | null | undefined | CourseMaterialDefaultArgs> = $Result.GetResult<Prisma.$CourseMaterialPayload, S>

  type CourseMaterialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseMaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseMaterialCountAggregateInputType | true
    }

  export interface CourseMaterialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CourseMaterial'], meta: { name: 'CourseMaterial' } }
    /**
     * Find zero or one CourseMaterial that matches the filter.
     * @param {CourseMaterialFindUniqueArgs} args - Arguments to find a CourseMaterial
     * @example
     * // Get one CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseMaterialFindUniqueArgs>(args: SelectSubset<T, CourseMaterialFindUniqueArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CourseMaterial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseMaterialFindUniqueOrThrowArgs} args - Arguments to find a CourseMaterial
     * @example
     * // Get one CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseMaterialFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseMaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseMaterial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialFindFirstArgs} args - Arguments to find a CourseMaterial
     * @example
     * // Get one CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseMaterialFindFirstArgs>(args?: SelectSubset<T, CourseMaterialFindFirstArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseMaterial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialFindFirstOrThrowArgs} args - Arguments to find a CourseMaterial
     * @example
     * // Get one CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseMaterialFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseMaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CourseMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourseMaterials
     * const courseMaterials = await prisma.courseMaterial.findMany()
     * 
     * // Get first 10 CourseMaterials
     * const courseMaterials = await prisma.courseMaterial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseMaterialWithIdOnly = await prisma.courseMaterial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseMaterialFindManyArgs>(args?: SelectSubset<T, CourseMaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CourseMaterial.
     * @param {CourseMaterialCreateArgs} args - Arguments to create a CourseMaterial.
     * @example
     * // Create one CourseMaterial
     * const CourseMaterial = await prisma.courseMaterial.create({
     *   data: {
     *     // ... data to create a CourseMaterial
     *   }
     * })
     * 
     */
    create<T extends CourseMaterialCreateArgs>(args: SelectSubset<T, CourseMaterialCreateArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CourseMaterials.
     * @param {CourseMaterialCreateManyArgs} args - Arguments to create many CourseMaterials.
     * @example
     * // Create many CourseMaterials
     * const courseMaterial = await prisma.courseMaterial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseMaterialCreateManyArgs>(args?: SelectSubset<T, CourseMaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CourseMaterials and returns the data saved in the database.
     * @param {CourseMaterialCreateManyAndReturnArgs} args - Arguments to create many CourseMaterials.
     * @example
     * // Create many CourseMaterials
     * const courseMaterial = await prisma.courseMaterial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CourseMaterials and only return the `id`
     * const courseMaterialWithIdOnly = await prisma.courseMaterial.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseMaterialCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseMaterialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CourseMaterial.
     * @param {CourseMaterialDeleteArgs} args - Arguments to delete one CourseMaterial.
     * @example
     * // Delete one CourseMaterial
     * const CourseMaterial = await prisma.courseMaterial.delete({
     *   where: {
     *     // ... filter to delete one CourseMaterial
     *   }
     * })
     * 
     */
    delete<T extends CourseMaterialDeleteArgs>(args: SelectSubset<T, CourseMaterialDeleteArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CourseMaterial.
     * @param {CourseMaterialUpdateArgs} args - Arguments to update one CourseMaterial.
     * @example
     * // Update one CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseMaterialUpdateArgs>(args: SelectSubset<T, CourseMaterialUpdateArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CourseMaterials.
     * @param {CourseMaterialDeleteManyArgs} args - Arguments to filter CourseMaterials to delete.
     * @example
     * // Delete a few CourseMaterials
     * const { count } = await prisma.courseMaterial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseMaterialDeleteManyArgs>(args?: SelectSubset<T, CourseMaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourseMaterials
     * const courseMaterial = await prisma.courseMaterial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseMaterialUpdateManyArgs>(args: SelectSubset<T, CourseMaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseMaterials and returns the data updated in the database.
     * @param {CourseMaterialUpdateManyAndReturnArgs} args - Arguments to update many CourseMaterials.
     * @example
     * // Update many CourseMaterials
     * const courseMaterial = await prisma.courseMaterial.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CourseMaterials and only return the `id`
     * const courseMaterialWithIdOnly = await prisma.courseMaterial.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseMaterialUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseMaterialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CourseMaterial.
     * @param {CourseMaterialUpsertArgs} args - Arguments to update or create a CourseMaterial.
     * @example
     * // Update or create a CourseMaterial
     * const courseMaterial = await prisma.courseMaterial.upsert({
     *   create: {
     *     // ... data to create a CourseMaterial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourseMaterial we want to update
     *   }
     * })
     */
    upsert<T extends CourseMaterialUpsertArgs>(args: SelectSubset<T, CourseMaterialUpsertArgs<ExtArgs>>): Prisma__CourseMaterialClient<$Result.GetResult<Prisma.$CourseMaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CourseMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialCountArgs} args - Arguments to filter CourseMaterials to count.
     * @example
     * // Count the number of CourseMaterials
     * const count = await prisma.courseMaterial.count({
     *   where: {
     *     // ... the filter for the CourseMaterials we want to count
     *   }
     * })
    **/
    count<T extends CourseMaterialCountArgs>(
      args?: Subset<T, CourseMaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseMaterialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CourseMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseMaterialAggregateArgs>(args: Subset<T, CourseMaterialAggregateArgs>): Prisma.PrismaPromise<GetCourseMaterialAggregateType<T>>

    /**
     * Group by CourseMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseMaterialGroupByArgs} args - Group by arguments.
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
      T extends CourseMaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseMaterialGroupByArgs['orderBy'] }
        : { orderBy?: CourseMaterialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseMaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CourseMaterial model
   */
  readonly fields: CourseMaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CourseMaterial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseMaterialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uploaderID<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    courseID<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CourseMaterial model
   */
  interface CourseMaterialFieldRefs {
    readonly id: FieldRef<"CourseMaterial", 'String'>
    readonly fileUrl: FieldRef<"CourseMaterial", 'String'>
    readonly status: FieldRef<"CourseMaterial", 'Status'>
    readonly createdAt: FieldRef<"CourseMaterial", 'DateTime'>
    readonly updatedAt: FieldRef<"CourseMaterial", 'DateTime'>
    readonly userId: FieldRef<"CourseMaterial", 'String'>
    readonly courseId: FieldRef<"CourseMaterial", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CourseMaterial findUnique
   */
  export type CourseMaterialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter, which CourseMaterial to fetch.
     */
    where: CourseMaterialWhereUniqueInput
  }

  /**
   * CourseMaterial findUniqueOrThrow
   */
  export type CourseMaterialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter, which CourseMaterial to fetch.
     */
    where: CourseMaterialWhereUniqueInput
  }

  /**
   * CourseMaterial findFirst
   */
  export type CourseMaterialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter, which CourseMaterial to fetch.
     */
    where?: CourseMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseMaterials to fetch.
     */
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseMaterials.
     */
    cursor?: CourseMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseMaterials.
     */
    distinct?: CourseMaterialScalarFieldEnum | CourseMaterialScalarFieldEnum[]
  }

  /**
   * CourseMaterial findFirstOrThrow
   */
  export type CourseMaterialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter, which CourseMaterial to fetch.
     */
    where?: CourseMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseMaterials to fetch.
     */
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseMaterials.
     */
    cursor?: CourseMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseMaterials.
     */
    distinct?: CourseMaterialScalarFieldEnum | CourseMaterialScalarFieldEnum[]
  }

  /**
   * CourseMaterial findMany
   */
  export type CourseMaterialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter, which CourseMaterials to fetch.
     */
    where?: CourseMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseMaterials to fetch.
     */
    orderBy?: CourseMaterialOrderByWithRelationInput | CourseMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CourseMaterials.
     */
    cursor?: CourseMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseMaterials.
     */
    skip?: number
    distinct?: CourseMaterialScalarFieldEnum | CourseMaterialScalarFieldEnum[]
  }

  /**
   * CourseMaterial create
   */
  export type CourseMaterialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * The data needed to create a CourseMaterial.
     */
    data: XOR<CourseMaterialCreateInput, CourseMaterialUncheckedCreateInput>
  }

  /**
   * CourseMaterial createMany
   */
  export type CourseMaterialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourseMaterials.
     */
    data: CourseMaterialCreateManyInput | CourseMaterialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CourseMaterial createManyAndReturn
   */
  export type CourseMaterialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * The data used to create many CourseMaterials.
     */
    data: CourseMaterialCreateManyInput | CourseMaterialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseMaterial update
   */
  export type CourseMaterialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * The data needed to update a CourseMaterial.
     */
    data: XOR<CourseMaterialUpdateInput, CourseMaterialUncheckedUpdateInput>
    /**
     * Choose, which CourseMaterial to update.
     */
    where: CourseMaterialWhereUniqueInput
  }

  /**
   * CourseMaterial updateMany
   */
  export type CourseMaterialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CourseMaterials.
     */
    data: XOR<CourseMaterialUpdateManyMutationInput, CourseMaterialUncheckedUpdateManyInput>
    /**
     * Filter which CourseMaterials to update
     */
    where?: CourseMaterialWhereInput
    /**
     * Limit how many CourseMaterials to update.
     */
    limit?: number
  }

  /**
   * CourseMaterial updateManyAndReturn
   */
  export type CourseMaterialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * The data used to update CourseMaterials.
     */
    data: XOR<CourseMaterialUpdateManyMutationInput, CourseMaterialUncheckedUpdateManyInput>
    /**
     * Filter which CourseMaterials to update
     */
    where?: CourseMaterialWhereInput
    /**
     * Limit how many CourseMaterials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseMaterial upsert
   */
  export type CourseMaterialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * The filter to search for the CourseMaterial to update in case it exists.
     */
    where: CourseMaterialWhereUniqueInput
    /**
     * In case the CourseMaterial found by the `where` argument doesn't exist, create a new CourseMaterial with this data.
     */
    create: XOR<CourseMaterialCreateInput, CourseMaterialUncheckedCreateInput>
    /**
     * In case the CourseMaterial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseMaterialUpdateInput, CourseMaterialUncheckedUpdateInput>
  }

  /**
   * CourseMaterial delete
   */
  export type CourseMaterialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
    /**
     * Filter which CourseMaterial to delete.
     */
    where: CourseMaterialWhereUniqueInput
  }

  /**
   * CourseMaterial deleteMany
   */
  export type CourseMaterialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseMaterials to delete
     */
    where?: CourseMaterialWhereInput
    /**
     * Limit how many CourseMaterials to delete.
     */
    limit?: number
  }

  /**
   * CourseMaterial without action
   */
  export type CourseMaterialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseMaterial
     */
    select?: CourseMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseMaterial
     */
    omit?: CourseMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseMaterialInclude<ExtArgs> | null
  }


  /**
   * Model PastQuestion
   */

  export type AggregatePastQuestion = {
    _count: PastQuestionCountAggregateOutputType | null
    _min: PastQuestionMinAggregateOutputType | null
    _max: PastQuestionMaxAggregateOutputType | null
  }

  export type PastQuestionMinAggregateOutputType = {
    id: string | null
    fileUrl: string | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type PastQuestionMaxAggregateOutputType = {
    id: string | null
    fileUrl: string | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type PastQuestionCountAggregateOutputType = {
    id: number
    fileUrl: number
    status: number
    createdAt: number
    updatedAt: number
    userId: number
    courseId: number
    _all: number
  }


  export type PastQuestionMinAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type PastQuestionMaxAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type PastQuestionCountAggregateInputType = {
    id?: true
    fileUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    _all?: true
  }

  export type PastQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PastQuestion to aggregate.
     */
    where?: PastQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PastQuestions to fetch.
     */
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PastQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PastQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PastQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PastQuestions
    **/
    _count?: true | PastQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PastQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PastQuestionMaxAggregateInputType
  }

  export type GetPastQuestionAggregateType<T extends PastQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregatePastQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePastQuestion[P]>
      : GetScalarType<T[P], AggregatePastQuestion[P]>
  }




  export type PastQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PastQuestionWhereInput
    orderBy?: PastQuestionOrderByWithAggregationInput | PastQuestionOrderByWithAggregationInput[]
    by: PastQuestionScalarFieldEnum[] | PastQuestionScalarFieldEnum
    having?: PastQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PastQuestionCountAggregateInputType | true
    _min?: PastQuestionMinAggregateInputType
    _max?: PastQuestionMaxAggregateInputType
  }

  export type PastQuestionGroupByOutputType = {
    id: string
    fileUrl: string
    status: $Enums.Status
    createdAt: Date
    updatedAt: Date
    userId: string
    courseId: string
    _count: PastQuestionCountAggregateOutputType | null
    _min: PastQuestionMinAggregateOutputType | null
    _max: PastQuestionMaxAggregateOutputType | null
  }

  type GetPastQuestionGroupByPayload<T extends PastQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PastQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PastQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PastQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], PastQuestionGroupByOutputType[P]>
        }
      >
    >


  export type PastQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pastQuestion"]>

  export type PastQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pastQuestion"]>

  export type PastQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pastQuestion"]>

  export type PastQuestionSelectScalar = {
    id?: boolean
    fileUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
  }

  export type PastQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileUrl" | "status" | "createdAt" | "updatedAt" | "userId" | "courseId", ExtArgs["result"]["pastQuestion"]>
  export type PastQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type PastQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type PastQuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploader?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $PastQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PastQuestion"
    objects: {
      uploader: Prisma.$UserPayload<ExtArgs>
      course: Prisma.$CoursePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileUrl: string
      status: $Enums.Status
      createdAt: Date
      updatedAt: Date
      userId: string
      courseId: string
    }, ExtArgs["result"]["pastQuestion"]>
    composites: {}
  }

  type PastQuestionGetPayload<S extends boolean | null | undefined | PastQuestionDefaultArgs> = $Result.GetResult<Prisma.$PastQuestionPayload, S>

  type PastQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PastQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PastQuestionCountAggregateInputType | true
    }

  export interface PastQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PastQuestion'], meta: { name: 'PastQuestion' } }
    /**
     * Find zero or one PastQuestion that matches the filter.
     * @param {PastQuestionFindUniqueArgs} args - Arguments to find a PastQuestion
     * @example
     * // Get one PastQuestion
     * const pastQuestion = await prisma.pastQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PastQuestionFindUniqueArgs>(args: SelectSubset<T, PastQuestionFindUniqueArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PastQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PastQuestionFindUniqueOrThrowArgs} args - Arguments to find a PastQuestion
     * @example
     * // Get one PastQuestion
     * const pastQuestion = await prisma.pastQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PastQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, PastQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PastQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionFindFirstArgs} args - Arguments to find a PastQuestion
     * @example
     * // Get one PastQuestion
     * const pastQuestion = await prisma.pastQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PastQuestionFindFirstArgs>(args?: SelectSubset<T, PastQuestionFindFirstArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PastQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionFindFirstOrThrowArgs} args - Arguments to find a PastQuestion
     * @example
     * // Get one PastQuestion
     * const pastQuestion = await prisma.pastQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PastQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, PastQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PastQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PastQuestions
     * const pastQuestions = await prisma.pastQuestion.findMany()
     * 
     * // Get first 10 PastQuestions
     * const pastQuestions = await prisma.pastQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pastQuestionWithIdOnly = await prisma.pastQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PastQuestionFindManyArgs>(args?: SelectSubset<T, PastQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PastQuestion.
     * @param {PastQuestionCreateArgs} args - Arguments to create a PastQuestion.
     * @example
     * // Create one PastQuestion
     * const PastQuestion = await prisma.pastQuestion.create({
     *   data: {
     *     // ... data to create a PastQuestion
     *   }
     * })
     * 
     */
    create<T extends PastQuestionCreateArgs>(args: SelectSubset<T, PastQuestionCreateArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PastQuestions.
     * @param {PastQuestionCreateManyArgs} args - Arguments to create many PastQuestions.
     * @example
     * // Create many PastQuestions
     * const pastQuestion = await prisma.pastQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PastQuestionCreateManyArgs>(args?: SelectSubset<T, PastQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PastQuestions and returns the data saved in the database.
     * @param {PastQuestionCreateManyAndReturnArgs} args - Arguments to create many PastQuestions.
     * @example
     * // Create many PastQuestions
     * const pastQuestion = await prisma.pastQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PastQuestions and only return the `id`
     * const pastQuestionWithIdOnly = await prisma.pastQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PastQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, PastQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PastQuestion.
     * @param {PastQuestionDeleteArgs} args - Arguments to delete one PastQuestion.
     * @example
     * // Delete one PastQuestion
     * const PastQuestion = await prisma.pastQuestion.delete({
     *   where: {
     *     // ... filter to delete one PastQuestion
     *   }
     * })
     * 
     */
    delete<T extends PastQuestionDeleteArgs>(args: SelectSubset<T, PastQuestionDeleteArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PastQuestion.
     * @param {PastQuestionUpdateArgs} args - Arguments to update one PastQuestion.
     * @example
     * // Update one PastQuestion
     * const pastQuestion = await prisma.pastQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PastQuestionUpdateArgs>(args: SelectSubset<T, PastQuestionUpdateArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PastQuestions.
     * @param {PastQuestionDeleteManyArgs} args - Arguments to filter PastQuestions to delete.
     * @example
     * // Delete a few PastQuestions
     * const { count } = await prisma.pastQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PastQuestionDeleteManyArgs>(args?: SelectSubset<T, PastQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PastQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PastQuestions
     * const pastQuestion = await prisma.pastQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PastQuestionUpdateManyArgs>(args: SelectSubset<T, PastQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PastQuestions and returns the data updated in the database.
     * @param {PastQuestionUpdateManyAndReturnArgs} args - Arguments to update many PastQuestions.
     * @example
     * // Update many PastQuestions
     * const pastQuestion = await prisma.pastQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PastQuestions and only return the `id`
     * const pastQuestionWithIdOnly = await prisma.pastQuestion.updateManyAndReturn({
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
    updateManyAndReturn<T extends PastQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, PastQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PastQuestion.
     * @param {PastQuestionUpsertArgs} args - Arguments to update or create a PastQuestion.
     * @example
     * // Update or create a PastQuestion
     * const pastQuestion = await prisma.pastQuestion.upsert({
     *   create: {
     *     // ... data to create a PastQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PastQuestion we want to update
     *   }
     * })
     */
    upsert<T extends PastQuestionUpsertArgs>(args: SelectSubset<T, PastQuestionUpsertArgs<ExtArgs>>): Prisma__PastQuestionClient<$Result.GetResult<Prisma.$PastQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PastQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionCountArgs} args - Arguments to filter PastQuestions to count.
     * @example
     * // Count the number of PastQuestions
     * const count = await prisma.pastQuestion.count({
     *   where: {
     *     // ... the filter for the PastQuestions we want to count
     *   }
     * })
    **/
    count<T extends PastQuestionCountArgs>(
      args?: Subset<T, PastQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PastQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PastQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PastQuestionAggregateArgs>(args: Subset<T, PastQuestionAggregateArgs>): Prisma.PrismaPromise<GetPastQuestionAggregateType<T>>

    /**
     * Group by PastQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PastQuestionGroupByArgs} args - Group by arguments.
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
      T extends PastQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PastQuestionGroupByArgs['orderBy'] }
        : { orderBy?: PastQuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PastQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPastQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PastQuestion model
   */
  readonly fields: PastQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PastQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PastQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uploader<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PastQuestion model
   */
  interface PastQuestionFieldRefs {
    readonly id: FieldRef<"PastQuestion", 'String'>
    readonly fileUrl: FieldRef<"PastQuestion", 'String'>
    readonly status: FieldRef<"PastQuestion", 'Status'>
    readonly createdAt: FieldRef<"PastQuestion", 'DateTime'>
    readonly updatedAt: FieldRef<"PastQuestion", 'DateTime'>
    readonly userId: FieldRef<"PastQuestion", 'String'>
    readonly courseId: FieldRef<"PastQuestion", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PastQuestion findUnique
   */
  export type PastQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter, which PastQuestion to fetch.
     */
    where: PastQuestionWhereUniqueInput
  }

  /**
   * PastQuestion findUniqueOrThrow
   */
  export type PastQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter, which PastQuestion to fetch.
     */
    where: PastQuestionWhereUniqueInput
  }

  /**
   * PastQuestion findFirst
   */
  export type PastQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter, which PastQuestion to fetch.
     */
    where?: PastQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PastQuestions to fetch.
     */
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PastQuestions.
     */
    cursor?: PastQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PastQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PastQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PastQuestions.
     */
    distinct?: PastQuestionScalarFieldEnum | PastQuestionScalarFieldEnum[]
  }

  /**
   * PastQuestion findFirstOrThrow
   */
  export type PastQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter, which PastQuestion to fetch.
     */
    where?: PastQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PastQuestions to fetch.
     */
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PastQuestions.
     */
    cursor?: PastQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PastQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PastQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PastQuestions.
     */
    distinct?: PastQuestionScalarFieldEnum | PastQuestionScalarFieldEnum[]
  }

  /**
   * PastQuestion findMany
   */
  export type PastQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter, which PastQuestions to fetch.
     */
    where?: PastQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PastQuestions to fetch.
     */
    orderBy?: PastQuestionOrderByWithRelationInput | PastQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PastQuestions.
     */
    cursor?: PastQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PastQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PastQuestions.
     */
    skip?: number
    distinct?: PastQuestionScalarFieldEnum | PastQuestionScalarFieldEnum[]
  }

  /**
   * PastQuestion create
   */
  export type PastQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a PastQuestion.
     */
    data: XOR<PastQuestionCreateInput, PastQuestionUncheckedCreateInput>
  }

  /**
   * PastQuestion createMany
   */
  export type PastQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PastQuestions.
     */
    data: PastQuestionCreateManyInput | PastQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PastQuestion createManyAndReturn
   */
  export type PastQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many PastQuestions.
     */
    data: PastQuestionCreateManyInput | PastQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PastQuestion update
   */
  export type PastQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a PastQuestion.
     */
    data: XOR<PastQuestionUpdateInput, PastQuestionUncheckedUpdateInput>
    /**
     * Choose, which PastQuestion to update.
     */
    where: PastQuestionWhereUniqueInput
  }

  /**
   * PastQuestion updateMany
   */
  export type PastQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PastQuestions.
     */
    data: XOR<PastQuestionUpdateManyMutationInput, PastQuestionUncheckedUpdateManyInput>
    /**
     * Filter which PastQuestions to update
     */
    where?: PastQuestionWhereInput
    /**
     * Limit how many PastQuestions to update.
     */
    limit?: number
  }

  /**
   * PastQuestion updateManyAndReturn
   */
  export type PastQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * The data used to update PastQuestions.
     */
    data: XOR<PastQuestionUpdateManyMutationInput, PastQuestionUncheckedUpdateManyInput>
    /**
     * Filter which PastQuestions to update
     */
    where?: PastQuestionWhereInput
    /**
     * Limit how many PastQuestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PastQuestion upsert
   */
  export type PastQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the PastQuestion to update in case it exists.
     */
    where: PastQuestionWhereUniqueInput
    /**
     * In case the PastQuestion found by the `where` argument doesn't exist, create a new PastQuestion with this data.
     */
    create: XOR<PastQuestionCreateInput, PastQuestionUncheckedCreateInput>
    /**
     * In case the PastQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PastQuestionUpdateInput, PastQuestionUncheckedUpdateInput>
  }

  /**
   * PastQuestion delete
   */
  export type PastQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
    /**
     * Filter which PastQuestion to delete.
     */
    where: PastQuestionWhereUniqueInput
  }

  /**
   * PastQuestion deleteMany
   */
  export type PastQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PastQuestions to delete
     */
    where?: PastQuestionWhereInput
    /**
     * Limit how many PastQuestions to delete.
     */
    limit?: number
  }

  /**
   * PastQuestion without action
   */
  export type PastQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PastQuestion
     */
    select?: PastQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PastQuestion
     */
    omit?: PastQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PastQuestionInclude<ExtArgs> | null
  }


  /**
   * Model Bookmark
   */

  export type AggregateBookmark = {
    _count: BookmarkCountAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  export type BookmarkMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type BookmarkMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    courseId: string | null
  }

  export type BookmarkCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    userId: number
    courseId: number
    _all: number
  }


  export type BookmarkMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type BookmarkMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
  }

  export type BookmarkCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    courseId?: true
    _all?: true
  }

  export type BookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmark to aggregate.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookmarks
    **/
    _count?: true | BookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkMaxAggregateInputType
  }

  export type GetBookmarkAggregateType<T extends BookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmark[P]>
      : GetScalarType<T[P], AggregateBookmark[P]>
  }




  export type BookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithAggregationInput | BookmarkOrderByWithAggregationInput[]
    by: BookmarkScalarFieldEnum[] | BookmarkScalarFieldEnum
    having?: BookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkCountAggregateInputType | true
    _min?: BookmarkMinAggregateInputType
    _max?: BookmarkMaxAggregateInputType
  }

  export type BookmarkGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    courseId: string
    _count: BookmarkCountAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  type GetBookmarkGroupByPayload<T extends BookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    courseId?: boolean
  }

  export type BookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "userId" | "courseId", ExtArgs["result"]["bookmark"]>
  export type BookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    course?: boolean | CourseDefaultArgs<ExtArgs>
  }

  export type $BookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bookmark"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      course: Prisma.$CoursePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      userId: string
      courseId: string
    }, ExtArgs["result"]["bookmark"]>
    composites: {}
  }

  type BookmarkGetPayload<S extends boolean | null | undefined | BookmarkDefaultArgs> = $Result.GetResult<Prisma.$BookmarkPayload, S>

  type BookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkCountAggregateInputType | true
    }

  export interface BookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bookmark'], meta: { name: 'Bookmark' } }
    /**
     * Find zero or one Bookmark that matches the filter.
     * @param {BookmarkFindUniqueArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkFindUniqueArgs>(args: SelectSubset<T, BookmarkFindUniqueArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkFindUniqueOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkFindFirstArgs>(args?: SelectSubset<T, BookmarkFindFirstArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookmarks
     * const bookmarks = await prisma.bookmark.findMany()
     * 
     * // Get first 10 Bookmarks
     * const bookmarks = await prisma.bookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookmarkFindManyArgs>(args?: SelectSubset<T, BookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookmark.
     * @param {BookmarkCreateArgs} args - Arguments to create a Bookmark.
     * @example
     * // Create one Bookmark
     * const Bookmark = await prisma.bookmark.create({
     *   data: {
     *     // ... data to create a Bookmark
     *   }
     * })
     * 
     */
    create<T extends BookmarkCreateArgs>(args: SelectSubset<T, BookmarkCreateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookmarks.
     * @param {BookmarkCreateManyArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkCreateManyArgs>(args?: SelectSubset<T, BookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookmarks and returns the data saved in the database.
     * @param {BookmarkCreateManyAndReturnArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bookmark.
     * @param {BookmarkDeleteArgs} args - Arguments to delete one Bookmark.
     * @example
     * // Delete one Bookmark
     * const Bookmark = await prisma.bookmark.delete({
     *   where: {
     *     // ... filter to delete one Bookmark
     *   }
     * })
     * 
     */
    delete<T extends BookmarkDeleteArgs>(args: SelectSubset<T, BookmarkDeleteArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookmark.
     * @param {BookmarkUpdateArgs} args - Arguments to update one Bookmark.
     * @example
     * // Update one Bookmark
     * const bookmark = await prisma.bookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkUpdateArgs>(args: SelectSubset<T, BookmarkUpdateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookmarks.
     * @param {BookmarkDeleteManyArgs} args - Arguments to filter Bookmarks to delete.
     * @example
     * // Delete a few Bookmarks
     * const { count } = await prisma.bookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkDeleteManyArgs>(args?: SelectSubset<T, BookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkUpdateManyArgs>(args: SelectSubset<T, BookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks and returns the data updated in the database.
     * @param {BookmarkUpdateManyAndReturnArgs} args - Arguments to update many Bookmarks.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.updateManyAndReturn({
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
    updateManyAndReturn<T extends BookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bookmark.
     * @param {BookmarkUpsertArgs} args - Arguments to update or create a Bookmark.
     * @example
     * // Update or create a Bookmark
     * const bookmark = await prisma.bookmark.upsert({
     *   create: {
     *     // ... data to create a Bookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookmark we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkUpsertArgs>(args: SelectSubset<T, BookmarkUpsertArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCountArgs} args - Arguments to filter Bookmarks to count.
     * @example
     * // Count the number of Bookmarks
     * const count = await prisma.bookmark.count({
     *   where: {
     *     // ... the filter for the Bookmarks we want to count
     *   }
     * })
    **/
    count<T extends BookmarkCountArgs>(
      args?: Subset<T, BookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookmarkAggregateArgs>(args: Subset<T, BookmarkAggregateArgs>): Prisma.PrismaPromise<GetBookmarkAggregateType<T>>

    /**
     * Group by Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkGroupByArgs} args - Group by arguments.
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
      T extends BookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bookmark model
   */
  readonly fields: BookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    course<T extends CourseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourseDefaultArgs<ExtArgs>>): Prisma__CourseClient<$Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Bookmark model
   */
  interface BookmarkFieldRefs {
    readonly id: FieldRef<"Bookmark", 'String'>
    readonly createdAt: FieldRef<"Bookmark", 'DateTime'>
    readonly updatedAt: FieldRef<"Bookmark", 'DateTime'>
    readonly userId: FieldRef<"Bookmark", 'String'>
    readonly courseId: FieldRef<"Bookmark", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Bookmark findUnique
   */
  export type BookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findUniqueOrThrow
   */
  export type BookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findFirst
   */
  export type BookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findFirstOrThrow
   */
  export type BookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findMany
   */
  export type BookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmarks to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark create
   */
  export type BookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a Bookmark.
     */
    data: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
  }

  /**
   * Bookmark createMany
   */
  export type BookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bookmark createManyAndReturn
   */
  export type BookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark update
   */
  export type BookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a Bookmark.
     */
    data: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
    /**
     * Choose, which Bookmark to update.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark updateMany
   */
  export type BookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
  }

  /**
   * Bookmark updateManyAndReturn
   */
  export type BookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark upsert
   */
  export type BookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the Bookmark to update in case it exists.
     */
    where: BookmarkWhereUniqueInput
    /**
     * In case the Bookmark found by the `where` argument doesn't exist, create a new Bookmark with this data.
     */
    create: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
    /**
     * In case the Bookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
  }

  /**
   * Bookmark delete
   */
  export type BookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter which Bookmark to delete.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark deleteMany
   */
  export type BookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmarks to delete
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to delete.
     */
    limit?: number
  }

  /**
   * Bookmark without action
   */
  export type BookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    firstname: 'firstname',
    lastname: 'lastname',
    level: 'level',
    email: 'email',
    role: 'role',
    password: 'password',
    profileImg: 'profileImg',
    bio: 'bio',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CourseScalarFieldEnum: {
    id: 'id',
    courseCode: 'courseCode',
    courseTitle: 'courseTitle',
    level: 'level',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum]


  export const CourseMaterialScalarFieldEnum: {
    id: 'id',
    fileUrl: 'fileUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    courseId: 'courseId'
  };

  export type CourseMaterialScalarFieldEnum = (typeof CourseMaterialScalarFieldEnum)[keyof typeof CourseMaterialScalarFieldEnum]


  export const PastQuestionScalarFieldEnum: {
    id: 'id',
    fileUrl: 'fileUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    courseId: 'courseId'
  };

  export type PastQuestionScalarFieldEnum = (typeof PastQuestionScalarFieldEnum)[keyof typeof PastQuestionScalarFieldEnum]


  export const BookmarkScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    courseId: 'courseId'
  };

  export type BookmarkScalarFieldEnum = (typeof BookmarkScalarFieldEnum)[keyof typeof BookmarkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'Status[]'
   */
  export type ListEnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    firstname?: StringFilter<"User"> | string
    lastname?: StringFilter<"User"> | string
    level?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringFilter<"User"> | string
    profileImg?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    CourseMaterial?: CourseMaterialListRelationFilter
    pastQuestion?: PastQuestionListRelationFilter
    Bookmark?: BookmarkListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    level?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    profileImg?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    CourseMaterial?: CourseMaterialOrderByRelationAggregateInput
    pastQuestion?: PastQuestionOrderByRelationAggregateInput
    Bookmark?: BookmarkOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstname?: StringFilter<"User"> | string
    lastname?: StringFilter<"User"> | string
    level?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringFilter<"User"> | string
    profileImg?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    CourseMaterial?: CourseMaterialListRelationFilter
    pastQuestion?: PastQuestionListRelationFilter
    Bookmark?: BookmarkListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    level?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    profileImg?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firstname?: StringWithAggregatesFilter<"User"> | string
    lastname?: StringWithAggregatesFilter<"User"> | string
    level?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    password?: StringWithAggregatesFilter<"User"> | string
    profileImg?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CourseWhereInput = {
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    id?: StringFilter<"Course"> | string
    courseCode?: StringFilter<"Course"> | string
    courseTitle?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    description?: StringNullableFilter<"Course"> | string | null
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
    CourseMaterial?: CourseMaterialListRelationFilter
    pastQuestion?: PastQuestionListRelationFilter
    Bookmark?: BookmarkListRelationFilter
  }

  export type CourseOrderByWithRelationInput = {
    id?: SortOrder
    courseCode?: SortOrder
    courseTitle?: SortOrder
    level?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    CourseMaterial?: CourseMaterialOrderByRelationAggregateInput
    pastQuestion?: PastQuestionOrderByRelationAggregateInput
    Bookmark?: BookmarkOrderByRelationAggregateInput
  }

  export type CourseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourseWhereInput | CourseWhereInput[]
    OR?: CourseWhereInput[]
    NOT?: CourseWhereInput | CourseWhereInput[]
    courseCode?: StringFilter<"Course"> | string
    courseTitle?: StringFilter<"Course"> | string
    level?: StringFilter<"Course"> | string
    description?: StringNullableFilter<"Course"> | string | null
    createdAt?: DateTimeFilter<"Course"> | Date | string
    updatedAt?: DateTimeFilter<"Course"> | Date | string
    CourseMaterial?: CourseMaterialListRelationFilter
    pastQuestion?: PastQuestionListRelationFilter
    Bookmark?: BookmarkListRelationFilter
  }, "id">

  export type CourseOrderByWithAggregationInput = {
    id?: SortOrder
    courseCode?: SortOrder
    courseTitle?: SortOrder
    level?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CourseCountOrderByAggregateInput
    _max?: CourseMaxOrderByAggregateInput
    _min?: CourseMinOrderByAggregateInput
  }

  export type CourseScalarWhereWithAggregatesInput = {
    AND?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    OR?: CourseScalarWhereWithAggregatesInput[]
    NOT?: CourseScalarWhereWithAggregatesInput | CourseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Course"> | string
    courseCode?: StringWithAggregatesFilter<"Course"> | string
    courseTitle?: StringWithAggregatesFilter<"Course"> | string
    level?: StringWithAggregatesFilter<"Course"> | string
    description?: StringNullableWithAggregatesFilter<"Course"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Course"> | Date | string
  }

  export type CourseMaterialWhereInput = {
    AND?: CourseMaterialWhereInput | CourseMaterialWhereInput[]
    OR?: CourseMaterialWhereInput[]
    NOT?: CourseMaterialWhereInput | CourseMaterialWhereInput[]
    id?: StringFilter<"CourseMaterial"> | string
    fileUrl?: StringFilter<"CourseMaterial"> | string
    status?: EnumStatusFilter<"CourseMaterial"> | $Enums.Status
    createdAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    updatedAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    userId?: StringFilter<"CourseMaterial"> | string
    courseId?: StringFilter<"CourseMaterial"> | string
    uploaderID?: XOR<UserScalarRelationFilter, UserWhereInput>
    courseID?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }

  export type CourseMaterialOrderByWithRelationInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    uploaderID?: UserOrderByWithRelationInput
    courseID?: CourseOrderByWithRelationInput
  }

  export type CourseMaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourseMaterialWhereInput | CourseMaterialWhereInput[]
    OR?: CourseMaterialWhereInput[]
    NOT?: CourseMaterialWhereInput | CourseMaterialWhereInput[]
    fileUrl?: StringFilter<"CourseMaterial"> | string
    status?: EnumStatusFilter<"CourseMaterial"> | $Enums.Status
    createdAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    updatedAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    userId?: StringFilter<"CourseMaterial"> | string
    courseId?: StringFilter<"CourseMaterial"> | string
    uploaderID?: XOR<UserScalarRelationFilter, UserWhereInput>
    courseID?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }, "id">

  export type CourseMaterialOrderByWithAggregationInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    _count?: CourseMaterialCountOrderByAggregateInput
    _max?: CourseMaterialMaxOrderByAggregateInput
    _min?: CourseMaterialMinOrderByAggregateInput
  }

  export type CourseMaterialScalarWhereWithAggregatesInput = {
    AND?: CourseMaterialScalarWhereWithAggregatesInput | CourseMaterialScalarWhereWithAggregatesInput[]
    OR?: CourseMaterialScalarWhereWithAggregatesInput[]
    NOT?: CourseMaterialScalarWhereWithAggregatesInput | CourseMaterialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CourseMaterial"> | string
    fileUrl?: StringWithAggregatesFilter<"CourseMaterial"> | string
    status?: EnumStatusWithAggregatesFilter<"CourseMaterial"> | $Enums.Status
    createdAt?: DateTimeWithAggregatesFilter<"CourseMaterial"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CourseMaterial"> | Date | string
    userId?: StringWithAggregatesFilter<"CourseMaterial"> | string
    courseId?: StringWithAggregatesFilter<"CourseMaterial"> | string
  }

  export type PastQuestionWhereInput = {
    AND?: PastQuestionWhereInput | PastQuestionWhereInput[]
    OR?: PastQuestionWhereInput[]
    NOT?: PastQuestionWhereInput | PastQuestionWhereInput[]
    id?: StringFilter<"PastQuestion"> | string
    fileUrl?: StringFilter<"PastQuestion"> | string
    status?: EnumStatusFilter<"PastQuestion"> | $Enums.Status
    createdAt?: DateTimeFilter<"PastQuestion"> | Date | string
    updatedAt?: DateTimeFilter<"PastQuestion"> | Date | string
    userId?: StringFilter<"PastQuestion"> | string
    courseId?: StringFilter<"PastQuestion"> | string
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }

  export type PastQuestionOrderByWithRelationInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    uploader?: UserOrderByWithRelationInput
    course?: CourseOrderByWithRelationInput
  }

  export type PastQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PastQuestionWhereInput | PastQuestionWhereInput[]
    OR?: PastQuestionWhereInput[]
    NOT?: PastQuestionWhereInput | PastQuestionWhereInput[]
    fileUrl?: StringFilter<"PastQuestion"> | string
    status?: EnumStatusFilter<"PastQuestion"> | $Enums.Status
    createdAt?: DateTimeFilter<"PastQuestion"> | Date | string
    updatedAt?: DateTimeFilter<"PastQuestion"> | Date | string
    userId?: StringFilter<"PastQuestion"> | string
    courseId?: StringFilter<"PastQuestion"> | string
    uploader?: XOR<UserScalarRelationFilter, UserWhereInput>
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }, "id">

  export type PastQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    _count?: PastQuestionCountOrderByAggregateInput
    _max?: PastQuestionMaxOrderByAggregateInput
    _min?: PastQuestionMinOrderByAggregateInput
  }

  export type PastQuestionScalarWhereWithAggregatesInput = {
    AND?: PastQuestionScalarWhereWithAggregatesInput | PastQuestionScalarWhereWithAggregatesInput[]
    OR?: PastQuestionScalarWhereWithAggregatesInput[]
    NOT?: PastQuestionScalarWhereWithAggregatesInput | PastQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PastQuestion"> | string
    fileUrl?: StringWithAggregatesFilter<"PastQuestion"> | string
    status?: EnumStatusWithAggregatesFilter<"PastQuestion"> | $Enums.Status
    createdAt?: DateTimeWithAggregatesFilter<"PastQuestion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PastQuestion"> | Date | string
    userId?: StringWithAggregatesFilter<"PastQuestion"> | string
    courseId?: StringWithAggregatesFilter<"PastQuestion"> | string
  }

  export type BookmarkWhereInput = {
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    userId?: StringFilter<"Bookmark"> | string
    courseId?: StringFilter<"Bookmark"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }

  export type BookmarkOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    user?: UserOrderByWithRelationInput
    course?: CourseOrderByWithRelationInput
  }

  export type BookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    userId?: StringFilter<"Bookmark"> | string
    courseId?: StringFilter<"Bookmark"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    course?: XOR<CourseScalarRelationFilter, CourseWhereInput>
  }, "id">

  export type BookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    _count?: BookmarkCountOrderByAggregateInput
    _max?: BookmarkMaxOrderByAggregateInput
    _min?: BookmarkMinOrderByAggregateInput
  }

  export type BookmarkScalarWhereWithAggregatesInput = {
    AND?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    OR?: BookmarkScalarWhereWithAggregatesInput[]
    NOT?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bookmark"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
    userId?: StringWithAggregatesFilter<"Bookmark"> | string
    courseId?: StringWithAggregatesFilter<"Bookmark"> | string
  }

  export type UserCreateInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutUploaderIDInput
    pastQuestion?: PastQuestionCreateNestedManyWithoutUploaderInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutUploaderIDInput
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutUploaderInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutUploaderIDNestedInput
    pastQuestion?: PastQuestionUpdateManyWithoutUploaderNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutUploaderIDNestedInput
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutUploaderNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseCreateInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutCourseIDInput
    pastQuestion?: PastQuestionCreateNestedManyWithoutCourseInput
    Bookmark?: BookmarkCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutCourseIDInput
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutCourseInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutCourseIDNestedInput
    pastQuestion?: PastQuestionUpdateManyWithoutCourseNestedInput
    Bookmark?: BookmarkUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutCourseIDNestedInput
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutCourseNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CourseCreateManyInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseMaterialCreateInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    uploaderID: UserCreateNestedOneWithoutCourseMaterialInput
    courseID: CourseCreateNestedOneWithoutCourseMaterialInput
  }

  export type CourseMaterialUncheckedCreateInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type CourseMaterialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderID?: UserUpdateOneRequiredWithoutCourseMaterialNestedInput
    courseID?: CourseUpdateOneRequiredWithoutCourseMaterialNestedInput
  }

  export type CourseMaterialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseMaterialCreateManyInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type CourseMaterialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseMaterialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionCreateInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    uploader: UserCreateNestedOneWithoutPastQuestionInput
    course: CourseCreateNestedOneWithoutPastQuestionInput
  }

  export type PastQuestionUncheckedCreateInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type PastQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploader?: UserUpdateOneRequiredWithoutPastQuestionNestedInput
    course?: CourseUpdateOneRequiredWithoutPastQuestionNestedInput
  }

  export type PastQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionCreateManyInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type PastQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PastQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBookmarkInput
    course: CourseCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type BookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarkNestedInput
    course?: CourseUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    courseId: string
  }

  export type BookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
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

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
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

  export type CourseMaterialListRelationFilter = {
    every?: CourseMaterialWhereInput
    some?: CourseMaterialWhereInput
    none?: CourseMaterialWhereInput
  }

  export type PastQuestionListRelationFilter = {
    every?: PastQuestionWhereInput
    some?: PastQuestionWhereInput
    none?: PastQuestionWhereInput
  }

  export type BookmarkListRelationFilter = {
    every?: BookmarkWhereInput
    some?: BookmarkWhereInput
    none?: BookmarkWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CourseMaterialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PastQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    level?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    profileImg?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    level?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    profileImg?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firstname?: SortOrder
    lastname?: SortOrder
    level?: SortOrder
    email?: SortOrder
    role?: SortOrder
    password?: SortOrder
    profileImg?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type CourseCountOrderByAggregateInput = {
    id?: SortOrder
    courseCode?: SortOrder
    courseTitle?: SortOrder
    level?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseMaxOrderByAggregateInput = {
    id?: SortOrder
    courseCode?: SortOrder
    courseTitle?: SortOrder
    level?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourseMinOrderByAggregateInput = {
    id?: SortOrder
    courseCode?: SortOrder
    courseTitle?: SortOrder
    level?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CourseScalarRelationFilter = {
    is?: CourseWhereInput
    isNot?: CourseWhereInput
  }

  export type CourseMaterialCountOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type CourseMaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type CourseMaterialMinOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type PastQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type PastQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type PastQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    fileUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type BookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type BookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type BookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
  }

  export type CourseMaterialCreateNestedManyWithoutUploaderIDInput = {
    create?: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput> | CourseMaterialCreateWithoutUploaderIDInput[] | CourseMaterialUncheckedCreateWithoutUploaderIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutUploaderIDInput | CourseMaterialCreateOrConnectWithoutUploaderIDInput[]
    createMany?: CourseMaterialCreateManyUploaderIDInputEnvelope
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
  }

  export type PastQuestionCreateNestedManyWithoutUploaderInput = {
    create?: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput> | PastQuestionCreateWithoutUploaderInput[] | PastQuestionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutUploaderInput | PastQuestionCreateOrConnectWithoutUploaderInput[]
    createMany?: PastQuestionCreateManyUploaderInputEnvelope
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type CourseMaterialUncheckedCreateNestedManyWithoutUploaderIDInput = {
    create?: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput> | CourseMaterialCreateWithoutUploaderIDInput[] | CourseMaterialUncheckedCreateWithoutUploaderIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutUploaderIDInput | CourseMaterialCreateOrConnectWithoutUploaderIDInput[]
    createMany?: CourseMaterialCreateManyUploaderIDInputEnvelope
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
  }

  export type PastQuestionUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput> | PastQuestionCreateWithoutUploaderInput[] | PastQuestionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutUploaderInput | PastQuestionCreateOrConnectWithoutUploaderInput[]
    createMany?: PastQuestionCreateManyUploaderInputEnvelope
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CourseMaterialUpdateManyWithoutUploaderIDNestedInput = {
    create?: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput> | CourseMaterialCreateWithoutUploaderIDInput[] | CourseMaterialUncheckedCreateWithoutUploaderIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutUploaderIDInput | CourseMaterialCreateOrConnectWithoutUploaderIDInput[]
    upsert?: CourseMaterialUpsertWithWhereUniqueWithoutUploaderIDInput | CourseMaterialUpsertWithWhereUniqueWithoutUploaderIDInput[]
    createMany?: CourseMaterialCreateManyUploaderIDInputEnvelope
    set?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    disconnect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    delete?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    update?: CourseMaterialUpdateWithWhereUniqueWithoutUploaderIDInput | CourseMaterialUpdateWithWhereUniqueWithoutUploaderIDInput[]
    updateMany?: CourseMaterialUpdateManyWithWhereWithoutUploaderIDInput | CourseMaterialUpdateManyWithWhereWithoutUploaderIDInput[]
    deleteMany?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
  }

  export type PastQuestionUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput> | PastQuestionCreateWithoutUploaderInput[] | PastQuestionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutUploaderInput | PastQuestionCreateOrConnectWithoutUploaderInput[]
    upsert?: PastQuestionUpsertWithWhereUniqueWithoutUploaderInput | PastQuestionUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: PastQuestionCreateManyUploaderInputEnvelope
    set?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    disconnect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    delete?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    update?: PastQuestionUpdateWithWhereUniqueWithoutUploaderInput | PastQuestionUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: PastQuestionUpdateManyWithWhereWithoutUploaderInput | PastQuestionUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type CourseMaterialUncheckedUpdateManyWithoutUploaderIDNestedInput = {
    create?: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput> | CourseMaterialCreateWithoutUploaderIDInput[] | CourseMaterialUncheckedCreateWithoutUploaderIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutUploaderIDInput | CourseMaterialCreateOrConnectWithoutUploaderIDInput[]
    upsert?: CourseMaterialUpsertWithWhereUniqueWithoutUploaderIDInput | CourseMaterialUpsertWithWhereUniqueWithoutUploaderIDInput[]
    createMany?: CourseMaterialCreateManyUploaderIDInputEnvelope
    set?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    disconnect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    delete?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    update?: CourseMaterialUpdateWithWhereUniqueWithoutUploaderIDInput | CourseMaterialUpdateWithWhereUniqueWithoutUploaderIDInput[]
    updateMany?: CourseMaterialUpdateManyWithWhereWithoutUploaderIDInput | CourseMaterialUpdateManyWithWhereWithoutUploaderIDInput[]
    deleteMany?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
  }

  export type PastQuestionUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput> | PastQuestionCreateWithoutUploaderInput[] | PastQuestionUncheckedCreateWithoutUploaderInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutUploaderInput | PastQuestionCreateOrConnectWithoutUploaderInput[]
    upsert?: PastQuestionUpsertWithWhereUniqueWithoutUploaderInput | PastQuestionUpsertWithWhereUniqueWithoutUploaderInput[]
    createMany?: PastQuestionCreateManyUploaderInputEnvelope
    set?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    disconnect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    delete?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    update?: PastQuestionUpdateWithWhereUniqueWithoutUploaderInput | PastQuestionUpdateWithWhereUniqueWithoutUploaderInput[]
    updateMany?: PastQuestionUpdateManyWithWhereWithoutUploaderInput | PastQuestionUpdateManyWithWhereWithoutUploaderInput[]
    deleteMany?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type CourseMaterialCreateNestedManyWithoutCourseIDInput = {
    create?: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput> | CourseMaterialCreateWithoutCourseIDInput[] | CourseMaterialUncheckedCreateWithoutCourseIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutCourseIDInput | CourseMaterialCreateOrConnectWithoutCourseIDInput[]
    createMany?: CourseMaterialCreateManyCourseIDInputEnvelope
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
  }

  export type PastQuestionCreateNestedManyWithoutCourseInput = {
    create?: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput> | PastQuestionCreateWithoutCourseInput[] | PastQuestionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutCourseInput | PastQuestionCreateOrConnectWithoutCourseInput[]
    createMany?: PastQuestionCreateManyCourseInputEnvelope
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
  }

  export type BookmarkCreateNestedManyWithoutCourseInput = {
    create?: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput> | BookmarkCreateWithoutCourseInput[] | BookmarkUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutCourseInput | BookmarkCreateOrConnectWithoutCourseInput[]
    createMany?: BookmarkCreateManyCourseInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type CourseMaterialUncheckedCreateNestedManyWithoutCourseIDInput = {
    create?: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput> | CourseMaterialCreateWithoutCourseIDInput[] | CourseMaterialUncheckedCreateWithoutCourseIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutCourseIDInput | CourseMaterialCreateOrConnectWithoutCourseIDInput[]
    createMany?: CourseMaterialCreateManyCourseIDInputEnvelope
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
  }

  export type PastQuestionUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput> | PastQuestionCreateWithoutCourseInput[] | PastQuestionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutCourseInput | PastQuestionCreateOrConnectWithoutCourseInput[]
    createMany?: PastQuestionCreateManyCourseInputEnvelope
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutCourseInput = {
    create?: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput> | BookmarkCreateWithoutCourseInput[] | BookmarkUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutCourseInput | BookmarkCreateOrConnectWithoutCourseInput[]
    createMany?: BookmarkCreateManyCourseInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type CourseMaterialUpdateManyWithoutCourseIDNestedInput = {
    create?: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput> | CourseMaterialCreateWithoutCourseIDInput[] | CourseMaterialUncheckedCreateWithoutCourseIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutCourseIDInput | CourseMaterialCreateOrConnectWithoutCourseIDInput[]
    upsert?: CourseMaterialUpsertWithWhereUniqueWithoutCourseIDInput | CourseMaterialUpsertWithWhereUniqueWithoutCourseIDInput[]
    createMany?: CourseMaterialCreateManyCourseIDInputEnvelope
    set?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    disconnect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    delete?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    update?: CourseMaterialUpdateWithWhereUniqueWithoutCourseIDInput | CourseMaterialUpdateWithWhereUniqueWithoutCourseIDInput[]
    updateMany?: CourseMaterialUpdateManyWithWhereWithoutCourseIDInput | CourseMaterialUpdateManyWithWhereWithoutCourseIDInput[]
    deleteMany?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
  }

  export type PastQuestionUpdateManyWithoutCourseNestedInput = {
    create?: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput> | PastQuestionCreateWithoutCourseInput[] | PastQuestionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutCourseInput | PastQuestionCreateOrConnectWithoutCourseInput[]
    upsert?: PastQuestionUpsertWithWhereUniqueWithoutCourseInput | PastQuestionUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: PastQuestionCreateManyCourseInputEnvelope
    set?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    disconnect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    delete?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    update?: PastQuestionUpdateWithWhereUniqueWithoutCourseInput | PastQuestionUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: PastQuestionUpdateManyWithWhereWithoutCourseInput | PastQuestionUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
  }

  export type BookmarkUpdateManyWithoutCourseNestedInput = {
    create?: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput> | BookmarkCreateWithoutCourseInput[] | BookmarkUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutCourseInput | BookmarkCreateOrConnectWithoutCourseInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutCourseInput | BookmarkUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: BookmarkCreateManyCourseInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutCourseInput | BookmarkUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutCourseInput | BookmarkUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type CourseMaterialUncheckedUpdateManyWithoutCourseIDNestedInput = {
    create?: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput> | CourseMaterialCreateWithoutCourseIDInput[] | CourseMaterialUncheckedCreateWithoutCourseIDInput[]
    connectOrCreate?: CourseMaterialCreateOrConnectWithoutCourseIDInput | CourseMaterialCreateOrConnectWithoutCourseIDInput[]
    upsert?: CourseMaterialUpsertWithWhereUniqueWithoutCourseIDInput | CourseMaterialUpsertWithWhereUniqueWithoutCourseIDInput[]
    createMany?: CourseMaterialCreateManyCourseIDInputEnvelope
    set?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    disconnect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    delete?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    connect?: CourseMaterialWhereUniqueInput | CourseMaterialWhereUniqueInput[]
    update?: CourseMaterialUpdateWithWhereUniqueWithoutCourseIDInput | CourseMaterialUpdateWithWhereUniqueWithoutCourseIDInput[]
    updateMany?: CourseMaterialUpdateManyWithWhereWithoutCourseIDInput | CourseMaterialUpdateManyWithWhereWithoutCourseIDInput[]
    deleteMany?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
  }

  export type PastQuestionUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput> | PastQuestionCreateWithoutCourseInput[] | PastQuestionUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: PastQuestionCreateOrConnectWithoutCourseInput | PastQuestionCreateOrConnectWithoutCourseInput[]
    upsert?: PastQuestionUpsertWithWhereUniqueWithoutCourseInput | PastQuestionUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: PastQuestionCreateManyCourseInputEnvelope
    set?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    disconnect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    delete?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    connect?: PastQuestionWhereUniqueInput | PastQuestionWhereUniqueInput[]
    update?: PastQuestionUpdateWithWhereUniqueWithoutCourseInput | PastQuestionUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: PastQuestionUpdateManyWithWhereWithoutCourseInput | PastQuestionUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput> | BookmarkCreateWithoutCourseInput[] | BookmarkUncheckedCreateWithoutCourseInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutCourseInput | BookmarkCreateOrConnectWithoutCourseInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutCourseInput | BookmarkUpsertWithWhereUniqueWithoutCourseInput[]
    createMany?: BookmarkCreateManyCourseInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutCourseInput | BookmarkUpdateWithWhereUniqueWithoutCourseInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutCourseInput | BookmarkUpdateManyWithWhereWithoutCourseInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCourseMaterialInput = {
    create?: XOR<UserCreateWithoutCourseMaterialInput, UserUncheckedCreateWithoutCourseMaterialInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseMaterialInput
    connect?: UserWhereUniqueInput
  }

  export type CourseCreateNestedOneWithoutCourseMaterialInput = {
    create?: XOR<CourseCreateWithoutCourseMaterialInput, CourseUncheckedCreateWithoutCourseMaterialInput>
    connectOrCreate?: CourseCreateOrConnectWithoutCourseMaterialInput
    connect?: CourseWhereUniqueInput
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type UserUpdateOneRequiredWithoutCourseMaterialNestedInput = {
    create?: XOR<UserCreateWithoutCourseMaterialInput, UserUncheckedCreateWithoutCourseMaterialInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseMaterialInput
    upsert?: UserUpsertWithoutCourseMaterialInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCourseMaterialInput, UserUpdateWithoutCourseMaterialInput>, UserUncheckedUpdateWithoutCourseMaterialInput>
  }

  export type CourseUpdateOneRequiredWithoutCourseMaterialNestedInput = {
    create?: XOR<CourseCreateWithoutCourseMaterialInput, CourseUncheckedCreateWithoutCourseMaterialInput>
    connectOrCreate?: CourseCreateOrConnectWithoutCourseMaterialInput
    upsert?: CourseUpsertWithoutCourseMaterialInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutCourseMaterialInput, CourseUpdateWithoutCourseMaterialInput>, CourseUncheckedUpdateWithoutCourseMaterialInput>
  }

  export type UserCreateNestedOneWithoutPastQuestionInput = {
    create?: XOR<UserCreateWithoutPastQuestionInput, UserUncheckedCreateWithoutPastQuestionInput>
    connectOrCreate?: UserCreateOrConnectWithoutPastQuestionInput
    connect?: UserWhereUniqueInput
  }

  export type CourseCreateNestedOneWithoutPastQuestionInput = {
    create?: XOR<CourseCreateWithoutPastQuestionInput, CourseUncheckedCreateWithoutPastQuestionInput>
    connectOrCreate?: CourseCreateOrConnectWithoutPastQuestionInput
    connect?: CourseWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPastQuestionNestedInput = {
    create?: XOR<UserCreateWithoutPastQuestionInput, UserUncheckedCreateWithoutPastQuestionInput>
    connectOrCreate?: UserCreateOrConnectWithoutPastQuestionInput
    upsert?: UserUpsertWithoutPastQuestionInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPastQuestionInput, UserUpdateWithoutPastQuestionInput>, UserUncheckedUpdateWithoutPastQuestionInput>
  }

  export type CourseUpdateOneRequiredWithoutPastQuestionNestedInput = {
    create?: XOR<CourseCreateWithoutPastQuestionInput, CourseUncheckedCreateWithoutPastQuestionInput>
    connectOrCreate?: CourseCreateOrConnectWithoutPastQuestionInput
    upsert?: CourseUpsertWithoutPastQuestionInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutPastQuestionInput, CourseUpdateWithoutPastQuestionInput>, CourseUncheckedUpdateWithoutPastQuestionInput>
  }

  export type UserCreateNestedOneWithoutBookmarkInput = {
    create?: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarkInput
    connect?: UserWhereUniqueInput
  }

  export type CourseCreateNestedOneWithoutBookmarkInput = {
    create?: XOR<CourseCreateWithoutBookmarkInput, CourseUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: CourseCreateOrConnectWithoutBookmarkInput
    connect?: CourseWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutBookmarkNestedInput = {
    create?: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarkInput
    upsert?: UserUpsertWithoutBookmarkInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookmarkInput, UserUpdateWithoutBookmarkInput>, UserUncheckedUpdateWithoutBookmarkInput>
  }

  export type CourseUpdateOneRequiredWithoutBookmarkNestedInput = {
    create?: XOR<CourseCreateWithoutBookmarkInput, CourseUncheckedCreateWithoutBookmarkInput>
    connectOrCreate?: CourseCreateOrConnectWithoutBookmarkInput
    upsert?: CourseUpsertWithoutBookmarkInput
    connect?: CourseWhereUniqueInput
    update?: XOR<XOR<CourseUpdateToOneWithWhereWithoutBookmarkInput, CourseUpdateWithoutBookmarkInput>, CourseUncheckedUpdateWithoutBookmarkInput>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
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

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type CourseMaterialCreateWithoutUploaderIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    courseID: CourseCreateNestedOneWithoutCourseMaterialInput
  }

  export type CourseMaterialUncheckedCreateWithoutUploaderIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type CourseMaterialCreateOrConnectWithoutUploaderIDInput = {
    where: CourseMaterialWhereUniqueInput
    create: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput>
  }

  export type CourseMaterialCreateManyUploaderIDInputEnvelope = {
    data: CourseMaterialCreateManyUploaderIDInput | CourseMaterialCreateManyUploaderIDInput[]
    skipDuplicates?: boolean
  }

  export type PastQuestionCreateWithoutUploaderInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    course: CourseCreateNestedOneWithoutPastQuestionInput
  }

  export type PastQuestionUncheckedCreateWithoutUploaderInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type PastQuestionCreateOrConnectWithoutUploaderInput = {
    where: PastQuestionWhereUniqueInput
    create: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput>
  }

  export type PastQuestionCreateManyUploaderInputEnvelope = {
    data: PastQuestionCreateManyUploaderInput | PastQuestionCreateManyUploaderInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    course: CourseCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type BookmarkCreateOrConnectWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkCreateManyUserInputEnvelope = {
    data: BookmarkCreateManyUserInput | BookmarkCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CourseMaterialUpsertWithWhereUniqueWithoutUploaderIDInput = {
    where: CourseMaterialWhereUniqueInput
    update: XOR<CourseMaterialUpdateWithoutUploaderIDInput, CourseMaterialUncheckedUpdateWithoutUploaderIDInput>
    create: XOR<CourseMaterialCreateWithoutUploaderIDInput, CourseMaterialUncheckedCreateWithoutUploaderIDInput>
  }

  export type CourseMaterialUpdateWithWhereUniqueWithoutUploaderIDInput = {
    where: CourseMaterialWhereUniqueInput
    data: XOR<CourseMaterialUpdateWithoutUploaderIDInput, CourseMaterialUncheckedUpdateWithoutUploaderIDInput>
  }

  export type CourseMaterialUpdateManyWithWhereWithoutUploaderIDInput = {
    where: CourseMaterialScalarWhereInput
    data: XOR<CourseMaterialUpdateManyMutationInput, CourseMaterialUncheckedUpdateManyWithoutUploaderIDInput>
  }

  export type CourseMaterialScalarWhereInput = {
    AND?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
    OR?: CourseMaterialScalarWhereInput[]
    NOT?: CourseMaterialScalarWhereInput | CourseMaterialScalarWhereInput[]
    id?: StringFilter<"CourseMaterial"> | string
    fileUrl?: StringFilter<"CourseMaterial"> | string
    status?: EnumStatusFilter<"CourseMaterial"> | $Enums.Status
    createdAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    updatedAt?: DateTimeFilter<"CourseMaterial"> | Date | string
    userId?: StringFilter<"CourseMaterial"> | string
    courseId?: StringFilter<"CourseMaterial"> | string
  }

  export type PastQuestionUpsertWithWhereUniqueWithoutUploaderInput = {
    where: PastQuestionWhereUniqueInput
    update: XOR<PastQuestionUpdateWithoutUploaderInput, PastQuestionUncheckedUpdateWithoutUploaderInput>
    create: XOR<PastQuestionCreateWithoutUploaderInput, PastQuestionUncheckedCreateWithoutUploaderInput>
  }

  export type PastQuestionUpdateWithWhereUniqueWithoutUploaderInput = {
    where: PastQuestionWhereUniqueInput
    data: XOR<PastQuestionUpdateWithoutUploaderInput, PastQuestionUncheckedUpdateWithoutUploaderInput>
  }

  export type PastQuestionUpdateManyWithWhereWithoutUploaderInput = {
    where: PastQuestionScalarWhereInput
    data: XOR<PastQuestionUpdateManyMutationInput, PastQuestionUncheckedUpdateManyWithoutUploaderInput>
  }

  export type PastQuestionScalarWhereInput = {
    AND?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
    OR?: PastQuestionScalarWhereInput[]
    NOT?: PastQuestionScalarWhereInput | PastQuestionScalarWhereInput[]
    id?: StringFilter<"PastQuestion"> | string
    fileUrl?: StringFilter<"PastQuestion"> | string
    status?: EnumStatusFilter<"PastQuestion"> | $Enums.Status
    createdAt?: DateTimeFilter<"PastQuestion"> | Date | string
    updatedAt?: DateTimeFilter<"PastQuestion"> | Date | string
    userId?: StringFilter<"PastQuestion"> | string
    courseId?: StringFilter<"PastQuestion"> | string
  }

  export type BookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutUserInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutUserInput>
  }

  export type BookmarkScalarWhereInput = {
    AND?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    OR?: BookmarkScalarWhereInput[]
    NOT?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    userId?: StringFilter<"Bookmark"> | string
    courseId?: StringFilter<"Bookmark"> | string
  }

  export type CourseMaterialCreateWithoutCourseIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    uploaderID: UserCreateNestedOneWithoutCourseMaterialInput
  }

  export type CourseMaterialUncheckedCreateWithoutCourseIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type CourseMaterialCreateOrConnectWithoutCourseIDInput = {
    where: CourseMaterialWhereUniqueInput
    create: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput>
  }

  export type CourseMaterialCreateManyCourseIDInputEnvelope = {
    data: CourseMaterialCreateManyCourseIDInput | CourseMaterialCreateManyCourseIDInput[]
    skipDuplicates?: boolean
  }

  export type PastQuestionCreateWithoutCourseInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    uploader: UserCreateNestedOneWithoutPastQuestionInput
  }

  export type PastQuestionUncheckedCreateWithoutCourseInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type PastQuestionCreateOrConnectWithoutCourseInput = {
    where: PastQuestionWhereUniqueInput
    create: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput>
  }

  export type PastQuestionCreateManyCourseInputEnvelope = {
    data: PastQuestionCreateManyCourseInput | PastQuestionCreateManyCourseInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkCreateWithoutCourseInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutCourseInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type BookmarkCreateOrConnectWithoutCourseInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput>
  }

  export type BookmarkCreateManyCourseInputEnvelope = {
    data: BookmarkCreateManyCourseInput | BookmarkCreateManyCourseInput[]
    skipDuplicates?: boolean
  }

  export type CourseMaterialUpsertWithWhereUniqueWithoutCourseIDInput = {
    where: CourseMaterialWhereUniqueInput
    update: XOR<CourseMaterialUpdateWithoutCourseIDInput, CourseMaterialUncheckedUpdateWithoutCourseIDInput>
    create: XOR<CourseMaterialCreateWithoutCourseIDInput, CourseMaterialUncheckedCreateWithoutCourseIDInput>
  }

  export type CourseMaterialUpdateWithWhereUniqueWithoutCourseIDInput = {
    where: CourseMaterialWhereUniqueInput
    data: XOR<CourseMaterialUpdateWithoutCourseIDInput, CourseMaterialUncheckedUpdateWithoutCourseIDInput>
  }

  export type CourseMaterialUpdateManyWithWhereWithoutCourseIDInput = {
    where: CourseMaterialScalarWhereInput
    data: XOR<CourseMaterialUpdateManyMutationInput, CourseMaterialUncheckedUpdateManyWithoutCourseIDInput>
  }

  export type PastQuestionUpsertWithWhereUniqueWithoutCourseInput = {
    where: PastQuestionWhereUniqueInput
    update: XOR<PastQuestionUpdateWithoutCourseInput, PastQuestionUncheckedUpdateWithoutCourseInput>
    create: XOR<PastQuestionCreateWithoutCourseInput, PastQuestionUncheckedCreateWithoutCourseInput>
  }

  export type PastQuestionUpdateWithWhereUniqueWithoutCourseInput = {
    where: PastQuestionWhereUniqueInput
    data: XOR<PastQuestionUpdateWithoutCourseInput, PastQuestionUncheckedUpdateWithoutCourseInput>
  }

  export type PastQuestionUpdateManyWithWhereWithoutCourseInput = {
    where: PastQuestionScalarWhereInput
    data: XOR<PastQuestionUpdateManyMutationInput, PastQuestionUncheckedUpdateManyWithoutCourseInput>
  }

  export type BookmarkUpsertWithWhereUniqueWithoutCourseInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutCourseInput, BookmarkUncheckedUpdateWithoutCourseInput>
    create: XOR<BookmarkCreateWithoutCourseInput, BookmarkUncheckedCreateWithoutCourseInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutCourseInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutCourseInput, BookmarkUncheckedUpdateWithoutCourseInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutCourseInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutCourseInput>
  }

  export type UserCreateWithoutCourseMaterialInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pastQuestion?: PastQuestionCreateNestedManyWithoutUploaderInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCourseMaterialInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutUploaderInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCourseMaterialInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCourseMaterialInput, UserUncheckedCreateWithoutCourseMaterialInput>
  }

  export type CourseCreateWithoutCourseMaterialInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pastQuestion?: PastQuestionCreateNestedManyWithoutCourseInput
    Bookmark?: BookmarkCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutCourseMaterialInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutCourseInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutCourseMaterialInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutCourseMaterialInput, CourseUncheckedCreateWithoutCourseMaterialInput>
  }

  export type UserUpsertWithoutCourseMaterialInput = {
    update: XOR<UserUpdateWithoutCourseMaterialInput, UserUncheckedUpdateWithoutCourseMaterialInput>
    create: XOR<UserCreateWithoutCourseMaterialInput, UserUncheckedCreateWithoutCourseMaterialInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCourseMaterialInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCourseMaterialInput, UserUncheckedUpdateWithoutCourseMaterialInput>
  }

  export type UserUpdateWithoutCourseMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pastQuestion?: PastQuestionUpdateManyWithoutUploaderNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCourseMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutUploaderNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CourseUpsertWithoutCourseMaterialInput = {
    update: XOR<CourseUpdateWithoutCourseMaterialInput, CourseUncheckedUpdateWithoutCourseMaterialInput>
    create: XOR<CourseCreateWithoutCourseMaterialInput, CourseUncheckedCreateWithoutCourseMaterialInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutCourseMaterialInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutCourseMaterialInput, CourseUncheckedUpdateWithoutCourseMaterialInput>
  }

  export type CourseUpdateWithoutCourseMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pastQuestion?: PastQuestionUpdateManyWithoutCourseNestedInput
    Bookmark?: BookmarkUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutCourseMaterialInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutCourseNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type UserCreateWithoutPastQuestionInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutUploaderIDInput
    Bookmark?: BookmarkCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPastQuestionInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutUploaderIDInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPastQuestionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPastQuestionInput, UserUncheckedCreateWithoutPastQuestionInput>
  }

  export type CourseCreateWithoutPastQuestionInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutCourseIDInput
    Bookmark?: BookmarkCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutPastQuestionInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutCourseIDInput
    Bookmark?: BookmarkUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutPastQuestionInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutPastQuestionInput, CourseUncheckedCreateWithoutPastQuestionInput>
  }

  export type UserUpsertWithoutPastQuestionInput = {
    update: XOR<UserUpdateWithoutPastQuestionInput, UserUncheckedUpdateWithoutPastQuestionInput>
    create: XOR<UserCreateWithoutPastQuestionInput, UserUncheckedCreateWithoutPastQuestionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPastQuestionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPastQuestionInput, UserUncheckedUpdateWithoutPastQuestionInput>
  }

  export type UserUpdateWithoutPastQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutUploaderIDNestedInput
    Bookmark?: BookmarkUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPastQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutUploaderIDNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CourseUpsertWithoutPastQuestionInput = {
    update: XOR<CourseUpdateWithoutPastQuestionInput, CourseUncheckedUpdateWithoutPastQuestionInput>
    create: XOR<CourseCreateWithoutPastQuestionInput, CourseUncheckedCreateWithoutPastQuestionInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutPastQuestionInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutPastQuestionInput, CourseUncheckedUpdateWithoutPastQuestionInput>
  }

  export type CourseUpdateWithoutPastQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutCourseIDNestedInput
    Bookmark?: BookmarkUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutPastQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutCourseIDNestedInput
    Bookmark?: BookmarkUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type UserCreateWithoutBookmarkInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutUploaderIDInput
    pastQuestion?: PastQuestionCreateNestedManyWithoutUploaderInput
  }

  export type UserUncheckedCreateWithoutBookmarkInput = {
    id?: string
    firstname: string
    lastname: string
    level: string
    email: string
    role?: $Enums.Role
    password: string
    profileImg?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutUploaderIDInput
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutUploaderInput
  }

  export type UserCreateOrConnectWithoutBookmarkInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
  }

  export type CourseCreateWithoutBookmarkInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialCreateNestedManyWithoutCourseIDInput
    pastQuestion?: PastQuestionCreateNestedManyWithoutCourseInput
  }

  export type CourseUncheckedCreateWithoutBookmarkInput = {
    id?: string
    courseCode: string
    courseTitle: string
    level: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    CourseMaterial?: CourseMaterialUncheckedCreateNestedManyWithoutCourseIDInput
    pastQuestion?: PastQuestionUncheckedCreateNestedManyWithoutCourseInput
  }

  export type CourseCreateOrConnectWithoutBookmarkInput = {
    where: CourseWhereUniqueInput
    create: XOR<CourseCreateWithoutBookmarkInput, CourseUncheckedCreateWithoutBookmarkInput>
  }

  export type UserUpsertWithoutBookmarkInput = {
    update: XOR<UserUpdateWithoutBookmarkInput, UserUncheckedUpdateWithoutBookmarkInput>
    create: XOR<UserCreateWithoutBookmarkInput, UserUncheckedCreateWithoutBookmarkInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookmarkInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookmarkInput, UserUncheckedUpdateWithoutBookmarkInput>
  }

  export type UserUpdateWithoutBookmarkInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutUploaderIDNestedInput
    pastQuestion?: PastQuestionUpdateManyWithoutUploaderNestedInput
  }

  export type UserUncheckedUpdateWithoutBookmarkInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstname?: StringFieldUpdateOperationsInput | string
    lastname?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    password?: StringFieldUpdateOperationsInput | string
    profileImg?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutUploaderIDNestedInput
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutUploaderNestedInput
  }

  export type CourseUpsertWithoutBookmarkInput = {
    update: XOR<CourseUpdateWithoutBookmarkInput, CourseUncheckedUpdateWithoutBookmarkInput>
    create: XOR<CourseCreateWithoutBookmarkInput, CourseUncheckedCreateWithoutBookmarkInput>
    where?: CourseWhereInput
  }

  export type CourseUpdateToOneWithWhereWithoutBookmarkInput = {
    where?: CourseWhereInput
    data: XOR<CourseUpdateWithoutBookmarkInput, CourseUncheckedUpdateWithoutBookmarkInput>
  }

  export type CourseUpdateWithoutBookmarkInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUpdateManyWithoutCourseIDNestedInput
    pastQuestion?: PastQuestionUpdateManyWithoutCourseNestedInput
  }

  export type CourseUncheckedUpdateWithoutBookmarkInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseCode?: StringFieldUpdateOperationsInput | string
    courseTitle?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    CourseMaterial?: CourseMaterialUncheckedUpdateManyWithoutCourseIDNestedInput
    pastQuestion?: PastQuestionUncheckedUpdateManyWithoutCourseNestedInput
  }

  export type CourseMaterialCreateManyUploaderIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type PastQuestionCreateManyUploaderInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type BookmarkCreateManyUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    courseId: string
  }

  export type CourseMaterialUpdateWithoutUploaderIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseID?: CourseUpdateOneRequiredWithoutCourseMaterialNestedInput
  }

  export type CourseMaterialUncheckedUpdateWithoutUploaderIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseMaterialUncheckedUpdateManyWithoutUploaderIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    course?: CourseUpdateOneRequiredWithoutPastQuestionNestedInput
  }

  export type PastQuestionUncheckedUpdateWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionUncheckedUpdateManyWithoutUploaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    course?: CourseUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseMaterialCreateManyCourseIDInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type PastQuestionCreateManyCourseInput = {
    id?: string
    fileUrl: string
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type BookmarkCreateManyCourseInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type CourseMaterialUpdateWithoutCourseIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploaderID?: UserUpdateOneRequiredWithoutCourseMaterialNestedInput
  }

  export type CourseMaterialUncheckedUpdateWithoutCourseIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseMaterialUncheckedUpdateManyWithoutCourseIDInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploader?: UserUpdateOneRequiredWithoutPastQuestionNestedInput
  }

  export type PastQuestionUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PastQuestionUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type BookmarkUncheckedUpdateManyWithoutCourseInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
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