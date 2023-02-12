import { Prisma } from '@prisma/client';

export const patientSelect: Prisma.PatientSelect = {
  id: true,
  fullName: true,
  gender: true,
  dateOfBirth: true,
  address: true,
  avatar: true,
  job: true,
  insuranceNumber: true,
  state: true,
  medicalHistory: true,
  phone: true,
  user: {
    select: {
      id: true,
      phone: true,
    },
  },
  doctor: {
    select: {
      id: true,
      fullName: true,
    },
  },
  createdAt: true,
};
