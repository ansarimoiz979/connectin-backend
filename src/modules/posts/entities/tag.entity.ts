import { Column, Entity, Index, ManyToMany } from "typeorm";

import { PostEntity } from './post.entity';
import { BaseEntity } from "src/modules/common/types/base.entity";

@Entity()
export class TagEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @ManyToMany(() => PostEntity, (p) => p.tags, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];
}
