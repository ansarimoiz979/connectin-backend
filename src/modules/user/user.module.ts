import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { UserEntity } from './entities/user.entity';
import { FollowingEntity } from './entities/following.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([UserEntity,FollowingEntity ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
