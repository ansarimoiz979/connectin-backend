import { BaseEntity } from "src/modules/common/types/base.entity";
import {  Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class FollowingEntity extends BaseEntity
{
    @ManyToOne(() => UserEntity, (u) => u.followers, {
        cascade: true,
      })
    user : UserEntity
    @ManyToOne(() => UserEntity, (u) => u.followedUsers, {
        cascade: true,
      })
    target : UserEntity
}