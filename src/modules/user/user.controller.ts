import { Controller,Request, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserService } from './user.service';
import { FollowingEntity } from './entities/following.entity';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get self details' })
  // @UseGuards( AuthGuard )
  @Get('self-detail')
  selfUserDetails( @Request() req) {
    // let id = req.user.id
    return this.userService.findSelfDetailsById(4, true);
  }

  @ApiOperation({ summary: 'see other user details' })
  //get other person details without personal data
  @Get('user-detail')
  otherUserDetails( @Request() req, @Query('id') userId: number,) {
    return this.userService.findSelfDetailsById(userId, false);
  }

  //@pending
  @ApiOperation({ summary: 'get all user list with pagination by admin' })
  //only admin can check
  // @UseGuards( AuthGuard )
  //role guard for admin
  @Get('user-list')
  userList( 
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req
  ) {
    // let id = req.user.id
    // return this.userService.findSelfUser(id);
  }
  
  @ApiOperation({ summary: 'search user by name email username by anyone' })
  //search user in search box
  // @UseGuards( AuthGuard )
  @Get('search-user')
  async getAll(    @Query('page') page: number,
  @Query('limit') limit: number,@Query('search') search: string, @Request() req): Promise<any[]> {
    return await this.userService.getAll(search, 1);
    //@pending
    // return await this.userService.getAll(search, req.user.id);
  }

  // @Get('self')
  // async getSelf(@Request() req): Promise<UserEntity> {
  //   return await this.userService.getByID(req.user.id);
  // }

  // @Get('suggestions')
  // async getSuggestions(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Request() req
  // ): Promise<UserSuggestion[]> {
  //   return await this.userService.getSuggestions(page, limit, req.user.id);
  // }

  // @Get('recent-search')
  // async getRecentSearch(@Request() req): Promise<(UserEntity | TagEntity)[]> {
  //   return await this.userService.getRecentSearch(req.user.id);
  // }
  // @Post('recent-search')
  // async addRecentSearch(@Body('id') id: number, @Body('type') type: 'user' | 'tag', @Request() req): Promise<number> {
  //   return await this.userService.addRecentSearch(+id, type, req.user.id);
  // }

  // @Delete('recent-search/:id')
  // async removeRecentSearch(@Param('id') id: number): Promise<void> {
  //   return await this.userService.removeRecentSearch(+id);
  // }

  @ApiOperation({ summary: 'check if username is available or not' })
  // @Public()
  @Get('is-username-taken')
  async isUsernameTaken(@Query('username') username: string): Promise<boolean> {
    return await this.userService.isUsernameTaken(username);
  }

  @ApiOperation({ summary: 'check if email is already register or not' })
  // @Public()
  @Get('is-email-taken')
  async isEmailTaken(@Query('email') email: string): Promise<boolean> {
    return await this.userService.isEmailTaken(email);
  }

  // @ApiOperation({ summary: 'upload/change user profile image/avtar' })
  // @Post('avatar')
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<PublicFileEntity> {
  //   return await this.userService.setUserImage(file, 'avatar', req.user.id);
  // }

  @ApiOperation({ summary: 'get profile details by username' })
  @Get(':username')
  async getProfileByUsername(@Param('username') username: string, @Request() req): Promise<any> {
    //@pending
    // return await this.userService.getProfileByUsername(username, req.user.id);
    return await this.userService.getProfileByUsername(username, 1);
  }

  // @ApiOperation({ summary: 'Update self profile details' })
  // @Patch(':id')
  // async update(@Param('id') id: number, @Body() payload: Partial<UserEntity>): Promise<UserEntity> {
  //   return await this.userService.update(+id, payload);
  // }

  
  @ApiOperation({ summary: 'follow a user' })
  @Post('follow/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async follow(@Param('id') id: number, @Request() req): Promise<any> {
    // return await this.userService.follow(+id, req.user.id);
    return await this.userService.follow(+id, 1);
  }

  @ApiOperation({ summary: 'follow a user' })
  @Post('unfollow/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.userService.unfollow(+id, req.user.id);
  }

  @ApiOperation({ summary: 'find self followers' })
  @Post('followers/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async getUserFollowers(@Param('id') id: number):  Promise<FollowingEntity[]> {
    return await this.userService.getUserFollowers(+id);
  }


}


