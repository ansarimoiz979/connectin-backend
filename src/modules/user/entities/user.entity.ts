import { Exclude } from "class-transformer";
import { BaseEntity } from "src/modules/common/types/base.entity";
// import { CommentLikeEntity } from "src/modules/posts/entities/commentLike.entity";
// import { PostEntity } from "src/modules/posts/entities/post.entity";
// import { PostFeedEntity } from "src/modules/posts/entities/postFeed.entity";
// import { PostLikeEntity } from "src/modules/posts/entities/postLike.entity";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { FollowingEntity } from "./following.entity";
import * as bcrypt from 'bcrypt';
import { PostEntity } from "src/modules/posts/entities/post.entity";
import { PostLikeEntity } from "src/modules/posts/entities/postLike.entity";
export interface UserTokensInterface {
    readonly user?: UserEntity;
    readonly accessToken: string;
    readonly refreshToken: string;
  }

@Entity()
export class UserEntity  extends BaseEntity {
  @Column({ length : 64,  })
  name : string;
  @Column({ length : 24, unique : true})
  username : string;
  @Column({ unique : true , length : 24 })
  email:string;
  @Column({ nullable : true, length : 128 })
  password : string;
  // @BeforeInsert()
  // async hashPassword(): Promise<void> {
  //   console.log("before insert");
    
  //   if (this.password) this.password = await bcrypt.hash(this.password, 10);
  //   console.log("hash password" , this.password);
    
  // }
  
  @Column({ default : true })
  isActive : string;
  @Column({ default : true })
  isEmailConfirmed : boolean;
  @Exclude()
  @Column({ default : false})
  isAuthAccount : boolean;
  @Exclude()
  @Column({ default : false})
  isGithubAccount : boolean;
  //relation with the images entity which is public file entity
  // avtar : PublicFileEntity;
  // @OneToOne(() => PublicFileEntity, {
  //   eager: true,
  //   nullable: true,
  // })
  // @JoinColumn()
  // avatar: PublicFileEntity;
    //relation with the images entity which is public file entity
  // coverImage : PublicFileEntity;
  // @OneToOne(() => PublicFileEntity, {
  //   eager: true,
  //   nullable: true,
  // })
  // @JoinColumn()
  // coverImage: PublicFileEntity;
  @Column({  length :  1024, nullable: true })
  description:string;
  @Column({  length :  512, nullable: true })
  website:string;
  @Column({  length :  64, nullable: true })
  phone:string;
  @Column({  length :  64, nullable: true })
  gender:string;
  @Exclude()
  @Column({ nullable: true, select: false })
  hashedRefreshToken: string;

  @OneToMany(() => FollowingEntity, (f) => f.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  followers: FollowingEntity[];
  followersNumber?: number;

  @OneToMany(() => FollowingEntity, (f) => f.target, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  followedUsers: FollowingEntity[];
  followedNumber?: number;

  @OneToMany(() => PostEntity, (post) => post.author, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];
  postsNumber?: number;

  // @OneToMany(() => PostFeedEntity, (pf) => pf.user, {
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  // })
  // postFeed: PostFeedEntity[];

  @OneToMany(() => PostLikeEntity, (pl) => pl.user, {
    cascade: true,
  })
  likedPosts: PostLikeEntity[];

  // @OneToMany(() => CommentLikeEntity, (cm) => cm.user, {
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  // })
  // likedComments: CommentLikeEntity[];


  
  }
