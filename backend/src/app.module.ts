import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { MatchesModule } from './matches/matches.module';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { Match } from './matches/match.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'grobar',
      password: process.env.DB_PASSWORD || 'partizan1945',
      database: process.env.DB_NAME || 'partizanizam_db',
      entities: [User, Post, Match],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    MatchesModule,
  ],
})
export class AppModule {}