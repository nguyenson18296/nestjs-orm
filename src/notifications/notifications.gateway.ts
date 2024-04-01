/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure according to your needs
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationGateway');
  @WebSocketServer() wss: Server;

  afterInit(_server: any) {
    this.logger.log('Initialize Gateway!');
  }

  handleConnection(client: any, ..._args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendToAll(msg: any) {
    console.log("notificationData", msg);
    this.wss.emit('notificationToClient', msg);
  }
}
