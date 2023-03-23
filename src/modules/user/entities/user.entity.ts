import { Exclude } from "class-transformer";
import { BaseEntity } from "src/modules/common/types/base.entity";
import { Column, Entity } from "typeorm";

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
  
  }
