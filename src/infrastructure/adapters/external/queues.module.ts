import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageProducer } from './MessageProducer';
import * as AWS from 'aws-sdk';
import { config } from '../../config';
import { MessageHandler } from './MessageConsumer';

AWS.config.update({
    region: config.AWS_REGION, // aws region
    accessKeyId: config.ACCESS_KEY_ID, // aws access key id
    secretAccessKey: config.SECRET_ACCESS_KEY, // aws secret access key
});


@Module({
    imports: [
        SqsModule.register({
            consumers: [
                {
                    name: config.AWS_PEDIDOS_QUEUE, 
                    queueUrl: config.AWS_PEDIDOS_QUEUE_URL,
                    region: config.AWS_REGION,
                },
            ],
            producers: [
                {
                    name: config.AWS_PEDIDOS_RESPONSE_QUEUE, // name of the queue
                    queueUrl: config.AWS_PEDIDOS_RESPONSE_QUEUE_URL, 
                    region: config.AWS_REGION, // url of the queue
                },
            ],
        }),
    ],
    controllers: [],
    providers: [MessageHandler, MessageProducer ],
    exports: [MessageHandler, MessageProducer]
})
export class QueuesModule { }