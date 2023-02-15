import { Prisma } from '@prisma/client';

export const doctorsSelect: Prisma.DoctorSelect = {
  id: true,
  fullName: true,
  gender: true,
  dateOfBirth: true,
  address: true,
  email: true,
  avatar: true,
  description: true,
  experience: true,
  workPlace: true,
  phone: true,
  specialize: true,
  user: {
    select: {
      id: true,
      phone: true,
    },
  },
  patient: true,
  createdAt: true,
};
