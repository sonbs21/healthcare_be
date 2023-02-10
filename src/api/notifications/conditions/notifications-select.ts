/* eslint-disable prettier/prettier */
import { Prisma } from '@prisma/client';

export const notificationsSelect: Prisma.NotificationSelect = {
  id: true,
  typeNotification: true,
  isRead: true,
  createdAt: true,
  // images: { select: { url: true } },
  title: true,
  content: true,
};

export const notificationSelect: Prisma.NotificationSelect = {
  id: true,
  typeNotification: true,
  isRead: true,
  createdAt: true,
  content: true,
  // images: { select: { url: true } },
};
