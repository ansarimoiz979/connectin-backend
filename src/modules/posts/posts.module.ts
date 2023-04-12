import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { TagEntity } from './entities/tag.entity';
import { PostLikeEntity } from './entities/postLike.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([PostEntity, TagEntity, PostLikeEntity ])
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
