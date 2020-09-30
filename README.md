<p align="center">

    <img  src="https://raw.githubusercontent.com/velascoandres/excalibur/master/logo/sword.png"></img>
    <h1 align="center">Excalibur</h1>

</p>

Excalibur is a set of functions and classes api plus several modules for `Nest.js` .

<img src="https://img.shields.io/npm/dt/@pimba/excalibur"></img>
<img src="https://img.shields.io/npm/v/@pimba/excalibur"></img>
<img src="https://img.shields.io/github/languages/top/velascoandres/excalibur"></img>
<img src="https://img.shields.io/github/languages/code-size/velascoandres/excalibur"></img>
<img src="https://img.shields.io/npm/l/@pimba/excalibur"></img>
<img src="https://img.shields.io/github/stars/velascoandres/excalibur"></img>
<img src="https://img.shields.io/github/issues/velascoandres/excalibur"></img>

## Index

1. [Installation](#install)

2. [REST-API](#rest-api)

3. [Security](#security)

4. [Google Cloud Storage](#google-cloud-storage)

5.  [Google Cloud Vision](#google-cloud-vision)

6. [Firebase Admin Authentification](#firebase-admin-authentification)

7. [Email Module](#email)

8. [Special Thanks](#special-thanks)

## Install:

```shell script
npm i @pimba/excalibur

``` 

## REST API

One of the strongest features of this library is to implement an API-REST quickly. To do this, you must 
first consider implementing the following classes:

* Entity
* Service
* DTO
* Controller

 
 

#### Create entity class with extends from `AbstractEntity`

If you want the entity has an auntoincremental id column, createdAt, updatedAt columns.

```typescript
import {AbstractEntity} from '@pimba/excalibur/lib';

@Entity('product')
export class ProductEntity extends AbstractEntity {
  
}
```

 

#### Create a service class which extends from `AbstractService`

``` typescript
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

#### Create a DTO class for update and create:

It is optional to extend from `BaseDTO` , This class allows to validate that the fields: `id` , `createdAt` and `updatedAt` should not be empty

``` typescript
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

``` typescript
import {ApiController} from '@pimba/excalibur/lib';

@Controller('product')
export class ProductController extends ApiController<ProductEntity> {
    constructor(private readonly _productService: ProductService) {
        super(
            _productService,
            {
                createDtoType: ProductCreateDto,
                updateDtoType: ProductEditDto,
            }
        );
    }
}
```

### API-REST ENPOINTS:

For  a `controllerPrefix` given on the `Controller` decorator. The following 
set of routes will be generated.

| HTTP METHOD | PATH  | Controller and Service method |
| --------- | ------ | ----------------------------- |
|  POST  | `<controllerPrefix>` | createOne              |
|  POST  | `<controllerPrefix>` /create-many  | createMany              |
|  PUT | `/<controllerPrefix>/<id:number>` |  updateOne |
|  GET | `/<controllerPrefix>/<id:number>` | findOne  | 
| GET  | `/<controllerPrefix>?query=<find-query>` | findAll |
| DELETE | `/<controllerPrefix>/<id:number>` | deleteOne |

###  Find  Query

#### SQL Data Bases

For SQL DB you can make a search criteria, that complies 
with the following scheme:

``` text
   {
    "where": {
         // Entity attributes and relations
    },
    "skip": 0, // Pagination
    "take": 10 // Pagination
  }  
```

For example:
The `product entity` has a relation `many to one` with `category entity` , so lets make 
the following search: 
Products that have a price `greater than or equal` to `10` or `less than` 2 and that the name of the product category 
can be `snacks` , `drinks` or that the same name of the category includes `"sna"` .

`Find-Query` : 

``` json
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

> On `like` operator with the wildcar `%` , you should use `%25` instead of `%`
> cause some problems with browsers and `http clients`
> as `Postman` .

#### Examples

> Browser or client side

``` text
http://localhost:3000/product?query={"where":{"name":{"$like":"%25choco%25"},"category":{}}}
```

Results:

``` json
{
    "nextQuery": null,
    "data": [
        {
            "price": "18",
            "id": 22,
            "createdAt": "2020-07-23T23:51:56.898Z",
            "updatedAt": "2020-07-23T23:51:56.898Z",
            "name": "chocobreak",
            "description": "Voluptate irure eu dolor sit et id nisi dolore ex aliquip.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        },
        {
            "price": "16",
            "id": 21,
            "createdAt": "2020-07-23T23:51:56.897Z",
            "updatedAt": "2020-07-23T23:51:56.897Z",
            "name": "great chocolate",
            "description": "Commodo sit duis id consectetur minim nisi nostrud ex sit ad aute cillum eiusmod.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        },
        {
            "price": "2",
            "id": 17,
            "createdAt": "2020-07-23T23:51:56.891Z",
            "updatedAt": "2020-07-23T23:51:56.891Z",
            "name": "happy chocolate",
            "description": "Duis magna exercitation aute pariatur voluptate velit magna ut.",
            "category": {
                "id": 8,
                "name": "candies"
            }
        }
    ],
    "total": 3
}
```

> If you are working on backend side you could use the widlcard `%` without problems.
> Also you could use any [wildcard](https://www.w3schools.com/sql/sql_wildcards.asp) on `like` operator according your 
> data base.

``` typescript
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
const searchResponse: [ProductEntity[], number] = await this.productService.findAll(query);
const filterProducts = searchResponse[0];
const totalFecthed = searchResponse[1]; // All filtered records in the Data Base
```

> For scape characters on `like` operator: use `\\`

``` text
percentCode: {"$like": "%25\\%25%25"}} // Client side
percentCode: {"$like": "%\\%%"}} // Backend side
```

### Or operator

You can make a query with `OR` operator using the keyword `"$or"` as `"true"`
For example: Get products with a price of `7` or name includes `"choco"`

``` json
   {
    "where": {
        "price": {"$eq": 7, "$or": true},
        "name": {"$like": "%25choco%25", "$or":  true}
    }
  }  
```

##### Putting it all together

 
 `GET /product?query={"where":{.......}}`

##### Find Query Object

###### Operators

| Operator |   keyword  |  Example |
|  ------  |  -----  | --- |
| Like  | `$like` | "$like": "%sns%"    |
| iLike  | `$ilike` (PostgreSQL) | "$ilike": "%sns%"    |
| `> ` | `$gt` | "$gt": 20 |
| `>=` | `$gte` |  "$gte": 20 |
| `<` | `$lt` |  "$lt": 20 |
| `<=` | `$lte` |  "$lte": 20 |
| `=` | `$eq` |  "$eq": 20 |
| `!=` | `$ne` |   "$ne": 20 |
| Between | `$btw` | "$btw": [A, B]  |
| In | `$in` | "$in": [A, B, ...] |
| Not In | `$nin` | "$nin": [A, B, ...]"
| Not Between | `$nbtw` |  "$nbtw": [A, B, ...]"

> if your are using MongoDB, you must use the query operators for mongo, check the [documentation](https://docs.mongodb.com/manual/reference/operator/query/)

##### Join Relations

The join relations could be many levels as you want, you need to write the 
`ManyToOne` , `OneToMany` , `OneToOne` , relationship name in your `Find Query Object` like the previous example.
 

If the join is of the `inner` type it is not necessary to put the keyword `"$join": "inner"` , only if you want to use a join of the type "left" ( `" $join ":" left"` )

##### Pagination

The pagination by default is `skip: 0` and `take: 10` .

##### Order By

The order by criteria by default with respect the entity `id` is `DESC` : 
 

``` text
   {
    "where": {
         
    },
    "orderBy": {
        // Order by criteria
    }
  }  
```


##### Select columns

In order to get records with an specific set of columns, you could make use of `$sel` operator:

For example: Get products with a bigger than `7` and only retrieves the name of the filtered products.

``` json
   {
    "where": {
        "$sel": ["name"],
        "price": {"$gt": 7}
    }
  }  
```

Also, you could use the `$sel` operator on queries with joins.


> All columns that are retrieved will always include the id column


For example: the following query retrieves products with name and its supermarket with only name and address.

``` typescript
const query = {
    where: {
        $sel: ["name"],
        category: {
            name: 'candy',
        },
        supermaket: { // Select address and name
            $sel: ["name", "address"], 
        },         
    },
    skip: 0,
    take: 30, 
}

```

### MongoDB

#### Entity (Optional)

If you want the entity has an ObjectId, updatedAt columns, you need to extends from `AbstractMongoEntity`

``` typescript
import {AbstractMongoEntity} from '@pimba/excalibur/lib';

@Entity('post')
export class PostEntity extends AbstractMongoEntity{
    
}
```

#### DTO 

It is optional to extend from `BaseMongoDTO` . This class allows to validate that the fields: `id` , `createdAt` and `updatedAt` should not be empty

``` typescript
import {BaseMongoDTO} from '@pimba/excalibur/lib';

export class Post extends BaseMongoDTO{

}
```

#### Service

The service class must extends from `AbstractMongoService`

``` typescript
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

``` typescript
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

## Security

In order to protect the access to the generic REST-API, you can use a class that implements the `ExcaliburAuth`
interface:

`

``` typescript
import {Observable} from 'rxjs';
import {ExcaliburAuth} from '@pimba/excalibur/lib';
import {PrincipalCrudController} from '@pimba/excalibur/lib';

@Injectable()
export class ProductAuthorization implements ExcaliburAuth {

  
    createOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
       // Your strategy to give authorization  
       return of(true);
    }

    deleteOneAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
         return of(true);
    }

    findAllAuth(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
         return of(true);
    }

    findOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
         return of(true);
    }

    findOneByIdAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
         return of(true);
    }

    updateOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
         return of(true);
    }
}
````

For each method of the REST API an authorization strategy should be implemented.  The parameters of each method 
are the request, the response and the reference to the controller (this last one is if you need to make use of a 
controller attribute).

You can make use of any service inside the class, lets look the following example.

``` typescript
import {map} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {ExcaliburAuth} from '@pimba/excalibur/lib'; 
import {PrincipalCrudController} from '@pimba/excalibur/lib'; 
import {Injectable} from '@nestjs/common';

@Injectable()
export class ProductAuthorization implements ExcaliburAuth {

    constructor(
            private readonly authentificationService: AuthentificationService,
        ) {
    }
  
    createOneAuht(req: any, res: any, controller: PrincipalCrudController): Observable<boolean> {
       const user = req.body.user;
       const permissionsResponse$ = from(this.authentificationService.canCreateProduct(user));
        return permissionsResponse$
            .pipe(
                map(
                    (permissionsResponse: boolean) => permissionsResponse,
                )
        );
    }
}
```

After that, declare this class on its respective module as a provider.

 

``` typescript
import {AuthentificationModule} from '../authentification/authentification.module';
import {ProductAuthorization} from './security/product.auth';

@Module({
    imports: [
        AuthentificationModule,
    ],
    providers: [
        ProductoService,
        ProductAuthorization,
    ],
    controllers: [
        ProductoController
    ],
    exports: [
        ProductoService,
    ],
})
export class ProductoModule {
}
```

Declare this class on the controller as an attribute.

> By default, the `ApiController class` has a generic Authorization class.

``` typescript
@Controller('product')
export class ProductController extends ApiController<ProductEntity> {
    constructor(
        private readonly productService: ProductoService,
        private readonly productAuthorization: ProductAuthorization,
    ) {
        super(
            _productoService,
            {
                createDtoType: ProductCreateDto,
                updateDtoType: ProductUpdateDto,
            },
           productAuthorization,
        );
    }
}
```

## Google Cloud Storage

Import the module with your bucket name.

``` typescript

import { GoogleCloudStorageModule } from '@pimba/excalibur/lib';

@Module({
    imports: [
        GoogleCloudStorageModule
            .register({bucketDefaultName: '<bucket-name>'}),
    ],
})
export class SomeModule {
}
```

> Don't forget to export your google-cloud credentials before start the server.

Inject the google-cloud-service in your controller

``` typescript
import { GoogleCloudStorageService } from '@pimba/excalibur/lib';

@Controller('some')
export class SomeController {

    constructor(
        private readonly _googleCloudStorageService: GoogleCloudStorageService,
    ) {
    }
}
```

Use the service to store a file

``` typescript
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
using a specific folder/prefix name.

``` typescript
import { GoogleCloudStorageFileInterceptor } from '@pimba/excalibur/lib';
```

``` typescript
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

## Google Cloud Vision

Import module: `GoogleCloudVisionApiModule` :

``` typescript
import { GoogleCloudVisionApiModule } from '@pimba/excalibur/lib';
 
@Module({
    imports: [
        GoogleCloudVisionApiModule,
    ],
})
export class SomeModule {
}
```

> Don't forget to export your google-cloud credentials before start the server.

Inject the `GoogleCloudVisionApiService` in your controller

``` typescript
import { GoogleCloudVisionApiService } from '@pimba/excalibur/lib';
 
@Controller('some')
export class SomeController {
 
    constructor(
        private readonly _googleCloudVisionApiService: GoogleCloudVisionApiService,
    ) {
    }

    @Get('inspect-image')
      @UseInterceptors(
        FileInterceptor('image'),
      )
      async inspectImage(
        @UploadedFile() imageFile,
      ) {
        // Fecth the file and get it's buffer.  
        const imageBuffer = imageFile.buffer;
        // Invoke the respective service methods
        const text = await this._googleCloudVisionApiService.detectText(imageBuffer);
        const faces = await this._googleCloudVisionApiService.detectFaces(imageBuffer);
        const explictContent = await this._googleCloudVisionApiService.detectExplicitContent(imageBuffer);
        const objects = await this._googleCloudVisionApiService.detectMultipleObjects(imageBuffer);
        const properties = await this._googleCloudVisionApiService.detectProperties(imageBuffer);
        return {
          text,
          faces,
          explictContent,
          objects,
          properties,
        };
      }
    }
```

### Service Methods

| Method Name | Description | Parameters  |
| --------- | ------ | ----- |
| detectLabels | Detects labels that are in the image  |  image-url or buffer |
| detectFaces |  Detects faces that are in the image  |   image-url or buffer |
| detectProperties |  Gets the more representative properties from the image such as the most relevant colors  |   image-url or buffer |
| detectLandMarks |  Detects places such as names of buildings, monuments, among other things.  |  image-url or buffer |
| detectLogos |  Detects all logos that are in the image  |  image-url or buffer |
| detectExplicitContent |  Detect some type of explicit content in the image such as violence, racism, etc.  | image-url or buffer |
| detectMultipleObjects | Detects all objects that are in the image with their respective ubication polygon coordinates |  image-url or buffer |
| detectText |  Detects all text contained in the image |  image-url or buffer |
| detectHandwrittenText | Detects get handwritten text in an image  |  image-url or buffer |

## Firebase Admin Authentification

Import the module with your projectID.

``` typescript
import { FirebaseModule } from '@pimba/excalibur/lib';

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

> If you want use `admin.credential.applicationDefault()` just don't forget to export your Firebase credentials before start the server.

Inject the firebase-service in your controller

``` typescript
import { FirebaseAdminAuthService } from '@pimba/excalibur/lib';

@Controller('some')
export class SomeController {

    constructor(
        private readonly _firebaseService: FirebaseAdminAuthService
    ) {
    }
}
```

Use the service: 

``` typescript
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

## Email

The library uses [nodemailer](https://nodemailer.com/about/) to provide a module for sending emails.

Import the module with the transports options:

``` typescript
import {EmailModule} from '@pimba/excalibur/lib';

@Module(
    {
        imports: [
            EmailModule
                .register(
                  {
                     transport: {
                        host: 'smtp.some-host.email',
                        port: 587, // smtp port
                        secure: false, // true for 465, false for other ports,
                        auth: {
                          user: '<your-username-or-email>',
                          pass: '<your-password>',
                        },
                      }
                  }
            )
        ]   
    }   
)
export class SomeModule {
}
```

> If your want to know more about nodemailer please check its [documentation](!https://nodemailer.com/about/)

In order to send emails, your need to inject the service: 

``` typescript
@Controller('some-controller')
export class SomeController  {
    constructor(
        private readonly emailService: EmailService,
    ) {
    }

    @Get('email')
    async sendEmail() {
        await this.emailService
            .sendMail(
                {
                    from: '<sender>',
                    to: ['<receiver-1>', '<receiver-2>', '<receiver-3>'], // receiver/receivers
                    subject: 'Hello',
                    text: 'Hello World!!',
                }
            );
        return 'OK';
    }
}
```

## Special Thanks

The modules for google-cloud-storage and firebase were based on the [Aginix Technologies](https://github.com/Aginix) libraries
