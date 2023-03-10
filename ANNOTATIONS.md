In NestJS usually we separate our logic into controllers and services/providers.
The ```controllers``` are responsable for handle incoming requests, and returning responses for the clients.
The ```services/providers``` are responsable of execute the business logic.

It works that way: The Controller receive a POST Request asking to log-in a user - Then it will call the Service/Provider that will send to Controller the response whom will send it to the Client.
But, for it happens, the Controller will need to instanciate the Service/Provider class.
And that will generate something like this:
```typescript
export class AuthController {
  constructor (private authService: AuthService) {
    
  }
}
``` 

## Modules
app.module.ts -> The main file

Each Module can import other modules, like:
App Module -> (Import) User Module & Orders Module -> (Orders Module Import) Feature Module 2... (have an image about it on the docs of NestJS)

Every time you need to create a new module, create another folder for it.

```typescript
// The fundamental structure for a module file
import { Module } from "@nestjs/common";

@Module({})

export class AuthModule {}
```
Every time that you create a new Module, you need to import it on ```app.module.ts```, that will seems like (look at ```imports: [AuthModule]```):
```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

## Importing and Exporting
You can use other module Logic by importing the module on another one, like: I want to import my PrismaModule logic to my AuthModule, then, the code will be like that:
```typescript
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [PrismaModule], // This line here is the one that does the magic
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}
```

and sometimes you will need to import a service in another service, right? So... how can you do that?
Its very simple, on the service class that will export another one, create a constructor like that for the class:
```typescript
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})
export class AuthService {
  constructor (private prisma: PrismaService) {}
  signup() {
    return { msg: 'I have signed up.' }
  }
  signin() {
    return { msg: 'I have signed in.' }
  }
}
```
But it will not be enough, you will need to enable the exportation of the service in the module, like that:
```typescript
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This line here
})
export class PrismaModule {}
```

#### You can transform your module into a "Global" Module too
Using the ```@Global()``` you create a Global Module, that can be imported by every other modules on the entire application 

### Using NestJS CLI
Create a new module called "user": ```nest g module user``` or ```npx nest g module user``` it will automatically create the module and import it on app.module.ts

