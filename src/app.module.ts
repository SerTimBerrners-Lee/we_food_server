import { join } from "path";
import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import { User } from "./user/user.model";
import { ProductLine } from "./product_line/product_line.model";
import { Order } from "./order/order.model";
import { UserModule } from "./user/user.module";
import { ProductLineModule } from "./product_line/product_line.module";
import { OrderModule } from "./order/order.module";
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { BidModule } from './bid/bid.module';
import { DishesModule } from './dishes/dishes.module';
import { StageModule } from './stage/stage.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { Stage } from "./stage/stage.model";
import { StageDishes } from "./stage/stage-dishes.motel";
import { Dishes } from "./dishes/dishes.model";
import { SmsModule } from "./sms/sms.module";
import { PromoModule } from './promo/promo.module';
import { Promo } from "./promo/promo.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist/static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'npo',
      password: '5513',
      database: 'we_food',
      models: [
        User,
        ProductLine,
        Order,
        Stage,
        StageDishes,
        Dishes,
        Promo
      ],
      autoLoadModels: true,
    }),

    AuthModule,
    UserModule,
    ProductLineModule,
    OrderModule,
    MailModule,
    BidModule,
    DishesModule,
    StageModule,
    KitchenModule,
    SmsModule,
    PromoModule
  ],
})
export class AppModule {}
