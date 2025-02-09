import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Post()
  @Auth([AuthType.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPost(userId, body)
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id)
  }

  @Put(':id')
  updatePost(@Body() body: any, @Param('id') id: string) {
    return this.postsService.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
