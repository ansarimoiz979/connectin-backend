import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly users: Repository<UserEntity>
    ){

    }

    async create(payload: CreateUserDTO): Promise<UserEntity> {
        
        const isUserAlreadyExist = await this.users.findOne({ where: { email: payload.email } });
        if (isUserAlreadyExist) throw new HttpException('USER_ALREADY_EXIST', HttpStatus.BAD_REQUEST);
    
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
        const userDetails = await this.users.findOne({ where: { email: email, password : password } });
        if (!userDetails) throw new HttpException('USER_DOESNOT_EXIST', HttpStatus.BAD_REQUEST);
        return userDetails
      }

      // async getByID(id: number, options: FindOneOptions<UserEntity> = {}): Promise<UserEntity> {
      //   return await this.users.findOne(id, options);
      // }


      
  async findSelfDetailsById(userid, forSelf ) {
      if(forSelf)
      {
        const query = await this.users.createQueryBuilder();
        query.where({ id : userid }).select([ "name", "username", "email", "id"])
        let userDetails = await query.getOne()
        if (!userDetails) throw new HttpException('USER_DOESNOT_EXIST', HttpStatus.BAD_REQUEST);
        return userDetails  
      }else{
        const query = await this.users.createQueryBuilder();
        query.where({ id : userid }).select([ "name", "username", "email", "id"])
        let userDetails = await query.getOne()
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

    return searchResult;
  }
}
