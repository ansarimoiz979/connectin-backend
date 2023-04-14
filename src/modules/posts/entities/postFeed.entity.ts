import { Entity, Index, ManyToOne } from 'typeorm';

import { PostEntity } from './post.entity';
import { BaseEntity } from 'src/modules/common/types/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity()
export class PostFeedEntity extends BaseEntity {
  @Index()
  @ManyToOne(() => UserEntity, (u) => u.postFeed, {
    cascade: true,
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (p) => p.feeds, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  post: PostEntity;
}
