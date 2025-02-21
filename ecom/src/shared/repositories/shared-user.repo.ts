import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(uniqueObject: { email: string } | { id: number }) {
    return this.prismaService.user.findUnique({
      where: { ...uniqueObject },
    })
  }
}
