import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dto';
import { FollowingEntity } from './entities/following.entity';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly users: Repository<UserEntity>,
        @InjectRepository(FollowingEntity)
        private readonly userFollowings: Repository<FollowingEntity>,
    ){

    }

    async create(payload: CreateUserDTO): Promise<UserEntity> {
        console.log("create");
        
        const isUserAlreadyExist = await this.users.findOne({ where: { email: payload.email } });
        if (isUserAlreadyExist) throw new HttpException('USER_ALREADY_EXIST', HttpStatus.BAD_REQUEST);
        payload.password =   await bcrypt.hash(payload.password, 10);
        console.log("payload", payload)
        const user = await this.users.create(payload);
        return await this.users.save(user);
      }

      async setHashedRefreshToken(id: number, hashedRefreshToken: string): Promise<void> {
        await this.users.update(id, {
          hashedRefreshToken,
        });
      }

      async findUserByEmailAndPassword(email , password)
      {
        const userDetails = await this.users.findOne({ where: { email: email} });
        if (!userDetails) throw new HttpException('USER_DOESNOT_EXIST', HttpStatus.BAD_REQUEST);
        const isMatch = await bcrypt.compare(password, userDetails.password);
        if (!isMatch) throw new HttpException('INVALID_PASSWORD', HttpStatus.BAD_REQUEST);
        return userDetails
      }

      async getByID(id: number, options: FindOneOptions<UserEntity> = {}): Promise<UserEntity> {
        // return await this.users.findOne(id, options);
        return await this.users.findOne({ where : {  id : id}});
      }


      
  async findSelfDetailsById(userid, forSelf ) {
      if(forSelf)
      {
        const userDetails =await this.users.findOne({where : { id : 1 },  select :[ "name", "username", "email", "id"] })
        console.log("data" , userDetails);        
        if (!userDetails) throw new HttpException('USER_DOESNOT_EXIST', HttpStatus.BAD_REQUEST);
        return userDetails  
      }else{
        const userDetails =await this.users.findOne({where : { id : 1 },  select :[ "name", "username", "email", "id"] })
        console.log("data" , userDetails);        
        if (!userDetails) throw new HttpException('USER_DOESNOT_EXIST', HttpStatus.BAD_REQUEST);
        return userDetails  

      }
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { username } });
    return Boolean(user);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.users.findOne({ where: { email } });
    return Boolean(user);
  }

  async getProfileByUsername(username: string, currentUserID: number): Promise<UserEntity> {
    const user = await this.users
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      // .leftJoinAndSelect('user.avatar', 'avatar')
      // .leftJoinAndSelect('user.posts', 'posts')
      // .leftJoinAndSelect('posts.file', 'file')
      // .leftJoinAndSelect('posts.tags', 'tags')
      // .leftJoinAndSelect('posts.likes', 'likes')
      // .orderBy('posts.createdAt', 'DESC')
      .getOneOrFail();

    // const formattedPosts = await Promise.all(
    //   user.posts.map(async (p) => {
    //     return {
    //       ...p,
    //       isViewerLiked: await this.postsService.getIsUserLikedPost(user, p),
    //     };
    //   })
    // );
    return {
      ...user,
      // isViewerFollowed: await this.getIsUserFollowed(user.id, currentUserID),
      isViewerBlocked: false,
      // posts: formattedPosts,
    } as unknown as UserEntity;
  }

  // async update(id: number, payload: Partial<UserEntity>): Promise<UserEntity> {
  //   const toUpdate = await this.users.findOneOrFail(id);
  //   const user = this.users.create({ ...toUpdate, ...payload });
  //   return await this.users.save(user);
  // }

  async getAll(search: string, currentUserID: number): Promise<UserEntity[]> {
    if (!search.length)
      return this.users.find({
        where: {
          id: Not(currentUserID),
        },
        take: 10,
      });

    const searchResult = await this.users
      .createQueryBuilder()
      .select()
      .where('username ILIKE :search', { search: `%${search}%` })
      .orWhere('name ILIKE :search', { search: `%${search}%` })
      .orWhere('email ILIKE :search', { search: `%${search}%` })
      .getMany();
    const currentUserIndexInSearchResult = searchResult.findIndex((u) => u.id === currentUserID);
    if (currentUserIndexInSearchResult !== -1) searchResult.splice(currentUserIndexInSearchResult, 1);
      if(searchResult.length == 0)
      {
        //@pending for not matched found s
        return searchResult
      }
    return searchResult;
  }

  async follow(targetID: number, currentUserID: number): Promise<any> {
    //check is already followed by currentuser
    const isFollowing = Boolean(await this.getUserFollowedEntity(  targetID , currentUserID))
    // const isfollower = Boolean(await this.userFollowings
    //   .createQueryBuilder('follow')
    //   .where('follow.user.id = :currentUserID', { currentUserID })
    //   .andWhere('follow.target.id = :targetID', { targetID })
    //   .getOne());
    console.log("isFollowing",isFollowing);
    
      if(isFollowing) 
      { throw new HttpException('USER_IS_ALREADY_FOLLOWED_BY_YOU', HttpStatus.BAD_REQUEST);
      }else{
    // const isfollower = await this.userFollowings.find({ where : { user.id : currentUserID , target.id : targetID } }) 
    const target = await this.users.findOneOrFail({ where : {  id : targetID} });
    const user = await this.users.findOneOrFail({ where : {  id : currentUserID }});
    await this.userFollowings.save({
      user,
      target,
    });
    return {
      status : true,
      message : "USER_fOLLOWED"
    }
  }
    // await this.notificationsService.create({
    //   type: NotificationTypes.FOLLOWED,
    //   receiverUserID: targetID,
    //   initiatorUserID: currentUserID,
    // });
  }
  async unfollow(targetID: number, userID: number): Promise<void> {
    const following = await this.getUserFollowedEntity(targetID, userID);
    if (following) {
      await this.userFollowings.delete(following.id);
      // await this.notificationsService.deleteLastByInitiatorID(userID, targetID);
    }
  }

  async getUserFollowedEntity(targetID: number, userID: number): Promise<FollowingEntity> {
    return await this.userFollowings
      .createQueryBuilder('follow')
      .where('follow.user.id = :userID', { userID })
      .andWhere('follow.target.id = :targetID', { targetID })
      .getOne();
  }

  async getUserFollowers(userID: number): Promise<FollowingEntity[]> {
    return await this.userFollowings
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.user', 'user')
      .andWhere('follow.target.id = :userID', { userID })
      .getMany();
  }

}
