
import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@services";
import { Pagination } from "@types";
import { cleanup } from "@utils";
import { FilterHealthRecordDto } from "./dto";

@Injectable()
export class HealthRecordService {
  constructor(
    private prismaService: PrismaService,
  ) {}
  
  async findHealthRecordWithId(memberId: string, dto: FilterHealthRecordDto){
    try {
        let where:Prisma.ConversationWhereInput = {
            isDeleted:false,
        }

        where.AND = {member:{some:{memberId:memberId}}}

        where = cleanup(where)

        const [total, data] = await this.prismaService.$transaction([
            this.prismaService.healthRecord.count({ where }),
            this.prismaService.healthRecord.findMany({
              where,
              select: {
                id:true,
                // type
              },
              orderBy: {
                createdAt: 'desc',
              },
            }),
          ]);
    } catch (error) {
        
    }
  }

  async findAll( dto: FilterHealthRecordDto, pagination: Pagination){
    try {
        let where:Prisma.ConversationWhereInput = {
            isDeleted:false,
        }

        const { skip, take } = pagination;


        where = cleanup(where)

        const [total, data] = await this.prismaService.$transaction([
            this.prismaService.healthRecord.count({ where }),
            this.prismaService.healthRecord.findMany({
              where,
              select: {
                id:true,
                // type
              },
              orderBy: {
                createdAt: 'desc',
              },
              skip: !dto?.isAll ? skip : undefined,
              take: !dto?.isAll ? take : undefined,
            }),
          ]);
    } catch (error) {
        
    }
  }

  async findOne(id: string) {
    try {
      // const exist = await this.checkFeatureExist({ id });
      // if (!exist) throw new BadRequestException(t(MESS_CODE['FEATURE_NOT_FOUND'], language));

      const data = await this.prismaService.healthRecord.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

}