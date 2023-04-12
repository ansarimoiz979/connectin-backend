import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FollowingEntity } from './modules/user/entities/following.entity';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { PostEntity } from './modules/posts/entities/post.entity';
import { PostsModule } from './modules/posts/posts.module';
import { TagEntity } from './modules/posts/entities/tag.entity';
import { MulterModule } from '@nestjs/platform-express';
import { PostLikeEntity } from './modules/posts/entities/postLike.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type : 'postgres',
      host: "127.0.0.1",
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: "linkedin",
      entities : [
        UserEntity,
        FollowingEntity,
        PostEntity,
        TagEntity,
        PostLikeEntity
      ],
      synchronize : true,
      logging : true
 
    }),
    MulterModule.register( { dest : "./uploads" }),
    AuthModule,
    UserModule,
    PostsModule,

  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
    console.log("app moduless",process.env.POSTGRES_HOST);    
  }
}
