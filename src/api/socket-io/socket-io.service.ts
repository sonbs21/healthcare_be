/* eslint-disable prettier/prettier */
import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from '@services';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateWayService implements OnModuleInit {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const authToken = socket.handshake.query['Authorization'];
      const user = await this.jwtService.decode(authToken as string);
      if (user?.['id']) {
        const userExist = await this.prismaService.user.findFirst({
          where: {
            id: user['id'],
            isDeleted: false,
          },
        });
        if (userExist) {
          socket.join(userExist.id);
          socket.join(userExist.memberId);
          this.server.to(userExist.id).emit('connection', {
            msg: 'Connect Successfully',
            code: 200,
          });
        } else {
          socket.disconnect();
          this.server.to(socket.id).emit('connection', {
            msg: 'Connect Failed',
            code: 404,
          });
        }
      } else {
        socket.disconnect();
        this.server.to(socket.id).emit('connection', {
          msg: 'Connect Failed',
          code: 404,
        });
      }
    });
  }

  @SubscribeMessage('newMessage')
  async newMessage(@MessageBody() body: { conversationId: string; data: object | object[] | any }) {
    const lstMember = [];
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        id: body.conversationId,
      },
      select: {
        member: true,
      },
    });

    await conversation.member.map((item) => {
      lstMember.push(item.id);
    });

    try {
      lstMember?.forEach((memberId) => {
        this.server.to(memberId).emit('newMessage', {
          msg: 'New messages',
          code: 200,
          data: body.data || {},
        });
      });
    } catch (error) {}
  }

  @SubscribeMessage('newConversation')
  async newConversation(@MessageBody() body: { conversationId: string; data: object | object[] | any }) {
    const lstMember = [];
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        id: body.conversationId,
      },
      select: {
        member: true,
      },
    });

    await conversation.member.map((item) => {
      lstMember.push(item.id);
    });

    try {
      lstMember?.forEach((memberId) => {
        this.server.to(memberId).emit('newConversation', {
          msg: 'New conversation',
          code: 200,
          data: body.data || {},
        });
      });
    } catch (error) {}
  }

  @SubscribeMessage('newNotification')
  async newNotification(@MessageBody() body: { notificationId: string; data: object | object[] | any }) {
    const lstUser = [];
    const notification = await this.prismaService.notification.findFirst({
      where: {
        id: body.notificationId,
      },
      select: {
        userId: true,
      },
    });

    lstUser.push(notification.userId);

    try {
      lstUser?.forEach((userId) => {
        this.server.to(userId).emit('newNotification', {
          msg: 'New conversation',
          code: 200,
          data: body.data || {},
        });
      });
    } catch (error) {}
  }

  // call video
  @SubscribeMessage('call')
  async call(@MessageBody() body: { conversationId: string; callerId: string; calleeId: string }) {
    try {
      const { conversationId, callerId, calleeId } = body;
      // emit signal to callee

      this.server.to(calleeId).emit('incomingCall', {
        conversationId,
        callerId,
      });
    } catch (error) {
      // handle error
      console.log(error);
    }
  }

  @SubscribeMessage('acceptCall')
  async acceptCall(@MessageBody() body: { conversationId: string; callerId: string; calleeId: string }) {
    try {
      const { conversationId, callerId, calleeId } = body;
      // emit signal to caller
      console.log(body);
      this.server.to(callerId).emit('callAccepted', {
        conversationId,
        calleeId,
      });
    } catch (error) {
      // handle error
    }
  }

  @SubscribeMessage('rejectCall')
  async rejectCall(@MessageBody() body: { conversationId: string; callerId: string; calleeId: string }) {
    try {
      const { conversationId, callerId, calleeId } = body;
      // emit signal to caller
      this.server.to(callerId).emit('callRejected', {
        conversationId,
        calleeId,
      });
    } catch (error) {
      // handle error
    }
  }
  @SubscribeMessage('cancelCall')
  async cancelCall(@MessageBody() body: { conversationId: string; callerId: string; calleeId: string }) {
    try {
      const { conversationId, callerId, calleeId } = body;
      // emit signal to callee
      console.log(body);
      this.server.to(calleeId).emit('callCancelled', {
        conversationId,
        callerId,
      });
    } catch (error) {
      // handle error
      console.log(error);
    }
  }
}
