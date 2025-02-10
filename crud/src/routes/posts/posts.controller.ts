import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDTO, GetPostItemDTO } from 'src/routes/posts/post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
  }

  @Post()
  @Auth([AuthType.Bearer])
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.createPost(userId, body))
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return new GetPostItemDTO(await this.postsService.getPost(Number(id)))
  }

  @Put(':id')
  @Auth([AuthType.Bearer])
  async updatePost(@Body() body: CreatePostBodyDTO, @Param('id') id: string, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(
      await this.postsService.updatePost({
        postId: Number(id),
        userId,
        body,
      }),
    )
  }

  @Delete(':id')
  @Auth([AuthType.Bearer])
  deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number): Promise<boolean> {
    return this.postsService.deletePost({
      postId: Number(id),
      userId,
    })
  }
}
