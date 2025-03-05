import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';

// decorators contains some meta-data about module
@Module({
  imports: [UserModule, BookmarkModule],
})
export class AppModule {}
