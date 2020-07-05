# excalibur
API of functions and classes for Nestjs

## Index

1. [Instalation](#install)
2. [API-REST](#api-rest)
3. [Swagger](#api-rest)
4. [Guards](#api-rest)
5. [Interceptors](#api-rest)
6. [Google-Cloud](#api-rest)
7. [Firebase](#api-rest)


## Install:

```shell script
npm i @pimba/excalibur
```

In your tsconfig.json set `esModuleInterop` as `true`

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```


## API REST 
Like `Django-Rest-Framework` you can get a generic API for especific `entity`, so you need
to extends your controller class from ``ApiController``, But your controller class needs to make use of the 
 follonwing classes.
 
### The entity must extends from `PrincipalEntity`

```typescript
@Entity('producto')
export class ProductoEntity extends PrincipalEntity {
  
}
``` 
 
 
### Create a service who extends from `PrincipalService`

```typescript
@Injectable()
export class ProductService extends PrincipalService<ProductEntity> {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly _productRepository: Repository<ProductEntity>,
  ) {
    super(_productRepository);
  }
}
```

### Create a DTO class for update and create:
It's important extends from `PrincipalDto`


```typescript
export class ProductCreateDto extends PrincipalDto{
  @IsAlpha()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
```

### Puting it all together

```typescript
@Controller('product')
export class ProductoController extends ApiController<ProductEntity> {
    constructor(private readonly _productService: ProductService) {
        super(
            _productService,
            {
                createDtoType: ProductCrearDto,
                updateDtoType: ProductEditarDto,
            }
        );
    }
}
```

### API-REST ENPOINTS:
For  `entityName` given on the `Controller` decorator. The following 
set of routes will be generated.

| HTTP METHOD | PATH  | Controller and Service method |
| --------- | ------ | ----------------------------- |
|  POST  | `<entityName>`  | createOne              |
|  PUT | `/<entityName>/id` |  updateOne |
|  GET | `/<entityName>/id` | findOne  | 
| GET  | `/<entityName>?query=<FindFullQuery>`  | findAll |
| DELETE |  `/<entityName>/id` | deleteOne |

###  Find Full Query

#### SQL DB
For SQL DB you can make a search criteria, that complies 
with the following scheme:

```json
   {
    "where": {
         <Entity attributes and relations>
    },
    "skip": 0, // PAGINATION
    "take": 10 // PATINGATION
  }  
```

For example:
The `product entity` has a relation `many to one` with `category entity`, so lets make 
the following search: Products that have a price greater or equal than `10.00` from the category `snacks`.

`FindFullQuery`: 

```json
   {
    "where": {
        "price": {
          "$gte": 10.00
        },
        "category": {
          "$join": "inner",
          "name": "snacks"
        }
    }
  }  
```
##### Putting it all together
 
`GET /product?query={"where":{.......}}`


##### Find Full Query Object

###### Operators

| Operator |   keyword  |  Example |
|  ------  |  -----  | --- |
| Like  |  `$like` | "$like": "%sns%"    |
| iLike  |  `$ilike` (PostgreSQL) | "$ilike": "%sns%"    |
|  `> ` | `$gt`  | "$gt": 20 |
| `>=`  | `$gte` |  "$gte": 20 |
| `<` |  `$lt` |  "$lt": 20 |
| `<=` |  `$lte` |  "$lte": 20 |
| `!=` | `$ne` |   "$ne": 20 |
| Between | `$btw` | "$bt2": [A, B]  |
| In | `$in` | "$in": [A, B, ...] |
| Not In | `$nin` | "$nin": [A, B, ...]"
| Not Between | `$nbtw` |  "$nbtw": [A, B, ...]"

##### Join Relations
The join relations could be many levels as you want, you need to write the 
`ManyToOne`, `OneToMany`, `OneToOne`, relationship name in your `Find Full Query Object` like the previous example.
 


If the join is of the `inner` type it is not necessary to put the keyword `"$join": "inner"`, only if you want to use a join of the type "left" (`" $ join ":" left "`)


##### Pagination
The pagination by default is `skip: 0` and `take: 10`.

##### Order By
The order by criteria by default with respect the entity `id` is `DESC`: 
 
```json
   {
    "where": {
         <Entity attributes and relations>
    },
    "orderBy": {
      <Order by criteria>
    }
  }  
```