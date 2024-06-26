import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  sayHello() {
    return 'Hello World!';
  }
}
