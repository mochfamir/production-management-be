import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OperatorService } from './operator.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('operators')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Get()
  @Roles('MANAGER')
  async getOperators() {
    return this.operatorService.getOperators();
  }
}
