import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseEntity } from 'src/modules/common/types/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity()
export class PostLikeEntity extends BaseEntity {
  @ManyToOne(() => PostEntity, (p) => p.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postID' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (u) => u.likedPosts, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userID' })
  user: UserEntity;
}
