
# Excalibur
API of functions, classes and  modules for `Nestjs` framework.

<img src="https://img.shields.io/npm/dm/@pimba/excalibur"></img>
<img src="https://img.shields.io/npm/v/@pimba/excalibur"></img>
<img src="https://img.shields.io/github/languages/top/velascoandres/excalibur"></img>
<img src="https://img.shields.io/github/languages/code-size/velascoandres/excalibur"></img>
<img src="https://img.shields.io/npm/l/@pimba/excalibur"></img>
<img src="https://img.shields.io/github/stars/velascoandres/excalibur"></img>
<img src="https://img.shields.io/github/issues/velascoandres/excalibur"></img>


## Index

1. [Instalation](#install)
2. [API-REST](#api-rest)
3. [Decorators](#decorators)

    3.1 [Swagger](#swagger)

    3.2 [Guards](#guards)

    3.3 [Interceptors](#interceptors)

    3.4 [Headers](#headers)

    3.5 [CrudApi](#crudapi)

4. [Google Cloud Storage](#google-cloud-storage)

5. [Firebase Authentification](#firebase-authentification)

6. [Special Thanks](#special-thanks)


## Install:

```shell script
npm i @pimba/excalibur
```


## API REST 
Like `Django-Rest-Framework` you can get a generic API for especific an `entity`, so you need
to extends your controller class from ``ApiController``, But your controller class needs to make use of the 
 following classes.
 
If you want the entity has an auntoincremental id column, createdAt, updatedAt columns, you need to extends from `AbstractEntity`

```typescript
import {AbstractEntity} from '@pimba/excalibur/lib';

@Entity('product')
export class ProductEntity extends AbstractEntity {
  
}
``` 
 
Create a service which extends from `AbstractService`

```typescript
import {AbstractService} from '@pimba/excalibur/lib';

@Injectable()
export class ProductService extends AbstractService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productRepository: Repository<ProductEntity>,
  ) {
    super(_productRepository);
  }
}
```

### Create a DTO class for update and create:
It's important extends from `BaseDTO`, this dto class has id, createdAt and updatedAt fields as "must be empty" validator

```typescript
import {BaseDTO} from '@pimba/excalibur/lib';

export class ProductCreateDto extends BaseDTO{
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
import {ApiController} from '@pimba/excalibur/lib';

@Controller('product')
export class ProductController extends ApiController<ProductEntity> {
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
For  `controllerPrefix` given on the `Controller` decorator. The following 
set of routes will be generated.

| HTTP METHOD | PATH  | Controller and Service method |
| --------- | ------ | ----------------------------- |
|  POST  | `<controllerPrefix>`  | createOne              |
|  PUT | `/<controllerPrefix>/<id:number>` |  updateOne |
|  GET | `/<controllerPrefix>/<id:number>` | findOne  | 
| GET  | `/<controllerPrefix>?query=<FindFullQuery>`  | findAll |
| DELETE |  `/<controllerPrefix>/<id:number>` | deleteOne |

###  Find Full Query


#### SQL DB
For SQL DB you can make a search criteria, that complies 
with the following scheme:

```text
   {
    "where": {
         // Entity attributes and relations
    },
    "skip": 0, // Pagination
    "take": 10 // Pagination
  }  
```

For example:
The `product entity` has a relation `many to one` with `category entity`, so lets make 
the following search: Products that have a price greater or equal than `10.00`  `OR` less than of `2.00`, and the product
 category with names `snacks`, `drinks` or name includes `sna`.

`FindFullQuery`: 

```json
   {
    "where": {
        "price": [
          {
            "$gte": 10.00
          },
          {
            "$lt": 2.00 
          } 
        ],
        "category": {
          "$join": "inner",
          "name": [
            {
               "$like": "%25sna%25"
            },
            {
                "$in": ["snacks", "drinks"]
            }            
          ] 
        }
    }
  }  
```




> On `like` operator with the wildcar `%`, you should use `%25` instead of `%` 
>cause some problems with browsers and `http clients`
> as `Postman`. If you are working on backend side you could use the widlcard `%` without problems.
> Also you could use any [wildcard](https://www.w3schools.com/sql/sql_wildcards.asp) on `like` operator.

#### Examples

> Browser or client side

```text
http://localhost:3000/product?query={"where":{name:"%25choco%25"}}
```



> Backend side

```typescript
const query = {
    where: {
        id: { $like: '%chocho%' },
        category: {
            name: 'candy',
        },
        supermaket: { // inner join with `supermarket` entity.
            id: 25,
            address: '',
            city: {  // inner join with `city` entity.
                name: {$like: 'c[^u]'},
                state: {  // inner join with `state` entity.
                   id: {$in: [4, 5, 6, 7]},
                },   
            },
        },         
    },
    skip: 0,
    take: 30,  // Pagination  
}
const searchResponse = await this.productService.findAll(query);
const filterProducts = searchResponse[0];
const totalFecthed = searchResponse[1]; // All filtered records in the Data Base
```

> For scape characters on `like` operator: use  `\\`


```text
percentCode: {"$like": "%25\\%25%25"}} // Client side
percentCode: {"$like": "%\\%%"}} // Backend side
```


### Or operator
You can make a query with `or` operator using the keyword `"$or"` as `"true"`

For example: Get products with a price of `7` or name includes `"choco"`

```json
   {
    "where": {
        "price": {"$eq": 7, "$or": true},
        "name": {"$like": "%25choco%25", "$or":  true}
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
| `=` |  `$eq` |  "$eq": 20 |
| `!=` | `$ne` |   "$ne": 20 |
| Between | `$btw` | "$btw": [A, B]  |
| In | `$in` | "$in": [A, B, ...] |
| Not In | `$nin` | "$nin": [A, B, ...]"
| Not Between | `$nbtw` |  "$nbtw": [A, B, ...]"

> if your are using MongoDB, you must use the query operators for mongo, check the [documentation](https://docs.mongodb.com/manual/reference/operator/query/)

##### Join Relations
The join relations could be many levels as you want, you need to write the 
`ManyToOne`, `OneToMany`, `OneToOne`, relationship name in your `Find Full Query Object` like the previous example.
 


If the join is of the `inner` type it is not necessary to put the keyword `"$join": "inner"`, only if you want to use a join of the type "left" (`" $ join ":" left "`)


##### Pagination
The pagination by default is `skip: 0` and `take: 10`.

##### Order By
The order by criteria by default with respect the entity `id` is `DESC`: 
 
```text
   {
    "where": {
         
    },
    "orderBy": {
        // Order by criteria
    }
  }  
```

### MongoDB


#### Entity (Optional)
If you want the entity has an ObjectId, updatedAt columns, you need to extends from `AbstractMongoEntity`
```typescript
import {AbstractMongoEntity} from '@pimba/excalibur/lib';

@Entity('post')
export class PostEntity extends AbstractMongoEntity{
    
}
```

#### DTO 
It's important extends from `BaseMongoDTO`, this dto class has id and updatedAt fields as "must be empty" validator

```typescript
import {BaseMongoDTO} from '@pimba/excalibur/lib';

export class Post extends BaseMongoDTO{

}
```

#### Service
The service class must extends from `AbstractMongoService`

```typescript
import {AbstractMongoService} from '@pimba/excalibur/lib';

@Injectable()
export class PostService extends AbstractMongoService<PostEntity> {
  constructor(
    @InjectRepository(PostEntity, 'mongo_conn')
    private postRepository: MongoRepository<PostEntity>,
  ) {
    super(
      localizacionRepository,
      { // MongoIndexConfigInterface
        fieldOrSpec: { localization: '2dsphere' },
        options: {
          min: -180,
          max: 180,
        },
      },
    );
  }
}
```

#### Controller

```typescript
import {ApiMongoController} from '@pimba/excalibur/lib';

@Controller('post')
export class PostController extends ApiMongoController<postEntity> {
    constructor(
        private readonly _postService: PostService
    ) {
        super(
            _postService,
            {
                createDtoType: PostCreateDto,
                updateDtoType: PostUpdateDto,
            }
        );
    }
}
```

## Decorators

### Swagger
For Document the API-REST paths on swagger, you need to make use of `CrudDoc` decorator or `CrudApi` decorator.

Example: 
For every method you should make a configuration. The follwing example shows a complete
example. 

In another file if you want, make the configuration as a constant.

```typescript
export const PRODUCT_SWAGGER_CONFIG: CrudApiConfig = {
    createOne: { // MethodName
        apiBody: {
            type: ProductCrearDto
        },
        headers: [
            {
                name: 'X-MyHeader',
                description: 'Custom header',
            },
        ],
        responses: [
            {
                type: ProductCreateDto,
                status: HttpStatus.CREATED,
                description: 'Created Product'
            },
            {
                status: HttpStatus.BAD_REQUEST,
                description: 'Data not valid',
            }
        ]
    },
    updateOne: {
        apiBody: {
            type: ProductUpdateDto,
        },
        responses: [
            {
                type: ProductCreateDto,
                status: HttpStatus.OK,
                description: 'Updated product'
            }
        ]
    },
    findAll: {
        headers: [
            {
                name: 'X-MyHeader',
                description: 'Custom header',
            },
        ],
        responses: [
            {
                type: ProductFindResponse,
                status: HttpStatus.OK,
                description: 'Fetched Products'
            }
        ]
    }
}
```

```typescript
import {CrudDoc} from '@pimba/excalibur/lib';


@CrudDoc(
     PRODUCT_SWAGGER_CONFIG,
)
@Controller('product')
export class ProductController
```


### GUARDS
For Guards for every `Crud Method` you need to make use of `CrudGuards` or `CrudApi` decorator.

Example:
```typescript
import {CrudGuards} from '@pimba/excalibur/lib';

@CrudGuards(
     {
         findAll: [ProductoFindAllGuard,]
         updateOne: [ProductUpdaeOneGuard],
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController
```

### Interceptors

For Interceptors for every `Crud Method` you need to make use of `CrudInterceptors` or `CrudApi` decorator.

Example:
```typescript
import {CrudInterceptors} from '@pimba/excalibur/lib';


@CrudInterceptors(
     {
         findAll: [ProductFindallInterceptor,]
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController
```

### Headers

For Headers on `Crud Methods` you need to make use of `CrudHeaders` or `CrudApi` decorator.

Example:
```typescript
import {CrudHeaders} from '@pimba/excalibur/lib';

@CrudHeaders(
     {
         findAll: {
              name: 'Custom Header',
              value: ''
         },
         ...othersCrudMethod
     }
)
@Controller('product')
export class ProductController
```

### CrudApi
The `CrudApi` is a general decorator to put the configuration of swagger, guards, interceptors and headers for every
Crud Method.

Example:


```typescript
import {CrudApi} from '@pimba/excalibur/lib';

@CrudApi(
    {
        findAll: {
            guards: [ProductFindAllGuard,],
            interceptors: [ProductFindallInterceptor],
            documentation: PRODUCT_SWAGGER_CONFIG.findAll,
            header: {
                name: 'Custom Header',
                value: ''
            },
        },
        createOne: {
            documentation: PRODUCT_SWAGGER_CONFIG.createOne,
        },
        updateOne: {
            documentation: PRODUCT_SWAGGER_CONFIG.updateOne,
        }
    },
)
@Controller('product')
export class ProductController
```

## Google Cloud Storage
> Don't forget to export your google-cloud credentials before start the server.


Import the module with your bucket name.
```typescript
@Module({
    imports: [
        GoogleCloudStorageModule
            .register({bucketDefaultName: '<bucket-name>'}),
    ],
})
export class SomeModule {
}
```

Inject the google-cloud-service in your controller

```typescript
@Controller('some')
export class SomeController {

    constructor(
        private readonly _firebaseService: FirebaseAdminAuthService
        private readonly _googleCloudStorageService: GoogleCloudStorageService,
    ) {
    }
}
```

Use the service to store a file
```typescript
    @Post('upload-picture')
    @UseInterceptors(
        FileInterceptor('picture'),
    )
    async uploadPicture(
            @UploadedFile() pictureFile: UploadedFileMetadata,
    ){
       try {
          return  await this._googleCloudStorageService.upload(pictureFile);
       }catch (error) {
          throw new InternalServerErrorException('Error on Upload');
       }
    }
```

### GoogleCloudStorageFileInterceptor

You can use the `GoogleCloudStorageFileInterceptor` to store a file 
using a specific folder/prefix name

```typescript
    @Post('upload-picture')
    @UseInterceptors(
        GoogleCloudStorageFileInterceptor(
            'picture', 
            undefined, 
            { 
              prefix: 'pictures'
            }
        )
    )
    async uploadPicture(
        @UploadedFile() pictureFile
    ){
            return  pictureFile;
    }
```

## Firebase Authentification

> If you want use `admin.credential.applicationDefault()` just don't forget to export your Firebase credentials before start the server.

Import the module with your projectID.

```typescript
@Module({
    imports: [
        FirebaseModule.register(
            {
                projectId: '<your-projectId>',
                credential: admin.credential.applicationDefault(),
            },
        ),
    ],
})
export class SomeModule {
}
```

Inject the firebase-service in your controller

```typescript
@Controller('some')
export class SomeController {

    constructor(
        private readonly _firebaseService: FirebaseAdminAuthService
    ) {
    }
}
```

Use the service: 
```typescript
    @Post('register-user')
    async registerUser(
        @Body() user: {
            email: string,
            name: string,
            password: string,
        }
    ) {
        return await this._firebaseService.createUser(
            {
                disabled: false,
                email: user.email,
                displayName: user.email,
                emailVerified: true,
                password: user.password,
            }
        );
    }


```


## Special Thanks
The modules for google-cloud-storage and firebase were based on the [Aginix Technologies](https://github.com/Aginix) libraries
