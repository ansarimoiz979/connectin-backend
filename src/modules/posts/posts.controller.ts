import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PostEntity } from './entities/post.entity';
// import { TagEntity } from './entities/tag.entity';
// import { CommentEntity } from './entities/comment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
@ApiBearerAuth()
@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

    @Get()
    async getAll(
      @Query('page') page: number,
      @Query('limit') limit: number,
      @Query('tab') tab = '',
      @Request() req
    // ): Promise<Pagination<PostEntity>> {
      ): Promise<any> {
      return await this.postsService.getAll({ page, limit }, tab, req.user.id);
    }


  //   @Get('tags')
  //   async getTags(@Query('search') search: string): Promise<TagEntity[]> {
  //     return await this.postsService.getTags(search);
  //   }

  //   @Get(':id')
  //   async getByID(@Param('id') id: number): Promise<PostEntity> {
  //     return await this.postsService.getByID(+id);
  //   }
  //   @Get('comments/:id')
  //   async getComments(@Param('id') id: number, @Request() req): Promise<CommentEntity[]> {
  //     return await this.postsService.getComments(+id, req.user.id);
  //   }
  // TODO: need to add likes pagination. on frontend fetch next page when user scrolls to dialog bottom
  //   @Get('likes/:id')
  //   async getLikes(@Param('id') id: number, @Request() req): Promise<UserEntity[]> {
  //     return await this.postsService.getLikes(+id, req.user.id);
  //   }
  //   @Get('tags/:name')
  //   async getTagByName(@Param('name') name: string): Promise<TagEntity> {
  //     return await this.postsService.getTagByName(name);
  //   }

  @ApiOperation({ summary: 'Create new post' })
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreatePostDTO,
    @Request() req,
  ): Promise<PostEntity> {
    return await this.postsService.create(file, payload, req.user.id);
  }

  //   @Patch(':id')
  //   async update(@Param('id') id: number, @Body() postData: UpdatePostDTO): Promise<PostEntity> {
  //     return await this.postsService.update(+id, postData);
  //   }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.postsService.delete(+id);
  }

  //   @Post('share/:id')
  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   async share(@Param('id') id: number, @Request() req): Promise<void> {
  //     return await this.postsService.share(+id, req.user.id);
  //   }

  @Post('like/:id')
  @UseGuards(AuthGuard)
  //   @HttpCode(HttpStatus.NO_CONTENT)
  async toggleLike(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.postsService.toggleLike(+id, req.user.id);
  }

  //   @Post('comment')
  //   async createComment(@Body() payload: CreateCommentDTO, @Request() req): Promise<CommentEntity> {
  //     return await this.postsService.createComment(payload, req.user.id);
  //   }
  //   @Patch('comment/:id')
  //   async updateComment(@Param('id') id: number, @Body('text') text: string): Promise<CommentEntity> {
  //     return await this.postsService.updateComment(+id, text);
  //   }
  //   @Delete('comment/:id')
  //   async deleteComment(@Param('id') id: number): Promise<void> {
  //     return await this.postsService.deleteComment(+id);
  //   }
  //   @Post('comment/like/:id')
  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   async toggleCommentLike(@Param('id') id: number, @Request() req): Promise<void> {
  //     return await this.postsService.toggleCommentLike(+id, req.user.id);
  //   }
}
